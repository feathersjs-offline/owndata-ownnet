const feathers = require('@feathersjs/feathers');
const memory = require('feathers-memory');

let ix = 0;

function newServicePath (path = '/tmp') {
  return path + ix++;
}

function service1 (wrapper) {
  let path = newServicePath();
  return fromServiceNonPaginatedConfig(wrapper, path);
}

function service2 (wrapper, path) {
  let app = feathers();
  app.use(path, memory({ multi: true }));
  let service = wrapper(app, path);
  return service;
}

function service2a (wrapper, basePath) {
  let app = feathers();
  let path = newServicePath(basePath);
  app.use(path, memory({ multi: true }));
  let service = wrapper(app, path);
  return { service, path };
}

function service3 (wrapper) {
  let app = feathers();
  let path = newServicePath();
  app.use(path, memory({ multi: false }));
  wrapper(app, path);
  return app.service(path);
}

function service4 (wrapper, options) {
  let app = feathers();
  let path = newServicePath();
  app.use(path, memory(options));
  wrapper(app, path, options);
  return app.service(path);
}

function fromServiceNonPaginatedConfig (wrapper, path) {
  let app = feathers();
  app.use(path, memory({ multi: true }));
  wrapper(app, path);
  return app.service(path);
}

module.exports = { newServicePath, service1, service2, service2a, service3, service4, fromServiceNonPaginatedConfig };
