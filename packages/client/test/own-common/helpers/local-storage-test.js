const feathers = require('@feathersjs/feathers');
const memory = require('feathers-memory');
const _ = require('lodash');
const { sorter } = require('@feathersjs/adapter-commons');
const clone = require('./clone');
const delay = require('./delay');
const assertDeepEqualExcept = require('./assert-deep-equal-except');

// NOTE: global.localStorage is set in '../own-common.test.js'

const sampleLen = 5; // Size of test database (backend)

module.exports = (desc, _app, _errors, wrapper, serviceName, verbose, isBaseClass = false) => {

  let clientService;

  function setupServices () {
    app = feathers();
    app.use(serviceName, memory({ multi: true }));
    clientService = wrapper(app, serviceName, { storage: 'LocalStorage' });

    return clientService;
  }

  describe(`${desc} - alternative storage LocalStorage`, () => {
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

    describe('own LocalStorage', () => {

      it('alternative LocalStorage works', () => {
        return clientService.create(clone(data))
          .then(delay())
          .then(() => clientService.local.getEntries())
          .then(result => {
            assertDeepEqualExcept(data, result,
              ['onServerAt', 'updatedAt'], eventSort);
          });
      });

    });
  });

}