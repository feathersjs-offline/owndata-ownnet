'use strict';
const adapterTests = require('@feathersjs/adapter-tests');
const memory = require('feathers-memory');

const testSuite = adapterTests([
  '.options',
  '.events',
  '._get',
  '._find',
  '._create',
  '._update',
  '._patch',
  '._remove',
  '.get',
  '.get + $select',
  '.get + id + query',
  '.get + NotFound',
  '.get + id + query id',
  '.find',
  '.remove',
  '.remove + $select',
  '.remove + id + query',
  '.remove + multi',
  '.remove + id + query id',
  '.update',
  '.update + $select',
  '.update + id + query',
  '.update + NotFound',
  '.update + query + NotFound',
  '.update + id + query id',
  '.patch',
  '.patch + $select',
  '.patch + id + query',
  '.patch multiple',
  '.patch multi query same',
  '.patch multi query changed',
  '.patch + NotFound',
  '.patch + query + NotFound',
  '.patch + id + query id',
  '.create',
  '.create + $select',
  '.create multi',
  'internal .find',
  'internal .get',
  'internal .create',
  'internal .update',
  'internal .patch',
  'internal .remove',
  '.find + equal',
  '.find + equal multiple',
  '.find + $sort',
  '.find + $sort + string',
  '.find + $limit',
  '.find + $limit 0',
  '.find + $skip',
  '.find + $select',
  '.find + $or',
  '.find + $in',
  '.find + $nin',
  '.find + $lt',
  '.find + $lte',
  '.find + $gt',
  '.find + $gte',
  '.find + $ne',
  '.find + $gt + $lt + $sort',
  '.find + $or nested + $sort',
  '.find + paginate',
  '.find + paginate + $limit + $skip',
  '.find + paginate + $limit 0',
  '.find + paginate + params'
]);

module.exports = (title, app, _errors, wrapper, serviceName, idProp) => {

describe(title, () => {
  beforeEach(() => {
  });

  // Let's perform all the usual adapter tests to verify full functionality
  const events = ['testing'];

  if (idProp !== undefined && idProp !== 'id') {
    app.use(serviceName, memory({ events, id: idProp }));
    wrapper(app, serviceName, {adapterTest: true, store: {}});
  } else {
    app.use(serviceName, memory({ events }));
    // We want to test the wrappers default value for id (which is 'id')
    wrapper(app, serviceName, {adapterTest: true, store: {}});
    idProp = 'id';
  }

  testSuite(app, _errors, serviceName, idProp);
});

};
