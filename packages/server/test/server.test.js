'use strict';
const { expect } = require('chai');
const feathers = require('@feathersjs/feathers');
const { realtimeWrapper } = require('../src');
const memory = require('feathers-memory');

let app;
let service;

describe('RealtimeServerWrapper', () => {

  describe('configuration tests', () => {
    let path = 'people';

    it('fails with missing prior registration', () => {
      app = feathers();
      try {
        realtimeWrapper(app, path, { someDummyOption: 1 });
      } catch (err) {
        expect(err.name).to.equal('Unavailable', 'Missing app parameter throws Unavailable');
      }
    });

    it('fails with missing or wrong app', () => {
      app = feathers();
      app.use(path, memory());
      app.service(path);
      try {
        realtimeWrapper(path, { someDummyOption: 1 });
      } catch (err) {
        expect(err.name).to.equal('Unavailable', 'Missing app parameter throws Unavailable');
      }
      try {
        realtimeWrapper(null, path, { someDummyOption: 1 });
      } catch (err) {
        expect(err.name).to.equal('Unavailable', 'null app parameter throws Unavailable');
      }
      try {
        realtimeWrapper({}, path, { someDummyOption: 1 });
      } catch (err) {
        expect(err.name).to.equal('Unavailable', '{} app parameter throws Unavailable');
      }
      try {
        realtimeWrapper({ version: '1' }, path, { someDummyOption: 1 });
      } catch (err) {
        expect(err.name).to.equal('Unavailable', '{version:\'1\'} app parameter throws Unavailable');
      }
      try {
        realtimeWrapper({ version: '1', service: () => { } }, path, { someDummyOption: 1 });
      } catch (err) {
        expect(err.name).to.equal('Unavailable', '{version:\'1\', service: () =>{}} app parameter throws Unavailable');
      }
      try {
        realtimeWrapper({ version: '1', service: () => { }, services: [] }, path, { someDummyOption: 1 });
      } catch (err) {
        expect(err.name).to.equal('Unavailable', '{version:\'1\', service: () =>{}, services: []} app parameter throws Unavailable');
      }
    });

    it('basic functionality', () => {
      app = feathers();
      expect(typeof realtimeWrapper).to.equal('function', 'is a function');
      app.use(path, memory());
      let obj = realtimeWrapper(app, path);
      expect(typeof obj).to.equal('object', 'is an object');
    });

    it('configure (default)', () => {
      app = feathers()
      app.use(path, memory());
      realtimeWrapper(app, path);
    });

    it('configure (with options)', () => {
      app = feathers()
      app.use(path, memory());
      realtimeWrapper(app, path, { multi: true });
    });

    it('no options', async () => {
      app = feathers();
      try {
        app.use('people', memory());
        realtimeWrapper(app, 'people', {});
        service = app.service('people');
        await service.create({ id: 1, text: 'simple test' })
          .then(data => {
            expect(typeof data.uuid).to.equal('string', 'uuid was added');
            expect(typeof data.updatedAt).to.equal('string', 'updatedAt was added');
            expect(typeof data.onServerAt).to.equal('string', 'onServerAt was added');
            expect(data.deletedAt).to.equal(undefined, 'deletedAt was wrongly added');
          })
      } catch (err) {
        expect(err.name).to.equal('XXX', `Adapter class unexpectedly throws '${err.name}' ${err.message}`);
      }
    })
  });

  describe('real-life tests', () => {
    // Let's perform all the usual adapter tests to verify full functionality
    app = feathers();

    beforeEach(() => {
      app.use('people', memory({ multi: true }, app));
      realtimeWrapper(app, 'people', {});
      service = app.service('people');
    });

    it('._create adds missing uuid, updatedAt, onServerAt, and deletedAt', () => {
      return service._create({ id: 99, order: 99 })
        .then(data => {
          expect(typeof data.uuid).to.equal('string', 'uuid was added');
          expect(typeof data.updatedAt).to.equal('string', 'updatedAt was added');
          expect(typeof data.onServerAt).to.equal('string', 'onServerAt was added');
          expect(data.deletedAt).to.equal(undefined, 'deletedAt was wrongly added');
        })
    });

    it('.create adds missing uuid, updatedAt, onServerAt, and deletedAt', () => {
      return service.create({ id: 99, order: 99 })
        .then(data => {
          expect(typeof data.uuid).to.equal('string', 'uuid was added');
          expect(typeof data.updatedAt).to.equal('string', 'updatedAt was added');
          expect(typeof data.onServerAt).to.equal('string', 'onServerAt was added');
          expect(data.deletedAt).to.equal(undefined, 'deletedAt was wrongly added');
        })
    });

    it('._update works', async () => {
      await service.create({ id: 99, order: 99 });
      return service._update(99, { id: 99, order: 1099 })
        .then(data => {
          expect(data.id).to.equal(99, 'order updated');
          expect(data.order).to.equal(1099, 'order updated');
          expect(typeof data.updatedAt).to.equal('string', 'updatedAt was added');
          expect(typeof data.onServerAt).to.equal('string', 'onServerAt was added');
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
          expect(typeof data.updatedAt).to.equal('string', 'updatedAt was added');
          expect(typeof data.onServerAt).to.equal('string', 'onServerAt was added');
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
          expect(typeof data.updatedAt).to.equal('string', 'updatedAt was added');
          expect(typeof data.onServerAt).to.equal('string', 'onServerAt was added');
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
          expect(typeof data.updatedAt).to.equal('string', 'updatedAt was added');
          expect(typeof data.onServerAt).to.equal('string', 'onServerAt was added');
          expect(data.deletedAt).to.equal(undefined, 'deletedAt was wrongly added');
        })
    });

    it('._patch without multi throws', async () => {
      service.options.multi = ['create'];
      await service.create([{ id: 99, order: 99 }, { id: 98, order: 98 }]);
      return service._patch(null, { helper: true })
        .then(() => {
          expect('YYY').to.equal('XXX', '_patch unexpectedly succeeded');
        })
        .catch(err => {
          expect(err.name).to.equal('MethodNotAllowed', 'Error thrown as expected');
        })
    });

    it('._patch with multi works', async () => {
      service.options.multi = ['create', 'patch'];
      await service.create([{ id: 99, order: 99 }, { id: 98, order: 98 }]);
      return service._patch(null, { helper: true })
        .then(data => {
          expect(data[0].helper).to.equal(true, 'helper was added');
          expect(data[1].helper).to.equal(true, 'helper was added');
        })
        .catch(err => {
          expect(err.name).to.equal('XXX', 'Error thrown was unexpected');
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
    it('._remove without multi throws', async () => {
      service.options.multi = ['create'];
      await service.create([{ id: 99, order: 99 }, { id: 98, order: 99 }]);
      return service._remove(null, { order: 99 })
        .then(() => {
          expect('YYY').to.equal('XXX', '_remove unexpectedly succeeded');
        })
        .catch(err => {
          expect(err.name).to.equal('MethodNotAllowed', 'Error thrown as expected');
        })
    });

    it('._remove with multi works', async () => {
      service.options.multi = ['create', 'remove'];
      await service.create([{ id: 99, order: 99 }, { id: 98, order: 99 }]);
      return service._remove(null, { order: 99 })
        .then(data => {
          expect(data[0].order).to.equal(99, 'order was ok');
          expect(data[1].order).to.equal(99, 'order was ok');
        })
    });
  });

  describe('Special functionality', () => {
    app = feathers();

    const sampleLen = 5;
    const data = [];
    for (let i = 0, len = sampleLen; i < len; i += 1) {
      data.push({ id: i, uuid: 1000 + i, order: i, updatedAt: new Date(i+1).getTime(), onServerAt: new Date(+1).getTime() });
    }
    const deleted = [];
    for (let i = sampleLen, len = 2 * sampleLen; i < len; i += 1) {
      deleted.push({ id: i, uuid: 1000 + i, order: i, updatedAt: new Date(i+1).getTime(), onServerAt: new Date(i+1).getTime() });
    }

    var cdata = [];
    var ddata = [];
    var onServerAt;

    beforeEach(async () => {
      app.use('people', memory({ multi: true }, app));
      realtimeWrapper(app, 'people', {});
      service = app.service('people');

      cdata = await service.create(data);
      await delay(10)();

      let tmp = await service.create(deleted);
      while (tmp.length) {
        let row = tmp.shift();
        ddata.push(await service.remove(row.id));
      }
      onServerAt = ddata[0].onServerAt;
    })

    afterEach(async () => {
      await service.remove(null, { query: { uuid: { $gt: '' }, offline: { _forceAll: true } } });
      cdata = [];
      ddata = [];
    })

    it('all rows are created', () => {
      return delay()()
        .then(() => {
          expect(cdata.length).to.equal(data.length, `${sampleLen} rows inserted`);
          for (let i = 0; i < sampleLen; i += 1) {
            expect(cdata[i].id).to.equal(data[i].id, `id is ok (i=${i})`);
            expect(cdata[i].uuid).to.equal(data[i].uuid, `uuid is ok (i=${i})`);
            expect(cdata[i].order).to.equal(data[i].order, `order is ok (i=${i})`);
            expect(cdata[i].updatedAt).to.equal(data[i].updatedAt, `updatedAt is ok (i=${i})`);
            expect(cdata[i].onServerAt).to.not.equal(data[i].onServerAt, `onServerAt is updated (i=${i})`);
            expect(cdata[i].deletedAt).to.equal(data[i].deletedAt, `deletedAt is ok (i=${i})`);
          }
        })
        .then(() => {
          expect(ddata.length).to.equal(deleted.length, `${sampleLen} rows deleted`);
          for (let i = 0; i < sampleLen; i += 1) {
            expect(ddata[i].id).to.equal(deleted[i].id, `id is ok (i=${i})`);
            expect(ddata[i].uuid).to.equal(deleted[i].uuid, `uuid is ok (i=${i})`);
            expect(ddata[i].order).to.equal(deleted[i].order, `order is ok (i=${i})`);
            expect(ddata[i].updatedAt).to.equal(deleted[i].updatedAt, `updatedAt is ok (i=${i})`);
            expect(ddata[i].onServerAt).to.not.equal(deleted[i].onServerAt, `onServerAt is updated (i=${i})`);
            expect(ddata[i].deletedAt).to.not.equal(deleted[i].deletedAt, `deletedAt is ok (i=${i})`);
          }
        })
    })

    it('.find + _forceAll: false', () => {
      // Test to verify it is only the '_forceAll' key we are relying on - not its value
      return service.find({ query: { offline: { _forceAll: false } } })
        .then(delay())
        .then(sdata => {
          expect(sdata.length).to.equal(data.length + deleted.length, `${2 * sampleLen} rows found`);
          for (let i = 0; i < sampleLen; i += 1) {
            expect(sdata[i].id).to.equal(data[i].id, `id is ok (i=${i})`);
            expect(sdata[i].uuid).to.equal(data[i].uuid, `uuid is ok (i=${i})`);
            expect(sdata[i].order).to.equal(data[i].order, `order is ok (i=${i})`);
            expect(sdata[i].updatedAt).to.equal(data[i].updatedAt, `updatedAt is ok (i=${i})`);
            expect(sdata[i].onServerAt).to.not.equal(data[i].onServerAt, `onServerAt is updated (i=${i})`);
            expect(sdata[i].deletedAt).to.equal(data[i].deletedAt, `deletedAt is not updated (i=${i})`);
          }
          for (let i = sampleLen; i < 2 * sampleLen; i += 1) {
            expect(sdata[i].id).to.equal(deleted[i - sampleLen].id, `id is ok (i=${i})`);
            expect(sdata[i].uuid).to.equal(deleted[i - sampleLen].uuid, `uuid is ok (i=${i})`);
            expect(sdata[i].order).to.equal(deleted[i - sampleLen].order, `order is ok (i=${i})`);
            expect(sdata[i].updatedAt).to.equal(deleted[i - sampleLen].updatedAt, `updatedAt is ok (i=${i})`);
            expect(sdata[i].onServerAt).to.not.equal(deleted[i - sampleLen].onServerAt, `onServerAt is updated (i=${i})`);
            expect(sdata[i].deletedAt).to.not.equal(undefined, `deletedAt is not undefined (i=${i})`);
          }
        })
    });

    it('.find + _forceAll: true', () => {
      // Test to verify it is only the '_forceAll' key we are relying on - not its value
      return service.find({ query: { offline: { _forceAll: true } } })
        .then(delay())
        .then(sdata => {
          expect(sdata.length).to.equal(data.length + deleted.length, `${2 * sampleLen} rows found`);
          for (let i = 0; i < sampleLen; i += 1) {
            expect(sdata[i].id).to.equal(data[i].id, `id is ok (i=${i})`);
            expect(sdata[i].uuid).to.equal(data[i].uuid, `uuid is ok (i=${i})`);
            expect(sdata[i].order).to.equal(data[i].order, `order is ok (i=${i})`);
            expect(sdata[i].updatedAt).to.equal(data[i].updatedAt, `updatedAt is ok (i=${i})`);
            expect(sdata[i].onServerAt).to.not.equal(data[i].onServerAt, `onServerAt is updated (i=${i})`);
            expect(sdata[i].deletedAt).to.equal(data[i].deletedAt, `deletedAt is not updated (i=${i})`);
          }
          for (let i = sampleLen; i < 2 * sampleLen; i += 1) {
            expect(sdata[i].id).to.equal(deleted[i - sampleLen].id, `id is ok (i=${i})`);
            expect(sdata[i].uuid).to.equal(deleted[i - sampleLen].uuid, `uuid is ok (i=${i})`);
            expect(sdata[i].order).to.equal(deleted[i - sampleLen].order, `order is ok (i=${i})`);
            expect(sdata[i].updatedAt).to.equal(deleted[i - sampleLen].updatedAt, `updatedAt is ok (i=${i})`);
            expect(sdata[i].onServerAt).to.not.equal(deleted[i - sampleLen].onServerAt, `onServerAt is updated (i=${i})`);
            expect(sdata[i].deletedAt).to.not.equal(undefined, `deletedAt is not undefined (i=${i})`);
          }
        })
    });

    it('.find + _forceAll: true + onServerAt string', () => {
      onServerAt = new Date(onServerAt).getTime();
      return service.find({ query: { offline: { _forceAll: true, onServerAt } } })
        .then(delay())
        .then(sdata => {
          expect(sdata.length).to.equal(deleted.length, `${sampleLen} rows found`);
          for (let i = 0; i < sampleLen - 1; i += 1) {
            expect(sdata[i].id).to.equal(deleted[i].id, `id is ok (i=${i})`);
            expect(sdata[i].uuid).to.equal(deleted[i].uuid, `uuid is ok (i=${i})`);
            expect(sdata[i].order).to.equal(deleted[i].order, `order is ok (i=${i})`);
            expect(sdata[i].updatedAt).to.equal(deleted[i].updatedAt, `updatedAt is ok (i=${i})`);
            expect(sdata[i].onServerAt).to.not.equal(deleted[i].onServerAt, `onServerAt is updated (i=${i})`);
            expect(sdata[i].deletedAt).to.equal(ddata[i].deletedAt, `deletedAt is ok (i=${i})`);
          }
        })
    });

    it('.find + _forceAll: true + onServerAt date', () => {
      onServerAt = new Date(onServerAt).getTime();
      return service.find({ query: { offline: { _forceAll: true, onServerAt } } })
        .then(delay())
        .then(sdata => {
          expect(sdata.length).to.equal(deleted.length, `${sampleLen} rows found`);
          for (let i = 0; i < sampleLen; i += 1) {
            expect(sdata[i].id).to.equal(deleted[i].id, `id is ok (i=${i})`);
            expect(sdata[i].uuid).to.equal(deleted[i].uuid, `uuid is ok (i=${i})`);
            expect(sdata[i].order).to.equal(deleted[i].order, `order is ok (i=${i})`);
            expect(sdata[i].updatedAt).to.equal(deleted[i].updatedAt, `updatedAt is ok (i=${i})`);
            expect(sdata[i].onServerAt).to.not.equal(deleted[i].onServerAt, `onServerAt is updated (i=${i})`);
            expect(cdata[i].deletedAt).to.equal(deleted[i].deletedAt, `deletedAt is ok (i=${i})`);
          }
        })
    });

    it('.update + _forceAll: true (onServerAt > updatedAt)', () => {
      let updatedAt = (new Date(ddata[0].onServerAt)).getTime() - 1;
      let upd = Object.assign({}, ddata[0], { order: 89, updatedAt });
      return service.update(5, upd, { query: { offline: { _forceAll: true } } })
        .then(delay())
        .then(sdata => {
          // We keep existing data, as onServerAt in DB is newer than updatedAt
          expect(typeof sdata).to.equal('object', `1 row updated`);
          for (let i = 0; i < 1; i += 1) {
            expect(sdata.id).to.equal(ddata[i].id, `id is ok (i=${i})`);
            expect(sdata.uuid).to.equal(ddata[i].uuid, `uuid is ok (i=${i})`);
            expect(sdata.order).to.equal(ddata[i].order, `order is ok (i=${i})`);
            expect(sdata.updatedAt).to.equal(ddata[i].updatedAt, `updatedAt is ok (i=${i})`);
            expect(sdata.onServerAt).to.equal(ddata[i].onServerAt, `onServerAt is updated (i=${i})`);
            expect(sdata.deletedAt).to.equal(ddata[i].deletedAt, `deletedAt is ok (i=${i})`);
          }
        })
    });

    it('.update + _forceAll: true', () => {
      let upd = Object.assign({}, ddata[0], { order: 90, updatedAt: new Date() });
      return service.update(5, upd, { query: { offline: { _forceAll: true } } })
        .then(sdata => {
          // We update data, as onServerAt in DB is older than updatedAt in new data
          expect(typeof sdata).to.equal('object', `1 row updated`);
          for (let i = 0; i < 1; i += 1) {
            expect(sdata.id).to.equal(ddata[i].id, `id is ok (i=${i})`);
            expect(sdata.uuid).to.equal(ddata[i].uuid, `uuid is ok (i=${i})`);
            expect(sdata.order).to.equal(90, `order is ok (i=${i})`);
            expect(sdata.updatedAt).to.not.equal(ddata[i].updatedAt, `updatedAt is ok (i=${i})`);
            expect(sdata.onServerAt).to.not.equal(ddata[i].onServerAt, `onServerAt is updated (i=${i})`);
            expect(sdata.deletedAt).to.equal(ddata[i].deletedAt, `deletedAt is ok (i=${i})`);
          }
        })
    });

    it('.update + _forceAll: true + params', () => {
      onServerAt = new Date(ddata[0].onServerAt).getTime();
      let newData = Object.assign({}, ddata[0], { order: 91, updatedAt: new Date() });
      return service.update(5, newData, { query: { offline: { _forceAll: true }, uuid: 1005 } })
        .then(delay())
        .then(sdata => {
          // We update data, as onServerAt in DB is older than updatedAt
          expect(typeof sdata).to.equal('object', `1 row updated`);
          for (let i = 0; i < 1; i += 1) {
            expect(sdata.id).to.equal(ddata[i].id, `id is ok (i=${i})`);
            expect(sdata.uuid).to.equal(ddata[i].uuid, `uuid is ok (i=${i})`);
            expect(sdata.order).to.equal(91, `order is ok (i=${i})`);
            expect(sdata.updatedAt).to.not.equal(ddata[i].updatedAt, `updatedAt is ok (i=${i})`);
            expect(sdata.onServerAt).to.not.equal(ddata[i].onServerAt, `onServerAt is updated (i=${i})`);
            expect(sdata.deletedAt).to.equal(ddata[i].deletedAt, `deletedAt is ok (i=${i})`);
          }
        })
    });

    it('.update + _forceAll: true + onServerAt', () => {
      onServerAt = new Date(onServerAt).getTime();
      let upd = Object.assign({}, ddata[0], { order: 92, updatedAt: new Date() });
      return service.update(5, upd, { query: { offline: { _forceAll: true, onServerAt } } })
        .then(delay())
        .then(sdata => {
          // We update data, as onServerAt in DB is older than updatedAt
          expect(typeof sdata).to.equal('object', `1 row updated`);
          for (let i = 0; i < 1; i += 1) {
            expect(sdata.id).to.equal(ddata[i].id, `id is ok (i=${i})`);
            expect(sdata.uuid).to.equal(ddata[i].uuid, `uuid is ok (i=${i})`);
            expect(sdata.order).to.equal(92, `order is ok (i=${i})`);
            expect(sdata.updatedAt).to.not.equal(ddata[i].updatedAt, `updatedAt is ok (i=${i})`);
            expect(sdata.onServerAt).to.not.equal(ddata[i].onServerAt, `onServerAt is updated (i=${i})`);
            expect(sdata.deletedAt).to.equal(ddata[i].deletedAt, `deletedAt is ok (i=${i})`);
          }
        })
    });

    it('.patch null + _forceAll: true (updatedAt < onServerAt)', () => {
      let updatedAt = (new Date(data[0].onServerAt)).getTime() - 1;
      return service.patch(null, { order: 93, updatedAt }, { query: { offline: { _forceAll: true } } })
        .then(delay())
        .then(sdata => {
          expect(sdata.length).to.equal(cdata.length + ddata.length, `${2 * sampleLen} rows found`);
          for (let i = 0; i < sampleLen; i += 1) {
            expect(sdata[i].id).to.equal(data[i].id, `id is ok (i=${i})`);
            expect(sdata[i].uuid).to.equal(data[i].uuid, `uuid is ok (i=${i})`);
            expect(sdata[i].order).to.equal(data[i].order, `order is ok (i=${i})`);
            expect(sdata[i].updatedAt).to.equal(data[i].updatedAt, `updatedAt was set (i=${i})`);
            expect(sdata[i].updatedAt).to.satisfy((v) => { return v >= data[i].updatedAt }, `updatedAt was set (i=${i}) (1)`);
            expect(sdata[i].deletedAt).to.equal(data[i].deletedAt, `deletedAt is ok (i=${i})`);
          }
          for (let i = sampleLen; i < 2 * sampleLen; i += 1) {
            expect(sdata[i].id).to.equal(ddata[i - sampleLen].id, `id is ok (i=${i})`);
            expect(sdata[i].uuid).to.equal(ddata[i - sampleLen].uuid, `uuid is ok (i=${i})`);
            expect(sdata[i].order).to.equal(ddata[i - sampleLen].order, `order is ok (i=${i})`);
            expect(sdata[i].updatedAt).to.equal(ddata[i - sampleLen].updatedAt, `updatedAt is ok (i=${i})`);
            expect(sdata[i].onServerAt).to.equal(ddata[i - sampleLen].onServerAt, `onServerAt is ok (i=${i})`);
            expect(sdata[i].deletedAt).to.equal(ddata[i - sampleLen].deletedAt, `deletedAt is ok (i=${i})`);
          }
        })
    });

    it('.patch null + _forceAll: true (updatedAt >= onServerAt)', () => {
      onServerAt = new Date(onServerAt);
      let updatedAt = (new Date(ddata[0].onServerAt)).getTime() + 2 * sampleLen;
      return service.patch(null, { order: 94, updatedAt }, { query: { offline: { _forceAll: true } } })
        .then(delay())
        .then(sdata => {
          expect(sdata.length).to.equal(cdata.length + ddata.length, `${2 * sampleLen} rows found`);
          for (let i = 0; i < sampleLen; i += 1) {
            expect(sdata[i].id).to.equal(data[i].id, `id is ok (i=${i})`);
            expect(sdata[i].uuid).to.equal(data[i].uuid, `uuid is ok (i=${i})`);
            expect(sdata[i].order).to.equal(94, `order is ok (i=${i})`);
            expect(sdata[i].updatedAt).to.satisfy((v) => { return v >= data[i].updatedAt }, `updatedAt was set (i=${i}) (1)`);
            expect(sdata[i].onServerAt).to.not.equal(data[i].onServerAt, `onServerAt is updated (i=${i})`);
            expect(sdata[i].deletedAt).to.equal(data[i].deletedAt, `deletedAt is ok (i=${i})`);
          }
          for (let i = sampleLen; i < 2 * sampleLen; i += 1) {
            expect(sdata[i].id).to.equal(ddata[i - sampleLen].id, `id is ok (i=${i})`);
            expect(sdata[i].uuid).to.equal(ddata[i - sampleLen].uuid, `uuid is ok (i=${i})`);
            expect(sdata[i].order).to.equal(94, `order is ok (i=${i})`);
            expect(sdata[i].updatedAt).to.satisfy((v) => { return v >= ddata[i - sampleLen].updatedAt }, `updatedAt was set (i=${i}) (2)`);
            expect(sdata[i].onServerAt).to.not.equal(ddata[i - sampleLen].onServerAt, `onServerAt is updated (i=${i})`);
            expect(sdata[i].deletedAt).to.equal(ddata[i - sampleLen].deletedAt, `deletedAt is ok (i=${i})`);
          }
        })
    });

    it('.patch null + _forceAll: true + params', () => {
      onServerAt = new Date(onServerAt).getTime();
      return service.patch(null, { order: 95 }, { query: { offline: { _forceAll: true }, onServerAt } })
        .then(delay())
        .then(sdata => {
          expect(sdata.length).to.equal(ddata.length, `${sampleLen} rows found`);
          for (let i = 0; i < sampleLen; i += 1) {
            expect(sdata[i].id).to.equal(ddata[i].id, `id is ok (i=${i})`);
            expect(sdata[i].uuid).to.equal(ddata[i].uuid, `uuid is ok (i=${i})`);
            expect(sdata[i].order).to.equal(95, `order is ok (i=${i})`);
            expect(sdata[i].updatedAt).to.equal(ddata[i].updatedAt, `updatedAt is ok (i=${i})`);
            expect(sdata[i].onServerAt).to.satisfy((v) => { return v > ddata[i].onServerAt }, `onServerAt is updated (i=${i})`);
            expect(sdata[i].deletedAt).to.equal(ddata[i].deletedAt, `deletedAt is ok (i=${i})`);
          }
        })
    });

    it('.patch null + _forceAll: true + onServerAt', () => {
      onServerAt = new Date(onServerAt).getTime();
      return service.patch(null, { order: 96 }, { query: { offline: { _forceAll: true, onServerAt } } })
        .then(delay())
        .then(sdata => {
          expect(sdata.length).to.equal(ddata.length, `${sampleLen} rows found`);
          for (let i = 0; i < sampleLen; i += 1) {
            expect(sdata[i].id).to.equal(ddata[i].id, `id is ok (i=${i})`);
            expect(sdata[i].uuid).to.equal(ddata[i].uuid, `uuid is ok (i=${i})`);
            expect(sdata[i].order).to.equal(96, `order is ok (i=${i})`);
            expect(sdata[i].updatedAt).to.equal(ddata[i].updatedAt, `updatedAt is ok (i=${i})`);
            expect(sdata[i].onServerAt).to.not.equal(ddata[i].onServerAt, `onServerAt is updated (i=${i})`);
            expect(sdata[i].deletedAt).to.equal(ddata[i].deletedAt, `deletedAt is ok (i=${i})`);
          }
        })
    });

    it('.remove + _forceAll: true', () => {
      return service.remove(5, { query: { offline: { _forceAll: true } } })
        .then(delay())
        .then(sdata => {
          expect(typeof sdata).to.equal('object', `1 row found`);
          for (let i = 0; i < 1; i += 1) {
            expect(sdata.id).to.equal(ddata[i].id, `id is ok (i=${i})`);
            expect(sdata.uuid).to.equal(ddata[i].uuid, `uuid is ok (i=${i})`);
            expect(sdata.order).to.equal(ddata[i].order, `order is ok (i=${i})`);
            expect(sdata.updatedAt).to.equal(ddata[i].updatedAt, `updatedAt is ok (i=${i})`);
            expect(sdata.onServerAt).to.equal(ddata[i].onServerAt, `onServerAt is ok (i=${i})`);
            expect(sdata.deletedAt).to.equal(ddata[i].deletedAt, `deletedAt is ok (i=${i})`);
          }
        })
    });

    it('.remove + _forceAll: true + params', () => {
      onServerAt = new Date(onServerAt).getTime();
      return service.remove(5, { query: { offline: { _forceAll: true }, onServerAt } })
        .then(delay())
        .then(sdata => {
          expect(typeof sdata).to.equal('object', `1 row found`);
          for (let i = 0; i < 1; i += 1) {
            expect(sdata.id).to.equal(ddata[i].id, `id is ok (i=${i})`);
            expect(sdata.uuid).to.equal(ddata[i].uuid, `uuid is ok (i=${i})`);
            expect(sdata.order).to.equal(ddata[i].order, `order is ok (i=${i})`);
            expect(sdata.updatedAt).to.equal(ddata[i].updatedAt, `updatedAt is ok (i=${i})`);
            expect(sdata.onServerAt).to.equal(ddata[i].onServerAt, `onServerAt is ok (i=${i})`);
            expect(sdata.deletedAt).to.equal(ddata[i].deletedAt, `deletedAt is ok (i=${i})`);
          }
        })
    });

    it('.remove + _forceAll: true + onServerAt', () => {
      onServerAt = new Date(onServerAt).getTime();
      return service.remove(5, { query: { offline: { _forceAll: true, onServerAt } } })
        .then(delay())
        .then(sdata => {
          expect(typeof sdata).to.equal('object', `1 row found`);
          for (let i = 0; i < 1; i += 1) {
            expect(sdata.id).to.equal(ddata[i].id, `id is ok (i=${i})`);
            expect(sdata.uuid).to.equal(ddata[i].uuid, `uuid is ok (i=${i})`);
            expect(sdata.order).to.equal(ddata[i].order, `order is ok (i=${i})`);
            expect(sdata.updatedAt).to.equal(ddata[i].updatedAt, `updatedAt is ok (i=${i})`);
            expect(sdata.onServerAt).to.equal(ddata[i].onServerAt, `onServerAt is ok (i=${i})`);
            expect(sdata.deletedAt).to.equal(ddata[i].deletedAt, `deletedAt is ok (i=${i})`);
          }
        })
    });

  });

});

// Helpers

function delay(ms = 0) {
  return data => new Promise(resolve => {
    setTimeout(() => {
      resolve(data);
    }, ms);
  });
}
