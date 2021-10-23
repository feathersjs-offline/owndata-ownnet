import { sorter, select, AdapterService } from '@feathersjs/adapter-commons';
import { _, hooks, stripSlashes } from '@feathersjs/commons';
import errors from '@feathersjs/errors';
import lf from '@feathersjs-offline/localforage';
import EventEmitter from 'component-emitter';
import ls from 'feathers-localstorage';
import sift from 'sift';
import { genUuid, to, OptionsProxy, clone, stringsToDates } from '../common';
import snapshot from '../snapshot';
import { stripProps } from '../common';

const { LocalForage } = lf;

const debug = require('debug')('@feathersjs-offline:ownclass:service-base');

const defaultOptions = {
  'id': 'id',
  'store': null,
  'storage': null,
  'useShortUuid': true,
  'throttle': null,
  'timedSync': 24*60*60*1000,
  'adapterTest': false,
  'matcher': sift,
  sorter,
  'fixedName': '',
  'dates': false
};
  
const Drivers = {
  INDEXEDDB: 'asyncStorage',
  WEBSQL: 'webSQLStorage',
  LOCALSTORAGE: 'localStorageWrapper'
};

const States = {
  started: 'started',
  ended: 'ended'
};

const SYNC_DB_NAME = '@@@syncedAt@@@';

const BOT = new Date(0);

const _adapterTestStrip = ['uuid', 'updatedAt', 'onServerAt', 'deletedAt'];

let nameIx = 0;

const attrStrip = (...attr) =>
  (res) => Array.isArray(res) ? res.map(val => stripProps(val, attr))
                              : stripProps(res, attr);

class OwnClass extends AdapterService {
  constructor (opts) {
    let newOpts = Object.assign({}, defaultOptions, opts);

    debug(`Constructor started, newOpts = ${JSON.stringify(newOpts)}, allOpts = ${Object.keys(newOpts)}`);
    super(newOpts);

    this.wrapperOptions = Object.assign({}, newOpts, this.options);
    this.wrapperOptions.storage = newOpts.storage;
    debug(`Constructor ended, options = ${JSON.stringify(this.wrapperOptions)}, allOpts = ${Object.keys(newOpts)}`);

    this.type = 'own-class';

    debug(`   Setting _select...`);

    // Make sure we always select the key (id) in our results
    this._select = (params, ...others) => (res) => { return select(params, ...others, this.id)(res) }

    // Initialize the service wrapper
    this.listening = false;
    this.aIP = 0; // Our semaphore for internal processing
    this.pQActive = false; // Our flag for avoiding more than one processing of queued operations at a time

    debug('  Done.');
    return this;
  }

  async awaitSetup () {
    while (this._setupPerformed !== States.ended) {
      debug(`awaitSetup...`);
      await this.delay(200);
    }

    return true;
  }

  async _setup (app, path) {  // This will be removed for future versions of Feathers
    debug(`_SetUp('${path}') started`);
    return this.setup(app, path);
  }

  async setup (app, path) {
    const self = this;
    if (this._setupPerformed) { // Assure we only run setup once
      return;
    }

    debug(`SetUp('${path}') started`);
    this._setupPerformed = States.started;

    this.options = Object.assign({}, this.wrapperOptions);
    debug(`   Options '${JSON.stringify(this.options)}')`);
 
    this._dates = this.options.dates;
  
    this.thisName = this.options.fixedName !== '' ? this.options.fixedName : `${this.type}_offline_${nameIx++}_${path}`;

    debug(`SetUp('${path}') before old app...`);
    // Now we are ready to define the path with its underlying service (the remoteService)
    let old = app.service(path);
    if (old !== self) {
      this.remoteService = old; // We want to get the default service (redirects to server or points to a local service)
      app.use(path, self);  // Install this service instance
    }

    // Make sure that the wrapped service is setup correctly
    if (typeof this.remoteService.setup === 'function') {
      debug(`   Setting up remote service...`);
      await this.remoteService.setup(app, path);
      this.options = Object.assign({}, this.wrapperOptions, this.options);
    }
    
    debug(`SetUp('${path}') after old app...`);
    // Get the service name and standard settings
    this.name = path;
    
    // Construct two helper services
    this.localServiceName = this.thisName + '_local';
    this.localServiceQueue = this.thisName + '_queue';
    
    // Make sure the driver is correct
    debug(`  Setting up storage...`);
    let localStorageDriver = null;
    if (this.options.storage && !Array.isArray(this.options.storage) && this.options.storage.toUpperCase() === 'ASYNCSTORAGE') {
      localStorageDriver = ls;
      this.storage = global.AsyncStorage;
      this.options.throttle = 1;
    }
    else {
      localStorageDriver = lf;
      let storage = this.options.storage ? this.options.storage : 'LOCALSTORAGE';
      if (!Array.isArray(storage)) {
        storage = [storage];
      }
      this.storage = storage.map(s => {
        let driver = Drivers[s.toUpperCase()];
        if (!driver) throw new errors.NotFound(`Illegal driver type '${s}' found. Please use either a combination of 'LOCALSTORAGE', 'WEBSQL', and 'INDEXEDDB' or for React 'ASYNCSTORAGE'.`);
        return driver;
      });
    }
      
    debug(`   Storage=${this.storage}`);
    this.store = this.options.store ? this.options.store : [];
    this.localSpecOptions = { name: this.localServiceName, storage: this.storage, store: this.store, reuseKeys: this.options.fixedName !== '', events: ['synced'], dates: this.options.dates };
    let localOptions = Object.assign({}, this.options, this.localSpecOptions);
    let queueOptions = { id: 'id', name: this.localServiceQueue, storage: this.storage, paginate: null, multi: true, reuseKeys: this.options.fixedName !== '' };
    
    debug(`   Setting up service '${this.localServiceName}' with options '${JSON.stringify(localOptions)}'...`);
    app.use(this.localServiceName, localStorageDriver(localOptions));
    debug(`   Setting up service '${this.localServiceQueue}' with options '${JSON.stringify(queueOptions)}'...`);
    app.use(this.localServiceQueue, localStorageDriver(queueOptions));

    this.localService = app.service(this.localServiceName);
    this.localQueue = app.service(this.localServiceQueue);

    debug(`   Adding syncDB...`);
    app.use(SYNC_DB_NAME, localStorageDriver({ name: SYNC_DB_NAME, storage: this.storage, reuseKeys: true }));
    this.syncDB = app.service(SYNC_DB_NAME);

    debug(`   AdapterTest=${this.options.adapterTest}...`);
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

    // Determine latest registered sync timestamp
    debug(`   Determine latest registered sync timestamp (if any)...`);
    let value = this.getSyncItem(false);
    this.syncedAt = new Date(value || BOT).toISOString();
    debug(`   Sync timestamp is found... ${this.syncedAt}`);
    value = this.setSyncItem(this.syncedAt);
    debug(`   Sync timestamp is stored!`);

    debug(`   Restore options...`);
    // The re-initialization/setup of the localService adapter can screw-up our options object
    this.options = Object.assign({}, this.wrapperOptions);

    // This is necessary if we get updates to options (e.g. .options.multi = ['patch'])
    if (!(this.remoteService instanceof AdapterService)) {
      debug(`   Adding options listener...`);
      this._listenOptions();
    }

    // Should we perform a sync every timedSync?
    if (this.options.timedSync && Number.isInteger(this.options.timedSync) && this.options.timedSync > 0) {
      debug(`   Setting up timed-sync every ${JSON.stringify(self.options.timedSync)} ms...`);
      this._timedSyncHandle = setInterval(() => self.sync(), self.options.timedSync);
    }

    debug(`   Options '${JSON.stringify(this.options)}')`);
    debug('  Done.');
    this._setupPerformed = States.ended;

    return true;
  }

  // syncDB functions
  getSyncItem (failOnMissing = true) {
    let key = this.thisName + '_syncedAt';
    let res = this.syncDB.get(key)
      .then(res => {
        return res;
      })
      .catch(err => {
        if (failOnMissing) throw new errors.GeneralError(`Error get syncDB: key=${key} ${err.name}, ${err.message}`);
      });
      return res ? res.value : BOT.toISOString();
  }
  
  setSyncItem (value) {
    let key = this.thisName + '_syncedAt';
    let res = this.syncDB.get(key)
      .then(resVal => {
        this.syncDB.update(key, { id: key, value: value })
          .catch(err => {
            throw new errors.GeneralError(`Error updating syncDB: id=${id} ${err.name}, ${err.message}`);
          });
          return resVal;
      })
      .catch(err => {
        return this.syncDB.create({ id: key, value: value })
          .catch(err => {
            throw new errors.GeneralError(`Error creating syncDB: key=${key}, value=${value}: ${err.name}, ${err.message}`);
          });
      });

    return res;
  }

  async delay (ms) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, ms);
    });

  }

  async _listenOptions () {
    // This is necessary if we get updates to options (e.g. .options.multi = ['patch'])

    const self = this;
    const optProxy = new OptionsProxy(self.thisName);

    this.options = optProxy.observe(Object.assign(
      {},
      self.remote.options ? self.remote.options : {},
      self.options
    ));
    optProxy.watcher(async () => {
      // Update all changes to 'this.options' in both localService and remoteService

      //  Make sure the remote service is set-up
      while (self.remote === undefined) {
        debug(`REMOTE STILL UNDEFINED`);
        await this.delay(10);
      }
      //  Make sure the local service is ready
      while (self.local === undefined) {
        debug(`LOCAL STILL UNDEFINED`);
        await this.delay(10);
      }
      self.remote.options = Object.assign({}, self.remote.options, self.options);
      self.local.options = Object.assign({}, self.options, self.localSpecOptions);
    });

  }

  async getEntries (params) {
    debug(`Calling getEntries(${JSON.stringify(params)}}), thisName=${this.thisName}`);
    await this.awaitSetup();

    let res = [];
    await this.localService.getEntries(params)
      .then(entries => {
          res = entries
      });

    return Promise.resolve(res)
      .then(this._strip)
      .then(this._select(params))
      .then(stringsToDates(this._dates))
      .then(result => {
        debug(`getEntries: result=${JSON.stringify(result)}`);
        return result;
      })
      ;
  }

  async get (id, params) {
    debug(`Calling get(${JSON.stringify(id)}, ${JSON.stringify(params)})`);
    await this.awaitSetup();

    return this._get(id, params);
  }

  async _get (id, params) {
    debug(`Calling _get(${JSON.stringify(id)}, ${JSON.stringify(params)}})`);
    await this.awaitSetup();

    return await this.localService.get(id, params)
      .then(this._strip)
      .then(this._select(params))
      .then(stringsToDates(this._dates))
      .catch(err => {throw err});
  }

  async find (params) {
    debug(`Calling find(${JSON.stringify(params)}})`);
    debug(`  rows=${JSON.stringify(await this.getEntries())}`);
    await this.awaitSetup();

    return this._find(params);
  }

  async _find (params) {
    debug(`Calling _find(${JSON.stringify(params)}})`);
    await this.awaitSetup();

    return this.localService.find(params)
      .then(this._strip)
      .then(this._select(params))
      .then(stringsToDates(this._dates));
  };

  async create (data, params) {
    debug(`Calling create(${JSON.stringify(data)}, ${JSON.stringify(params)})`);
    await this.awaitSetup();

    if (Array.isArray(data) && !this.allowsMulti('create')) {
      return Promise.reject(new errors.MethodNotAllowed('Creating multiple without option \'multi\' set'));
    }

    return this._create(data, params);
  }

  async _create (data, params, ts = 0) {
    debug(`Calling _create(${JSON.stringify(data)}, ${JSON.stringify(params)}, ${ts})`);
    await this.awaitSetup();

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
    if (!('uuid' in newData)) {
      newData.uuid = genUuid(this.options.useShortUuid);
    }

    if (!('updatedAt' in newData)) {
      newData.updatedAt = ts;
    }

    // We do not allow the client to set the onServerAt attribute to other than default '0'
    newData.onServerAt = BOT;

    // Is uuid unique?
    let [err, res] = await to(this.localService.find({ query: { 'uuid': newData.uuid } }));
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
          await to(self._removeQueuedEvent('_create0', queueId, newData, newData.updatedAt));
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
            await to(self._removeQueuedEvent('_create1', queueId, rerr.message/*newData*/, newData.updatedAt));
            await to(self.localService.remove(res[self.id], params));
          }

          self.allowInternalProcessing('_create1');
        });
    }
    else {
      await to(this._removeQueuedEvent('_create2', queueId, newData, newData.updatedAt));
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
    await this.awaitSetup();

    if (id === null || Array.isArray(data)) {
      return Promise.reject(new errors.BadRequest(
        `You can not replace multiple instances. Did you mean 'patch'?`
      ));
    }

    return this._update(id, data, params);
  }

  async _update (id, data, params = {}) {
    debug(`Calling _update(${id}, ${JSON.stringify(data)}, ${JSON.stringify(params)}})`);
    await this.awaitSetup();

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
    const beforeUuid = beforeRecord.uuid;

    let newData = clone(data);
    newData.uuid = beforeUuid; // eslint-disable-line
    newData.updatedAt = new Date();
    newData.onServerAt = BOT;

    // Optimistic mutation
    this.disallowInternalProcessing('_update');
    let queueId = await this._addQueuedEvent('update', newData, id, clone(newData), params);

    // Start actual mutation on remote service
    [err, res] = await to(this.localService.update(id, newData, clone(params)));
    if (!err) {
      this.remoteService.update(id, res, clone(params))
        .then(async rres => {
          await to(self._removeQueuedEvent('_update0', queueId, newData, res.updatedAt));
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
            await to(self._removeQueuedEvent('_update1', queueId, newData, res.updatedAt));
            await to(self.localService.patch(id, beforeRecord));
          }
          self.allowInternalProcessing('_update1');
        });
    }
    else {
      await to(this._removeQueuedEvent('_update2', queueId, newData, newData.updatedAt));
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
    await this.awaitSetup();

    if (id === null && !this.allowsMulti('patch')) {
      return Promise.reject(new errors.MethodNotAllowed(`Can not patch multiple entries`));
    }

    return this._patch(id, data, params);
  }

  async _patch (id, data, params = {}, ts = 0) {
    debug(`Calling _patch(${id}, ${JSON.stringify(data)}, ${JSON.stringify(params)}})`);
    await this.awaitSetup();

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
          current => self._patch(current[this.id], data, params, timestamp))
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
    newData.onServerAt = BOT;
    newData.updatedAt = ts;
    this.disallowInternalProcessing('_patch');
    const queueId = await this._addQueuedEvent('patch', newData, id, clone(newData), params);

    // Start actual mutation on remote service
    [err, res] = await to(this.localService.patch(id, newData, clone(params)));
    if (res) {
      this.remoteService.patch(id, res, clone(params))
        .then(async rres => {
          await to(self._removeQueuedEvent('_patch0', queueId, rres, res.updatedAt));
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
            await to(self._removeQueuedEvent('_patch1', queueId, newData, res.updatedAt));
            await to(self.localService.patch(id, beforeRecord));
          }
          self.allowInternalProcessing('_patch1');
        });
    }
    else {
      await to(this._removeQueuedEvent('_patch2', queueId, newData, newData.updatedAt));
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
    await this.awaitSetup();

    if (id === null && !this.allowsMulti('remove')) {
      return Promise.reject(new errors.MethodNotAllowed(`Can not remove multiple entries`));
    }

    return this._remove(id, params);
  }

  async _remove (id, params = {}) {
    debug(`Calling _remove(${id}, ${JSON.stringify(params)}})`);
    await this.awaitSetup();

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
          current => self._remove(current[this.id], params))
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
            try {
              // if (beforeRecord.onServerAt === BOT) {
              // In all likelihood the document/item was never on the server
              // so we choose to silently ignore this situation
              // } else {
              // We have to restore the record to  the local DB
              await to(self._removeQueuedEvent('_remove1', queueId, beforeRecord, null));
              let [err, res] = await to(self.localService.create(beforeRecord, null));
              if (err) throw new errors.GeneralError(`ERROR re-creating record. ${err.name}, ${err.message}`);
            } catch (err) {
              debug(`_create re-created record: ERROR re-creating record. ${err.name}, ${err.message}`);
            };
            debug(`_create re-created record: rec=${JSON.stringify(beforeRecord)}`);
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
    debug(`addQueuedEvent '${eventName}' entered`);
    let [err, res] = await to(this.localQueue.create({ eventName, record: localRecord, arg1, arg2, arg3 }));
    if (err) throw new errors.GeneralError(`Could not write '${JSON.stringify({ eventName, record: localRecord, arg1, arg2, arg3 })}' to localQueue (${this.localServiceQueue}), err=${err.name}, ${err.message}`);
    debug(`addQueuedEvent added: ${JSON.stringify(res)}`);
    return Promise.resolve(res.id);
  }

  async _removeQueuedEvent (eventName, id, localRecord, updatedAt) {
    debug(`removeQueuedEvent '${eventName}' entered`);

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
   * @param {boolean} bTesting If true, we try to sync without the proper server/backend wrapper installed.
   * @returns {boolean} True if the process was completed, false otherwise.
   */
  async sync (bAll = false, bTesting = false) {
    while (!this.internalProcessingAllowed()) {
      // console.log(`sync: await internalProcessing (aIP=${this.aIP})`);
      await new Promise(resolve => {
        setTimeout(() => {
          resolve(true);
        }, 200);
      });
    }

    const syncOptions = await this._getSyncOptions(bAll, bTesting);
    debug(`${this.type}.sync(${JSON.stringify(syncOptions)}) started...`);
    let self = this;
    let result = true;

    let [err, snap] = await to( snapshot(this.remoteService, syncOptions) )
    if (err) { // we silently ignore any errors
      if (err.className === 'timeout') {
        debug(`  sync TIMEOUT: ${JSON.stringify(err)}`);
      } else {
        debug(`  sync ERROR: ${JSON.stringify(err)}, err=${err.name}, ${err.message}`);
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
    let syncTS = BOT.toISOString();
    let ts = await Promise.all(snap.map(async (v) => {
      let [err, res] = await to( self.localService.get(v[self.id]) );
      if (res) {
        syncTS = syncTS < v.onServerAt ? v.onServerAt : syncTS;
        if (v.deletedAt) {
          [err, res] = await to( self.localService.remove(v[self.id]));
        }
        else {
          [err, res] = await to( self.localService.patch(v[self.id], v));
        }
        // if (err) { result = false; }
        return err ? BOT.toISOString() : v.onServerAt;
      }
      else {
        if (!v.deletedAt) {
          syncTS = syncTS < v.onServerAt ? v.onServerAt : syncTS;
          [err, res] = await to( self.localService.create(v));
          // if (err) { result = false; }
          return err ? BOT.toISOString() : v.onServerAt;
        }
      }
    }));

    syncTS = ts.reduce((pv, cv) => pv < cv ? cv : pv, self.syncedAt);

    // Save last sync timestamp
    this.syncedAt = syncTS;
    if (snap.length) self.setSyncItem(this.syncedAt);

    if (result) // Wait until internal Processing is ok
      while (!await self._processQueuedEvents()) {
        await new Promise(resolve => {
          setTimeout(() => {
            resolve(true);
          }, 200);
        });
      };

    // Ok, tell anyone interested about the result
    self.localService.emit('synced', result);

    return result;
  }

  /**
   * Determine the relevant options necessary for synchronizing this service.
   *
   * @param {boolean} bAll If true, we try to sync for the beginning of time.
   * Otherwise from `syncedAt`.
   * @param {boolean} bTesting If true, we try to sync without the proper
   * server/backend wrapper (ie. we remove the `offline` property).
   * @returns {object} The relevant options for snapshot().
   */
  async _getSyncOptions (bAll, bTesting) {
    const forceAll = { _forceAll: bAll };
    const _offline = { offline: forceAll };
    const offline = (bAll && !bTesting) ? _offline : {};
    let query = Object.assign({}, bTesting ? {} : { offline }, { $sort: {onServerAt: 1}});
    let syncTS = bAll ? BOT.toISOString() : this.syncedAt;
    syncTS = bTesting ? { $gte: syncTS } : syncTS;

    query.onServerAt = syncTS;

    return query;
  }

};

module.exports = OwnClass;
