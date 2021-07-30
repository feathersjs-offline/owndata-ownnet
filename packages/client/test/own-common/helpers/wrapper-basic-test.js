'use strict';
const { expect } = require('chai');
const feathers = require('@feathersjs/feathers');
const errors = require('@feathersjs/errors');
const memory = require('feathers-memory');
const delay = require('./delay');
const setUpHooks = require('./setup-hooks');
const failCountHook = require('./fail-count-hook');
const { newServicePath, service1, service2, service3 } = require('./client-service');

let app;

module.exports = (test, _app, _errors, wrapper, serviceName, verbose) => {

  let app = _app;

  describe(`${test} - client only`, () => {

    after(() => {
      console.log('\n');
    });

    beforeEach(() => {
    });

    describe('Parameter and registration tests', () => {
      it('fails with missing prior registration', () => {
        app = feathers();
        let path = newServicePath();
        try {
          wrapper(app, path, { someDummyOption: 1 });
        } catch (err) {
          expect(err.name).to.equal('Unavailable', 'Missing app parameter throws Unavailable');
        }
      });

      it('fails with missing or wrong app', () => {
        app = feathers();
        let path = newServicePath();
        app.use(path, memory());
        app.service(path);
        try {
          wrapper(path, { someDummyOption: 1 });
        } catch (err) {
          expect(err.name).to.equal('Unavailable', 'Missing app parameter throws Unavailable');
        }
        try {
          wrapper(null, path, { someDummyOption: 1 });
        } catch (err) {
          expect(err.name).to.equal('Unavailable', 'null app parameter throws Unavailable');
        }
        try {
          wrapper({}, path, { someDummyOption: 1 });
        } catch (err) {
          expect(err.name).to.equal('Unavailable', '{} app parameter throws Unavailable');
        }
        try {
          wrapper({ version: '1' }, path, { someDummyOption: 1 });
        } catch (err) {
          expect(err.name).to.equal('Unavailable', '{version:\'1\'} app parameter throws Unavailable');
        }
        try {
          wrapper({ version: '1', service: () => { } }, path, { someDummyOption: 1 });
        } catch (err) {
          expect(err.name).to.equal('Unavailable', '{version:\'1\', service: () =>{}} app parameter throws Unavailable');
        }
        try {
          wrapper({ version: '1', service: () => { }, services: [] }, path, { someDummyOption: 1 });
        } catch (err) {
          expect(err.name).to.equal('Unavailable', '{version:\'1\', service: () =>{}, services: []} app parameter throws Unavailable');
        }
      });

      it('basic functionality', () => {
        app = feathers();
        expect(typeof wrapper).to.equal('function', 'is a function');
        let obj = service1(wrapper);
        expect(typeof obj).to.equal('object', 'is an object');
      });

      it('configure (default)', () => {
        app = feathers()
        service1(wrapper);
      });

      it('configure (with options)', () => {
        let path = newServicePath();
        service2(wrapper, path)
      });

      it('gracefully ignores multiple setup()', () => {
        let path = newServicePath();
        let service = service2(wrapper, path);
        let flag = '';
        let err = { name: 'All is fine', message: 'No comments.' };
        try {
          service.setup(app, path);
          service.setup(app, path);
          flag = 'OK';
        } catch (error) {
          err = error;
          flag = 'ERROR'
        }
        expect(flag).to.equal('OK', `Unexpectedly failed to ignore multiple setup() err=${err.name}, ${err.message}`);
      });

      it('should setup wrapped service', async () => {
        app = feathers();

        let setupCalled = false;
        let passedApp;
        let passedPath;

        app.use(serviceName, {
          setup (app, path) {
            setupCalled = true;
            passedApp = app;
            passedPath = path
          }
        });
        wrapper(app, serviceName, {});

        // Force setup now
        await delay(20)();
        await app.service(serviceName).setup(app, serviceName);

        expect(setupCalled).to.equal(true, 'setup was called');
        expect(typeof passedApp).to.equals('object', 'app argument was passed');
        expect(passedPath).to.equal(serviceName, 'path argument was passed');
      });

      it('should call wrapped service hooks', async () => {
        app = feathers();

        let setupCalled = false;

        app.use(serviceName, {
          setup (app, path) {
            setupCalled = true;
          },
          find (params) {
            return [ { data: {id: 1, text: 'You won!'} } ]
          }
        });
        app.service(serviceName).hooks({
          after: {
            all: [async context => {
                context.result.data.fromHook = 'You were here!';
                return context;
              }
            ]
          }
        })
        wrapper(app, serviceName, {});

        // Force setup now
        app.service(serviceName).find()
          .then(res => {
            expect(setupCalled).to.equal(true, 'setup was called');
            expect(res.data.id).to.equal(1, 'service was called');
            expect(res.data.fromHook).to.equals('You were here', 'service called hook');
            expect(res.data.updatedAt).to.equal('string', 'updatedAt was added');
           })
      });

      it('create adds missing uuid, updatedAt, and onServerAt', () => {
        let service = service1(wrapper);

        return service.create({ id: 99, order: 99 })
          .then(data => {
            expect(typeof data.uuid).to.equal('string', 'uuid was added');
            expect(typeof data.updatedAt).to.equal('string', 'updatedAt was added');
            expect(typeof data.onServerAt).to.equal('string', 'onServerAt was added');
          })
      });

      it('fixed name works', () => {
        app = feathers();
        app.use(serviceName, memory({ multi: true }));
        let service = wrapper(app, serviceName, { fixedName: 'NameFixed' });

        return service.create({ id: 99, order: 99 })
          .then(data => {
            expect(typeof data.uuid).to.equal('string', 'uuid was added');
            expect(typeof data.updatedAt).to.equal('string', 'updatedAt was added');
            expect(typeof data.onServerAt).to.equal('string', 'onServerAt was added');
          })
      });

      it('access local', () => {
        let service = service1(wrapper);
        let localService = service.local;

        return localService.create({ id: 99, order: 99 })
          .then(data => {
            expect(data).to.deep.equal({ id: 99, order: 99 }, 'Object not changed');
          })
      });

      it('set local throws error', () => {
        let service = service1(wrapper);

        try {
          service.local = () => { return { id: 99, order: 99 } };
          expect(true).to.equal(false, 'We should not be able to get here!!');
        } catch (error) {
          expect(error.name).to.equal('Forbidden', 'Forbidden was thrown as expected');
        }
      });

      it('access queue', () => {
        let service = service1(wrapper);
        let localQueue = service.queue;

        return localQueue.create({ id: 99, order: 99 })
          .then(data => {
            expect(data).to.deep.equal({ id: 99, order: 99 }, 'Object not changed');
          })
      });

      it('set queue throws error', () => {
        let service = service1(wrapper);

        try {
          service.queue = () => { return { id: 99, order: 99 } };
          expect(true).to.equal(false, 'We should not be able to get here!!');
        } catch (error) {
          expect(error.name).to.equal('Forbidden', 'Forbidden was thrown as expected');
        }
      });

      it('access remote', () => {
        let service = service1(wrapper);
        let remoteService = service.remote;

        return remoteService.create({ id: 99, order: 99 })
          .then(data => {
            expect(data).to.deep.equal({ id: 99, order: 99 }, 'Object not changed');
          })
      });

      it('set remote throws error', () => {
        let service = service1(wrapper);

        try {
          service.remote = () => { return { id: 99, order: 99 } };
          expect(true).to.equal(false, 'We should not be able to get here!!');
        } catch (error) {
          expect(error.name).to.equal('Forbidden', 'Forbidden was thrown as expected');
        }
      });

      it('_patchIfNotRemoved() failure', async () => {
        let service = service1(wrapper);

        try {
          await service._patchIfNotRemoved(99, { order: 99 });
          expect(true).to.equal(true, 'The test passed with flying colours!');
        } catch (error) {
          expect(error.name).to.equal('Forbidden', 'Forbidden was thrown as expected');
        }
      });

    })

    describe('Non _ functions throws exception', () => {
      let service;

      beforeEach(() => {
        service = service1(wrapper);
      });

      it('update multi throws', async () => {
        try {
          await service.update(null, { b: 3 });
        } catch (error) {
          expect(error.name).to.equal('BadRequest', `${error.message}`);
        }
        try {
          await service.update(0, [{ b: 3 }, { b: 2 }]);
        } catch (error) {
          expect(error.name).to.equal('BadRequest', `${error.message}`);
        }
      });

      it('patch multi throws', () => {
        return service.patch(null, { b: 2 })
          .catch(error => {
            expect(error.name).to.equal('MethodNotAllowed', `${error.message}`);
          });
      });

      it('remove multi throws', () => {
        return service.remove(null)
          .catch(error => {
            expect(error.name).to.equal('MethodNotAllowed', `${error.message}`);
          });
      });

    });

    describe('_ functions throws exception', () => {
      let service;

      beforeEach(() => {
        service = service3(wrapper);
      });

      it('_get exists', () => {
        expect(typeof service._get).to.equal('function', '_get is not defined!');
      });

      it('_find exists', () => {
        expect(typeof service._find).to.equal('function', '_find is not defined!');
      });

      it('_create exists', () => {
        expect(typeof service._create).to.equal('function', '_create is not defined!');
      });

      it('_create multi throws', () => {
        return service._create([{ id: 99 }, { id: 98 }])
          .catch(error => {
            expect(error.name).to.equal('MethodNotAllowed', `${error.message}`);
          });
      });

      it('_update exists', () => {
        expect(typeof service._update).to.equal('function', '_update is not defined!');
      });

      it('_update multi throws', async () => {
        try {
          await service._update(null, { b: 3 });
        } catch (error) {
          expect(error.name).to.equal('BadRequest', `${error.message}`);
        }
        try {
          await service._update(0, [{ b: 3 }, { b: 2 }]);
        } catch (error) {
          expect(error.name).to.equal('BadRequest', `${error.message}`);
        }
      });

      it('_patch exists', () => {
        expect(typeof service._patch).to.equal('function', '_patch is not defined!');
      });

      it('_patch multi throws', () => {
        return service._patch(null, { b: 2 })
          .catch(error => {
            expect(error.name).to.equal('MethodNotAllowed', `${error.message}`);
          });
      });

      it('_remove exists', () => {
        expect(typeof service._remove).to.equal('function', '_remove is not defined!');
      });

      it('_remove multi throws', () => {
        return service._remove(null)
          .catch(error => {
            expect(error.name).to.equal('MethodNotAllowed', `${error.message}`);
          });
      });

    });

    describe('Misc quirky tests for high coverage', () => {
      let service;
      let path;

      beforeEach(() => {
        path = newServicePath();
        service = service2(wrapper, path);
      });

      it('parent\'s _processQueuedEvents throws', async () => {

        try {
          await service.__forTestingOnly();
          expect(true).to.equal(false, `super._processQueuedEvents() unexpectedly did not throw NotImplemented`);
        } catch (error) {
          expect(true).to.equal(true, `_processQueuedEvents() unexpectedly returned '${error.name}', '${error.message}'.`);
          expect(error.name).to.equal('NotImplemented', `Unexpectedly threw '${error.name}', '${error.message}'.`);
        }
      });

      it('_processQueuedEvents works on empty queue', async () => {
        try {
          await service._processQueuedEvents();
        } catch (error) {
          expect(false).to.equal(true, `_processQueuedEvents() unexpectedly returned '${error.name}', '${error.message}'.`);
        }
      });

      it('_processQueuedEvents handles error from remote', async () => {
        let data = [{ name: '1' }, { name: '2' }, { name: '3' }];
        failCountHook('REMOTE', path, service.remote, 'create', 1, errors.Timeout, 'Fail requested by user request - simulated time-out error');

        return service.create(data)
          .then(delay())
          .then(created => {
            expect(created.length).to.equal(3, 'Incorrect number of items created!');
          })
          .then(async () => {
            try {
              await service._processQueuedEvents();
            } catch (error) {
              expect(false).to.equal(true, `_processQueuedEvents() unexpectedly returned '${error.name}', '${error.message}'.`);
            }
          })
      });

      it('getEntries works', async () => {
        let data = [{ name: '1' }, { name: '2' }, { name: '3' }];

        return service.create(data)
          .then(delay())
          .then(created => {
            expect(created.length).to.equal(3, 'Incorrect number of items created!');
            for (let i = 0; i < 3; i++)
              expect(created[i].name).to.equal(data[i].name, `Expected created '${created[i].name}' to equal data '${data[i].name}, i=${i}'!`);
          })
          .then(() => service.getEntries())
          .then(delay())
          .then(entries => {
            expect(entries.length).to.equal(3, 'Incorrect number of entries found!');
            for (let i = 0; i < 3; i++)
              expect(entries[i].name).to.equal(data[i].name, `Expected entries '${entries[i].name}' to equal data '${data[i].name}, i=${i}'!`);
          })
      });
    });
  });
}
