# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.6](http://github.com/feathersjs-offline/owndata-ownnet/packages/client/compare/v2.0.0...v2.0.6) (2021-12-28)

Renaming of control attributes (`uuid`, `updatedAt`, `onServerAt`, and `deletedAt`) implemented.

## [2.0.0](http://github.com/feathersjs-offline/owndata-ownnet/packages/client/compare/v2.0.0...v2.0.3) (2021-10-28)

No change. Auto-bump CI implemented.
# [2.0.0](http://github.com/feathersjs-offline/owndata-ownnet/packages/client/compare/v1.1.1...v2.0.0) (2021-10-28)

`@feathers-offline/client` now use `@feathers-offline/localforage` as storage
backend which will allow the developer to utilise `IndexedDB`, `WebSQL`, and
`LocalStorage` (and `AsyncStorage`for React). This can allow for more local
(browser) storage than the approx. 5MB as `LocalStorage` has as maximum.

Code clean-up and support for `dates` option ensuring ISO-formatted strings in
results sets always are returned as Date's.

This is a **Breaking change** as you have to specify the `storage` option in another way.

Fixes #33 'Replacing local storage'.
## [1.1.1](http://github.com/feathersjs-offline/owndata-ownnet/packages/client/compare/v1.1.0...v1.1.1) (2021-08-01)
Fixed problem with reading latest syncedAt from AsyncStorage.

## [1.1.0](http://github.com/feathersjs-offline/owndata-ownnet/packages/client/compare/v1.0.7...v1.0.8) (2021-07-30)

*** Breaking change *** Clients will no longer try to automatically supply a
valid `localStorage` as this ruins pre-compiled clients (eg. React). If you
still want to use the client eg. for a "slave" server, then you need to include
something like:
``` js
let LocalStorage = require('node-localstorage').LocalStorage;
global.localStorage = new LocalStorage('./.scratch');
```
before requiring `@feathersjs-offline/client`.
## [1.0.8](http://github.com/feathersjs-offline/owndata-ownnet/packages/client/compare/v1.0.7...v1.0.8) (2021-07-17)

Clients automatic inclusion of `node-localstorage` moved into `_setup()` as it
otherwise always will be included in compiled clients.


## [1.0.7](http://github.com/feathersjs-offline/owndata-ownnet/packages/client/compare/v1.0.3...v1.0.7) (2021-04-27)

**Note:** Version bump only for package @feathersjs-offline/client





## [1.0.6](http://github.com/feathersjs-offline/owndata-ownnet/packages/client/compare/v1.0.3...v1.0.6) (2020-12-24)

**Note:** Version bump only for package @feathersjs-offline/client





## [1.0.3](http://github.com/feathersjs-offline/compare/v1.0.2...v1.0.3)
setup() of wrapped services will now be called.

## [1.0.2](http://github.com/feathersjs-offline/owndata-ownnet/packages/client/compare/v1.0.1...v1.0.2) (2020-12-11)

Removed cleanupParams() as it essentially enden up being a noop.

## [1.0.1](http://github.com/feathersjs-offline/owndata-ownnet/packages/client/compare/v1.0.0...v1.0.1) (2020-12-11)

First version released.
