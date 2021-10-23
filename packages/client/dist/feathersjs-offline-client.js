var feathersjsOfflineClient;feathersjsOfflineClient =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../node_modules/charenc/charenc.js":
/*!******************************************!*\
  !*** ../node_modules/charenc/charenc.js ***!
  \******************************************/
/***/ ((module) => {

var charenc = {
  // UTF-8 encoding
  utf8: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
    }
  },

  // Binary encoding
  bin: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      for (var bytes = [], i = 0; i < str.length; i++)
        bytes.push(str.charCodeAt(i) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      for (var str = [], i = 0; i < bytes.length; i++)
        str.push(String.fromCharCode(bytes[i]));
      return str.join('');
    }
  }
};

module.exports = charenc;


/***/ }),

/***/ "../node_modules/crypt/crypt.js":
/*!**************************************!*\
  !*** ../node_modules/crypt/crypt.js ***!
  \**************************************/
/***/ ((module) => {

(function() {
  var base64map
      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

  crypt = {
    // Bit-wise rotation left
    rotl: function(n, b) {
      return (n << b) | (n >>> (32 - b));
    },

    // Bit-wise rotation right
    rotr: function(n, b) {
      return (n << (32 - b)) | (n >>> b);
    },

    // Swap big-endian to little-endian and vice versa
    endian: function(n) {
      // If number given, swap endian
      if (n.constructor == Number) {
        return crypt.rotl(n, 8) & 0x00FF00FF | crypt.rotl(n, 24) & 0xFF00FF00;
      }

      // Else, assume array and swap all items
      for (var i = 0; i < n.length; i++)
        n[i] = crypt.endian(n[i]);
      return n;
    },

    // Generate an array of any length of random bytes
    randomBytes: function(n) {
      for (var bytes = []; n > 0; n--)
        bytes.push(Math.floor(Math.random() * 256));
      return bytes;
    },

    // Convert a byte array to big-endian 32-bit words
    bytesToWords: function(bytes) {
      for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
        words[b >>> 5] |= bytes[i] << (24 - b % 32);
      return words;
    },

    // Convert big-endian 32-bit words to a byte array
    wordsToBytes: function(words) {
      for (var bytes = [], b = 0; b < words.length * 32; b += 8)
        bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a hex string
    bytesToHex: function(bytes) {
      for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
      }
      return hex.join('');
    },

    // Convert a hex string to a byte array
    hexToBytes: function(hex) {
      for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
      return bytes;
    },

    // Convert a byte array to a base-64 string
    bytesToBase64: function(bytes) {
      for (var base64 = [], i = 0; i < bytes.length; i += 3) {
        var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        for (var j = 0; j < 4; j++)
          if (i * 8 + j * 6 <= bytes.length * 8)
            base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
          else
            base64.push('=');
      }
      return base64.join('');
    },

    // Convert a base-64 string to a byte array
    base64ToBytes: function(base64) {
      // Remove non-base-64 characters
      base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');

      for (var bytes = [], i = 0, imod4 = 0; i < base64.length;
          imod4 = ++i % 4) {
        if (imod4 == 0) continue;
        bytes.push(((base64map.indexOf(base64.charAt(i - 1))
            & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2))
            | (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
      }
      return bytes;
    }
  };

  module.exports = crypt;
})();


/***/ }),

/***/ "../node_modules/feathers-localstorage/lib/index.js":
/*!**********************************************************!*\
  !*** ../node_modules/feathers-localstorage/lib/index.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { Service } = __webpack_require__(/*! feathers-memory */ "../node_modules/feathers-memory/lib/index.js");

const usedKeys = [];

class LocalStorage extends Service {
  constructor (options = {}) {
    super(options);
    this._storageKey = options.name || 'feathers';
    this._storage = options.storage || (typeof window !== 'undefined' && window.localStorage);
    this._throttle = options.throttle || 200;
    this._reuseKeys = options.reuseKeys || false;
    this.store = null;

    if (!this._storage) {
      throw new Error('The `storage` option needs to be provided');
    }

    if (usedKeys.indexOf(this._storageKey) === -1) {
      usedKeys.push(this._storageKey);
    } else {
      if (!this._reuseKeys) { // Allow reuse if options.reuseKeys set to true
        throw new Error(`The storage name '${this._storageKey}' is already in use by another instance.`);
      }
    }

    this.ready();
  }

  ready () {
    if (!this.store) {
      return Promise.resolve(this._storage.getItem(this._storageKey))
        .then(str => JSON.parse(str || '{}'))
        .then(store => {
          const keys = Object.keys(store);
          const last = store[keys[keys.length - 1]];

          // Current id is the id of the last item
          this._uId = (keys.length && typeof last[this.id] !== 'undefined') ? last[this.id] + 1 : this._uId;

          return (this.store = store);
        });
    }

    return Promise.resolve(this.store);
  }

  flush (data) {
    if (!this._timeout) {
      this._timeout = setTimeout(() => {
        this._storage.setItem(this._storageKey, JSON.stringify(this.store));
        delete this._timeout;
      }, this._throttle);
    }

    return data;
  }

  execute (method, ...args) {
    return this.ready()
      .then(() => super[method](...args));
  }

  find (...args) {
    return this.execute('find', ...args);
  }

  get (...args) {
    return this.execute('get', ...args);
  }

  create (...args) {
    return this.execute('create', ...args)
      .then(data => this.flush(data));
  }

  patch (...args) {
    return this.execute('patch', ...args)
      .then(data => this.flush(data));
  }

  update (...args) {
    return this.execute('update', ...args)
      .then(data => this.flush(data));
  }

  remove (...args) {
    return this.execute('remove', ...args)
      .then(data => this.flush(data));
  }
}

module.exports = function init (options) {
  return new LocalStorage(options);
};

module.exports.Service = Service;


/***/ }),

/***/ "../node_modules/feathers-memory/lib/index.js":
/*!****************************************************!*\
  !*** ../node_modules/feathers-memory/lib/index.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const errors = __webpack_require__(/*! @feathersjs/errors */ "../node_modules/@feathersjs/errors/lib/index.js");
const { _ } = __webpack_require__(/*! @feathersjs/commons */ "../node_modules/@feathersjs/commons/lib/index.js");
const { sorter, select, AdapterService } = __webpack_require__(/*! @feathersjs/adapter-commons */ "../node_modules/@feathersjs/adapter-commons/lib/index.js");
const sift = __webpack_require__(/*! sift */ "../node_modules/feathers-memory/node_modules/sift/src/index.js").default;

const _select = (data, ...args) => {
  const base = select(...args);

  return base(JSON.parse(JSON.stringify(data)));
};

class Service extends AdapterService {
  constructor (options = {}) {
    super(_.extend({
      id: 'id',
      matcher: sift,
      sorter
    }, options));
    this._uId = options.startId || 0;
    this.store = options.store || {};
  }

  async getEntries (params = {}) {
    const { query } = this.filterQuery(params);

    return this._find(Object.assign({}, params, {
      paginate: false,
      query
    }));
  }

  async _find (params = {}) {
    const { query, filters, paginate } = this.filterQuery(params);
    let values = _.values(this.store).filter(this.options.matcher(query));
    const total = values.length;

    if (filters.$sort !== undefined) {
      values.sort(this.options.sorter(filters.$sort));
    }

    if (filters.$skip !== undefined) {
      values = values.slice(filters.$skip);
    }

    if (filters.$limit !== undefined) {
      values = values.slice(0, filters.$limit);
    }

    const result = {
      total,
      limit: filters.$limit,
      skip: filters.$skip || 0,
      data: values.map(value => _select(value, params))
    };

    if (!(paginate && paginate.default)) {
      return result.data;
    }

    return result;
  }

  async _get (id, params = {}) {
    if (id in this.store) {
      const { query } = this.filterQuery(params);
      const value = this.store[id];

      if (this.options.matcher(query)(value)) {
        return _select(value, params, this.id);
      }
    }

    throw new errors.NotFound(`No record found for id '${id}'`);
  }

  // Create without hooks and mixins that can be used internally
  async _create (data, params = {}) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this._create(current, params)));
    }

    const id = data[this.id] || this._uId++;
    const current = _.extend({}, data, { [this.id]: id });
    const result = (this.store[id] = current);

    return _select(result, params, this.id);
  }

  async _update (id, data, params = {}) {
    const oldEntry = await this._get(id);
    // We don't want our id to change type if it can be coerced
    const oldId = oldEntry[this.id];

    id = oldId == id ? oldId : id; // eslint-disable-line

    this.store[id] = _.extend({}, data, { [this.id]: id });

    return this._get(id, params);
  }

  async _patch (id, data, params = {}) {
    const patchEntry = entry => {
      const currentId = entry[this.id];

      this.store[currentId] = _.extend(this.store[currentId], _.omit(data, this.id));

      return _select(this.store[currentId], params, this.id);
    };

    if (id === null) {
      const entries = await this.getEntries(params);

      return entries.map(patchEntry);
    }

    return patchEntry(await this._get(id, params)); // Will throw an error if not found
  }

  // Remove without hooks and mixins that can be used internally
  async _remove (id, params = {}) {
    if (id === null) {
      const entries = await this.getEntries(params);

      return Promise.all(entries.map(
        current => this._remove(current[this.id], params))
      );
    }

    const entry = await this._get(id, params);

    delete this.store[id];

    return entry;
  }
}

module.exports = options => {
  return new Service(options);
};

module.exports.Service = Service;


/***/ }),

/***/ "../node_modules/feathers-memory/node_modules/sift/src/index.js":
/*!**********************************************************************!*\
  !*** ../node_modules/feathers-memory/node_modules/sift/src/index.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ sift),
/* harmony export */   "compare": () => (/* binding */ compare),
/* harmony export */   "comparable": () => (/* binding */ comparable)
/* harmony export */ });
/*
 *
 * Copryright 2018, Craig Condon
 * Licensed under MIT
 *
 * Filter JavaScript objects with mongodb queries
 */

function typeChecker(type) {
  var typeString = "[object " + type + "]";
  return function(value) {
    return Object.prototype.toString.call(value) === typeString;
  };
}

/**
 */

var isArray = typeChecker("Array");
var isObject = typeChecker("Object");
var isFunction = typeChecker("Function");

function get(obj, key) {
  return isFunction(obj.get) ? obj.get(key) : obj[key];
}


const nestable = (validator) => (validateOptions, value, key, valueOwner, nestedResults) => {
  if (nestedResults) {
    return Boolean(nestedResults.find(([value, key, valueOwner]) => validator(validateOptions, key, valueOwner)));
  }

  return validator(validateOptions, value, key, valueOwner);
};

/**
 */

const or = nestable((validator) => {
  return function(validateOptions, value, key, valueOwner, nestedResults) {
    if (!isArray(value) || !value.length) {
      return validator(validateOptions, value);
    }
    for (var i = 0, n = value.length; i < n; i++) {
      if (validator(validateOptions, get(value, i))) return true;
    }
    return false;
  };
});

/**
 */

function and(validator) {
  return function(validateOptions, value, key, valueOwner) {
    if (!isArray(value) || !value.length) {
      return validator(validateOptions, value, key, valueOwner);
    }
    for (var i = 0, n = value.length; i < n; i++) {
      if (!validator(validateOptions, get(value, i), value, valueOwner)) return false;
    }
    return true;
  };
}

function validate(validator, value, key, valueOwner, nestedResults) {
  return validator.validate(validator.options, value, key, valueOwner, nestedResults);
}

var defaultExpressions = {
  /**
   */

  $eq: or(function(test, value) {
    return test(value);
  }),

  /**
   */

  $ne: and(function(test, value) {
    return test(value);
  }),

  /**
   */

  $gt: or(function(test, value) {
    return test(value);
  }),

  /**
   */

  $gte: or(function(test, value) {
    return test(value);
  }),

  /**
   */

  $lt: or(function(test, value) {
    return test(value);
  }),

  /**
   */

  $lte: or(function(test, value) {
    return test(value);
  }),

  /**
   */

  $mod: or(function(test, value) {
    return test(value);
  }),

  /**
   */

  $in(test, value) {
    return test(value);
  },

  /**
   */

  $nin: function(test, value) {
    return test(value);
  },

  /**
   */

  $not: function(test, value, key, valueOwner) {
    return test(value, key, valueOwner);
  },

  /**
   */

  $type: function(testType, value) {
    return testType(value);
  },

  /**
   */

  $all: function(allOptions, value, key, valueOwner, nestedResults) {
    return defaultExpressions.$and(allOptions, value, key, valueOwner, nestedResults);
  },

  /**
   */

  $size: function(sizeMatch, value) {
    return value ? sizeMatch === value.length : false;
  },

  /**
   */

  $or: function(orOptions, value, key, valueOwner) {
    for (var i = 0, n = orOptions.length; i < n; i++) {
      if (validate(get(orOptions, i), value, key, valueOwner)) {
        return true;
      }
    }
    return false;
  },

  /**
   */

  $nor: function(validateOptions, value, key, valueOwner) {
    return !defaultExpressions.$or(validateOptions, value, key, valueOwner);
  },

  /**
   */

  $and: function(validateOptions, value, key, valueOwner, nestedResults) {

    if (nestedResults) {
      for (var i = 0, n = validateOptions.length; i < n; i++) {
        if (!validate(get(validateOptions, i), value, key, valueOwner, nestedResults)) {
          return false;
        }
      }
    } else {
      for (var i = 0, n = validateOptions.length; i < n; i++) {
        if (!validate(get(validateOptions, i), value, key, valueOwner, nestedResults)) {
          return false;
        }
      }
    }
    return true;
  },

  /**
   */

  $regex: or(function(validateOptions, value) {
    return typeof value === "string" && validateOptions.test(value);
  }),

  /**
   */

  $where: function(validateOptions, value, key, valueOwner) {
    return validateOptions.call(value, value, key, valueOwner);
  },

  /**
   */

  $elemMatch: function(validateOptions, value, key, valueOwner) {
    if (isArray(value)) {
      return !!~search(value, validateOptions);
    }
    return validate(validateOptions, value, key, valueOwner);
  },

  /**
   */

  $exists: function(validateOptions, value, key, valueOwner) {
    return valueOwner.hasOwnProperty(key) === validateOptions;
  }
};

/**
 */

var prepare = {
  /**
   */

  $eq: function(query, queryOwner, { comparable, compare }) {
    if (query instanceof RegExp) {
      return or(function(value) {
        return typeof value === "string" && query.test(value);
      });
    } else if (query instanceof Function) {
      return or(query);
    } else if (isArray(query) && !query.length) {
      // Special case of a == []
      return or(function(value) {
        return isArray(value) && !value.length;
      });
    } else if (query === null) {
      return or(function(value) {
        //will match both null and undefined
        return value == null;
      });
    }
    return or(function(value) {
      return compare(comparable(value), comparable(query)) === 0;
    });
  },

  $gt: function(query, queryOwner, { comparable, compare }) {
    return function(value) {
      return compare(comparable(value), comparable(query)) > 0;
    };
  },

  $gte: function(query, queryOwner, { comparable, compare }) {
    return function(value) {
      return compare(comparable(value), comparable(query)) >= 0;
    };
  },

  $lt: function(query, queryOwner, { comparable, compare }) {
    return function(value) {
      return compare(comparable(value), comparable(query)) < 0;
    };
  },
  $lte: function(query, queryOwner, { comparable, compare }) {
    return function(value) {
      return compare(comparable(value), comparable(query)) <= 0;
    };
  },

  $in: function(query, queryOwner, options) {
    const { comparable } = options;
    return function(value) {
      if (value instanceof Array) {
        for (var i = value.length; i--; ) {
          if (~query.indexOf(comparable(get(value, i)))) {
            return true;
          }
        }
      } else {
        var comparableValue = comparable(value);
        if (comparableValue === value && typeof value === "object") {
          for (var i = query.length; i--; ) {
            if (
              String(query[i]) === String(value) &&
              String(value) !== "[object Object]"
            ) {
              return true;
            }
          }
        }

        /*
          Handles documents that are undefined, whilst also
          having a 'null' element in the parameters to $in.
        */
        if (typeof comparableValue == "undefined") {
          for (var i = query.length; i--; ) {
            if (query[i] == null) {
              return true;
            }
          }
        }

        /*
          Handles the case of {'field': {$in: [/regexp1/, /regexp2/, ...]}}
        */
        for (var i = query.length; i--; ) {
          var validator = createRootValidator(get(query, i), options);
          var result = validate(validator, comparableValue, i, query);
          if (
            result &&
            String(result) !== "[object Object]" &&
            String(comparableValue) !== "[object Object]"
          ) {
            return true;
          }
        }

        return !!~query.indexOf(comparableValue);
      }

      return false;
    };
  },

  $nin: function(query, queryOwner, options) {
    const eq = prepare.$in(query, queryOwner, options);
    return function(validateOptions, value, key, valueOwner) {
      return !eq(validateOptions, value, key, valueOwner);
    };
  },

  $mod: function(query) {
    return function(value) {
      return value % query[0] == query[1];
    };
  },

  /**
   */

  $ne: function(query, queryOwner, options) {
    const eq = prepare.$eq(query, queryOwner, options);
    return and(function(validateOptions, value, key, valueOwner) {
      return !eq(validateOptions, value, key, valueOwner);
    });
  },

  /**
   */

  $and: function(query, queryOwner, options) {
    return query.map(parse(options));
  },

  /**
   */

  $all: function(query, queryOwner, options) {
    return prepare.$and(query, queryOwner, options);
  },

  /**
   */

  $or: function(query, queryOwner, options) {
    return query.map(parse(options));
  },

  /**
   */

  $nor: function(query, queryOwner, options) {
    return query.map(parse(options));
  },

  /**
   */

  $not: function(query, queryOwner, options) {
    const validateOptions = parse(options)(query);
    return function(value, key, valueOwner) {
      return !validate(validateOptions, value, key, valueOwner);
    };
  },

  $type: function(query) {
    return function(value, key, valueOwner) {
      return value != void 0
        ? value instanceof query || value.constructor == query
        : false;
    };
  },

  /**
   */

  $regex: function(query, queryOwner) {
    return new RegExp(query, queryOwner.$options);
  },

  /**
   */

  $where: function(query) {
    return typeof query === "string"
      ? new Function("obj", "return " + query)
      : query;
  },

  /**
   */

  $elemMatch: function(query, queryOwner, options) {
    return parse(options)(query);
  },

  /**
   */

  $exists: function(query) {
    return !!query;
  }
};

/**
 */

function search(array, validator) {
  for (var i = 0; i < array.length; i++) {
    var result = get(array, i);
    if (validate(validator, get(array, i))) {
      return i;
    }
  }

  return -1;
}

/**
 */

function createValidator(options, validate) {
  return { options, validate };
}

/**
 */

function validatedNested({ keyPath, child, query }, value) {
  const results = [];
  findValues(value, keyPath, 0, value, results);
  
  if (results.length === 1) {
    const [value, key, valueOwner] = results[0];
    return validate(child, value, key, valueOwner);
  }

  // If the query contains $ne, need to test all elements ANDed together
  var inclusive = query && typeof query.$ne !== "undefined";
  var allValid = inclusive;
  const allValues = results.map(([value]) => value);

  return validate(child, undefined, undefined, undefined, results);
  // for (var i = 0; i < results.length; i++) {
  //   const [value, key, valueOwner] = results[i];
  //   var isValid = validate(child, value, key, valueOwner);
  //   console.log(isValid, value);
  //   if (inclusive) {
  //     allValid &= isValid;
  //   } else {
  //     allValid |= isValid;
  //   }
  // }
  // return allValid;
}

/**
 */

function findValues(current, keypath, index, object, values) {
  if (index === keypath.length || current == void 0) {
    values.push([current, keypath[index - 1], object]);
    return;
  }

  var k = get(keypath, index);

  // ensure that if current is an array, that the current key
  // is NOT an array index. This sort of thing needs to work:
  // sift({'foo.0':42}, [{foo: [42]}]);
  if (isArray(current) && isNaN(Number(k))) {
    for (var i = 0, n = current.length; i < n; i++) {
      findValues(get(current, i), keypath, index, current, values);
    }
  } else {
    findValues(get(current, k), keypath, index + 1, current, values);
  }
}

/**
 */

function createNestedValidator(keyPath, child, query) {
  return createValidator({ keyPath, child, query }, validatedNested);
}

/**
 * flatten the query
 */

function isVanillaObject(value) {
  return (
    value &&
    (value.constructor === Object ||
      value.constructor === Array ||
      value.constructor.toString() === "function Object() { [native code] }" ||
      value.constructor.toString() === "function Array() { [native code] }")
  );
}

function parse(options) {
  const { comparable, expressions } = options;
  var wrapQuery = function(query) {
    if (!query || !isVanillaObject(query)) {
      query = { $eq: query };
    }
    return query;
  };

  var parseQuery = function(query) {
    query = comparable(query);

    var validators = [];

    for (var key in query) {
      var queryValue = query[key];

      if (key === "$options") {
        continue;
      }

      var expression =
        defaultExpressions[key] || (options && expressions && expressions[key]);

      if (expression) {
        if (prepare[key]) {
          queryValue = prepare[key](queryValue, query, options);
        }
        validators.push(createValidator(comparable(queryValue), expression));
      } else {
        if (key.charCodeAt(0) === 36) {
          throw new Error("Unknown operation " + key);
        }

        var keyParts = key.split(".");

        validators.push(
          createNestedValidator(keyParts, parseNested(queryValue), queryValue)
        );
      }
    }

    return validators.length === 1
      ? validators[0]
      : createValidator(validators, defaultExpressions.$and);
  };

  var parseNested = function(query) {
    query = wrapQuery(query);
    if (isExactObject(query)) {
      return createValidator(query, isEqual);
    }
    return parseQuery(query);
  };

  var parseRoot = function(query) {
    return parseQuery(wrapQuery(query));
  };

  return parseRoot;
}

function isEqual(a, b) {
  if (Object.prototype.toString.call(a) !== Object.prototype.toString.call(b)) {
    return false;
  }

  if (isObject(a)) {
    if (Object.keys(a).length !== Object.keys(b).length) {
      return false;
    }

    for (var key in a) {
      if (!isEqual(a[key], b[key])) {
        return false;
      }
    }

    return true;
  } else if (isArray(a)) {
    if (a.length !== b.length) {
      return false;
    }
    for (var i = 0, n = a.length; i < n; i++) {
      if (!isEqual(a[i], b[i])) {
        return false;
      }
    }

    return true;
  } else {
    return a === b;
  }
}

function getAllKeys(value, keys) {
  if (!isObject(value)) {
    return keys;
  }
  for (var key in value) {
    keys.push(key);
    getAllKeys(value[key], keys);
  }
  return keys;
}

function isExactObject(value) {
  const allKeysHash = getAllKeys(value, []).join(",");
  return allKeysHash.search(/[$.]/) === -1;
}

/**
 */

function createRootValidator(query, options) {
  var validator = parse(options)(query);
  if (options && options.select) {
    validator = {
      options: validator,
      validate: function(validateOptions, value, key, valueOwner) {
        return validate(
          validateOptions,
          value && options.select(value),
          key,
          valueOwner
        );
      }
    };
  }
  return validator;
}

/**
 */

function sift(query, options) {
  options = Object.assign({ compare, comparable }, options);
  var validator = createRootValidator(query, options);
  return function(value, key, valueOwner) {
    return validate(validator, value, key, valueOwner);
  };
}

/**
 */

function compare(a, b) {
  if (isEqual(a, b)) return 0;
  if (typeof a === typeof b) {
    if (a > b) {
      return 1;
    }
    if (a < b) {
      return -1;
    }
  }
}

/**
 */

function comparable(value) {
  if (value instanceof Date) {
    return value.getTime();
  } else if (isArray(value)) {
    return value.map(comparable);
  } else if (value && typeof value.toJSON === "function") {
    return value.toJSON();
  } else {
    return value;
  }
}


/***/ }),

/***/ "../node_modules/is-buffer/index.js":
/*!******************************************!*\
  !*** ../node_modules/is-buffer/index.js ***!
  \******************************************/
/***/ ((module) => {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


/***/ }),

/***/ "../node_modules/localforage/dist/localforage.js":
/*!*******************************************************!*\
  !*** ../node_modules/localforage/dist/localforage.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*!
    localForage -- Offline Storage, Improved
    Version 1.10.0
    https://localforage.github.io/localForage
    (c) 2013-2017 Mozilla, Apache License 2.0
*/
(function(f){if(true){module.exports=f()}else { var g; }})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=undefined;if(!u&&a)return require(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw (f.code="MODULE_NOT_FOUND", f)}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=undefined;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function (global){
'use strict';
var Mutation = global.MutationObserver || global.WebKitMutationObserver;

var scheduleDrain;

{
  if (Mutation) {
    var called = 0;
    var observer = new Mutation(nextTick);
    var element = global.document.createTextNode('');
    observer.observe(element, {
      characterData: true
    });
    scheduleDrain = function () {
      element.data = (called = ++called % 2);
    };
  } else if (!global.setImmediate && typeof global.MessageChannel !== 'undefined') {
    var channel = new global.MessageChannel();
    channel.port1.onmessage = nextTick;
    scheduleDrain = function () {
      channel.port2.postMessage(0);
    };
  } else if ('document' in global && 'onreadystatechange' in global.document.createElement('script')) {
    scheduleDrain = function () {

      // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
      // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
      var scriptEl = global.document.createElement('script');
      scriptEl.onreadystatechange = function () {
        nextTick();

        scriptEl.onreadystatechange = null;
        scriptEl.parentNode.removeChild(scriptEl);
        scriptEl = null;
      };
      global.document.documentElement.appendChild(scriptEl);
    };
  } else {
    scheduleDrain = function () {
      setTimeout(nextTick, 0);
    };
  }
}

var draining;
var queue = [];
//named nextTick for less confusing stack traces
function nextTick() {
  draining = true;
  var i, oldQueue;
  var len = queue.length;
  while (len) {
    oldQueue = queue;
    queue = [];
    i = -1;
    while (++i < len) {
      oldQueue[i]();
    }
    len = queue.length;
  }
  draining = false;
}

module.exports = immediate;
function immediate(task) {
  if (queue.push(task) === 1 && !draining) {
    scheduleDrain();
  }
}

}).call(this,typeof __webpack_require__.g !== "undefined" ? __webpack_require__.g : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(_dereq_,module,exports){
'use strict';
var immediate = _dereq_(1);

/* istanbul ignore next */
function INTERNAL() {}

var handlers = {};

var REJECTED = ['REJECTED'];
var FULFILLED = ['FULFILLED'];
var PENDING = ['PENDING'];

module.exports = Promise;

function Promise(resolver) {
  if (typeof resolver !== 'function') {
    throw new TypeError('resolver must be a function');
  }
  this.state = PENDING;
  this.queue = [];
  this.outcome = void 0;
  if (resolver !== INTERNAL) {
    safelyResolveThenable(this, resolver);
  }
}

Promise.prototype["catch"] = function (onRejected) {
  return this.then(null, onRejected);
};
Promise.prototype.then = function (onFulfilled, onRejected) {
  if (typeof onFulfilled !== 'function' && this.state === FULFILLED ||
    typeof onRejected !== 'function' && this.state === REJECTED) {
    return this;
  }
  var promise = new this.constructor(INTERNAL);
  if (this.state !== PENDING) {
    var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
    unwrap(promise, resolver, this.outcome);
  } else {
    this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
  }

  return promise;
};
function QueueItem(promise, onFulfilled, onRejected) {
  this.promise = promise;
  if (typeof onFulfilled === 'function') {
    this.onFulfilled = onFulfilled;
    this.callFulfilled = this.otherCallFulfilled;
  }
  if (typeof onRejected === 'function') {
    this.onRejected = onRejected;
    this.callRejected = this.otherCallRejected;
  }
}
QueueItem.prototype.callFulfilled = function (value) {
  handlers.resolve(this.promise, value);
};
QueueItem.prototype.otherCallFulfilled = function (value) {
  unwrap(this.promise, this.onFulfilled, value);
};
QueueItem.prototype.callRejected = function (value) {
  handlers.reject(this.promise, value);
};
QueueItem.prototype.otherCallRejected = function (value) {
  unwrap(this.promise, this.onRejected, value);
};

function unwrap(promise, func, value) {
  immediate(function () {
    var returnValue;
    try {
      returnValue = func(value);
    } catch (e) {
      return handlers.reject(promise, e);
    }
    if (returnValue === promise) {
      handlers.reject(promise, new TypeError('Cannot resolve promise with itself'));
    } else {
      handlers.resolve(promise, returnValue);
    }
  });
}

handlers.resolve = function (self, value) {
  var result = tryCatch(getThen, value);
  if (result.status === 'error') {
    return handlers.reject(self, result.value);
  }
  var thenable = result.value;

  if (thenable) {
    safelyResolveThenable(self, thenable);
  } else {
    self.state = FULFILLED;
    self.outcome = value;
    var i = -1;
    var len = self.queue.length;
    while (++i < len) {
      self.queue[i].callFulfilled(value);
    }
  }
  return self;
};
handlers.reject = function (self, error) {
  self.state = REJECTED;
  self.outcome = error;
  var i = -1;
  var len = self.queue.length;
  while (++i < len) {
    self.queue[i].callRejected(error);
  }
  return self;
};

function getThen(obj) {
  // Make sure we only access the accessor once as required by the spec
  var then = obj && obj.then;
  if (obj && (typeof obj === 'object' || typeof obj === 'function') && typeof then === 'function') {
    return function appyThen() {
      then.apply(obj, arguments);
    };
  }
}

function safelyResolveThenable(self, thenable) {
  // Either fulfill, reject or reject with error
  var called = false;
  function onError(value) {
    if (called) {
      return;
    }
    called = true;
    handlers.reject(self, value);
  }

  function onSuccess(value) {
    if (called) {
      return;
    }
    called = true;
    handlers.resolve(self, value);
  }

  function tryToUnwrap() {
    thenable(onSuccess, onError);
  }

  var result = tryCatch(tryToUnwrap);
  if (result.status === 'error') {
    onError(result.value);
  }
}

function tryCatch(func, value) {
  var out = {};
  try {
    out.value = func(value);
    out.status = 'success';
  } catch (e) {
    out.status = 'error';
    out.value = e;
  }
  return out;
}

Promise.resolve = resolve;
function resolve(value) {
  if (value instanceof this) {
    return value;
  }
  return handlers.resolve(new this(INTERNAL), value);
}

Promise.reject = reject;
function reject(reason) {
  var promise = new this(INTERNAL);
  return handlers.reject(promise, reason);
}

Promise.all = all;
function all(iterable) {
  var self = this;
  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
    return this.reject(new TypeError('must be an array'));
  }

  var len = iterable.length;
  var called = false;
  if (!len) {
    return this.resolve([]);
  }

  var values = new Array(len);
  var resolved = 0;
  var i = -1;
  var promise = new this(INTERNAL);

  while (++i < len) {
    allResolver(iterable[i], i);
  }
  return promise;
  function allResolver(value, i) {
    self.resolve(value).then(resolveFromAll, function (error) {
      if (!called) {
        called = true;
        handlers.reject(promise, error);
      }
    });
    function resolveFromAll(outValue) {
      values[i] = outValue;
      if (++resolved === len && !called) {
        called = true;
        handlers.resolve(promise, values);
      }
    }
  }
}

Promise.race = race;
function race(iterable) {
  var self = this;
  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
    return this.reject(new TypeError('must be an array'));
  }

  var len = iterable.length;
  var called = false;
  if (!len) {
    return this.resolve([]);
  }

  var i = -1;
  var promise = new this(INTERNAL);

  while (++i < len) {
    resolver(iterable[i]);
  }
  return promise;
  function resolver(value) {
    self.resolve(value).then(function (response) {
      if (!called) {
        called = true;
        handlers.resolve(promise, response);
      }
    }, function (error) {
      if (!called) {
        called = true;
        handlers.reject(promise, error);
      }
    });
  }
}

},{"1":1}],3:[function(_dereq_,module,exports){
(function (global){
'use strict';
if (typeof global.Promise !== 'function') {
  global.Promise = _dereq_(2);
}

}).call(this,typeof __webpack_require__.g !== "undefined" ? __webpack_require__.g : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"2":2}],4:[function(_dereq_,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function getIDB() {
    /* global indexedDB,webkitIndexedDB,mozIndexedDB,OIndexedDB,msIndexedDB */
    try {
        if (typeof indexedDB !== 'undefined') {
            return indexedDB;
        }
        if (typeof webkitIndexedDB !== 'undefined') {
            return webkitIndexedDB;
        }
        if (typeof mozIndexedDB !== 'undefined') {
            return mozIndexedDB;
        }
        if (typeof OIndexedDB !== 'undefined') {
            return OIndexedDB;
        }
        if (typeof msIndexedDB !== 'undefined') {
            return msIndexedDB;
        }
    } catch (e) {
        return;
    }
}

var idb = getIDB();

function isIndexedDBValid() {
    try {
        // Initialize IndexedDB; fall back to vendor-prefixed versions
        // if needed.
        if (!idb || !idb.open) {
            return false;
        }
        // We mimic PouchDB here;
        //
        // We test for openDatabase because IE Mobile identifies itself
        // as Safari. Oh the lulz...
        var isSafari = typeof openDatabase !== 'undefined' && /(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) && !/BlackBerry/.test(navigator.platform);

        var hasFetch = typeof fetch === 'function' && fetch.toString().indexOf('[native code') !== -1;

        // Safari <10.1 does not meet our requirements for IDB support
        // (see: https://github.com/pouchdb/pouchdb/issues/5572).
        // Safari 10.1 shipped with fetch, we can use that to detect it.
        // Note: this creates issues with `window.fetch` polyfills and
        // overrides; see:
        // https://github.com/localForage/localForage/issues/856
        return (!isSafari || hasFetch) && typeof indexedDB !== 'undefined' &&
        // some outdated implementations of IDB that appear on Samsung
        // and HTC Android devices <4.4 are missing IDBKeyRange
        // See: https://github.com/mozilla/localForage/issues/128
        // See: https://github.com/mozilla/localForage/issues/272
        typeof IDBKeyRange !== 'undefined';
    } catch (e) {
        return false;
    }
}

// Abstracts constructing a Blob object, so it also works in older
// browsers that don't support the native Blob constructor. (i.e.
// old QtWebKit versions, at least).
// Abstracts constructing a Blob object, so it also works in older
// browsers that don't support the native Blob constructor. (i.e.
// old QtWebKit versions, at least).
function createBlob(parts, properties) {
    /* global BlobBuilder,MSBlobBuilder,MozBlobBuilder,WebKitBlobBuilder */
    parts = parts || [];
    properties = properties || {};
    try {
        return new Blob(parts, properties);
    } catch (e) {
        if (e.name !== 'TypeError') {
            throw e;
        }
        var Builder = typeof BlobBuilder !== 'undefined' ? BlobBuilder : typeof MSBlobBuilder !== 'undefined' ? MSBlobBuilder : typeof MozBlobBuilder !== 'undefined' ? MozBlobBuilder : WebKitBlobBuilder;
        var builder = new Builder();
        for (var i = 0; i < parts.length; i += 1) {
            builder.append(parts[i]);
        }
        return builder.getBlob(properties.type);
    }
}

// This is CommonJS because lie is an external dependency, so Rollup
// can just ignore it.
if (typeof Promise === 'undefined') {
    // In the "nopromises" build this will just throw if you don't have
    // a global promise object, but it would throw anyway later.
    _dereq_(3);
}
var Promise$1 = Promise;

function executeCallback(promise, callback) {
    if (callback) {
        promise.then(function (result) {
            callback(null, result);
        }, function (error) {
            callback(error);
        });
    }
}

function executeTwoCallbacks(promise, callback, errorCallback) {
    if (typeof callback === 'function') {
        promise.then(callback);
    }

    if (typeof errorCallback === 'function') {
        promise["catch"](errorCallback);
    }
}

function normalizeKey(key) {
    // Cast the key to a string, as that's all we can set as a key.
    if (typeof key !== 'string') {
        console.warn(key + ' used as a key, but it is not a string.');
        key = String(key);
    }

    return key;
}

function getCallback() {
    if (arguments.length && typeof arguments[arguments.length - 1] === 'function') {
        return arguments[arguments.length - 1];
    }
}

// Some code originally from async_storage.js in
// [Gaia](https://github.com/mozilla-b2g/gaia).

var DETECT_BLOB_SUPPORT_STORE = 'local-forage-detect-blob-support';
var supportsBlobs = void 0;
var dbContexts = {};
var toString = Object.prototype.toString;

// Transaction Modes
var READ_ONLY = 'readonly';
var READ_WRITE = 'readwrite';

// Transform a binary string to an array buffer, because otherwise
// weird stuff happens when you try to work with the binary string directly.
// It is known.
// From http://stackoverflow.com/questions/14967647/ (continues on next line)
// encode-decode-image-with-base64-breaks-image (2013-04-21)
function _binStringToArrayBuffer(bin) {
    var length = bin.length;
    var buf = new ArrayBuffer(length);
    var arr = new Uint8Array(buf);
    for (var i = 0; i < length; i++) {
        arr[i] = bin.charCodeAt(i);
    }
    return buf;
}

//
// Blobs are not supported in all versions of IndexedDB, notably
// Chrome <37 and Android <5. In those versions, storing a blob will throw.
//
// Various other blob bugs exist in Chrome v37-42 (inclusive).
// Detecting them is expensive and confusing to users, and Chrome 37-42
// is at very low usage worldwide, so we do a hacky userAgent check instead.
//
// content-type bug: https://code.google.com/p/chromium/issues/detail?id=408120
// 404 bug: https://code.google.com/p/chromium/issues/detail?id=447916
// FileReader bug: https://code.google.com/p/chromium/issues/detail?id=447836
//
// Code borrowed from PouchDB. See:
// https://github.com/pouchdb/pouchdb/blob/master/packages/node_modules/pouchdb-adapter-idb/src/blobSupport.js
//
function _checkBlobSupportWithoutCaching(idb) {
    return new Promise$1(function (resolve) {
        var txn = idb.transaction(DETECT_BLOB_SUPPORT_STORE, READ_WRITE);
        var blob = createBlob(['']);
        txn.objectStore(DETECT_BLOB_SUPPORT_STORE).put(blob, 'key');

        txn.onabort = function (e) {
            // If the transaction aborts now its due to not being able to
            // write to the database, likely due to the disk being full
            e.preventDefault();
            e.stopPropagation();
            resolve(false);
        };

        txn.oncomplete = function () {
            var matchedChrome = navigator.userAgent.match(/Chrome\/(\d+)/);
            var matchedEdge = navigator.userAgent.match(/Edge\//);
            // MS Edge pretends to be Chrome 42:
            // https://msdn.microsoft.com/en-us/library/hh869301%28v=vs.85%29.aspx
            resolve(matchedEdge || !matchedChrome || parseInt(matchedChrome[1], 10) >= 43);
        };
    })["catch"](function () {
        return false; // error, so assume unsupported
    });
}

function _checkBlobSupport(idb) {
    if (typeof supportsBlobs === 'boolean') {
        return Promise$1.resolve(supportsBlobs);
    }
    return _checkBlobSupportWithoutCaching(idb).then(function (value) {
        supportsBlobs = value;
        return supportsBlobs;
    });
}

function _deferReadiness(dbInfo) {
    var dbContext = dbContexts[dbInfo.name];

    // Create a deferred object representing the current database operation.
    var deferredOperation = {};

    deferredOperation.promise = new Promise$1(function (resolve, reject) {
        deferredOperation.resolve = resolve;
        deferredOperation.reject = reject;
    });

    // Enqueue the deferred operation.
    dbContext.deferredOperations.push(deferredOperation);

    // Chain its promise to the database readiness.
    if (!dbContext.dbReady) {
        dbContext.dbReady = deferredOperation.promise;
    } else {
        dbContext.dbReady = dbContext.dbReady.then(function () {
            return deferredOperation.promise;
        });
    }
}

function _advanceReadiness(dbInfo) {
    var dbContext = dbContexts[dbInfo.name];

    // Dequeue a deferred operation.
    var deferredOperation = dbContext.deferredOperations.pop();

    // Resolve its promise (which is part of the database readiness
    // chain of promises).
    if (deferredOperation) {
        deferredOperation.resolve();
        return deferredOperation.promise;
    }
}

function _rejectReadiness(dbInfo, err) {
    var dbContext = dbContexts[dbInfo.name];

    // Dequeue a deferred operation.
    var deferredOperation = dbContext.deferredOperations.pop();

    // Reject its promise (which is part of the database readiness
    // chain of promises).
    if (deferredOperation) {
        deferredOperation.reject(err);
        return deferredOperation.promise;
    }
}

function _getConnection(dbInfo, upgradeNeeded) {
    return new Promise$1(function (resolve, reject) {
        dbContexts[dbInfo.name] = dbContexts[dbInfo.name] || createDbContext();

        if (dbInfo.db) {
            if (upgradeNeeded) {
                _deferReadiness(dbInfo);
                dbInfo.db.close();
            } else {
                return resolve(dbInfo.db);
            }
        }

        var dbArgs = [dbInfo.name];

        if (upgradeNeeded) {
            dbArgs.push(dbInfo.version);
        }

        var openreq = idb.open.apply(idb, dbArgs);

        if (upgradeNeeded) {
            openreq.onupgradeneeded = function (e) {
                var db = openreq.result;
                try {
                    db.createObjectStore(dbInfo.storeName);
                    if (e.oldVersion <= 1) {
                        // Added when support for blob shims was added
                        db.createObjectStore(DETECT_BLOB_SUPPORT_STORE);
                    }
                } catch (ex) {
                    if (ex.name === 'ConstraintError') {
                        console.warn('The database "' + dbInfo.name + '"' + ' has been upgraded from version ' + e.oldVersion + ' to version ' + e.newVersion + ', but the storage "' + dbInfo.storeName + '" already exists.');
                    } else {
                        throw ex;
                    }
                }
            };
        }

        openreq.onerror = function (e) {
            e.preventDefault();
            reject(openreq.error);
        };

        openreq.onsuccess = function () {
            var db = openreq.result;
            db.onversionchange = function (e) {
                // Triggered when the database is modified (e.g. adding an objectStore) or
                // deleted (even when initiated by other sessions in different tabs).
                // Closing the connection here prevents those operations from being blocked.
                // If the database is accessed again later by this instance, the connection
                // will be reopened or the database recreated as needed.
                e.target.close();
            };
            resolve(db);
            _advanceReadiness(dbInfo);
        };
    });
}

function _getOriginalConnection(dbInfo) {
    return _getConnection(dbInfo, false);
}

function _getUpgradedConnection(dbInfo) {
    return _getConnection(dbInfo, true);
}

function _isUpgradeNeeded(dbInfo, defaultVersion) {
    if (!dbInfo.db) {
        return true;
    }

    var isNewStore = !dbInfo.db.objectStoreNames.contains(dbInfo.storeName);
    var isDowngrade = dbInfo.version < dbInfo.db.version;
    var isUpgrade = dbInfo.version > dbInfo.db.version;

    if (isDowngrade) {
        // If the version is not the default one
        // then warn for impossible downgrade.
        if (dbInfo.version !== defaultVersion) {
            console.warn('The database "' + dbInfo.name + '"' + " can't be downgraded from version " + dbInfo.db.version + ' to version ' + dbInfo.version + '.');
        }
        // Align the versions to prevent errors.
        dbInfo.version = dbInfo.db.version;
    }

    if (isUpgrade || isNewStore) {
        // If the store is new then increment the version (if needed).
        // This will trigger an "upgradeneeded" event which is required
        // for creating a store.
        if (isNewStore) {
            var incVersion = dbInfo.db.version + 1;
            if (incVersion > dbInfo.version) {
                dbInfo.version = incVersion;
            }
        }

        return true;
    }

    return false;
}

// encode a blob for indexeddb engines that don't support blobs
function _encodeBlob(blob) {
    return new Promise$1(function (resolve, reject) {
        var reader = new FileReader();
        reader.onerror = reject;
        reader.onloadend = function (e) {
            var base64 = btoa(e.target.result || '');
            resolve({
                __local_forage_encoded_blob: true,
                data: base64,
                type: blob.type
            });
        };
        reader.readAsBinaryString(blob);
    });
}

// decode an encoded blob
function _decodeBlob(encodedBlob) {
    var arrayBuff = _binStringToArrayBuffer(atob(encodedBlob.data));
    return createBlob([arrayBuff], { type: encodedBlob.type });
}

// is this one of our fancy encoded blobs?
function _isEncodedBlob(value) {
    return value && value.__local_forage_encoded_blob;
}

// Specialize the default `ready()` function by making it dependent
// on the current database operations. Thus, the driver will be actually
// ready when it's been initialized (default) *and* there are no pending
// operations on the database (initiated by some other instances).
function _fullyReady(callback) {
    var self = this;

    var promise = self._initReady().then(function () {
        var dbContext = dbContexts[self._dbInfo.name];

        if (dbContext && dbContext.dbReady) {
            return dbContext.dbReady;
        }
    });

    executeTwoCallbacks(promise, callback, callback);
    return promise;
}

// Try to establish a new db connection to replace the
// current one which is broken (i.e. experiencing
// InvalidStateError while creating a transaction).
function _tryReconnect(dbInfo) {
    _deferReadiness(dbInfo);

    var dbContext = dbContexts[dbInfo.name];
    var forages = dbContext.forages;

    for (var i = 0; i < forages.length; i++) {
        var forage = forages[i];
        if (forage._dbInfo.db) {
            forage._dbInfo.db.close();
            forage._dbInfo.db = null;
        }
    }
    dbInfo.db = null;

    return _getOriginalConnection(dbInfo).then(function (db) {
        dbInfo.db = db;
        if (_isUpgradeNeeded(dbInfo)) {
            // Reopen the database for upgrading.
            return _getUpgradedConnection(dbInfo);
        }
        return db;
    }).then(function (db) {
        // store the latest db reference
        // in case the db was upgraded
        dbInfo.db = dbContext.db = db;
        for (var i = 0; i < forages.length; i++) {
            forages[i]._dbInfo.db = db;
        }
    })["catch"](function (err) {
        _rejectReadiness(dbInfo, err);
        throw err;
    });
}

// FF doesn't like Promises (micro-tasks) and IDDB store operations,
// so we have to do it with callbacks
function createTransaction(dbInfo, mode, callback, retries) {
    if (retries === undefined) {
        retries = 1;
    }

    try {
        var tx = dbInfo.db.transaction(dbInfo.storeName, mode);
        callback(null, tx);
    } catch (err) {
        if (retries > 0 && (!dbInfo.db || err.name === 'InvalidStateError' || err.name === 'NotFoundError')) {
            return Promise$1.resolve().then(function () {
                if (!dbInfo.db || err.name === 'NotFoundError' && !dbInfo.db.objectStoreNames.contains(dbInfo.storeName) && dbInfo.version <= dbInfo.db.version) {
                    // increase the db version, to create the new ObjectStore
                    if (dbInfo.db) {
                        dbInfo.version = dbInfo.db.version + 1;
                    }
                    // Reopen the database for upgrading.
                    return _getUpgradedConnection(dbInfo);
                }
            }).then(function () {
                return _tryReconnect(dbInfo).then(function () {
                    createTransaction(dbInfo, mode, callback, retries - 1);
                });
            })["catch"](callback);
        }

        callback(err);
    }
}

function createDbContext() {
    return {
        // Running localForages sharing a database.
        forages: [],
        // Shared database.
        db: null,
        // Database readiness (promise).
        dbReady: null,
        // Deferred operations on the database.
        deferredOperations: []
    };
}

// Open the IndexedDB database (automatically creates one if one didn't
// previously exist), using any options set in the config.
function _initStorage(options) {
    var self = this;
    var dbInfo = {
        db: null
    };

    if (options) {
        for (var i in options) {
            dbInfo[i] = options[i];
        }
    }

    // Get the current context of the database;
    var dbContext = dbContexts[dbInfo.name];

    // ...or create a new context.
    if (!dbContext) {
        dbContext = createDbContext();
        // Register the new context in the global container.
        dbContexts[dbInfo.name] = dbContext;
    }

    // Register itself as a running localForage in the current context.
    dbContext.forages.push(self);

    // Replace the default `ready()` function with the specialized one.
    if (!self._initReady) {
        self._initReady = self.ready;
        self.ready = _fullyReady;
    }

    // Create an array of initialization states of the related localForages.
    var initPromises = [];

    function ignoreErrors() {
        // Don't handle errors here,
        // just makes sure related localForages aren't pending.
        return Promise$1.resolve();
    }

    for (var j = 0; j < dbContext.forages.length; j++) {
        var forage = dbContext.forages[j];
        if (forage !== self) {
            // Don't wait for itself...
            initPromises.push(forage._initReady()["catch"](ignoreErrors));
        }
    }

    // Take a snapshot of the related localForages.
    var forages = dbContext.forages.slice(0);

    // Initialize the connection process only when
    // all the related localForages aren't pending.
    return Promise$1.all(initPromises).then(function () {
        dbInfo.db = dbContext.db;
        // Get the connection or open a new one without upgrade.
        return _getOriginalConnection(dbInfo);
    }).then(function (db) {
        dbInfo.db = db;
        if (_isUpgradeNeeded(dbInfo, self._defaultConfig.version)) {
            // Reopen the database for upgrading.
            return _getUpgradedConnection(dbInfo);
        }
        return db;
    }).then(function (db) {
        dbInfo.db = dbContext.db = db;
        self._dbInfo = dbInfo;
        // Share the final connection amongst related localForages.
        for (var k = 0; k < forages.length; k++) {
            var forage = forages[k];
            if (forage !== self) {
                // Self is already up-to-date.
                forage._dbInfo.db = dbInfo.db;
                forage._dbInfo.version = dbInfo.version;
            }
        }
    });
}

function getItem(key, callback) {
    var self = this;

    key = normalizeKey(key);

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);
                    var req = store.get(key);

                    req.onsuccess = function () {
                        var value = req.result;
                        if (value === undefined) {
                            value = null;
                        }
                        if (_isEncodedBlob(value)) {
                            value = _decodeBlob(value);
                        }
                        resolve(value);
                    };

                    req.onerror = function () {
                        reject(req.error);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

// Iterate over all items stored in database.
function iterate(iterator, callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);
                    var req = store.openCursor();
                    var iterationNumber = 1;

                    req.onsuccess = function () {
                        var cursor = req.result;

                        if (cursor) {
                            var value = cursor.value;
                            if (_isEncodedBlob(value)) {
                                value = _decodeBlob(value);
                            }
                            var result = iterator(value, cursor.key, iterationNumber++);

                            // when the iterator callback returns any
                            // (non-`undefined`) value, then we stop
                            // the iteration immediately
                            if (result !== void 0) {
                                resolve(result);
                            } else {
                                cursor["continue"]();
                            }
                        } else {
                            resolve();
                        }
                    };

                    req.onerror = function () {
                        reject(req.error);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);

    return promise;
}

function setItem(key, value, callback) {
    var self = this;

    key = normalizeKey(key);

    var promise = new Promise$1(function (resolve, reject) {
        var dbInfo;
        self.ready().then(function () {
            dbInfo = self._dbInfo;
            if (toString.call(value) === '[object Blob]') {
                return _checkBlobSupport(dbInfo.db).then(function (blobSupport) {
                    if (blobSupport) {
                        return value;
                    }
                    return _encodeBlob(value);
                });
            }
            return value;
        }).then(function (value) {
            createTransaction(self._dbInfo, READ_WRITE, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);

                    // The reason we don't _save_ null is because IE 10 does
                    // not support saving the `null` type in IndexedDB. How
                    // ironic, given the bug below!
                    // See: https://github.com/mozilla/localForage/issues/161
                    if (value === null) {
                        value = undefined;
                    }

                    var req = store.put(value, key);

                    transaction.oncomplete = function () {
                        // Cast to undefined so the value passed to
                        // callback/promise is the same as what one would get out
                        // of `getItem()` later. This leads to some weirdness
                        // (setItem('foo', undefined) will return `null`), but
                        // it's not my fault localStorage is our baseline and that
                        // it's weird.
                        if (value === undefined) {
                            value = null;
                        }

                        resolve(value);
                    };
                    transaction.onabort = transaction.onerror = function () {
                        var err = req.error ? req.error : req.transaction.error;
                        reject(err);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function removeItem(key, callback) {
    var self = this;

    key = normalizeKey(key);

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            createTransaction(self._dbInfo, READ_WRITE, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);
                    // We use a Grunt task to make this safe for IE and some
                    // versions of Android (including those used by Cordova).
                    // Normally IE won't like `.delete()` and will insist on
                    // using `['delete']()`, but we have a build step that
                    // fixes this for us now.
                    var req = store["delete"](key);
                    transaction.oncomplete = function () {
                        resolve();
                    };

                    transaction.onerror = function () {
                        reject(req.error);
                    };

                    // The request will be also be aborted if we've exceeded our storage
                    // space.
                    transaction.onabort = function () {
                        var err = req.error ? req.error : req.transaction.error;
                        reject(err);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function clear(callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            createTransaction(self._dbInfo, READ_WRITE, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);
                    var req = store.clear();

                    transaction.oncomplete = function () {
                        resolve();
                    };

                    transaction.onabort = transaction.onerror = function () {
                        var err = req.error ? req.error : req.transaction.error;
                        reject(err);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function length(callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);
                    var req = store.count();

                    req.onsuccess = function () {
                        resolve(req.result);
                    };

                    req.onerror = function () {
                        reject(req.error);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function key(n, callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        if (n < 0) {
            resolve(null);

            return;
        }

        self.ready().then(function () {
            createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);
                    var advanced = false;
                    var req = store.openKeyCursor();

                    req.onsuccess = function () {
                        var cursor = req.result;
                        if (!cursor) {
                            // this means there weren't enough keys
                            resolve(null);

                            return;
                        }

                        if (n === 0) {
                            // We have the first key, return it if that's what they
                            // wanted.
                            resolve(cursor.key);
                        } else {
                            if (!advanced) {
                                // Otherwise, ask the cursor to skip ahead n
                                // records.
                                advanced = true;
                                cursor.advance(n);
                            } else {
                                // When we get here, we've got the nth key.
                                resolve(cursor.key);
                            }
                        }
                    };

                    req.onerror = function () {
                        reject(req.error);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function keys(callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);
                    var req = store.openKeyCursor();
                    var keys = [];

                    req.onsuccess = function () {
                        var cursor = req.result;

                        if (!cursor) {
                            resolve(keys);
                            return;
                        }

                        keys.push(cursor.key);
                        cursor["continue"]();
                    };

                    req.onerror = function () {
                        reject(req.error);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function dropInstance(options, callback) {
    callback = getCallback.apply(this, arguments);

    var currentConfig = this.config();
    options = typeof options !== 'function' && options || {};
    if (!options.name) {
        options.name = options.name || currentConfig.name;
        options.storeName = options.storeName || currentConfig.storeName;
    }

    var self = this;
    var promise;
    if (!options.name) {
        promise = Promise$1.reject('Invalid arguments');
    } else {
        var isCurrentDb = options.name === currentConfig.name && self._dbInfo.db;

        var dbPromise = isCurrentDb ? Promise$1.resolve(self._dbInfo.db) : _getOriginalConnection(options).then(function (db) {
            var dbContext = dbContexts[options.name];
            var forages = dbContext.forages;
            dbContext.db = db;
            for (var i = 0; i < forages.length; i++) {
                forages[i]._dbInfo.db = db;
            }
            return db;
        });

        if (!options.storeName) {
            promise = dbPromise.then(function (db) {
                _deferReadiness(options);

                var dbContext = dbContexts[options.name];
                var forages = dbContext.forages;

                db.close();
                for (var i = 0; i < forages.length; i++) {
                    var forage = forages[i];
                    forage._dbInfo.db = null;
                }

                var dropDBPromise = new Promise$1(function (resolve, reject) {
                    var req = idb.deleteDatabase(options.name);

                    req.onerror = function () {
                        var db = req.result;
                        if (db) {
                            db.close();
                        }
                        reject(req.error);
                    };

                    req.onblocked = function () {
                        // Closing all open connections in onversionchange handler should prevent this situation, but if
                        // we do get here, it just means the request remains pending - eventually it will succeed or error
                        console.warn('dropInstance blocked for database "' + options.name + '" until all open connections are closed');
                    };

                    req.onsuccess = function () {
                        var db = req.result;
                        if (db) {
                            db.close();
                        }
                        resolve(db);
                    };
                });

                return dropDBPromise.then(function (db) {
                    dbContext.db = db;
                    for (var i = 0; i < forages.length; i++) {
                        var _forage = forages[i];
                        _advanceReadiness(_forage._dbInfo);
                    }
                })["catch"](function (err) {
                    (_rejectReadiness(options, err) || Promise$1.resolve())["catch"](function () {});
                    throw err;
                });
            });
        } else {
            promise = dbPromise.then(function (db) {
                if (!db.objectStoreNames.contains(options.storeName)) {
                    return;
                }

                var newVersion = db.version + 1;

                _deferReadiness(options);

                var dbContext = dbContexts[options.name];
                var forages = dbContext.forages;

                db.close();
                for (var i = 0; i < forages.length; i++) {
                    var forage = forages[i];
                    forage._dbInfo.db = null;
                    forage._dbInfo.version = newVersion;
                }

                var dropObjectPromise = new Promise$1(function (resolve, reject) {
                    var req = idb.open(options.name, newVersion);

                    req.onerror = function (err) {
                        var db = req.result;
                        db.close();
                        reject(err);
                    };

                    req.onupgradeneeded = function () {
                        var db = req.result;
                        db.deleteObjectStore(options.storeName);
                    };

                    req.onsuccess = function () {
                        var db = req.result;
                        db.close();
                        resolve(db);
                    };
                });

                return dropObjectPromise.then(function (db) {
                    dbContext.db = db;
                    for (var j = 0; j < forages.length; j++) {
                        var _forage2 = forages[j];
                        _forage2._dbInfo.db = db;
                        _advanceReadiness(_forage2._dbInfo);
                    }
                })["catch"](function (err) {
                    (_rejectReadiness(options, err) || Promise$1.resolve())["catch"](function () {});
                    throw err;
                });
            });
        }
    }

    executeCallback(promise, callback);
    return promise;
}

var asyncStorage = {
    _driver: 'asyncStorage',
    _initStorage: _initStorage,
    _support: isIndexedDBValid(),
    iterate: iterate,
    getItem: getItem,
    setItem: setItem,
    removeItem: removeItem,
    clear: clear,
    length: length,
    key: key,
    keys: keys,
    dropInstance: dropInstance
};

function isWebSQLValid() {
    return typeof openDatabase === 'function';
}

// Sadly, the best way to save binary data in WebSQL/localStorage is serializing
// it to Base64, so this is how we store it to prevent very strange errors with less
// verbose ways of binary <-> string data storage.
var BASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

var BLOB_TYPE_PREFIX = '~~local_forage_type~';
var BLOB_TYPE_PREFIX_REGEX = /^~~local_forage_type~([^~]+)~/;

var SERIALIZED_MARKER = '__lfsc__:';
var SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER.length;

// OMG the serializations!
var TYPE_ARRAYBUFFER = 'arbf';
var TYPE_BLOB = 'blob';
var TYPE_INT8ARRAY = 'si08';
var TYPE_UINT8ARRAY = 'ui08';
var TYPE_UINT8CLAMPEDARRAY = 'uic8';
var TYPE_INT16ARRAY = 'si16';
var TYPE_INT32ARRAY = 'si32';
var TYPE_UINT16ARRAY = 'ur16';
var TYPE_UINT32ARRAY = 'ui32';
var TYPE_FLOAT32ARRAY = 'fl32';
var TYPE_FLOAT64ARRAY = 'fl64';
var TYPE_SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER_LENGTH + TYPE_ARRAYBUFFER.length;

var toString$1 = Object.prototype.toString;

function stringToBuffer(serializedString) {
    // Fill the string into a ArrayBuffer.
    var bufferLength = serializedString.length * 0.75;
    var len = serializedString.length;
    var i;
    var p = 0;
    var encoded1, encoded2, encoded3, encoded4;

    if (serializedString[serializedString.length - 1] === '=') {
        bufferLength--;
        if (serializedString[serializedString.length - 2] === '=') {
            bufferLength--;
        }
    }

    var buffer = new ArrayBuffer(bufferLength);
    var bytes = new Uint8Array(buffer);

    for (i = 0; i < len; i += 4) {
        encoded1 = BASE_CHARS.indexOf(serializedString[i]);
        encoded2 = BASE_CHARS.indexOf(serializedString[i + 1]);
        encoded3 = BASE_CHARS.indexOf(serializedString[i + 2]);
        encoded4 = BASE_CHARS.indexOf(serializedString[i + 3]);

        /*jslint bitwise: true */
        bytes[p++] = encoded1 << 2 | encoded2 >> 4;
        bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
        bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
    }
    return buffer;
}

// Converts a buffer to a string to store, serialized, in the backend
// storage library.
function bufferToString(buffer) {
    // base64-arraybuffer
    var bytes = new Uint8Array(buffer);
    var base64String = '';
    var i;

    for (i = 0; i < bytes.length; i += 3) {
        /*jslint bitwise: true */
        base64String += BASE_CHARS[bytes[i] >> 2];
        base64String += BASE_CHARS[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
        base64String += BASE_CHARS[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
        base64String += BASE_CHARS[bytes[i + 2] & 63];
    }

    if (bytes.length % 3 === 2) {
        base64String = base64String.substring(0, base64String.length - 1) + '=';
    } else if (bytes.length % 3 === 1) {
        base64String = base64String.substring(0, base64String.length - 2) + '==';
    }

    return base64String;
}

// Serialize a value, afterwards executing a callback (which usually
// instructs the `setItem()` callback/promise to be executed). This is how
// we store binary data with localStorage.
function serialize(value, callback) {
    var valueType = '';
    if (value) {
        valueType = toString$1.call(value);
    }

    // Cannot use `value instanceof ArrayBuffer` or such here, as these
    // checks fail when running the tests using casper.js...
    //
    // TODO: See why those tests fail and use a better solution.
    if (value && (valueType === '[object ArrayBuffer]' || value.buffer && toString$1.call(value.buffer) === '[object ArrayBuffer]')) {
        // Convert binary arrays to a string and prefix the string with
        // a special marker.
        var buffer;
        var marker = SERIALIZED_MARKER;

        if (value instanceof ArrayBuffer) {
            buffer = value;
            marker += TYPE_ARRAYBUFFER;
        } else {
            buffer = value.buffer;

            if (valueType === '[object Int8Array]') {
                marker += TYPE_INT8ARRAY;
            } else if (valueType === '[object Uint8Array]') {
                marker += TYPE_UINT8ARRAY;
            } else if (valueType === '[object Uint8ClampedArray]') {
                marker += TYPE_UINT8CLAMPEDARRAY;
            } else if (valueType === '[object Int16Array]') {
                marker += TYPE_INT16ARRAY;
            } else if (valueType === '[object Uint16Array]') {
                marker += TYPE_UINT16ARRAY;
            } else if (valueType === '[object Int32Array]') {
                marker += TYPE_INT32ARRAY;
            } else if (valueType === '[object Uint32Array]') {
                marker += TYPE_UINT32ARRAY;
            } else if (valueType === '[object Float32Array]') {
                marker += TYPE_FLOAT32ARRAY;
            } else if (valueType === '[object Float64Array]') {
                marker += TYPE_FLOAT64ARRAY;
            } else {
                callback(new Error('Failed to get type for BinaryArray'));
            }
        }

        callback(marker + bufferToString(buffer));
    } else if (valueType === '[object Blob]') {
        // Conver the blob to a binaryArray and then to a string.
        var fileReader = new FileReader();

        fileReader.onload = function () {
            // Backwards-compatible prefix for the blob type.
            var str = BLOB_TYPE_PREFIX + value.type + '~' + bufferToString(this.result);

            callback(SERIALIZED_MARKER + TYPE_BLOB + str);
        };

        fileReader.readAsArrayBuffer(value);
    } else {
        try {
            callback(JSON.stringify(value));
        } catch (e) {
            console.error("Couldn't convert value into a JSON string: ", value);

            callback(null, e);
        }
    }
}

// Deserialize data we've inserted into a value column/field. We place
// special markers into our strings to mark them as encoded; this isn't
// as nice as a meta field, but it's the only sane thing we can do whilst
// keeping localStorage support intact.
//
// Oftentimes this will just deserialize JSON content, but if we have a
// special marker (SERIALIZED_MARKER, defined above), we will extract
// some kind of arraybuffer/binary data/typed array out of the string.
function deserialize(value) {
    // If we haven't marked this string as being specially serialized (i.e.
    // something other than serialized JSON), we can just return it and be
    // done with it.
    if (value.substring(0, SERIALIZED_MARKER_LENGTH) !== SERIALIZED_MARKER) {
        return JSON.parse(value);
    }

    // The following code deals with deserializing some kind of Blob or
    // TypedArray. First we separate out the type of data we're dealing
    // with from the data itself.
    var serializedString = value.substring(TYPE_SERIALIZED_MARKER_LENGTH);
    var type = value.substring(SERIALIZED_MARKER_LENGTH, TYPE_SERIALIZED_MARKER_LENGTH);

    var blobType;
    // Backwards-compatible blob type serialization strategy.
    // DBs created with older versions of localForage will simply not have the blob type.
    if (type === TYPE_BLOB && BLOB_TYPE_PREFIX_REGEX.test(serializedString)) {
        var matcher = serializedString.match(BLOB_TYPE_PREFIX_REGEX);
        blobType = matcher[1];
        serializedString = serializedString.substring(matcher[0].length);
    }
    var buffer = stringToBuffer(serializedString);

    // Return the right type based on the code/type set during
    // serialization.
    switch (type) {
        case TYPE_ARRAYBUFFER:
            return buffer;
        case TYPE_BLOB:
            return createBlob([buffer], { type: blobType });
        case TYPE_INT8ARRAY:
            return new Int8Array(buffer);
        case TYPE_UINT8ARRAY:
            return new Uint8Array(buffer);
        case TYPE_UINT8CLAMPEDARRAY:
            return new Uint8ClampedArray(buffer);
        case TYPE_INT16ARRAY:
            return new Int16Array(buffer);
        case TYPE_UINT16ARRAY:
            return new Uint16Array(buffer);
        case TYPE_INT32ARRAY:
            return new Int32Array(buffer);
        case TYPE_UINT32ARRAY:
            return new Uint32Array(buffer);
        case TYPE_FLOAT32ARRAY:
            return new Float32Array(buffer);
        case TYPE_FLOAT64ARRAY:
            return new Float64Array(buffer);
        default:
            throw new Error('Unkown type: ' + type);
    }
}

var localforageSerializer = {
    serialize: serialize,
    deserialize: deserialize,
    stringToBuffer: stringToBuffer,
    bufferToString: bufferToString
};

/*
 * Includes code from:
 *
 * base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */

function createDbTable(t, dbInfo, callback, errorCallback) {
    t.executeSql('CREATE TABLE IF NOT EXISTS ' + dbInfo.storeName + ' ' + '(id INTEGER PRIMARY KEY, key unique, value)', [], callback, errorCallback);
}

// Open the WebSQL database (automatically creates one if one didn't
// previously exist), using any options set in the config.
function _initStorage$1(options) {
    var self = this;
    var dbInfo = {
        db: null
    };

    if (options) {
        for (var i in options) {
            dbInfo[i] = typeof options[i] !== 'string' ? options[i].toString() : options[i];
        }
    }

    var dbInfoPromise = new Promise$1(function (resolve, reject) {
        // Open the database; the openDatabase API will automatically
        // create it for us if it doesn't exist.
        try {
            dbInfo.db = openDatabase(dbInfo.name, String(dbInfo.version), dbInfo.description, dbInfo.size);
        } catch (e) {
            return reject(e);
        }

        // Create our key/value table if it doesn't exist.
        dbInfo.db.transaction(function (t) {
            createDbTable(t, dbInfo, function () {
                self._dbInfo = dbInfo;
                resolve();
            }, function (t, error) {
                reject(error);
            });
        }, reject);
    });

    dbInfo.serializer = localforageSerializer;
    return dbInfoPromise;
}

function tryExecuteSql(t, dbInfo, sqlStatement, args, callback, errorCallback) {
    t.executeSql(sqlStatement, args, callback, function (t, error) {
        if (error.code === error.SYNTAX_ERR) {
            t.executeSql('SELECT name FROM sqlite_master ' + "WHERE type='table' AND name = ?", [dbInfo.storeName], function (t, results) {
                if (!results.rows.length) {
                    // if the table is missing (was deleted)
                    // re-create it table and retry
                    createDbTable(t, dbInfo, function () {
                        t.executeSql(sqlStatement, args, callback, errorCallback);
                    }, errorCallback);
                } else {
                    errorCallback(t, error);
                }
            }, errorCallback);
        } else {
            errorCallback(t, error);
        }
    }, errorCallback);
}

function getItem$1(key, callback) {
    var self = this;

    key = normalizeKey(key);

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            dbInfo.db.transaction(function (t) {
                tryExecuteSql(t, dbInfo, 'SELECT * FROM ' + dbInfo.storeName + ' WHERE key = ? LIMIT 1', [key], function (t, results) {
                    var result = results.rows.length ? results.rows.item(0).value : null;

                    // Check to see if this is serialized content we need to
                    // unpack.
                    if (result) {
                        result = dbInfo.serializer.deserialize(result);
                    }

                    resolve(result);
                }, function (t, error) {
                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function iterate$1(iterator, callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;

            dbInfo.db.transaction(function (t) {
                tryExecuteSql(t, dbInfo, 'SELECT * FROM ' + dbInfo.storeName, [], function (t, results) {
                    var rows = results.rows;
                    var length = rows.length;

                    for (var i = 0; i < length; i++) {
                        var item = rows.item(i);
                        var result = item.value;

                        // Check to see if this is serialized content
                        // we need to unpack.
                        if (result) {
                            result = dbInfo.serializer.deserialize(result);
                        }

                        result = iterator(result, item.key, i + 1);

                        // void(0) prevents problems with redefinition
                        // of `undefined`.
                        if (result !== void 0) {
                            resolve(result);
                            return;
                        }
                    }

                    resolve();
                }, function (t, error) {
                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function _setItem(key, value, callback, retriesLeft) {
    var self = this;

    key = normalizeKey(key);

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            // The localStorage API doesn't return undefined values in an
            // "expected" way, so undefined is always cast to null in all
            // drivers. See: https://github.com/mozilla/localForage/pull/42
            if (value === undefined) {
                value = null;
            }

            // Save the original value to pass to the callback.
            var originalValue = value;

            var dbInfo = self._dbInfo;
            dbInfo.serializer.serialize(value, function (value, error) {
                if (error) {
                    reject(error);
                } else {
                    dbInfo.db.transaction(function (t) {
                        tryExecuteSql(t, dbInfo, 'INSERT OR REPLACE INTO ' + dbInfo.storeName + ' ' + '(key, value) VALUES (?, ?)', [key, value], function () {
                            resolve(originalValue);
                        }, function (t, error) {
                            reject(error);
                        });
                    }, function (sqlError) {
                        // The transaction failed; check
                        // to see if it's a quota error.
                        if (sqlError.code === sqlError.QUOTA_ERR) {
                            // We reject the callback outright for now, but
                            // it's worth trying to re-run the transaction.
                            // Even if the user accepts the prompt to use
                            // more storage on Safari, this error will
                            // be called.
                            //
                            // Try to re-run the transaction.
                            if (retriesLeft > 0) {
                                resolve(_setItem.apply(self, [key, originalValue, callback, retriesLeft - 1]));
                                return;
                            }
                            reject(sqlError);
                        }
                    });
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function setItem$1(key, value, callback) {
    return _setItem.apply(this, [key, value, callback, 1]);
}

function removeItem$1(key, callback) {
    var self = this;

    key = normalizeKey(key);

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            dbInfo.db.transaction(function (t) {
                tryExecuteSql(t, dbInfo, 'DELETE FROM ' + dbInfo.storeName + ' WHERE key = ?', [key], function () {
                    resolve();
                }, function (t, error) {
                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

// Deletes every item in the table.
// TODO: Find out if this resets the AUTO_INCREMENT number.
function clear$1(callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            dbInfo.db.transaction(function (t) {
                tryExecuteSql(t, dbInfo, 'DELETE FROM ' + dbInfo.storeName, [], function () {
                    resolve();
                }, function (t, error) {
                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

// Does a simple `COUNT(key)` to get the number of items stored in
// localForage.
function length$1(callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            dbInfo.db.transaction(function (t) {
                // Ahhh, SQL makes this one soooooo easy.
                tryExecuteSql(t, dbInfo, 'SELECT COUNT(key) as c FROM ' + dbInfo.storeName, [], function (t, results) {
                    var result = results.rows.item(0).c;
                    resolve(result);
                }, function (t, error) {
                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

// Return the key located at key index X; essentially gets the key from a
// `WHERE id = ?`. This is the most efficient way I can think to implement
// this rarely-used (in my experience) part of the API, but it can seem
// inconsistent, because we do `INSERT OR REPLACE INTO` on `setItem()`, so
// the ID of each key will change every time it's updated. Perhaps a stored
// procedure for the `setItem()` SQL would solve this problem?
// TODO: Don't change ID on `setItem()`.
function key$1(n, callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            dbInfo.db.transaction(function (t) {
                tryExecuteSql(t, dbInfo, 'SELECT key FROM ' + dbInfo.storeName + ' WHERE id = ? LIMIT 1', [n + 1], function (t, results) {
                    var result = results.rows.length ? results.rows.item(0).key : null;
                    resolve(result);
                }, function (t, error) {
                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function keys$1(callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            dbInfo.db.transaction(function (t) {
                tryExecuteSql(t, dbInfo, 'SELECT key FROM ' + dbInfo.storeName, [], function (t, results) {
                    var keys = [];

                    for (var i = 0; i < results.rows.length; i++) {
                        keys.push(results.rows.item(i).key);
                    }

                    resolve(keys);
                }, function (t, error) {
                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

// https://www.w3.org/TR/webdatabase/#databases
// > There is no way to enumerate or delete the databases available for an origin from this API.
function getAllStoreNames(db) {
    return new Promise$1(function (resolve, reject) {
        db.transaction(function (t) {
            t.executeSql('SELECT name FROM sqlite_master ' + "WHERE type='table' AND name <> '__WebKitDatabaseInfoTable__'", [], function (t, results) {
                var storeNames = [];

                for (var i = 0; i < results.rows.length; i++) {
                    storeNames.push(results.rows.item(i).name);
                }

                resolve({
                    db: db,
                    storeNames: storeNames
                });
            }, function (t, error) {
                reject(error);
            });
        }, function (sqlError) {
            reject(sqlError);
        });
    });
}

function dropInstance$1(options, callback) {
    callback = getCallback.apply(this, arguments);

    var currentConfig = this.config();
    options = typeof options !== 'function' && options || {};
    if (!options.name) {
        options.name = options.name || currentConfig.name;
        options.storeName = options.storeName || currentConfig.storeName;
    }

    var self = this;
    var promise;
    if (!options.name) {
        promise = Promise$1.reject('Invalid arguments');
    } else {
        promise = new Promise$1(function (resolve) {
            var db;
            if (options.name === currentConfig.name) {
                // use the db reference of the current instance
                db = self._dbInfo.db;
            } else {
                db = openDatabase(options.name, '', '', 0);
            }

            if (!options.storeName) {
                // drop all database tables
                resolve(getAllStoreNames(db));
            } else {
                resolve({
                    db: db,
                    storeNames: [options.storeName]
                });
            }
        }).then(function (operationInfo) {
            return new Promise$1(function (resolve, reject) {
                operationInfo.db.transaction(function (t) {
                    function dropTable(storeName) {
                        return new Promise$1(function (resolve, reject) {
                            t.executeSql('DROP TABLE IF EXISTS ' + storeName, [], function () {
                                resolve();
                            }, function (t, error) {
                                reject(error);
                            });
                        });
                    }

                    var operations = [];
                    for (var i = 0, len = operationInfo.storeNames.length; i < len; i++) {
                        operations.push(dropTable(operationInfo.storeNames[i]));
                    }

                    Promise$1.all(operations).then(function () {
                        resolve();
                    })["catch"](function (e) {
                        reject(e);
                    });
                }, function (sqlError) {
                    reject(sqlError);
                });
            });
        });
    }

    executeCallback(promise, callback);
    return promise;
}

var webSQLStorage = {
    _driver: 'webSQLStorage',
    _initStorage: _initStorage$1,
    _support: isWebSQLValid(),
    iterate: iterate$1,
    getItem: getItem$1,
    setItem: setItem$1,
    removeItem: removeItem$1,
    clear: clear$1,
    length: length$1,
    key: key$1,
    keys: keys$1,
    dropInstance: dropInstance$1
};

function isLocalStorageValid() {
    try {
        return typeof localStorage !== 'undefined' && 'setItem' in localStorage &&
        // in IE8 typeof localStorage.setItem === 'object'
        !!localStorage.setItem;
    } catch (e) {
        return false;
    }
}

function _getKeyPrefix(options, defaultConfig) {
    var keyPrefix = options.name + '/';

    if (options.storeName !== defaultConfig.storeName) {
        keyPrefix += options.storeName + '/';
    }
    return keyPrefix;
}

// Check if localStorage throws when saving an item
function checkIfLocalStorageThrows() {
    var localStorageTestKey = '_localforage_support_test';

    try {
        localStorage.setItem(localStorageTestKey, true);
        localStorage.removeItem(localStorageTestKey);

        return false;
    } catch (e) {
        return true;
    }
}

// Check if localStorage is usable and allows to save an item
// This method checks if localStorage is usable in Safari Private Browsing
// mode, or in any other case where the available quota for localStorage
// is 0 and there wasn't any saved items yet.
function _isLocalStorageUsable() {
    return !checkIfLocalStorageThrows() || localStorage.length > 0;
}

// Config the localStorage backend, using options set in the config.
function _initStorage$2(options) {
    var self = this;
    var dbInfo = {};
    if (options) {
        for (var i in options) {
            dbInfo[i] = options[i];
        }
    }

    dbInfo.keyPrefix = _getKeyPrefix(options, self._defaultConfig);

    if (!_isLocalStorageUsable()) {
        return Promise$1.reject();
    }

    self._dbInfo = dbInfo;
    dbInfo.serializer = localforageSerializer;

    return Promise$1.resolve();
}

// Remove all keys from the datastore, effectively destroying all data in
// the app's key/value store!
function clear$2(callback) {
    var self = this;
    var promise = self.ready().then(function () {
        var keyPrefix = self._dbInfo.keyPrefix;

        for (var i = localStorage.length - 1; i >= 0; i--) {
            var key = localStorage.key(i);

            if (key.indexOf(keyPrefix) === 0) {
                localStorage.removeItem(key);
            }
        }
    });

    executeCallback(promise, callback);
    return promise;
}

// Retrieve an item from the store. Unlike the original async_storage
// library in Gaia, we don't modify return values at all. If a key's value
// is `undefined`, we pass that value to the callback function.
function getItem$2(key, callback) {
    var self = this;

    key = normalizeKey(key);

    var promise = self.ready().then(function () {
        var dbInfo = self._dbInfo;
        var result = localStorage.getItem(dbInfo.keyPrefix + key);

        // If a result was found, parse it from the serialized
        // string into a JS object. If result isn't truthy, the key
        // is likely undefined and we'll pass it straight to the
        // callback.
        if (result) {
            result = dbInfo.serializer.deserialize(result);
        }

        return result;
    });

    executeCallback(promise, callback);
    return promise;
}

// Iterate over all items in the store.
function iterate$2(iterator, callback) {
    var self = this;

    var promise = self.ready().then(function () {
        var dbInfo = self._dbInfo;
        var keyPrefix = dbInfo.keyPrefix;
        var keyPrefixLength = keyPrefix.length;
        var length = localStorage.length;

        // We use a dedicated iterator instead of the `i` variable below
        // so other keys we fetch in localStorage aren't counted in
        // the `iterationNumber` argument passed to the `iterate()`
        // callback.
        //
        // See: github.com/mozilla/localForage/pull/435#discussion_r38061530
        var iterationNumber = 1;

        for (var i = 0; i < length; i++) {
            var key = localStorage.key(i);
            if (key.indexOf(keyPrefix) !== 0) {
                continue;
            }
            var value = localStorage.getItem(key);

            // If a result was found, parse it from the serialized
            // string into a JS object. If result isn't truthy, the
            // key is likely undefined and we'll pass it straight
            // to the iterator.
            if (value) {
                value = dbInfo.serializer.deserialize(value);
            }

            value = iterator(value, key.substring(keyPrefixLength), iterationNumber++);

            if (value !== void 0) {
                return value;
            }
        }
    });

    executeCallback(promise, callback);
    return promise;
}

// Same as localStorage's key() method, except takes a callback.
function key$2(n, callback) {
    var self = this;
    var promise = self.ready().then(function () {
        var dbInfo = self._dbInfo;
        var result;
        try {
            result = localStorage.key(n);
        } catch (error) {
            result = null;
        }

        // Remove the prefix from the key, if a key is found.
        if (result) {
            result = result.substring(dbInfo.keyPrefix.length);
        }

        return result;
    });

    executeCallback(promise, callback);
    return promise;
}

function keys$2(callback) {
    var self = this;
    var promise = self.ready().then(function () {
        var dbInfo = self._dbInfo;
        var length = localStorage.length;
        var keys = [];

        for (var i = 0; i < length; i++) {
            var itemKey = localStorage.key(i);
            if (itemKey.indexOf(dbInfo.keyPrefix) === 0) {
                keys.push(itemKey.substring(dbInfo.keyPrefix.length));
            }
        }

        return keys;
    });

    executeCallback(promise, callback);
    return promise;
}

// Supply the number of keys in the datastore to the callback function.
function length$2(callback) {
    var self = this;
    var promise = self.keys().then(function (keys) {
        return keys.length;
    });

    executeCallback(promise, callback);
    return promise;
}

// Remove an item from the store, nice and simple.
function removeItem$2(key, callback) {
    var self = this;

    key = normalizeKey(key);

    var promise = self.ready().then(function () {
        var dbInfo = self._dbInfo;
        localStorage.removeItem(dbInfo.keyPrefix + key);
    });

    executeCallback(promise, callback);
    return promise;
}

// Set a key's value and run an optional callback once the value is set.
// Unlike Gaia's implementation, the callback function is passed the value,
// in case you want to operate on that value only after you're sure it
// saved, or something like that.
function setItem$2(key, value, callback) {
    var self = this;

    key = normalizeKey(key);

    var promise = self.ready().then(function () {
        // Convert undefined values to null.
        // https://github.com/mozilla/localForage/pull/42
        if (value === undefined) {
            value = null;
        }

        // Save the original value to pass to the callback.
        var originalValue = value;

        return new Promise$1(function (resolve, reject) {
            var dbInfo = self._dbInfo;
            dbInfo.serializer.serialize(value, function (value, error) {
                if (error) {
                    reject(error);
                } else {
                    try {
                        localStorage.setItem(dbInfo.keyPrefix + key, value);
                        resolve(originalValue);
                    } catch (e) {
                        // localStorage capacity exceeded.
                        // TODO: Make this a specific error/event.
                        if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                            reject(e);
                        }
                        reject(e);
                    }
                }
            });
        });
    });

    executeCallback(promise, callback);
    return promise;
}

function dropInstance$2(options, callback) {
    callback = getCallback.apply(this, arguments);

    options = typeof options !== 'function' && options || {};
    if (!options.name) {
        var currentConfig = this.config();
        options.name = options.name || currentConfig.name;
        options.storeName = options.storeName || currentConfig.storeName;
    }

    var self = this;
    var promise;
    if (!options.name) {
        promise = Promise$1.reject('Invalid arguments');
    } else {
        promise = new Promise$1(function (resolve) {
            if (!options.storeName) {
                resolve(options.name + '/');
            } else {
                resolve(_getKeyPrefix(options, self._defaultConfig));
            }
        }).then(function (keyPrefix) {
            for (var i = localStorage.length - 1; i >= 0; i--) {
                var key = localStorage.key(i);

                if (key.indexOf(keyPrefix) === 0) {
                    localStorage.removeItem(key);
                }
            }
        });
    }

    executeCallback(promise, callback);
    return promise;
}

var localStorageWrapper = {
    _driver: 'localStorageWrapper',
    _initStorage: _initStorage$2,
    _support: isLocalStorageValid(),
    iterate: iterate$2,
    getItem: getItem$2,
    setItem: setItem$2,
    removeItem: removeItem$2,
    clear: clear$2,
    length: length$2,
    key: key$2,
    keys: keys$2,
    dropInstance: dropInstance$2
};

var sameValue = function sameValue(x, y) {
    return x === y || typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y);
};

var includes = function includes(array, searchElement) {
    var len = array.length;
    var i = 0;
    while (i < len) {
        if (sameValue(array[i], searchElement)) {
            return true;
        }
        i++;
    }

    return false;
};

var isArray = Array.isArray || function (arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
};

// Drivers are stored here when `defineDriver()` is called.
// They are shared across all instances of localForage.
var DefinedDrivers = {};

var DriverSupport = {};

var DefaultDrivers = {
    INDEXEDDB: asyncStorage,
    WEBSQL: webSQLStorage,
    LOCALSTORAGE: localStorageWrapper
};

var DefaultDriverOrder = [DefaultDrivers.INDEXEDDB._driver, DefaultDrivers.WEBSQL._driver, DefaultDrivers.LOCALSTORAGE._driver];

var OptionalDriverMethods = ['dropInstance'];

var LibraryMethods = ['clear', 'getItem', 'iterate', 'key', 'keys', 'length', 'removeItem', 'setItem'].concat(OptionalDriverMethods);

var DefaultConfig = {
    description: '',
    driver: DefaultDriverOrder.slice(),
    name: 'localforage',
    // Default DB size is _JUST UNDER_ 5MB, as it's the highest size
    // we can use without a prompt.
    size: 4980736,
    storeName: 'keyvaluepairs',
    version: 1.0
};

function callWhenReady(localForageInstance, libraryMethod) {
    localForageInstance[libraryMethod] = function () {
        var _args = arguments;
        return localForageInstance.ready().then(function () {
            return localForageInstance[libraryMethod].apply(localForageInstance, _args);
        });
    };
}

function extend() {
    for (var i = 1; i < arguments.length; i++) {
        var arg = arguments[i];

        if (arg) {
            for (var _key in arg) {
                if (arg.hasOwnProperty(_key)) {
                    if (isArray(arg[_key])) {
                        arguments[0][_key] = arg[_key].slice();
                    } else {
                        arguments[0][_key] = arg[_key];
                    }
                }
            }
        }
    }

    return arguments[0];
}

var LocalForage = function () {
    function LocalForage(options) {
        _classCallCheck(this, LocalForage);

        for (var driverTypeKey in DefaultDrivers) {
            if (DefaultDrivers.hasOwnProperty(driverTypeKey)) {
                var driver = DefaultDrivers[driverTypeKey];
                var driverName = driver._driver;
                this[driverTypeKey] = driverName;

                if (!DefinedDrivers[driverName]) {
                    // we don't need to wait for the promise,
                    // since the default drivers can be defined
                    // in a blocking manner
                    this.defineDriver(driver);
                }
            }
        }

        this._defaultConfig = extend({}, DefaultConfig);
        this._config = extend({}, this._defaultConfig, options);
        this._driverSet = null;
        this._initDriver = null;
        this._ready = false;
        this._dbInfo = null;

        this._wrapLibraryMethodsWithReady();
        this.setDriver(this._config.driver)["catch"](function () {});
    }

    // Set any config values for localForage; can be called anytime before
    // the first API call (e.g. `getItem`, `setItem`).
    // We loop through options so we don't overwrite existing config
    // values.


    LocalForage.prototype.config = function config(options) {
        // If the options argument is an object, we use it to set values.
        // Otherwise, we return either a specified config value or all
        // config values.
        if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
            // If localforage is ready and fully initialized, we can't set
            // any new configuration values. Instead, we return an error.
            if (this._ready) {
                return new Error("Can't call config() after localforage " + 'has been used.');
            }

            for (var i in options) {
                if (i === 'storeName') {
                    options[i] = options[i].replace(/\W/g, '_');
                }

                if (i === 'version' && typeof options[i] !== 'number') {
                    return new Error('Database version must be a number.');
                }

                this._config[i] = options[i];
            }

            // after all config options are set and
            // the driver option is used, try setting it
            if ('driver' in options && options.driver) {
                return this.setDriver(this._config.driver);
            }

            return true;
        } else if (typeof options === 'string') {
            return this._config[options];
        } else {
            return this._config;
        }
    };

    // Used to define a custom driver, shared across all instances of
    // localForage.


    LocalForage.prototype.defineDriver = function defineDriver(driverObject, callback, errorCallback) {
        var promise = new Promise$1(function (resolve, reject) {
            try {
                var driverName = driverObject._driver;
                var complianceError = new Error('Custom driver not compliant; see ' + 'https://mozilla.github.io/localForage/#definedriver');

                // A driver name should be defined and not overlap with the
                // library-defined, default drivers.
                if (!driverObject._driver) {
                    reject(complianceError);
                    return;
                }

                var driverMethods = LibraryMethods.concat('_initStorage');
                for (var i = 0, len = driverMethods.length; i < len; i++) {
                    var driverMethodName = driverMethods[i];

                    // when the property is there,
                    // it should be a method even when optional
                    var isRequired = !includes(OptionalDriverMethods, driverMethodName);
                    if ((isRequired || driverObject[driverMethodName]) && typeof driverObject[driverMethodName] !== 'function') {
                        reject(complianceError);
                        return;
                    }
                }

                var configureMissingMethods = function configureMissingMethods() {
                    var methodNotImplementedFactory = function methodNotImplementedFactory(methodName) {
                        return function () {
                            var error = new Error('Method ' + methodName + ' is not implemented by the current driver');
                            var promise = Promise$1.reject(error);
                            executeCallback(promise, arguments[arguments.length - 1]);
                            return promise;
                        };
                    };

                    for (var _i = 0, _len = OptionalDriverMethods.length; _i < _len; _i++) {
                        var optionalDriverMethod = OptionalDriverMethods[_i];
                        if (!driverObject[optionalDriverMethod]) {
                            driverObject[optionalDriverMethod] = methodNotImplementedFactory(optionalDriverMethod);
                        }
                    }
                };

                configureMissingMethods();

                var setDriverSupport = function setDriverSupport(support) {
                    if (DefinedDrivers[driverName]) {
                        console.info('Redefining LocalForage driver: ' + driverName);
                    }
                    DefinedDrivers[driverName] = driverObject;
                    DriverSupport[driverName] = support;
                    // don't use a then, so that we can define
                    // drivers that have simple _support methods
                    // in a blocking manner
                    resolve();
                };

                if ('_support' in driverObject) {
                    if (driverObject._support && typeof driverObject._support === 'function') {
                        driverObject._support().then(setDriverSupport, reject);
                    } else {
                        setDriverSupport(!!driverObject._support);
                    }
                } else {
                    setDriverSupport(true);
                }
            } catch (e) {
                reject(e);
            }
        });

        executeTwoCallbacks(promise, callback, errorCallback);
        return promise;
    };

    LocalForage.prototype.driver = function driver() {
        return this._driver || null;
    };

    LocalForage.prototype.getDriver = function getDriver(driverName, callback, errorCallback) {
        var getDriverPromise = DefinedDrivers[driverName] ? Promise$1.resolve(DefinedDrivers[driverName]) : Promise$1.reject(new Error('Driver not found.'));

        executeTwoCallbacks(getDriverPromise, callback, errorCallback);
        return getDriverPromise;
    };

    LocalForage.prototype.getSerializer = function getSerializer(callback) {
        var serializerPromise = Promise$1.resolve(localforageSerializer);
        executeTwoCallbacks(serializerPromise, callback);
        return serializerPromise;
    };

    LocalForage.prototype.ready = function ready(callback) {
        var self = this;

        var promise = self._driverSet.then(function () {
            if (self._ready === null) {
                self._ready = self._initDriver();
            }

            return self._ready;
        });

        executeTwoCallbacks(promise, callback, callback);
        return promise;
    };

    LocalForage.prototype.setDriver = function setDriver(drivers, callback, errorCallback) {
        var self = this;

        if (!isArray(drivers)) {
            drivers = [drivers];
        }

        var supportedDrivers = this._getSupportedDrivers(drivers);

        function setDriverToConfig() {
            self._config.driver = self.driver();
        }

        function extendSelfWithDriver(driver) {
            self._extend(driver);
            setDriverToConfig();

            self._ready = self._initStorage(self._config);
            return self._ready;
        }

        function initDriver(supportedDrivers) {
            return function () {
                var currentDriverIndex = 0;

                function driverPromiseLoop() {
                    while (currentDriverIndex < supportedDrivers.length) {
                        var driverName = supportedDrivers[currentDriverIndex];
                        currentDriverIndex++;

                        self._dbInfo = null;
                        self._ready = null;

                        return self.getDriver(driverName).then(extendSelfWithDriver)["catch"](driverPromiseLoop);
                    }

                    setDriverToConfig();
                    var error = new Error('No available storage method found.');
                    self._driverSet = Promise$1.reject(error);
                    return self._driverSet;
                }

                return driverPromiseLoop();
            };
        }

        // There might be a driver initialization in progress
        // so wait for it to finish in order to avoid a possible
        // race condition to set _dbInfo
        var oldDriverSetDone = this._driverSet !== null ? this._driverSet["catch"](function () {
            return Promise$1.resolve();
        }) : Promise$1.resolve();

        this._driverSet = oldDriverSetDone.then(function () {
            var driverName = supportedDrivers[0];
            self._dbInfo = null;
            self._ready = null;

            return self.getDriver(driverName).then(function (driver) {
                self._driver = driver._driver;
                setDriverToConfig();
                self._wrapLibraryMethodsWithReady();
                self._initDriver = initDriver(supportedDrivers);
            });
        })["catch"](function () {
            setDriverToConfig();
            var error = new Error('No available storage method found.');
            self._driverSet = Promise$1.reject(error);
            return self._driverSet;
        });

        executeTwoCallbacks(this._driverSet, callback, errorCallback);
        return this._driverSet;
    };

    LocalForage.prototype.supports = function supports(driverName) {
        return !!DriverSupport[driverName];
    };

    LocalForage.prototype._extend = function _extend(libraryMethodsAndProperties) {
        extend(this, libraryMethodsAndProperties);
    };

    LocalForage.prototype._getSupportedDrivers = function _getSupportedDrivers(drivers) {
        var supportedDrivers = [];
        for (var i = 0, len = drivers.length; i < len; i++) {
            var driverName = drivers[i];
            if (this.supports(driverName)) {
                supportedDrivers.push(driverName);
            }
        }
        return supportedDrivers;
    };

    LocalForage.prototype._wrapLibraryMethodsWithReady = function _wrapLibraryMethodsWithReady() {
        // Add a stub for each driver API method that delays the call to the
        // corresponding driver method until localForage is ready. These stubs
        // will be replaced by the driver methods as soon as the driver is
        // loaded, so there is no performance impact.
        for (var i = 0, len = LibraryMethods.length; i < len; i++) {
            callWhenReady(this, LibraryMethods[i]);
        }
    };

    LocalForage.prototype.createInstance = function createInstance(options) {
        return new LocalForage(options);
    };

    return LocalForage;
}();

// The actual localForage object that we expose as a module or via a
// global. It's extended by pulling in one of our other libraries.


var localforage_js = new LocalForage();

module.exports = localforage_js;

},{"3":3}]},{},[4])(4)
});


/***/ }),

/***/ "../node_modules/md5/md5.js":
/*!**********************************!*\
  !*** ../node_modules/md5/md5.js ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

(function(){
  var crypt = __webpack_require__(/*! crypt */ "../node_modules/crypt/crypt.js"),
      utf8 = __webpack_require__(/*! charenc */ "../node_modules/charenc/charenc.js").utf8,
      isBuffer = __webpack_require__(/*! is-buffer */ "../node_modules/is-buffer/index.js"),
      bin = __webpack_require__(/*! charenc */ "../node_modules/charenc/charenc.js").bin,

  // The core
  md5 = function (message, options) {
    // Convert to byte array
    if (message.constructor == String)
      if (options && options.encoding === 'binary')
        message = bin.stringToBytes(message);
      else
        message = utf8.stringToBytes(message);
    else if (isBuffer(message))
      message = Array.prototype.slice.call(message, 0);
    else if (!Array.isArray(message) && message.constructor !== Uint8Array)
      message = message.toString();
    // else, assume byte array already

    var m = crypt.bytesToWords(message),
        l = message.length * 8,
        a =  1732584193,
        b = -271733879,
        c = -1732584194,
        d =  271733878;

    // Swap endian
    for (var i = 0; i < m.length; i++) {
      m[i] = ((m[i] <<  8) | (m[i] >>> 24)) & 0x00FF00FF |
             ((m[i] << 24) | (m[i] >>>  8)) & 0xFF00FF00;
    }

    // Padding
    m[l >>> 5] |= 0x80 << (l % 32);
    m[(((l + 64) >>> 9) << 4) + 14] = l;

    // Method shortcuts
    var FF = md5._ff,
        GG = md5._gg,
        HH = md5._hh,
        II = md5._ii;

    for (var i = 0; i < m.length; i += 16) {

      var aa = a,
          bb = b,
          cc = c,
          dd = d;

      a = FF(a, b, c, d, m[i+ 0],  7, -680876936);
      d = FF(d, a, b, c, m[i+ 1], 12, -389564586);
      c = FF(c, d, a, b, m[i+ 2], 17,  606105819);
      b = FF(b, c, d, a, m[i+ 3], 22, -1044525330);
      a = FF(a, b, c, d, m[i+ 4],  7, -176418897);
      d = FF(d, a, b, c, m[i+ 5], 12,  1200080426);
      c = FF(c, d, a, b, m[i+ 6], 17, -1473231341);
      b = FF(b, c, d, a, m[i+ 7], 22, -45705983);
      a = FF(a, b, c, d, m[i+ 8],  7,  1770035416);
      d = FF(d, a, b, c, m[i+ 9], 12, -1958414417);
      c = FF(c, d, a, b, m[i+10], 17, -42063);
      b = FF(b, c, d, a, m[i+11], 22, -1990404162);
      a = FF(a, b, c, d, m[i+12],  7,  1804603682);
      d = FF(d, a, b, c, m[i+13], 12, -40341101);
      c = FF(c, d, a, b, m[i+14], 17, -1502002290);
      b = FF(b, c, d, a, m[i+15], 22,  1236535329);

      a = GG(a, b, c, d, m[i+ 1],  5, -165796510);
      d = GG(d, a, b, c, m[i+ 6],  9, -1069501632);
      c = GG(c, d, a, b, m[i+11], 14,  643717713);
      b = GG(b, c, d, a, m[i+ 0], 20, -373897302);
      a = GG(a, b, c, d, m[i+ 5],  5, -701558691);
      d = GG(d, a, b, c, m[i+10],  9,  38016083);
      c = GG(c, d, a, b, m[i+15], 14, -660478335);
      b = GG(b, c, d, a, m[i+ 4], 20, -405537848);
      a = GG(a, b, c, d, m[i+ 9],  5,  568446438);
      d = GG(d, a, b, c, m[i+14],  9, -1019803690);
      c = GG(c, d, a, b, m[i+ 3], 14, -187363961);
      b = GG(b, c, d, a, m[i+ 8], 20,  1163531501);
      a = GG(a, b, c, d, m[i+13],  5, -1444681467);
      d = GG(d, a, b, c, m[i+ 2],  9, -51403784);
      c = GG(c, d, a, b, m[i+ 7], 14,  1735328473);
      b = GG(b, c, d, a, m[i+12], 20, -1926607734);

      a = HH(a, b, c, d, m[i+ 5],  4, -378558);
      d = HH(d, a, b, c, m[i+ 8], 11, -2022574463);
      c = HH(c, d, a, b, m[i+11], 16,  1839030562);
      b = HH(b, c, d, a, m[i+14], 23, -35309556);
      a = HH(a, b, c, d, m[i+ 1],  4, -1530992060);
      d = HH(d, a, b, c, m[i+ 4], 11,  1272893353);
      c = HH(c, d, a, b, m[i+ 7], 16, -155497632);
      b = HH(b, c, d, a, m[i+10], 23, -1094730640);
      a = HH(a, b, c, d, m[i+13],  4,  681279174);
      d = HH(d, a, b, c, m[i+ 0], 11, -358537222);
      c = HH(c, d, a, b, m[i+ 3], 16, -722521979);
      b = HH(b, c, d, a, m[i+ 6], 23,  76029189);
      a = HH(a, b, c, d, m[i+ 9],  4, -640364487);
      d = HH(d, a, b, c, m[i+12], 11, -421815835);
      c = HH(c, d, a, b, m[i+15], 16,  530742520);
      b = HH(b, c, d, a, m[i+ 2], 23, -995338651);

      a = II(a, b, c, d, m[i+ 0],  6, -198630844);
      d = II(d, a, b, c, m[i+ 7], 10,  1126891415);
      c = II(c, d, a, b, m[i+14], 15, -1416354905);
      b = II(b, c, d, a, m[i+ 5], 21, -57434055);
      a = II(a, b, c, d, m[i+12],  6,  1700485571);
      d = II(d, a, b, c, m[i+ 3], 10, -1894986606);
      c = II(c, d, a, b, m[i+10], 15, -1051523);
      b = II(b, c, d, a, m[i+ 1], 21, -2054922799);
      a = II(a, b, c, d, m[i+ 8],  6,  1873313359);
      d = II(d, a, b, c, m[i+15], 10, -30611744);
      c = II(c, d, a, b, m[i+ 6], 15, -1560198380);
      b = II(b, c, d, a, m[i+13], 21,  1309151649);
      a = II(a, b, c, d, m[i+ 4],  6, -145523070);
      d = II(d, a, b, c, m[i+11], 10, -1120210379);
      c = II(c, d, a, b, m[i+ 2], 15,  718787259);
      b = II(b, c, d, a, m[i+ 9], 21, -343485551);

      a = (a + aa) >>> 0;
      b = (b + bb) >>> 0;
      c = (c + cc) >>> 0;
      d = (d + dd) >>> 0;
    }

    return crypt.endian([a, b, c, d]);
  };

  // Auxiliary functions
  md5._ff  = function (a, b, c, d, x, s, t) {
    var n = a + (b & c | ~b & d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._gg  = function (a, b, c, d, x, s, t) {
    var n = a + (b & d | c & ~d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._hh  = function (a, b, c, d, x, s, t) {
    var n = a + (b ^ c ^ d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._ii  = function (a, b, c, d, x, s, t) {
    var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };

  // Package private blocksize
  md5._blocksize = 16;
  md5._digestsize = 16;

  module.exports = function (message, options) {
    if (message === undefined || message === null)
      throw new Error('Illegal argument ' + message);

    var digestbytes = crypt.wordsToBytes(md5(message, options));
    return options && options.asBytes ? digestbytes :
        options && options.asString ? bin.bytesToString(digestbytes) :
        crypt.bytesToHex(digestbytes);
  };

})();


/***/ }),

/***/ "../node_modules/ms/index.js":
/*!***********************************!*\
  !*** ../node_modules/ms/index.js ***!
  \***********************************/
/***/ ((module) => {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}


/***/ }),

/***/ "../node_modules/nanoid/index.dev.js":
/*!*******************************************!*\
  !*** ../node_modules/nanoid/index.dev.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "nanoid": () => (/* binding */ nanoid),
/* harmony export */   "customAlphabet": () => (/* binding */ customAlphabet),
/* harmony export */   "customRandom": () => (/* binding */ customRandom),
/* harmony export */   "urlAlphabet": () => (/* reexport safe */ _url_alphabet_index_js__WEBPACK_IMPORTED_MODULE_0__.urlAlphabet),
/* harmony export */   "random": () => (/* binding */ random)
/* harmony export */ });
/* harmony import */ var _url_alphabet_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./url-alphabet/index.js */ "../node_modules/nanoid/url-alphabet/index.js");
// This file replaces `index.js` in bundlers like webpack or Rollup,
// according to `browser` config in `package.json`.



if (true) {
  // All bundlers will remove this block in the production bundle.
  if (
    typeof navigator !== 'undefined' &&
    navigator.product === 'ReactNative' &&
    typeof crypto === 'undefined'
  ) {
    throw new Error(
      'React Native does not have a built-in secure random generator. ' +
        'If you don’t need unpredictable IDs use `nanoid/non-secure`. ' +
        'For secure IDs, import `react-native-get-random-values` ' +
        'before Nano ID.'
    )
  }
  if (typeof msCrypto !== 'undefined' && typeof crypto === 'undefined') {
    throw new Error(
      'Import file with `if (!window.crypto) window.crypto = window.msCrypto`' +
        ' before importing Nano ID to fix IE 11 support'
    )
  }
  if (typeof crypto === 'undefined') {
    throw new Error(
      'Your browser does not have secure random generator. ' +
        'If you don’t need unpredictable IDs, you can use nanoid/non-secure.'
    )
  }
}

let random = bytes => crypto.getRandomValues(new Uint8Array(bytes))

let customRandom = (alphabet, size, getRandom) => {
  // First, a bitmask is necessary to generate the ID. The bitmask makes bytes
  // values closer to the alphabet size. The bitmask calculates the closest
  // `2^31 - 1` number, which exceeds the alphabet size.
  // For example, the bitmask for the alphabet size 30 is 31 (00011111).
  // `Math.clz32` is not used, because it is not available in browsers.
  let mask = (2 << (Math.log(alphabet.length - 1) / Math.LN2)) - 1
  // Though, the bitmask solution is not perfect since the bytes exceeding
  // the alphabet size are refused. Therefore, to reliably generate the ID,
  // the random bytes redundancy has to be satisfied.

  // Note: every hardware random generator call is performance expensive,
  // because the system call for entropy collection takes a lot of time.
  // So, to avoid additional system calls, extra bytes are requested in advance.

  // Next, a step determines how many random bytes to generate.
  // The number of random bytes gets decided upon the ID size, mask,
  // alphabet size, and magic number 1.6 (using 1.6 peaks at performance
  // according to benchmarks).

  // `-~f => Math.ceil(f)` if f is a float
  // `-~i => i + 1` if i is an integer
  let step = -~((1.6 * mask * size) / alphabet.length)

  return () => {
    let id = ''
    while (true) {
      let bytes = getRandom(step)
      // A compact alternative for `for (var i = 0; i < step; i++)`.
      let j = step
      while (j--) {
        // Adding `|| ''` refuses a random byte that exceeds the alphabet size.
        id += alphabet[bytes[j] & mask] || ''
        if (id.length === size) return id
      }
    }
  }
}

let customAlphabet = (alphabet, size) => customRandom(alphabet, size, random)

let nanoid = (size = 21) => {
  let id = ''
  let bytes = crypto.getRandomValues(new Uint8Array(size))

  // A compact alternative for `for (var i = 0; i < step; i++)`.
  while (size--) {
    // It is incorrect to use bytes exceeding the alphabet size.
    // The following mask reduces the random byte in the 0-255 value
    // range to the 0-63 value range. Therefore, adding hacks, such
    // as empty string fallback or magic numbers, is unneccessary because
    // the bitmask trims bytes down to the alphabet size.
    let byte = bytes[size] & 63
    if (byte < 36) {
      // `0-9a-z`
      id += byte.toString(36)
    } else if (byte < 62) {
      // `A-Z`
      id += (byte - 26).toString(36).toUpperCase()
    } else if (byte < 63) {
      id += '_'
    } else {
      id += '-'
    }
  }
  return id
}




/***/ }),

/***/ "../node_modules/nanoid/url-alphabet/index.js":
/*!****************************************************!*\
  !*** ../node_modules/nanoid/url-alphabet/index.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "urlAlphabet": () => (/* binding */ urlAlphabet)
/* harmony export */ });
// This alphabet uses `A-Za-z0-9_-` symbols. The genetic algorithm helped
// optimize the gzip compression for this alphabet.
let urlAlphabet =
  'ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW'




/***/ }),

/***/ "../node_modules/sift/es5m/index.js":
/*!******************************************!*\
  !*** ../node_modules/sift/es5m/index.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "$Size": () => (/* binding */ $Size),
/* harmony export */   "$all": () => (/* binding */ $all),
/* harmony export */   "$and": () => (/* binding */ $and),
/* harmony export */   "$elemMatch": () => (/* binding */ $elemMatch),
/* harmony export */   "$eq": () => (/* binding */ $eq),
/* harmony export */   "$exists": () => (/* binding */ $exists),
/* harmony export */   "$gt": () => (/* binding */ $gt),
/* harmony export */   "$gte": () => (/* binding */ $gte),
/* harmony export */   "$in": () => (/* binding */ $in),
/* harmony export */   "$lt": () => (/* binding */ $lt),
/* harmony export */   "$lte": () => (/* binding */ $lte),
/* harmony export */   "$mod": () => (/* binding */ $mod),
/* harmony export */   "$ne": () => (/* binding */ $ne),
/* harmony export */   "$nin": () => (/* binding */ $nin),
/* harmony export */   "$nor": () => (/* binding */ $nor),
/* harmony export */   "$not": () => (/* binding */ $not),
/* harmony export */   "$options": () => (/* binding */ $options),
/* harmony export */   "$or": () => (/* binding */ $or),
/* harmony export */   "$regex": () => (/* binding */ $regex),
/* harmony export */   "$size": () => (/* binding */ $size),
/* harmony export */   "$type": () => (/* binding */ $type),
/* harmony export */   "$where": () => (/* binding */ $where),
/* harmony export */   "EqualsOperation": () => (/* binding */ EqualsOperation),
/* harmony export */   "createDefaultQueryOperation": () => (/* binding */ createDefaultQueryOperation),
/* harmony export */   "createEqualsOperation": () => (/* binding */ createEqualsOperation),
/* harmony export */   "createOperationTester": () => (/* binding */ createOperationTester),
/* harmony export */   "createQueryOperation": () => (/* binding */ createQueryOperation),
/* harmony export */   "createQueryTester": () => (/* binding */ createQueryTester)
/* harmony export */ });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var typeChecker = function (type) {
    var typeString = "[object " + type + "]";
    return function (value) {
        return getClassName(value) === typeString;
    };
};
var getClassName = function (value) { return Object.prototype.toString.call(value); };
var comparable = function (value) {
    if (value instanceof Date) {
        return value.getTime();
    }
    else if (isArray(value)) {
        return value.map(comparable);
    }
    else if (value && typeof value.toJSON === "function") {
        return value.toJSON();
    }
    return value;
};
var isArray = typeChecker("Array");
var isObject = typeChecker("Object");
var isFunction = typeChecker("Function");
var isVanillaObject = function (value) {
    return (value &&
        (value.constructor === Object ||
            value.constructor === Array ||
            value.constructor.toString() === "function Object() { [native code] }" ||
            value.constructor.toString() === "function Array() { [native code] }") &&
        !value.toJSON);
};
var equals = function (a, b) {
    if (a == null && a == b) {
        return true;
    }
    if (a === b) {
        return true;
    }
    if (Object.prototype.toString.call(a) !== Object.prototype.toString.call(b)) {
        return false;
    }
    if (isArray(a)) {
        if (a.length !== b.length) {
            return false;
        }
        for (var i = 0, length_1 = a.length; i < length_1; i++) {
            if (!equals(a[i], b[i]))
                return false;
        }
        return true;
    }
    else if (isObject(a)) {
        if (Object.keys(a).length !== Object.keys(b).length) {
            return false;
        }
        for (var key in a) {
            if (!equals(a[key], b[key]))
                return false;
        }
        return true;
    }
    return false;
};

/**
 * Walks through each value given the context - used for nested operations. E.g:
 * { "person.address": { $eq: "blarg" }}
 */
var walkKeyPathValues = function (item, keyPath, next, depth, key, owner) {
    var currentKey = keyPath[depth];
    // if array, then try matching. Might fall through for cases like:
    // { $eq: [1, 2, 3] }, [ 1, 2, 3 ].
    if (isArray(item) && isNaN(Number(currentKey))) {
        for (var i = 0, length_1 = item.length; i < length_1; i++) {
            // if FALSE is returned, then terminate walker. For operations, this simply
            // means that the search critera was met.
            if (!walkKeyPathValues(item[i], keyPath, next, depth, i, item)) {
                return false;
            }
        }
    }
    if (depth === keyPath.length || item == null) {
        return next(item, key, owner);
    }
    return walkKeyPathValues(item[currentKey], keyPath, next, depth + 1, currentKey, item);
};
var BaseOperation = /** @class */ (function () {
    function BaseOperation(params, owneryQuery, options) {
        this.params = params;
        this.owneryQuery = owneryQuery;
        this.options = options;
        this.init();
    }
    BaseOperation.prototype.init = function () { };
    BaseOperation.prototype.reset = function () {
        this.done = false;
        this.keep = false;
    };
    return BaseOperation;
}());
var NamedBaseOperation = /** @class */ (function (_super) {
    __extends(NamedBaseOperation, _super);
    function NamedBaseOperation(params, owneryQuery, options, name) {
        var _this = _super.call(this, params, owneryQuery, options) || this;
        _this.name = name;
        return _this;
    }
    return NamedBaseOperation;
}(BaseOperation));
var GroupOperation = /** @class */ (function (_super) {
    __extends(GroupOperation, _super);
    function GroupOperation(params, owneryQuery, options, children) {
        var _this = _super.call(this, params, owneryQuery, options) || this;
        _this.children = children;
        return _this;
    }
    /**
     */
    GroupOperation.prototype.reset = function () {
        this.keep = false;
        this.done = false;
        for (var i = 0, length_2 = this.children.length; i < length_2; i++) {
            this.children[i].reset();
        }
    };
    /**
     */
    GroupOperation.prototype.childrenNext = function (item, key, owner) {
        var done = true;
        var keep = true;
        for (var i = 0, length_3 = this.children.length; i < length_3; i++) {
            var childOperation = this.children[i];
            childOperation.next(item, key, owner);
            if (!childOperation.keep) {
                keep = false;
            }
            if (childOperation.done) {
                if (!childOperation.keep) {
                    break;
                }
            }
            else {
                done = false;
            }
        }
        this.done = done;
        this.keep = keep;
    };
    return GroupOperation;
}(BaseOperation));
var NamedGroupOperation = /** @class */ (function (_super) {
    __extends(NamedGroupOperation, _super);
    function NamedGroupOperation(params, owneryQuery, options, children, name) {
        var _this = _super.call(this, params, owneryQuery, options, children) || this;
        _this.name = name;
        return _this;
    }
    return NamedGroupOperation;
}(GroupOperation));
var QueryOperation = /** @class */ (function (_super) {
    __extends(QueryOperation, _super);
    function QueryOperation() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.propop = true;
        return _this;
    }
    /**
     */
    QueryOperation.prototype.next = function (item, key, parent) {
        this.childrenNext(item, key, parent);
    };
    return QueryOperation;
}(GroupOperation));
var NestedOperation = /** @class */ (function (_super) {
    __extends(NestedOperation, _super);
    function NestedOperation(keyPath, params, owneryQuery, options, children) {
        var _this = _super.call(this, params, owneryQuery, options, children) || this;
        _this.keyPath = keyPath;
        _this.propop = true;
        /**
         */
        _this._nextNestedValue = function (value, key, owner) {
            _this.childrenNext(value, key, owner);
            return !_this.done;
        };
        return _this;
    }
    /**
     */
    NestedOperation.prototype.next = function (item, key, parent) {
        walkKeyPathValues(item, this.keyPath, this._nextNestedValue, 0, key, parent);
    };
    return NestedOperation;
}(GroupOperation));
var createTester = function (a, compare) {
    if (a instanceof Function) {
        return a;
    }
    if (a instanceof RegExp) {
        return function (b) {
            var result = typeof b === "string" && a.test(b);
            a.lastIndex = 0;
            return result;
        };
    }
    var comparableA = comparable(a);
    return function (b) { return compare(comparableA, comparable(b)); };
};
var EqualsOperation = /** @class */ (function (_super) {
    __extends(EqualsOperation, _super);
    function EqualsOperation() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.propop = true;
        return _this;
    }
    EqualsOperation.prototype.init = function () {
        this._test = createTester(this.params, this.options.compare);
    };
    EqualsOperation.prototype.next = function (item, key, parent) {
        if (!Array.isArray(parent) || parent.hasOwnProperty(key)) {
            if (this._test(item, key, parent)) {
                this.done = true;
                this.keep = true;
            }
        }
    };
    return EqualsOperation;
}(BaseOperation));
var createEqualsOperation = function (params, owneryQuery, options) { return new EqualsOperation(params, owneryQuery, options); };
var NopeOperation = /** @class */ (function (_super) {
    __extends(NopeOperation, _super);
    function NopeOperation() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.propop = true;
        return _this;
    }
    NopeOperation.prototype.next = function () {
        this.done = true;
        this.keep = false;
    };
    return NopeOperation;
}(BaseOperation));
var numericalOperationCreator = function (createNumericalOperation) { return function (params, owneryQuery, options, name) {
    if (params == null) {
        return new NopeOperation(params, owneryQuery, options);
    }
    return createNumericalOperation(params, owneryQuery, options, name);
}; };
var numericalOperation = function (createTester) {
    return numericalOperationCreator(function (params, owneryQuery, options) {
        var typeofParams = typeof comparable(params);
        var test = createTester(params);
        return new EqualsOperation(function (b) {
            return typeof comparable(b) === typeofParams && test(b);
        }, owneryQuery, options);
    });
};
var createNamedOperation = function (name, params, parentQuery, options) {
    var operationCreator = options.operations[name];
    if (!operationCreator) {
        throw new Error("Unsupported operation: " + name);
    }
    return operationCreator(params, parentQuery, options, name);
};
var containsOperation = function (query, options) {
    for (var key in query) {
        if (options.operations.hasOwnProperty(key))
            return true;
    }
    return false;
};
var createNestedOperation = function (keyPath, nestedQuery, parentKey, owneryQuery, options) {
    if (containsOperation(nestedQuery, options)) {
        var _a = createQueryOperations(nestedQuery, parentKey, options), selfOperations = _a[0], nestedOperations = _a[1];
        if (nestedOperations.length) {
            throw new Error("Property queries must contain only operations, or exact objects.");
        }
        return new NestedOperation(keyPath, nestedQuery, owneryQuery, options, selfOperations);
    }
    return new NestedOperation(keyPath, nestedQuery, owneryQuery, options, [
        new EqualsOperation(nestedQuery, owneryQuery, options)
    ]);
};
var createQueryOperation = function (query, owneryQuery, _a) {
    if (owneryQuery === void 0) { owneryQuery = null; }
    var _b = _a === void 0 ? {} : _a, compare = _b.compare, operations = _b.operations;
    var options = {
        compare: compare || equals,
        operations: Object.assign({}, operations || {})
    };
    var _c = createQueryOperations(query, null, options), selfOperations = _c[0], nestedOperations = _c[1];
    var ops = [];
    if (selfOperations.length) {
        ops.push(new NestedOperation([], query, owneryQuery, options, selfOperations));
    }
    ops.push.apply(ops, nestedOperations);
    if (ops.length === 1) {
        return ops[0];
    }
    return new QueryOperation(query, owneryQuery, options, ops);
};
var createQueryOperations = function (query, parentKey, options) {
    var selfOperations = [];
    var nestedOperations = [];
    if (!isVanillaObject(query)) {
        selfOperations.push(new EqualsOperation(query, query, options));
        return [selfOperations, nestedOperations];
    }
    for (var key in query) {
        if (options.operations.hasOwnProperty(key)) {
            var op = createNamedOperation(key, query[key], query, options);
            if (op) {
                if (!op.propop && parentKey && !options.operations[parentKey]) {
                    throw new Error("Malformed query. " + key + " cannot be matched against property.");
                }
            }
            // probably just a flag for another operation (like $options)
            if (op != null) {
                selfOperations.push(op);
            }
        }
        else {
            nestedOperations.push(createNestedOperation(key.split("."), query[key], key, query, options));
        }
    }
    return [selfOperations, nestedOperations];
};
var createOperationTester = function (operation) { return function (item, key, owner) {
    operation.reset();
    operation.next(item, key, owner);
    return operation.keep;
}; };
var createQueryTester = function (query, options) {
    if (options === void 0) { options = {}; }
    return createOperationTester(createQueryOperation(query, null, options));
};

var $Ne = /** @class */ (function (_super) {
    __extends($Ne, _super);
    function $Ne() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.propop = true;
        return _this;
    }
    $Ne.prototype.init = function () {
        this._test = createTester(this.params, this.options.compare);
    };
    $Ne.prototype.reset = function () {
        _super.prototype.reset.call(this);
        this.keep = true;
    };
    $Ne.prototype.next = function (item) {
        if (this._test(item)) {
            this.done = true;
            this.keep = false;
        }
    };
    return $Ne;
}(NamedBaseOperation));
// https://docs.mongodb.com/manual/reference/operator/query/elemMatch/
var $ElemMatch = /** @class */ (function (_super) {
    __extends($ElemMatch, _super);
    function $ElemMatch() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.propop = true;
        return _this;
    }
    $ElemMatch.prototype.init = function () {
        if (!this.params || typeof this.params !== "object") {
            throw new Error("Malformed query. $elemMatch must by an object.");
        }
        this._queryOperation = createQueryOperation(this.params, this.owneryQuery, this.options);
    };
    $ElemMatch.prototype.reset = function () {
        _super.prototype.reset.call(this);
        this._queryOperation.reset();
    };
    $ElemMatch.prototype.next = function (item) {
        if (isArray(item)) {
            for (var i = 0, length_1 = item.length; i < length_1; i++) {
                // reset query operation since item being tested needs to pass _all_ query
                // operations for it to be a success
                this._queryOperation.reset();
                var child = item[i];
                this._queryOperation.next(child, i, item);
                this.keep = this.keep || this._queryOperation.keep;
            }
            this.done = true;
        }
        else {
            this.done = false;
            this.keep = false;
        }
    };
    return $ElemMatch;
}(NamedBaseOperation));
var $Not = /** @class */ (function (_super) {
    __extends($Not, _super);
    function $Not() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.propop = true;
        return _this;
    }
    $Not.prototype.init = function () {
        this._queryOperation = createQueryOperation(this.params, this.owneryQuery, this.options);
    };
    $Not.prototype.reset = function () {
        this._queryOperation.reset();
    };
    $Not.prototype.next = function (item, key, owner) {
        this._queryOperation.next(item, key, owner);
        this.done = this._queryOperation.done;
        this.keep = !this._queryOperation.keep;
    };
    return $Not;
}(NamedBaseOperation));
var $Size = /** @class */ (function (_super) {
    __extends($Size, _super);
    function $Size() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.propop = true;
        return _this;
    }
    $Size.prototype.init = function () { };
    $Size.prototype.next = function (item) {
        if (isArray(item) && item.length === this.params) {
            this.done = true;
            this.keep = true;
        }
        // if (parent && parent.length === this.params) {
        //   this.done = true;
        //   this.keep = true;
        // }
    };
    return $Size;
}(NamedBaseOperation));
var $Or = /** @class */ (function (_super) {
    __extends($Or, _super);
    function $Or() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.propop = false;
        return _this;
    }
    $Or.prototype.init = function () {
        var _this = this;
        this._ops = this.params.map(function (op) {
            return createQueryOperation(op, null, _this.options);
        });
    };
    $Or.prototype.reset = function () {
        this.done = false;
        this.keep = false;
        for (var i = 0, length_2 = this._ops.length; i < length_2; i++) {
            this._ops[i].reset();
        }
    };
    $Or.prototype.next = function (item, key, owner) {
        var done = false;
        var success = false;
        for (var i = 0, length_3 = this._ops.length; i < length_3; i++) {
            var op = this._ops[i];
            op.next(item, key, owner);
            if (op.keep) {
                done = true;
                success = op.keep;
                break;
            }
        }
        this.keep = success;
        this.done = done;
    };
    return $Or;
}(NamedBaseOperation));
var $Nor = /** @class */ (function (_super) {
    __extends($Nor, _super);
    function $Nor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.propop = false;
        return _this;
    }
    $Nor.prototype.next = function (item, key, owner) {
        _super.prototype.next.call(this, item, key, owner);
        this.keep = !this.keep;
    };
    return $Nor;
}($Or));
var $In = /** @class */ (function (_super) {
    __extends($In, _super);
    function $In() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.propop = true;
        return _this;
    }
    $In.prototype.init = function () {
        var _this = this;
        this._testers = this.params.map(function (value) {
            if (containsOperation(value, _this.options)) {
                throw new Error("cannot nest $ under " + _this.constructor.name.toLowerCase());
            }
            return createTester(value, _this.options.compare);
        });
    };
    $In.prototype.next = function (item, key, owner) {
        var done = false;
        var success = false;
        for (var i = 0, length_4 = this._testers.length; i < length_4; i++) {
            var test = this._testers[i];
            if (test(item)) {
                done = true;
                success = true;
                break;
            }
        }
        this.keep = success;
        this.done = done;
    };
    return $In;
}(NamedBaseOperation));
var $Nin = /** @class */ (function (_super) {
    __extends($Nin, _super);
    function $Nin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.propop = true;
        return _this;
    }
    $Nin.prototype.next = function (item, key, owner) {
        _super.prototype.next.call(this, item, key, owner);
        this.keep = !this.keep;
    };
    return $Nin;
}($In));
var $Exists = /** @class */ (function (_super) {
    __extends($Exists, _super);
    function $Exists() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.propop = true;
        return _this;
    }
    $Exists.prototype.next = function (item, key, owner) {
        if (owner.hasOwnProperty(key) === this.params) {
            this.done = true;
            this.keep = true;
        }
    };
    return $Exists;
}(NamedBaseOperation));
var $And = /** @class */ (function (_super) {
    __extends($And, _super);
    function $And(params, owneryQuery, options, name) {
        var _this = _super.call(this, params, owneryQuery, options, params.map(function (query) { return createQueryOperation(query, owneryQuery, options); }), name) || this;
        _this.propop = false;
        return _this;
    }
    $And.prototype.next = function (item, key, owner) {
        this.childrenNext(item, key, owner);
    };
    return $And;
}(NamedGroupOperation));
var $All = /** @class */ (function (_super) {
    __extends($All, _super);
    function $All(params, owneryQuery, options, name) {
        var _this = _super.call(this, params, owneryQuery, options, params.map(function (query) { return createQueryOperation(query, owneryQuery, options); }), name) || this;
        _this.propop = true;
        return _this;
    }
    $All.prototype.next = function (item, key, owner) {
        this.childrenNext(item, key, owner);
    };
    return $All;
}(NamedGroupOperation));
var $eq = function (params, owneryQuery, options) {
    return new EqualsOperation(params, owneryQuery, options);
};
var $ne = function (params, owneryQuery, options, name) { return new $Ne(params, owneryQuery, options, name); };
var $or = function (params, owneryQuery, options, name) { return new $Or(params, owneryQuery, options, name); };
var $nor = function (params, owneryQuery, options, name) { return new $Nor(params, owneryQuery, options, name); };
var $elemMatch = function (params, owneryQuery, options, name) { return new $ElemMatch(params, owneryQuery, options, name); };
var $nin = function (params, owneryQuery, options, name) { return new $Nin(params, owneryQuery, options, name); };
var $in = function (params, owneryQuery, options, name) { return new $In(params, owneryQuery, options, name); };
var $lt = numericalOperation(function (params) { return function (b) { return b < params; }; });
var $lte = numericalOperation(function (params) { return function (b) { return b <= params; }; });
var $gt = numericalOperation(function (params) { return function (b) { return b > params; }; });
var $gte = numericalOperation(function (params) { return function (b) { return b >= params; }; });
var $mod = function (_a, owneryQuery, options) {
    var mod = _a[0], equalsValue = _a[1];
    return new EqualsOperation(function (b) { return comparable(b) % mod === equalsValue; }, owneryQuery, options);
};
var $exists = function (params, owneryQuery, options, name) { return new $Exists(params, owneryQuery, options, name); };
var $regex = function (pattern, owneryQuery, options) {
    return new EqualsOperation(new RegExp(pattern, owneryQuery.$options), owneryQuery, options);
};
var $not = function (params, owneryQuery, options, name) { return new $Not(params, owneryQuery, options, name); };
var typeAliases = {
    number: function (v) { return typeof v === "number"; },
    string: function (v) { return typeof v === "string"; },
    bool: function (v) { return typeof v === "boolean"; },
    array: function (v) { return Array.isArray(v); },
    null: function (v) { return v === null; },
    timestamp: function (v) { return v instanceof Date; }
};
var $type = function (clazz, owneryQuery, options) {
    return new EqualsOperation(function (b) {
        if (typeof clazz === "string") {
            if (!typeAliases[clazz]) {
                throw new Error("Type alias does not exist");
            }
            return typeAliases[clazz](b);
        }
        return b != null ? b instanceof clazz || b.constructor === clazz : false;
    }, owneryQuery, options);
};
var $and = function (params, ownerQuery, options, name) { return new $And(params, ownerQuery, options, name); };
var $all = function (params, ownerQuery, options, name) { return new $All(params, ownerQuery, options, name); };
var $size = function (params, ownerQuery, options) { return new $Size(params, ownerQuery, options, "$size"); };
var $options = function () { return null; };
var $where = function (params, ownerQuery, options) {
    var test;
    if (isFunction(params)) {
        test = params;
    }
    else if (!process.env.CSP_ENABLED) {
        test = new Function("obj", "return " + params);
    }
    else {
        throw new Error("In CSP mode, sift does not support strings in \"$where\" condition");
    }
    return new EqualsOperation(function (b) { return test.bind(b)(b); }, ownerQuery, options);
};

var defaultOperations = /*#__PURE__*/Object.freeze({
    __proto__: null,
    $Size: $Size,
    $eq: $eq,
    $ne: $ne,
    $or: $or,
    $nor: $nor,
    $elemMatch: $elemMatch,
    $nin: $nin,
    $in: $in,
    $lt: $lt,
    $lte: $lte,
    $gt: $gt,
    $gte: $gte,
    $mod: $mod,
    $exists: $exists,
    $regex: $regex,
    $not: $not,
    $type: $type,
    $and: $and,
    $all: $all,
    $size: $size,
    $options: $options,
    $where: $where
});

var createDefaultQueryOperation = function (query, ownerQuery, _a) {
    var _b = _a === void 0 ? {} : _a, compare = _b.compare, operations = _b.operations;
    return createQueryOperation(query, ownerQuery, {
        compare: compare,
        operations: Object.assign({}, defaultOperations, operations || {})
    });
};
var createDefaultQueryTester = function (query, options) {
    if (options === void 0) { options = {}; }
    var op = createDefaultQueryOperation(query, null, options);
    return createOperationTester(op);
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createDefaultQueryTester);

//# sourceMappingURL=index.js.map


/***/ }),

/***/ "../localforage/lib/index.js":
/*!***********************************!*\
  !*** ../localforage/lib/index.js ***!
  \***********************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var _require = __webpack_require__(/*! @feathersjs/adapter-commons */ "../node_modules/@feathersjs/adapter-commons/lib/index.js"),
    sorter = _require.sorter,
    select = _require.select,
    AdapterService = _require.AdapterService;

var _require2 = __webpack_require__(/*! @feathersjs/commons */ "../node_modules/@feathersjs/commons/lib/index.js"),
    _ = _require2._;

var errors = __webpack_require__(/*! @feathersjs/errors */ "../node_modules/@feathersjs/errors/lib/index.js");

var LocalForage = __webpack_require__(/*! localforage */ "../node_modules/localforage/dist/localforage.js");

var sift = __webpack_require__(/*! sift */ "../node_modules/sift/es5m/index.js").default;

var stringsToDates = __webpack_require__(/*! ./strings-to-dates */ "../localforage/lib/strings-to-dates.js");

var debug = __webpack_require__(/*! debug */ "../node_modules/debug/src/browser.js")('@feathersjs-offline:feathers-localforage');

var usedKeys = [];

var _select = function _select(data) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var base = select.apply(void 0, args);
  return base(JSON.parse(JSON.stringify(data)));
}; // Create the service.


var Service = /*#__PURE__*/function (_AdapterService) {
  _inherits(Service, _AdapterService);

  var _super = _createSuper(Service);

  function Service() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Service);

    _this = _super.call(this, _.extend({
      id: 'id',
      matcher: sift,
      sorter: sorter
    }, options));
    _this.store = options.store || {};
    _this._dates = options.dates || false;

    _this.sanitizeParameters(options);

    debug("Constructor started:\n\t_storageType = ".concat(JSON.stringify(_this._storageType), "\n\t_version = ").concat(JSON.stringify(_this._version), "\n\t_storageKey = ").concat(JSON.stringify(_this._storageKey), "\n\t_storageSize = ").concat(JSON.stringify(_this._storageSize), "\n\t_reuseKeys = ").concat(JSON.stringify(_this._reuseKeys), "\n"));
    _this._storage = LocalForage.createInstance({
      driver: _this._storageType,
      name: 'feathersjs-offline',
      size: _this._storageSize,
      version: _this._version,
      storeName: _this._storageKey,
      description: 'Created by @feathersjs-offline/feathers-localforage'
    });

    _this.checkStoreName(); // Make a handy suffix primarily for debugging owndata/ownnet


    var self = _assertThisInitialized(_this);

    _this._debugSuffix = self._storageKey.includes('_local') ? '  LOCAL' : self._storageKey.includes('_queue') ? '  QUEUE' : '';

    _this.ready();

    return _this;
  }

  _createClass(Service, [{
    key: "sanitizeParameters",
    value: function sanitizeParameters(options) {
      this._storageKey = options.name || 'feathers';
      this._storageType = options.storage || [LocalForage.INDEXEDDB, LocalForage.WEBSQL, LocalForage.LOCALSTORAGE];
      this._version = options.version || 1.0; // Default DB size is _JUST UNDER_ 5MB, as it's the highest size we can use without a prompt.

      this._storageSize = options.storageSize || 4980736;
      this._reuseKeys = options.reuseKeys || false;
      this._id = options.startId || 0;
    }
  }, {
    key: "checkStoreName",
    value: function checkStoreName() {
      if (usedKeys.indexOf(this._storageKey) === -1) {
        usedKeys.push(this._storageKey);
      } else {
        if (!this._reuseKeys) {
          // Allow reuse if options.reuseKeys set to true
          throw new Error("The storage name '".concat(this._storageKey, "' is already in use by another instance."));
        }
      }
    }
  }, {
    key: "ready",
    value: function ready() {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var self, keys;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                self = this; // Now pre-load data (if any)

                keys = Object.keys(this.store);
                _context.next = 4;
                return Promise.all([keys.forEach(function (key) {
                  var id = self.store[key][self.id];
                  id = self.setMax(id);
                  return self.getModel().setItem(String(id), self.store[key]);
                })]);

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));
    }
  }, {
    key: "getModel",
    value: function getModel() {
      return this._storage;
    }
  }, {
    key: "getEntries",
    value: function getEntries() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var _this$filterQuery, query;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                debug("_getEntries(".concat(JSON.stringify(params), ")") + this._debugSuffix);
                _this$filterQuery = this.filterQuery(params), query = _this$filterQuery.query;
                return _context2.abrupt("return", this._find(Object.assign({}, params, {
                  paginate: false,
                  query: query
                })).then(select(params, this.id)).then(stringsToDates(this._dates)));

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));
    }
  }, {
    key: "setMax",
    value: function setMax(id) {
      var res = id;

      if (Number.isInteger(id)) {
        this._id = Math.max(Number.parseInt(id), this._id);
      }

      return id;
    }
  }, {
    key: "_find",
    value: function _find() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        var _this2 = this;

        var self, _self$filterQuery, query, filters, paginate, keys, asyncFilter, values, total, result;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                debug("_find(".concat(JSON.stringify(params), ")") + this._debugSuffix);
                self = this;
                _self$filterQuery = self.filterQuery(params), query = _self$filterQuery.query, filters = _self$filterQuery.filters, paginate = _self$filterQuery.paginate;
                _context5.next = 5;
                return self.getModel().keys();

              case 5:
                keys = _context5.sent;

                // An async equivalent of Array.filter()
                asyncFilter = function asyncFilter(arr, predicate) {
                  return __awaiter(_this2, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                    var results;
                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            _context3.next = 2;
                            return Promise.all(arr.map(predicate));

                          case 2:
                            results = _context3.sent;
                            return _context3.abrupt("return", arr.filter(function (_v, index) {
                              return results[index];
                            }));

                          case 4:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3);
                  }));
                }; // Determine relevant keys


                _context5.next = 9;
                return asyncFilter(keys, function (key) {
                  return __awaiter(_this2, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                    var item, match;
                    return regeneratorRuntime.wrap(function _callee4$(_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            _context4.next = 2;
                            return self.getModel().getItem(key);

                          case 2:
                            item = _context4.sent;
                            match = self.options.matcher(query)(item);
                            return _context4.abrupt("return", match);

                          case 5:
                          case "end":
                            return _context4.stop();
                        }
                      }
                    }, _callee4);
                  }));
                });

              case 9:
                keys = _context5.sent;
                _context5.next = 12;
                return Promise.all(keys.map(function (key) {
                  return self.getModel().getItem(key);
                }));

              case 12:
                values = _context5.sent;
                total = values.length; // Now we sort (if requested)

                if (filters.$sort !== undefined) {
                  values.sort(this.options.sorter(filters.$sort));
                } // Skip requested items


                if (filters.$skip !== undefined) {
                  values = values.slice(filters.$skip);
                } // Lin´mit result to specified (or default) length


                if (filters.$limit !== undefined) {
                  values = values.slice(0, filters.$limit);
                } // If wanted we convert all ISO string dates to Date objects


                values = stringsToDates(this._dates)(values);
                result = {
                  total: total,
                  limit: filters.$limit,
                  skip: filters.$skip || 0,
                  data: values.map(function (value) {
                    return _select(value, params);
                  })
                };

                if (paginate && paginate["default"]) {
                  _context5.next = 22;
                  break;
                }

                debug("_find res = ".concat(JSON.stringify(result.data)));
                return _context5.abrupt("return", result.data);

              case 22:
                debug("_find res = ".concat(JSON.stringify(result)));
                return _context5.abrupt("return", result);

              case 24:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));
    }
  }, {
    key: "_get",
    value: function _get(id) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
        var _this3 = this;

        var self, _this$filterQuery2, query;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                debug("_get(".concat(id, ", ").concat(JSON.stringify(params), ")") + this._debugSuffix);
                self = this;
                _this$filterQuery2 = this.filterQuery(params), query = _this$filterQuery2.query;
                return _context6.abrupt("return", this.getModel().getItem(String(id), null).then(function (item) {
                  if (item === null) throw new errors.NotFound("No match for query=".concat(JSON.stringify(query)) + _this3._debugSuffix);
                  var match = self.options.matcher(query)(item);

                  if (match) {
                    return item;
                  } else {
                    throw new errors.NotFound("No match for query=".concat(JSON.stringify(query)) + _this3._debugSuffix);
                  }
                })["catch"](function (err) {
                  throw new errors.NotFound("No record found for id '".concat(id, "', err=").concat(err.message) + _this3._debugSuffix);
                }).then(select(params, this.id)).then(stringsToDates(this._dates)));

              case 4:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));
    }
  }, {
    key: "_findOrGet",
    value: function _findOrGet(id) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                debug("_findOrGet(".concat(id, ", ").concat(JSON.stringify(params), ")") + this._debugSuffix);

                if (!(id === null)) {
                  _context7.next = 3;
                  break;
                }

                return _context7.abrupt("return", this._find(_.extend({}, params, {
                  paginate: false
                })));

              case 3:
                return _context7.abrupt("return", this._get(id, params));

              case 4:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));
    }
  }, {
    key: "_create",
    value: function _create(raw) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
        var _this4 = this;

        var self, addId, data, doOne;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                debug("_create(".concat(JSON.stringify(raw), ", ").concat(JSON.stringify(params), ")") + this._debugSuffix);
                self = this;

                addId = function addId(item) {
                  var thisId = item[_this4.id];
                  item[_this4.id] = thisId !== undefined ? _this4.setMax(thisId) : ++_this4._id;
                  return item;
                };

                data = Array.isArray(raw) ? raw.map(addId) : addId(Object.assign({}, raw));

                doOne = function doOne(item) {
                  return _this4.getModel().setItem(String(item[_this4.id]), item, null).then(function () {
                    return item;
                  }).then(select(params, _this4.id)).then(stringsToDates(_this4._dates)).then(function (item) {
                    return item;
                  })["catch"](function (err) {
                    throw new errors.GeneralError("_create doOne: ERROR: err=".concat(err.name, ", ").concat(err.message));
                  });
                };

                return _context8.abrupt("return", Array.isArray(data) ? Promise.all(data.map(doOne)) : doOne(data));

              case 6:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));
    }
  }, {
    key: "_patch",
    value: function _patch(id, data) {
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
        var _this5 = this;

        var self, items, patchEntry;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                debug("_patch(".concat(id, ", ").concat(JSON.stringify(data), ", ").concat(JSON.stringify(params), ")") + this._debugSuffix);
                self = this;
                _context10.next = 4;
                return this._findOrGet(id, params);

              case 4:
                items = _context10.sent;

                patchEntry = function patchEntry(entry) {
                  return __awaiter(_this5, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
                    var currentId, item;
                    return regeneratorRuntime.wrap(function _callee9$(_context9) {
                      while (1) {
                        switch (_context9.prev = _context9.next) {
                          case 0:
                            currentId = entry[this.id];
                            item = _.extend(entry, _.omit(data, this.id));
                            _context9.next = 4;
                            return self.getModel().setItem(String(currentId), item, null);

                          case 4:
                            return _context9.abrupt("return", stringsToDates(this._dates)(_select(item, params, this.id)));

                          case 5:
                          case "end":
                            return _context9.stop();
                        }
                      }
                    }, _callee9, this);
                  }));
                };

                if (!Array.isArray(items)) {
                  _context10.next = 10;
                  break;
                }

                return _context10.abrupt("return", Promise.all(items.map(patchEntry)));

              case 10:
                return _context10.abrupt("return", patchEntry(items));

              case 11:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));
    }
  }, {
    key: "_update",
    value: function _update(id, data) {
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
        var item, entry;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                debug("_update(".concat(id, ", ").concat(JSON.stringify(data), ", ").concat(JSON.stringify(params), ")") + this._debugSuffix);
                _context11.next = 3;
                return this._findOrGet(id, params);

              case 3:
                item = _context11.sent;
                id = item[this.id];
                entry = _.omit(data, this.id);
                entry[this.id] = id;
                return _context11.abrupt("return", this.getModel().setItem(String(id), entry, null).then(function () {
                  return entry;
                }).then(select(params, this.id)).then(stringsToDates(this._dates)));

              case 8:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));
    }
  }, {
    key: "__removeItem",
    value: function __removeItem(item) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.next = 2;
                return this.getModel(null).removeItem(String(item[this.id]), null);

              case 2:
                return _context12.abrupt("return", item);

              case 3:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));
    }
  }, {
    key: "_remove",
    value: function _remove(id) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
        var _this6 = this;

        var items, self;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                debug("_remove(".concat(id, ", ").concat(JSON.stringify(params), ")") + this._debugSuffix);
                _context13.next = 3;
                return this._findOrGet(id, params);

              case 3:
                items = _context13.sent;
                self = this;

                if (!Array.isArray(items)) {
                  _context13.next = 9;
                  break;
                }

                return _context13.abrupt("return", Promise.all(items.map(function (item) {
                  return _this6.__removeItem(item);
                }, null)).then(select(params, this.id)));

              case 9:
                return _context13.abrupt("return", this.__removeItem(items).then(select(params, this.id)));

              case 10:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));
    }
  }]);

  return Service;
}(AdapterService);

function init(options) {
  return new Service(options);
}

;
module.exports = init;
init.Service = Service;

/***/ }),

/***/ "../localforage/lib/strings-to-dates.js":
/*!**********************************************!*\
  !*** ../localforage/lib/strings-to-dates.js ***!
  \**********************************************/
/***/ ((module) => {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// Convert ISO date strings to Date objects in FeathersJS result sets
// Inspired by https://stackoverflow.com/questions/14488745/javascript-json-date-deserialization
var stringsToDates = function stringsToDates(active) {
  return function (result) {
    var regexDate = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/i;

    function jsonDate(obj) {
      var type = _typeof(obj);

      if (type === 'object') {
        for (var p in obj) {
          if (obj.hasOwnProperty(p)) obj[p] = jsonDate(obj[p]);
        }

        return obj;
      } else if (type === 'string' && regexDate.test(obj)) {
        return new Date(obj);
      }

      return obj;
    }

    if (active) {
      if (Array.isArray(result)) return result.map(jsonDate);

      if (result.data) {
        result.data = result.data.map(jsonDate);
        return result;
      }

      ;
      return jsonDate(result);
    }

    return result;
  };
};

module.exports = stringsToDates;

/***/ }),

/***/ "../node_modules/@feathersjs/adapter-commons/lib/filter-query.js":
/*!***********************************************************************!*\
  !*** ../node_modules/@feathersjs/adapter-commons/lib/filter-query.js ***!
  \***********************************************************************/
/***/ ((module, exports, __webpack_require__) => {

"use strict";


function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.OPERATORS = exports.FILTERS = void 0;

var commons_1 = __webpack_require__(/*! @feathersjs/commons */ "../node_modules/@feathersjs/commons/lib/index.js");

var errors_1 = __webpack_require__(/*! @feathersjs/errors */ "../node_modules/@feathersjs/errors/lib/index.js");

function parse(number) {
  if (typeof number !== 'undefined') {
    return Math.abs(parseInt(number, 10));
  }

  return undefined;
} // Returns the pagination limit and will take into account the
// default and max pagination settings


function getLimit(limit, paginate) {
  if (paginate && paginate["default"]) {
    var lower = typeof limit === 'number' && !isNaN(limit) ? limit : paginate["default"];
    var upper = typeof paginate.max === 'number' ? paginate.max : Number.MAX_VALUE;
    return Math.min(lower, upper);
  }

  return limit;
} // Makes sure that $sort order is always converted to an actual number


function convertSort(sort) {
  if (_typeof(sort) !== 'object' || Array.isArray(sort)) {
    return sort;
  }

  return Object.keys(sort).reduce(function (result, key) {
    result[key] = _typeof(sort[key]) === 'object' ? sort[key] : parseInt(sort[key], 10);
    return result;
  }, {});
}

function cleanQuery(query, operators, filters) {
  if (Array.isArray(query)) {
    return query.map(function (value) {
      return cleanQuery(value, operators, filters);
    });
  } else if (commons_1._.isObject(query) && query.constructor === {}.constructor) {
    var result = {};

    commons_1._.each(query, function (value, key) {
      if (key[0] === '$') {
        if (filters[key] !== undefined) {
          return;
        }

        if (!operators.includes(key)) {
          throw new errors_1.BadRequest("Invalid query parameter ".concat(key), query);
        }
      }

      result[key] = cleanQuery(value, operators, filters);
    });

    Object.getOwnPropertySymbols(query).forEach(function (symbol) {
      // @ts-ignore
      result[symbol] = query[symbol];
    });
    return result;
  }

  return query;
}

function assignFilters(object, query, filters, options) {
  if (Array.isArray(filters)) {
    commons_1._.each(filters, function (key) {
      if (query[key] !== undefined) {
        object[key] = query[key];
      }
    });
  } else {
    commons_1._.each(filters, function (converter, key) {
      var converted = converter(query[key], options);

      if (converted !== undefined) {
        object[key] = converted;
      }
    });
  }

  return object;
}

exports.FILTERS = {
  $sort: function $sort(value) {
    return convertSort(value);
  },
  $limit: function $limit(value, options) {
    return getLimit(parse(value), options.paginate);
  },
  $skip: function $skip(value) {
    return parse(value);
  },
  $select: function $select(value) {
    return value;
  }
};
exports.OPERATORS = ['$in', '$nin', '$lt', '$lte', '$gt', '$gte', '$ne', '$or']; // Converts Feathers special query parameters and pagination settings
// and returns them separately a `filters` and the rest of the query
// as `query`

function filterQuery(query) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options$filters = options.filters,
      additionalFilters = _options$filters === void 0 ? {} : _options$filters,
      _options$operators = options.operators,
      additionalOperators = _options$operators === void 0 ? [] : _options$operators;
  var result = {};
  result.filters = assignFilters({}, query, exports.FILTERS, options);
  result.filters = assignFilters(result.filters, query, additionalFilters, options);
  result.query = cleanQuery(query, exports.OPERATORS.concat(additionalOperators), result.filters);
  return result;
}

exports.default = filterQuery;

if (true) {
  module.exports = Object.assign(filterQuery, module.exports);
}

/***/ }),

/***/ "../node_modules/@feathersjs/adapter-commons/lib/index.js":
/*!****************************************************************!*\
  !*** ../node_modules/@feathersjs/adapter-commons/lib/index.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function get() {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __exportStar = this && this.__exportStar || function (m, exports) {
  for (var p in m) {
    if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
  }
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.select = exports.OPERATORS = exports.FILTERS = exports.filterQuery = exports.AdapterService = void 0;

var commons_1 = __webpack_require__(/*! @feathersjs/commons */ "../node_modules/@feathersjs/commons/lib/index.js");

var service_1 = __webpack_require__(/*! ./service */ "../node_modules/@feathersjs/adapter-commons/lib/service.js");

Object.defineProperty(exports, "AdapterService", ({
  enumerable: true,
  get: function get() {
    return service_1.AdapterService;
  }
}));

var filter_query_1 = __webpack_require__(/*! ./filter-query */ "../node_modules/@feathersjs/adapter-commons/lib/filter-query.js");

Object.defineProperty(exports, "filterQuery", ({
  enumerable: true,
  get: function get() {
    return __importDefault(filter_query_1)["default"];
  }
}));
Object.defineProperty(exports, "FILTERS", ({
  enumerable: true,
  get: function get() {
    return filter_query_1.FILTERS;
  }
}));
Object.defineProperty(exports, "OPERATORS", ({
  enumerable: true,
  get: function get() {
    return filter_query_1.OPERATORS;
  }
}));

__exportStar(__webpack_require__(/*! ./sort */ "../node_modules/@feathersjs/adapter-commons/lib/sort.js"), exports); // Return a function that filters a result object or array
// and picks only the fields passed as `params.query.$select`
// and additional `otherFields`


function select(params) {
  var fields = params && params.query && params.query.$select;

  for (var _len = arguments.length, otherFields = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    otherFields[_key - 1] = arguments[_key];
  }

  if (Array.isArray(fields) && otherFields.length) {
    fields.push.apply(fields, otherFields);
  }

  var convert = function convert(result) {
    var _commons_1$_;

    if (!Array.isArray(fields)) {
      return result;
    }

    return (_commons_1$_ = commons_1._).pick.apply(_commons_1$_, [result].concat(_toConsumableArray(fields)));
  };

  return function (result) {
    if (Array.isArray(result)) {
      return result.map(convert);
    }

    return convert(result);
  };
}

exports.select = select;

/***/ }),

/***/ "../node_modules/@feathersjs/adapter-commons/lib/service.js":
/*!******************************************************************!*\
  !*** ../node_modules/@feathersjs/adapter-commons/lib/service.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.AdapterService = void 0;

var errors_1 = __webpack_require__(/*! @feathersjs/errors */ "../node_modules/@feathersjs/errors/lib/index.js");

var filter_query_1 = __importDefault(__webpack_require__(/*! ./filter-query */ "../node_modules/@feathersjs/adapter-commons/lib/filter-query.js"));

var callMethod = function callMethod(self, name) {
  if (typeof self[name] !== 'function') {
    return Promise.reject(new errors_1.NotImplemented("Method ".concat(name, " not available")));
  }

  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  return self[name].apply(self, args);
};

var alwaysMulti = {
  find: true,
  get: false,
  update: false
};

var AdapterService = /*#__PURE__*/function () {
  function AdapterService(options) {
    _classCallCheck(this, AdapterService);

    this.options = Object.assign({
      id: 'id',
      events: [],
      paginate: {},
      multi: false,
      filters: [],
      whitelist: []
    }, options);
  }

  _createClass(AdapterService, [{
    key: "filterQuery",
    value: function filterQuery() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var paginate = typeof params.paginate !== 'undefined' ? params.paginate : this.options.paginate;
      var _params$query = params.query,
          query = _params$query === void 0 ? {} : _params$query;
      var options = Object.assign({
        operators: this.options.whitelist || [],
        filters: this.options.filters,
        paginate: paginate
      }, opts);
      var result = filter_query_1["default"](query, options);
      return Object.assign(result, {
        paginate: paginate
      });
    }
  }, {
    key: "allowsMulti",
    value: function allowsMulti(method) {
      var always = alwaysMulti[method];

      if (typeof always !== 'undefined') {
        return always;
      }

      var option = this.options.multi;

      if (option === true || option === false) {
        return option;
      } else {
        return option.includes(method);
      }
    }
  }, {
    key: "find",
    value: function find(params) {
      return callMethod(this, '_find', params);
    }
  }, {
    key: "get",
    value: function get(id, params) {
      return callMethod(this, '_get', id, params);
    }
  }, {
    key: "create",
    value: function create(data, params) {
      if (Array.isArray(data) && !this.allowsMulti('create')) {
        return Promise.reject(new errors_1.MethodNotAllowed("Can not create multiple entries"));
      }

      return callMethod(this, '_create', data, params);
    }
  }, {
    key: "update",
    value: function update(id, data, params) {
      if (id === null || Array.isArray(data)) {
        return Promise.reject(new errors_1.BadRequest("You can not replace multiple instances. Did you mean 'patch'?"));
      }

      return callMethod(this, '_update', id, data, params);
    }
  }, {
    key: "patch",
    value: function patch(id, data, params) {
      if (id === null && !this.allowsMulti('patch')) {
        return Promise.reject(new errors_1.MethodNotAllowed("Can not patch multiple entries"));
      }

      return callMethod(this, '_patch', id, data, params);
    }
  }, {
    key: "remove",
    value: function remove(id, params) {
      if (id === null && !this.allowsMulti('remove')) {
        return Promise.reject(new errors_1.MethodNotAllowed("Can not remove multiple entries"));
      }

      return callMethod(this, '_remove', id, params);
    }
  }, {
    key: "id",
    get: function get() {
      return this.options.id;
    }
  }, {
    key: "events",
    get: function get() {
      return this.options.events;
    }
  }]);

  return AdapterService;
}();

exports.AdapterService = AdapterService;

/***/ }),

/***/ "../node_modules/@feathersjs/adapter-commons/lib/sort.js":
/*!***************************************************************!*\
  !*** ../node_modules/@feathersjs/adapter-commons/lib/sort.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
 // Sorting algorithm taken from NeDB (https://github.com/louischatriot/nedb)
// See https://github.com/louischatriot/nedb/blob/e3f0078499aa1005a59d0c2372e425ab789145c1/lib/model.js#L189

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.sorter = exports.compare = exports.compareArrays = exports.compareNSB = void 0;

function compareNSB(a, b) {
  if (a < b) {
    return -1;
  }

  if (a > b) {
    return 1;
  }

  return 0;
}

exports.compareNSB = compareNSB;

function compareArrays(a, b) {
  var i;
  var comp;

  for (i = 0; i < Math.min(a.length, b.length); i += 1) {
    comp = exports.compare(a[i], b[i]);

    if (comp !== 0) {
      return comp;
    }
  } // Common section was identical, longest one wins


  return exports.compareNSB(a.length, b.length);
}

exports.compareArrays = compareArrays;

function compare(a, b) {
  var compareStrings = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : exports.compareNSB;
  var _exports = exports,
      compareNSB = _exports.compareNSB,
      compare = _exports.compare,
      compareArrays = _exports.compareArrays; // undefined

  if (a === undefined) {
    return b === undefined ? 0 : -1;
  }

  if (b === undefined) {
    return a === undefined ? 0 : 1;
  } // null


  if (a === null) {
    return b === null ? 0 : -1;
  }

  if (b === null) {
    return a === null ? 0 : 1;
  } // Numbers


  if (typeof a === 'number') {
    return typeof b === 'number' ? compareNSB(a, b) : -1;
  }

  if (typeof b === 'number') {
    return typeof a === 'number' ? compareNSB(a, b) : 1;
  } // Strings


  if (typeof a === 'string') {
    return typeof b === 'string' ? compareStrings(a, b) : -1;
  }

  if (typeof b === 'string') {
    return typeof a === 'string' ? compareStrings(a, b) : 1;
  } // Booleans


  if (typeof a === 'boolean') {
    return typeof b === 'boolean' ? compareNSB(a, b) : -1;
  }

  if (typeof b === 'boolean') {
    return typeof a === 'boolean' ? compareNSB(a, b) : 1;
  } // Dates


  if (a instanceof Date) {
    return b instanceof Date ? compareNSB(a.getTime(), b.getTime()) : -1;
  }

  if (b instanceof Date) {
    return a instanceof Date ? compareNSB(a.getTime(), b.getTime()) : 1;
  } // Arrays (first element is most significant and so on)


  if (Array.isArray(a)) {
    return Array.isArray(b) ? compareArrays(a, b) : -1;
  }

  if (Array.isArray(b)) {
    return Array.isArray(a) ? compareArrays(a, b) : 1;
  } // Objects


  var aKeys = Object.keys(a).sort();
  var bKeys = Object.keys(b).sort();
  var comp = 0;

  for (var i = 0; i < Math.min(aKeys.length, bKeys.length); i += 1) {
    comp = compare(a[aKeys[i]], b[bKeys[i]]);

    if (comp !== 0) {
      return comp;
    }
  }

  return compareNSB(aKeys.length, bKeys.length);
}

exports.compare = compare; // An in-memory sorting function according to the
// $sort special query parameter

function sorter($sort) {
  var criteria = Object.keys($sort).map(function (key) {
    var direction = $sort[key];
    return {
      key: key,
      direction: direction
    };
  });
  return function (a, b) {
    var compare;

    var _iterator = _createForOfIteratorHelper(criteria),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var criterion = _step.value;
        compare = criterion.direction * exports.compare(a[criterion.key], b[criterion.key]);

        if (compare !== 0) {
          return compare;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return 0;
  };
}

exports.sorter = sorter;

/***/ }),

/***/ "../node_modules/@feathersjs/commons/lib/hooks.js":
/*!********************************************************!*\
  !*** ../node_modules/@feathersjs/commons/lib/hooks.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.enableHooks = exports.processHooks = exports.getHooks = exports.isHookObject = exports.convertHookData = exports.makeArguments = exports.defaultMakeArguments = exports.createHookObject = exports.ACTIVATE_HOOKS = void 0;

var utils_1 = __webpack_require__(/*! ./utils */ "../node_modules/@feathersjs/commons/lib/utils.js");

var _utils_1$_ = utils_1._,
    each = _utils_1$_.each,
    pick = _utils_1$_.pick;
exports.ACTIVATE_HOOKS = utils_1.createSymbol('__feathersActivateHooks');

function createHookObject(method) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var hook = {};
  Object.defineProperty(hook, 'toJSON', {
    value: function value() {
      return pick(this, 'type', 'method', 'path', 'params', 'id', 'data', 'result', 'error');
    }
  });
  return Object.assign(hook, data, {
    method: method,

    // A dynamic getter that returns the path of the service
    get path() {
      var app = data.app,
          service = data.service;

      if (!service || !app || !app.services) {
        return null;
      }

      return Object.keys(app.services).find(function (path) {
        return app.services[path] === service;
      });
    }

  });
}

exports.createHookObject = createHookObject; // Fallback used by `makeArguments` which usually won't be used

function defaultMakeArguments(hook) {
  var result = [];

  if (typeof hook.id !== 'undefined') {
    result.push(hook.id);
  }

  if (hook.data) {
    result.push(hook.data);
  }

  result.push(hook.params || {});
  return result;
}

exports.defaultMakeArguments = defaultMakeArguments; // Turns a hook object back into a list of arguments
// to call a service method with

function makeArguments(hook) {
  switch (hook.method) {
    case 'find':
      return [hook.params];

    case 'get':
    case 'remove':
      return [hook.id, hook.params];

    case 'update':
    case 'patch':
      return [hook.id, hook.data, hook.params];

    case 'create':
      return [hook.data, hook.params];
  }

  return defaultMakeArguments(hook);
}

exports.makeArguments = makeArguments; // Converts different hook registration formats into the
// same internal format

function convertHookData(obj) {
  var hook = {};

  if (Array.isArray(obj)) {
    hook = {
      all: obj
    };
  } else if (_typeof(obj) !== 'object') {
    hook = {
      all: [obj]
    };
  } else {
    each(obj, function (value, key) {
      hook[key] = !Array.isArray(value) ? [value] : value;
    });
  }

  return hook;
}

exports.convertHookData = convertHookData; // Duck-checks a given object to be a hook object
// A valid hook object has `type` and `method`

function isHookObject(hookObject) {
  return _typeof(hookObject) === 'object' && typeof hookObject.method === 'string' && typeof hookObject.type === 'string';
}

exports.isHookObject = isHookObject; // Returns all service and application hooks combined
// for a given method and type `appLast` sets if the hooks
// from `app` should be added last (or first by default)

function getHooks(app, service, type, method) {
  var appLast = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var appHooks = app.__hooks[type][method] || [];
  var serviceHooks = service.__hooks[type][method] || [];

  if (appLast) {
    // Run hooks in the order of service -> app -> finally
    return serviceHooks.concat(appHooks);
  }

  return appHooks.concat(serviceHooks);
}

exports.getHooks = getHooks;

function processHooks(hooks, initialHookObject) {
  var _this = this;

  var hookObject = initialHookObject;

  var updateCurrentHook = function updateCurrentHook(current) {
    // Either use the returned hook object or the current
    // hook object from the chain if the hook returned undefined
    if (current) {
      if (!isHookObject(current)) {
        throw new Error("".concat(hookObject.type, " hook for '").concat(hookObject.method, "' method returned invalid hook object"));
      }

      hookObject = current;
    }

    return hookObject;
  }; // Go through all hooks and chain them into our promise


  var promise = hooks.reduce(function (current, fn) {
    // @ts-ignore
    var hook = fn.bind(_this); // Use the returned hook object or the old one

    return current.then(function (currentHook) {
      return hook(currentHook);
    }).then(updateCurrentHook);
  }, Promise.resolve(hookObject));
  return promise.then(function () {
    return hookObject;
  })["catch"](function (error) {
    // Add the hook information to any errors
    error.hook = hookObject;
    throw error;
  });
}

exports.processHooks = processHooks; // Add `.hooks` functionality to an object

function enableHooks(obj, methods, types) {
  if (typeof obj.hooks === 'function') {
    return obj;
  }

  var hookData = {};
  types.forEach(function (type) {
    // Initialize properties where hook functions are stored
    hookData[type] = {};
  }); // Add non-enumerable `__hooks` property to the object

  Object.defineProperty(obj, '__hooks', {
    configurable: true,
    value: hookData,
    writable: true
  });
  return Object.assign(obj, {
    hooks: function hooks(allHooks) {
      var _this2 = this;

      each(allHooks, function (current, type) {
        // @ts-ignore
        if (!_this2.__hooks[type]) {
          throw new Error("'".concat(type, "' is not a valid hook type"));
        }

        var hooks = convertHookData(current);
        each(hooks, function (_value, method) {
          if (method !== 'all' && methods.indexOf(method) === -1) {
            throw new Error("'".concat(method, "' is not a valid hook method"));
          }
        });
        methods.forEach(function (method) {
          // @ts-ignore
          var myHooks = _this2.__hooks[type][method] || (_this2.__hooks[type][method] = []);

          if (hooks.all) {
            myHooks.push.apply(myHooks, hooks.all);
          }

          if (hooks[method]) {
            myHooks.push.apply(myHooks, hooks[method]);
          }
        });
      });
      return this;
    }
  });
}

exports.enableHooks = enableHooks;

/***/ }),

/***/ "../node_modules/@feathersjs/commons/lib/index.js":
/*!********************************************************!*\
  !*** ../node_modules/@feathersjs/commons/lib/index.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function get() {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  }

  __setModuleDefault(result, mod);

  return result;
};

var __exportStar = this && this.__exportStar || function (m, exports) {
  for (var p in m) {
    if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
  }
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.hooks = void 0;

var hookUtils = __importStar(__webpack_require__(/*! ./hooks */ "../node_modules/@feathersjs/commons/lib/hooks.js"));

__exportStar(__webpack_require__(/*! ./utils */ "../node_modules/@feathersjs/commons/lib/utils.js"), exports);

exports.hooks = hookUtils;

/***/ }),

/***/ "../node_modules/@feathersjs/commons/lib/utils.js":
/*!********************************************************!*\
  !*** ../node_modules/@feathersjs/commons/lib/utils.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.createSymbol = exports.makeUrl = exports.isPromise = exports._ = exports.stripSlashes = void 0; // Removes all leading and trailing slashes from a path

function stripSlashes(name) {
  return name.replace(/^(\/+)|(\/+)$/g, '');
}

exports.stripSlashes = stripSlashes; // A set of lodash-y utility functions that use ES6

exports._ = {
  each: function each(obj, callback) {
    if (obj && typeof obj.forEach === 'function') {
      obj.forEach(callback);
    } else if (exports._.isObject(obj)) {
      Object.keys(obj).forEach(function (key) {
        return callback(obj[key], key);
      });
    }
  },
  some: function some(value, callback) {
    return Object.keys(value).map(function (key) {
      return [value[key], key];
    }).some(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          val = _ref2[0],
          key = _ref2[1];

      return callback(val, key);
    });
  },
  every: function every(value, callback) {
    return Object.keys(value).map(function (key) {
      return [value[key], key];
    }).every(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          val = _ref4[0],
          key = _ref4[1];

      return callback(val, key);
    });
  },
  keys: function keys(obj) {
    return Object.keys(obj);
  },
  values: function values(obj) {
    return exports._.keys(obj).map(function (key) {
      return obj[key];
    });
  },
  isMatch: function isMatch(obj, item) {
    return exports._.keys(item).every(function (key) {
      return obj[key] === item[key];
    });
  },
  isEmpty: function isEmpty(obj) {
    return exports._.keys(obj).length === 0;
  },
  isObject: function isObject(item) {
    return _typeof(item) === 'object' && !Array.isArray(item) && item !== null;
  },
  isObjectOrArray: function isObjectOrArray(value) {
    return _typeof(value) === 'object' && value !== null;
  },
  extend: function extend(first) {
    for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      rest[_key - 1] = arguments[_key];
    }

    return Object.assign.apply(Object, [first].concat(rest));
  },
  omit: function omit(obj) {
    var result = exports._.extend({}, obj);

    for (var _len2 = arguments.length, keys = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      keys[_key2 - 1] = arguments[_key2];
    }

    keys.forEach(function (key) {
      return delete result[key];
    });
    return result;
  },
  pick: function pick(source) {
    for (var _len3 = arguments.length, keys = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      keys[_key3 - 1] = arguments[_key3];
    }

    return keys.reduce(function (result, key) {
      if (source[key] !== undefined) {
        result[key] = source[key];
      }

      return result;
    }, {});
  },
  // Recursively merge the source object into the target object
  merge: function merge(target, source) {
    if (exports._.isObject(target) && exports._.isObject(source)) {
      Object.keys(source).forEach(function (key) {
        if (exports._.isObject(source[key])) {
          if (!target[key]) {
            Object.assign(target, _defineProperty({}, key, {}));
          }

          exports._.merge(target[key], source[key]);
        } else {
          Object.assign(target, _defineProperty({}, key, source[key]));
        }
      });
    }

    return target;
  }
}; // Duck-checks if an object looks like a promise

function isPromise(result) {
  return exports._.isObject(result) && typeof result.then === 'function';
}

exports.isPromise = isPromise;

function makeUrl(path) {
  var app = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var get = typeof app.get === 'function' ? app.get.bind(app) : function () {};
  var env = get('env') || "development";
  var host = get('host') || process.env.HOST_NAME || 'localhost';
  var protocol = env === 'development' || env === 'test' || env === undefined ? 'http' : 'https';
  var PORT = get('port') || process.env.PORT || 3030;
  var port = env === 'development' || env === 'test' || env === undefined ? ":".concat(PORT) : '';
  path = path || '';
  return "".concat(protocol, "://").concat(host).concat(port, "/").concat(exports.stripSlashes(path));
}

exports.makeUrl = makeUrl;

function createSymbol(name) {
  return typeof Symbol !== 'undefined' ? Symbol(name) : name;
}

exports.createSymbol = createSymbol;

/***/ }),

/***/ "../node_modules/@feathersjs/errors/lib/index.js":
/*!*******************************************************!*\
  !*** ../node_modules/@feathersjs/errors/lib/index.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var debug = __webpack_require__(/*! debug */ "../node_modules/debug/src/browser.js")('@feathersjs/errors');

function FeathersError(msg, name, code, className, data) {
  msg = msg || 'Error';
  var errors;
  var message;
  var newData;

  if (msg instanceof Error) {
    message = msg.message || 'Error'; // NOTE (EK): This is typically to handle validation errors

    if (msg.errors) {
      errors = msg.errors;
    }
  } else if (_typeof(msg) === 'object') {
    // Support plain old objects
    message = msg.message || 'Error';
    data = msg;
  } else {
    // message is just a string
    message = msg;
  }

  if (data) {
    // NOTE(EK): To make sure that we are not messing
    // with immutable data, just make a copy.
    // https://github.com/feathersjs/errors/issues/19
    newData = JSON.parse(JSON.stringify(data));

    if (newData.errors) {
      errors = newData.errors;
      delete newData.errors;
    } else if (data.errors) {
      // The errors property from data could be
      // stripped away while cloning resulting newData not to have it
      // For example: when cloning arrays this property
      errors = JSON.parse(JSON.stringify(data.errors));
    }
  } // NOTE (EK): Babel doesn't support this so
  // we have to pass in the class name manually.
  // this.name = this.constructor.name;


  this.type = 'FeathersError';
  this.name = name;
  this.message = message;
  this.code = code;
  this.className = className;
  this.data = newData;
  this.errors = errors || {};
  debug("".concat(this.name, "(").concat(this.code, "): ").concat(this.message));
  debug(this.errors);

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, FeathersError);
  } else {
    this.stack = new Error().stack;
  }
}

function inheritsFrom(Child, Parent) {
  Child.prototype = Object.create(Parent.prototype);
  Child.prototype.constructor = Child;
}

inheritsFrom(FeathersError, Error); // NOTE (EK): A little hack to get around `message` not
// being included in the default toJSON call.

Object.defineProperty(FeathersError.prototype, 'toJSON', {
  value: function value() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      className: this.className,
      data: this.data,
      errors: this.errors
    };
  }
}); // 400 - Bad Request

function BadRequest(message, data) {
  FeathersError.call(this, message, 'BadRequest', 400, 'bad-request', data);
}

inheritsFrom(BadRequest, FeathersError); // 401 - Not Authenticated

function NotAuthenticated(message, data) {
  FeathersError.call(this, message, 'NotAuthenticated', 401, 'not-authenticated', data);
}

inheritsFrom(NotAuthenticated, FeathersError); // 402 - Payment Error

function PaymentError(message, data) {
  FeathersError.call(this, message, 'PaymentError', 402, 'payment-error', data);
}

inheritsFrom(PaymentError, FeathersError); // 403 - Forbidden

function Forbidden(message, data) {
  FeathersError.call(this, message, 'Forbidden', 403, 'forbidden', data);
}

inheritsFrom(Forbidden, FeathersError); // 404 - Not Found

function NotFound(message, data) {
  FeathersError.call(this, message, 'NotFound', 404, 'not-found', data);
}

inheritsFrom(NotFound, FeathersError); // 405 - Method Not Allowed

function MethodNotAllowed(message, data) {
  FeathersError.call(this, message, 'MethodNotAllowed', 405, 'method-not-allowed', data);
}

inheritsFrom(MethodNotAllowed, FeathersError); // 406 - Not Acceptable

function NotAcceptable(message, data) {
  FeathersError.call(this, message, 'NotAcceptable', 406, 'not-acceptable', data);
}

inheritsFrom(NotAcceptable, FeathersError); // 408 - Timeout

function Timeout(message, data) {
  FeathersError.call(this, message, 'Timeout', 408, 'timeout', data);
}

inheritsFrom(Timeout, FeathersError); // 409 - Conflict

function Conflict(message, data) {
  FeathersError.call(this, message, 'Conflict', 409, 'conflict', data);
}

inheritsFrom(Conflict, FeathersError); // 410 - Gone

function Gone(message, data) {
  FeathersError(this, message, 'Gone', 410, 'gone', data);
}

inheritsFrom(Gone, FeathersError); // 411 - Length Required

function LengthRequired(message, data) {
  FeathersError.call(this, message, 'LengthRequired', 411, 'length-required', data);
}

inheritsFrom(LengthRequired, FeathersError); // 422 Unprocessable

function Unprocessable(message, data) {
  FeathersError.call(this, message, 'Unprocessable', 422, 'unprocessable', data);
}

inheritsFrom(Unprocessable, FeathersError); // 429 Too Many Requests

function TooManyRequests(message, data) {
  FeathersError.call(this, message, 'TooManyRequests', 429, 'too-many-requests', data);
}

inheritsFrom(TooManyRequests, FeathersError); // 500 - General Error

function GeneralError(message, data) {
  FeathersError.call(this, message, 'GeneralError', 500, 'general-error', data);
}

inheritsFrom(GeneralError, FeathersError); // 501 - Not Implemented

function NotImplemented(message, data) {
  FeathersError.call(this, message, 'NotImplemented', 501, 'not-implemented', data);
}

inheritsFrom(NotImplemented, FeathersError); // 502 - Bad Gateway

function BadGateway(message, data) {
  FeathersError.call(this, message, 'BadGateway', 502, 'bad-gateway', data);
}

inheritsFrom(BadGateway, FeathersError); // 503 - Unavailable

function Unavailable(message, data) {
  FeathersError.call(this, message, 'Unavailable', 503, 'unavailable', data);
}

inheritsFrom(Unavailable, FeathersError);
var errors = {
  FeathersError: FeathersError,
  BadRequest: BadRequest,
  NotAuthenticated: NotAuthenticated,
  PaymentError: PaymentError,
  Forbidden: Forbidden,
  NotFound: NotFound,
  MethodNotAllowed: MethodNotAllowed,
  NotAcceptable: NotAcceptable,
  Timeout: Timeout,
  Conflict: Conflict,
  Gone: Gone,
  LengthRequired: LengthRequired,
  Unprocessable: Unprocessable,
  TooManyRequests: TooManyRequests,
  GeneralError: GeneralError,
  NotImplemented: NotImplemented,
  BadGateway: BadGateway,
  Unavailable: Unavailable,
  400: BadRequest,
  401: NotAuthenticated,
  402: PaymentError,
  403: Forbidden,
  404: NotFound,
  405: MethodNotAllowed,
  406: NotAcceptable,
  408: Timeout,
  409: Conflict,
  410: Gone,
  411: LengthRequired,
  422: Unprocessable,
  429: TooManyRequests,
  500: GeneralError,
  501: NotImplemented,
  502: BadGateway,
  503: Unavailable
};

function convert(error) {
  if (!error) {
    return error;
  }

  var FeathersError = errors[error.name];
  var result = FeathersError ? new FeathersError(error.message, error.data) : new Error(error.message || error);

  if (_typeof(error) === 'object') {
    Object.assign(result, error);
  }

  return result;
}

module.exports = Object.assign({
  convert: convert
}, errors);

/***/ }),

/***/ "../node_modules/debug/src/browser.js":
/*!********************************************!*\
  !*** ../node_modules/debug/src/browser.js ***!
  \********************************************/
/***/ ((module, exports, __webpack_require__) => {

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();

exports.destroy = function () {
  var warned = false;
  return function () {
    if (!warned) {
      warned = true;
      console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
    }
  };
}();
/**
 * Colors.
 */


exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];
/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */
// eslint-disable-next-line complexity

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
    return true;
  } // Internet Explorer and Edge do not support colors.


  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  } // Is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632


  return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
  typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
  // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
}
/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */


function formatArgs(args) {
  args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);

  if (!this.useColors) {
    return;
  }

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit'); // The final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into

  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function (match) {
    if (match === '%%') {
      return;
    }

    index++;

    if (match === '%c') {
      // We only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });
  args.splice(lastC, 0, c);
}
/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */


exports.log = console.debug || console.log || function () {};
/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */


function save(namespaces) {
  try {
    if (namespaces) {
      exports.storage.setItem('debug', namespaces);
    } else {
      exports.storage.removeItem('debug');
    }
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}
/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */


function load() {
  var r;

  try {
    r = exports.storage.getItem('debug');
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  } // If debug isn't set in LS, and we're in Electron, try to load $DEBUG


  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}
/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */


function localstorage() {
  try {
    // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
    // The Browser also has localStorage in the global context.
    return localStorage;
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}

module.exports = __webpack_require__(/*! ./common */ "../node_modules/debug/src/common.js")(exports);
var formatters = module.exports.formatters;
/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
  try {
    return JSON.stringify(v);
  } catch (error) {
    return '[UnexpectedJSONParseError]: ' + error.message;
  }
};

/***/ }),

/***/ "../node_modules/debug/src/common.js":
/*!*******************************************!*\
  !*** ../node_modules/debug/src/common.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */
function setup(env) {
  createDebug.debug = createDebug;
  createDebug["default"] = createDebug;
  createDebug.coerce = coerce;
  createDebug.disable = disable;
  createDebug.enable = enable;
  createDebug.enabled = enabled;
  createDebug.humanize = __webpack_require__(/*! ms */ "../node_modules/ms/index.js");
  createDebug.destroy = destroy;
  Object.keys(env).forEach(function (key) {
    createDebug[key] = env[key];
  });
  /**
  * The currently active debug mode names, and names to skip.
  */

  createDebug.names = [];
  createDebug.skips = [];
  /**
  * Map of special "%n" handling functions, for the debug "format" argument.
  *
  * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
  */

  createDebug.formatters = {};
  /**
  * Selects a color for a debug namespace
  * @param {String} namespace The namespace string for the for the debug instance to be colored
  * @return {Number|String} An ANSI color code for the given namespace
  * @api private
  */

  function selectColor(namespace) {
    var hash = 0;

    for (var i = 0; i < namespace.length; i++) {
      hash = (hash << 5) - hash + namespace.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }

    return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
  }

  createDebug.selectColor = selectColor;
  /**
  * Create a debugger with the given `namespace`.
  *
  * @param {String} namespace
  * @return {Function}
  * @api public
  */

  function createDebug(namespace) {
    var prevTime;
    var enableOverride = null;
    var namespacesCache;
    var enabledCache;

    function debug() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // Disabled?
      if (!debug.enabled) {
        return;
      }

      var self = debug; // Set `diff` timestamp

      var curr = Number(new Date());
      var ms = curr - (prevTime || curr);
      self.diff = ms;
      self.prev = prevTime;
      self.curr = curr;
      prevTime = curr;
      args[0] = createDebug.coerce(args[0]);

      if (typeof args[0] !== 'string') {
        // Anything else let's inspect with %O
        args.unshift('%O');
      } // Apply any `formatters` transformations


      var index = 0;
      args[0] = args[0].replace(/%([a-zA-Z%])/g, function (match, format) {
        // If we encounter an escaped % then don't increase the array index
        if (match === '%%') {
          return '%';
        }

        index++;
        var formatter = createDebug.formatters[format];

        if (typeof formatter === 'function') {
          var val = args[index];
          match = formatter.call(self, val); // Now we need to remove `args[index]` since it's inlined in the `format`

          args.splice(index, 1);
          index--;
        }

        return match;
      }); // Apply env-specific formatting (colors, etc.)

      createDebug.formatArgs.call(self, args);
      var logFn = self.log || createDebug.log;
      logFn.apply(self, args);
    }

    debug.namespace = namespace;
    debug.useColors = createDebug.useColors();
    debug.color = createDebug.selectColor(namespace);
    debug.extend = extend;
    debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

    Object.defineProperty(debug, 'enabled', {
      enumerable: true,
      configurable: false,
      get: function get() {
        if (enableOverride !== null) {
          return enableOverride;
        }

        if (namespacesCache !== createDebug.namespaces) {
          namespacesCache = createDebug.namespaces;
          enabledCache = createDebug.enabled(namespace);
        }

        return enabledCache;
      },
      set: function set(v) {
        enableOverride = v;
      }
    }); // Env-specific initialization logic for debug instances

    if (typeof createDebug.init === 'function') {
      createDebug.init(debug);
    }

    return debug;
  }

  function extend(namespace, delimiter) {
    var newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
    newDebug.log = this.log;
    return newDebug;
  }
  /**
  * Enables a debug mode by namespaces. This can include modes
  * separated by a colon and wildcards.
  *
  * @param {String} namespaces
  * @api public
  */


  function enable(namespaces) {
    createDebug.save(namespaces);
    createDebug.namespaces = namespaces;
    createDebug.names = [];
    createDebug.skips = [];
    var i;
    var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
    var len = split.length;

    for (i = 0; i < len; i++) {
      if (!split[i]) {
        // ignore empty strings
        continue;
      }

      namespaces = split[i].replace(/\*/g, '.*?');

      if (namespaces[0] === '-') {
        createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
      } else {
        createDebug.names.push(new RegExp('^' + namespaces + '$'));
      }
    }
  }
  /**
  * Disable debug output.
  *
  * @return {String} namespaces
  * @api public
  */


  function disable() {
    var namespaces = [].concat(_toConsumableArray(createDebug.names.map(toNamespace)), _toConsumableArray(createDebug.skips.map(toNamespace).map(function (namespace) {
      return '-' + namespace;
    }))).join(',');
    createDebug.enable('');
    return namespaces;
  }
  /**
  * Returns true if the given mode name is enabled, false otherwise.
  *
  * @param {String} name
  * @return {Boolean}
  * @api public
  */


  function enabled(name) {
    if (name[name.length - 1] === '*') {
      return true;
    }

    var i;
    var len;

    for (i = 0, len = createDebug.skips.length; i < len; i++) {
      if (createDebug.skips[i].test(name)) {
        return false;
      }
    }

    for (i = 0, len = createDebug.names.length; i < len; i++) {
      if (createDebug.names[i].test(name)) {
        return true;
      }
    }

    return false;
  }
  /**
  * Convert regexp to namespace
  *
  * @param {RegExp} regxep
  * @return {String} namespace
  * @api private
  */


  function toNamespace(regexp) {
    return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, '*');
  }
  /**
  * Coerce `val`.
  *
  * @param {Mixed} val
  * @return {Mixed}
  * @api private
  */


  function coerce(val) {
    if (val instanceof Error) {
      return val.stack || val.message;
    }

    return val;
  }
  /**
  * XXX DO NOT USE. This is a temporary stub function.
  * XXX It WILL be removed in the next major release.
  */


  function destroy() {
    console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
  }

  createDebug.enable(createDebug.load());
  return createDebug;
}

module.exports = setup;

/***/ }),

/***/ "./node_modules/debug/src/browser.js":
/*!*******************************************!*\
  !*** ./node_modules/debug/src/browser.js ***!
  \*******************************************/
/***/ ((module, exports, __webpack_require__) => {

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();

exports.destroy = function () {
  var warned = false;
  return function () {
    if (!warned) {
      warned = true;
      console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
    }
  };
}();
/**
 * Colors.
 */


exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];
/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */
// eslint-disable-next-line complexity

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
    return true;
  } // Internet Explorer and Edge do not support colors.


  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  } // Is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632


  return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
  typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
  // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
}
/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */


function formatArgs(args) {
  args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);

  if (!this.useColors) {
    return;
  }

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit'); // The final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into

  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function (match) {
    if (match === '%%') {
      return;
    }

    index++;

    if (match === '%c') {
      // We only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });
  args.splice(lastC, 0, c);
}
/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */


exports.log = console.debug || console.log || function () {};
/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */


function save(namespaces) {
  try {
    if (namespaces) {
      exports.storage.setItem('debug', namespaces);
    } else {
      exports.storage.removeItem('debug');
    }
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}
/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */


function load() {
  var r;

  try {
    r = exports.storage.getItem('debug');
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  } // If debug isn't set in LS, and we're in Electron, try to load $DEBUG


  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}
/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */


function localstorage() {
  try {
    // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
    // The Browser also has localStorage in the global context.
    return localStorage;
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}

module.exports = __webpack_require__(/*! ./common */ "./node_modules/debug/src/common.js")(exports);
var formatters = module.exports.formatters;
/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
  try {
    return JSON.stringify(v);
  } catch (error) {
    return '[UnexpectedJSONParseError]: ' + error.message;
  }
};

/***/ }),

/***/ "./node_modules/debug/src/common.js":
/*!******************************************!*\
  !*** ./node_modules/debug/src/common.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */
function setup(env) {
  createDebug.debug = createDebug;
  createDebug["default"] = createDebug;
  createDebug.coerce = coerce;
  createDebug.disable = disable;
  createDebug.enable = enable;
  createDebug.enabled = enabled;
  createDebug.humanize = __webpack_require__(/*! ms */ "./node_modules/ms/index.js");
  createDebug.destroy = destroy;
  Object.keys(env).forEach(function (key) {
    createDebug[key] = env[key];
  });
  /**
  * The currently active debug mode names, and names to skip.
  */

  createDebug.names = [];
  createDebug.skips = [];
  /**
  * Map of special "%n" handling functions, for the debug "format" argument.
  *
  * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
  */

  createDebug.formatters = {};
  /**
  * Selects a color for a debug namespace
  * @param {String} namespace The namespace string for the for the debug instance to be colored
  * @return {Number|String} An ANSI color code for the given namespace
  * @api private
  */

  function selectColor(namespace) {
    var hash = 0;

    for (var i = 0; i < namespace.length; i++) {
      hash = (hash << 5) - hash + namespace.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }

    return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
  }

  createDebug.selectColor = selectColor;
  /**
  * Create a debugger with the given `namespace`.
  *
  * @param {String} namespace
  * @return {Function}
  * @api public
  */

  function createDebug(namespace) {
    var prevTime;
    var enableOverride = null;

    function debug() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // Disabled?
      if (!debug.enabled) {
        return;
      }

      var self = debug; // Set `diff` timestamp

      var curr = Number(new Date());
      var ms = curr - (prevTime || curr);
      self.diff = ms;
      self.prev = prevTime;
      self.curr = curr;
      prevTime = curr;
      args[0] = createDebug.coerce(args[0]);

      if (typeof args[0] !== 'string') {
        // Anything else let's inspect with %O
        args.unshift('%O');
      } // Apply any `formatters` transformations


      var index = 0;
      args[0] = args[0].replace(/%([a-zA-Z%])/g, function (match, format) {
        // If we encounter an escaped % then don't increase the array index
        if (match === '%%') {
          return '%';
        }

        index++;
        var formatter = createDebug.formatters[format];

        if (typeof formatter === 'function') {
          var val = args[index];
          match = formatter.call(self, val); // Now we need to remove `args[index]` since it's inlined in the `format`

          args.splice(index, 1);
          index--;
        }

        return match;
      }); // Apply env-specific formatting (colors, etc.)

      createDebug.formatArgs.call(self, args);
      var logFn = self.log || createDebug.log;
      logFn.apply(self, args);
    }

    debug.namespace = namespace;
    debug.useColors = createDebug.useColors();
    debug.color = createDebug.selectColor(namespace);
    debug.extend = extend;
    debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

    Object.defineProperty(debug, 'enabled', {
      enumerable: true,
      configurable: false,
      get: function get() {
        return enableOverride === null ? createDebug.enabled(namespace) : enableOverride;
      },
      set: function set(v) {
        enableOverride = v;
      }
    }); // Env-specific initialization logic for debug instances

    if (typeof createDebug.init === 'function') {
      createDebug.init(debug);
    }

    return debug;
  }

  function extend(namespace, delimiter) {
    var newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
    newDebug.log = this.log;
    return newDebug;
  }
  /**
  * Enables a debug mode by namespaces. This can include modes
  * separated by a colon and wildcards.
  *
  * @param {String} namespaces
  * @api public
  */


  function enable(namespaces) {
    createDebug.save(namespaces);
    createDebug.names = [];
    createDebug.skips = [];
    var i;
    var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
    var len = split.length;

    for (i = 0; i < len; i++) {
      if (!split[i]) {
        // ignore empty strings
        continue;
      }

      namespaces = split[i].replace(/\*/g, '.*?');

      if (namespaces[0] === '-') {
        createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
      } else {
        createDebug.names.push(new RegExp('^' + namespaces + '$'));
      }
    }
  }
  /**
  * Disable debug output.
  *
  * @return {String} namespaces
  * @api public
  */


  function disable() {
    var namespaces = [].concat(_toConsumableArray(createDebug.names.map(toNamespace)), _toConsumableArray(createDebug.skips.map(toNamespace).map(function (namespace) {
      return '-' + namespace;
    }))).join(',');
    createDebug.enable('');
    return namespaces;
  }
  /**
  * Returns true if the given mode name is enabled, false otherwise.
  *
  * @param {String} name
  * @return {Boolean}
  * @api public
  */


  function enabled(name) {
    if (name[name.length - 1] === '*') {
      return true;
    }

    var i;
    var len;

    for (i = 0, len = createDebug.skips.length; i < len; i++) {
      if (createDebug.skips[i].test(name)) {
        return false;
      }
    }

    for (i = 0, len = createDebug.names.length; i < len; i++) {
      if (createDebug.names[i].test(name)) {
        return true;
      }
    }

    return false;
  }
  /**
  * Convert regexp to namespace
  *
  * @param {RegExp} regxep
  * @return {String} namespace
  * @api private
  */


  function toNamespace(regexp) {
    return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, '*');
  }
  /**
  * Coerce `val`.
  *
  * @param {Mixed} val
  * @return {Mixed}
  * @api private
  */


  function coerce(val) {
    if (val instanceof Error) {
      return val.stack || val.message;
    }

    return val;
  }
  /**
  * XXX DO NOT USE. This is a temporary stub function.
  * XXX It WILL be removed in the next major release.
  */


  function destroy() {
    console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
  }

  createDebug.enable(createDebug.load());
  return createDebug;
}

module.exports = setup;

/***/ }),

/***/ "./packages/client/lib/common/cryptographic.js":
/*!*****************************************************!*\
  !*** ./packages/client/lib/common/cryptographic.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Simply "stolen" from feathers-offline-xxx
var md5 = __webpack_require__(/*! md5 */ "../node_modules/md5/md5.js");

var _require = __webpack_require__(/*! nanoid */ "../node_modules/nanoid/index.dev.js"),
    nanoid = _require.nanoid;

var _require2 = __webpack_require__(/*! ./misc */ "./packages/client/lib/common/misc.js"),
    stripProps = _require2.stripProps; // Integrity of short unique identifiers: https://github.com/dylang/shortid/issues/81#issuecomment-259812835


function genUuid(ifShortUuid) {
  return ifShortUuid ? nanoid(10) : nanoid(21);
}

function hash(value) {
  value = typeof value === 'string' ? value : JSON.stringify(value);
  return md5(value);
}

function hashOfRecord(record) {
  return hash(stripProps(record, ['id', '_id']));
}

module.exports = {
  genUuid: genUuid,
  hash: hash,
  hashOfRecord: hashOfRecord
};

/***/ }),

/***/ "./packages/client/lib/common/index.js":
/*!*********************************************!*\
  !*** ./packages/client/lib/common/index.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var to = __webpack_require__(/*! ./to */ "./packages/client/lib/common/to.js");

var cryptographic = __webpack_require__(/*! ./cryptographic */ "./packages/client/lib/common/cryptographic.js");

var misc = __webpack_require__(/*! ./misc */ "./packages/client/lib/common/misc.js");

var OptionsProxy = __webpack_require__(/*! ./options-proxy */ "./packages/client/lib/common/options-proxy.js");

var stringsToDates = __webpack_require__(/*! ./strings-to-dates */ "./packages/client/lib/common/strings-to-dates.js");

module.exports = Object.assign(Object.assign(Object.assign({
  to: to
}, cryptographic), misc), {
  OptionsProxy: OptionsProxy,
  stringsToDates: stringsToDates
});

/***/ }),

/***/ "./packages/client/lib/common/misc.js":
/*!********************************************!*\
  !*** ./packages/client/lib/common/misc.js ***!
  \********************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var cloneDeep_1 = __importDefault(__webpack_require__(/*! lodash/cloneDeep */ "./node_modules/lodash/cloneDeep.js")); // Let's hide(/abstract) how we clone an object


var clone = cloneDeep_1["default"];
/**
 * Is the supplied object `value` an object proper?
 *
 * @param {*} value The "object" to be tested
 * @return {Boolean} The result of the test
 */

function isObject(value) {
  return _typeof(value) === 'object' && !Array.isArray(value) && value !== null;
}
/**
 * Strip properties from an result set
 *
 * @param {*} obj The result set to be gleaned
 * @param {*} blacklist A list of properties to strip or a string of a single property
 * @return {*} The result
 */


function stripProps(obj, blacklist) {
  blacklist = Array.isArray(blacklist) ? blacklist : blacklist || [];
  var res = {};
  Object.keys(obj).forEach(function (prop) {
    if (blacklist.indexOf(prop) === -1) {
      var value = obj[prop];
      res[prop] = isObject(value) ? stripProps(value, blacklist) : value;
    }
  });
  return res;
}

module.exports = {
  clone: clone,
  isObject: isObject,
  stripProps: stripProps
};

/***/ }),

/***/ "./packages/client/lib/common/options-proxy.js":
/*!*****************************************************!*\
  !*** ./packages/client/lib/common/options-proxy.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var debug = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js")('@feathersjs-offline:ownclass:options-proxy');

var depends = {};
var watchingFn = [];
var ix = 0;

module.exports = /*#__PURE__*/function () {
  function OptionsProxy(name) {
    _classCallCheck(this, OptionsProxy);

    if (name === undefined) {
      throw new Error("OptionsProxy: Sorry, you must supply a name to proxy.");
    } // if (depends[name]) {
    //   throw new Error(`OptionsProxy: Sorry, you have already proxied '${name}'.`);
    // }


    this.name = name
    /*+ ++ix*/
    ;
    depends[this.name] = [];
    watchingFn[this.name] = null;
    debug("Constructed proxy for '".concat(this.name));
  }
  /**
   * Package the data to be observed in a proxy that updates according to
   * relevant recipes registered with watcher().
   * @param {object} data The data object to observe
   */


  _createClass(OptionsProxy, [{
    key: "observe",
    value: function observe(data) {
      var self = this;
      return new Proxy(data, {
        get: function get(obj, key) {
          if (watchingFn[self.name]) {
            if (!depends[self.name][key]) depends[self.name][key] = [];
            depends[self.name][key].push(watchingFn[self.name]);
          }

          var res = obj[key];
          debug("".concat(self.name, ": get(").concat(key, ") = ").concat(JSON.stringify(res)));
          return res;
        },
        set: function set(obj, key, val) {
          debug("".concat(self.name, ": set(").concat(key, ", ").concat(JSON.stringify(val), ")"));
          obj[key] = val;
          if (depends[self.name][key]) depends[self.name][key].forEach(function (cb) {
            return cb();
          });
          return true;
        }
      });
    }
    /**
     * Register a handler for the observer proxy
     * @param {function} target The handler function
     */

  }, {
    key: "watcher",
    value: function watcher(target) {
      watchingFn[this.name] = target;
      target();
      watchingFn[this.name] = null;
    }
  }]);

  return OptionsProxy;
}();

/***/ }),

/***/ "./packages/client/lib/common/strings-to-dates.js":
/*!********************************************************!*\
  !*** ./packages/client/lib/common/strings-to-dates.js ***!
  \********************************************************/
/***/ ((module) => {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// Convert ISO date strings to Date objects in FeathersJS result sets
// Inspired by https://stackoverflow.com/questions/14488745/javascript-json-date-deserialization
var stringsToDates = function stringsToDates(active) {
  return function (result) {
    var regexDate = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/i;

    function jsonDate(obj) {
      var type = _typeof(obj);

      if (type === 'object') {
        for (var p in obj) {
          if (obj.hasOwnProperty(p)) obj[p] = jsonDate(obj[p]);
        }

        return obj;
      } else if (type === 'string' && regexDate.test(obj)) {
        return new Date(obj);
      }

      return obj;
    }

    if (active) {
      if (Array.isArray(result)) return result.map(jsonDate);else if (result.data) {
        result.data = result.data.map(jsonDate);
        return result;
      } else return jsonDate(result);
    } else return result;
  };
};

module.exports = stringsToDates;

/***/ }),

/***/ "./packages/client/lib/common/to.js":
/*!******************************************!*\
  !*** ./packages/client/lib/common/to.js ***!
  \******************************************/
/***/ ((module) => {

/**
 * Transforms a promise for "await" to return both error and result so you don't
 * have to wrap promises in try catch
 * @example ```
 * let [ error, result ] = await to(promise)
 * ```
 * @author Jon Paul Miles
 */
var to = function to(promise) {
  return promise.then(function (result) {
    return [null, result];
  })["catch"](function (err) {
    return [err, null];
  });
};

module.exports = to;

/***/ }),

/***/ "./packages/client/lib/index.js":
/*!**************************************!*\
  !*** ./packages/client/lib/index.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Main module for client
var _require = __webpack_require__(/*! ./common */ "./packages/client/lib/common/index.js"),
    to = _require.to,
    isObject = _require.isObject,
    stripProps = _require.stripProps,
    genUuid = _require.genUuid,
    hash = _require.hash,
    hashOfRecord = _require.hashOfRecord;

var _require2 = __webpack_require__(/*! ./owndata */ "./packages/client/lib/owndata/index.js"),
    Owndata = _require2.Owndata,
    owndataWrapper = _require2.owndataWrapper;

var _require3 = __webpack_require__(/*! ./ownnet */ "./packages/client/lib/ownnet/index.js"),
    Ownnet = _require3.Ownnet,
    ownnetWrapper = _require3.ownnetWrapper;

module.exports = {
  to: to,
  isObject: isObject,
  stripProps: stripProps,
  genUuid: genUuid,
  hash: hash,
  hashOfRecord: hashOfRecord,
  Owndata: Owndata,
  owndataWrapper: owndataWrapper,
  Ownnet: Ownnet,
  ownnetWrapper: ownnetWrapper
};

/***/ }),

/***/ "./packages/client/lib/own-common/index.js":
/*!*************************************************!*\
  !*** ./packages/client/lib/own-common/index.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var OwnClass = __webpack_require__(/*! ./own-class */ "./packages/client/lib/own-common/own-class.js");

module.exports = OwnClass;

/***/ }),

/***/ "./packages/client/lib/own-common/own-class.js":
/*!*****************************************************!*\
  !*** ./packages/client/lib/own-common/own-class.js ***!
  \*****************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _readOnlyError(name) { throw new TypeError("\"" + name + "\" is read-only"); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var adapter_commons_1 = __webpack_require__(/*! @feathersjs/adapter-commons */ "../node_modules/@feathersjs/adapter-commons/lib/index.js");

var errors_1 = __importDefault(__webpack_require__(/*! @feathersjs/errors */ "../node_modules/@feathersjs/errors/lib/index.js"));

var localforage_1 = __importDefault(__webpack_require__(/*! @feathersjs-offline/localforage */ "../localforage/lib/index.js"));

var feathers_localstorage_1 = __importDefault(__webpack_require__(/*! feathers-localstorage */ "../node_modules/feathers-localstorage/lib/index.js"));

var sift_1 = __importDefault(__webpack_require__(/*! sift */ "../node_modules/sift/es5m/index.js"));

var common_1 = __webpack_require__(/*! ../common */ "./packages/client/lib/common/index.js");

var snapshot_1 = __importDefault(__webpack_require__(/*! ../snapshot */ "./packages/client/lib/snapshot/index.js"));

var common_2 = __webpack_require__(/*! ../common */ "./packages/client/lib/common/index.js");

var LocalForage = localforage_1["default"].LocalForage;

var debug = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js")('@feathersjs-offline:ownclass:service-base');

var defaultOptions = {
  'id': 'id',
  'store': null,
  'storage': null,
  'useShortUuid': true,
  'throttle': null,
  'timedSync': 24 * 60 * 60 * 1000,
  'adapterTest': false,
  'matcher': sift_1["default"],
  sorter: adapter_commons_1.sorter,
  'fixedName': '',
  'dates': false
};
var Drivers = {
  INDEXEDDB: 'asyncStorage',
  WEBSQL: 'webSQLStorage',
  LOCALSTORAGE: 'localStorageWrapper'
};
var States = {
  started: 'started',
  ended: 'ended'
};
var SYNC_DB_NAME = '@@@syncedAt@@@';
var BOT = new Date(0);
var _adapterTestStrip = ['uuid', 'updatedAt', 'onServerAt', 'deletedAt'];
var nameIx = 0;

var attrStrip = function attrStrip() {
  for (var _len = arguments.length, attr = new Array(_len), _key = 0; _key < _len; _key++) {
    attr[_key] = arguments[_key];
  }

  return function (res) {
    return Array.isArray(res) ? res.map(function (val) {
      return (0, common_2.stripProps)(val, attr);
    }) : (0, common_2.stripProps)(res, attr);
  };
};

var OwnClass = /*#__PURE__*/function (_adapter_commons_1$Ad) {
  _inherits(OwnClass, _adapter_commons_1$Ad);

  var _super = _createSuper(OwnClass);

  function OwnClass(opts) {
    var _this;

    _classCallCheck(this, OwnClass);

    var newOpts = Object.assign({}, defaultOptions, opts);
    debug("Constructor started, newOpts = ".concat(JSON.stringify(newOpts), ", allOpts = ").concat(Object.keys(newOpts)));
    _this = _super.call(this, newOpts);
    _this.wrapperOptions = Object.assign({}, newOpts, _this.options);
    _this.wrapperOptions.storage = newOpts.storage;
    debug("Constructor ended, options = ".concat(JSON.stringify(_this.wrapperOptions), ", allOpts = ").concat(Object.keys(newOpts)));
    _this.type = 'own-class';
    debug("   Setting _select..."); // Make sure we always select the key (id) in our results

    _this._select = function (params) {
      for (var _len2 = arguments.length, others = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        others[_key2 - 1] = arguments[_key2];
      }

      return function (res) {
        return (0, adapter_commons_1.select).apply(void 0, [params].concat(others, [_this.id]))(res);
      };
    }; // Initialize the service wrapper


    _this.listening = false;
    _this.aIP = 0; // Our semaphore for internal processing

    _this.pQActive = false; // Our flag for avoiding more than one processing of queued operations at a time

    debug('  Done.');
    return _possibleConstructorReturn(_this, _assertThisInitialized(_this));
  }

  _createClass(OwnClass, [{
    key: "awaitSetup",
    value: function awaitSetup() {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(this._setupPerformed !== States.ended)) {
                  _context.next = 6;
                  break;
                }

                debug("awaitSetup...");
                _context.next = 4;
                return this.delay(200);

              case 4:
                _context.next = 0;
                break;

              case 6:
                return _context.abrupt("return", true);

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));
    }
  }, {
    key: "_setup",
    value: function _setup(app, path) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                debug("_SetUp('".concat(path, "') started"));
                return _context2.abrupt("return", this.setup(app, path));

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));
    }
  }, {
    key: "setup",
    value: function setup(app, path) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var self, old, localStorageDriver, storage, localOptions, queueOptions, stripValues, idIx, value;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                self = this;

                if (!this._setupPerformed) {
                  _context3.next = 3;
                  break;
                }

                return _context3.abrupt("return");

              case 3:
                debug("SetUp('".concat(path, "') started"));
                this._setupPerformed = States.started;
                this.options = Object.assign({}, this.wrapperOptions);
                debug("   Options '".concat(JSON.stringify(this.options), "')"));
                this._dates = this.options.dates;
                this.thisName = this.options.fixedName !== '' ? this.options.fixedName : "".concat(this.type, "_offline_").concat(nameIx++, "_").concat(path);
                debug("SetUp('".concat(path, "') before old app...")); // Now we are ready to define the path with its underlying service (the remoteService)

                old = app.service(path);

                if (old !== self) {
                  this.remoteService = old; // We want to get the default service (redirects to server or points to a local service)

                  app.use(path, self); // Install this service instance
                } // Make sure that the wrapped service is setup correctly


                if (!(typeof this.remoteService.setup === 'function')) {
                  _context3.next = 17;
                  break;
                }

                debug("   Setting up remote service...");
                _context3.next = 16;
                return this.remoteService.setup(app, path);

              case 16:
                this.options = Object.assign({}, this.wrapperOptions, this.options);

              case 17:
                debug("SetUp('".concat(path, "') after old app...")); // Get the service name and standard settings

                this.name = path; // Construct two helper services

                this.localServiceName = this.thisName + '_local';
                this.localServiceQueue = this.thisName + '_queue'; // Make sure the driver is correct

                debug("  Setting up storage...");
                localStorageDriver = null;

                if (this.options.storage && !Array.isArray(this.options.storage) && this.options.storage.toUpperCase() === 'ASYNCSTORAGE') {
                  localStorageDriver = feathers_localstorage_1["default"];
                  this.storage = __webpack_require__.g.AsyncStorage;
                  this.options.throttle = 1;
                } else {
                  localStorageDriver = localforage_1["default"];
                  storage = this.options.storage ? this.options.storage : 'LOCALSTORAGE';

                  if (!Array.isArray(storage)) {
                    storage = [storage];
                  }

                  this.storage = storage.map(function (s) {
                    var driver = Drivers[s.toUpperCase()];
                    if (!driver) throw new errors_1["default"].NotFound("Illegal driver type '".concat(s, "' found. Please use either a combination of 'LOCALSTORAGE', 'WEBSQL', and 'INDEXEDDB' or for React 'ASYNCSTORAGE'."));
                    return driver;
                  });
                }

                debug("   Storage=".concat(this.storage));
                this.store = this.options.store ? this.options.store : [];
                this.localSpecOptions = {
                  name: this.localServiceName,
                  storage: this.storage,
                  store: this.store,
                  reuseKeys: this.options.fixedName !== '',
                  events: ['synced'],
                  dates: this.options.dates
                };
                localOptions = Object.assign({}, this.options, this.localSpecOptions);
                queueOptions = {
                  id: 'id',
                  name: this.localServiceQueue,
                  storage: this.storage,
                  paginate: null,
                  multi: true,
                  reuseKeys: this.options.fixedName !== ''
                };
                debug("   Setting up service '".concat(this.localServiceName, "' with options '").concat(JSON.stringify(localOptions), "'..."));
                app.use(this.localServiceName, localStorageDriver(localOptions));
                debug("   Setting up service '".concat(this.localServiceQueue, "' with options '").concat(JSON.stringify(queueOptions), "'..."));
                app.use(this.localServiceQueue, localStorageDriver(queueOptions));
                this.localService = app.service(this.localServiceName);
                this.localQueue = app.service(this.localServiceQueue);
                debug("   Adding syncDB...");
                app.use(SYNC_DB_NAME, localStorageDriver({
                  name: SYNC_DB_NAME,
                  storage: this.storage,
                  reuseKeys: true
                }));
                this.syncDB = app.service(SYNC_DB_NAME);
                debug("   AdapterTest=".concat(this.options.adapterTest, "...")); // Are we running adapterTests?

                if (this.options.adapterTest) {
                  // Make sure the '_adapterTestStrip' attributes are stripped from results
                  // However, we need to allow for having uuid as key
                  stripValues = Object.assign([], _adapterTestStrip);
                  idIx = stripValues.findIndex(function (v) {
                    return v === self.id;
                  });
                  if (idIx > -1) stripValues.splice(idIx, 1);
                  this._strip = attrStrip.apply(void 0, _toConsumableArray(stripValues));
                } else {
                  this._strip = function (v) {
                    return v;
                  };
                } // Determine latest registered sync timestamp


                debug("   Determine latest registered sync timestamp (if any)...");
                value = this.getSyncItem(false);
                this.syncedAt = new Date(value || BOT).toISOString();
                debug("   Sync timestamp is found... ".concat(this.syncedAt));
                value = this.setSyncItem(this.syncedAt);
                debug("   Sync timestamp is stored!");
                debug("   Restore options..."); // The re-initialization/setup of the localService adapter can screw-up our options object

                this.options = Object.assign({}, this.wrapperOptions); // This is necessary if we get updates to options (e.g. .options.multi = ['patch'])

                if (!(this.remoteService instanceof adapter_commons_1.AdapterService)) {
                  debug("   Adding options listener...");

                  this._listenOptions();
                } // Should we perform a sync every timedSync?


                if (this.options.timedSync && Number.isInteger(this.options.timedSync) && this.options.timedSync > 0) {
                  debug("   Setting up timed-sync every ".concat(JSON.stringify(self.options.timedSync), " ms..."));
                  this._timedSyncHandle = setInterval(function () {
                    return self.sync();
                  }, self.options.timedSync);
                }

                debug("   Options '".concat(JSON.stringify(this.options), "')"));
                debug('  Done.');
                this._setupPerformed = States.ended;
                return _context3.abrupt("return", true);

              case 54:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));
    } // syncDB functions

  }, {
    key: "getSyncItem",
    value: function getSyncItem() {
      var failOnMissing = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var key = this.thisName + '_syncedAt';
      var res = this.syncDB.get(key).then(function (res) {
        return res;
      })["catch"](function (err) {
        if (failOnMissing) throw new errors_1["default"].GeneralError("Error get syncDB: key=".concat(key, " ").concat(err.name, ", ").concat(err.message));
      });
      return res ? res.value : BOT.toISOString();
    }
  }, {
    key: "setSyncItem",
    value: function setSyncItem(value) {
      var _this2 = this;

      var key = this.thisName + '_syncedAt';
      var res = this.syncDB.get(key).then(function (resVal) {
        _this2.syncDB.update(key, {
          id: key,
          value: value
        })["catch"](function (err) {
          throw new errors_1["default"].GeneralError("Error updating syncDB: id=".concat(id, " ").concat(err.name, ", ").concat(err.message));
        });

        return resVal;
      })["catch"](function (err) {
        return _this2.syncDB.create({
          id: key,
          value: value
        })["catch"](function (err) {
          throw new errors_1["default"].GeneralError("Error creating syncDB: key=".concat(key, ", value=").concat(value, ": ").concat(err.name, ", ").concat(err.message));
        });
      });
      return res;
    }
  }, {
    key: "delay",
    value: function delay(ms) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt("return", new Promise(function (resolve) {
                  setTimeout(function () {
                    resolve(true);
                  }, ms);
                }));

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));
    }
  }, {
    key: "_listenOptions",
    value: function _listenOptions() {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
        var _this3 = this;

        var self, optProxy;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                // This is necessary if we get updates to options (e.g. .options.multi = ['patch'])
                self = this;
                optProxy = new common_1.OptionsProxy(self.thisName);
                this.options = optProxy.observe(Object.assign({}, self.remote.options ? self.remote.options : {}, self.options));
                optProxy.watcher(function () {
                  return __awaiter(_this3, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
                    return regeneratorRuntime.wrap(function _callee5$(_context5) {
                      while (1) {
                        switch (_context5.prev = _context5.next) {
                          case 0:
                            if (!(self.remote === undefined)) {
                              _context5.next = 6;
                              break;
                            }

                            debug("REMOTE STILL UNDEFINED");
                            _context5.next = 4;
                            return this.delay(10);

                          case 4:
                            _context5.next = 0;
                            break;

                          case 6:
                            if (!(self.local === undefined)) {
                              _context5.next = 12;
                              break;
                            }

                            debug("LOCAL STILL UNDEFINED");
                            _context5.next = 10;
                            return this.delay(10);

                          case 10:
                            _context5.next = 6;
                            break;

                          case 12:
                            self.remote.options = Object.assign({}, self.remote.options, self.options);
                            self.local.options = Object.assign({}, self.options, self.localSpecOptions);

                          case 14:
                          case "end":
                            return _context5.stop();
                        }
                      }
                    }, _callee5, this);
                  }));
                });

              case 4:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));
    }
  }, {
    key: "getEntries",
    value: function getEntries(params) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
        var res;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                debug("Calling getEntries(".concat(JSON.stringify(params), "}), thisName=").concat(this.thisName));
                _context7.next = 3;
                return this.awaitSetup();

              case 3:
                res = [];
                _context7.next = 6;
                return this.localService.getEntries(params).then(function (entries) {
                  res = entries;
                });

              case 6:
                return _context7.abrupt("return", Promise.resolve(res).then(this._strip).then(this._select(params)).then((0, common_1.stringsToDates)(this._dates)).then(function (result) {
                  debug("getEntries: result=".concat(JSON.stringify(result)));
                  return result;
                }));

              case 7:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));
    }
  }, {
    key: "get",
    value: function get(id, params) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                debug("Calling get(".concat(JSON.stringify(id), ", ").concat(JSON.stringify(params), ")"));
                _context8.next = 3;
                return this.awaitSetup();

              case 3:
                return _context8.abrupt("return", this._get(id, params));

              case 4:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));
    }
  }, {
    key: "_get",
    value: function _get(id, params) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                debug("Calling _get(".concat(JSON.stringify(id), ", ").concat(JSON.stringify(params), "})"));
                _context9.next = 3;
                return this.awaitSetup();

              case 3:
                _context9.next = 5;
                return this.localService.get(id, params).then(this._strip).then(this._select(params)).then((0, common_1.stringsToDates)(this._dates))["catch"](function (err) {
                  throw err;
                });

              case 5:
                return _context9.abrupt("return", _context9.sent);

              case 6:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));
    }
  }, {
    key: "find",
    value: function find(params) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                debug("Calling find(".concat(JSON.stringify(params), "})"));
                _context10.t0 = debug;
                _context10.t1 = "  rows=";
                _context10.t2 = JSON;
                _context10.next = 6;
                return this.getEntries();

              case 6:
                _context10.t3 = _context10.sent;
                _context10.t4 = _context10.t2.stringify.call(_context10.t2, _context10.t3);
                _context10.t5 = _context10.t1.concat.call(_context10.t1, _context10.t4);
                (0, _context10.t0)(_context10.t5);
                _context10.next = 12;
                return this.awaitSetup();

              case 12:
                return _context10.abrupt("return", this._find(params));

              case 13:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));
    }
  }, {
    key: "_find",
    value: function _find(params) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                debug("Calling _find(".concat(JSON.stringify(params), "})"));
                _context11.next = 3;
                return this.awaitSetup();

              case 3:
                return _context11.abrupt("return", this.localService.find(params).then(this._strip).then(this._select(params)).then((0, common_1.stringsToDates)(this._dates)));

              case 4:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));
    }
  }, {
    key: "create",
    value: function create(data, params) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                debug("Calling create(".concat(JSON.stringify(data), ", ").concat(JSON.stringify(params), ")"));
                _context12.next = 3;
                return this.awaitSetup();

              case 3:
                if (!(Array.isArray(data) && !this.allowsMulti('create'))) {
                  _context12.next = 5;
                  break;
                }

                return _context12.abrupt("return", Promise.reject(new errors_1["default"].MethodNotAllowed('Creating multiple without option \'multi\' set')));

              case 5:
                return _context12.abrupt("return", this._create(data, params));

              case 6:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));
    }
  }, {
    key: "_create",
    value: function _create(data, params) {
      var ts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee15() {
        var _this4 = this;

        var self, multi, timestamp, newData, _yield, _yield2, err, res, newParams, queueId, _yield3, _yield4;

        return regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                debug("Calling _create(".concat(JSON.stringify(data), ", ").concat(JSON.stringify(params), ", ").concat(ts, ")"));
                _context15.next = 3;
                return this.awaitSetup();

              case 3:
                self = this;

                if (!Array.isArray(data)) {
                  _context15.next = 10;
                  break;
                }

                multi = this.allowsMulti('create');

                if (multi) {
                  _context15.next = 8;
                  break;
                }

                return _context15.abrupt("return", Promise.reject(new errors_1["default"].MethodNotAllowed('Creating multiple without option \'multi\' set')));

              case 8:
                timestamp = new Date(); // In future version we will user Promise.allSettled() instead...

                return _context15.abrupt("return", Promise.all(data.map(function (current) {
                  return self._create(current, params, timestamp);
                })));

              case 10:
                ts = ts || new Date();
                newData = (0, common_1.clone)(data); // As we do not know if the server is connected we have to make sure the important
                // values are set with reasonable values

                if (!('uuid' in newData)) {
                  newData.uuid = (0, common_1.genUuid)(this.options.useShortUuid);
                }

                if (!('updatedAt' in newData)) {
                  newData.updatedAt = ts;
                } // We do not allow the client to set the onServerAt attribute to other than default '0'


                newData.onServerAt = BOT; // Is uuid unique?

                _context15.next = 17;
                return (0, common_1.to)(this.localService.find({
                  query: {
                    'uuid': newData.uuid
                  }
                }));

              case 17:
                _yield = _context15.sent;
                _yield2 = _slicedToArray(_yield, 2);
                err = _yield2[0];
                res = _yield2[1];

                if (!(res && res.length)) {
                  _context15.next = 23;
                  break;
                }

                throw new errors_1["default"].BadRequest("Optimistic create requires unique uuid. (".concat(this.type, ") res=").concat(JSON.stringify(res)));

              case 23:
                // We apply optimistic mutation
                newParams = (0, common_1.clone)(params);
                this.disallowInternalProcessing('_create');
                _context15.next = 27;
                return this._addQueuedEvent('create', newData, (0, common_1.clone)(newData), params);

              case 27:
                queueId = _context15.sent;
                _context15.next = 30;
                return (0, common_1.to)(this.localService.create(newData, (0, common_1.clone)(params)));

              case 30:
                _yield3 = _context15.sent;
                _yield4 = _slicedToArray(_yield3, 2);
                err = _yield4[0];
                res = _yield4[1];

                if (!res) {
                  _context15.next = 38;
                  break;
                }

                this.remoteService.create(res, (0, common_1.clone)(params)).then(function (rres) {
                  return __awaiter(_this4, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
                    return regeneratorRuntime.wrap(function _callee13$(_context13) {
                      while (1) {
                        switch (_context13.prev = _context13.next) {
                          case 0:
                            _context13.next = 2;
                            return (0, common_1.to)(self._removeQueuedEvent('_create0', queueId, newData, newData.updatedAt));

                          case 2:
                            _context13.next = 4;
                            return self._patchIfNotRemoved(rres[self.id], rres);

                          case 4:
                            // Ok, we have connection - empty queue if we have any items queued
                            self.allowInternalProcessing('_create0');
                            _context13.next = 7;
                            return (0, common_1.to)(self._processQueuedEvents());

                          case 7:
                          case "end":
                            return _context13.stop();
                        }
                      }
                    }, _callee13);
                  }));
                })["catch"](function (rerr) {
                  return __awaiter(_this4, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
                    return regeneratorRuntime.wrap(function _callee14$(_context14) {
                      while (1) {
                        switch (_context14.prev = _context14.next) {
                          case 0:
                            if (!(rerr.name !== 'Timeout')) {
                              _context14.next = 5;
                              break;
                            }

                            _context14.next = 3;
                            return (0, common_1.to)(self._removeQueuedEvent('_create1', queueId, rerr.message
                            /*newData*/
                            , newData.updatedAt));

                          case 3:
                            _context14.next = 5;
                            return (0, common_1.to)(self.localService.remove(res[self.id], params));

                          case 5:
                            self.allowInternalProcessing('_create1');

                          case 6:
                          case "end":
                            return _context14.stop();
                        }
                      }
                    }, _callee14);
                  }));
                });
                _context15.next = 42;
                break;

              case 38:
                _context15.next = 40;
                return (0, common_1.to)(this._removeQueuedEvent('_create2', queueId, newData, newData.updatedAt));

              case 40:
                this.allowInternalProcessing('_create2');
                throw err;

              case 42:
                return _context15.abrupt("return", Promise.resolve(res).then(this._strip).then(this._select(params)).then((0, common_1.stringsToDates)(this._dates)));

              case 43:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));
    }
  }, {
    key: "update",
    value: function update(id, data, params) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee16() {
        return regeneratorRuntime.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                debug("Calling update(".concat(id, ", ").concat(JSON.stringify(data), ", ").concat(JSON.stringify(params), "})"));
                _context16.next = 3;
                return this.awaitSetup();

              case 3:
                if (!(id === null || Array.isArray(data))) {
                  _context16.next = 5;
                  break;
                }

                return _context16.abrupt("return", Promise.reject(new errors_1["default"].BadRequest("You can not replace multiple instances. Did you mean 'patch'?")));

              case 5:
                return _context16.abrupt("return", this._update(id, data, params));

              case 6:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));
    }
  }, {
    key: "_update",
    value: function _update(id, data) {
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee19() {
        var _this5 = this;

        var self, _yield5, _yield6, err, res, beforeRecord, beforeUuid, newData, queueId, _yield7, _yield8;

        return regeneratorRuntime.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                debug("Calling _update(".concat(id, ", ").concat(JSON.stringify(data), ", ").concat(JSON.stringify(params), "})"));
                _context19.next = 3;
                return this.awaitSetup();

              case 3:
                self = this;

                if (!(id === null || Array.isArray(data))) {
                  _context19.next = 6;
                  break;
                }

                return _context19.abrupt("return", Promise.reject(new errors_1["default"].BadRequest("You can not replace multiple instances. Did you mean 'patch'?")));

              case 6:
                _context19.next = 8;
                return (0, common_1.to)(this.localService._get(id));

              case 8:
                _yield5 = _context19.sent;
                _yield6 = _slicedToArray(_yield5, 2);
                err = _yield6[0];
                res = _yield6[1];

                if (res && res !== {}) {
                  _context19.next = 14;
                  break;
                }

                throw new errors_1["default"].NotFound("Trying to update non-existing ".concat(this.id, "=").concat(id, ". (").concat(this.type, ") err=").concat(JSON.stringify(err.name)));

              case 14:
                // We don't want our uuid to change type if it can be coerced
                beforeRecord = (0, common_1.clone)(res);
                beforeUuid = beforeRecord.uuid;
                newData = (0, common_1.clone)(data);
                newData.uuid = beforeUuid; // eslint-disable-line

                newData.updatedAt = new Date();
                newData.onServerAt = BOT; // Optimistic mutation

                this.disallowInternalProcessing('_update');
                _context19.next = 23;
                return this._addQueuedEvent('update', newData, id, (0, common_1.clone)(newData), params);

              case 23:
                queueId = _context19.sent;
                _context19.next = 26;
                return (0, common_1.to)(this.localService.update(id, newData, (0, common_1.clone)(params)));

              case 26:
                _yield7 = _context19.sent;
                _yield8 = _slicedToArray(_yield7, 2);
                err = _yield8[0];
                res = _yield8[1];

                if (err) {
                  _context19.next = 34;
                  break;
                }

                this.remoteService.update(id, res, (0, common_1.clone)(params)).then(function (rres) {
                  return __awaiter(_this5, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee17() {
                    return regeneratorRuntime.wrap(function _callee17$(_context17) {
                      while (1) {
                        switch (_context17.prev = _context17.next) {
                          case 0:
                            _context17.next = 2;
                            return (0, common_1.to)(self._removeQueuedEvent('_update0', queueId, newData, res.updatedAt));

                          case 2:
                            _context17.next = 4;
                            return self._patchIfNotRemoved(rres[self.id], rres);

                          case 4:
                            self.allowInternalProcessing('_update0');
                            _context17.next = 7;
                            return (0, common_1.to)(self._processQueuedEvents());

                          case 7:
                          case "end":
                            return _context17.stop();
                        }
                      }
                    }, _callee17);
                  }));
                })["catch"](function (rerr) {
                  return __awaiter(_this5, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee18() {
                    return regeneratorRuntime.wrap(function _callee18$(_context18) {
                      while (1) {
                        switch (_context18.prev = _context18.next) {
                          case 0:
                            if (!(rerr.name === 'Timeout')) {
                              _context18.next = 4;
                              break;
                            }

                            debug("_update TIMEOUT: ".concat(rerr.name, ", ").concat(rerr.message)); // Let's silently ignore missing connection to server
                            // We'll catch-up next time we get a connection

                            _context18.next = 9;
                            break;

                          case 4:
                            debug("_update ERROR: ".concat(rerr.name, ", ").concat(rerr.message));
                            _context18.next = 7;
                            return (0, common_1.to)(self._removeQueuedEvent('_update1', queueId, newData, res.updatedAt));

                          case 7:
                            _context18.next = 9;
                            return (0, common_1.to)(self.localService.patch(id, beforeRecord));

                          case 9:
                            self.allowInternalProcessing('_update1');

                          case 10:
                          case "end":
                            return _context18.stop();
                        }
                      }
                    }, _callee18);
                  }));
                });
                _context19.next = 38;
                break;

              case 34:
                _context19.next = 36;
                return (0, common_1.to)(this._removeQueuedEvent('_update2', queueId, newData, newData.updatedAt));

              case 36:
                this.allowInternalProcessing('_update2');
                throw err;

              case 38:
                return _context19.abrupt("return", Promise.resolve(newData).then(this._strip).then(this._select(params)).then((0, common_1.stringsToDates)(this._dates)));

              case 39:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee19, this);
      }));
    }
  }, {
    key: "patch",
    value: function patch(id, data, params) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee20() {
        return regeneratorRuntime.wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                debug("Calling patch(".concat(id, ", ").concat(JSON.stringify(data), ", ").concat(JSON.stringify(params), "})"));
                _context20.next = 3;
                return this.awaitSetup();

              case 3:
                if (!(id === null && !this.allowsMulti('patch'))) {
                  _context20.next = 5;
                  break;
                }

                return _context20.abrupt("return", Promise.reject(new errors_1["default"].MethodNotAllowed("Can not patch multiple entries")));

              case 5:
                return _context20.abrupt("return", this._patch(id, data, params));

              case 6:
              case "end":
                return _context20.stop();
            }
          }
        }, _callee20, this);
      }));
    }
  }, {
    key: "_patch",
    value: function _patch(id, data) {
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var ts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee23() {
        var _this6 = this;

        var self, multi, _yield9, _yield10, err, res, beforeRecord, newData, queueId, _yield11, _yield12;

        return regeneratorRuntime.wrap(function _callee23$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                debug("Calling _patch(".concat(id, ", ").concat(JSON.stringify(data), ", ").concat(JSON.stringify(params), "})"));
                _context23.next = 3;
                return this.awaitSetup();

              case 3:
                self = this;

                if (!(id === null)) {
                  _context23.next = 9;
                  break;
                }

                multi = this.allowsMulti('patch');

                if (multi) {
                  _context23.next = 8;
                  break;
                }

                throw new errors_1["default"].MethodNotAllowed('Patching multiple without option \'multi\' set');

              case 8:
                return _context23.abrupt("return", this.find(params).then(function (page) {
                  var res = page.data ? page.data : page;

                  if (!Array.isArray(res)) {
                    res = (_readOnlyError("res"), [res]);
                  }

                  var timestamp = new Date().toISOString();
                  return Promise.all(res.map(function (current) {
                    return self._patch(current[_this6.id], data, params, timestamp);
                  }));
                }));

              case 9:
                ts = ts || new Date();
                _context23.next = 12;
                return (0, common_1.to)(this.localService._get(id));

              case 12:
                _yield9 = _context23.sent;
                _yield10 = _slicedToArray(_yield9, 2);
                err = _yield10[0];
                res = _yield10[1];

                if (res && res !== {}) {
                  _context23.next = 18;
                  break;
                }

                throw err;

              case 18:
                // Optimistic mutation
                beforeRecord = (0, common_1.clone)(res);
                newData = Object.assign({}, beforeRecord, data);
                newData.onServerAt = BOT;
                newData.updatedAt = ts;
                this.disallowInternalProcessing('_patch');
                _context23.next = 25;
                return this._addQueuedEvent('patch', newData, id, (0, common_1.clone)(newData), params);

              case 25:
                queueId = _context23.sent;
                _context23.next = 28;
                return (0, common_1.to)(this.localService.patch(id, newData, (0, common_1.clone)(params)));

              case 28:
                _yield11 = _context23.sent;
                _yield12 = _slicedToArray(_yield11, 2);
                err = _yield12[0];
                res = _yield12[1];

                if (!res) {
                  _context23.next = 36;
                  break;
                }

                this.remoteService.patch(id, res, (0, common_1.clone)(params)).then(function (rres) {
                  return __awaiter(_this6, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee21() {
                    return regeneratorRuntime.wrap(function _callee21$(_context21) {
                      while (1) {
                        switch (_context21.prev = _context21.next) {
                          case 0:
                            _context21.next = 2;
                            return (0, common_1.to)(self._removeQueuedEvent('_patch0', queueId, rres, res.updatedAt));

                          case 2:
                            _context21.next = 4;
                            return self._patchIfNotRemoved(rres[self.id], rres);

                          case 4:
                            self.allowInternalProcessing('_patch0');
                            _context21.next = 7;
                            return (0, common_1.to)(self._processQueuedEvents());

                          case 7:
                          case "end":
                            return _context21.stop();
                        }
                      }
                    }, _callee21);
                  }));
                })["catch"](function (rerr) {
                  return __awaiter(_this6, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee22() {
                    return regeneratorRuntime.wrap(function _callee22$(_context22) {
                      while (1) {
                        switch (_context22.prev = _context22.next) {
                          case 0:
                            if (!(rerr.name === 'Timeout')) {
                              _context22.next = 4;
                              break;
                            }

                            debug("_patch TIMEOUT: ".concat(rerr.name, ", ").concat(rerr.message)); // Let's silently ignore missing connection to server
                            // We'll catch-up next time we get a connection

                            _context22.next = 9;
                            break;

                          case 4:
                            debug("_patch ERROR: ".concat(rerr.name, ", ").concat(rerr.message));
                            _context22.next = 7;
                            return (0, common_1.to)(self._removeQueuedEvent('_patch1', queueId, newData, res.updatedAt));

                          case 7:
                            _context22.next = 9;
                            return (0, common_1.to)(self.localService.patch(id, beforeRecord));

                          case 9:
                            self.allowInternalProcessing('_patch1');

                          case 10:
                          case "end":
                            return _context22.stop();
                        }
                      }
                    }, _callee22);
                  }));
                });
                _context23.next = 40;
                break;

              case 36:
                _context23.next = 38;
                return (0, common_1.to)(this._removeQueuedEvent('_patch2', queueId, newData, newData.updatedAt));

              case 38:
                this.allowInternalProcessing('_patch2');
                throw err;

              case 40:
                return _context23.abrupt("return", Promise.resolve(newData).then(this._strip).then(this._select(params)).then((0, common_1.stringsToDates)(this._dates)));

              case 41:
              case "end":
                return _context23.stop();
            }
          }
        }, _callee23, this);
      }));
    }
    /**
     * An internal method to patch a localService record if and only if
     * we have not been overtaken by a remove request.
     *
     * @param {any} id
     * @param {any} data
     */

  }, {
    key: "_patchIfNotRemoved",
    value: function _patchIfNotRemoved(id, data) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee24() {
        return regeneratorRuntime.wrap(function _callee24$(_context24) {
          while (1) {
            switch (_context24.prev = _context24.next) {
              case 0:
                return _context24.abrupt("return", this.localService.patch(id, data)["catch"](function (_) {
                  return Promise.resolve(true);
                }));

              case 1:
              case "end":
                return _context24.stop();
            }
          }
        }, _callee24, this);
      }));
    }
  }, {
    key: "remove",
    value: function remove(id, params) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee25() {
        return regeneratorRuntime.wrap(function _callee25$(_context25) {
          while (1) {
            switch (_context25.prev = _context25.next) {
              case 0:
                debug("Calling remove(".concat(id, ", ").concat(JSON.stringify(params), "})"));
                _context25.next = 3;
                return this.awaitSetup();

              case 3:
                if (!(id === null && !this.allowsMulti('remove'))) {
                  _context25.next = 5;
                  break;
                }

                return _context25.abrupt("return", Promise.reject(new errors_1["default"].MethodNotAllowed("Can not remove multiple entries")));

              case 5:
                return _context25.abrupt("return", this._remove(id, params));

              case 6:
              case "end":
                return _context25.stop();
            }
          }
        }, _callee25, this);
      }));
    }
  }, {
    key: "_remove",
    value: function _remove(id) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee28() {
        var _this7 = this;

        var self, multi, _yield13, _yield14, err, res, beforeRecord, queueId, _yield15, _yield16;

        return regeneratorRuntime.wrap(function _callee28$(_context28) {
          while (1) {
            switch (_context28.prev = _context28.next) {
              case 0:
                debug("Calling _remove(".concat(id, ", ").concat(JSON.stringify(params), "})"));
                _context28.next = 3;
                return this.awaitSetup();

              case 3:
                self = this;

                if (!(id === null)) {
                  _context28.next = 9;
                  break;
                }

                multi = this.allowsMulti('remove');

                if (multi) {
                  _context28.next = 8;
                  break;
                }

                throw new errors_1["default"].MethodNotAllowed('Removing multiple without option \'multi\' set');

              case 8:
                return _context28.abrupt("return", this.find(params).then(function (page) {
                  var res = page.data ? page.data : page;

                  if (!Array.isArray(res)) {
                    res = (_readOnlyError("res"), [res]);
                  }

                  return Promise.all(res.map(function (current) {
                    return self._remove(current[_this7.id], params);
                  }));
                }));

              case 9:
                _context28.next = 11;
                return (0, common_1.to)(this.localService._get(id));

              case 11:
                _yield13 = _context28.sent;
                _yield14 = _slicedToArray(_yield13, 2);
                err = _yield14[0];
                res = _yield14[1];

                if (res && res !== {}) {
                  _context28.next = 17;
                  break;
                }

                throw new errors_1["default"].BadRequest("Trying to remove non-existing ".concat(this.id, "=").concat(id, ". (").concat(this.type, ") err=").concat(JSON.stringify(err), ", res=").concat(JSON.stringify(res)));

              case 17:
                // Optimistic mutation
                beforeRecord = (0, common_1.clone)(res);
                this.disallowInternalProcessing('_remove');
                _context28.next = 21;
                return this._addQueuedEvent('remove', beforeRecord, id, params);

              case 21:
                queueId = _context28.sent;
                _context28.next = 24;
                return (0, common_1.to)(this.localService.remove(id, (0, common_1.clone)(params)));

              case 24:
                _yield15 = _context28.sent;
                _yield16 = _slicedToArray(_yield15, 2);
                err = _yield16[0];
                res = _yield16[1];

                if (err) {
                  _context28.next = 32;
                  break;
                }

                this.remoteService.remove(id, (0, common_1.clone)(params)).then(function (rres) {
                  return __awaiter(_this7, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee26() {
                    return regeneratorRuntime.wrap(function _callee26$(_context26) {
                      while (1) {
                        switch (_context26.prev = _context26.next) {
                          case 0:
                            _context26.next = 2;
                            return (0, common_1.to)(self._removeQueuedEvent('_remove0', queueId, beforeRecord, null));

                          case 2:
                            self.allowInternalProcessing('_remove0');
                            _context26.next = 5;
                            return (0, common_1.to)(self._processQueuedEvents());

                          case 5:
                          case "end":
                            return _context26.stop();
                        }
                      }
                    }, _callee26);
                  }));
                })["catch"](function (rerr) {
                  return __awaiter(_this7, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee27() {
                    var _yield17, _yield18, _err, _res;

                    return regeneratorRuntime.wrap(function _callee27$(_context27) {
                      while (1) {
                        switch (_context27.prev = _context27.next) {
                          case 0:
                            if (!(rerr.name === 'Timeout')) {
                              _context27.next = 4;
                              break;
                            }

                            debug("_remove TIMEOUT: ".concat(rerr.name, ", ").concat(rerr.message));
                            _context27.next = 23;
                            break;

                          case 4:
                            debug("_remove ERROR: ".concat(rerr.name, ", ").concat(rerr.message, "\nbeforeRecord = ").concat(JSON.stringify(beforeRecord)));
                            _context27.prev = 5;
                            _context27.next = 8;
                            return (0, common_1.to)(self._removeQueuedEvent('_remove1', queueId, beforeRecord, null));

                          case 8:
                            _context27.next = 10;
                            return (0, common_1.to)(self.localService.create(beforeRecord, null));

                          case 10:
                            _yield17 = _context27.sent;
                            _yield18 = _slicedToArray(_yield17, 2);
                            _err = _yield18[0];
                            _res = _yield18[1];

                            if (!_err) {
                              _context27.next = 16;
                              break;
                            }

                            throw new errors_1["default"].GeneralError("ERROR re-creating record. ".concat(_err.name, ", ").concat(_err.message));

                          case 16:
                            _context27.next = 21;
                            break;

                          case 18:
                            _context27.prev = 18;
                            _context27.t0 = _context27["catch"](5);
                            debug("_create re-created record: ERROR re-creating record. ".concat(_context27.t0.name, ", ").concat(_context27.t0.message));

                          case 21:
                            ;
                            debug("_create re-created record: rec=".concat(JSON.stringify(beforeRecord))); // }

                          case 23:
                            self.allowInternalProcessing('_remove1');

                          case 24:
                          case "end":
                            return _context27.stop();
                        }
                      }
                    }, _callee27, null, [[5, 18]]);
                  }));
                });
                _context28.next = 36;
                break;

              case 32:
                _context28.next = 34;
                return (0, common_1.to)(this._removeQueuedEvent('_remove2', queueId, beforeRecord, null));

              case 34:
                this.allowInternalProcessing('_remove2');
                throw err;

              case 36:
                return _context28.abrupt("return", Promise.resolve(beforeRecord).then(this._strip).then(this._select(params)).then((0, common_1.stringsToDates)(this._dates)));

              case 37:
              case "end":
                return _context28.stop();
            }
          }
        }, _callee28, this);
      }));
    } // Allow access to our internal services (for application hooks and the demo). Use with care!

  }, {
    key: "allowInternalProcessing",

    /* Queue handling */

    /**
     * Allow queue processing (allowed when semaphore this.aIP === 0)
     */
    value: function allowInternalProcessing(from) {
      debug("allowInternalProcessing: ".concat(from, " ").concat(this.thisName, " ").concat(this.aIP - 1));
      this.aIP--;
    }
    /**
     * Disallow queue processing (when semaphore this.aIP !== 0)
     */

  }, {
    key: "disallowInternalProcessing",
    value: function disallowInternalProcessing(from) {
      debug("disallowInternalProcessing: ".concat(from, " ").concat(this.thisName, " ").concat(this.aIP + 1));
      this.aIP++;
    }
    /**
     * Is queue processing allowed?
     */

  }, {
    key: "internalProcessingAllowed",
    value: function internalProcessingAllowed() {
      return this.aIP === 0;
    }
  }, {
    key: "_addQueuedEvent",
    value: function _addQueuedEvent(eventName, localRecord, arg1, arg2, arg3) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee29() {
        var _yield19, _yield20, err, res;

        return regeneratorRuntime.wrap(function _callee29$(_context29) {
          while (1) {
            switch (_context29.prev = _context29.next) {
              case 0:
                debug("addQueuedEvent '".concat(eventName, "' entered"));
                _context29.next = 3;
                return (0, common_1.to)(this.localQueue.create({
                  eventName: eventName,
                  record: localRecord,
                  arg1: arg1,
                  arg2: arg2,
                  arg3: arg3
                }));

              case 3:
                _yield19 = _context29.sent;
                _yield20 = _slicedToArray(_yield19, 2);
                err = _yield20[0];
                res = _yield20[1];

                if (!err) {
                  _context29.next = 9;
                  break;
                }

                throw new errors_1["default"].GeneralError("Could not write '".concat(JSON.stringify({
                  eventName: eventName,
                  record: localRecord,
                  arg1: arg1,
                  arg2: arg2,
                  arg3: arg3
                }), "' to localQueue (").concat(this.localServiceQueue, "), err=").concat(err.name, ", ").concat(err.message));

              case 9:
                debug("addQueuedEvent added: ".concat(JSON.stringify(res)));
                return _context29.abrupt("return", Promise.resolve(res.id));

              case 11:
              case "end":
                return _context29.stop();
            }
          }
        }, _callee29, this);
      }));
    }
  }, {
    key: "_removeQueuedEvent",
    value: function _removeQueuedEvent(eventName, id, localRecord, updatedAt) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee30() {
        var _yield21, _yield22, err, res;

        return regeneratorRuntime.wrap(function _callee30$(_context30) {
          while (1) {
            switch (_context30.prev = _context30.next) {
              case 0:
                debug("removeQueuedEvent '".concat(eventName, "' entered"));
                _context30.next = 3;
                return (0, common_1.to)(this.localQueue.remove(id));

              case 3:
                _yield21 = _context30.sent;
                _yield22 = _slicedToArray(_yield21, 2);
                err = _yield22[0];
                res = _yield22[1];
                return _context30.abrupt("return", Promise.resolve(res));

              case 8:
              case "end":
                return _context30.stop();
            }
          }
        }, _callee30, this);
      }));
    }
    /**
     * This method must be implemented in own-data and own-net classes extending this class
     */

  }, {
    key: "_processQueuedEvents",
    value: function _processQueuedEvents() {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee31() {
        return regeneratorRuntime.wrap(function _callee31$(_context31) {
          while (1) {
            switch (_context31.prev = _context31.next) {
              case 0:
                throw new errors_1["default"].NotImplemented("_processQueuedEvents must be implemented!!!");

              case 1:
              case "end":
                return _context31.stop();
            }
          }
        }, _callee31);
      }));
    }
    /* Event listening */

    /* Synchronization */

    /**
     * Synchronize the relevant documents/items from the remote db with the local db.
     *
     * @param {boolean} bAll If true, we try to sync for the beginning of time.
     * @param {boolean} bTesting If true, we try to sync without the proper server/backend wrapper installed.
     * @returns {boolean} True if the process was completed, false otherwise.
     */

  }, {
    key: "sync",
    value: function sync() {
      var bAll = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var bTesting = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee33() {
        var _this8 = this;

        var syncOptions, self, result, _yield23, _yield24, err, snap, syncTS, ts;

        return regeneratorRuntime.wrap(function _callee33$(_context33) {
          while (1) {
            switch (_context33.prev = _context33.next) {
              case 0:
                if (this.internalProcessingAllowed()) {
                  _context33.next = 5;
                  break;
                }

                _context33.next = 3;
                return new Promise(function (resolve) {
                  setTimeout(function () {
                    resolve(true);
                  }, 200);
                });

              case 3:
                _context33.next = 0;
                break;

              case 5:
                _context33.next = 7;
                return this._getSyncOptions(bAll, bTesting);

              case 7:
                syncOptions = _context33.sent;
                debug("".concat(this.type, ".sync(").concat(JSON.stringify(syncOptions), ") started..."));
                self = this;
                result = true;
                _context33.next = 13;
                return (0, common_1.to)((0, snapshot_1["default"])(this.remoteService, syncOptions));

              case 13:
                _yield23 = _context33.sent;
                _yield24 = _slicedToArray(_yield23, 2);
                err = _yield24[0];
                snap = _yield24[1];

                if (!err) {
                  _context33.next = 21;
                  break;
                }

                // we silently ignore any errors
                if (err.className === 'timeout') {
                  debug("  sync TIMEOUT: ".concat(JSON.stringify(err)));
                } else {
                  debug("  sync ERROR: ".concat(JSON.stringify(err), ", err=").concat(err.name, ", ").concat(err.message));
                } // Ok, tell anyone interested about the result


                this.localService.emit('synced', false);
                return _context33.abrupt("return", false);

              case 21:
                /*
                 * For each row returned by snapshot we perform the following:
                 *  - if it already exists locally
                 *    - if it is marked as deleted
                 *      - remove the row
                 *    - otherwise
                 *      - patch the row
                 *  - otherwise
                 *    - if it is not marked as deleted
                 *      - create the row
                 * Moreover we track the `onServerAt` to determine latest sync timestamp
                 */
                debug("  Applying received snapshot data... (".concat(snap.length, " items)"));
                syncTS = BOT.toISOString();
                _context33.next = 25;
                return Promise.all(snap.map(function (v) {
                  return __awaiter(_this8, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee32() {
                    var _yield25, _yield26, err, res, _yield27, _yield28, _yield29, _yield30, _yield31, _yield32;

                    return regeneratorRuntime.wrap(function _callee32$(_context32) {
                      while (1) {
                        switch (_context32.prev = _context32.next) {
                          case 0:
                            _context32.next = 2;
                            return (0, common_1.to)(self.localService.get(v[self.id]));

                          case 2:
                            _yield25 = _context32.sent;
                            _yield26 = _slicedToArray(_yield25, 2);
                            err = _yield26[0];
                            res = _yield26[1];

                            if (!res) {
                              _context32.next = 26;
                              break;
                            }

                            syncTS = syncTS < v.onServerAt ? v.onServerAt : syncTS;

                            if (!v.deletedAt) {
                              _context32.next = 17;
                              break;
                            }

                            _context32.next = 11;
                            return (0, common_1.to)(self.localService.remove(v[self.id]));

                          case 11:
                            _yield27 = _context32.sent;
                            _yield28 = _slicedToArray(_yield27, 2);
                            err = _yield28[0];
                            res = _yield28[1];
                            _context32.next = 23;
                            break;

                          case 17:
                            _context32.next = 19;
                            return (0, common_1.to)(self.localService.patch(v[self.id], v));

                          case 19:
                            _yield29 = _context32.sent;
                            _yield30 = _slicedToArray(_yield29, 2);
                            err = _yield30[0];
                            res = _yield30[1];

                          case 23:
                            return _context32.abrupt("return", err ? BOT.toISOString() : v.onServerAt);

                          case 26:
                            if (v.deletedAt) {
                              _context32.next = 35;
                              break;
                            }

                            syncTS = syncTS < v.onServerAt ? v.onServerAt : syncTS;
                            _context32.next = 30;
                            return (0, common_1.to)(self.localService.create(v));

                          case 30:
                            _yield31 = _context32.sent;
                            _yield32 = _slicedToArray(_yield31, 2);
                            err = _yield32[0];
                            res = _yield32[1];
                            return _context32.abrupt("return", err ? BOT.toISOString() : v.onServerAt);

                          case 35:
                          case "end":
                            return _context32.stop();
                        }
                      }
                    }, _callee32);
                  }));
                }));

              case 25:
                ts = _context33.sent;
                syncTS = ts.reduce(function (pv, cv) {
                  return pv < cv ? cv : pv;
                }, self.syncedAt); // Save last sync timestamp

                this.syncedAt = syncTS;
                if (snap.length) self.setSyncItem(this.syncedAt);

                if (!result) {
                  _context33.next = 37;
                  break;
                }

              case 30:
                _context33.next = 32;
                return self._processQueuedEvents();

              case 32:
                if (_context33.sent) {
                  _context33.next = 37;
                  break;
                }

                _context33.next = 35;
                return new Promise(function (resolve) {
                  setTimeout(function () {
                    resolve(true);
                  }, 200);
                });

              case 35:
                _context33.next = 30;
                break;

              case 37:
                ; // Ok, tell anyone interested about the result

                self.localService.emit('synced', result);
                return _context33.abrupt("return", result);

              case 40:
              case "end":
                return _context33.stop();
            }
          }
        }, _callee33, this);
      }));
    }
    /**
     * Determine the relevant options necessary for synchronizing this service.
     *
     * @param {boolean} bAll If true, we try to sync for the beginning of time.
     * Otherwise from `syncedAt`.
     * @param {boolean} bTesting If true, we try to sync without the proper
     * server/backend wrapper (ie. we remove the `offline` property).
     * @returns {object} The relevant options for snapshot().
     */

  }, {
    key: "_getSyncOptions",
    value: function _getSyncOptions(bAll, bTesting) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee34() {
        var forceAll, _offline, offline, query, syncTS;

        return regeneratorRuntime.wrap(function _callee34$(_context34) {
          while (1) {
            switch (_context34.prev = _context34.next) {
              case 0:
                forceAll = {
                  _forceAll: bAll
                };
                _offline = {
                  offline: forceAll
                };
                offline = bAll && !bTesting ? _offline : {};
                query = Object.assign({}, bTesting ? {} : {
                  offline: offline
                }, {
                  $sort: {
                    onServerAt: 1
                  }
                });
                syncTS = bAll ? BOT.toISOString() : this.syncedAt;
                syncTS = bTesting ? {
                  $gte: syncTS
                } : syncTS;
                query.onServerAt = syncTS;
                return _context34.abrupt("return", query);

              case 8:
              case "end":
                return _context34.stop();
            }
          }
        }, _callee34, this);
      }));
    }
  }, {
    key: "remote",
    get: function get() {
      return this.remoteService;
    },
    set: function set(value) {
      throw new errors_1["default"].Forbidden("You cannot change value of remote!");
    }
  }, {
    key: "local",
    get: function get() {
      return this.localService;
    },
    set: function set(value) {
      throw new errors_1["default"].Forbidden("You cannot change value of local!");
    }
  }, {
    key: "queue",
    get: function get() {
      return this.localQueue;
    },
    set: function set(value) {
      throw new errors_1["default"].Forbidden("You cannot change value of queue!");
    }
  }]);

  return OwnClass;
}(adapter_commons_1.AdapterService);

;
module.exports = OwnClass;

/***/ }),

/***/ "./packages/client/lib/owndata/index.js":
/*!**********************************************!*\
  !*** ./packages/client/lib/owndata/index.js ***!
  \**********************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __rest = this && this.__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var commons_1 = __webpack_require__(/*! @feathersjs/commons */ "../node_modules/@feathersjs/commons/lib/index.js");

var errors_1 = __importDefault(__webpack_require__(/*! @feathersjs/errors */ "../node_modules/@feathersjs/errors/lib/index.js"));

var common_1 = __webpack_require__(/*! ../common */ "./packages/client/lib/common/index.js");

var own_common_1 = __importDefault(__webpack_require__(/*! ../own-common */ "./packages/client/lib/own-common/index.js"));

var debug = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js")('@feathersjs-offline:owndata:service-wrapper');

var BOT = new Date(0).toISOString();

var OwndataClass = /*#__PURE__*/function (_own_common_1$default) {
  _inherits(OwndataClass, _own_common_1$default);

  var _super = _createSuper(OwndataClass);

  function OwndataClass(opts) {
    var _thisSuper, _this;

    _classCallCheck(this, OwndataClass);

    debug("Constructor started, opts = ".concat(JSON.stringify(opts)));
    _this = _super.call(this, opts);
    _this.type = 'own-data';
    _this.__forTestingOnly = _get((_thisSuper = _assertThisInitialized(_this), _getPrototypeOf(OwndataClass.prototype)), "_processQueuedEvents", _thisSuper);
    debug('  Done.');
    return _possibleConstructorReturn(_this, _assertThisInitialized(_this));
  }

  _createClass(OwndataClass, [{
    key: "_processQueuedEvents",
    value: function _processQueuedEvents() {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var _this2 = this;

        var self, _yield, _yield2, err, store, stop, _loop;

        return regeneratorRuntime.wrap(function _callee3$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                debug("processQueuedEvents (".concat(this.type, ") entered"));
                self = this;

                if (!(!this.internalProcessingAllowed() || this.pQActive)) {
                  _context4.next = 4;
                  break;
                }

                return _context4.abrupt("return", false);

              case 4:
                this.pQActive = true;
                _context4.next = 7;
                return (0, common_1.to)(this.localQueue.getEntries({
                  query: {
                    $sort: _defineProperty({}, this.id, 1)
                  }
                }));

              case 7:
                _yield = _context4.sent;
                _yield2 = _slicedToArray(_yield, 2);
                err = _yield2[0];
                store = _yield2[1];

                if (!(err || store.length === 0)) {
                  _context4.next = 14;
                  break;
                }

                this.pQActive = false;
                return _context4.abrupt("return", true);

              case 14:
                debug("  processing ".concat(store.length, " queued entries..."));
                stop = false;
                _loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop() {
                  var el, _el, eventName, record, arg1, arg2, _el$arg, arg3, id, _accEvent2;

                  return regeneratorRuntime.wrap(function _loop$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          el = store.shift();
                          _el = el, eventName = _el.eventName, record = _el.record, arg1 = _el.arg1, arg2 = _el.arg2, _el$arg = _el.arg3, arg3 = _el$arg === void 0 ? null : _el$arg, id = _el.id;
                          _accEvent2 = _accEvent(self.id, eventName, record, arg1, arg2, arg3, id);
                          eventName = _accEvent2.eventName;
                          el = _accEvent2.el;
                          arg1 = _accEvent2.arg1;
                          arg2 = _accEvent2.arg2;
                          arg3 = _accEvent2.arg3;
                          id = _accEvent2.id;
                          debug("    processing: event=".concat(eventName, ", arg1=").concat(JSON.stringify(arg1), ", arg2=").concat(JSON.stringify(arg2), ", arg3=").concat(JSON.stringify(arg3)));
                          _context3.next = 12;
                          return self.remoteService[eventName](arg1, arg2, arg3).then(function (res) {
                            return __awaiter(_this2, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                              return regeneratorRuntime.wrap(function _callee$(_context) {
                                while (1) {
                                  switch (_context.prev = _context.next) {
                                    case 0:
                                      _context.next = 2;
                                      return (0, common_1.to)(self.localQueue.remove(id));

                                    case 2:
                                      if (!(eventName !== 'remove')) {
                                        _context.next = 5;
                                        break;
                                      }

                                      _context.next = 5;
                                      return (0, common_1.to)(self.localService.patch(res[self.id], res));

                                    case 5:
                                    case "end":
                                      return _context.stop();
                                  }
                                }
                              }, _callee);
                            }));
                          })["catch"](function (err) {
                            return __awaiter(_this2, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                              return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                while (1) {
                                  switch (_context2.prev = _context2.next) {
                                    case 0:
                                      debug("catch: record=".concat(JSON.stringify(record), ", BOT=").concat(JSON.stringify(BOT), ", event=").concat(eventName, ", id=").concat(id));

                                      if (!(record.onServerAt === BOT && eventName === 'remove')) {
                                        _context2.next = 6;
                                        break;
                                      }

                                      _context2.next = 4;
                                      return (0, common_1.to)(self.localQueue.remove(id));

                                    case 4:
                                      _context2.next = 7;
                                      break;

                                    case 6:
                                      // The connection to the server has probably been cut - let's continue at another time
                                      stop = true;

                                    case 7:
                                    case "end":
                                      return _context2.stop();
                                  }
                                }
                              }, _callee2);
                            }));
                          });

                        case 12:
                        case "end":
                          return _context3.stop();
                      }
                    }
                  }, _loop);
                });

              case 17:
                if (!(store.length && !stop)) {
                  _context4.next = 21;
                  break;
                }

                return _context4.delegateYield(_loop(), "t0", 19);

              case 19:
                _context4.next = 17;
                break;

              case 21:
                debug("  processing ended, stop=".concat(stop));
                this.pQActive = false;
                return _context4.abrupt("return", !stop);

              case 24:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee3, this);
      }));
    }
  }]);

  return OwndataClass;
}(own_common_1["default"]);

;

function init(options) {
  return new OwndataClass(options);
}

var Owndata = init;
/**
 * A owndataWrapper is a CLIENT adapter wrapping for FeathersJS services extending them to
 * implement the offline own-data principle (**LINK-TO-DOC**).
 *
 * @example ```
 * import feathers from '(at)feathersjs/feathers';
 * import memory from 'feathers-memory';
 * import { owndataWrapper } from '(at)feathersjs-offline/client';
 * const app = feathers();
 * app.use('/testpath', memory({id: 'uuid'}));
 * owndataWrapper(app, '/testpath');
 * app.service('testpath').create({givenName: 'James', familyName: 'Bond'})
 * // ...
 * ```
 *
 * It works in co-existence with it's SERVER counterpart, RealtimeServiceWrapper.
 *
 * @param {object} app  The application handle
 * @param {object} path The service path (as used in ```app.use(path, serviceAdapter)```)
 * @param {object} options The options for the serviceAdaptor AND the OwndataWrapper
 *
 */

function owndataWrapper(app, path) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  debug("owndataWrapper started on path '".concat(path, "' with options '").concat(JSON.stringify(options), "'"));

  if (!(app && app.version && app.service && app.services)) {
    throw new errors_1["default"].Unavailable("The FeathersJS app must be supplied as first argument");
  }

  var location = (0, commons_1.stripSlashes)(path);
  var old = app.service(location);

  if (typeof old === 'undefined') {
    throw new errors_1["default"].Unavailable("No prior service registered on path '".concat(location, "'"));
  }

  var oldOpts = (0, common_1.clone)(old.options || {});

  var _oldOpts = oldOpts,
      storage = _oldOpts.storage,
      rest = __rest(oldOpts, ["storage"]);

  oldOpts = rest;
  var opts = Object.assign({}, oldOpts, options);
  app.use(location, Owndata(opts));
  var service = app.service(location);
  service.options = opts;

  service._listenOptions();

  return service;
}

module.exports = {
  init: init,
  Owndata: Owndata,
  owndataWrapper: owndataWrapper
};
init.Service = OwndataClass; // Helper

function _accEvent(idName, eventName, el, arg1, arg2, arg3, id) {
  var elId = el[idName];

  switch (eventName) {
    case 'create':
      return {
        eventName: eventName,
        el: el,
        arg1: el,
        arg2: arg2,
        arg3: {},
        id: id
      };

    case 'update':
      return {
        eventName: eventName,
        el: el,
        arg1: arg1,
        arg2: arg2,
        arg3: arg3,
        id: id
      };

    case 'patch':
      return {
        eventName: eventName,
        el: el,
        arg1: elId,
        arg2: el,
        arg3: arg3,
        id: id
      };

    case 'remove':
      return {
        eventName: eventName,
        el: el,
        arg1: elId,
        arg2: {},
        arg3: arg3,
        id: id
      };
  }
}

/***/ }),

/***/ "./packages/client/lib/ownnet/index.js":
/*!*********************************************!*\
  !*** ./packages/client/lib/ownnet/index.js ***!
  \*********************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __rest = this && this.__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var commons_1 = __webpack_require__(/*! @feathersjs/commons */ "../node_modules/@feathersjs/commons/lib/index.js");

var errors_1 = __importDefault(__webpack_require__(/*! @feathersjs/errors */ "../node_modules/@feathersjs/errors/lib/index.js"));

var common_1 = __webpack_require__(/*! ../common */ "./packages/client/lib/common/index.js");

var own_common_1 = __importDefault(__webpack_require__(/*! ../own-common */ "./packages/client/lib/own-common/index.js"));

var debug = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js")('@feathersjs-offline:ownnet:service-wrapper');

var OwnnetClass = /*#__PURE__*/function (_own_common_1$default) {
  _inherits(OwnnetClass, _own_common_1$default);

  var _super = _createSuper(OwnnetClass);

  function OwnnetClass(options) {
    var _thisSuper, _this;

    _classCallCheck(this, OwnnetClass);

    debug("Constructor started, opts = ".concat(JSON.stringify(options)));
    _this = _super.call(this, options);
    _this.type = 'own-net';
    _this.__forTestingOnly = _get((_thisSuper = _assertThisInitialized(_this), _getPrototypeOf(OwnnetClass.prototype)), "_processQueuedEvents", _thisSuper);
    debug('  Done.');
    return _this;
  }

  _createClass(OwnnetClass, [{
    key: "_processQueuedEvents",
    value: function _processQueuedEvents() {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var _this2 = this;

        var _yield, _yield2, err, store, self, i, j, ids, netOps, ev, stop, eventName, record, arg1, arg2, arg3, _store$i, res, _err, _yield3, _yield4, action, result;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                debug("processQueuedEvents (".concat(this.type, ") entered (IPallowed=").concat(this.internalProcessingAllowed(), ", pQActive=").concat(this.pQActive, ")"));

                if (!(!this.internalProcessingAllowed() || this.pQActive)) {
                  _context4.next = 4;
                  break;
                }

                debug("processingQueuedEvents: leaving  internalProcessing (aIP=".concat(this.aIP, "), pQActive=").concat(this.pQActive));
                return _context4.abrupt("return", false);

              case 4:
                this.pQActive = true;
                _context4.next = 7;
                return (0, common_1.to)(this.localQueue.getEntries({
                  query: {
                    $sort: {
                      uuid: 1,
                      updatedAt: 1
                    }
                  }
                }));

              case 7:
                _yield = _context4.sent;
                _yield2 = _slicedToArray(_yield, 2);
                err = _yield2[0];
                store = _yield2[1];

                if (!(err || store.length === 0)) {
                  _context4.next = 14;
                  break;
                }

                this.pQActive = false;
                return _context4.abrupt("return", true);

              case 14:
                this.disallowInternalProcessing();
                debug("  processing ".concat(store.length, " queued entries..."));
                self = this;
                i = 0; // Current event

                j = 0; // Current first event

                ids = []; // The ids of the entries in localQueue currently accumulated

                netOps = [];
                ev = [];
                stop = false; // For own-net we only send one accumulated record to the server - let's accumulate!
                // Remember, we already have the accumulated record on file in localService, so all we
                // need to do, is to look out for create and remove - the rest we remoteService.patch!

              case 23:
                while (i < store.length && store[i].record.uuid === store[j].record.uuid) {
                  _store$i = store[i];
                  eventName = _store$i.eventName;
                  record = _store$i.record;
                  arg1 = _store$i.arg1;
                  arg2 = _store$i.arg2;
                  arg3 = _store$i.arg3;
                  ids.push(store[i].id);
                  ev.push(eventName);

                  if (eventName === 'remove') {
                    netOps.push(_accEvent(this.id, eventName, record, arg1, arg2, arg3, ids));
                    ev = [];
                    ids = [];
                    j = i + 1; // New start at next record
                  }

                  i++; // get next possible record
                }

                if (!ids.length) {
                  _context4.next = 41;
                  break;
                }

                res = void 0;
                _err = void 0;

                if (!(store[j].eventName !== 'create')) {
                  _context4.next = 36;
                  break;
                }

                _context4.next = 30;
                return (0, common_1.to)(self.localService.get(store[j].record[this.id]));

              case 30:
                _yield3 = _context4.sent;
                _yield4 = _slicedToArray(_yield3, 2);
                _err = _yield4[0];
                res = _yield4[1];
                _context4.next = 37;
                break;

              case 36:
                res = store[j].record;

              case 37:
                action = ev.includes('create') ? 'create' : 'update';
                netOps.push(_accEvent(this.id, action, res, arg1, arg2, arg3, ids));

                if (i < store.length) {
                  ev = [store[i].eventName];
                  ids = [store[i].id];
                }

                j = i++; // New start at i and move to next record

              case 41:
                if (i < store.length) {
                  _context4.next = 23;
                  break;
                }

              case 42:
                debug("netOps = ".concat(JSON.stringify(netOps))); // Now, send all necessary updates to the remote service (server)

                stop = false; // In future version we will user Promise.allSettled() instead...

                _context4.next = 46;
                return Promise.all(netOps.map(function (op) {
                  return __awaiter(_this2, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                    var _this3 = this;

                    var eventName, el, arg1, arg2, arg3, ids, mdebug;
                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            eventName = op.eventName, el = op.el, arg1 = op.arg1, arg2 = op.arg2, arg3 = op.arg3, ids = op.ids;
                            mdebug = "  remoteService['".concat(eventName, "'](").concat(JSON.stringify(arg1), ", ").concat(JSON.stringify(arg2), ", ").concat(JSON.stringify(arg3), ")");
                            debug(mdebug);
                            _context3.next = 5;
                            return self.remoteService[eventName](arg1, arg2, arg3).then(function (res) {
                              return __awaiter(_this3, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                                var _this4 = this;

                                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                  while (1) {
                                    switch (_context2.prev = _context2.next) {
                                      case 0:
                                        _context2.next = 2;
                                        return self.localQueue.remove(null, {
                                          query: {
                                            id: {
                                              $in: (0, common_1.clone)(ids)
                                            }
                                          }
                                        }).then(function (qres) {
                                          return __awaiter(_this4, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                                            return regeneratorRuntime.wrap(function _callee$(_context) {
                                              while (1) {
                                                switch (_context.prev = _context.next) {
                                                  case 0:
                                                    if (!(eventName !== 'remove')) {
                                                      _context.next = 4;
                                                      break;
                                                    }

                                                    _context.next = 3;
                                                    return self.localService.patch(res[self.id], res)["catch"](function (err) {
                                                      debug(mdebug + " (copy)\n  localService.patch(".concat(JSON.stringify(res[self.id]), ", ").concat(JSON.stringify(res), ")"));
                                                      return true;
                                                    }).then(function () {
                                                      return false;
                                                    });

                                                  case 3:
                                                    return _context.abrupt("return", _context.sent);

                                                  case 4:
                                                    return _context.abrupt("return", false);

                                                  case 5:
                                                  case "end":
                                                    return _context.stop();
                                                }
                                              }
                                            }, _callee);
                                          }));
                                        })["catch"](function (err) {
                                          debug("err2=".concat(err.name, ", ").concat(err.message));
                                          return false;
                                        });

                                      case 2:
                                        return _context2.abrupt("return", _context2.sent);

                                      case 3:
                                      case "end":
                                        return _context2.stop();
                                    }
                                  }
                                }, _callee2);
                              }));
                            });

                          case 5:
                            return _context3.abrupt("return", _context3.sent);

                          case 6:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3);
                  }));
                }));

              case 46:
                result = _context4.sent;
                // stop = result.reduce((pv, cv, ci, arr) => stop || arr[ci]);
                this.allowInternalProcessing();
                this.pQActive = false;
                return _context4.abrupt("return", true);

              case 50:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));
    }
  }]);

  return OwnnetClass;
}(own_common_1["default"]);

function init(options) {
  return new OwnnetClass(options);
}

var Ownnet = init;
/**
 * A ownnetWrapper is a CLIENT adapter wrapping for FeathersJS services extending them to
 * implement the offline own-net principle (**LINK-TO-DOC**).
 *
 * @example ```
 * import feathers from '(at)feathersjs/feathers';
 * import memory from 'feathers-memory';
 * import { ownnetWrapper } from '(at)feathersjs-offline/client';
 * const app = feathers();
 * app.use('/testpath', memory({id: 'uuid'}));
 * ownnetWrapper(app, '/testpath');
 * app.service('testpath').create({givenName: 'James', familyName: 'Bond'})
 * // ...
 * ```
 *
 * It works in co-existence with it's SERVER counterpart, RealtimeServiceWrapper.
 *
 * @param {object} app  The application handle
 * @param {object} path The service path (as used in ```app.use(path, serviceAdapter)```)
 * @param {object} options The options for the serviceAdaptor AND the OwnnetWrapper
 *
 */

function ownnetWrapper(app, path) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  debug("ownnetWrapper started on path '".concat(path, "' with options '").concat(JSON.stringify(options), "'"));
  if (!(app && app.version && app.service && app.services)) throw new errors_1["default"].Unavailable("The FeathersJS app must be supplied as first argument");
  var location = (0, commons_1.stripSlashes)(path);
  var old = app.service(location);

  if (typeof old === 'undefined') {
    throw new errors_1["default"].Unavailable("No prior service registered on path '".concat(location, "'"));
  }

  var oldOpts = (0, common_1.clone)(old.options || {});

  var _oldOpts = oldOpts,
      storage = _oldOpts.storage,
      rest = __rest(oldOpts, ["storage"]);

  oldOpts = rest;
  var opts = Object.assign({}, oldOpts, options);
  app.use(location, Ownnet(opts));
  var service = app.service(location);
  service.options = opts;

  service._listenOptions();

  return service;
}

module.exports = {
  init: init,
  Ownnet: Ownnet,
  ownnetWrapper: ownnetWrapper
};
init.Service = OwnnetClass; // Helpers

function _accEvent(idName, eventName, el, arg1, arg2, arg3, ids) {
  var elId = el[idName];

  switch (eventName) {
    case 'create':
      return {
        eventName: eventName,
        el: el,
        arg1: el,
        arg2: arg2,
        arg3: {},
        ids: ids
      };

    case 'update':
      return {
        eventName: eventName,
        el: el,
        arg1: arg1,
        arg2: arg2,
        arg3: arg3,
        ids: ids
      };

    case 'patch':
      return {
        eventName: eventName,
        el: el,
        arg1: elId,
        arg2: el,
        arg3: arg3,
        ids: ids
      };

    case 'remove':
      return {
        eventName: eventName,
        el: el,
        arg1: elId,
        arg2: {},
        arg3: arg3,
        ids: ids
      };
  }
}

/***/ }),

/***/ "./packages/client/lib/snapshot/index.js":
/*!***********************************************!*\
  !*** ./packages/client/lib/snapshot/index.js ***!
  \***********************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", ({
  value: true
})); //
// Most of this code has been copied from 'https://github.com/feathers-plus/feathers-offline-snapshot/blob/master/src/index.js'
// with permission from @eddyystop
//

var debug_1 = __importDefault(__webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js"));

var debug = (0, debug_1["default"])('@feathersjs-offline:snapshot');

function snapshot(service, baseQuery) {
  debug("snapshot start: ".concat(JSON.stringify(baseQuery)));
  var query = Object.assign({}, {
    $skip: 0,
    $limit: 200
  }, baseQuery); // use max recs configured

  var fileDatas;
  return service.find({
    query: query
  }).then(function (result) {
    debug("snapshot query = ".concat(JSON.stringify(query), ", read ").concat((result.data || result).length, " records\n\n             snapshot   read ").concat(JSON.stringify(result.data || result)));

    if (!result.data) {
      return result;
    }

    var total = result.total,
        limit = result.limit,
        skip = result.skip,
        data = result.data;
    fileDatas = data;
    return skip + data.length < total ? readRemainingPages(skip + limit) : fileDatas;
  });

  function readRemainingPages(skip) {
    query.$skip = skip;
    return service.find({
      query: query
    }).then(function (_ref) {
      var total = _ref.total,
          limit = _ref.limit,
          skip = _ref.skip,
          data = _ref.data;
      debug("read ".concat(data.length, " records"));
      fileDatas = fileDatas.concat(data);
      return skip + data.length < total ? readRemainingPages(skip + limit) : fileDatas;
    });
  }
}

module.exports = snapshot;

/***/ }),

/***/ "./node_modules/lodash/_DataView.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_DataView.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;


/***/ }),

/***/ "./node_modules/lodash/_Hash.js":
/*!**************************************!*\
  !*** ./node_modules/lodash/_Hash.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var hashClear = __webpack_require__(/*! ./_hashClear */ "./node_modules/lodash/_hashClear.js"),
    hashDelete = __webpack_require__(/*! ./_hashDelete */ "./node_modules/lodash/_hashDelete.js"),
    hashGet = __webpack_require__(/*! ./_hashGet */ "./node_modules/lodash/_hashGet.js"),
    hashHas = __webpack_require__(/*! ./_hashHas */ "./node_modules/lodash/_hashHas.js"),
    hashSet = __webpack_require__(/*! ./_hashSet */ "./node_modules/lodash/_hashSet.js");

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;


/***/ }),

/***/ "./node_modules/lodash/_ListCache.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_ListCache.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var listCacheClear = __webpack_require__(/*! ./_listCacheClear */ "./node_modules/lodash/_listCacheClear.js"),
    listCacheDelete = __webpack_require__(/*! ./_listCacheDelete */ "./node_modules/lodash/_listCacheDelete.js"),
    listCacheGet = __webpack_require__(/*! ./_listCacheGet */ "./node_modules/lodash/_listCacheGet.js"),
    listCacheHas = __webpack_require__(/*! ./_listCacheHas */ "./node_modules/lodash/_listCacheHas.js"),
    listCacheSet = __webpack_require__(/*! ./_listCacheSet */ "./node_modules/lodash/_listCacheSet.js");

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;


/***/ }),

/***/ "./node_modules/lodash/_Map.js":
/*!*************************************!*\
  !*** ./node_modules/lodash/_Map.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;


/***/ }),

/***/ "./node_modules/lodash/_MapCache.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_MapCache.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var mapCacheClear = __webpack_require__(/*! ./_mapCacheClear */ "./node_modules/lodash/_mapCacheClear.js"),
    mapCacheDelete = __webpack_require__(/*! ./_mapCacheDelete */ "./node_modules/lodash/_mapCacheDelete.js"),
    mapCacheGet = __webpack_require__(/*! ./_mapCacheGet */ "./node_modules/lodash/_mapCacheGet.js"),
    mapCacheHas = __webpack_require__(/*! ./_mapCacheHas */ "./node_modules/lodash/_mapCacheHas.js"),
    mapCacheSet = __webpack_require__(/*! ./_mapCacheSet */ "./node_modules/lodash/_mapCacheSet.js");

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;


/***/ }),

/***/ "./node_modules/lodash/_Promise.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_Promise.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;


/***/ }),

/***/ "./node_modules/lodash/_Set.js":
/*!*************************************!*\
  !*** ./node_modules/lodash/_Set.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;


/***/ }),

/***/ "./node_modules/lodash/_Stack.js":
/*!***************************************!*\
  !*** ./node_modules/lodash/_Stack.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ListCache = __webpack_require__(/*! ./_ListCache */ "./node_modules/lodash/_ListCache.js"),
    stackClear = __webpack_require__(/*! ./_stackClear */ "./node_modules/lodash/_stackClear.js"),
    stackDelete = __webpack_require__(/*! ./_stackDelete */ "./node_modules/lodash/_stackDelete.js"),
    stackGet = __webpack_require__(/*! ./_stackGet */ "./node_modules/lodash/_stackGet.js"),
    stackHas = __webpack_require__(/*! ./_stackHas */ "./node_modules/lodash/_stackHas.js"),
    stackSet = __webpack_require__(/*! ./_stackSet */ "./node_modules/lodash/_stackSet.js");

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;


/***/ }),

/***/ "./node_modules/lodash/_Symbol.js":
/*!****************************************!*\
  !*** ./node_modules/lodash/_Symbol.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),

/***/ "./node_modules/lodash/_Uint8Array.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_Uint8Array.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;


/***/ }),

/***/ "./node_modules/lodash/_WeakMap.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_WeakMap.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;


/***/ }),

/***/ "./node_modules/lodash/_arrayEach.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_arrayEach.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;


/***/ }),

/***/ "./node_modules/lodash/_arrayFilter.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_arrayFilter.js ***!
  \*********************************************/
/***/ ((module) => {

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;


/***/ }),

/***/ "./node_modules/lodash/_arrayLikeKeys.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_arrayLikeKeys.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseTimes = __webpack_require__(/*! ./_baseTimes */ "./node_modules/lodash/_baseTimes.js"),
    isArguments = __webpack_require__(/*! ./isArguments */ "./node_modules/lodash/isArguments.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js"),
    isBuffer = __webpack_require__(/*! ./isBuffer */ "./node_modules/lodash/isBuffer.js"),
    isIndex = __webpack_require__(/*! ./_isIndex */ "./node_modules/lodash/_isIndex.js"),
    isTypedArray = __webpack_require__(/*! ./isTypedArray */ "./node_modules/lodash/isTypedArray.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;


/***/ }),

/***/ "./node_modules/lodash/_arrayPush.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_arrayPush.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;


/***/ }),

/***/ "./node_modules/lodash/_assignValue.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_assignValue.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseAssignValue = __webpack_require__(/*! ./_baseAssignValue */ "./node_modules/lodash/_baseAssignValue.js"),
    eq = __webpack_require__(/*! ./eq */ "./node_modules/lodash/eq.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignValue;


/***/ }),

/***/ "./node_modules/lodash/_assocIndexOf.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_assocIndexOf.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var eq = __webpack_require__(/*! ./eq */ "./node_modules/lodash/eq.js");

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;


/***/ }),

/***/ "./node_modules/lodash/_baseAssign.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseAssign.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var copyObject = __webpack_require__(/*! ./_copyObject */ "./node_modules/lodash/_copyObject.js"),
    keys = __webpack_require__(/*! ./keys */ "./node_modules/lodash/keys.js");

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

module.exports = baseAssign;


/***/ }),

/***/ "./node_modules/lodash/_baseAssignIn.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_baseAssignIn.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var copyObject = __webpack_require__(/*! ./_copyObject */ "./node_modules/lodash/_copyObject.js"),
    keysIn = __webpack_require__(/*! ./keysIn */ "./node_modules/lodash/keysIn.js");

/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn(object, source) {
  return object && copyObject(source, keysIn(source), object);
}

module.exports = baseAssignIn;


/***/ }),

/***/ "./node_modules/lodash/_baseAssignValue.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_baseAssignValue.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var defineProperty = __webpack_require__(/*! ./_defineProperty */ "./node_modules/lodash/_defineProperty.js");

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

module.exports = baseAssignValue;


/***/ }),

/***/ "./node_modules/lodash/_baseClone.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseClone.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Stack = __webpack_require__(/*! ./_Stack */ "./node_modules/lodash/_Stack.js"),
    arrayEach = __webpack_require__(/*! ./_arrayEach */ "./node_modules/lodash/_arrayEach.js"),
    assignValue = __webpack_require__(/*! ./_assignValue */ "./node_modules/lodash/_assignValue.js"),
    baseAssign = __webpack_require__(/*! ./_baseAssign */ "./node_modules/lodash/_baseAssign.js"),
    baseAssignIn = __webpack_require__(/*! ./_baseAssignIn */ "./node_modules/lodash/_baseAssignIn.js"),
    cloneBuffer = __webpack_require__(/*! ./_cloneBuffer */ "./node_modules/lodash/_cloneBuffer.js"),
    copyArray = __webpack_require__(/*! ./_copyArray */ "./node_modules/lodash/_copyArray.js"),
    copySymbols = __webpack_require__(/*! ./_copySymbols */ "./node_modules/lodash/_copySymbols.js"),
    copySymbolsIn = __webpack_require__(/*! ./_copySymbolsIn */ "./node_modules/lodash/_copySymbolsIn.js"),
    getAllKeys = __webpack_require__(/*! ./_getAllKeys */ "./node_modules/lodash/_getAllKeys.js"),
    getAllKeysIn = __webpack_require__(/*! ./_getAllKeysIn */ "./node_modules/lodash/_getAllKeysIn.js"),
    getTag = __webpack_require__(/*! ./_getTag */ "./node_modules/lodash/_getTag.js"),
    initCloneArray = __webpack_require__(/*! ./_initCloneArray */ "./node_modules/lodash/_initCloneArray.js"),
    initCloneByTag = __webpack_require__(/*! ./_initCloneByTag */ "./node_modules/lodash/_initCloneByTag.js"),
    initCloneObject = __webpack_require__(/*! ./_initCloneObject */ "./node_modules/lodash/_initCloneObject.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js"),
    isBuffer = __webpack_require__(/*! ./isBuffer */ "./node_modules/lodash/isBuffer.js"),
    isMap = __webpack_require__(/*! ./isMap */ "./node_modules/lodash/isMap.js"),
    isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js"),
    isSet = __webpack_require__(/*! ./isSet */ "./node_modules/lodash/isSet.js"),
    keys = __webpack_require__(/*! ./keys */ "./node_modules/lodash/keys.js"),
    keysIn = __webpack_require__(/*! ./keysIn */ "./node_modules/lodash/keysIn.js");

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? copySymbolsIn(value, baseAssignIn(result, value))
          : copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (isSet(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });
  } else if (isMap(value)) {
    value.forEach(function(subValue, key) {
      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });
  }

  var keysFunc = isFull
    ? (isFlat ? getAllKeysIn : getAllKeys)
    : (isFlat ? keysIn : keys);

  var props = isArr ? undefined : keysFunc(value);
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

module.exports = baseClone;


/***/ }),

/***/ "./node_modules/lodash/_baseCreate.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseCreate.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js");

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

module.exports = baseCreate;


/***/ }),

/***/ "./node_modules/lodash/_baseGetAllKeys.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_baseGetAllKeys.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayPush = __webpack_require__(/*! ./_arrayPush */ "./node_modules/lodash/_arrayPush.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js");

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;


/***/ }),

/***/ "./node_modules/lodash/_baseGetTag.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseGetTag.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(/*! ./_Symbol */ "./node_modules/lodash/_Symbol.js"),
    getRawTag = __webpack_require__(/*! ./_getRawTag */ "./node_modules/lodash/_getRawTag.js"),
    objectToString = __webpack_require__(/*! ./_objectToString */ "./node_modules/lodash/_objectToString.js");

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),

/***/ "./node_modules/lodash/_baseIsArguments.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_baseIsArguments.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./node_modules/lodash/_baseGetTag.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;


/***/ }),

/***/ "./node_modules/lodash/_baseIsMap.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseIsMap.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getTag = __webpack_require__(/*! ./_getTag */ "./node_modules/lodash/_getTag.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/** `Object#toString` result references. */
var mapTag = '[object Map]';

/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */
function baseIsMap(value) {
  return isObjectLike(value) && getTag(value) == mapTag;
}

module.exports = baseIsMap;


/***/ }),

/***/ "./node_modules/lodash/_baseIsNative.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_baseIsNative.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isFunction = __webpack_require__(/*! ./isFunction */ "./node_modules/lodash/isFunction.js"),
    isMasked = __webpack_require__(/*! ./_isMasked */ "./node_modules/lodash/_isMasked.js"),
    isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js"),
    toSource = __webpack_require__(/*! ./_toSource */ "./node_modules/lodash/_toSource.js");

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;


/***/ }),

/***/ "./node_modules/lodash/_baseIsSet.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseIsSet.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getTag = __webpack_require__(/*! ./_getTag */ "./node_modules/lodash/_getTag.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/** `Object#toString` result references. */
var setTag = '[object Set]';

/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */
function baseIsSet(value) {
  return isObjectLike(value) && getTag(value) == setTag;
}

module.exports = baseIsSet;


/***/ }),

/***/ "./node_modules/lodash/_baseIsTypedArray.js":
/*!**************************************************!*\
  !*** ./node_modules/lodash/_baseIsTypedArray.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./node_modules/lodash/_baseGetTag.js"),
    isLength = __webpack_require__(/*! ./isLength */ "./node_modules/lodash/isLength.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;


/***/ }),

/***/ "./node_modules/lodash/_baseKeys.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_baseKeys.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isPrototype = __webpack_require__(/*! ./_isPrototype */ "./node_modules/lodash/_isPrototype.js"),
    nativeKeys = __webpack_require__(/*! ./_nativeKeys */ "./node_modules/lodash/_nativeKeys.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;


/***/ }),

/***/ "./node_modules/lodash/_baseKeysIn.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseKeysIn.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js"),
    isPrototype = __webpack_require__(/*! ./_isPrototype */ "./node_modules/lodash/_isPrototype.js"),
    nativeKeysIn = __webpack_require__(/*! ./_nativeKeysIn */ "./node_modules/lodash/_nativeKeysIn.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeysIn;


/***/ }),

/***/ "./node_modules/lodash/_baseTimes.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseTimes.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;


/***/ }),

/***/ "./node_modules/lodash/_baseUnary.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseUnary.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;


/***/ }),

/***/ "./node_modules/lodash/_cloneArrayBuffer.js":
/*!**************************************************!*\
  !*** ./node_modules/lodash/_cloneArrayBuffer.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Uint8Array = __webpack_require__(/*! ./_Uint8Array */ "./node_modules/lodash/_Uint8Array.js");

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

module.exports = cloneArrayBuffer;


/***/ }),

/***/ "./node_modules/lodash/_cloneBuffer.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_cloneBuffer.js ***!
  \*********************************************/
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;


/***/ }),

/***/ "./node_modules/lodash/_cloneDataView.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_cloneDataView.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var cloneArrayBuffer = __webpack_require__(/*! ./_cloneArrayBuffer */ "./node_modules/lodash/_cloneArrayBuffer.js");

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

module.exports = cloneDataView;


/***/ }),

/***/ "./node_modules/lodash/_cloneRegExp.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_cloneRegExp.js ***!
  \*********************************************/
/***/ ((module) => {

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

module.exports = cloneRegExp;


/***/ }),

/***/ "./node_modules/lodash/_cloneSymbol.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_cloneSymbol.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(/*! ./_Symbol */ "./node_modules/lodash/_Symbol.js");

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

module.exports = cloneSymbol;


/***/ }),

/***/ "./node_modules/lodash/_cloneTypedArray.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_cloneTypedArray.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var cloneArrayBuffer = __webpack_require__(/*! ./_cloneArrayBuffer */ "./node_modules/lodash/_cloneArrayBuffer.js");

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

module.exports = cloneTypedArray;


/***/ }),

/***/ "./node_modules/lodash/_copyArray.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_copyArray.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = copyArray;


/***/ }),

/***/ "./node_modules/lodash/_copyObject.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_copyObject.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assignValue = __webpack_require__(/*! ./_assignValue */ "./node_modules/lodash/_assignValue.js"),
    baseAssignValue = __webpack_require__(/*! ./_baseAssignValue */ "./node_modules/lodash/_baseAssignValue.js");

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

module.exports = copyObject;


/***/ }),

/***/ "./node_modules/lodash/_copySymbols.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_copySymbols.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var copyObject = __webpack_require__(/*! ./_copyObject */ "./node_modules/lodash/_copyObject.js"),
    getSymbols = __webpack_require__(/*! ./_getSymbols */ "./node_modules/lodash/_getSymbols.js");

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

module.exports = copySymbols;


/***/ }),

/***/ "./node_modules/lodash/_copySymbolsIn.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_copySymbolsIn.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var copyObject = __webpack_require__(/*! ./_copyObject */ "./node_modules/lodash/_copyObject.js"),
    getSymbolsIn = __webpack_require__(/*! ./_getSymbolsIn */ "./node_modules/lodash/_getSymbolsIn.js");

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn(source, object) {
  return copyObject(source, getSymbolsIn(source), object);
}

module.exports = copySymbolsIn;


/***/ }),

/***/ "./node_modules/lodash/_coreJsData.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_coreJsData.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;


/***/ }),

/***/ "./node_modules/lodash/_defineProperty.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_defineProperty.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js");

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;


/***/ }),

/***/ "./node_modules/lodash/_freeGlobal.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_freeGlobal.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

module.exports = freeGlobal;


/***/ }),

/***/ "./node_modules/lodash/_getAllKeys.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_getAllKeys.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetAllKeys = __webpack_require__(/*! ./_baseGetAllKeys */ "./node_modules/lodash/_baseGetAllKeys.js"),
    getSymbols = __webpack_require__(/*! ./_getSymbols */ "./node_modules/lodash/_getSymbols.js"),
    keys = __webpack_require__(/*! ./keys */ "./node_modules/lodash/keys.js");

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

module.exports = getAllKeys;


/***/ }),

/***/ "./node_modules/lodash/_getAllKeysIn.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_getAllKeysIn.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetAllKeys = __webpack_require__(/*! ./_baseGetAllKeys */ "./node_modules/lodash/_baseGetAllKeys.js"),
    getSymbolsIn = __webpack_require__(/*! ./_getSymbolsIn */ "./node_modules/lodash/_getSymbolsIn.js"),
    keysIn = __webpack_require__(/*! ./keysIn */ "./node_modules/lodash/keysIn.js");

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return baseGetAllKeys(object, keysIn, getSymbolsIn);
}

module.exports = getAllKeysIn;


/***/ }),

/***/ "./node_modules/lodash/_getMapData.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_getMapData.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isKeyable = __webpack_require__(/*! ./_isKeyable */ "./node_modules/lodash/_isKeyable.js");

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;


/***/ }),

/***/ "./node_modules/lodash/_getNative.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_getNative.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsNative = __webpack_require__(/*! ./_baseIsNative */ "./node_modules/lodash/_baseIsNative.js"),
    getValue = __webpack_require__(/*! ./_getValue */ "./node_modules/lodash/_getValue.js");

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;


/***/ }),

/***/ "./node_modules/lodash/_getPrototype.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_getPrototype.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var overArg = __webpack_require__(/*! ./_overArg */ "./node_modules/lodash/_overArg.js");

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;


/***/ }),

/***/ "./node_modules/lodash/_getRawTag.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_getRawTag.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(/*! ./_Symbol */ "./node_modules/lodash/_Symbol.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),

/***/ "./node_modules/lodash/_getSymbols.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_getSymbols.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayFilter = __webpack_require__(/*! ./_arrayFilter */ "./node_modules/lodash/_arrayFilter.js"),
    stubArray = __webpack_require__(/*! ./stubArray */ "./node_modules/lodash/stubArray.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

module.exports = getSymbols;


/***/ }),

/***/ "./node_modules/lodash/_getSymbolsIn.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_getSymbolsIn.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayPush = __webpack_require__(/*! ./_arrayPush */ "./node_modules/lodash/_arrayPush.js"),
    getPrototype = __webpack_require__(/*! ./_getPrototype */ "./node_modules/lodash/_getPrototype.js"),
    getSymbols = __webpack_require__(/*! ./_getSymbols */ "./node_modules/lodash/_getSymbols.js"),
    stubArray = __webpack_require__(/*! ./stubArray */ "./node_modules/lodash/stubArray.js");

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
  var result = [];
  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }
  return result;
};

module.exports = getSymbolsIn;


/***/ }),

/***/ "./node_modules/lodash/_getTag.js":
/*!****************************************!*\
  !*** ./node_modules/lodash/_getTag.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var DataView = __webpack_require__(/*! ./_DataView */ "./node_modules/lodash/_DataView.js"),
    Map = __webpack_require__(/*! ./_Map */ "./node_modules/lodash/_Map.js"),
    Promise = __webpack_require__(/*! ./_Promise */ "./node_modules/lodash/_Promise.js"),
    Set = __webpack_require__(/*! ./_Set */ "./node_modules/lodash/_Set.js"),
    WeakMap = __webpack_require__(/*! ./_WeakMap */ "./node_modules/lodash/_WeakMap.js"),
    baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./node_modules/lodash/_baseGetTag.js"),
    toSource = __webpack_require__(/*! ./_toSource */ "./node_modules/lodash/_toSource.js");

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;


/***/ }),

/***/ "./node_modules/lodash/_getValue.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_getValue.js ***!
  \******************************************/
/***/ ((module) => {

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;


/***/ }),

/***/ "./node_modules/lodash/_hashClear.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_hashClear.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "./node_modules/lodash/_nativeCreate.js");

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

module.exports = hashClear;


/***/ }),

/***/ "./node_modules/lodash/_hashDelete.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_hashDelete.js ***!
  \********************************************/
/***/ ((module) => {

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = hashDelete;


/***/ }),

/***/ "./node_modules/lodash/_hashGet.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_hashGet.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "./node_modules/lodash/_nativeCreate.js");

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;


/***/ }),

/***/ "./node_modules/lodash/_hashHas.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_hashHas.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "./node_modules/lodash/_nativeCreate.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

module.exports = hashHas;


/***/ }),

/***/ "./node_modules/lodash/_hashSet.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_hashSet.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "./node_modules/lodash/_nativeCreate.js");

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;


/***/ }),

/***/ "./node_modules/lodash/_initCloneArray.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_initCloneArray.js ***!
  \************************************************/
/***/ ((module) => {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

module.exports = initCloneArray;


/***/ }),

/***/ "./node_modules/lodash/_initCloneByTag.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_initCloneByTag.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var cloneArrayBuffer = __webpack_require__(/*! ./_cloneArrayBuffer */ "./node_modules/lodash/_cloneArrayBuffer.js"),
    cloneDataView = __webpack_require__(/*! ./_cloneDataView */ "./node_modules/lodash/_cloneDataView.js"),
    cloneRegExp = __webpack_require__(/*! ./_cloneRegExp */ "./node_modules/lodash/_cloneRegExp.js"),
    cloneSymbol = __webpack_require__(/*! ./_cloneSymbol */ "./node_modules/lodash/_cloneSymbol.js"),
    cloneTypedArray = __webpack_require__(/*! ./_cloneTypedArray */ "./node_modules/lodash/_cloneTypedArray.js");

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return new Ctor;

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return new Ctor;

    case symbolTag:
      return cloneSymbol(object);
  }
}

module.exports = initCloneByTag;


/***/ }),

/***/ "./node_modules/lodash/_initCloneObject.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_initCloneObject.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseCreate = __webpack_require__(/*! ./_baseCreate */ "./node_modules/lodash/_baseCreate.js"),
    getPrototype = __webpack_require__(/*! ./_getPrototype */ "./node_modules/lodash/_getPrototype.js"),
    isPrototype = __webpack_require__(/*! ./_isPrototype */ "./node_modules/lodash/_isPrototype.js");

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

module.exports = initCloneObject;


/***/ }),

/***/ "./node_modules/lodash/_isIndex.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_isIndex.js ***!
  \*****************************************/
/***/ ((module) => {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;


/***/ }),

/***/ "./node_modules/lodash/_isKeyable.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_isKeyable.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;


/***/ }),

/***/ "./node_modules/lodash/_isMasked.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_isMasked.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var coreJsData = __webpack_require__(/*! ./_coreJsData */ "./node_modules/lodash/_coreJsData.js");

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;


/***/ }),

/***/ "./node_modules/lodash/_isPrototype.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_isPrototype.js ***!
  \*********************************************/
/***/ ((module) => {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;


/***/ }),

/***/ "./node_modules/lodash/_listCacheClear.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_listCacheClear.js ***!
  \************************************************/
/***/ ((module) => {

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

module.exports = listCacheClear;


/***/ }),

/***/ "./node_modules/lodash/_listCacheDelete.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_listCacheDelete.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "./node_modules/lodash/_assocIndexOf.js");

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

module.exports = listCacheDelete;


/***/ }),

/***/ "./node_modules/lodash/_listCacheGet.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_listCacheGet.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "./node_modules/lodash/_assocIndexOf.js");

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;


/***/ }),

/***/ "./node_modules/lodash/_listCacheHas.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_listCacheHas.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "./node_modules/lodash/_assocIndexOf.js");

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;


/***/ }),

/***/ "./node_modules/lodash/_listCacheSet.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_listCacheSet.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "./node_modules/lodash/_assocIndexOf.js");

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;


/***/ }),

/***/ "./node_modules/lodash/_mapCacheClear.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_mapCacheClear.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Hash = __webpack_require__(/*! ./_Hash */ "./node_modules/lodash/_Hash.js"),
    ListCache = __webpack_require__(/*! ./_ListCache */ "./node_modules/lodash/_ListCache.js"),
    Map = __webpack_require__(/*! ./_Map */ "./node_modules/lodash/_Map.js");

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;


/***/ }),

/***/ "./node_modules/lodash/_mapCacheDelete.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_mapCacheDelete.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(/*! ./_getMapData */ "./node_modules/lodash/_getMapData.js");

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = mapCacheDelete;


/***/ }),

/***/ "./node_modules/lodash/_mapCacheGet.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_mapCacheGet.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(/*! ./_getMapData */ "./node_modules/lodash/_getMapData.js");

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;


/***/ }),

/***/ "./node_modules/lodash/_mapCacheHas.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_mapCacheHas.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(/*! ./_getMapData */ "./node_modules/lodash/_getMapData.js");

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;


/***/ }),

/***/ "./node_modules/lodash/_mapCacheSet.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_mapCacheSet.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(/*! ./_getMapData */ "./node_modules/lodash/_getMapData.js");

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

module.exports = mapCacheSet;


/***/ }),

/***/ "./node_modules/lodash/_nativeCreate.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_nativeCreate.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js");

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;


/***/ }),

/***/ "./node_modules/lodash/_nativeKeys.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_nativeKeys.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var overArg = __webpack_require__(/*! ./_overArg */ "./node_modules/lodash/_overArg.js");

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;


/***/ }),

/***/ "./node_modules/lodash/_nativeKeysIn.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_nativeKeysIn.js ***!
  \**********************************************/
/***/ ((module) => {

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = nativeKeysIn;


/***/ }),

/***/ "./node_modules/lodash/_nodeUtil.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_nodeUtil.js ***!
  \******************************************/
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
var freeGlobal = __webpack_require__(/*! ./_freeGlobal */ "./node_modules/lodash/_freeGlobal.js");

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;


/***/ }),

/***/ "./node_modules/lodash/_objectToString.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_objectToString.js ***!
  \************************************************/
/***/ ((module) => {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),

/***/ "./node_modules/lodash/_overArg.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_overArg.js ***!
  \*****************************************/
/***/ ((module) => {

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;


/***/ }),

/***/ "./node_modules/lodash/_root.js":
/*!**************************************!*\
  !*** ./node_modules/lodash/_root.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var freeGlobal = __webpack_require__(/*! ./_freeGlobal */ "./node_modules/lodash/_freeGlobal.js");

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),

/***/ "./node_modules/lodash/_stackClear.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_stackClear.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ListCache = __webpack_require__(/*! ./_ListCache */ "./node_modules/lodash/_ListCache.js");

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

module.exports = stackClear;


/***/ }),

/***/ "./node_modules/lodash/_stackDelete.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_stackDelete.js ***!
  \*********************************************/
/***/ ((module) => {

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

module.exports = stackDelete;


/***/ }),

/***/ "./node_modules/lodash/_stackGet.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_stackGet.js ***!
  \******************************************/
/***/ ((module) => {

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;


/***/ }),

/***/ "./node_modules/lodash/_stackHas.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_stackHas.js ***!
  \******************************************/
/***/ ((module) => {

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;


/***/ }),

/***/ "./node_modules/lodash/_stackSet.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_stackSet.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ListCache = __webpack_require__(/*! ./_ListCache */ "./node_modules/lodash/_ListCache.js"),
    Map = __webpack_require__(/*! ./_Map */ "./node_modules/lodash/_Map.js"),
    MapCache = __webpack_require__(/*! ./_MapCache */ "./node_modules/lodash/_MapCache.js");

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

module.exports = stackSet;


/***/ }),

/***/ "./node_modules/lodash/_toSource.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_toSource.js ***!
  \******************************************/
/***/ ((module) => {

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;


/***/ }),

/***/ "./node_modules/lodash/cloneDeep.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/cloneDeep.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseClone = __webpack_require__(/*! ./_baseClone */ "./node_modules/lodash/_baseClone.js");

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_SYMBOLS_FLAG = 4;

/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */
function cloneDeep(value) {
  return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
}

module.exports = cloneDeep;


/***/ }),

/***/ "./node_modules/lodash/eq.js":
/*!***********************************!*\
  !*** ./node_modules/lodash/eq.js ***!
  \***********************************/
/***/ ((module) => {

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;


/***/ }),

/***/ "./node_modules/lodash/isArguments.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/isArguments.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsArguments = __webpack_require__(/*! ./_baseIsArguments */ "./node_modules/lodash/_baseIsArguments.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;


/***/ }),

/***/ "./node_modules/lodash/isArray.js":
/*!****************************************!*\
  !*** ./node_modules/lodash/isArray.js ***!
  \****************************************/
/***/ ((module) => {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;


/***/ }),

/***/ "./node_modules/lodash/isArrayLike.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/isArrayLike.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isFunction = __webpack_require__(/*! ./isFunction */ "./node_modules/lodash/isFunction.js"),
    isLength = __webpack_require__(/*! ./isLength */ "./node_modules/lodash/isLength.js");

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;


/***/ }),

/***/ "./node_modules/lodash/isBuffer.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/isBuffer.js ***!
  \*****************************************/
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js"),
    stubFalse = __webpack_require__(/*! ./stubFalse */ "./node_modules/lodash/stubFalse.js");

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;


/***/ }),

/***/ "./node_modules/lodash/isFunction.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/isFunction.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./node_modules/lodash/_baseGetTag.js"),
    isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js");

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;


/***/ }),

/***/ "./node_modules/lodash/isLength.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/isLength.js ***!
  \*****************************************/
/***/ ((module) => {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;


/***/ }),

/***/ "./node_modules/lodash/isMap.js":
/*!**************************************!*\
  !*** ./node_modules/lodash/isMap.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsMap = __webpack_require__(/*! ./_baseIsMap */ "./node_modules/lodash/_baseIsMap.js"),
    baseUnary = __webpack_require__(/*! ./_baseUnary */ "./node_modules/lodash/_baseUnary.js"),
    nodeUtil = __webpack_require__(/*! ./_nodeUtil */ "./node_modules/lodash/_nodeUtil.js");

/* Node.js helper references. */
var nodeIsMap = nodeUtil && nodeUtil.isMap;

/**
 * Checks if `value` is classified as a `Map` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 * @example
 *
 * _.isMap(new Map);
 * // => true
 *
 * _.isMap(new WeakMap);
 * // => false
 */
var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

module.exports = isMap;


/***/ }),

/***/ "./node_modules/lodash/isObject.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/isObject.js ***!
  \*****************************************/
/***/ ((module) => {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ }),

/***/ "./node_modules/lodash/isObjectLike.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/isObjectLike.js ***!
  \*********************************************/
/***/ ((module) => {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),

/***/ "./node_modules/lodash/isSet.js":
/*!**************************************!*\
  !*** ./node_modules/lodash/isSet.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsSet = __webpack_require__(/*! ./_baseIsSet */ "./node_modules/lodash/_baseIsSet.js"),
    baseUnary = __webpack_require__(/*! ./_baseUnary */ "./node_modules/lodash/_baseUnary.js"),
    nodeUtil = __webpack_require__(/*! ./_nodeUtil */ "./node_modules/lodash/_nodeUtil.js");

/* Node.js helper references. */
var nodeIsSet = nodeUtil && nodeUtil.isSet;

/**
 * Checks if `value` is classified as a `Set` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * _.isSet(new Set);
 * // => true
 *
 * _.isSet(new WeakSet);
 * // => false
 */
var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

module.exports = isSet;


/***/ }),

/***/ "./node_modules/lodash/isTypedArray.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/isTypedArray.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsTypedArray = __webpack_require__(/*! ./_baseIsTypedArray */ "./node_modules/lodash/_baseIsTypedArray.js"),
    baseUnary = __webpack_require__(/*! ./_baseUnary */ "./node_modules/lodash/_baseUnary.js"),
    nodeUtil = __webpack_require__(/*! ./_nodeUtil */ "./node_modules/lodash/_nodeUtil.js");

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;


/***/ }),

/***/ "./node_modules/lodash/keys.js":
/*!*************************************!*\
  !*** ./node_modules/lodash/keys.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayLikeKeys = __webpack_require__(/*! ./_arrayLikeKeys */ "./node_modules/lodash/_arrayLikeKeys.js"),
    baseKeys = __webpack_require__(/*! ./_baseKeys */ "./node_modules/lodash/_baseKeys.js"),
    isArrayLike = __webpack_require__(/*! ./isArrayLike */ "./node_modules/lodash/isArrayLike.js");

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;


/***/ }),

/***/ "./node_modules/lodash/keysIn.js":
/*!***************************************!*\
  !*** ./node_modules/lodash/keysIn.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayLikeKeys = __webpack_require__(/*! ./_arrayLikeKeys */ "./node_modules/lodash/_arrayLikeKeys.js"),
    baseKeysIn = __webpack_require__(/*! ./_baseKeysIn */ "./node_modules/lodash/_baseKeysIn.js"),
    isArrayLike = __webpack_require__(/*! ./isArrayLike */ "./node_modules/lodash/isArrayLike.js");

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

module.exports = keysIn;


/***/ }),

/***/ "./node_modules/lodash/stubArray.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/stubArray.js ***!
  \******************************************/
/***/ ((module) => {

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = stubArray;


/***/ }),

/***/ "./node_modules/lodash/stubFalse.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/stubFalse.js ***!
  \******************************************/
/***/ ((module) => {

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;


/***/ }),

/***/ "./node_modules/ms/index.js":
/*!**********************************!*\
  !*** ./node_modules/ms/index.js ***!
  \**********************************/
/***/ ((module) => {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./packages/client/lib/index.js");
/******/ })()
;
//# sourceMappingURL=feathersjs-offline-client.js.map