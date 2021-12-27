import EventEmitter from 'component-emitter';
import sift from 'sift';
import { sorter, select, AdapterService } from '@feathersjs/adapter-commons';
import { _, hooks, stripSlashes } from '@feathersjs/commons';
import errors from '@feathersjs/errors';
import ls from 'feathers-localstorage';
import lf from '@feathersjs-offline/localforage';
import { genUuid, to, OptionsProxy, stringsToDates } from '../common';
import snapshot from '../snapshot';


const debug = require('debug')('@feathersjs-offline:ownclass:service-base');

const defaultOptions = {
  'id': 'id',
  'store': null,
  'storage': null,
  'useShortUuid': true,
  'timedSync': 24*60*60*1000,
  'adapterTest': false,
  'matcher': sift,
  sorter,
  'fixedName': '',
  dates: false,
  'myUpdatedAt': 'updatedAt',
  'myOnServerAt': 'onServerAt',
  'myDeletedAt': 'deletedAt',
  'myUuid': 'uuid'

};

const BOT = new Date(0);

const syncDB = '___SyncDB___';

let _adapterTestStrip = ['uuid', 'updatedAt', 'onServerAt', 'deletedAt'];

let nameIx = 0;

const attrStrip = (...attrToStrip) => {
  const removeProperty = (target, propertyToRemove) => {
    const { [propertyToRemove]: _, ...newTarget } = target;
    return newTarget;
  };

  const stripOnce = (obj, attrToStrip) =>
    attrToStrip.reduce((prev, cur) => removeProperty(prev, cur), obj);
  
  return (obj) => {
    if (Array.isArray(obj))
      return obj.map(o => stripOnce(o, attrToStrip));
    else
      return stripOnce(obj, attrToStrip);
  };
}

class OwnClass extends AdapterService {
  constructor (opts) {
    const newOpts = Object.assign({}, defaultOptions, opts);

    debug(`Constructor started, newOpts = ${JSON.stringify(newOpts)}`);
    super(newOpts);

    this.wrapperOptions = Object.assign({}, newOpts, this.options);
    debug(`Constructor ended, options = ${JSON.stringify(this.options)}`);

    this.type = 'own-class';

    _adapterTestStrip = [ this.myUuid, this.myUpdatedAt, this.myOnServerAt, this.myDeletedAt ];

    debug('  Done.');
    return this;
  }

  async _setup (app, path) {  // This will be removed for future versions of Feathers
    debug(`_SetUp('${path}') started`);
    return this.setup(app, path);
  }

  async setup (app, path) {
    debug(`SetUp('${path}') started`);
    if (this._setupPerformed) { // Assure we only run setup once
      return;
    }
    this._setupPerformed = true;

    this.options = this.wrapperOptions;

    this.myUuid = this.options.myUuid;
    this.myUpdatedAt = this.options.myUpdatedAt;
    this.myOnServerAt = this.options.myOnServerAt;
    this.myDeletedAt = this.options.myDeletedAt;


    let self = this;
    this.thisName = this.options.fixedName !== '' ? this.options.fixedName : `${this.type}_offline_${nameIx++}_${path}`;

    // Now we are ready to define the path with its underlying service (the remoteService)
    let old = app.service(path);
    if (old !== self) {
      this.remoteService = old; // We want to get the default service (redirects to server or points to a local service)
      app.use(path, self);  // Install this service instance
    }

    // Get the service name and standard settings
    this.name = path;

    // Construct the two helper services
    this.localServiceName = this.thisName + '_local';
    this.localServiceQueue = this.thisName + '_queue';

    this.storage = this.options.storage ? this.options.storage : ['LOCALSTORAGE'];

    if (typeof this.storage === 'string' && this.storage.toUpperCase() === 'ASYNCSTORAGE') {
      this.storage = global.AsyncStorage;
      this.storageDriver = ls;
    }
    else {
      this.storageDriver = lf;
    }

    this.localSpecOptions = { name: this.localServiceName, storage: this.storage, store: this.options.store, reuseKeys: this.options.fixedName !== '' };
    let localOptions = Object.assign({}, this.options, this.localSpecOptions);
    let queueOptions = { id: 'id', name: this.localServiceQueue, storage: this.storage, paginate: null, multi: true, reuseKeys: this.options.fixedName !== '' };

    app.use(this.localServiceName, this.storageDriver(localOptions));
    app.use(this.localServiceQueue, this.storageDriver(queueOptions));

    this.localService = app.service(this.localServiceName);
    this.localQueue = app.service(this.localServiceQueue);

    let err1 = null, res=null;

    // Now we need to setup the DB for synchronization timestamps
    app.use(syncDB, this.storageDriver({ id: 'id', name: syncDB, storage: this.storage, paginate: null, reuseKeys: true }));
    this.syncDB = app.service(syncDB);

    // We need to make sure that localService is properly initiated - make a dummy search
    //    (one of the quirks of feathers-localstorage)
    if (this.storageDriver === ls) await this.localService.ready();

    // The initialization/setup of the localService adapter screws-up our options object
    this.options = this.wrapperOptions;

    // Are we running adapterTests?
    if (this.options.adapterTest) {
      // Make sure the '_adapterTestStrip' attributes are stripped from results
      // However, we need to allow for having uuid as key
      let stripValues = Object.assign([], _adapterTestStrip);
      let idIx = stripValues.findIndex(v => {return v===self.id});
      if (idIx > -1)  stripValues.splice(idIx, 1);
      this._strip = attrStrip(...stripValues);
    }
    else {
      this._strip = v => { return v };
    }

    // Make sure we always select the key (id) in our results
    this._select = (params, ...others) => (res) => { return select(params, ...others, self.id)(res) }

    this._dates = this.options.dates || false;

    // Initialize the service wrapper
    this.listening = false;
    this.aIP = 0; // Our semaphore for internal processing
    this.pQActive = false; // Our flag for avoiding more than one processing of queued operations at a time

    // Determine latest registered sync timestamp
    debug(`  Determine latest registered sync timestamp (if any)...`);
    this.syncedAt = await this.getSyncedAt(false);
    await this.writeSyncedAt(this.syncedAt, false);

    // The initialization/setup of the localService adapter screws-up our options object
    this.options = this.wrapperOptions;

    // This is necessary if we get updates to options (e.g. .options.multi = ['patch'])
    if (!(this.remoteService instanceof AdapterService)) {
      debug(`  Listen for updates to wrapped service options...`);
      this._listenOptions();
    }

    // Make sure that the wrapped service is setup correctly
    if (typeof this.remoteService.setup === 'function') {
      debug(`  Calling setup() of wrapped service...`);
      this.remoteService.setup(app, path);
    }

    // Should we perform a sync every timedSync?
    if (this.options.timedSync && Number.isInteger(this.options.timedSync) && this.options.timedSync > 0) {
      debug(`  Setup timed synchronization every ${self.options.timedSync} ms...`);
      this._timedSyncHandle = setInterval(() => self.sync(), self.options.timedSync);
    }

    debug('Done.');
    return true;
  }

  async getSyncedAt (bFailOnNotFound = true) {
    const key = `${this.name}_${syncDB}`;

    let [err, res] = await to( this.syncDB.get(key) );

    if (err && bFailOnNotFound) throw new errors.NotFound(`Failed to find sync key=${key}. err=${err.name}, ${err.message}`);

    return (res && res.value) || BOT.toISOString();
  }

  async writeSyncedAt (value, bFailOnNotFound = true) {
    const key = `${this.name}_${syncDB}`;

    const old = await this.getSyncedAt(bFailOnNotFound)
      .catch(_err => {
        throw new errors.NotFound(`Failed to find sync key=${key} at write. err=${_err.name}, ${_err.message}`);
      })
      .then(_ => {
        this.syncDB.create({ id: key, value })
          .catch(_err => {
            throw new errors.NotFound(`Failed to write syncedAt key=${key}. err=${_err.name}, ${_err.message}`);
          })
          .then(_ => old);
      })

    return old;
  }

  _listenOptions () {
    // This is necessary if we get updates to options (e.g. .options.multi = ['patch'])

    let self = this;
    let optProxy = new OptionsProxy(self.thisName);

    this.options = optProxy.observe(Object.assign(
      {},
      self.remoteService.options ? self.remoteService.options : {},
      self.options
    ));
    optProxy.watcher(() => {
      // Update all changes to 'this.options' in both localService and remoteService
      self.remoteService.options = Object.assign({}, self.remoteService.options, self.options);
      self.localService.options = Object.assign({}, self.options, self.localSpecOptions);
    });

  }

  async getEntries (params) {
    debug(`Calling getEntries(${JSON.stringify(params)}})`);
    let res = [];
    try {
      await this.localService.getEntries(params)
        .then(entries => {
          res = entries
        });
    } catch (err) {
      debug(`ERROR: getEntries(${JSON.stringify(params)}), err=${err.name} ${err.message}`);
    }
    return Promise.resolve(res)
      .then(this._strip)
      .then(this._select(params))
      .then(stringsToDates(this._dates));
  }

  async get (id, params) {
    debug(`Calling get(${JSON.stringify(id)}, ${JSON.stringify(params)}})`);
    return this._get(id, params);
  }

  async _get (id, params) {
    debug(`Calling _get(${JSON.stringify(id)}, ${JSON.stringify(params)}})`);
    return await this.localService.get(id, params)
      .then(this._strip)
      .then(this._select(params))
      .catch(err => {throw err});
  }

  async find (params) {
    debug(`Calling find(${JSON.stringify(params)}})`);
    debug(`  rows=${JSON.stringify(await this.getEntries())}`);
    return this._find(params);
  }

  async _find (params) {
    debug(`Calling _find(${JSON.stringify(params)}})`);
    return this.localService.find(params)
      .then(this._strip)
      .then(this._select(params))
      .then(stringsToDates(this._dates));
  };

  async create (data, params) {
    debug(`Calling create(${JSON.stringify(data)}, ${JSON.stringify(params)})`);
    if (Array.isArray(data) && !this.allowsMulti('create')) {
      return Promise.reject(new errors.MethodNotAllowed('Creating multiple without option \'multi\' set'));
    }

    return this._create(data, params);
  }

  async _create (data, params, ts = 0) {
    debug(`Calling _create(${JSON.stringify(data)}, ${JSON.stringify(params)}, ${ts})`);
    let self = this;
    if (Array.isArray(data)) {
      const multi = this.allowsMulti('create');
      if (!multi) {
        return Promise.reject(new errors.MethodNotAllowed('Creating multiple without option \'multi\' set'));
      }

      let timestamp = new Date();
      // In future version we will user Promise.allSettled() instead...
      return Promise.all(data.map(current => self._create(current, params, timestamp)));
    }

    ts = ts || new Date();

    let newData = clone(data);

    // As we do not know if the server is connected we have to make sure the important
    // values are set with reasonable values
    if (!(this.myUuid in newData)) {
      newData[this.myUuid] = genUuid(this.options.useShortUuid);
    }

    if (!(this.myUpdatedAt in newData)) {
      newData[this.myUpdatedAt] = ts;
    }

    // We do not allow the client to set the onServerAt attribute to other than default '0'
    newData[this.myOnServerAt] = BOT;

    // Is uuid unique?
    let [err, res] = await to(this.localService.find({ query: { [this.myUuid]: newData[this.myUuid] } }));
    if (res && res.length) {
      throw new errors.BadRequest(`Optimistic create requires unique uuid. (${this.type}) res=${JSON.stringify(res)}`);
    }

    // We apply optimistic mutation
    let newParams = clone(params);
    this.disallowInternalProcessing('_create');
    let queueId = await this._addQueuedEvent('create', newData, clone(newData), params);

    // Start actual mutation on remote service
    [err, res] = await to(this.localService.create(newData, clone(params)));
    if (res) {
      this.remoteService.create(res, clone(params))
        .then(async rres => {
          await to(self._removeQueuedEvent('_create0', queueId, newData, newData[this.myUpdatedAt]));
          await self._patchIfNotRemoved(rres[self.id], rres);

          // Ok, we have connection - empty queue if we have any items queued
          self.allowInternalProcessing('_create0');
          await to( self._processQueuedEvents() );
        })
        .catch(async rerr => {
          if (rerr.name !== 'Timeout') {
            // Let's silently ignore missing connection to server -
            // we'll catch-up next time we get a connection
            // In all other cases do the following:
            await to(self._removeQueuedEvent('_create1', queueId, rerr.message/*newData*/, newData[this.myUpdatedAt]));
            await to(self.localService.remove(res[self.id], params));
          }

          self.allowInternalProcessing('_create1');
        });
    }
    else {
      await to(this._removeQueuedEvent('_create2', queueId, newData, newData[this.myUpdatedAt]));
      this.allowInternalProcessing('_create2');
      throw err;
    }

    return Promise.resolve(res)
      .then(this._strip)
      .then(this._select(params))
      .then(stringsToDates(this._dates));
  }

  async update (id, data, params) {
    debug(`Calling update(${id}, ${JSON.stringify(data)}, ${JSON.stringify(params)}})`);
    if (id === null || Array.isArray(data)) {
      return Promise.reject(new errors.BadRequest(
        `You can not replace multiple instances. Did you mean 'patch'?`
      ));
    }

    return this._update(id, data, params);
  }

  async _update (id, data, params = {}) {
    debug(`Calling _update(${id}, ${JSON.stringify(data)}, ${JSON.stringify(params)}})`);
    let self = this;

    if (id === null || Array.isArray(data)) {
      return Promise.reject(new errors.BadRequest(
        `You can not replace multiple instances. Did you mean 'patch'?`
      ));
    }

    let [err, res] = await to(this.localService._get(id));
    if (!(res && res !== {})) {
      throw new errors.NotFound(`Trying to update non-existing ${this.id}=${id}. (${this.type}) err=${JSON.stringify(err.name)}`);
    }

    // We don't want our uuid to change type if it can be coerced
    const beforeRecord = clone(res);
    const beforeUuid = beforeRecord[this.myUuid];

    let newData = clone(data);
    newData[this.myUuid] = beforeUuid; // eslint-disable-line
    newData[this.myUpdatedAt] = new Date();
    newData[this.myOnServerAt] = BOT;

    // Optimistic mutation
    this.disallowInternalProcessing('_update');
    let queueId = await this._addQueuedEvent('update', newData, id, clone(newData), params);

    // Start actual mutation on remote service
    [err, res] = await to(this.localService.update(id, newData, clone(params)));
    if (!err) {
      this.remoteService.update(id, res, clone(params))
        .then(async rres => {
          await to(self._removeQueuedEvent('_update0', queueId, newData, res[this.myUpdatedAt]));
          await self._patchIfNotRemoved(rres[self.id], rres)

          self.allowInternalProcessing('_update0');
          await to( self._processQueuedEvents() );
        })
        .catch(async rerr => {
          if (rerr.name === 'Timeout') {
            debug(`_update TIMEOUT: ${rerr.name}, ${rerr.message}`);
            // Let's silently ignore missing connection to server
            // We'll catch-up next time we get a connection
          } else {
            debug(`_update ERROR: ${rerr.name}, ${rerr.message}`);
            await to(self._removeQueuedEvent('_update1', queueId, newData, res[this.myUpdatedAt]));
            await to(self.localService.patch(id, beforeRecord));
          }
          self.allowInternalProcessing('_update1');
        });
    }
    else {
      await to(this._removeQueuedEvent('_update2', queueId, newData, newData[this.myUpdatedAt]));
      this.allowInternalProcessing('_update2');
      throw err;
    }

    return Promise.resolve(newData)
      .then(this._strip)
      .then(this._select(params))
      .then(stringsToDates(this._dates));
  }

  async patch (id, data, params) {
    debug(`Calling patch(${id}, ${JSON.stringify(data)}, ${JSON.stringify(params)}})`);
    if (id === null && !this.allowsMulti('patch')) {
      return Promise.reject(new errors.MethodNotAllowed(`Can not patch multiple entries`));
    }

    return this._patch(id, data, params);
  }

  async _patch (id, data, params = {}, ts = 0) {
    debug(`Calling _patch(${id}, ${JSON.stringify(data)}, ${JSON.stringify(params)}})`);
    let self = this;
    if (id === null) {
      const multi = this.allowsMulti('patch');
      if (!multi) {
        throw new errors.MethodNotAllowed('Patching multiple without option \'multi\' set');
      }

      return this.find(params).then(page => {
        const res = page.data ? page.data : page;
        if (!Array.isArray(res)) {
          res = [ res ];
        }

        let timestamp = new Date().toISOString();
        return Promise.all(res.map(
          current => self._patch(current[self.id], data, params, timestamp))
        );
      });
    }

    ts = ts || new Date();

    let [err, res] = await to(this.localService._get(id));
    if (!(res && res !== {})) {
      throw err;
    }

    // Optimistic mutation
    const beforeRecord = clone(res);
    const newData = Object.assign({}, beforeRecord, data);
    newData[this.myOnServerAt] = BOT;
    newData[this.myUpdatedAt] = ts;
    this.disallowInternalProcessing('_patch');
    const queueId = await this._addQueuedEvent('patch', newData, id, clone(newData), params);

    // Start actual mutation on remote service
    [err, res] = await to(this.localService.patch(id, newData, clone(params)));
    if (res) {
      this.remoteService.patch(id, res, clone(params))
        .then(async rres => {
          await to(self._removeQueuedEvent('_patch0', queueId, rres, res[this.myUpdatedAt]));
          await self._patchIfNotRemoved(rres[self.id], rres);

          self.allowInternalProcessing('_patch0');
          await to( self._processQueuedEvents() );
        })
        .catch(async rerr => {
          if (rerr.name === 'Timeout') {
            debug(`_patch TIMEOUT: ${rerr.name}, ${rerr.message}`);
            // Let's silently ignore missing connection to server
            // We'll catch-up next time we get a connection
          } else {
            debug(`_patch ERROR: ${rerr.name}, ${rerr.message}`);
            await to(self._removeQueuedEvent('_patch1', queueId, newData, res[this.myUpdatedAt]));
            await to(self.localService.patch(id, beforeRecord));
          }
          self.allowInternalProcessing('_patch1');
        });
    }
    else {
      await to(this._removeQueuedEvent('_patch2', queueId, newData, newData[this.myUpdatedAt]));
      this.allowInternalProcessing('_patch2');
      throw err;
    }

    return Promise.resolve(newData)
      .then(this._strip)
      .then(this._select(params))
      .then(stringsToDates(this._dates));
  }

  /**
   * An internal method to patch a localService record if and only if
   * we have not been overtaken by a remove request.
   *
   * @param {any} id
   * @param {any} data
   */
  async _patchIfNotRemoved (id, data) {
      return this.localService.patch(id, data)
        .catch(_ => Promise.resolve(true));
  }

  async remove (id, params) {
    debug(`Calling remove(${id}, ${JSON.stringify(params)}})`);
    if (id === null && !this.allowsMulti('remove')) {
      return Promise.reject(new errors.MethodNotAllowed(`Can not remove multiple entries`));
    }

    return this._remove(id, params);
  }

  async _remove (id, params = {}) {
    debug(`Calling _remove(${id}, ${JSON.stringify(params)}})`);
    let self = this;

    if (id === null) {
      const multi = this.allowsMulti('remove');
      if (!multi) {
        throw new errors.MethodNotAllowed('Removing multiple without option \'multi\' set');
      }
      return this.find(params).then(page => {
        const res = page.data ? page.data : page;
        if (!Array.isArray(res)) {
          res = [res];
        }

        return Promise.all(res.map(
          current => self._remove(current[self.id], params))
        );
      });
    }

    let [err, res] = await to(this.localService._get(id));
    if (!(res && res !== {})) {
      throw new errors.BadRequest(`Trying to remove non-existing ${this.id}=${id}. (${this.type}) err=${JSON.stringify(err)}, res=${JSON.stringify(res)}`);
    }

    // Optimistic mutation
    const beforeRecord = clone(res);
    this.disallowInternalProcessing('_remove');
    const queueId = await this._addQueuedEvent('remove', beforeRecord, id, params);

    // Start actual mutation on remote service
    [err, res] = await to(this.localService.remove(id, clone(params)));
    if (!err) {
      this.remoteService.remove(id, clone(params))
        .then(async rres => {
          await to(self._removeQueuedEvent('_remove0', queueId, beforeRecord, null));
          self.allowInternalProcessing('_remove0');
          await to( self._processQueuedEvents() );
        })
        .catch(async rerr => {
          if (rerr.name === 'Timeout') {
            debug(`_remove TIMEOUT: ${rerr.name}, ${rerr.message}`);
          } else {
            debug(`_remove ERROR: ${rerr.name}, ${rerr.message}\nbeforeRecord = ${JSON.stringify(beforeRecord)}`);
            // if (beforeRecord.onServerAt === BOT) {
              // In all likelihood the document/item was never on the server
              // so we choose to silently ignore this situation
            // } else {
              // We have to restore the record to  the local DB
              await to(self._removeQueuedEvent('_remove1', queueId, beforeRecord, null));
              await to(self.localService.create(beforeRecord, null));
            // }
          }
          self.allowInternalProcessing('_remove1');
        });
    }
    else {
      await to(this._removeQueuedEvent('_remove2', queueId, beforeRecord, null));
      this.allowInternalProcessing('_remove2');
      throw err;
    }

    return Promise.resolve(beforeRecord)
      .then(this._strip)
      .then(this._select(params))
      .then(stringsToDates(this._dates));
  }

  // Allow access to our internal services (for application hooks and the demo). Use with care!
  get remote () {
    return this.remoteService;
  }

  set remote (value) { // Do not allow reassign
    throw new errors.Forbidden(`You cannot change value of remote!`);
  }

  get local () {
    return this.localService;
  }

  set local (value) { // Do not allow reassign
    throw new errors.Forbidden(`You cannot change value of local!`);
  }

  get queue () {
    return this.localQueue;
  }

  set queue (value) { // Do not allow reassign
    throw new errors.Forbidden(`You cannot change value of queue!`);
  }

  /* Queue handling */

  /**
   * Allow queue processing (allowed when semaphore this.aIP === 0)
   */
  allowInternalProcessing (from) {
    debug(`allowInternalProcessing: ${from} ${this.thisName} ${this.aIP-1}`);
    this.aIP--;
  }
  /**
   * Disallow queue processing (when semaphore this.aIP !== 0)
   */
  disallowInternalProcessing (from) {
    debug(`disallowInternalProcessing: ${from} ${this.thisName} ${this.aIP+1}`);
    this.aIP++;
  }
  /**
   * Is queue processing allowed?
   */
  internalProcessingAllowed () {
    return this.aIP === 0;
  }

  async _addQueuedEvent (eventName, localRecord, arg1, arg2, arg3) {
    debug('addQueuedEvent entered');
    let [err, res] = await to(this.localQueue.create({ eventName, record: localRecord, arg1, arg2, arg3 }));
    debug(`addQueuedEvent added: ${JSON.stringify(res)}`);
    return Promise.resolve(res.id);
  }

  async _removeQueuedEvent (eventName, id, localRecord, updatedAt) {
    debug('removeQueuedEvent entered');

    const [err, res] = await to( this.localQueue.remove(id) );

    return Promise.resolve(res);
  }

  /**
   * This method must be implemented in own-data and own-net classes extending this class
   */
  async _processQueuedEvents () {
    throw new errors.NotImplemented(`_processQueuedEvents must be implemented!!!`);
  }

  /* Event listening */

  /* Synchronization */

  /**
   * Synchronize the relevant documents/items from the remote db with the local db.
   *
   * @param {boolean} bAll If true, we try to sync for the beginning of time.
   * @returns {boolean} True if the process was completed, false otherwise.
   */
  async sync (bAll = false) {
    while (!this.internalProcessingAllowed()) {
      // console.log(`sync: await internalProcessing (aIP=${this.aIP})`);
      await new Promise(resolve => {
        setTimeout(() => {
          resolve(true);
        }, 200);
      });
    }

    const syncOptions = await this._getSyncOptions(bAll);
    debug(`${this.type}.sync(${JSON.stringify(syncOptions)}) started...`);
    let self = this;
    let result = true;

    let [err, snap] = await to( snapshot(this.remoteService, syncOptions) )
    if (err) { // we silently ignore any errors
      if (err.className === 'timeout') {
        debug(`  TIMEOUT: ${JSON.stringify(err)}`);
      } else {
        debug(`  ERROR: ${JSON.stringify(err)}`);
      }
      // Ok, tell anyone interested about the result
      this.localService.emit('synced', false);
      return false;
    }

    /*
     * For each row returned by snapshot we perform the following:
     *  - if it already exists locally
     *    - if it is marked as deleted
     *      - remove the row
     *    - otherwise
     *      - patch the row
     *  - otherwise
     *    - if it is not marked as deleted
     *      - create the row
     * Moreover we track the `onServerAt` to determine latest sync timestamp
     */
    debug(`  Applying received snapshot data... (${snap.length} items)`);
    let syncTS = new Date(0).toISOString();
    await Promise.all(snap.map(async (v) => {
      let [err, res] = await to( self.localService.get(v[self.id]) );
      if (res) {
        syncTS = syncTS < v[this.myOnServerAt] ? v[this.myOnServerAt] : syncTS;
        if (v[this.myDeletedAt]) {
          [err, res] = await to( self.localService.remove(v[self.id]));
        }
        else {
          [err, res] = await to( self.localService.patch(v[self.id], v));
        }
        if (err) { result = false; }
      }
      else {
        if (!v[this.myDeletedAt]) {
          syncTS = syncTS < v[this.myOnServerAt] ? v[this.myOnServerAt] : syncTS;
          [err, res] = await to( self.localService.create(v));
          if (err) { result = false; }
        }
      }
    }));

    // Save last sync timestamp
    await this.writeSyncedAt(syncTS);
    this.syncedAt = syncTS;

    if (result) // Wait until internal Processing is ok
      while (!await this._processQueuedEvents()) {
        await new Promise(resolve => {
          setTimeout(() => {
            resolve(true);
          }, 200);
        });
      };

    // Ok, tell anyone interested about the result
    this.localService.emit('synced', result);

    return result;
  }

  /**
   * Determine the relevant options necessary for synchronizing this service.
   *
   * @param {boolean} bAll If true, we try to sync for the beginning of time.
   * @param {boolean} bTesting If true, we try to make sync possible without the server wrapper.
   * @returns {object} The relevant options for snapshot().
   */
  async _getSyncOptions (bAll, bTesting) {
    let offline = bTesting ? {} : { _forceAll: bAll };
    let query = Object.assign({}, { offline }, { $sort: {[this.myOnServerAt]: 1}});
    let ts = bAll ? new Date(0).toISOString() : this.syncedAt;

    query[this.myOnServerAt] = bTesting ? { $gte: new Date(ts).getTime() } : ts;

    return query;
  }

};

module.exports = OwnClass;

// --- Helper functions

/**
 * Make a full clone of any given object
 * @param {object} obj
 * @returns {object} The copy object
 */
function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
