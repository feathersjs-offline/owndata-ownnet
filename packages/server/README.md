# @feathersjs-offline/server
[![npm version](https://img.shields.io/npm/v/@feathersjs-offline/server.svg?style=flat-square)](https://www.npmjs.com/package/@feathersjs-offline/server)
[![Build Status](https://img.shields.io/github/workflow/status/feathersjs-offline/owndata-ownnet/CI)](https://github.com/feathersjs-offline/owndata-ownnet/actions)
[![Known Vulnerabilities](https://snyk.io/test/github/feathersjs-offline/owndata-ownnet/badge.svg)](https://snyk.io/test/github/feathersjs-offline/owndata-ownnet)
[![Maintainability](https://api.codeclimate.com/v1/badges/22509121003eefaf32c5/maintainability)](https://codeclimate.com/github/feathersjs-offline/owndata-ownnet/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/22509121003eefaf32c5/test_coverage)](https://codeclimate.com/github/feathersjs-offline/owndata-ownnet/test_coverage)
[![Download Status](https://img.shields.io/npm/dm/@feathersjs-offline/server)](https://www.npmjs.com/package/@feathersjs-offline/server)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)



> The server-part of Feathers Offline-first replication with optimistic updates (own-data / own-net).

## Installation

``` bash
npm install '@feathersjs-offline/server' --save
```

### Options:

All options available for the wrapped adapter can be used in addition to:

- `useShortUuid` (optional, default `true`) - Generate short `uuid`s. If `false` long `uuid`s are generated. This option should match whatever you choose on the client.
- `dates` (*optional*, default `false`) - Generate short `uuid`'s. If false long `uuid`'s are generated. This option should match whatever you choose on the server.
- `adapterTest` (*optional*, default `false`) - This is usually only used for running adapter tests as it suppresses returning the control attributes - `updatedAt,` `onServerAt,` `deletedAt,` and `uuid` (or what ever you chose to call them) in results.
- `myUuid` (*optional*, default `'uuid'`) - Rename control attribute `uuid` to suit your model.
- `myUpdatedAt` (*optional*, default `'updatedAt'`) - Rename control attribute `updatedAt` to suit your model.
- `myOnServerAt` (*optional*, default `'onServerAt'`) - Rename control attribute `onServerAt` to suit your model.
- `myDeletedAt` (*optional*, default `'deletedAt'`) - Rename control attribute `deletedAt` to suit your model.

> Please note, when renaming control attributes ***you must*** do it on both the client and the server side.
## Documentation

You can read the original docs [here](https://auk.docs.feathersjs.com/guides/offline-first/readme.html) discussing the theories behind it all. The new and updated documentation is available [here](https://feathersjs-offline.github.io/docs).

> _Summary:_
> 
> `own-data` / `own-net` are two related strategies implemented in Feathers Offline-first. Both strategies queues CRUD events for a wrapped service locally until the device have connection to the server, but to the user the CRUD events are executed immediately using optimistic mutation strategy.
>
> `own-data` will re-play all queued event to the server in the order they were performed in offline mode. This allows the the server to react on each event (mutation). It may, for example, run hooks which send emails on certain mutations.
>
> `own-net` on the other hand will only play the end result of all queued events for a given item (ie. row or document) to the server. If an item (document) is mutated 5 times only the result will reach the server when connection is established. If a record is patched and finally removed while still offline, the server will never see the mutations. The server may still react on each event (mutation), but bear in mind the changes are possibly only _net_ changes. `own-net` usually results in much shorter synchronization times and reduced traffic between client and server.

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

For at more useful example [see this](https://github.com/feathersjs-offline/simple-example/).

## See also
This service wrapper works in conjunction with either the `own-data` or the `own-net` client counterparts provided by `@feathersjs-offline/client`.

## License

Copyright (c) 2020

Licensed under the [MIT license](LICENSE).
