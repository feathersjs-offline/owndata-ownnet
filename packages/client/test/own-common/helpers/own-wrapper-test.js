const { assert, expect } = require('chai');
const _ = require('lodash');
const { omit, remove } = _;
const sorter = require('./sorter'); // require('@feathersjs/adapter-commons');
const { service2, service4 } = require('./client-service');
const setUpHooks = require('./setup-hooks');
const failCountHook = require('./fail-count-hook');
const clone = require('./clone');
const delay = require('./delay');
const assertDeepEqualExcept = require('./assert-deep-equal-except');
const errors = require('@feathersjs/errors');

const sampleLen = 5; // Size of test database (backend)

module.exports = (desc, _app, _errors, wrapper, serviceName, verbose, isBaseClass = false) => {

  let clientService;

  async function getRows (service) {
    let gRows = null;
    gRows = await service.find({ query: { id: { $gte: 0 }, $sort: { order: 1 } } });
    return gRows;
  }

  function setupServices () {
    clientService = service2(wrapper, serviceName);
    setUpHooks('REMOTE', serviceName, clientService.remote, true, verbose);
    setUpHooks('CLIENT', serviceName, clientService.local, false, verbose);

    return clientService;
  }

  describe(`${desc} - optimistic mutation`, () => {
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

    describe('General availability', () => {
      it('is CommonJS compatible', () => {
        assert.strictEqual(typeof wrapper, 'function');
      });
    });

    describe('not connected', () => {

      beforeEach(() => {
        return clientService.create(clone(data))
          .then(delay())
          .then(() => {
            clientService = app.service(serviceName);
          });
      });

      it('create do not fail', () => {
        return clientService.create({ id: 96, uuid: 1096, order: 96 }, { query: { _fail: true } })
          .then(() => {
            assert(true, 'Succeeded as expected.');
          })
          .catch(err => {
            assert(false, 'Unexpectedly failed.');
          });
      });

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
            assertDeepEqualExcept(result, data.slice(0, 3), ['updatedAt', 'onServerAt', 'deletedAt']);
            assert.lengthOf(records, sampleLen);
            assertDeepEqualExcept(records, data, ['updatedAt', 'onServerAt', 'deletedAt']);
          })
      });

      it('get works', () => {
        return clientService.get(0)
          .then(async result => {
            const records = await getRows(clientService.local);

            assertDeepEqualExcept([result], [{ id: 0, uuid: 1000, order: 0 }], ['updatedAt', 'onServerAt']);
            assert.lengthOf(records, sampleLen);
            assertDeepEqualExcept(records, data, ['updatedAt', 'onServerAt']);
          })
      });

      it('create works', () => {
        return clientService.create({ id: 99, uuid: 1099, order: 99 })
          .then(delay())
          .then(async result => {
            const records = await getRows(clientService.local);

            data[sampleLen] = { id: 99, uuid: 1099, order: 99 };

            assertDeepEqualExcept([result], [{ id: 99, uuid: 1099, order: 99 }], ['updatedAt', 'onServerAt']);

            assert.lengthOf(records, sampleLen + 1);
            assertDeepEqualExcept(records, data, ['updatedAt', 'onServerAt']);
          })
      });

      it('create adds missing uuid', () => {
        return clientService.create({ id: 99, order: 99 })
          .then(data => {
            assert.isString(data.uuid);
          })
      });

      it('create adds missing updatedAt', () => {
        return clientService.create({ id: 99, order: 99 })
          .then(data => {
            assert.isString(data.updatedAt);
          })
      });

      it('create fails with duplicate uuid', async () => {
        try {
          await clientService.create({ id: 99, order: 99, uuid: 1000 })
        } catch (error) {
          assert.strictEqual(error.name, 'BadRequest');
        }
      });

      it('update works - ignores onServerAt', () => {
        const ts = new Date();
        let beforeRows = [];
        return getRows(clientService)
          .then(rows => {
            beforeRows = rows;
          })
          .then(() => clientService.update(0, { id: 0, uuid: 1000, order: 99, onServerAt: ts }))
          .then(delay())
          .then(async result => {
            assert.ok(result.onServerAt !== ts, 'onServerAt is preserved (1)');
            assert.ok(result.id === data[0].id, 'onServerAt is preserved (1a)');
            assert.ok(result.onServerAt.toISOString() === new Date(0).toISOString(), 'onServerAt is preserved (2)');
            assertDeepEqualExcept([result], [{ id: 0, uuid: 1000, order: 99 }], ['updatedAt', 'onServerAt']);
          });
      });

      it('patch works - ignores onServerAt', () => {
        const ts = new Date();
        return clientService.patch(1, { order: 99, onServerAt: ts })
          .then(delay())
          .then(async result => {
            assert.ok(result.onServerAt !== ts, 'onServerAt is preserved (1)');
            assert.ok(result.id === data[1].id, 'onServerAt is preserved (1a)');
            assert.ok(result.onServerAt.toISOString() === new Date(0).toISOString(), 'onServerAt is preserved (2)');
            assertDeepEqualExcept([result], [{ id: 1, uuid: 1001, order: 99 }], ['updatedAt', 'onServerAt']);
          });
      });

      it('remove works', () => {
        return clientService.remove(2)
          .then(delay())
          .then(async result => {
            const records = await getRows(clientService.local);
            data.splice(2, 1);

            assertDeepEqualExcept([result], [{ id: 2, uuid: 1002, order: 2 }], ['updatedAt', 'onServerAt']);
            assert.lengthOf(records, sampleLen - 1);
            assertDeepEqualExcept(records, data, ['updatedAt', 'onServerAt']);
          });
      });
    });

    describe('without publication, null id', () => {

      beforeEach(() => {

        return clientService.create(clone(data))
      });

      it('create works', () => {
        return clientService.create([
          { id: 98, uuid: 1098, order: 98 },
          { id: 99, uuid: 1099, order: 99 }
        ])
          .then(delay())
          .then(async result => {
            const records = await getRows(clientService.local);

            data[sampleLen] = { id: 98, uuid: 1098, order: 98 };
            data[sampleLen + 1] = { id: 99, uuid: 1099, order: 99 };

            assertDeepEqualExcept(result, [
              { id: 98, uuid: 1098, order: 98 },
              { id: 99, uuid: 1099, order: 99 }
            ], ['updatedAt', 'onServerAt']);

            assert.lengthOf(records, sampleLen + 2);
            assertDeepEqualExcept(records, data, ['updatedAt', 'onServerAt']);
          })
      });

      it('patch works', () => {
        return clientService.patch(null, { foo: 1 }, { query: { order: { $gt: 0, $lt: 4 } } })
          .then(delay())
          .then(async result => {
            const records = await getRows(clientService.local);

            data[1].foo = 1;
            data[2].foo = 1;
            data[3].foo = 1;

            assertDeepEqualExcept(result, [
              { id: 1, uuid: 1001, order: 1, foo: 1 },
              { id: 2, uuid: 1002, order: 2, foo: 1 },
              { id: 3, uuid: 1003, order: 3, foo: 1 }
            ], ['updatedAt', 'onServerAt']);

            assert.lengthOf(records, sampleLen);
            assertDeepEqualExcept(records, data, ['updatedAt', 'onServerAt']);
          });
      });

      it('remove works', () => {
        return clientService.remove(null, { query: { order: { $gt: 0, $lt: 4 } } })
          .then(delay())
          .then(async result => {
            const records = await getRows(clientService.local);
            data.splice(1, 3);

            assertDeepEqualExcept(result, [
              { id: 1, uuid: 1001, order: 1 },
              { id: 2, uuid: 1002, order: 2 },
              { id: 3, uuid: 1003, order: 3 }
            ], ['updatedAt', 'onServerAt']);

            assert.lengthOf(records, sampleLen - 3);
            assertDeepEqualExcept(records, data, ['updatedAt', 'onServerAt']);
          });
      });
    });

    describe('with remote error (timeout)', () => {

      beforeEach(() => {
        return clientService.create(clone(data))
          .then(delay())
      });

      it('get succeeds correctly', () => {
        return clientService.get(0, { query: { _fail: true } })
          .then(res => {
            assert(res.id === 0, 'Succeeded as expected');
          })
          .catch(err => {
            expect(err.className).to.equal('not-found', 'Invalid id throws NotFound');
            assert(false, 'Unexpectedly failed');
          })
      });

      it('get fails correctly - unknown id', () => {
        return clientService.get(9999, { query: { _fail: true } })
          .then(() => {
            assert(false, 'Unexpectedly succeeded');
          })
          .catch(err => {
            expect(err.className).to.equal('not-found', 'Invalid id throws NotFound');
          })
      });

      it('create works and sync recovers', () => {
        let clientRows = null;
        failCountHook('REMOTE', serviceName, clientService.remote, 'create', 1, errors.Timeout, 'Fail requested by user request - simulated time-out error');

        return clientService.create({ id: 99, uuid: 1099, order: 99 })
          .then(delay())
          // Current client side store status
          .then(() => getRows(clientService))
          .then(delay())
          .then(rows => { clientRows = rows; })
          .then(() => {
            data[data.length] = { id: 99, uuid: 1099, order: 99 };

            assert.lengthOf(clientRows, sampleLen + 1);
            assertDeepEqualExcept(clientRows, data, ['updatedAt', 'onServerAt']);
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
            assertDeepEqualExcept(afterRows, clientRows, ['updatedAt', 'onServerAt']);
          })
      });

      it('update works and sync recovers', () => {
        let clientRows = null;
        failCountHook('REMOTE', serviceName, clientService.remote, 'update', 1, errors.Timeout, 'Fail requested by user request - simulated time-out error');

        return clientService.update(0, { id: 0, uuid: 1000, order: 99 })
          .then(delay())
          // We have simulated offline - make sure remote data has not yet changed...
          .then(() => getRows(clientService.remote))
          .then(delay())
          .then(fromRows => {
            assert.lengthOf(fromRows, sampleLen);
            assertDeepEqualExcept(fromRows, data, ['updatedAt', 'onServerAt']);
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
            assertDeepEqualExcept(afterRows, clientRows, ['updatedAt', 'onServerAt']);
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
            assertDeepEqualExcept(fromRows, data, ['updatedAt', 'onServerAt']);
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
              assertDeepEqualExcept(fromRows, remoteRows, ['updatedAt', 'onServerAt']);
            } else {
              // Make sure remote data has changed...
              assertDeepEqualExcept(fromRows, clientRows, ['updatedAt', 'onServerAt']);
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
            newData = remove(newData, (val, ix, arr) => val.uuid !== 1002);

            assertDeepEqualExcept(records, newData, ['updatedAt', 'onServerAt']);
          })
          // We have simulated offline - make sure remote data has not yet changed...
          .then(() => getRows(clientService.remote))
          .then(delay())
          .then(fromRows => {
            remoteRows = fromRows;
            assert.lengthOf(fromRows, sampleLen);
            assertDeepEqualExcept(fromRows, data, ['updatedAt', 'onServerAt']);
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
              assertDeepEqualExcept(fromRows, remoteRows, ['updatedAt', 'onServerAt']);
            } else {
              // Make sure remote data has changed...
              assert.lengthOf(fromRows, sampleLen - 1);
              assertDeepEqualExcept(fromRows, clientRows, ['updatedAt', 'onServerAt']);
            }
          })
      });
    });

    describe('with remote error (not timeout)', () => {

      beforeEach(() => {
        return clientService.create(clone(data))
          .then(delay())
      });

      it('get succeeds correctly', () => {
        return clientService.get(0, { query: { _badFail: true } })
          .then(res => {
            assert(res.id === 0, 'Succeeded as expected');
          })
          .catch(err => {
            expect(err.className).to.equal('not-found', 'Invalid id throws NotFound');
            assert(false, 'Unexpectedly failed');
          })
      });

      it('get fails correctly - unknown id', () => {
        return clientService.get(9999, { query: { _badFail: true } })
          .then(() => {
            assert(false, 'Unexpectedly succeeded');
          })
          .catch(err => {
            expect(err.className).to.equal('not-found', 'Invalid id throws NotFound');
          })
      });

      it('create works and sync recovers', async () => {
        let beforeRows = null;
        let afterRows = null;
        failCountHook('REMOTE', serviceName, clientService.remote, 'create', 1);

        // The server have the original 5 rows
        return getRows(clientService)
          .then(rows => { beforeRows = rows; })
          .then(clientService.create({ id: 99, uuid: 1099, order: 99 })
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
            assertDeepEqualExcept(beforeRows, afterRows, ['updatedAt', 'onServerAt']);
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
            assertDeepEqualExcept(afterRows, beforeRows, ['updatedAt', 'onServerAt']);
          })
      });

      it('update works and sync recovers', () => {
        let beforeRows = null;
        let afterRows = null;
        failCountHook('REMOTE', serviceName, clientService.remote, 'update', 1);

        // The server have the original 5 rows
        return getRows(clientService)
          .then(rows => { beforeRows = rows; })
          .then(clientService.update(0, { id: 0, uuid: 1000, order: 99 })
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
            assertDeepEqualExcept(beforeRows, afterRows, ['updatedAt', 'onServerAt']);
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
            assertDeepEqualExcept(afterRows, beforeRows, ['updatedAt', 'onServerAt']);
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
            assertDeepEqualExcept(beforeRows, afterRows, ['updatedAt', 'onServerAt']);
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
            assertDeepEqualExcept(afterRows, beforeRows, ['updatedAt', 'onServerAt']);
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
            assertDeepEqualExcept(afterRows, beforeRows, ['updatedAt', 'onServerAt']);
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
          .then(clientService.create({ id: 99, uuid: 1099, order: 99 })
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
            assertDeepEqualExcept(beforeRows, afterRows, ['updatedAt', 'onServerAt'], eventSort);
          })
      });

      it('update fails, data preserved', () => {
        let beforeRows = null;
        let afterRows = null;

        failCountHook('CLIENT-local', serviceName, clientService.local, 'update');

        return getRows(clientService)
          .then(rows => { beforeRows = rows; })
          .then(clientService.update(1, { id: 1, uuid: 1001, order: 1001 })
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
            assertDeepEqualExcept(beforeRows, afterRows, ['updatedAt', 'onServerAt'], eventSort);
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
            assertDeepEqualExcept(beforeRows, afterRows, ['updatedAt', 'onServerAt'], eventSort);
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
            assertDeepEqualExcept(beforeRows, afterRows, ['updatedAt', 'onServerAt'], eventSort);
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

        return () => clientService.update(0, { id: 0, uuid: 1000, order: 99 }, { query: { _fail: true, _timeout: true } })
          .then(delay())
          .then(() => clientService.update(0, { id: 0, uuid: 1000, order: 999 }, { query: { _fail: true, _timeout: true } }))
          .then(delay())
          .then(() => clientService.update(0, { id: 0, uuid: 1000, order: 9999 }, { query: { _fail: true, _timeout: true } }))
          .then(delay())
          // We have simulated offline - make sure remote data has not yet changed...
          .then(() => clientService.remote.find({ query: { uuid: 1000 } }))
          .then(delay())
          .then(fromRows => {
            assertDeepEqualExcept(fromRows, [{ id: 0, uuid: 1000, order: 0 }], ['updatedAt', 'onServerAt']);
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
            assertDeepEqualExcept(fromRows, clientRows, ['updatedAt', 'onServerAt']);
          })
      });
    });

    describe('test of timed sync', () => {
      let count = 0;

      it('not called without setting of timedSync', () => {
        clientService = service4(wrapper, {});
        clientService.local.on('synced', () => count++);

        count = 0;
        return delay(500)()
          .then(() => {
            expect(count).to.equal(0, 'Timed synchronization works as expected');
          })

      });

      it('called with timedSync set', () => {
        clientService = service4(wrapper, { timedSync: 250 });
        clientService.local.on('synced', () => count++);

        count = 0;
        return delay(700)(count)
          .then(startVal => {
            expect(count).to.equal(startVal + 2, 'Timed synchronization works as expected');
          })

      });
    })
  });

}