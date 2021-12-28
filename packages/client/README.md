
# @feathersjs-offline/client

[![npm version](https://img.shields.io/npm/v/@feathersjs-offline/client.svg)](https://www.npmjs.com/package/@feathersjs-offline/client)
[![Build Status](https://img.shields.io/github/workflow/status/feathersjs-offline/owndata-ownnet/CI)](https://github.com/feathersjs-offline/owndata-ownnet/actions)
[![Known Vulnerabilities](https://snyk.io/test/github/feathersjs-offline/owndata-ownnet/badge.svg)](https://snyk.io/test/github/feathersjs-offline/owndata-ownnet)
[![Maintainability](https://api.codeclimate.com/v1/badges/22509121003eefaf32c5/maintainability)](https://codeclimate.com/github/feathersjs-offline/owndata-ownnet/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/22509121003eefaf32c5/test_coverage)](https://codeclimate.com/github/feathersjs-offline/owndata-ownnet/test_coverage)
[![Download Status](https://img.shields.io/npm/dm/@feathersjs-offline/client)](https://www.npmjs.com/package/@feathersjs-offline/client)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

> The client-part of Feathers Offline-first replication with optimistic updates (own-data / own-net).

[@feathersjs-offline/client](https://github.com/feathersjs-offline/offline-first/tree/main/owndata-ownnet/client) is a database service adapter enabling the ordinary Feathers DB functions for `WebSQL`, `IndexedDB`, and `LocalStorage` by extending the `localForage` package as described in [localForage](https://localforage.github.io/localForage) by using [@feathersjs-offline/localforage](https://github.com/feathersjs-offline/localforage).


## Installation

``` bash
npm install @feathersjs-offline/client --save
```

This module delivers all client parts necessary to utilize the FeathersJS Offline-first functionality.

## API
##  own-data

<br>

[![npm version](https://img.shields.io/npm/v/@feathersjs-offline/client.svg?style=flat-square)](https://www.npmjs.com/package/@feathersjs-offline/client)
[![Build Status](https://img.shields.io/github/workflow/status/feathersjs-offline/owndata-ownnet/CI)](https://github.com/feathersjs-offline/owndata-ownnet/actions)
[![Dependency Status](https://img.shields.io/david/feathersjs-offline/owndata-ownnet?path=packages%2Fclient&style=flat-square)](https://david-dm.org/@feathersjs-offline/client)
[![Known Vulnerabilities](https://snyk.io/test/github/feathersjs-offline/owndata-ownnet/badge.svg)](https://snyk.io/test/github/feathersjs-offline/owndata-ownnet)
[![Download Status](https://img.shields.io/npm/dm/@feathersjs-offline/client)](https://www.npmjs.com/package/@feathersjs-offline/client)

The `owndataWrapper` (and `Owndata`) of [@feathersjs-offline/client](https://github.com/feathersjs-offline/owndata-ownnet/tree/main/packages/client) is a database service adapter that wraps and extends any Feathers CRUD database adapter and behind the scenes locally stores data in [localStorage](https://developer.mozilla.org/en/docs/Web/API/Window/localStorage) in the browser or [AsyncStorage](https://facebook.github.io/react-native/docs/asyncstorage.html) in React Native.

__Options:__

All options available for the wrapped adapter can be used in addition to:

- `id` (*optional*, default: `'id'`) - The name of the id field property. Preferably, for `own-data` it ought to be `uuid.`
- `storage` (*optional*, default `['INDEXEDDB','WEBSQL','LOCALSTORAGE']`): - Determines which storage backend to use. If given an array (like in the default) the driver will use the first found backend, otherwise it will use the one given or fall-back to `'LOCALSTORAGE'`.
- `store` (*optional*, default `null`) - An object with id to item assignments to pre-initialize the data store.
- `paginate` (*optional*, default `false`) - A pagination object containing a default and max page size.
- `multi` (*optional*) - Allow create with arrays and update and remove with id null to change multiple items. Can be true for all methods or an array of allowed methods (e.g. `[ 'remove', 'create' ]`).
- `timedSync` (*optional*, default: `86400000` ms) - Determines the frequency of forced synchronization with the server. Default is 24 hours. 0 means never. You can always call `service.sync()` to perform a synchronization. Any ad hoc synchronizations does not affect any timed synchronizations.
- `fixedName` (*optional*, default: `null`) - Force the prefix name of the local DB and queue DB. This is useful when several apps on the same device use `@feathersjs-offline` and the same service name (e.g. `'/messages'`).
- `useShortUuid` (*optional*, default `true`) - Generate short `uuid`'s. If false long `uuid`'s are generated. This option should match whatever you choose on the server.
- `dates` (*optional*, default `false`) - Generate short `uuid`'s. If false long `uuid`'s are generated. This option should match whatever you choose on the server.
- `adapterTest` (*optional*, default `false`) - This is usually only used for running adapter tests as it suppresses returning the control attributes - `updatedAt,` `onServerAt,` `deletedAt,` and `uuid` (or what ever you chose to call them) in results.
- `myUuid` (*optional*, default `'uuid'`) - Rename control attribute `uuid` to suit your model.
- `myUpdatedAt` (*optional*, default `'updatedAt'`) - Rename control attribute `updatedAt` to suit your model.
- `myOnServerAt` (*optional*, default `'onServerAt'`) - Rename control attribute `onServerAt` to suit your model.
- `myDeletedAt` (*optional*, default `'deletedAt'`) - Rename control attribute `deletedAt` to suit your model.

> Please note, when renaming control attributes ***you must*** do it on both the client and the server side.
### Methods

The services under `owndataWrapper` control all implement the standard service methods as described in Services. In addition to this there are a couple of other methods to be used at your discretion.

#### .getEntries(params)

`service.getEntries(params) -> Promise` - Retrieves a list of all resources from the service. params.query can be used to filter and limit the returned data.

``` js
async app.service('/messages').getEntries(params)
  .then(result => {
    console.log(`entries = ${JSON.stringify(result)}`);
  });
```

Note: `getEntries` retrieves all resources (fulfilling the criteria of `params.query`) and always return an array.

#### .sync(bAll)

`service.sync(bAll) -> Promise` - Synchronize local data with server. if `bAll` is `true` synchronization is done beginning from BOT (Beginning Of Time). If `bAll` is `false` synchronization will be done from the newest possible timestamp (determined from resources in local DB). Synchronization will only be performed if no active operations involving the server are running.

``` js
async app.service('/messages').getEntries(params)
  .then(result => {
    console.log(`entries = ${JSON.stringify(result)}`);
  });
```

#### Internal service handles

Internal service handles are useful for receiving messages whenever a CRUD operation have been successfully performed. To receive a message you first have to register a message handler for the relevant service handle. You can register message handlers for the messages `created,` `updated,` `patched,` and `removed`. The available service handles are:

Handle | Comment
| --- | ---
service.local   | The local database holding the relevant service resources
service.queue   | The queue database holding all unfinished requests/operations
service.remote  | The server database (i.e. equivalent to app.service('/message') for non-wrapped services)

Service handles are read-only.

See an example using service handles and showing the inner workings of offline-first wrappers [here](https://github.com/feathersjs-offline/simple-example).

In addition, the service emits a `synced` message every time a synchronization has been attempted. It returns a value of `true` if the synchronization was successful and `false` otherwise.

### Example

See the [clients](https://docs.feathersjs.com/api/client.html) chapter for more information about using Feathers in the browser and React Native.

### Browser

``` html{16,21}
<html lang="en">
  <head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <meta name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=0" />
    <title>FeathersJS chat</title>
    <link rel="shortcut icon" href="favicon.ico">
    <link rel="stylesheet" href="//unpkg.com/feathers-chat@4.0.0/public/base.css">
    <link rel="stylesheet" href="//unpkg.com/feathers-chat@4.0.0/public/chat.css">
  </head>
  <body>
    <div id="app" class="flex flex-column"></div>
    <script src="//unpkg.com/@feathersjs/client@^4.3.0/dist/feathers.js"></script>
    <script src="/socket.io/socket.io.js"></script>
    <script src="//unpkg.com/@feathersjs-offline/client@^2.0/dist/feathersjs-offline-client.min.js"></script>
    <script type="text/javascript">
      var service = feathers.localstorage({
        storage: window.localStorage
      });
      var app = feathers().use('/messages', service);
      feathersOfflineClient.owndataWrapper(app, '/messages', {});

      var messages = app.service('messages');

      messages.on('created', function(message) {
        console.log('Someone created a message', message);
      });

      messages.create({
        text: 'Message created in browser'
  });
    </script>
  </body>
</html>
</script>
```

### React Native

``` sh
$ npm install @feathersjs/feathers feathers-localstorage @feathersjs-offline/owndata --save
```

``` js
import React from 'react-native';
import feathers from '@feathersjs/feathers';
import localstorage from 'feathers-localstorage';
import { owndataWrapper } from '@feathersjs-offline/client';

const { AsyncStorage } = React;

const app = feathers()
  .use('/messages', localstorage({ storage: AsyncStorage }));
owndataWrapper(app, '/messages', {});

const messages = app.service('messages');

messages.on('created', function(message) {
  console.log('Someone created a message', message);
});

messages.create({
  text: 'Message from React Native'
});
```

## own-net

<br>

[![npm version](https://img.shields.io/npm/v/@feathersjs-offline/client.svg?style=flat-square)](https://www.npmjs.com/package/@feathersjs-offline/client)
[![Build Status](https://img.shields.io/github/workflow/status/feathersjs-offline/owndata-ownnet/CI)](https://github.com/feathersjs-offline/owndata-ownnet/actions)
[![Dependency Status](https://img.shields.io/david/feathersjs-offline/owndata-ownnet?path=packages%2Fclient&style=flat-square)](https://david-dm.org/@feathersjs-offline/client)
[![Known Vulnerabilities](https://snyk.io/test/github/feathersjs-offline/owndata-ownnet/badge.svg)](https://snyk.io/test/github/feathersjs-offline/owndata-ownnet)
[![Download Status](https://img.shields.io/npm/dm/@feathersjs-offline/client)](https://www.npmjs.com/package/@feathersjs-offline/client)


The `ownnetWrapper` (and `Ownnet`) of [@feathersjs-offline/client](https://github.com/feathersjs-offline/owndata-ownnet/client) is a database service adapter that wraps and extends any Feathers CRUD database adapter and behind the scenes locally stores data in [localStorage](https://developer.mozilla.org/en/docs/Web/API/Window/localStorage) in the browser or [AsyncStorage](https://facebook.github.io/react-native/docs/asyncstorage.html) in React Native.

__Options:__

All options available for the wrapped adapter can be used in addition to:

- `id` (*optional*, default: `'id'`) - The name of the id field property. Preferably, for `own-data` it ought to be `uuid.`
- `storage` (*optional*, default `['INDEXEDDB','WEBSQL','LOCALSTORAGE']`): - Determines which storage backend to use. If given an array (like in the default) the driver will use the first found backend, otherwise it will use the one given or fall-back to `'LOCALSTORAGE'`.
- `store` (*optional*, default `null`) - An object with id to item assignments to pre-initialize the data store.
- `paginate` (*optional*, default `false`) - A pagination object containing a default and max page size.
- `multi` (*optional*) - Allow create with arrays and update and remove with id null to change multiple items. Can be true for all methods or an array of allowed methods (e.g. `[ 'remove', 'create' ]`).
- `timedSync` (*optional*, default: `86400000` ms) - Determines the frequency of forced synchronization with the server. Default is 24 hours. 0 means never. You can always call `service.sync()` to perform a synchronization. Any ad hoc synchronizations does not affect any timed synchronizations.
- `fixedName` (*optional*, default: `null`) - Force the prefix name of the local DB and queue DB. This is useful when several apps on the same device use `@feathersjs-offline` and the same service name (e.g. '/messages').
- `dates` (*optional*, default `false`) - Generate short `uuid`'s. If false long `uuid`'s are generated. This option should match whatever you choose on the server.
- `useShortUuid` (*optional*, default `true`) - Generate short `uuid`'s. If false long `uuid`'s are generated. This option should match whatever you choose on the server.
- `adapterTest` (*optional*, default `false`) - This is usually only used for running adapter tests as it suppresses returning `updatedAt,` `onServerAt,` `deletedAt,` and `uuid` in results.

### Methods

The services under `ownnetWrapper` control all implement the standard service methods as described in Services. In addition to this there are a couple of other methods to be used at your discretion.

### .getEntries(params)

`service.getEntries(params) -> Promise` - Retrieves a list of all resources from the service. `params.query` can be used to filter and limit the returned data.

``` js
async app.service('/messages').getEntries(params)
  .then(result => {
    console.log(`entries = ${JSON.stringify(result)}`);
  });
```

Note: `getEntries` retrieves all resources (fulfilling the criteria of `params.query`) and always return an array.

### .sync(bAll)

`service.sync(bAll) -> Promise` - Synchronize local data with server. if `bAll` is `true` synchronization is done beginning from BOT (Beginning Of Time). If `bAll` is `false` synchronization will be done from the newest possible timestamp (determined from resources in local DB). Synchronization will only be performed if no active operations involving the server are running.

``` js
async app.service('/messages').getEntries(params)
  .then(result => {
    console.log(`entries = ${JSON.stringify(result)}`);
  });
```

### Internal service handles

Internal service handles are useful for receiving messages whenever a CRUD operation have been successfully performed. To receive a message tou first have to register a message handler for the relevant service handle. You can register message handlers for the messages `created,` `updated,` `patched,` and `removed.` The available service handles are

Handle | Comment
| ---- | ---- |
service.local   | The local database holding the relevant service resources
service.queue   | The queue database holding all unfinished requests/operations
service.remote  | The server database (i.e. equivalent to app.service('/messages') for non-wrapped services)

Service handles are read-only.

See an example using service handles and showing the inner workings of offline-first wrappers [here](https://github.com/feathersjs-offline/simple-example).

In addition, the service emits a `synced` message every time a synchronization has been attempted. It returns a value of `true` if the synchronization was successful and `false` otherwise.

### Example

See the [clients](https://docs.feathersjs.com/api/client.html) chapter for more information about using Feathers in the browser and React Native.

### Browser

``` html{16,21}
<html lang="en">
  <head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <meta name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=0" />
    <title>FeathersJS chat</title>
    <link rel="shortcut icon" href="favicon.ico">
    <link rel="stylesheet" href="//unpkg.com/feathers-chat@4.0.0/public/base.css">
    <link rel="stylesheet" href="//unpkg.com/feathers-chat@4.0.0/public/chat.css">
  </head>
  <body>
    <div id="app" class="flex flex-column"></div>
    <script src="//unpkg.com/@feathersjs/client@^4.3.0/dist/feathers.js"></script>
    <script src="/socket.io/socket.io.js"></script>
    <script src="//unpkg.com/@feathersjs-offline/client@^2.0/dist/feathersjs-offline-client.min.js"></script>
    <script type="text/javascript">
      var service = feathers.localstorage({
        storage: window.localStorage
      });
      var app = feathers().use('/messages', service);
      feathersOfflineClient.ownnetWrapper(app, '/messages', {});

      var messages = app.service('messages');

      messages.on('created', function(message) {
        console.log('Someone created a message', message);
      });

      messages.create({
        text: 'Message created in browser'
  });
    </script>
  </body>
</html>
</script>
```

#### React Native

``` sh
$ npm install @feathersjs/feathers feathers-localstorage @feathersjs-offline/ownnet --save
```

``` js
import React from 'react-native';
import feathers from '@feathersjs/feathers';
import localstorage from 'feathers-localstorage';
import { ownnetWrapper } from '@feathersjs-offline/ownnet';

const { AsyncStorage } = React;

const app = feathers()
  .use('/messages', localstorage({ storage: AsyncStorage }));
ownnetWrapper(app, '/messages', {});

const messages = app.service('messages');

messages.on('created', function(message) {
  console.log('Someone created a message', message);
});

messages.create({
  text: 'Message from React Native'
});
```

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

> **Pro tip:** If your key is not `uuid` then you have to manually set the key on the client *before* calling `create` as you have no guarantee that the backend answers. You set your key with the `id` parameter.

> **Pro tip:** If you want the back-end to hold all users' data in one table (or collection), then all rows (or documents) must include an user identification (e.g. '`_id`' of `users`) and the servers CRUD methods should be appropriately be guarded with a query (e.g. `{query: {userId: <whatever-the-value-is>}}`).

Also, updates to the client from a requested sync will not execute any hooks on the client but any queued events on the device will trigger hooks on the server (both on back-end and possibly on any other devices depending on your channels set-up).

This wrapper works properly only in conjunction with the server counterpart `import { realtimeWrapper } from '@feathersjs-offline/server';` configured correctly on the servers service.

> **Pro tip:** `owndataWrapper,` `ownnetWrapper,` and `realtimeWrapper` works on both a Feathers client and a Feathers server.

## License

Copyright (c) 2020

Licensed under the [MIT license](LICENSE).
