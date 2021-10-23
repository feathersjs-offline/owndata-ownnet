# @feathersjs-offline/client

[![npm version](https://img.shields.io/npm/v/@feathersjs-offline/client.svg?style=flat-square)](https://www.npmjs.com/package/@feathersjs-offline/client)
[![Build Status](https://img.shields.io/github/workflow/status/feathersjs-offline/owndata-ownnet/CI)](https://github.com/feathersjs-offline/owndata-ownnet/actions)
[![Dependency Status](https://img.shields.io/david/feathersjs-offline/owndata-ownnet?path=packages%2Fclient&style=flat-square)](https://david-dm.org/@feathersjs-offline/client)
[![Known Vulnerabilities](https://snyk.io/test/github/feathersjs-offline/owndata-ownnet/badge.svg)](https://snyk.io/test/github/feathersjs-offline/owndata-ownnet)
[![Maintainability](https://api.codeclimate.com/v1/badges/22509121003eefaf32c5/maintainability)](https://codeclimate.com/github/feathersjs-offline/owndata-ownnet/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/22509121003eefaf32c5/test_coverage)](https://codeclimate.com/github/feathersjs-offline/owndata-ownnet/test_coverage)
[![Download Status](https://img.shields.io/npm/dm/@feathersjs-offline/client)](https://www.npmjs.com/package/@feathersjs-offline/client)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)


> The client-part of Feathers Offline-first replication with optimistic updates (own-data / own-net).

> As of version 2.0.0 will make use of [`@feathersjs-offline/localforage`](https://github.com/feathersjs-offline/localforage) to handle all the behind-the-scenes storing which means you can use and store objects, ArrayBuffers, Blobs, TypesArrays etc.


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
```

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
```

### Options:
All options available for the wrapped adapter can be used in addition to:

- `storage` (*optional*, default: `'INDEXEDDB'`) - The storage backend. Must be one or more of `'INDEXEDDB'`, `'WEBSQL'`, or `'LOCALSTORAGE'`. The adapter will use the same sequence as fall-back if the desired storage type is not supported on the actual device. Alternatively, you can supply an array of storage backends determining the priority of your choice.
- `version` (*optional*, default: `1.0`) - `localforage` driver version to use. Currently only `1.0` exists.
- `size` (*optional*, default `4980736`) - The maximum database size required. Default DB size is _JUST UNDER_ 5MB, as it's the highest size we can use without a prompt in any browser.
- `id` (*optional*, default: `'id'`) - The name of the id field property.
- `name` (*optional*, default: `'feathers'`) - The key to store data under in local or async storage.
- `store` (*optional*) - An object with id to item assignments to pre-initialize the data store.
on a NodeJS app.
- `events` (optional) - A list of custom service events sent by this service.
- `paginate` (optional) - A pagination object containing a default and max page size.
- `whitelist` (optional) - A list of additional query parameters to allow.
- `multi` (optional) - Allow create with arrays and update and remove with id null to change multiple items. Can be true for all methods or an array of allowed methods (e.g. [ 'remove', 'create' ]).
- `dates` (*optional*, default `false`) - Convert ISO-formatted date strings to `Date` objects in result sets.
- `useShortUuid` (optional, default `true`) - Generate short `uuid`s (sufficient for most applications). If `false` long `uuid`s are generated. This option should match whatever you choose on the server side.
- `adapterTest` (optional, default `false`) - This is usually only used for running adapter tests as it suppresses results containing `uuid`, `updatedAt`, `deletedAt`, and `onServerAt`.

### Example
Here is an example of a FeathersJS client with a messages in-memory service that supports pagination:

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

For at more useful example [see this](https://github.com/feathersjs-offline/owndata-ownnet/simple-example/).

### Own-net

``` js
Ownnet([options])
```

Returns a new service instance initialized with the given options.

``` js
import { Ownnet } from '@feathersjs-offline/client');

app.use('/messages', Ownnet());
app.use('/messages', Ownnet({ id, events, paginate }));
```

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
```

### Options: 

All options available for the wrapped adapter can be used in addition to:

- `storage` (*optional*, default: `'INDEXEDDB'`) - The storage backend. Must be one or more of `'INDEXEDDB'`, `'WEBSQL'`, or `'LOCALSTORAGE'`. The adapter will use the same sequence as fall-back if the desired storage type is not supported on the actual device. Alternatively, you can supply an array of storage backends determining the priority of your choice.
- `version` (*optional*, default: `1.0`) - `localforage` driver version to use. Currently only `1.0` exists.
- `size` (*optional*, default `4980736`) - The maximum database size required. Default DB size is _JUST UNDER_ 5MB, as it's the highest size we can use without a prompt in any browser.
- `id` (*optional*, default: `'id'`) - The name of the id field property.
- `name` (*optional*, default: `'feathers'`) - The key to store data under in local or async storage.
- `store` (*optional*) - An object with id to item assignments to pre-initialize the data store.
on a NodeJS app.
- `events` (optional) - A list of custom service events sent by this service.
- `paginate` (optional) - A pagination object containing a default and max page size.
- `whitelist` (optional) - A list of additional query parameters to allow.
- `multi` (optional) - Allow create with arrays and update and remove with id null to change multiple items. Can be true for all methods or an array of allowed methods (e.g. [ 'remove', 'create' ]).
- `dates` (*optional*, default `false`) - Convert ISO-formatted date strings to `Date` objects in result sets.
- `useShortUuid` (optional, default `true`) - Generate short `uuid`s (sufficient for most applications). If `false` long `uuid`s are generated. This option should match whatever you choose on the server side.
- `adapterTest` (optional, default `false`) - This is usually only used for running adapter tests as it suppresses results containing `uuid`, `updatedAt`, `deletedAt`, and `onServerAt`.


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
// and a maximum size of 4 and make sure dates are of type Date
app.use('/messages', Ownnet({
  date: true,
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

For at more useful example [see this](https://github.com/feathersjs-offline/owndata-ownnet/simple-example/).

## Documentation

You can read the original docs [here](https://auk.docs.feathersjs.com/guides/offline-first/readme.html) discussing the theories behind it all. The new and updated documentation is available [here](https://feathersjs-offline.github.io/docs).

> _Summary:_
> 
> `own-data` / `own-net` are two related strategies implemented in Feathers Offline-first. Both strategies queues CRUD events for a wrapped service locally until the device have connection to the server, but to the user the CRUD events are executed immediately using optimistic mutation strategy.
>
> `own-data` will re-play all queued event to the server in the order they were performed in offline mode. This allows the the server to react on each event (mutation). It may, for example, run hooks which send emails on certain mutations.
>
> `own-net` on the other hand will only play the end result of all queued events for a given item (ie. row or document) to the server. If an item (document) is mutated 5 times only the result will reach the server when connection is established. If a record is patched and finally removed while still offline, the server will never see the mutations. The server may still react on each event (mutation), but bear in mind the changes are possibly only _net_ changes. `own-net` usually results in much shorter synchronization times and reduced traffic between client and server.

For `own-data` / `onw-net` implementations you must assure that the table (or collection) under control *must* implement attributes `uuid,` `updatedAt,` `onServerAt,` and `deletedAt`.

> **Pro tip:** If your key is not `uuid` then you have to manually set the key on the client *before* calling `create` as you have no guarantee that the backend answers. You set your preferred key with the `id` option parameter.

> **Pro tip:** If you want the back-end to hold all users' data in one table (or collection), then all rows (or documents) must include an user identification (e.g. '`_id`' of `users`) and the servers CRUD methods should be appropriately be guarded with a query (e.g. `{query: {userId: <whatever-the-value-is>}}`).

Also, updates to the client from a requested sync will not execute any hooks on the client but any queued events on the device will trigger hooks on the server (both on back-end and possibly on any other devices depending on your channels set-up).

This wrapper works properly only in conjunction with the server counterpart `import { realtimeWrapper } from '@feathersjs-offline/server';` configured correctly on the servers service.

> **Pro tip:** `owndataWrapper,` `ownnetWrapper,` and `realtimeWrapper` works on both a Feathers client and a Feathers server. As `owndataWrapper` and `ownnetWrapper` both originally are intended for browser use you can use them in a NodeJS application too by doing something like:
>
> ``` js
> const { LocalStorage } = require('node-localstorage');
> const localStorage = new LocalStorage('./persist');
> global.localStorage = localStorage;
> ```
>
> and specify `'LOCALSTORAGE'` as the `storage` option to the wrapper of your choice.

## License

Copyright (c) 2020 by Feathers

Licensed under the [MIT license](LICENSE).
