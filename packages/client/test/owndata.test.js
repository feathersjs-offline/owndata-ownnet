//'use strict';
const feathers = require('@feathersjs/feathers');
const errors = require('@feathersjs/errors');
const adapterTests = require('./own-common/helpers/adapter-test');
const wrapperBasic = require('./own-common/helpers/wrapper-basic-test');
const ownWrapper = require('./own-common/helpers/own-wrapper-test');
const syncTests = require('./own-common/helpers/sync-test');
const eventsTests = require('./own-common/helpers/events-test');
const localStorageTests = require('./own-common/helpers/local-storage-test');
const owndataOnlyTests = require('./own-common/helpers/owndata-only-test');
const { Owndata, owndataWrapper } = require('../src/owndata');

let package = 'owndata';
let verbose = false;
let app;

describe(`${package}Wrapper tests`, () => {
  app = feathers();
  let testTitle = `${package}Wrapper adapterTests`
  adapterTests(testTitle, app, errors, owndataWrapper, 'people');
  adapterTests(testTitle, app, errors, owndataWrapper, 'people-customId', 'customId');
  adapterTests(testTitle, app, errors, owndataWrapper, 'people-uuid', 'uuid');

  wrapperBasic(`${package}Wrapper basic functionality`, app, errors, owndataWrapper, 'wrapperBasic', verbose);
  ownWrapper(`${package}Wrapper specific functionality`, app, errors, owndataWrapper, 'ownWrapper', verbose);
  syncTests(`${package}Wrapper sync functionality`, app, errors, Owndata, 'syncTests', verbose, 9200);
  eventsTests(`${package}Wrapper events functionality`, app, errors, owndataWrapper, 'wrapperEvents', verbose);
  localStorageTests(`${package}Wrapper storage functionality`, app, errors, owndataWrapper, 'wrapperStorage', verbose);

  owndataOnlyTests(`${package}Wrapper only functionality`, app, errors, owndataWrapper, 'wrapperOnly', verbose);

})
