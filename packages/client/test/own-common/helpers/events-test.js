const { assert, expect } = require('chai');
const _ = require('lodash');
  const { service2 } = require('./client-service');
const setUpHooks = require('./setup-hooks');
const clone = require('./clone');
const delay = require('./delay');

const sampleLen = 5; // Size of test database (backend)

module.exports = (desc, _app, _errors, wrapper, serviceName, verbose) => {

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

  describe(`${desc} - events tests`, () => {
    let data;

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

    describe('events from wrapper itself', () => {

      beforeEach(() => {
        return clientService.create(clone(data))
          .then(delay())
          .then(() => {
            clientService = app.service(serviceName);
          });
      });

      it(`one 'created' event`, () => {
        let count = 0
        clientService.on('created', () => count++);
        return clientService.create({ id: 96, uuid: 1096, order: 96 })
          .then(() => {
            expect(count).to.equal(1, `one 'created' event as expected.`);
          })
          .catch(err => {
            assert(false, `Unexpectedly failed. ${err.name}, ${err.message}`);
          });
      });

      it(`one 'updated' event`, () => {
        let count = 0
        clientService.on('updated', () => count++);
        return clientService.update(0, { id: 0, uuid: 1000, order: 960 })
          .then(() => {
            expect(count).to.equal(1, `One 'updated' event as expected.`);
          })
          .catch(err => {
            assert(false, `Unexpectedly failed. ${err.name}, ${err.message}`);
          });
      });

      it(`one 'patched' event`, () => {
        let count = 0
        clientService.on('patched', () => count++);
        return clientService.patch(1, { order: 961 })
          .then(() => {
            expect(count).to.equal(1, `One 'patched' event as expected.`);
          })
          .catch(err => {
            assert(false, `Unexpectedly failed. ${err.name}, ${err.message}`);
          });
      });

      it(`one 'removed' event`, () => {
        let count = 0
        clientService.on('removed', () => count++);
        return clientService.remove(1, { order: 961 })
          .then(() => {
            expect(count).to.equal(1, `One 'removed' event as expected.`);
          })
          .catch(err => {
            assert(false, `Unexpectedly failed. ${err.name}, ${err.message}`);
          });
      });
    });

    describe('events from wrapper.local', () => {

      beforeEach(() => {
        return clientService.create(clone(data))
          .then(delay())
          .then(() => {
            clientService = app.service(serviceName);
          });
      });

      it(`one 'created' event`, () => {
        let count = 0
        clientService.local.on('created', () => count++);
        return clientService.create({ id: 96, uuid: 1096, order: 96 })
          .then(() => {
            expect(count).to.equal(1, `One 'created' event as expected.`);
          })
          .catch(err => {
            assert(false, `Unexpectedly failed. ${err.name}, ${err.message}`);
          });
      });

      it(`one 'updated' event`, () => {
        let count = 0
        clientService.local.on('updated', () => count++);
        return clientService.update(0, { id: 0, uuid: 1000, order: 960 })
          .then(() => {
            expect(count).to.equal(1, `One 'updated' event as expected.`);
          })
          .catch(err => {
            assert(false, `Unexpectedly failed. ${err.name}, ${err.message}`);
          });
      });

      it(`one 'patched' event`, () => {
        let count = 0
        clientService.local.on('patched', () => count++);
        return clientService.patch(1, { order: 961 })
          .then(() => {
            expect(count).to.equal(1, `One 'patched' event as expected.`);
          })
          .catch(err => {
            assert(false, `Unexpectedly failed. ${err.name}, ${err.message}`);
          });
      });

      it(`one 'removed' event`, () => {
        let count = 0
        clientService.local.on('removed', () => count++);
        return clientService.remove(1, { order: 961 })
          .then(() => {
            expect(count).to.equal(1, `One 'removed' event as expected.`);
          })
          .catch(err => {
            assert(false, `Unexpectedly failed. ${err.name}, ${err.message}`);
          });
      });
    });

    describe('events from wrapper.remote', () => {

      beforeEach(() => {
        return clientService.create(clone(data))
          .then(delay())
          .then(() => {
            clientService = app.service(serviceName);
          });
      });

      it(`one 'created' event`, () => {
        let count = 0
        clientService.remote.on('created', () => count++);
        return clientService.create({ id: 96, uuid: 1096, order: 96 })
          .then(delay(20))
          .then(() => {
            expect(count).to.equal(1, `One 'created' event as expected.`);
          })
          .catch(err => {
            assert(false, `Unexpectedly failed. ${err.name}, ${err.message}`);
          });
      });

      it(`one 'updated' event`, () => {
        let count = 0
        clientService.remote.on('updated', () => count++);
        return clientService.update(0, { id: 0, uuid: 1000, order: 960 })
          .then(delay(20))
          .then(() => {
            expect(count).to.equal(1, `One 'updated' event as expected.`);
          })
          .catch(err => {
            assert(false, `Unexpectedly failed. ${err.name}, ${err.message}`);
          });
      });

      it(`one 'patched' event`, () => {
        let count = 0
        clientService.remote.on('patched', () => count++);
        return clientService.patch(1, { order: 961 })
          .then(delay(20))
          .then(() => {
            expect(count).to.equal(1, `One 'patched' event as expected.`);
          })
          .catch(err => {
            assert(false, `Unexpectedly failed. ${err.name}, ${err.message}`);
          });
      });

      it(`one 'removed' event`, () => {
        let count = 0
        clientService.remote.on('removed', () => count++);
        return clientService.remove(1, { order: 961 })
          .then(delay(20))
          .then(() => {
            expect(count).to.equal(1, `One 'removed' event as expected.`);
          })
          .catch(err => {
            assert(false, `Unexpectedly failed. ${err.name}, ${err.message}`);
          });
      });
    });

    describe('events from wrapper.queue', () => {

      beforeEach(() => {
        return clientService.create(clone(data))
          .then(delay())
          .then(() => {
            clientService = app.service(serviceName);
          });
      });

      it(`one 'created' event`, () => {
        let count = 0
        clientService.queue.on('created', () => count++);
        return clientService.create({ id: 96, uuid: 1096, order: 96 })
          .then(() => {
            expect(count).to.equal(1, `One 'created' event as expected.`);
          })
          .catch(err => {
            assert(false, `Unexpectedly failed. ${err.name}, ${err.message}`);
          });
      });

      it(`'updated' event not used`, () => {
        let count = 0
        clientService.queue.on('updated', () => count++);
        return clientService.update(0, { id: 0, uuid: 1000, order: 960 })
          .then(() => {
            expect(count).to.equal(0, `No 'updated' event as expected.`);
          })
          .catch(err => {
            assert(false, `Unexpectedly failed. ${err.name}, ${err.message}`);
          });
      });

      it(`'patched' event not used`, () => {
        let count = 0
        clientService.queue.on('patched', () => count++);
        return clientService.patch(1, { order: 961 })
          .then(() => {
            expect(count).to.equal(0, `No 'patched' event as expected.`);
          })
          .catch(err => {
            assert(false, `Unexpectedly failed. ${err.name}, ${err.message}`);
          });
      });

      it(`one 'removed' event`, () => {
        let count = 0
        clientService.queue.on('removed', () => count++);
        return clientService.remove(1, { order: 961 })
          .then(delay(20))
          .then(() => {
            expect(count).to.equal(1, `One 'removed' event as expected.`);
          })
          .catch(err => {
            assert(false, `Unexpectedly failed. ${err.name}, ${err.message}`);
          });
      });
    });

  });

}