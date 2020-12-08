# @feathersjs-offline/server



[![Build Status](https://travis-ci.org/feahtersjs-offline/feathersjs-offline-server.png?branch=master)](https://travis-ci.org/feahtersjs-offline/feathersjs-offline-server)
[![Code Climate](https://codeclimate.com/github/feahtersjs-offline/feathersjs-offline-server/badges/gpa.svg)](https://codeclimate.com/github/feahtersjs-offline/feathersjs-offline-server)
[![Test Coverage](https://codeclimate.com/github/feahtersjs-offline/feathersjs-offline-server/badges/coverage.svg)](https://codeclimate.com/github/feahtersjs-offline/feathersjs-offline-server/coverage)
[![Dependency Status](https://img.shields.io/david/feahtersjs-offline/feathersjs-offline-server.svg?style=flat-square)](https://david-dm.org/feahtersjs-offline/feathersjs-offline-server)
[![Download Status](https://img.shields.io/npm/dm/feathersjs-offline-server.svg?style=flat-square)](https://www.npmjs.com/package/feathersjs-offline-server)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)



> The server-part of Feathers Offline-first replication with optimistic updates (own-data / own-net).

## Installation

``` bash
npm install '@feathersjs-offline/server' --save
```

### Options:

All options available for the wrapped adapter can be used in addition to:

- `useShortUuid` (optional, default `true`) - Generate short `uuid`s. If `false` long `uuid`s are generated. This option should match whatever you choose on the client.
- `adapterTest` (optional, default `false`) - This is usually only used for running adapter tests as it suppresses the generation of `uuid`, and updating of `onServerAt`.

## Documentation

You can read the original docs [here](https://auk.docs.feathersjs.com/guides/offline-first). The new and updated documentation is available [here](https://feathersjs-offline.github.io/docs).

> _Summary:_
> 
> `own-data`/ `own-net` are two related strategies implemented in Feathers Offline-first. Both strategies queues CRUD events for a wrapped service until the device have connection to the server.
>
> `own-data` will re-play all queued event to the server in the order they were performed in offline mode. This allows the the server to react on each event (mutation). It may, for example, run hooks which send emails on certain mutations.
>
> `own-net` on the other hand will only play the end result of all queued event to the server. If a record (document) is mutated 5 times only the result will reach the server when connection is established. If a record is patched and finally removed while still offline, the server will never see the mutations. The server may still react on each event (mutation), but bear in mind the changes are possibly only 'net' changes.

This package is the server wrapper which works in co-operation with `@feathersjs-offline/client` package for clients.

For `own-data`/ `own-net` implementations you must assure that the table (or collection) under control *must* implement both `uuid`, `updatedAt`, `onServerAt`, and `deletedAt` attributes.

> **Pro tip:** If your key is not `uuid` then you have to manually set the key *before* calling `create` either on the client or in a service hook as you have no guarantee that the backend answers.

Also, updates to the client from a requested sync will not execute any hooks on the client but any queued events on the device will trigger hooks on the server (both on back-end and possibly on any other devices depending on your channels set-up).

This wrapper works properly only in conjunction with the client counterpart `import { owndataWrapper, ownnetWrapper } from '@feathersjs-offline/client';` configured correctly on the client service.

> **Pro tip:** `owndataWrapper`, `ownnetWrapper`, and `realtimeWrapper` works on both a Feathers client and a Feathers server.

## Example
Here is an example of a FeathersJS server with a messages in-memory service that supports pagination:

``` bash
$ npm install @feathersjs/feathers @feathersjs/express @feathersjs/socketio @feathersjs/errors feathers-memory @feathersjs-offline/server
```

In app.js:

``` js
const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const realtimeWrapper = require('@feathersjs-offline/server');

const memory = require('feathers-memory');

// Create an Express compatible Feathers application instance.
const app = express(feathers());
// Turn on JSON parser for REST services
app.use(express.json());
// Turn on URL-encoded parser for REST services
app.use(express.urlencoded({ extended: true }));
// Enable REST services
app.configure(express.rest());
// Enable REST services
app.configure(socketio());
// Create an in-memory FeathersJS offline realtime service with a default page size of 2 items
// and a maximum size of 4
app.use('/messages', memory({
  paginate: {
    default: 2,
    max: 4
  }
}));
realtimeWrapper(app, '/messages');

// Set up default error handler
app.use(express.errorHandler());

// Create a dummy Message
app.service('messages').create({
  text: 'Message created on server'
}).then(message => console.log('Created message', message));

// Start the server.
const port = 3030;

app.listen(port, () => {
  console.log(`Feathers server listening on port ${port}`)
});
```

Run the example with `node app` and go to `http://localhost:3030/messages`.

For at more useful example [see this](https://github.com/feathersjs-offline/owndata-ownnet/example/).

## See also
This service wrapper works in conjunction with either the `own-data` or the `own-net` client counterparts provided by `@feathersjs-offline/client`.

## License

Copyright (c) 2020

Licensed under the [MIT license](LICENSE).
