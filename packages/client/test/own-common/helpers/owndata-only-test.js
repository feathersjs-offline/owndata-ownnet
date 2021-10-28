const { assert } = require('chai');
const _ = require('lodash');
const { sorter } = require('@feathersjs/adapter-commons');
const { service2 } = require('./client-service');
const setUpHooks = require('./setup-hooks');
const clone = require('./clone');
const delay = require('./delay');
const assertDeepEqualExcept = require('./assert-deep-equal-except');

const sampleLen = 5; // Size of test database (backend)

module.exports = (desc, _app, _errors, wrapper, serviceName, verbose, isBaseClass = false) => {

  let clientService;


  // This is just to ensure 100% coverage of owndata
  describe('_processQueuedEvents error handling (e.g. remote timeout)', () => {
    let data;
    let eventSort = sorter({ id: 1, uuid: 1 });

    after(() => {
      console.log('\n');
    });

    async function getRows (service) {
      let gRows = null;
      gRows = await service.find({ query: { id: { $gte: 0 }, $sort: { order: 1 } } });
      return gRows;
    }
  
    function setupServices () {
      clientService = service2(wrapper, serviceName);
      setUpHooks('REMOTE', serviceName, clientService.remote, true, verbose);
      setUpHooks('CLIENT', serviceName, clientService.local, false, verbose);

      const updatedAt = new Date();
      data = [];
      for (let i = 0, len = sampleLen; i < len; i++) {
        data.push({ id: i, uuid: 1000 + i, order: i, updatedAt });
      }

      return clientService;
    }
  
    beforeEach(() => {
      setupServices();
      return clientService.create(clone(data))
        .then(delay())
    });

    it('update works and _processQueuedEvents() waits for next try', () => {
      let clientRows = null;
      let remoteRows = null;

        // Current client side store status
        return getRows(clientService.remote)
        .then(delay())
        .then(rdata => {
          remoteRows = rdata;
        })
        // Check that order changes but uuid stays the same
        .then(() => clientService.update(0,{ id: 0, uuid: 1099, order: 99 }, { query: { _fail: true } }))
        .then(delay())
        .then(() => getRows(clientService))
        .then(delay())
        .then(rows => { 
          clientRows = rows;
          let row = data.splice(0,1);
          data[data.length] = { id: 0, uuid: 1000, order: 99 };

          assert.lengthOf(clientRows, sampleLen);
          assertDeepEqualExcept(clientRows, data, ['updatedAt', 'onServerAt']);
        })
        .then(delay())
        .then(() => clientService._processQueuedEvents())
        .then(delay())
        // See changes after queued events have been processed
        .then(() => getRows(clientService))
        .then(delay())
        .then(afterRows => {
          // Make sure remote data has not changed...
          assert.lengthOf(afterRows, sampleLen);
          let ix = afterRows.length - 1;
          assert.equal(afterRows[ix].id, 0);
          assert.equal(afterRows[ix].uuid, 1000);
          assert.equal(afterRows[ix].order, 99);
          afterRows[ix].order = 0;
          assertDeepEqualExcept(afterRows, remoteRows, ['updatedAt', 'onServerAt'], eventSort);
        })
    });

    it('update fails and _processQueuedEvents() clean-up', () => {
      let clientRows = null;

      // To be able to give this test a possibility to succeed we have to
      // build the test case by circumventing the owndata logic of clientServer...
      return clientService.local.create({ id: 99, uuid: 1099, order: 99, updatedAt: new Date(), onServerAt: new Date(0)})
        .then(delay())
        // Now we'r ready to execute
        .then(() => clientService.remove(99, { query: { _fail: true }}) )
        .then(delay())
        .then(() => clientService._processQueuedEvents())
        .then(delay())
        // See changes after queued events have been processed
        .then(() => getRows(clientService))
        .then(delay())
        .then(afterRows => {
          // Make sure remote data has changed...
          assert.lengthOf(afterRows, sampleLen);
          assertDeepEqualExcept(afterRows, data, ['updatedAt', 'onServerAt']);
        })
    });

  });

}