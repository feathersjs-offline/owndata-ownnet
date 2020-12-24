//'use strict';
const feathers = require('@feathersjs/feathers');
const errors = require('@feathersjs/errors');
const adapterTests = require('./own-common/helpers/adapter-test');
const wrapperBasic = require('./own-common/helpers/wrapper-basic-test');
const ownWrapper = require('./own-common/helpers/own-wrapper-test');
const syncTests = require('./own-common/helpers/sync-test');
const eventsTests = require('./own-common/helpers/events-test');
const localStorageTests = require('./own-common/helpers/local-storage-test');
const restTests = require('./own-common/helpers/rest-test');
const socketioTests = require('./own-common/helpers/socket-io-test');
const { Ownnet, ownnetWrapper } = require('../src/ownnet');

let package = 'ownnet';
let verbose = false;
let app;

describe(`${package}Wrapper tests`, () => {
  app = feathers();
  let testTitle = `${package}Wrapper adapterTests`
  adapterTests(testTitle, app, errors, ownnetWrapper, 'people');
  adapterTests(testTitle, app, errors, ownnetWrapper, 'people-customId', 'customId');
  adapterTests(testTitle, app, errors, ownnetWrapper, 'people-uuid', 'uuid');

  wrapperBasic(`${package}Wrapper basic functionality`, app, errors, ownnetWrapper, 'wrapperBasic', verbose);
  ownWrapper(`${package}Wrapper specific functionality`, app, errors, ownnetWrapper, 'ownWrapper', verbose);
  syncTests(`${package}Wrapper sync functionality`, app, errors, Ownnet, 'syncTests', verbose, 9300);
  eventsTests(`${package}Wrapper events functionality`, app, errors, ownnetWrapper, 'wrapperEvents', verbose);
  localStorageTests(`${package}Wrapper storage functionality`, app, errors, ownnetWrapper, 'wrapperStorage', verbose);
  restTests(`${package}Wrapper REST functionality`, app, errors, ownnetWrapper, 'wrapperREST', verbose, 7886);
  socketioTests(`${package}Wrapper socket.io functionality`, app, errors, ownnetWrapper, 'wrapperSocketIo', verbose, 7886);

})
