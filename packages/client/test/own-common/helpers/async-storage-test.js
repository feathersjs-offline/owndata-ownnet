const feathers = require('@feathersjs/feathers');
const memory = require('feathers-memory');
const _ = require('lodash');
const { sorter } = require('@feathersjs/adapter-commons');
const AsyncStorage = require('./async-storage');
const clone = require('./clone');
const delay = require('./delay');
const assertDeepEqualExcept = require('./assert-deep-equal-except');

global.AsyncStorage = new AsyncStorage();

const sampleLen = 5; // Size of test database (backend)

module.exports = (desc, _app, _errors, wrapper, serviceName, verbose, isBaseClass = false) => {

  let clientService;

  function setupServices () {
    app = feathers();
    app.use(serviceName, memory({ multi: true }));
    clientService = wrapper(app, serviceName, { storage: 'AsyncStorage' });

    return clientService;
  }

  describe(`${desc} - alternative storage AsyncStorage`, () => {
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

    describe('own AsyncStorage', () => {

      beforeEach(() => {
      });

      it('alternative AsyncStorage works', () => {
        return clientService.create(clone(data))
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