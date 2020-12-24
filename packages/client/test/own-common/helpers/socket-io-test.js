import { strict as assert } from 'assert';
import io from 'socket.io-client';

const feathers = require('@feathersjs/feathers');
const socketio = require('@feathersjs/socketio');
const socketioClient = require('@feathersjs/socketio-client');
const { Service } = require('feathers-memory');
const delay = require('./delay');


module.exports = (desc, _app, _errors, wrapperFn, serviceName, verbose, port = 7886, isBaseClass = false) => {
  describe(desc, () => {
    const url = `http://localhost:${port}`;

    let app = null;
    let cApp = null;
    let server = null;


    beforeEach(done => {
      app = feathers();
      app.configure(socketio());

      app.use(serviceName, {
        async get(id) {
          return Promise.resolve({ id, get: 'ok' });
        },

        async create(data) {
          let myData = JSON.parse(JSON.stringify(data));
          myData.create = 'ok';
          return Promise.resolve(myData);
        }
      });

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
      done();
    });

    it('can call service', () => {
      app.service(serviceName);
      cApp.service(serviceName);
      wrapperFn(cApp, serviceName, {});

      return cApp.service(serviceName).create({ firstName: 'Fred', lastName: 'Flintstone' })
        .then(res => {
          assert.deepStrictEqual(typeof res.create, 'undefined');
          assert.deepStrictEqual(res.firstName, 'Fred');
          assert.deepStrictEqual(res.lastName, 'Flintstone');
          assert.deepStrictEqual(typeof res.onServerAt, 'string');
          assert.deepStrictEqual(typeof res.updatedAt, 'string');
          assert.deepStrictEqual(typeof res.uuid, 'string');
        })
        .then(() => cApp.service(serviceName).sync(true))
        .then(delay())
        .then(() => cApp.service(serviceName).find())
        .then(results => {
          let res = results[0];
          assert.deepStrictEqual(res.create, 'ok');
          assert.deepStrictEqual(res.firstName, 'Fred');
          assert.deepStrictEqual(res.lastName, 'Flintstone');
          assert.deepStrictEqual(typeof res.onServerAt, 'string');
          assert.deepStrictEqual(typeof res.updatedAt, 'string');
          assert.deepStrictEqual(typeof res.uuid, 'string');
        })
    })

    it('activates wrapped services hook', () => {
      cApp.service(serviceName).hooks({
        before: {
          all: [async context => {
            context.data.fromHook = 'You were here!';
            return context;
          }
          ]
        }
      });
      wrapperFn(cApp, serviceName, {});

      return cApp.service(serviceName).create({ firstName: 'Fred', lastName: 'Flintstone' })
        .then(res => {
          assert.deepStrictEqual(typeof res.create, 'undefined');
          assert.deepStrictEqual(res.firstName, 'Fred');
          assert.deepStrictEqual(res.lastName, 'Flintstone');
          assert.deepStrictEqual(res.fromHook, 'You were here!');
          assert.deepStrictEqual(typeof res.onServerAt, 'string');
          assert.deepStrictEqual(typeof res.updatedAt, 'string');
          assert.deepStrictEqual(typeof res.uuid, 'string');
        })
        .then(() => cApp.service(serviceName).sync(true))
        .then(delay())
        .then(() => cApp.service(serviceName).find())
        .then(results => {
          let res = results[0];
          assert.deepStrictEqual(res.create, 'ok');
          assert.deepStrictEqual(res.firstName, 'Fred');
          assert.deepStrictEqual(res.lastName, 'Flintstone');
          assert.deepStrictEqual(typeof res.onServerAt, 'string');
          assert.deepStrictEqual(typeof res.updatedAt, 'string');
          assert.deepStrictEqual(typeof res.uuid, 'string');
        })
    });

    it('wrapped service triggers event handlers', () => {
      let flag = false;
      wrapperFn(cApp, serviceName, {});
      cApp.service(serviceName).on('created', () => { flag = true; });

      return cApp.service(serviceName).create({ firstName: 'Fred', lastName: 'Flintstone' })
        .then(res => {
          assert.deepStrictEqual(typeof res.create, 'undefined');
          assert.deepStrictEqual(res.firstName, 'Fred');
          assert.deepStrictEqual(res.lastName, 'Flintstone');
          assert.deepStrictEqual(typeof res.onServerAt, 'string');
          assert.deepStrictEqual(typeof res.updatedAt, 'string');
          assert.deepStrictEqual(typeof res.uuid, 'string');
          assert.deepStrictEqual(flag, true);
        })
        .then(() => cApp.service(serviceName).sync(true))
        .then(delay())
        .then(() => cApp.service(serviceName).find())
        .then(results => {
          let res = results[0];
          assert.deepStrictEqual(res.create, 'ok');
          assert.deepStrictEqual(res.firstName, 'Fred');
          assert.deepStrictEqual(res.lastName, 'Flintstone');
          assert.deepStrictEqual(typeof res.onServerAt, 'string');
          assert.deepStrictEqual(typeof res.updatedAt, 'string');
          assert.deepStrictEqual(typeof res.uuid, 'string');
        })
    });

  });
}
