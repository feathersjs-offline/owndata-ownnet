// Main module for server
import EventEmitter from 'component-emitter';
import sift from 'sift';
import { sorter, select, AdapterService } from '@feathersjs/adapter-commons';
import { _, hooks, stripSlashes } from '@feathersjs/commons';
import errors from '@feathersjs/errors';
import { genUuid } from './cryptographic';
import to from './to';
import stringsToDates from './strings-to-dates';
const debug = require('debug')('@feathersjs-offline:server:index');

const defOptions = {
  useShortUuid: true,
  adapterTest: false
};

/**
 * A RealtimeServiceWrapper is a SERVER adapter wrapping a standard AdapterService to ensure all records/documents
 * contains 'onServerAt' and to provide a getSyncInfo() function to support proper sync'ing of clients.
 */
class RealtimeClass extends AdapterService {
  constructor (opts) {
    let newOpts = Object.assign({}, defOptions, opts);

    debug(`Constructor started, newOpts = ${JSON.stringify(newOpts)}`);
    super(newOpts);

    this.wrapperOptions = Object.assign({}, newOpts, this.options);
    debug(`Constructor ended, options = ${JSON.stringify(this.options)}`);

    this.type = 'realtime-class';

    debug('  Done.');
  }

  async _setup (app, path) {  // This will be removed for future versions of Feathers
    debug(`_SetUp('${path}') started`);
    return this.setup(app, path);
  }

  async setup (app, path) {
    debug(`SetUp('${path}') started`);

    if (this._setupPerformed)  return;
    this._setupPerformed = true;

    this.options = this.wrapperOptions;

    let self = this;

    // Now we are ready to define the path with its underlying service (the wrapped service)
    let old = app.service(path);
    if (old !== self) {
      this.wrappedService = old || app.service(path); // We want to get the default service (redirects to server or points to a local service)
      app.use(path, self);  // Install this service instance
    }

    // Get the service name and standard settings
    this.name = stripSlashes(path);

    // The initialization/setup of the localService adapter screws-up our options object
    this.options = this.wrapperOptions;

    // Are we running adapterTests?
    if (this.options.adapterTest) {
      // Make sure the '_adapterTestStrip' attributes are stripped from results
      // However, we need to allow for having uuid as key
      let stripValues = Object.assign([], _adapterTestStrip);
      let idIx = stripValues.findIndex(v => { return v === self.id });
      if (idIx > -1) stripValues.splice(idIx, 1);
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

    // This is necessary if we get updates to options (e.g. .options.multi = ['patch'])
    if (!(this.wrappedService instanceof AdapterService)) {
      this._listenOptions();
    }

    // Make sure that the wrapped service is setup correctly
    if (typeof this.wrappedService.setup === 'function') {
      this.wrappedService.setup(app, path);
    }

    debug('  Done.');
    return true;
  }

  _listenOptions () {
    // This is necessary if we get updates to options (e.g. .options.multi = ['patch'])

    let self = this;

    this.options = observe(Object.assign(
      {},
      this.wrappedService.options ? this.wrappedService.options : {},
      self.options
    ));
    watcher(() => {
      // Update all changes to 'this.options' in both localService and remoteService
      self.wrappedService.options = Object.assign({}, self.wrappedService.options, self.options);
    });

  }

  get wrapped () {
    return this.wrappedService;
  }

  async _get (id, params) {
    const { newParams, offline } = fixParams(params);
    debug(`Calling _get(${id}, ${JSON.stringify(newParams)}) params=${JSON.stringify(params)}`);
    return this.wrappedService.get(id, newParams)
      .then(this._strip)
      .then(this._select(newParams))
      .then(stringsToDates(this._dates));
    }

  async _find (params) {
    const { newParams, offline } = fixParams(params);
    debug(`params.query = ${JSON.stringify(params.query)}, newParams = ${JSON.stringify(newParams)}`);
    debug(`Calling _find(${JSON.stringify(newParams)})`);
    return this.wrappedService.find(newParams)
      .then(this._strip)
      .then(this._select(newParams))
      .then(res => {
        debug(`res = ${JSON.stringify(res)}`);
        return res;
      })
      .then(stringsToDates(this._dates));
    }

  async _create (data, params = {}, ts = null) {
    const { newParams, offline } = fixParams(params);
    debug(`Calling _create(${JSON.stringify(data)}, ${JSON.stringify(params)}),  newParams=${JSON.stringify(newParams)}`);
    if (Array.isArray(data)) {
      const ts = new Date();
      return Promise.all(data.map(current => this._create(current, newParams, ts)));
    }

    ts = ts || new Date();

    let newData = clone(data);

    // We require a 'uuid' attribute along with 'updatedAt' and 'onServerAt'
    if (!('uuid' in newData)) {
      newData.uuid = genUuid(this.options.useShortUuid);
    }

    if (!('updatedAt' in newData)) {
      newData.updatedAt = ts;
    }

    newData.onServerAt = ts;

    let myParams = Object.assign({}, params, { dummy: 123});

    return this.wrappedService.create(newData, myParams)
      .then(this._strip)
      .then(this._select(newParams))
      .then(stringsToDates(this._dates));
    }

  async _update (id, data, params) {
    debug(`Calling _update(${id}, ${JSON.stringify(data)}, ${JSON.stringify(params)})`);
    const { newParams, offline } = fixParams(params);
    let newData = clone(data);
    let active = await this.wrappedService.get(id, newParams);

    if (!('uuid' in newData)) {
      newData.uuid = active.uuid;
    }
    if (!('updatedAt' in newData)) {
      newData.updatedAt = active.updatedAt;
    }
    debug(`newData: ${JSON.stringify(newData)}`);
    if (new Date(active.onServerAt).getTime() > newData.updatedAt) { // Newest on server always win
      return Promise.resolve(active)
        .then(this._strip);
    } else {
      newData.onServerAt = new Date();
      return this.wrappedService.update(id, newData, newParams)
        .then(this._strip)
        .then(this._select(newParams))
        .then(stringsToDates(this._dates));
      }
  }

  async _patch (id, data, params = {}, ts = null) {
    const { newParams, offline } = fixParams(params);
    debug(`Calling _patch(${id}, ${JSON.stringify(data)}, ${JSON.stringify(newParams)})`);
    if (id === null) {
      const multi = this.allowsMulti('patch');
      if (!multi) {
        throw new errors.MethodNotAllowed('Patching multiple without option \'multi\' set');
      }
      const ts = new Date();
      return this.wrappedService.find(newParams).then(page => {
        const res = page.data ? page.data : page;
        const self = this;
        return Promise.all(res.map(
          current => self._patch(current[self.id], data, params, ts))
        );
      })
    }

    let newData = clone(data);
    let active = await this.wrappedService.get(id, newParams);
    if (new Date(active.onServerAt).getTime() > newData.updatedAt) {
      return Promise.resolve(active)
        .then(this._strip)
        .then(this._select(newParams));
      } else {
      newData.onServerAt = ts || new Date();
      return this.wrappedService.patch(id, newData, newParams)
        .then(this._strip)
        .then(this._select(params))
        .then(stringsToDates(this._dates));
      }
  }

  async _remove (id, params = {}, ts = null) {
    const { newParams, offline } = fixParams(params);
    debug(`Calling _remove(${id}, ${JSON.stringify(newParams)})`);
    if (id === null) {
      const multi = this.allowsMulti('remove');
      if (!multi) {
        throw new errors.MethodNotAllowed('Removing multiple without option \'multi\' set');
      }
      const ts = new Date();
      return this.wrappedService.find(newParams).then(page => {
        const res = page.data ? page.data : page;
        const self = this;
        return Promise.all(res.map(
          current => self._remove(current[self.id], params, ts))
        );
      });
    }

    ts = ts || new Date();

    if (offline && offline._forceAll) {
      return this.wrappedService.remove(id, newParams)
        .then(this._strip)
        .then(this._select(newParams));
      } else {
      return this.wrappedService.patch(id, { deletedAt: ts }, newParams)
        .then(res => {
          return res;
        })
        .then(this._strip)
        .then(this._select(newParams))
        .then(stringsToDates(this._dates));
    }
  }
};

let init = (options, app) => {
  return new RealtimeClass(options, app);
}
init.Service = RealtimeClass;

let Realtime = init;

/**
 * A realtimeWrapper is a SERVER adapter wrapping for FeathersJS services extending them to
 * implement the offline `own-data` / `own-net` principle (**LINK-TO-DOC**).
 *
 * @example ```
 * import feathers from '(at)feathersjs/feathers';
 * import memory from 'feathers-memory';
 * import { realtimeWrapper } from '(at)feathersjs-offline/server';
 * const app = feathers();
 * app.use('/testpath', memory({id: 'uuid'}));
 * realtimeWrapper(app, '/testpath');
 * app.service('testpath').create({givenName: 'James', familyName: 'Bond'})
 * // ...
 * ```
 *
 * It works in co-existence with it's CLIENT counterparts, `owndataWrapper` and `ownnetWrapper`.
 *
 * @param {object} app  The application handle
 * @param {object} path The service path (as used in ```app.use(path, serviceAdapter)```)
 * @param {object} options The options for the serviceAdaptor AND the realtimeWrapper
 *
 */
function realtimeWrapper (app, path, options = {}) {
  debug(`realtimeWrapper started on path '${path}'`)
  if (!(app && app.version && app.service && app.services))
    throw new errors.Unavailable(`The FeathersJS app must be supplied as first argument`);

  let location = stripSlashes(path);

  let old = app.service(location);
  if (typeof old === 'undefined') {
    throw new errors.Unavailable(`No prior service registered on path '${location}'`);
  }

  let opts = Object.assign({}, old.options, options);
  let service = Realtime(opts, app);
  app.use(location, service);
  service = app.service(location);
  service.options = opts;
  service._listenOptions();
  service.wrappedService = old;

  return service;
}

module.exports = { init, Realtime, realtimeWrapper };

// --- Helper functions

/**
 * Make a full clone of any given object
 * @param {object} obj
 * @returns {object} The copy object
 */
function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}

const _adapterTestStrip = ['uuid', 'updatedAt', 'onServerAt', 'deletedAt'];

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

/**
 * Fixes params so that `query` adheres to the standard i.e. it splits
 * `{ query: { ..., offline: { ... }}}` into `{ newParams, offline }`.
 *
 * Iff `offline` contains `_forceAll: true, onServerAt: ...` we copy the
 * `onServerAt` to `query` and remove `deletedAt`from `query`.
 *
 * `deletedAt` is normally forced to `null` in `query` so we do not operate on
 * soft-deleted items, but iff `query.offline._forceAll` we remove the
 * attribute from `query` to be able to query all items in the collection
 * regardless of their deletion status.
 *
 * @param {object} params A normal params object with possible `offline` query
 * @return {object} Returns `{ newParams, offline }`
 */
const fixParams = function (params) {
  if (!params)
    return { newParams: { query: {} }, offline: {} };

  params = JSON.parse(JSON.stringify(params));
  let { paginate, query = {}, ...other } = params;
  let { offline, ...rest } = query;
  query = rest;
  let newParams = Object.assign({}, params);

  if (offline) {
    if ('_forceAll' in offline && offline._forceAll) {
      let { deletedAt, ...rest } = query;
      query = rest;
      query.onServerAt = { $gte: new Date(query.onServerAt || 0).getTime() };
    }
    else {
      query.deletedAt = null;
    }
  }
  else {
    query = Object.assign(query, { 'deletedAt': null });
  }

  newParams.query = query;
  if (paginate !== undefined) newParams.paginate = paginate;

  return { newParams, offline: (offline !== undefined ? offline : {}) };
};

/* Support for updating adapter options through the wrapper */

let depends = [];
let watchingFn = null;

/**
 * Package the data to be observed in a proxy that updates according to
 * relevant recipes registered with watcher().
 * @param {object} data The data object to observe
 */
function observe (data) {
  return new Proxy(data, {
    get (obj, key) {
      if (watchingFn) {
        if (!depends[key])  depends[key] = [];
        depends[key].push(watchingFn);
      }
      return obj[key];
    },
    set (obj, key, val) {
      obj[key] = val;
      if (depends[key])
        depends[key].forEach(cb => cb());
      return true;
    }
  })
}

/**
 * Register a handler for the observer proxy
 * @param {function} target The handler function
 */
function watcher (target) {
  watchingFn = target;
  target();
  watchingFn = null;
}
