// A simple substitution for browsers localStorage - just for test purposes
const debug = require('debug')('test:LocalStorage');

const len = 8192; // An arbitrary number of bytes available
const interval = 250;

class LocalStorage {
  constructor () {
    this.storage = {};
    this.knownKeys = [];
    this.__timer = setTimeout(this.__myCleaner, interval, this);
  }

/**
 * This function ensures that the test suite performs even when more than
 * 100 DB's are created. We assume no test takes longer than `interval` ms.
 * 
 * (E.g. `events-test.js` create new 3 new DBs for each of the tests 5*4 tests).
 * 
 * __NOTE:__ this is a _very_ crude way to forcibly remove unwanted items and
 * is only necessary for this test suite as the `this.storage` object otherwise
 * is filled with many thousand attributes each of many characters (20+)
 * which results in exponential search time.
 *
 * @param {object} self To ensure we execute the clean-up on this object
 * @memberof LocalStorage
 */
__myCleaner (self) {
    self.knownKeys.forEach(key => {
      delete self.storage[key];
    })
    self.knownKeys = self.keys();

    this.__timer = setTimeout(self.__myCleaner, interval, self);
  }

  key (n) {
    let nKey = (this.keys())[n] || null;
    this.tell('key', n, nKey);
    return nKey;
  }

  get length () {
    let len = Object.keys(this.storage).length;
    this.tell('length', len);
    return len;
  }

  getItem (keyName) {
    this.tell('getItem', keyName);
    return this.storage[keyName] || null;
  }

  setItem (keyName, value) {
    const oldValue = this.getItem(keyName);
    this.storage[keyName] = value;
    this.tell('setItem', keyName, value);
    return oldValue;
  }

  clear () {
    this.tell('clear');
    const oldValue = Object.assign({}, this.storage);
    this.storage = {};
    return oldValue;
  }

  iterate (iteratorCb, successCb) {
    this.tell('iterate', iteratorCb, successCb);
    // Dummy for now
    return;
  }

  keys () {
    let keys = Object.keys(this.storage);
    this.tell('keys', keys);
    return keys;
  }
  
  removeItem (keyName) {
    let item = this.storage[keyName];
    delete this.storage[keyName];
    this.tell('removeItem', keyName);
    return item;
  }

  tell (fname, ...args) {
    debug(`LocalStorage: ${fname} (${args.filter(val => JSON.stringify(val)).join(', ')})... storage=${JSON.stringify(this.storage)})`);
  }
}

module.exports = LocalStorage;
