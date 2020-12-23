import { strict as assert } from 'assert';
import io from 'socket.io-client';

const feathers = require('@feathersjs/feathers');
const feathersClient = require('@feathersjs/client');
const socketio = require('@feathersjs/socketio');
const socketioClient = require('@feathersjs/socketio-client');

const { realtimeWrapper, to } = require('../src');


describe('socketio provider', () => {
  const port = 7886;
  const url = `http://localhost:${port}`;
  const path = '/codes';

  let app = null;
  let cApp = null;
  let server = null;


  beforeEach(done => {
    app = feathers();
    app.configure(socketio());
  
    app.use(path, {
      async get(id) {
        return { id, get: 'ok' };
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
    app.service(path);
    realtimeWrapper(app, path, {});

    return cApp.service(path).create({ firstName: 'Fred', lastName: 'Flintstone' })
      .then(res => {
        assert.deepStrictEqual(res.create, 'ok');
        assert.deepStrictEqual(res.firstName, 'Fred');
        assert.deepStrictEqual(res.lastName, 'Flintstone');
        assert.deepStrictEqual(typeof res.onServerAt, 'string');
        assert.deepStrictEqual(typeof res.updatedAt, 'string');
        assert.deepStrictEqual(typeof res.uuid, 'string');
      })
      .catch(err => {
        assert.fail(`Should never get here: errName=${err.name}, errMessage=${err.message}`);
      })
  })

  it('activates wrapped services hooks', () => {
    app.service(path).hooks({
      after: {
        all: [async context => {
          context.result.fromHook = 'You were here!';
          return context;
        }
        ]
      }
    });
    realtimeWrapper(app, path, {});

    return cApp.service(path).create({ firstName: 'Fred', lastName: 'Flintstone' })
      .then(res => {
        assert.deepStrictEqual(res.create, 'ok');
        assert.deepStrictEqual(res.firstName, 'Fred');
        assert.deepStrictEqual(res.lastName, 'Flintstone');
        assert.deepStrictEqual(res.fromHook, 'You were here!');
        assert.deepStrictEqual(typeof res.onServerAt, 'string');
        assert.deepStrictEqual(typeof res.updatedAt, 'string');
        assert.deepStrictEqual(typeof res.uuid, 'string');
      })
      .catch(err => {
        assert.fail(`Should never get here: errName=${err.name}, errMessage=${err.message}`);
      });
  });

  it('triggers wrapped services event handlers', () => {
    let flag = false;
    realtimeWrapper(app, path, {});
    app.service('codes').on('created', () => {flag = true;});

    return cApp.service(path).create({ firstName: 'Fred', lastName: 'Flintstone' })
      .then(res => {
        assert.deepStrictEqual(res.create, 'ok');
        assert.deepStrictEqual(res.firstName, 'Fred');
        assert.deepStrictEqual(res.lastName, 'Flintstone');
        assert.deepStrictEqual(typeof res.onServerAt, 'string');
        assert.deepStrictEqual(typeof res.updatedAt, 'string');
        assert.deepStrictEqual(typeof res.uuid, 'string');
        assert.deepStrictEqual(flag, true);
      })
      .catch(err => {
        assert.fail(`Should never get here: errName=${err.name}, errMessage=${err.message}`);
      });
  });

});
