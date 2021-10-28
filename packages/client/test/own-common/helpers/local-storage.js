// A simple substitution for browsers localStorage - just for test purposes
const debug = require('debug')('utils:localstorage');

// We have added an auto-clean function as the implementation is exponential in nature
// as the keys from `localforage` are relative long strings. By doing a cleanup of old
// (no longer used keys) we avoid the long search times. If a key have not been referenced
// within 2 * cleanupTimer milliseconds the item will be removed.

const cleanupTimer = 1500;

class LocalStorage {
  constructor(options = {}) {
    this.storage = {};
    this.keysToDestroy = [];
    this.keysAdded = [];

    this.autoClean = options.autoClean || true;

    if (this.autoClean) {
      this.cleanup = this._cleanup.bind(this);
      setTimeout(this.cleanup, cleanupTimer);
    }
  }
  
  handleKey(keyName) {
    if (this.autoClean) {
      if (this.keysAdded.indexOf(keyName) === -1) {
        this.keysAdded.push(keyName);
        let ix = this.keysToDestroy.indexOf(keyName);
        if (ix !== -1) this.keysToDestroy.splice(ix, 1);
      }
    }
  }
  _cleanup () {
    debug(`LocalStorage._cleanup(), keysToDestroy = ${this.keysToDestroy.length}, keysAdded = ${this.keysAdded.length}`);
    this.keysToDestroy.forEach(key => this.removeItem(key));
    this.keysToDestroy = Object.assign([], this.keysAdded);
    this.keysAdded = [];

    setTimeout(this.cleanup, cleanupTimer);
  }

  keys () {
    let keys = Object.keys(this.storage);
    debug(`LocalStorage.keys() = ${JSON.stringify(keys)}`);
    return keys;
  }

  key (n) {
    const key = (this.keys())[n];
    debug(`LocalStorage.key(${n})) = ${key}`);
    return key;
  }

  get length () {
    const len = (this.keys()).length;
    debug(`LocalStorage.length() = ${len}`);
    return len;
  }

  getItem (keyName) {
    let item = this.storage[keyName] || null;
    this.handleKey(keyName);
    debug(`LocalStorage.getItem(${keyName})) = ${item}`);
    return item;
  }

  setItem (keyName, value) {
    const oldValue = this.getItem(keyName) || null;
    debug(`LocalStorage.setItem(${keyName}, ${value}), oldValue = ${oldValue}`);
    this.storage[keyName] = value;
    this.handleKey(keyName); 
    return oldValue;
  }

  removeItem (keyName) {
    const oldValue = this.getItem(keyName);
    debug(`LocalStorage.removeItem(${keyName}), oldValue = ${oldValue}`);
    const { [keyName]: _, ...newStorage } = this.storage;
    this.storage = newStorage;

    return oldValue;
  }

  clear () {
    const oldValue = Object.assign({}, this.storage);
    debug(`LocalStorage.clear(), oldValue = ${oldValue}`);
    this.storage = {};
    return oldValue;
  }
}

module.exports = LocalStorage;
