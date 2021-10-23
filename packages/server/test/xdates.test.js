'use strict';
const { expect } = require('chai');
const feathers = require('@feathersjs/feathers');
const { realtimeWrapper } = require('../src');
const memory = require('feathers-memory');

describe('RealtimeServerWrapper', () => {

  describe('Dates tests', () => {
    datesTest('people98', 'Default settings', { dates: false }, 'string');
    datesTest('people99', 'Dates active', { dates: true }, 'object');

  });
});
  
function datesTest (path, heading, wrapperOptions, expectedDateType) {
  let app;
  let service;

describe(`${heading} (${JSON.stringify(wrapperOptions)})`, () => {
  let ix = 0;
  app = feathers();

  beforeEach(() => {
    let thisPath = path + String(++ix);
    app.use(thisPath, memory({ multi: true }, app));
    realtimeWrapper(app, thisPath, wrapperOptions);
    service = app.service(thisPath);
  });

  it('._create adds missing uuid, updatedAt, onServerAt, and deletedAt', () => {
    return service._create({ id: 99, order: 99 })
      .then(data => {
        expect(typeof data.uuid).to.equal('string', 'uuid was added');
        expect(typeof data.updatedAt).to.equal(expectedDateType, 'updatedAt was added');
        expect(typeof data.onServerAt).to.equal(expectedDateType, 'onServerAt was added');
        expect(data.deletedAt).to.equal(undefined, 'deletedAt was wrongly added');
      })
  });

  it('.create adds missing uuid, updatedAt, onServerAt, and deletedAt', () => {
    return service.create({ id: 99, order: 99 })
      .then(data => {
        expect(typeof data.uuid).to.equal('string', 'uuid was added');
        expect(typeof data.updatedAt).to.equal(expectedDateType, 'updatedAt was added');
        expect(typeof data.onServerAt).to.equal(expectedDateType, 'onServerAt was added');
        expect(data.deletedAt).to.equal(undefined, 'deletedAt was wrongly added');
      })
  });

  it('._update works', async () => {
    await service.create({ id: 99, order: 99 });
    return service._update(99, { id: 99, order: 1099 })
      .then(data => {
        expect(data.id).to.equal(99, 'order updated');
        expect(data.order).to.equal(1099, 'order updated');
        expect(typeof data.updatedAt).to.equal(expectedDateType, 'updatedAt was added');
        expect(typeof data.onServerAt).to.equal(expectedDateType, 'onServerAt was added');
        expect(data.deletedAt).to.equal(undefined, 'deletedAt was wrongly added');
      })
      .then(() => service.find())
      .then(res => {
        expect(res.length).to.equal(1, 'Item updated');
      })
  });

  it('.update works', async () => {
    await service.create({ id: 99, order: 99 });
    return service.update(99, { id: 99, order: 1099 })
      .then(data => {
        expect(data.id).to.equal(99, 'order updated');
        expect(data.order).to.equal(1099, 'order updated');
        expect(typeof data.updatedAt).to.equal(expectedDateType, 'updatedAt was added');
        expect(typeof data.onServerAt).to.equal(expectedDateType, 'onServerAt was added');
        expect(data.deletedAt).to.equal(undefined, 'deletedAt was wrongly added');
      })
      .then(() => service.find())
      .then(res => {
        expect(res.length).to.equal(1, 'Item updated');
      })
  });

  it('._patch works', async () => {
    await service.create({ id: 99, order: 99 });
    return service._patch(99, { id: 99, order: 1099 })
      .then(data => {
        expect(typeof data.uuid).to.equal('string', 'uuid was added');
        expect(data.id).to.equal(99, 'id preserved');
        expect(data.order).to.equal(1099, 'order updated');
        expect(typeof data.updatedAt).to.equal(expectedDateType, 'updatedAt was added');
        expect(typeof data.onServerAt).to.equal(expectedDateType, 'onServerAt was added');
        expect(data.deletedAt).to.equal(undefined, 'deletedAt was wrongly added');
      })
  });

  it('.patch works', async () => {
    await service.create({ id: 99, order: 99 });
    return service.patch(99, { order: 10999 })
      .then(data => {
        expect(typeof data.uuid).to.equal('string', 'uuid was added');
        expect(data.id).to.equal(99, 'id preserved');
        expect(data.order).to.equal(10999, 'order updated');
        expect(typeof data.updatedAt).to.equal(expectedDateType, 'updatedAt was added');
        expect(typeof data.onServerAt).to.equal(expectedDateType, 'onServerAt was added');
        expect(data.deletedAt).to.equal(undefined, 'deletedAt was wrongly added');
      })
  });

  it('._remove works', async () => {
    await service.create({ id: 99, order: 99 });
    return service._remove(99)
      .then(() => service.find())
      .then(data => {
        expect(data.length).to.equal(0, 'record removed');
      })
  });

  it('.remove works', async () => {
    await service.create({ id: 99, order: 99 });
    return service.remove(99)
      .then(() => service.find())
      .then(data => {
        expect(data.length).to.equal(0, 'record removed');
      })
  });
});

};

// Helpers

function delay (ms = 0) {
  return data => new Promise(resolve => {
    setTimeout(() => {
      resolve(data);
    }, ms);
  });
}
