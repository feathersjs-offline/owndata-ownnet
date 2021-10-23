const { assert, expect } = require('chai');
const feathers = require('@feathersjs/feathers');
const memory = require('feathers-memory');
const _ = require('lodash');
const { omit } = _;
const sorter = require('./sorter'); // require('@feathersjs/adapter-commons');
let AsyncStorage = require('./async-storage');
global.AsyncStorage = new AsyncStorage();
const cloneDeep = require('./clone');
const delay = require('./delay');
const assertDeepEqualExcept = require('./assert-deep-equal-except');

const sampleLen = 5; // Size of test database (backend)

module.exports = (desc, _app, _errors, wrapper, serviceName, verbose, isBaseClass = false) => {

  let clientService;

  function setupServices () {
    app = feathers();
    app.use(serviceName, memory({ multi: true}));
    clientService = wrapper(app, serviceName, {storage: 'AsyncStorage'});

    return clientService;
  }

  describe(`${desc} - alternative async storage`, () => {
    let data;
    let eventSort = sorter({ id: 1, uuid: 1 });

    after(() => {
      console.log('\n');
    });

    beforeEach(() => {
      setupServices();

      const updatedAt = new Date();
      data = [];
      for (let i = 0, len = sampleLen; i < len; i++) {
        data.push({ id: i, uuid: 1000 + i, order: i, updatedAt });
      }
    });

    describe('own async local storage', () => {

      beforeEach(() => {
      });

      it('alternative async storage works', () => {
        return clientService.create(cloneDeep(data))
          .then(delay())
          .then(() => clientService.getEntries())
          .then(result => {
            assertDeepEqualExcept(data, result,
              ['onServerAt', 'updatedAt'], eventSort);
          });
      });

    });
  });

}