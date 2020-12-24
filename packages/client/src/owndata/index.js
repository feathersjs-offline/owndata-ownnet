import { stripSlashes } from '@feathersjs/commons';
import errors from '@feathersjs/errors';
import { to } from '../common';
import OwnClass from '../own-common';

const debug = require('debug')('@feathersjs-offline:owndata:service-wrapper');
const BOT = new Date(0).toISOString();

class OwndataClass extends OwnClass {
  constructor (opts) {
    debug(`Constructor started, opts = ${JSON.stringify(opts)}`);
    super(opts);

    this.type = 'own-data';
    this.__forTestingOnly = super._processQueuedEvents;

    debug('  Done.');
    return this;
  }

  async _processQueuedEvents () {
    debug(`processQueuedEvents (${this.type}) entered`);
    if(!this.internalProcessingAllowed() || this.pQActive) {
      // console.log(`processingQueuedEvents: internalProcessing (aIP=${this.aIP}), pQActive=${this.pQActive}`);
      return false;
    }
    this.pQActive = true;

    let [err, store] = await to(this.localQueue.getEntries({query:{$sort: {[this.id]: 1}}}));
    if (!store || store === []) {
      this.pQActive = false;
      return true;
    }

    debug(`  processing ${store.length} queued entries...`);
    let self = this;
    let stop = false;
    while (store.length && !stop) {
      let el = store.shift();
      let { eventName, record, arg1, arg2, arg3 = null, id } = el;
      ({eventName, el, arg1, arg2, arg3, id} = _accEvent(this.id, eventName, record, arg1, arg2, arg3, id));

      debug(`    processing: event=${eventName}, arg1=${JSON.stringify(arg1)}, arg2=${JSON.stringify(arg2)}, arg3=${JSON.stringify(arg3)}`)
      await self.remoteService[eventName](arg1, arg2, arg3)
        .then(async res => {
          await to(self.localQueue.remove(id));
          if (eventName !== 'remove') {
            // Let any updates to the document/item on server reflect on the local DB
            await to(self.localService.patch(res[self.id], res));
          }
        })
        .catch(async err => {
          debug(`catch: record=${JSON.stringify(record)}, BOT=${JSON.stringify(BOT)}, event=${eventName}, id=${id}`);
          if (record.onServerAt === BOT  &&  eventName === 'remove') {
            // This record has probably never been on server (=remoteService), so we silently ignore the error
            await to(self.localQueue.remove(id));
          }
          else {
            // The connection to the server has probably been cut - let's continue at another time
            stop = true;
          }
        });
    }

    debug(`  processing ended, stop=${stop}`);

    this.pQActive = false;

    return !stop;
  }

};

function init (options) {
  return new OwndataClass(options);
}

let Owndata = init;

/**
 * A owndataWrapper is a CLIENT adapter wrapping for FeathersJS services extending them to
 * implement the offline own-data principle (**LINK-TO-DOC**).
 *
 * @example ```
 * import feathers from '(at)feathersjs/feathers';
 * import memory from 'feathers-memory';
 * import { owndataWrapper } from '(at)feathersjs-offline/client';
 * const app = feathers();
 * app.use('/testpath', memory({id: 'uuid'}));
 * owndataWrapper(app, '/testpath');
 * app.service('testpath').create({givenName: 'James', familyName: 'Bond'})
 * // ...
 * ```
 *
 * It works in co-existence with it's SERVER counterpart, RealtimeServiceWrapper.
 *
 * @param {object} app  The application handle
 * @param {object} path The service path (as used in ```app.use(path, serviceAdapter)```)
 * @param {object} options The options for the serviceAdaptor AND the OwndataWrapper
 *
 */
function owndataWrapper (app, path, options = {}) {
  debug(`owndataWrapper started on path '${path}'`)
  if (!(app && app.version && app.service && app.services) ) {
    throw new errors.Unavailable(`The FeathersJS app must be supplied as first argument`);
  }

  let location = stripSlashes(path);

  let old = app.service(location);
  if (typeof old === 'undefined') {
    throw new errors.Unavailable(`No prior service registered on path '${location}'`);
  }

  let opts = Object.assign({}, old.options, options);
  app.use(location, Owndata(opts));
  let service = app.service(location);
  service.options = opts;
  service._listenOptions();

  return service;
}

module.exports = { init, Owndata, owndataWrapper };

init.Service = OwndataClass;

// Helper

function _accEvent (idName, eventName, el, arg1, arg2, arg3, id) {
  let elId = el[idName];
  switch (eventName) {
    case 'create':
      return { eventName, el, arg1: el, arg2: arg2, arg3: {}, id };
    case 'update':
      return { eventName, el, arg1, arg2, arg3: arg3, id };
    case 'patch':
      return { eventName, el, arg1: elId, arg2: el, arg3: arg3, id };
    case 'remove':
      return { eventName, el, arg1: elId, arg2: {}, arg3: arg3, id };
  }
}
