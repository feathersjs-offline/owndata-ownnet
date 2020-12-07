const feathers = require('@feathersjs/feathers');
const socketio = require('@feathersjs/socketio');
const memory = require('feathers-memory');
const { realtimeWrapper } = require('../../../server/src');

module.exports = function (path, verbose) {
  const app = feathers()
    .configure(socketio())
    .use(path, memory({multi: true}));
    realtimeWrapper(app, path);

  const service = app.service(path);

  const logAction = (msg, _ctx) => {if (verbose) console.log(`SERVER: msg=${JSON.stringify(msg)}, _ctx.params=${JSON.stringify(_ctx.params)}, _ctx.query=${JSON.stringify(_ctx.query)}`)}
  service.on('created', logAction)
  service.on('updated', logAction)
  service.on('patched', logAction)
  service.on('removed', logAction)

  // const service = app.service('todos');
  // const rootService = app.service('/');
  // const publisher = () => app.channel('general');
  // const data = {
  //   text: 'some todo',
  //   complete: false
  // };

  // app.on('connection', connection =>
  //   app.channel('general').join(connection)
  // );

  // rootService.create(data);
  // rootService.publish(publisher);

  // service.create(data);
  // service.publish(publisher);

  return app;
};
