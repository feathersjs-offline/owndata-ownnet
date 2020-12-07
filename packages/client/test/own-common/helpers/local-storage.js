// A simple substitution for browsers localStorage - just for test purposes

class LocalStorage {
  constructor () {
    this.storage = {};
  }

  key (n) {
    return (this.storage.keys())[n];
  }

  length () {
    return (this.storage.keys()).length;
  }

  getItem (keyName) {
    return this.storage[keyName];
  }

  setItem (keyName, value) {
    const oldValue = this.getItem(keyName);
    this.storage[keyName] = value;
    return oldValue;
  }

  clear () {
    const oldValue = Object.assign({}, this.storage);
    this.storage = {};
    return oldValue;
  }
}

module.exports = LocalStorage;
