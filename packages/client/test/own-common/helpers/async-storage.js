// A simple substitution for Reacts AsyncStorage - just for test purposes
const debug = require('debug')('test:AsyncStorage');

const len = 8192; // An arbitrary number of bytes available

class AsyncStorage {
  constructor () {
    this.storage = {};
  }

  async key (n) {
    let nKey = (this.keys())[n] || null;
    this.tell('key', n, nKey);
    return nKey;
  }

  async get length () {
    let len = Object.keys(this.storage).length;
    this.tell('length ${len}');
    return len;
  }

  async getItem (keyName) {
    this.tell('getItem', keyName);
    return this.storage[keyName] || null;
  }

  async setItem (keyName, value) {
    const oldValue = this.getItem(keyName);
    this.storage[keyName] = value;
    this.tell('setItem', keyName, value);
    return oldValue;
  }

  async clear () {
    this.tell('clear');
    const oldValue = Object.assign({}, this.storage);
    this.storage = {};
    return oldValue;
  }

  async iterate (iteratorCb, successCb) {
    this.tell('iterate', iteratorCb, successCb);
    // Dummy for now
    return;
  }

  async keys () {
    this.tell('keys');
    return Object.keys(this.storage);
  }
  
  async removeItem  (key) {
    let item = this.storage[key];
    delete this.storage[key];
    this.tell('removeItem', keyName);
    return item;
  }

  tell (fname, ...args) {
    debug(`AsyncStorage: ${fname} (${args.filter(val => JSON.stringify(val)).join(', ')})... storage=${JSON.stringify(this.storage)})`);
  }
}

module.exports = AsyncStorage;
