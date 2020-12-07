//
// Most of this code has been copied from 'https://github.com/feathers-plus/feathers-offline-snapshot/blob/master/test/snapshot.test.js'
//
const assert = require('chai').assert;
const feathers = require('@feathersjs/feathers');
const memory = require('feathers-memory');

const snapshot = require('../src/snapshot');

const sampleLen = 25;
let data;
let dataConverted;
let fromService;
let fromServicePaginated;

function services1 () {
  const app = this;

  app.configure(fromServiceNonPaginatedConfig);
  app.configure(fromServicePaginatedConfig);
}

function fromServiceNonPaginatedConfig () {
  const app = this;

  app.use('/from', memory({multi: true}));
}

function fromServicePaginatedConfig () {
  const app = this;

  app.use('/frompaginated', memory({
    multi: true,
    paginate: {
      default: 2,
      max: 3
    }
  }));
}

describe('snapshotutils-copy:', () => {
  beforeEach(() => {
    const app = feathers()
      .configure(services1);

    fromService = app.service('from');
    fromServicePaginated = app.service('frompaginated');

    data = [];
    dataConverted = [];
    for (let i = 0, len = sampleLen; i < len; i += 1) {
      data.push({ id: i, order: i });
      dataConverted.push({ id: i, order: i, uuid: i, __id: i });
    }

    return Promise.all([
      fromService.create(data),
      fromServicePaginated.create(data)
    ]);
  });

  it('non-paginated file', () => {
    return snapshot(fromService)
      .then(result => {
        assert.lengthOf(result, sampleLen);

        assert.deepEqual(sortArrayByProp(result, 'order'), data);
      })
      .catch(logAndThrow('copy error'));
  });

  it('paginated file', () => {
    return snapshot(fromServicePaginated)
      .then(result => {
        assert.lengthOf(result, sampleLen);

        assert.deepEqual(sortArrayByProp(result, 'order'), data);
      })
      .catch(logAndThrow('copy error'));
  });

  it('selection works', () => {
    const selection = { order: { $lt: 15 } };

    return snapshot(fromServicePaginated, selection)
      .then(result => {
        assert.lengthOf(result, 15);

        assert.deepEqual(sortArrayByProp(result, 'order'), data.slice(0, 15));
      })
      .catch(logAndThrow('copy error'));
  });
});

// Helpers

function sortArrayByProp (array, key) {
  return array.sort((a, b) => {
    const x = a[key];
    const y = b[key];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}

function logAndThrow (msg) {
  return err => {
    console.log(msg, err.message);
    console.log(err.stack);
    throw err;
  };
}
