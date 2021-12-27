const { assert, expect } = require('chai');
const _ = require('lodash');
const { remove } = _;
const { sorter } = require('@feathersjs/adapter-commons');
const { service5 } = require('./client-service');
const setUpHooks = require('./setup-hooks');
const failCountHook = require('./fail-count-hook');
const clone = require('./clone');
const delay = require('./delay');
const assertDeepEqualExcept = require('./assert-deep-equal-except');
const errors = require('@feathersjs/errors');

const sampleLen = 5; // Size of test database (backend)

module.exports = (desc, _app, _errors, wrapper, serviceName, verbose, isBaseClass = false) => {

  let clientService;

  // My custom control attributes
  const myUuid = 'myUuid';
  const myUpdatedAt = 'myUpdatedAt';
  const myOnServerAt = 'myOnServerAt';
  const myDeletedAt = 'myDeletedAt';

  async function getRows (service) {
    let gRows = null;
    gRows = await service.find({ query: { id: { $gte: 0 }, $sort: { order: 1 } } });
    return gRows;
  }

  function setupServices () {
    clientService = service5(wrapper, serviceName, myUuid, myUpdatedAt, myOnServerAt, myDeletedAt);
    setUpHooks('REMOTE', serviceName, clientService.remote, true, verbose);
    setUpHooks('CLIENT', serviceName, clientService.local, false, verbose);

    return clientService;
  }

  describe(`${desc} - renaming control attributes`, () => {
    let data;
    let eventSort = sorter({ id: 1, [myUuid]: 1 });

    after(() => {
      console.log('\n');
    });

    beforeEach(() => {
      setupServices();

      const updatedAt = new Date();
      data = [];
      for (let i = 0, len = sampleLen; i < len; i++) {
        data.push({ id: i, [myUuid]: 1000 + i, order: i, [myUpdatedAt]: updatedAt });
      }
    });

    describe('without error', () => {

      beforeEach(() => {
        return clientService.create(clone(data))
          .then(delay())
      });

      it('find works', async () => {
        return await clientService.find({ query: { order: { $lt: 3 } } })
          .then(async result => {
            const records = await getRows(clientService.local);
            assertDeepEqualExcept(result, data.slice(0, 3), [myUpdatedAt, myOnServerAt, myDeletedAt]);
            assert.lengthOf(records, sampleLen);
            assertDeepEqualExcept(records, data, [myUpdatedAt, myOnServerAt, myDeletedAt]);
          })
      });

      it('get works', () => {
        return clientService.get(0)
          .then(async result => {
            const records = await getRows(clientService.local);

            assertDeepEqualExcept([result], [{ id: 0, [myUuid]: 1000, order: 0 }], [myUpdatedAt, myOnServerAt]);
            assert.lengthOf(records, sampleLen);
            assertDeepEqualExcept(records, data, [myUpdatedAt, myOnServerAt]);
          })
      });

      it('create works', () => {
        return clientService.create({ id: 99, [myUuid]: 1099, order: 99 })
          .then(delay())
          .then(async result => {
            const records = await getRows(clientService.local);

            data[sampleLen] = { id: 99, [myUuid]: 1099, order: 99 };

            assertDeepEqualExcept([result], [{ id: 99, [myUuid]: 1099, order: 99 }], [myUpdatedAt, myOnServerAt]);

            assert.lengthOf(records, sampleLen + 1);
            assertDeepEqualExcept(records, data, [myUpdatedAt, myOnServerAt]);
          })
      });

      it(`create adds missing ${myUuid}`, () => {
        return clientService.create({ id: 99, order: 99 })
          .then(data => {
            assert.isString(data[myUuid]);
          })
      });

      it(`create adds missing ${myUpdatedAt}`, () => {
        return clientService.create({ id: 99, order: 99 })
          .then(data => {
            assert.strictEqual(typeof data[myUpdatedAt], 'object', `${myUpdatedAt} should be an object`);
          })
      });

      it(`create adds missing ${myOnServerAt}`, () => {
        return clientService.create({ id: 99, order: 99 })
          .then(data => {
            assert.strictEqual(typeof data[myOnServerAt], 'object', `${myOnServerAt} should be an object`);
          })
      });

      it(`create fails with duplicate ${myUuid}`, async () => {
        try {
          await clientService.create({ id: 99, order: 99, [myUuid]: 1000 })
        } catch (error) {
          assert.strictEqual(error.name, 'BadRequest');
        }
      });

      it(`update works - ignores ${myOnServerAt}`, () => {
        const ts = new Date();
        let beforeRows = [];
        return getRows(clientService)
          .then(rows => {
            beforeRows = rows;
          })
          .then(() => clientService.update(0, { id: 0, [myUuid]: 1000, order: 99, [myOnServerAt]: ts }))
          .then(delay())
          .then(async result => {
            assert.ok(result[myOnServerAt] !== ts, `${myOnServerAt} is preserved (1)`);
            assert.ok(result.id === data[0].id, `${myOnServerAt} is preserved (1a)`);
            assert.ok(result[myOnServerAt].toISOString() === new Date(0).toISOString(), `${myOnServerAt} is preserved (2)`);
            assertDeepEqualExcept([result], [{ id: 0, [myUuid]: 1000, order: 99 }], [myUpdatedAt, myOnServerAt]);
          });
      });

      it(`patch works - ignores ${myOnServerAt}`, () => {
        const ts = new Date();
        return clientService.patch(1, { order: 99, [myOnServerAt]: ts })
          .then(delay())
          .then(async result => {
            assert.ok(result[myOnServerAt] !== ts, `${myOnServerAt} is preserved (1)`);
            assert.ok(result.id === data[1].id, `${myOnServerAt} is preserved (1a)`);
            assert.ok(result[myOnServerAt].toISOString() === new Date(0).toISOString(), `${myOnServerAt} is preserved (2)`);
            assertDeepEqualExcept([result], [{ id: 1, [myUuid]: 1001, order: 99 }], [myUpdatedAt, myOnServerAt]);
          });
      });

      it('remove works', () => {
        return clientService.remove(2)
          .then(delay())
          .then(async result => {
            const records = await getRows(clientService.local);
            data.splice(2, 1);

            assertDeepEqualExcept([result], [{ id: 2, [myUuid]: 1002, order: 2 }], [myUpdatedAt, myOnServerAt]);
            assert.lengthOf(records, sampleLen - 1);
            assertDeepEqualExcept(records, data, [myUpdatedAt, myOnServerAt]);
          });
      });
    });

    describe('with remote error (timeout)', () => {

      beforeEach(() => {
        return clientService.create(clone(data))
          .then(delay())
      });

      it('create works and sync recovers', () => {
        let clientRows = null;
        failCountHook('REMOTE', serviceName, clientService.remote, 'create', 1, errors.Timeout, 'Fail requested by user request - simulated time-out error');

        return clientService.create({ id: 99, [myUuid]: 1099, order: 99 })
          .then(delay())
          // Current client side store status
          .then(() => getRows(clientService))
          .then(delay())
          .then(rows => { clientRows = rows; })
          .then(() => {
            data[data.length] = { id: 99, [myUuid]: 1099, order: 99 };

            assert.lengthOf(clientRows, sampleLen + 1);
            assertDeepEqualExcept(clientRows, data, [myUpdatedAt, myOnServerAt]);
          })
          .then(delay())
          .then(() => clientService.sync())
          .then(delay())
          // See changes after synchronization
          .then(() => getRows(clientService))
          .then(delay())
          .then(afterRows => {
            // Make sure remote data has changed...
            assert.lengthOf(afterRows, sampleLen + 1);
            assertDeepEqualExcept(afterRows, clientRows, [myUpdatedAt, myOnServerAt]);
          })
      });

      it('update works and sync recovers', () => {
        let clientRows = null;
        failCountHook('REMOTE', serviceName, clientService.remote, 'update', 1, errors.Timeout, 'Fail requested by user request - simulated time-out error');

        return clientService.update(0, { id: 0, [myUuid]: 1000, order: 99 })
          .then(delay())
          // We have simulated offline - make sure remote data has not yet changed...
          .then(() => getRows(clientService.remote))
          .then(delay())
          .then(fromRows => {
            assert.lengthOf(fromRows, sampleLen);
            assertDeepEqualExcept(fromRows, data, [myUpdatedAt, myOnServerAt]);
          })
          // Current client side store status
          .then(() => getRows(clientService.local))
          .then(delay())
          .then(rows => { clientRows = rows; })
          .then(delay())
          // See changes after synchronization
          .then(() => clientService.sync())
          .then(delay())
          .then(() => getRows(clientService))
          .then(delay())
          .then(afterRows => {
            // Make sure remote data has changed...
            assert.lengthOf(afterRows, sampleLen);
            assertDeepEqualExcept(afterRows, clientRows, [myUpdatedAt, myOnServerAt]);
          })
      });

      it('patch works and sync recovers', () => {
        let clientRows = [];
        let remoteRows = [];
        failCountHook('REMOTE', serviceName, clientService.remote, 'patch', 1, errors.Timeout, 'Fail requested by user request - simulated time-out error');

        return clientService.patch(1, { order: 99 })
          .then(delay())
          // Current client side store status
          .then(() => getRows(clientService.local))
          .then(delay())
          .then(rows => { clientRows = rows; })
          .then(() => {
            assert.lengthOf(clientRows, sampleLen);
          })
          // We have simulated offline - make sure remote data has not yet changed...
          .then(() => getRows(clientService.remote))
          .then(delay())
          .then(fromRows => {
            remoteRows = fromRows;
            assert.lengthOf(fromRows, sampleLen);
            assertDeepEqualExcept(fromRows, data, [myUpdatedAt, myOnServerAt]);
          })
          .then(() => clientService.sync())
          .then(delay(20))
          // See changes after synchronization
          .then(() => getRows(clientService.remote))
          .then(delay())
          .then(fromRows => {
            assert.lengthOf(fromRows, sampleLen);
            if (isBaseClass) {
              // Make sure remote data has not changed due to dummy _processQueuedEvents()...
              assertDeepEqualExcept(fromRows, remoteRows, [myUpdatedAt, myOnServerAt]);
            } else {
              // Make sure remote data has changed...
              assertDeepEqualExcept(fromRows, clientRows, [myUpdatedAt, myOnServerAt]);
            }
          })
      });

      it('remove works and sync recovers', () => {
        let clientRows = [];
        let remoteRows = [];
        failCountHook('REMOTE', serviceName, clientService.remote, 'remove', 1, errors.Timeout, 'Fail requested by user request - simulated time-out error');

        return clientService.remove(2)
          .then(delay())
          .then(async () => {
            const records = await getRows(clientService.local);

            assert.lengthOf(records, sampleLen - 1);

            // Remove uuid=1002 from sample data
            let newData = JSON.parse(JSON.stringify(data));
            newData = remove(newData, (val, ix, arr) => val[myUuid] !== 1002);

            assertDeepEqualExcept(records, newData, [myUpdatedAt, myOnServerAt]);
          })
          // We have simulated offline - make sure remote data has not yet changed...
          .then(() => getRows(clientService.remote))
          .then(delay())
          .then(fromRows => {
            remoteRows = fromRows;
            assert.lengthOf(fromRows, sampleLen);
            assertDeepEqualExcept(fromRows, data, [myUpdatedAt, myOnServerAt]);
          })
          // Current client side store status
          .then(() => getRows(clientService.local))
          .then(delay())
          .then(rows => { clientRows = rows; })
          // See changes after synchronization
          .then(() => clientService.sync())
          .then(() => delay())
          .then(() => getRows(clientService.remote))
          .then(delay())
          .then(fromRows => {
            if (isBaseClass) {
              // Make sure remote data has not changed due to dummy _processQueuedEvents()...
              assert.lengthOf(fromRows, sampleLen);
              assertDeepEqualExcept(fromRows, remoteRows, [myUpdatedAt, myOnServerAt]);
            } else {
              // Make sure remote data has changed...
              assert.lengthOf(fromRows, sampleLen - 1);
              assertDeepEqualExcept(fromRows, clientRows, [myUpdatedAt, myOnServerAt]);
            }
          })
      });
    });

    describe('with remote error (not timeout)', () => {

      beforeEach(() => {
        return clientService.create(clone(data))
          .then(delay())
      });

      it('create works and sync recovers', async () => {
        let beforeRows = null;
        let afterRows = null;
        failCountHook('REMOTE', serviceName, clientService.remote, 'create', 1);

        // The server have the original 5 rows
        return getRows(clientService)
          .then(rows => { beforeRows = rows; })
          .then(clientService.create({ id: 99, [myUuid]: 1099, order: 99 })
            // We get any error but a Timeout - we have to revert any change
            .catch(error => {
              expect(true).to.equal(false, `This should not happen! Received error '${error.name}'`);
            })
          )
          .then(delay())
          // Current client side store status
          .then(() => getRows(clientService))
          .then(rows => { afterRows = rows; })
          .then(() => {
            assert.lengthOf(beforeRows, sampleLen);
            assert.lengthOf(afterRows, sampleLen);
            assertDeepEqualExcept(beforeRows, afterRows, [myUpdatedAt, myOnServerAt]);
          })
          .then(delay())
          .then(() => clientService.sync())
          .then(delay())
          // See changes after synchronization
          .then(() => getRows(clientService.remote))
          .then(delay())
          .then(afterRows => {
            // Make sure remote data has not changed...
            assert.lengthOf(afterRows, sampleLen);
            assertDeepEqualExcept(afterRows, beforeRows, [myUpdatedAt, myOnServerAt]);
          })
      });

      it('update works and sync recovers', () => {
        let beforeRows = null;
        let afterRows = null;
        failCountHook('REMOTE', serviceName, clientService.remote, 'update', 1);

        // The server have the original 5 rows
        return getRows(clientService)
          .then(rows => { beforeRows = rows; })
          .then(clientService.update(0, { id: 0, [myUuid]: 1000, order: 99 })
            // We get any error but a Timeout - we have to revert any change
            .catch(error => {
              expect(true).to.equal(false, `This should not happen! Received error '${error.name}'`);
            })
          )
          .then(delay())
          .then(() => getRows(clientService))
          .then(rows => { afterRows = rows; })
          .then(() => {
            assert.lengthOf(beforeRows, sampleLen);
            assert.lengthOf(afterRows, sampleLen);
            assertDeepEqualExcept(beforeRows, afterRows, [myUpdatedAt, myOnServerAt]);
          })
          .then(delay())
          .then(() => clientService.sync())
          .then(delay())
          // See changes after synchronization
          .then(() => getRows(clientService.remote))
          .then(delay())
          .then(afterRows => {
            // Make sure remote data has not changed...
            assert.lengthOf(afterRows, sampleLen);
            assertDeepEqualExcept(afterRows, beforeRows, [myUpdatedAt, myOnServerAt]);
          })
      })

      it('patch works and sync recovers', () => {
        let beforeRows = null;
        let afterRows = null;
        failCountHook('REMOTE', serviceName, clientService.remote, 'patch', 1);

        // The server have the original 5 rows
        return getRows(clientService)
          .then(rows => { beforeRows = rows; })
          .then(clientService.patch(1, { order: 99 })
            // We get any error but a Timeout - we have to revert any change
            .catch(error => {
              expect(true).to.equal(false, `This should not happen! Received error '${error.name}'`);
            })
          )
          .then(delay())
          // Current client side store status
          .then(delay())
          .then(() => getRows(clientService))
          .then(rows => { afterRows = rows; })
          .then(() => {
            assert.lengthOf(beforeRows, sampleLen);
            assert.lengthOf(afterRows, sampleLen);
            assertDeepEqualExcept(beforeRows, afterRows, [myUpdatedAt, myOnServerAt]);
          })
          .then(delay())
          .then(() => clientService.sync())
          .then(delay())
          // See changes after synchronization
          .then(() => getRows(clientService.remote))
          .then(delay())
          .then(afterRows => {
            // Make sure remote data has not changed...
            assert.lengthOf(afterRows, sampleLen);
            assertDeepEqualExcept(afterRows, beforeRows, [myUpdatedAt, myOnServerAt]);
          })
      });

      it('remove works and sync recovers', () => {
        let beforeRows = null;
        let afterRows = null;
        failCountHook('REMOTE', serviceName, clientService.remote, 'remove', 1);

        return getRows(clientService)
          .then(rows => { beforeRows = rows; })
          .then(clientService.remove(2)
            .catch(error => {
              expect(true).to.equal(false, `This should not happen! Received error '${error.name}'`);
            })
          )
          .then(delay())
          // Current client side store status
          .then(delay())
          .then(() => getRows(clientService))
          .then(rows => { afterRows = rows; })
          .then(() => {
            assert.lengthOf(beforeRows, sampleLen);
            assert.lengthOf(afterRows, sampleLen);
          })
          .then(delay())
          .then(() => clientService.sync())
          .then(delay())
          // See changes after synchronization
          .then(() => getRows(clientService.remote))
          .then(delay())
          .then(afterRows => {
            // Make sure remote data has not changed but client-side has...
            assert.lengthOf(afterRows, sampleLen);
            assertDeepEqualExcept(afterRows, beforeRows, [myUpdatedAt, myOnServerAt]);
          })
      });
    });

    describe('with local error', () => {

      beforeEach(async () => {
        clientService = setupServices();
        await clientService.create(clone(data));
      });

      it('Create fails, data preserved', async () => {
        let beforeRows = null;
        let afterRows = null;

        failCountHook('CLIENT-local', serviceName, clientService.local, 'create');

        return getRows(clientService)
          .then(rows => { beforeRows = rows; })
          .then(clientService.create({ id: 99, [myUuid]: 1099, order: 99 })
            .catch(error => {
              expect(error.name).to.equal('GeneralError', `We expect a 'GeneralError' but got '${error.name}'`);
            })
          )
          .then(delay())
          .then(() => getRows(clientService.local))
          .then(rows => { afterRows = rows; })
          .then(() => {
            assert.lengthOf(beforeRows, sampleLen);
            assert.lengthOf(afterRows, sampleLen);
            assertDeepEqualExcept(beforeRows, afterRows, [myUpdatedAt, myOnServerAt], eventSort);
          })
      });

      it('update fails, data preserved', () => {
        let beforeRows = null;
        let afterRows = null;

        failCountHook('CLIENT-local', serviceName, clientService.local, 'update');

        return getRows(clientService)
          .then(rows => { beforeRows = rows; })
          .then(clientService.update(1, { id: 1, [myUuid]: 1001, order: 1001 })
            .catch(error => {
              expect(error.name).to.equal('GeneralError', `We expect a 'GeneralError' but got '${error.name}'`);
            })
          )
          .then(delay())
          .then(() => getRows(clientService.local))
          .then(rows => { afterRows = rows; })
          .then(() => {
            assert.lengthOf(beforeRows, sampleLen);
            assert.lengthOf(afterRows, sampleLen);
            assertDeepEqualExcept(beforeRows, afterRows, [myUpdatedAt, myOnServerAt], eventSort);
          })
      });

      it('patch fails, data preserved', async () => {
        let beforeRows = null;
        let afterRows = null;

        await delay(50)(); // Let things settle - we use patch internally to consolidate results returned from remote
        failCountHook('CLIENT-local', serviceName, clientService.local, 'patch');

        return getRows(clientService.local)
          .then(rows => { beforeRows = rows; })
          .then(() => clientService.patch(2, { order: 1002 })
            .catch(error => {
              expect(error.name).to.equal('GeneralError', `We expect a 'GeneralError' but got '${error.name}'`);
            })
          )
          .then(delay())
          .then(() => getRows(clientService.local))
          .then(rows => { afterRows = rows; })
          .then(() => {
            assert.lengthOf(beforeRows, sampleLen);
            assert.lengthOf(afterRows, sampleLen);
            assertDeepEqualExcept(beforeRows, afterRows, [myUpdatedAt, myOnServerAt], eventSort);
          })
      });

      it('remove fails, data preserved', () => {
        let beforeRows = null;
        let afterRows = null;

        failCountHook('CLIENT-local', serviceName, clientService.local, 'remove', 1);

        return getRows(clientService)
          .then(rows => { beforeRows = rows; })
          .then(clientService.remove(3)
            .catch(error => {
              expect(error.name).to.equal('GeneralError', `We expect a 'GeneralError' but got '${error.name}'`);
            })
          )
          .then(delay())
          .then(() => getRows(clientService.local))
          .then(rows => { afterRows = rows; })
          .then(() => {
            assert.lengthOf(beforeRows, sampleLen);
            assert.lengthOf(afterRows, sampleLen);
            assertDeepEqualExcept(beforeRows, afterRows, [myUpdatedAt, myOnServerAt], eventSort);
          })
      });
    });

    describe('test of sync', () => {

      beforeEach(() => {
        return clientService.create(clone(data))
          .then(delay())
      });

      it('sync all', () => {
        let clientRows = null;
        let countEvents = 0;

        return () => clientService.update(0, { id: 0, [myUuid]: 1000, order: 99 }, { query: { _fail: true, _timeout: true } })
          .then(delay())
          .then(() => clientService.update(0, { id: 0, [myUuid]: 1000, order: 999 }, { query: { _fail: true, _timeout: true } }))
          .then(delay())
          .then(() => clientService.update(0, { id: 0, [myUuid]: 1000, order: 9999 }, { query: { _fail: true, _timeout: true } }))
          .then(delay())
          // We have simulated offline - make sure remote data has not yet changed...
          .then(() => clientService.remote.find({ query: { [myUuid]: 1000 } }))
          .then(delay())
          .then(fromRows => {
            assertDeepEqualExcept(fromRows, [{ id: 0, [myUuid]: 1000, order: 0 }], [myUpdatedAt, myOnServerAt]);
          })
          // Current client side store status
          .then(() => getRows(clientService))
          .then(delay())
          .then(rows => { clientRows = rows; })
          .then(() => {
            clientService.on('updated', () => {
              countEvents++;
            });
          })
          .then(async () => await clientService.sync())
          .then(delay())
          // See changes after synchronization
          .then(() => getRows(clientService.remote))
          .then(delay())
          .then(fromRows => {
            // Make sure remote data has changed...
            assert.lengthOf(clientRows, sampleLen);
            assert.equal(countEvents, 3);
            assert.lengthOf(fromRows, sampleLen);
            assertDeepEqualExcept(fromRows, clientRows, [myUpdatedAt, myOnServerAt]);
          })
      });
    });

  });

}