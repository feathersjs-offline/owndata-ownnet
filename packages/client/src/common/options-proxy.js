const debug = require('debug')('@feathersjs-offline:ownclass:options-proxy');

let depends = {};
let watchingFn = [];
let ix = 0;

module.exports = class OptionsProxy {
  constructor (name) {
    if (name === undefined) {
      throw new Error(`OptionsProxy: Sorry, you must supply a name to proxy.`);
    }
    // if (depends[name]) {
    //   throw new Error(`OptionsProxy: Sorry, you have already proxied '${name}'.`);
    // }
    this.name = name /*+ ++ix*/;
    depends[this.name] = [];
    watchingFn[this.name] = null;
    debug(`Constructed proxy for '${this.name}`);
  }

  /**
   * Package the data to be observed in a proxy that updates according to
   * relevant recipes registered with watcher().
   * @param {object} data The data object to observe
   */
  observe (data) {
    let self = this;
    return new Proxy(data, {
      get (obj, key) {
        if (watchingFn[self.name]) {
          if (!depends[self.name][key]) depends[self.name][key] = [];
          depends[self.name][key].push(watchingFn[self.name]);
        }
        const res = obj[key];
        debug(`${self.name}: get(${key}) = ${JSON.stringify(res)}`);
        return res;
      },
      set (obj, key, val) {
        debug(`${self.name}: set(${key}, ${JSON.stringify(val)})`);
        obj[key] = val;
        if (depends[self.name][key])
          depends[self.name][key].forEach(cb => cb());
        return true;
      }
    })
  }

  /**
   * Register a handler for the observer proxy
   * @param {function} target The handler function
   */
  watcher (target) {
    watchingFn[this.name] = target;
    target();
    watchingFn[this.name] = null;
  }
}
