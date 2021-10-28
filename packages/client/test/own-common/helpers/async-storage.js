// A simple substitution for browsers localStorage - just for test purposes

class AsyncStorage {
  constructor () {
    this.storage = {};
  }

  async getAllKeys (n) {
    return Object.keys(this.storage);
  }

  async length () {
    return this.getAllKeys().length;
  }

  async getItem (keyName) {
    return this.storage[keyName];
  }

  async setItem (keyName, value) {
    const oldValue = await this.getItem(keyName);
    this.storage[keyName] = value;
    return oldValue;
  }

  async mergeItem() {
  }
  async removeItem() {
  }
  async multiGet() {
  }
  async multiSet() {
  }
  async multiMerge() {
  }
  async multiRemove() {
  }
  async useAsyncStorage() {
  }

  async clear () {
    const oldValue = Object.assign({}, this.storage);
    this.storage = {};
    return oldValue;
  }
}

module.exports = AsyncStorage;
