//'use strict';
const feathers = require('@feathersjs/feathers');
const { stripSlashes } = require('@feathersjs/commons');
const errors = require('@feathersjs/errors');
const adapterTests = require('./own-common/helpers/adapter-test');
const wrapperBasic = require('./own-common/helpers/wrapper-basic-test');
const ownWrapper = require('./own-common/helpers/own-wrapper-test');
const syncTests = require('./own-common/helpers/sync-test');
const eventsTests = require('./own-common/helpers/events-test');
const localStorageTests = require('./own-common/helpers/local-storage-test');
const asyncStorageTests = require('./own-common/helpers/async-storage-test');
const renameTests = require('./own-common/helpers/rename-test');
const restTests = require('./own-common/helpers/rest-test');
const socketioTests = require('./own-common/helpers/socket-io-test');

const OwnClass = require('../src/own-common');

const package = 'ownclass';
const verbose = false;
let app;

// OwnClass is not as such expected to be used as a wrapper,
// but we can coerce it in the name of rigorous testing
class OwnclassClass extends OwnClass {
  constructor (opts = {}) {
    super(opts);
    this.type = 'own-class';
    this.__forTestingOnly = super._processQueuedEvents;
  }

  async _processQueuedEvents () {
    return Promise.resolve(true);
  }
}

function ownclassWrapper (app, path, options = {}) {
  if (!(app && app.version && app.service && app.services) ) {
    throw new errors.Unavailable(`The FeathersJS app must be supplied as first argument`);
  }

  const location = stripSlashes(path);

  const old = app.service(location);
  if (typeof old === 'undefined') {
    throw new errors.Unavailable(`No prior service registered on path '${location}'`);
  }

  const opts = Object.assign({}, old.options, options);
  app.use(location, new OwnclassClass(opts, true));
  app.service(location).options = opts;
  app.service(location)._listenOptions();

  return app.service(location);
}

const init = options => {return new OwnclassClass(options)};
init.Service = OwnclassClass;

describe(`${package}Wrapper tests`, () => {
  before(async () => {
    return await global.ownCommonGetStatus
  });

  after(() => global.ownCommonSetStatus());

  app = feathers();
  const testTitle = `${package}Wrapper adapterTests`
  adapterTests(testTitle, app, errors, ownclassWrapper, 'people');
  adapterTests(testTitle, app, errors, ownclassWrapper, 'people-customId', 'customId');
  adapterTests(testTitle, app, errors, ownclassWrapper, 'people-uuid', 'uuid');

  wrapperBasic(`${package}Wrapper basic functionality`, app, errors, ownclassWrapper, 'wrapperBasic', verbose);
  ownWrapper(`${package}Wrapper specific functionality`, app, errors, ownclassWrapper, 'ownWrapper', verbose, true);
  syncTests(`${package}Wrapper sync functionality`, app, errors, init, 'syncTests', verbose, 9100, true);
  eventsTests(`${package}Wrapper events functionality`, app, errors, ownclassWrapper, 'wrapperEvents', verbose);
  localStorageTests(`${package}Wrapper localStorage functionality`, app, errors, ownclassWrapper, 'wrapperLocalStorage', verbose);
  asyncStorageTests(`${package}Wrapper asyncStorage functionality`, app, errors, ownclassWrapper, 'wrapperAsyncStorage', verbose);
  renameTests(`${package}Wrapper rename functionality`, app, errors, ownclassWrapper, 'wrapperRename', verbose, true);
  restTests(`${package}Wrapper REST functionality`, app, errors, ownclassWrapper, 'wrapperREST', verbose, 7886, true);
  socketioTests(`${package}Wrapper socket.io functionality`, app, errors, ownclassWrapper, 'wrapperSocketIo', verbose, 7886, true);

})
