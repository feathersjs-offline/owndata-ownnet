Server [![npm version](https://img.shields.io/npm/v/@feathersjs-offline/server.svg?style=flat-square)](https://www.npmjs.com/package/@feathersjs-offline/server)
[![Build Status](https://img.shields.io/github/workflow/status/feathersjs-offline/owndata-ownnet/CI)](https://github.com/feathersjs-offline/owndata-ownnet/actions)
[![Dependency Status](https://img.shields.io/david/feathersjs-offline/owndata-ownnet?path=packages%2Fserver&style=flat-square)](https://david-dm.org/@feathersjs-offline/server)
[![Known Vulnerabilities](https://snyk.io/test/github/feathersjs-offline/owndata-ownnet/badge.svg)](https://snyk.io/test/github/feathersjs-offline/owndata-ownnet)
[![Maintainability](https://api.codeclimate.com/v1/badges/22509121003eefaf32c5/maintainability)](https://codeclimate.com/github/feathersjs-offline/owndata-ownnet/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/22509121003eefaf32c5/test_coverage)](https://codeclimate.com/github/feathersjs-offline/owndata-ownnet/test_coverage)
[![Download Status](https://img.shields.io/npm/dm/@feathersjs-offline/server)](https://www.npmjs.com/package/@feathersjs-offline/server)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

Client [![npm version](https://img.shields.io/npm/v/@feathersjs-offline/client.svg?style=flat-square)](https://www.npmjs.com/package/@feathersjs-offline/client)
[![Build Status](https://img.shields.io/github/workflow/status/feathersjs-offline/owndata-ownnet/CI)](https://github.com/feathersjs-offline/owndata-ownnet/actions)
[![Dependency Status](https://img.shields.io/david/feathersjs-offline/owndata-ownnet?path=packages%2Fclient&style=flat-square)](https://david-dm.org/@feathersjs-offline/client)
[![Known Vulnerabilities](https://snyk.io/test/github/feathersjs-offline/owndata-ownnet/badge.svg)](https://snyk.io/test/github/feathersjs-offline/owndata-ownnet)
[![Maintainability](https://api.codeclimate.com/v1/badges/22509121003eefaf32c5/maintainability)](https://codeclimate.com/github/feathersjs-offline/owndata-ownnet/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/22509121003eefaf32c5/test_coverage)](https://codeclimate.com/github/feathersjs-offline/owndata-ownnet/test_coverage)
[![Download Status](https://img.shields.io/npm/dm/@feathersjs-offline/client)](https://www.npmjs.com/package/@feathersjs-offline/client)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

# Feathers offline-first own-data / own-net
These packages implements the offline-first `own-data` / `own-net` principles on CRUD methods on any Feathers database adapter. It consist of two parts; one for the server services and one for the client counterparts.

## Installation

Go to the packages to see the details:
- Server is here on [Git](https://github.com/feathersjs-offline/owndata-ownnet/tree/main/packages/server) and here on [NPM](https://www.npmjs.com/package/@feathersjs-offline/server)
- Client is here on [Git](https://github.com/feathersjs-offline/owndata-ownnet/tree/main/packages/client) and here on [NPM](https://www.npmjs.com/package/@feathersjs-offline/client)

You'll need both to be able to a fully functional `own-data`or `own-net` offline-first implementation in your own app.

## Example
You can see an example showcasing Feathers offline-first [here](https://github.com/feathersjs-offline/simple-example)


## Documentation

You can read the original docs [here](https://auk.docs.feathersjs.com/guides/offline-first/readme.html) discussing the theories behind it all. The new and updated documentation is available [here](https://feathersjs-offline.github.io/docs).

> _Summary:_
> 
> `own-data` / `own-net` are two related strategies implemented in Feathers Offline-first. Both strategies queues CRUD events for a wrapped service locally until the device have connection to the server, but to the user the CRUD events are executed immediately using optimistic mutation strategy.
>
> `own-data` will re-play all queued event to the server in the order they were performed in offline mode. This allows the the server to react on each event (mutation). It may, for example, run hooks which send emails on certain mutations.
>
> `own-net` on the other hand will only play the end result of all queued events for a given item (ie. row or document) to the server. If an item (document) is mutated 5 times only the result will reach the server when connection is established. If a record is patched and finally removed while still offline, the server will never see the mutations. The server may still react on each event (mutation), but bear in mind the changes are possibly only _net_ changes. `own-net` usually results in much shorter synchronization times and reduced traffic between client and server.


## License

Copyright (c) 2020

Licensed under the [MIT license](LICENSE).
