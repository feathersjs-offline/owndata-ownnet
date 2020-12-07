# Feathers offline-first own-data / own-net
These packages implements the offline-first `own-data` / `own-net` principles on CRUD methods on any Feathers database adapter. It consist of two parts; on for the server services and one for the client counterparts.

## Installation

Go to the packages to see the details:
- [Server](https://github.com/feathersjs-offline/owndata-ownnet/tree/main/packages/server)
- [Client](https://github.com/feathersjs-offline/owndata-ownnet/tree/main/packages/client)


## Documentation

You can read the original docs [here](https://auk.docs.feathersjs.com/guides/offline-first/readme.html). The new and updated documentation is available [here](https://feathersjs-offline.github.io/docs).

> _Summary:_
> 
> `own-data`/ `own-net` are two related strategies implemented in Feathers Offline-first. Both strategies queues CRUD events for a wrapped service until the device have connection to the server.
>
> `own-data` will re-play all queued event to the server in the order they were performed in offline mode. This allows the the server to react on each event (mutation). It may, for example, run hooks which send emails on certain mutations.
>
> `own-net` on the other hand will only play the end result of all queued event to the server. If a record (document) is mutated 5 times only the result will reach the server when connection is established. If a record is patched and finally removed while still offline, the server will never see the mutations. The server may still react on each event (mutation), but bear in mind the changes are possibly only 'net' changes.


## License

Copyright (c) 2020

Licensed under the [MIT license](LICENSE).
