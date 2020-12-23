/* eslint-disable @typescript-eslint/no-unused-vars */
import { strict as assert } from 'assert';
import axios from 'axios';

import feathers from '@feathersjs/feathers';
import { Service } from 'feathers-memory';

import * as express from '@feathersjs/express';
const { realtimeWrapper } = require('../src');

const expressify = express.default;
const { rest } = express;

describe('express/rest provider', () => {
  let server;
  let app;

  beforeEach(() => {
    app = expressify(feathers())
      .configure(rest(rest.formatter))
      .use(express.json())
      .use('/codes', {
        async get(id) {
          return Promise.resolve({ id, get: 'ok' });
        },

        async create(data) {
          let myData = JSON.parse(JSON.stringify(data));
          myData.create = 'ok';
          return Promise.resolve(myData);
        }
      });

    server = app.listen(4777, () => app.use('tasks', new Service()));
  });

  afterEach(done => server.close(done));


  it('can call service', async () => {
    realtimeWrapper(app, 'codes', {});
    let result = null;
    try {
      result = await axios({ // Call 'create'
        method: 'post',
        url: 'http://localhost:4777/codes',
        data: {
          firstName: 'Fred',
          lastName: 'Flintstone'
        }
      });
    } catch (error) {
      assert.fail(`Should never get here: errName=${error.name}, errMessage=${error.message}`);
    };

    assert.deepStrictEqual(result.data, { firstName: 'Fred', lastName: 'Flintstone', create: 'ok' });
  });

  it('activates wrapped services hook', async () => {
    app.service('codes').hooks({
      before: {
        all: [async context => {
          context.data.fromHook = 'You were here!';
          return context;
        }
        ]
      }
    });
    realtimeWrapper(app, 'codes', {});

    let result = null;
    try {
      result = await axios({ // Call 'create'
        method: 'post',
        url: 'http://localhost:4777/codes',
        data: {
          firstName: 'Fred',
          lastName: 'Flintstone'
        }
      });
    } catch (error) {
      assert.fail(`Should never get here: errName=${error.name}, errMessage=${error.message}`);
    };

    assert.deepStrictEqual(result.data, { create: 'ok', firstName: 'Fred', fromHook: 'You were here!', lastName: 'Flintstone' });
  });

  it('triggers wrapped services event handlers', async () => {
    let flag = false;
    app.service('codes').on('created', () => {flag = true;});
    realtimeWrapper(app, 'codes', {});

    let result = null;
    try {
      result = await axios({ // Call 'create'
        method: 'post',
        url: 'http://localhost:4777/codes',
        data: {
          firstName: 'Fred',
          lastName: 'Flintstone'
        }
      });
    } catch (error) {
      assert.fail(`Should never get here: errName=${error.name}, errMessage=${error.message}`);
    };

    assert.deepStrictEqual(result.data, { firstName: 'Fred', lastName: 'Flintstone', create: 'ok' });
    assert.deepStrictEqual(flag, true);
  });
});
