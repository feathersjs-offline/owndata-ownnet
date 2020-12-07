import EventEmitter from 'component-emitter';
import sift from 'sift';
import { sorter, select, AdapterService } from '@feathersjs/adapter-commons';
import { _, hooks, stripSlashes } from '@feathersjs/commons';
import errors from '@feathersjs/errors';
import { genUuid } from './cryptographic';
import to from './to';
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
  constructor(opts) {
    let newOpts = Object.assign({}, defOptions, opts);

    debug(`Constructor started, newOpts = ${JSON.stringify(newOpts)}`);
    super(newOpts);

    this.wrapperOptions = Object.assign({}, newOpts, this.options);
    debug(`Constructor ended, options = ${JSON.stringify(this.options)}`);

    this.type = 'realtime-class';

    debug('  Done.');
  }

  async _setup(app, path) {  // This will be removed for future versions of Feathers
    debug(`_SetUp('${path}') started`);
    return this.setup(app, path);
  }

  async setup(app, path) {
    debug(`SetUp('${path}') started`);

    if (this._setupPerformed)  return;
    this._setupPerformed = true;

    this.options = this.wrapperOptions;

    let self = this;

    // Now we are ready to define the path with its underlying service (the remoteService)
    let old = app.services[path];
    this.remoteService = old || app.service(path); // We want to get the default service (redirects to server or points to a local service)
    app.services[path] = self;  // Install this service instance

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

    // Initialize the service wrapper
    this.listening = false;

    // This is necessary if we get updates to options (e.g. .options.multi = ['patch'])
    if (!(this.remoteService instanceof AdapterService)) {
      this._listenOptions();
    }

    debug('  Done.');
    return true;
  }

  _listenOptions() {
    // This is necessary if we get updates to options (e.g. .options.multi = ['patch'])

    let self = this;

    this.options = observe(Object.assign(
      {},
      this.remoteService.options ? this.remoteService.options : {},
      self.options
    ));
    watcher(() => {
      // Update all changes to 'this.options' in both localService and remoteService
      self.remoteService.options = Object.assign({}, self.remoteService.options, self.options);
    });

  }

  async _get(id, params) {
    const { newParams, offline } = fixParams(params);
    debug(`Calling _get(${id}, ${JSON.stringify(newParams)}) params=${JSON.stringify(params)}`);
    return this.remoteService.get(id, newParams)
      .then(this._strip)
      .then(this._select(newParams));
    }

  async _find(params) {
    const { newParams, offline } = fixParams(params);
    debug(`Calling _find(${JSON.stringify(newParams)})`);
    return this.remoteService.find(newParams)
      .then(this._strip)
      .then(this._select(newParams));
    }

  async _create(data, params = {}, ts = null) {
    const { newParams, offline } = fixParams(params);
    debug(`Calling _create(${JSON.stringify(data)}, ${JSON.stringify(params)}),  newParams=${JSON.stringify(newParams)}`);
    if (Array.isArray(data)) {
      const ts = new Date();
      return Promise.all(data.map(current => this._create(current, newParams, ts)));
    }

    ts = ts || new Date();

    let newData = shallowClone(data);

    // We require a 'uuid' attribute along with 'updatedAt' and 'onServerAt'
    if (!('uuid' in newData)) {
      newData.uuid = genUuid(this.options.useShortUuid);
    }

    if (!('updatedAt' in newData)) {
      newData.updatedAt = ts;
    }

    newData.onServerAt = ts;

    let myParams = Object.assign({}, params, { dummy: 123});

    return this.remoteService.create(newData, myParams)
      .then(this._strip)
      .then(this._select(newParams));
    }

  async _update(id, data, params) {
    debug(`Calling0 _update(${id}, ${JSON.stringify(data)}, ${JSON.stringify(params)})`);
    const { newParams, offline } = fixParams(params);
    let newData = shallowClone(data);
    let active = await this.remoteService.get(id, newParams);

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
      return this.remoteService.update(id, newData, newParams)
        .then(this._strip)
        .then(this._select(newParams));
      }
  }

  async _patch(id, data, params = {}, ts = null) {
    const { newParams, offline } = fixParams(params);
    debug(`Calling _patch(${id}, ${JSON.stringify(data)}, ${JSON.stringify(newParams)})`);
    if (id === null) {
      const multi = this.allowsMulti('patch');
      if (!multi) {
        throw new errors.MethodNotAllowed('Patching multiple without option \'multi\' set');
      }
      const ts = new Date();
      return this.remoteService.find(newParams).then(page => {
        const res = page.data ? page.data : page;
        if (!Array.isArray(res)) {
          res = [res];
        }

        const self = this;
        return Promise.all(res.map(
          current => self._patch(current[self.id], data, params, ts))
        );
      })
    }

    let newData = shallowClone(data);
    let active = await this.remoteService.get(id, newParams);
    if (new Date(active.onServerAt).getTime() > newData.updatedAt) {
      return Promise.resolve(active)
        .then(this._strip)
        .then(this._select(newParams));
      } else {
      newData.onServerAt = ts || new Date();
      return this.remoteService.patch(id, newData, newParams)
        .then(this._strip)
        .then(this._select(params));
      }
  }

  async _remove(id, params = {}, ts = null) {
    const { newParams, offline } = fixParams(params);
    debug(`Calling _remove(${id}, ${JSON.stringify(newParams)})`);
    if (id === null) {
      const multi = this.allowsMulti('remove');
      if (!multi) {
        throw new errors.MethodNotAllowed('Removing multiple without option \'multi\' set');
      }
      const ts = new Date();
      return this.remoteService.find(newParams).then(page => {
        const res = page.data ? page.data : page;
        if (!Array.isArray(res)) {
          res = [res];
        }

        const self = this;
        return Promise.all(res.map(
          current => self._remove(current[self.id], params, ts))
        );
      });
    }

    ts = ts || new Date();

    if (offline && '_forceAll' in offline) {
      return this.remoteService.remove(id, newParams)
        .then(this._strip)
        .then(this._select(newParams));
      } else {
      return this.remoteService.patch(id, { deletedAt: ts }, newParams)
        .then(res => {
          return res;
        })
        .then(this._strip)
        .then(this._select(newParams));
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
function realtimeWrapper(app, path, options = {}) {
  debug(`realtimeWrapper started on path '${path}'`)
  if (!(app && app.version && app.service && app.services))
    throw new errors.Unavailable(`The FeathersJS app must be supplied as first argument`);

  let location = stripSlashes(path);

  let old = app.services[location];
  if (typeof old === 'undefined') {
    throw new errors.Unavailable(`No prior service registered on path '${location}'`);
  }

  let opts = Object.assign({}, old.options, options);
  let service = Realtime(opts, app);
  app.use(location, service);
  service = app.service(location);
  service.options = opts;
  service._listenOptions();
  service.remoteService = old;

  return app.services[location];
}

module.exports = { init, Realtime, realtimeWrapper };



// --- Helper functions

/**
 * Make a shallow clone of any given object
 * @param {object} obj
 * @returns {object} The copy object
 */
function shallowClone(obj) {
  return Object.assign({}, obj);
};

const _adapterTestStrip = ['uuid', 'updatedAt', 'onServerAt', 'deletedAt'];

const attrStrip = (...attr) => {
  return (res) => {
    let result;
    if (Array.isArray(res)) {
      result = [];
      res.map((v, i, arr) => {
        let obj = shallowClone(arr[i]);
        attr.forEach(a => delete obj[a]);
        result.push(obj);
      })
    }
    else {
      result = shallowClone(res);
      attr.forEach(a => delete result[a]);
    }
    return result;
  }
};

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
  let { offline } = query;
  let newParams = {};

  if (offline) {
    delete query.offline;

    if ('_forceAll' in offline) {
      delete query.deletedAt
      if ('onServerAt' in offline) {
        query.onServerAt = { $gte: new Date(offline.onServerAt).getTime() };
      }
    }
    else {
      query.deletedAt = null;
    }
  }
  else {
    if (query && query !== {}) {
      query = Object.assign(query, { 'deletedAt': null });
    } else {
      query = { 'deletedAt': null };
    }
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
