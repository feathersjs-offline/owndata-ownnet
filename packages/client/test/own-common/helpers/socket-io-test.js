import { strict as assert } from 'assert';
import io from 'socket.io-client';

const feathers = require('@feathersjs/feathers');
const socketio = require('@feathersjs/socketio');
const socketioClient = require('@feathersjs/socketio-client');
const memory = require('feathers-memory');
const delay = require('./delay');

module.exports = (desc, _app, _errors, wrapperFn, serviceName, verbose, port = 7886, isBaseClass = false, noServerWrapper = true) => {

  describe(desc, () => {
    const url = `http://localhost:${port}`;

    let app = null;
    let cApp = null;
    let server = null;

    beforeEach(done => {
      app = feathers();
      app.configure(socketio());

      app.use(serviceName, memory());
      app.service(serviceName);

      server = app.listen(port);

      server.on('listening', () => {
        cApp = feathers();
        const socket = io(url);
        cApp.configure(socketioClient(socket));
        done();
      });
    });

    afterEach(done => {
      server.close();
      app = null;
      cApp = null;
      done();
    });

    after(() => {
      console.log(' ');
    })

    it('can call service', () => {
      let id = undefined;
      app.service(serviceName);
      wrapperFn(cApp, serviceName, { dates: true });

      return cApp.service(serviceName).create({ firstName: 'Fred', lastName: 'Flintstone' })
        .then(res => {
          id = res.id;
          assert.deepStrictEqual(res.firstName, 'Fred');
          assert.deepStrictEqual(res.lastName, 'Flintstone');
          assert.deepStrictEqual(typeof res.onServerAt, 'object');
          assert.deepStrictEqual(typeof res.updatedAt, 'object');
          assert.deepStrictEqual(typeof res.uuid, 'string');
        })
        // Make sure the server is updated...
        .then(() => cApp.service(serviceName).sync(true, noServerWrapper))
        // Simulate server wrapper (by updating 'onServerAt')
        .then(() => app.service(serviceName).patch(id, { onServerAt: new Date(1).toISOString() }))
        // Now perform a sync operation...
        .then(() => cApp.service(serviceName).sync(true, noServerWrapper))
        // Now the local DB should reflect the service wrappers changes
        // First we check the data on the server
        .then(() => app.service(serviceName).find({ query: { onServerAt: { $gt: new Date(0).toISOString() } } }))
        .then(results => {
          let res = results[0];
          assert.deepStrictEqual(res.id, id);
          assert.deepStrictEqual(res.firstName, 'Fred');
          assert.deepStrictEqual(res.lastName, 'Flintstone');
          // These Date's will be converted to strings over socket-io...
          assert.deepStrictEqual(typeof res.onServerAt, 'string');
          assert.equal(res.onServerAt, new Date(1).toISOString());
          assert.deepStrictEqual(typeof res.updatedAt, 'string');
          assert.deepStrictEqual(typeof res.uuid, 'string');
        })
        // Second we check the data on the client (will be converted to objects)
        .then(() => cApp.service(serviceName).find())
        .then(results => {
          let res = results[0];
          // assert.deepStrictEqual(res.id, id);
          assert.deepStrictEqual(res.firstName, 'Fred');
          assert.deepStrictEqual(res.lastName, 'Flintstone');
          assert.equal(res.onServerAt.toISOString(), new Date(1).toISOString());
          // We re-create these Date's from String's...
          assert.deepStrictEqual(typeof res.onServerAt, 'object', `onServerAt ought to be an 'object'`);
          assert.deepStrictEqual(typeof res.updatedAt, 'object');
          assert.deepStrictEqual(typeof res.uuid, 'string');
        })
    })

    it('activates wrapped services hook', () => {
      cApp.service(serviceName).hooks({
        before: {
          create: [async context => {
            context.data.fromHook = 'You were here!';
            return context;
          }
          ]
        }
      });
      wrapperFn(cApp, serviceName, { dates: true });

      return cApp.service(serviceName).create({ firstName: 'Wilma', lastName: 'Flintstone' })
        .then(res => {
          assert.deepStrictEqual(res.firstName, 'Wilma');
          assert.deepStrictEqual(res.lastName, 'Flintstone');
          assert.deepStrictEqual(res.fromHook, 'You were here!');
          assert.deepStrictEqual(typeof res.onServerAt, 'object');
          assert.deepStrictEqual(typeof res.updatedAt, 'object');
          assert.deepStrictEqual(typeof res.uuid, 'string');
        })
        .then(() => cApp.service(serviceName).sync(true, noServerWrapper))
        .then(delay())
        .then(() => cApp.service(serviceName).find())
        .then(results => {
          let res = results[0];
          assert.deepStrictEqual(res.firstName, 'Wilma');
          assert.deepStrictEqual(res.lastName, 'Flintstone');
          assert.deepStrictEqual(res.fromHook, 'You were here!');
          assert.deepStrictEqual(typeof res.onServerAt, 'object');
          assert.deepStrictEqual(typeof res.updatedAt, 'object');
          assert.deepStrictEqual(typeof res.uuid, 'string');
        })
    });

    it('wrapped service triggers event handlers', () => {
      let flag = false;
      wrapperFn(cApp, serviceName, { dates: true });
      cApp.service(serviceName).on('created', () => { flag = true; });

      return cApp.service(serviceName).create({ firstName: 'Barney', lastName: 'Rubbles' })
        .then(res => {
          assert.deepStrictEqual(typeof res.create, 'undefined');
          assert.deepStrictEqual(res.firstName, 'Barney');
          assert.deepStrictEqual(res.lastName, 'Rubbles');
          assert.deepStrictEqual(typeof res.onServerAt, 'object');
          assert.deepStrictEqual(typeof res.updatedAt, 'object');
          assert.deepStrictEqual(typeof res.uuid, 'string');
          assert.deepStrictEqual(flag, true);
        })
        .then(() => cApp.service(serviceName).sync(true, noServerWrapper))
        .then(delay())
        .then(() => cApp.service(serviceName).find())
        .then(results => {
          let res = results[0];
          assert.deepStrictEqual(res.firstName, 'Barney');
          assert.deepStrictEqual(res.lastName, 'Rubbles');
          assert.deepStrictEqual(typeof res.onServerAt, 'object');
          assert.deepStrictEqual(typeof res.updatedAt, 'object');
          assert.deepStrictEqual(typeof res.uuid, 'string');
        })
    });

  });
}
