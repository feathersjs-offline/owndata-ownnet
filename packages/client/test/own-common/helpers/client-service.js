const feathers = require('@feathersjs/feathers');
const memory = require('feathers-memory');

let ix = 0;

function newServicePath () {
  return '/tmp' + ix++;
}

function service1 (wrapper) {
  let path = newServicePath();
  return fromServiceNonPaginatedConfig(wrapper, path);
}

function service2 (wrapper, path) {
  app = feathers();
  app.use(path, memory({ multi: true }));
  let service = wrapper(app, path);
  return service;
}

function service3 (wrapper) {
  app = feathers();
  let path = newServicePath();
  app.use(path, memory({ multi: false }));
  wrapper(app, path);
  return app.service(path);
}

function service4 (wrapper, options) {
  app = feathers();
  let path = newServicePath();
  app.use(path, memory(options));
  wrapper(app, path, options);
  return app.service(path);
}

function fromServiceNonPaginatedConfig (wrapper, path) {
  app = feathers();
  app.use(path, memory({ multi: true }));
  wrapper(app, path);
  return app.service(path);
}

module.exports = { newServicePath, service1, service2, service3, service4, fromServiceNonPaginatedConfig };
