# @feathersjs-offline/client

[![Maintainability](https://api.codeclimate.com/v1/badges/22509121003eefaf32c5/maintainability)](https://codeclimate.com/github/feathersjs-offline/owndata-ownnet/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/22509121003eefaf32c5/test_coverage)](https://codeclimate.com/github/feathersjs-offline/owndata-ownnet/test_coverage)
[![Build Status](https://travis-ci.com/feathersjs-offline/owndata-ownnet.svg?branch=main)](https://travis-ci.com/feathersjs-offline/owndata-ownnet)
[![Dependency Status](https://david-dm.org/feathersjs-offline/owndata-ownnet.svg?style=flat-square&path=packages/client/)](https://david-dm.org/feathersjs-offline/owndata-ownnet/tree/main/packages/client)
[![Download Status](https://img.shields.io/npm/dm/@feathersjs-offline/client.svg?style=flat-square)](https://www.npmjs.com/package/@feathersjs-offline/client)

[![Known Vulnerabilities](https://snyk.io/test/github/feathersjs-offline/owndata-ownnet/badge.svg)](https://snyk.io/test/github/feathersjs-offline/owndata-ownnet)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)


> The client-part of Feathers Offline-first replication with optimistic updates (own-data / own-net).


## Installation

``` bash
npm install @feathersjs-offline/client --save
```

This module delivers all parts necessary to utilize the FeathersJS Offline-first functionality.

## API

### Own-data

``` js
Owndata([options])
```
Returns a new service instance initialized with the given options.

``` js
import { Owndata } from '@feathersjs-offline/client');

app.use('/messages', Owndata());
app.use('/messages', Owndata({ id, events, paginate }));
````

or

``` js
owndataWrapper(app, path, [options])
```
Returns a new wrapped service instance initialized with the given options.

``` js
import memory from 'feathers-memory');
import { owndataWrapper } from '@feathersjs-offline/client');

// Wrap local db with own-data
app.use('/messages', memory());
owndataWrapper(app, 'messages');

// Wrap local db with own-data (and special options)
app.use('/messages', memory());
owndataWrapper(app, 'messages', { id, events, paginate }));

// Wrap server path `snippets`. (No prior `app.use('snippets', ...);` )
owndataWrapper(app, 'snippets');
````

### Options:
All options available for the wrapped adapter can be used in addition to:

- `id` (optional, default: `id`) - The name of the id field property.
- `store` (optional) - An object used for initializing the storage (see `feathers-memory`).
- `storage` (optional, default: `localStorage`) - Decides where data will be stored locally. You can choose between `localStorage` and `sessionStorage` on the client, but only `localStorage` on a NodeJS app.
- `events` (optional) - A list of custom service events sent by this service.
- `paginate` (optional) - A pagination object containing a default and max page size.
- `whitelist` (optional) - A list of additional query parameters to allow.
- `multi` (optional) - Allow create with arrays and update and remove with id null to change multiple items. Can be true for all methods or an array of allowed methods (e.g. [ 'remove', 'create' ]).
- `useShortUuid` (optional, default `true`) - Generate short `uuid`s (sufficient for most applications). If `false` long `uuid`s are generated. This option should match whatever you choose on the server side.
- `trackMutations` (optional, default `true`) - Should we track mutations à la the `feathers-realtime-offline` way. Today the preferred way is to register a listener on the service on the relevant message (`created`, `updated`, `patched`, or `removed`). We have three services: two on the client (`app.service('mypath').local` and `app.service('mypath').queue`) and one on the "server" (`app.service('mypath').remote`). The "server" can be the client, but it's hard to imagine the real world usefulness of this...
- `publication` (optional, default `null`) - 
- `subscriber` (optional, default `() => {}`) - 
- `fixedName` (optional, default `false`) - 
- `adapterTest` (optional, default `false`) - This is usually only used for running adapter tests as it suppresses results containing `uuid`, `updatedAt`, `deletedAt`, and `onServerAt`.

### Example
Here is an example of a FeathersJS client with a messages in-memory service that supports pagination:

```bash
$ npm install @feathersjs/feathers @feathersjs/express @feathersjs/socketio @feathersjs/errors feathers-memory @feathersjs-offline/client
```

In app.js:

``` js
const feathers = require('@feathersjs/feathers');
const io = require('socket.io-client');
const port = 3030;
const socket = io(`http://localhost:${port}`);
const socketio = require('@feathersjs/socketio-client');
const io = require('@feathersjs/socketio');
const { Owndata } = require('@feathersjs-offline/client');

// Create an Express compatible Feathers application instance.
const app = feathers();

// Configure socketio 
app.configure(socketio(socket));

// Create an own-net FeathersJS service with a default page size of 2 items
// and a maximum size of 4
app.use('/messages', Owndata({
  paginate: {
    default: 2,
    max: 4
  }
}));

// Create a silly Message
app.service('messages').create({
  text: 'Message created on client'
}).then(message => console.log('Created message', message));
```

Run the example together with the example in `@feathersjs-offline/server` and you should see two messages displayed - one from this client and one from the server.

For at more useful example see package `@feathersjs-offline/example`.

### Own-net

``` js
Ownnet([options])
```
Returns a new service instance initialized with the given options.

``` js
import { Ownnet } from '@feathersjs-offline/client');

app.use('/messages', Ownnet());
app.use('/messages', Ownnet({ id, events, paginate }));
````

or

``` js
ownnetWrapper(app, path, [options])
```
Returns a new wrapped service instance initialized with the given options.

``` js
import memory from 'feathers-memory');
import { ownnetWrapper } from '@feathersjs-offline/client');

// Wrap local db with own-net
app.use('/messages', memory());
ownnetWrapper(app, 'messages');

// Wrap local db with own-net (and special options)
app.use('/messages', memory());
ownnetWrapper(app, 'messages', { id, events, paginate }));

// Wrap server path `snippets`. (No prior `app.use('snippets', ...);` )
ownnetWrapper(app, 'snippets');
````

### Options:
All options available for the wrapped adapter can be used in addition to:

- `id` (optional, default: 'id') - The name of the id field property.
- `events` (optional) - A list of custom service events sent by this service.
- `paginate` (optional) - A pagination object containing a default and max page size.
- `whitelist` (optional) - A list of additional query parameters to allow.
- `multi` (optional) - Allow create with arrays and update and remove with id null to change multiple items. Can be true for all methods or an array of allowed methods (e.g. [ 'remove', 'create' ]).
- `useShortUuid` (optional, default `true`) - Generate short `uuid`s. If `false` long `uuid`s are generated. This option should match whatever you choose on the client.
- `adapterTest` (optional, default `false`) - This is usually only used for running adapter tests as it suppresses the generation of `uuid` and updating of `onServerAt`.

### Example
Here is an example of a FeathersJS client with a messages own-net service that supports pagination:

``` bash
$ npm install @feathersjs/feathers @feathersjs/express @feathersjs/socketio @feathersjs/errors feathers-memory @feathersjs-offline/client
```

In app.js:

``` js
const feathers = require('@feathersjs/feathers');
const io = require('socket.io-client');
const port = 3030;
const socket = io(`http://localhost:${port}`);
const socketio = require('@feathersjs/socketio-client');
const io = require('@feathersjs/socketio');
const { Ownnet } = require('@feathersjs-offline/client');

// Create an Express compatible Feathers application instance.
const app = feathers();

// Configure socketio 
app.configure(socketio(socket));

// Create an own-net FeathersJS service with a default page size of 2 items
// and a maximum size of 4
app.use('/messages', Ownnet({
  paginate: {
    default: 2,
    max: 4
  }
}));

// Create a silly Message
app.service('messages').create({
  text: 'Message created on client'
}).then(message => console.log('Created message', message));
```

Run the example together with the example in `@feathersjs-offline/server` and you should see two messages displayed - one from this client and one from the server.

For at more useful example [see this](https://github.com/feathersjs-offline/owndata-ownnet/example/).

## Documentation

You can read the original docs [here](https://auk.docs.feathersjs.com/guides/offline-first/readme.html). The new and updated documentation is available [here](https://feathersjs-offline.github.io/docs).

> _Summary:_
>
> `own-data`/ `own-net` are two related strategies implemented in Feathers Offline-first. Both strategies queues CRUD events for a wrapped service until the device have connection to the server.
>
> `own-data` will re-play all queued event to the server in the order they were performed in offline mode. This allows the the server to react on each event (mutation). It may, for example, run hooks which send emails on certain mutations.
>
> `own-net` on the other hand will only play the end result of all queued event to the server. If a record (document) is mutated 5 times only the result will reach the server when connection is established. If a record is patched and finally removed while still offline, the server will never see the mutations. The server may still react on each event (mutation), but bear in mind the changes are possibly only 'net' changes.

For `own-data` / `onw-net` implementations you must assure that the table (or collection) under control *must* implement attributes `uuid,` `updatedAt,` `onServerAt,` and `deletedAt`.

> **Pro tip:** If your key is not `uuid` then you have to manually set the key on the client *before* calling `create` as you have no guarantee that the backend answers. You set your key with the `id` parameter.

> **Pro tip:** If you want the back-end to hold all users' data in one table (or collection), then all rows (or documents) must include a user identification (e.g. '`_id`' of `users`) and an appropriate query should be set in the `query` parameter when registering the replicator (e.g. `{query: {userId: <whatever-the-value-is>}}`).

Also, updates to the client from a requested sync will not execute any hooks on the client but any queued events on the device will trigger hooks on the server (both on back-end and possibly on any other devices depending on your channels set-up).

This wrapper works properly only in conjunction with the server counterpart `import { realtimeWrapper } from '@feathersjs-offline/server';` configured correctly on the servers service.

> **Pro tip:** `owndataWrapper,` `ownnetWrapper,` and `realtimeWrapper` works on both a Feathers client and a Feathers server.

## License

Copyright (c) 2020

Licensed under the [MIT license](LICENSE).
