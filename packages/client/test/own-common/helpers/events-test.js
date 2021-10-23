const { assert, expect } = require('chai');
const { service2a } = require('./client-service');
const setUpHooks = require('./setup-hooks');
const clone = require('./clone');
const delay = require('./delay');

const sampleLen = 5; // Size of test database (backend)

module.exports = (desc, _app, _errors, wrapper, serviceName, verbose) => {

  function setupServices () {
    let { service, path } = service2a(wrapper, serviceName);
    // setUpHooks('REMOTE', path, service.remote, true, verbose);
    // setUpHooks('CLIENT', path, service.local, false, verbose);

    return service;
  }

  const updatedAt = new Date();
  let data = [];
  for (let i = 0, len = sampleLen; i < len; i++) {
    data.push({ id: i, uuid: 1000 + i, order: i, updatedAt });
  };

  describe(`${desc} - events tests`, () => {

    after(() => {
      console.log('\n');
    });

    describe('events from wrapper itself', () => {

      it(`one 'created' event`, async () => {
        let count = 0;
        let clientService = setupServices();
        await clientService.create(clone(data));

        clientService.on('created', () => count++);

        return clientService.create({ id: 96, uuid: 1096, order: 96 })
          .then(() => {
            expect(count).to.equal(1, `one 'created' event expected.`);
          })
          .catch(err => {
            assert(false, `Unexpectedly failed. ${err.name}, ${err.message}`);
          });
      });

      it(`one 'updated' event`, async () => {
        let count = 0;
        let clientService = setupServices();
        await clientService.create(clone(data));
        clientService.on('updated', () => count++);

        return clientService.update(0, { id: 0, uuid: 1000, order: 960 })
          .then(() => {
            expect(count).to.equal(1, `One 'updated' event expected.`);
          })
          .catch(err => {
            assert(false, `Unexpectedly failed. ${err.name}, ${err.message}`);
          });
      });

      it(`one 'patched' event`, async () => {
        let count = 0;
        let clientService = setupServices();
        await clientService.create(clone(data));
        clientService.on('patched', () => count++);

        return clientService.patch(1, { order: 961 })
          .then(() => {
            expect(count).to.equal(1, `One 'patched' event expected.`);
          })
          .catch(err => {
            assert(false, `Unexpectedly failed. ${err.name}, ${err.message}`);
          });
      });

      it(`one 'removed' event`, async () => {
        let count = 0;
        let clientService = setupServices();
        await clientService.create(clone(data));
        clientService.on('removed', () => count++);

        return clientService.remove(1, { order: 961 })
          .then(() => {
            expect(count).to.equal(1, `One 'removed' event expected.`);
          })
          .catch(err => {
            assert(false, `Unexpectedly failed. ${err.name}, ${err.message}`);
          });
      });
    });

    describe('events from wrapper.local', () => {

      it(`one 'created' event`, async () => {
        let count = 0;
        let clientService = setupServices();
        await clientService.create(clone(data));
        await delay(20)();  // Let the dust settle...
        clientService.local.on('created', () => count++);

        return clientService.create({ id: 96, uuid: 1096, order: 96 })
          .then(() => {
            expect(count).to.equal(1, `One 'created' event expected.`);
          })
          .catch(err => {
            assert(false, `Unexpectedly failed. ${err.name}, ${err.message}`);
          });
      });

      it(`one 'updated' event`, async () => {
        let count = 0;
        let clientService = setupServices();
        await clientService.create(clone(data));
        await delay(20)();  // Let the dust settle...
        clientService.local.on('updated', () => count++);

        return clientService.update(0, { id: 0, uuid: 1000, order: 960 })
          .then(() => {
            expect(count).to.equal(1, `One 'updated' event expected.`);
          })
          .catch(err => {
            assert(false, `Unexpectedly failed. ${err.name}, ${err.message}`);
          });
      });

      it(`one 'patched' event`, async () => {
        let count = 0;
        let clientService = setupServices();
        await clientService.create(clone(data));
        await delay(20)();  // Let the dust settle...
        clientService.local.on('patched', () => count++);

        return clientService.patch(1, { order: 961 })
          .then(() => {
            expect(count).to.equal(1, `One 'patched' event expected.`);
          })
          .catch(err => {
            assert(false, `Unexpectedly failed. ${err.name}, ${err.message}`);
          });
      });

      it(`one 'removed' event`, async () => {
        let count = 0;
        let clientService = setupServices();
        await clientService.create(clone(data));
        await delay(20)();  // Let the dust settle...
        clientService.local.on('removed', () => count++);

        return clientService.remove(1, { order: 961 })
          .then(() => {
            expect(count).to.equal(1, `One 'removed' event expected.`);
          })
          .catch(err => {
            assert(false, `Unexpectedly failed. ${err.name}, ${err.message}`);
          });
      });
    });

    describe('events from wrapper.remote', () => {

      it(`one 'created' event`, async () => {
        let count = 0;
        let clientService = setupServices();
        await clientService.create(clone(data));
        await delay(20)();  // Let the dust settle...
        clientService.remote.on('created', () => count++);

        return clientService.create({ id: 96, uuid: 1096, order: 96 })
          .then(delay(20))
          .then(() => {
            expect(count).to.equal(1, `One 'created' event expected.`);
          })
          .catch(err => {
            assert(false, `Unexpectedly failed. ${err.name}, ${err.message}`);
          });
      });

      it(`one 'updated' event`, async () => {
        let count = 0;
        let clientService = setupServices();
        await clientService.create(clone(data));
        await delay(20)();  // Let the dust settle...
        clientService.remote.on('updated', () => count++);

        return clientService.update(0, { id: 0, uuid: 1000, order: 960 })
          .then(delay(20))
          .then(() => {
            expect(count).to.equal(1, `One 'updated' event expected.`);
          })
          .catch(err => {
            assert(false, `Unexpectedly failed. ${err.name}, ${err.message}`);
          });
      });

      it(`one 'patched' event`, async () => {
        let count = 0;
        let clientService = setupServices();
        await clientService.create(clone(data));
        await delay(20)();  // Let the dust settle...
        clientService.remote.on('patched', () => count++);

        return clientService.patch(1, { order: 961 })
          .then(delay(20))
          .then(() => {
            expect(count).to.equal(1, `One 'patched' event expected.`);
          })
          .catch(err => {
            assert(false, `Unexpectedly failed. ${err.name}, ${err.message}`);
          });
      });

      it(`one 'removed' event`, async () => {
        let count = 0;
        let clientService = setupServices();
        await clientService.create(clone(data));
        await delay(20)();  // Let the dust settle...
        clientService.remote.on('removed', () => count++);

        return clientService.remove(1, { order: 961 })
          .then(delay(20))
          .then(() => {
            expect(count).to.equal(1, `One 'removed' event expected.`);
          })
          .catch(err => {
            assert(false, `Unexpectedly failed. ${err.name}, ${err.message}`);
          });
      });
    });

    describe('events from wrapper.queue', () => {

      it(`one 'created' event`, async () => {
        let count = 0;
        let clientService = setupServices();
        await clientService.create(clone(data));
        await delay(20)();  // Let the dust settle...
        clientService.queue.on('created', () => count++);

        return clientService.create({ id: 96, uuid: 1096, order: 96 })
          .then(() => {
            expect(count).to.equal(1, `One 'created' event expected.`);
          })
          .catch(err => {
            assert(false, `Unexpectedly failed. ${err.name}, ${err.message}`);
          });
      });

      it(`'updated' event not used`, async () => {
        let count = 0;
        let clientService = setupServices();
        await clientService.create(clone(data));
        await delay(20)();  // Let the dust settle...
        clientService.queue.on('updated', () => count++);

        return clientService.update(0, { id: 0, uuid: 1000, order: 960 })
          .then(() => {
            // We don not expect any 'updated' events due to wrapper logic...
            expect(count).to.equal(0, `No 'updated' event expected.`);
          })
          .catch(err => {
            assert(false, `Unexpectedly failed. ${err.name}, ${err.message}`);
          });
      });

      it(`'patched' event not used`, async () => {
        let count = 0;
        let clientService = setupServices();
        
        await clientService.create(clone(data));
        await delay(20)();  // Let the dust settle...
        clientService.queue.on('patched', () => count++);
        return clientService.patch(1, { order: 961 })
          .then(() => {
            // We don not expect any 'patchxed' events due to wrapper logic...
            expect(count).to.equal(0, `No 'patched' event expected.`);
          })
          .catch(err => {
            assert(false, `Unexpectedly failed. ${err.name}, ${err.message}`);
          });
      });

      it(`one 'removed' event`, async () => {
        let count = 0;
        let clientService = setupServices();
        await clientService.create(clone(data));
        await delay(20)();  // Let the dust settle...
        clientService.queue.on('removed', () => count++);

        return clientService.remove(1, { order: 961 })
          .then(delay(20))
          .then(() => {
            expect(count).to.equal(1, `One 'removed' event expected.`);
          })
          .catch(err => {
            assert(false, `Unexpectedly failed. ${err.name}, ${err.message}`);
          });
      });
    });

  });

}