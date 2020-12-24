var feathersjsOfflineClient;feathersjsOfflineClient =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@feathersjs/adapter-commons/lib/filter-query.js":
/*!**********************************************************************!*
  !*** ./node_modules/@feathersjs/adapter-commons/lib/filter-query.js ***!
  \**********************************************************************/
/***/ ((module, exports, __webpack_require__) => {

"use strict";


function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.OPERATORS = exports.FILTERS = void 0;

var commons_1 = __webpack_require__(/*! @feathersjs/commons */ "./node_modules/@feathersjs/commons/lib/index.js");

var errors_1 = __webpack_require__(/*! @feathersjs/errors */ "./node_modules/@feathersjs/errors/lib/index.js");

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

/***/ "./node_modules/@feathersjs/adapter-commons/lib/index.js":
/*!***************************************************************!*
  !*** ./node_modules/@feathersjs/adapter-commons/lib/index.js ***!
  \***************************************************************/
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

var commons_1 = __webpack_require__(/*! @feathersjs/commons */ "./node_modules/@feathersjs/commons/lib/index.js");

var service_1 = __webpack_require__(/*! ./service */ "./node_modules/@feathersjs/adapter-commons/lib/service.js");

Object.defineProperty(exports, "AdapterService", ({
  enumerable: true,
  get: function get() {
    return service_1.AdapterService;
  }
}));

var filter_query_1 = __webpack_require__(/*! ./filter-query */ "./node_modules/@feathersjs/adapter-commons/lib/filter-query.js");

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

__exportStar(__webpack_require__(/*! ./sort */ "./node_modules/@feathersjs/adapter-commons/lib/sort.js"), exports); // Return a function that filters a result object or array
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

/***/ "./node_modules/@feathersjs/adapter-commons/lib/service.js":
/*!*****************************************************************!*
  !*** ./node_modules/@feathersjs/adapter-commons/lib/service.js ***!
  \*****************************************************************/
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

var errors_1 = __webpack_require__(/*! @feathersjs/errors */ "./node_modules/@feathersjs/errors/lib/index.js");

var filter_query_1 = __importDefault(__webpack_require__(/*! ./filter-query */ "./node_modules/@feathersjs/adapter-commons/lib/filter-query.js"));

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

/***/ "./node_modules/@feathersjs/adapter-commons/lib/sort.js":
/*!**************************************************************!*
  !*** ./node_modules/@feathersjs/adapter-commons/lib/sort.js ***!
  \**************************************************************/
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

/***/ "./node_modules/@feathersjs/commons/lib/hooks.js":
/*!*******************************************************!*
  !*** ./node_modules/@feathersjs/commons/lib/hooks.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.enableHooks = exports.processHooks = exports.getHooks = exports.isHookObject = exports.convertHookData = exports.makeArguments = exports.defaultMakeArguments = exports.createHookObject = exports.ACTIVATE_HOOKS = void 0;

var utils_1 = __webpack_require__(/*! ./utils */ "./node_modules/@feathersjs/commons/lib/utils.js");

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

/***/ "./node_modules/@feathersjs/commons/lib/index.js":
/*!*******************************************************!*
  !*** ./node_modules/@feathersjs/commons/lib/index.js ***!
  \*******************************************************/
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

var hookUtils = __importStar(__webpack_require__(/*! ./hooks */ "./node_modules/@feathersjs/commons/lib/hooks.js"));

__exportStar(__webpack_require__(/*! ./utils */ "./node_modules/@feathersjs/commons/lib/utils.js"), exports);

exports.hooks = hookUtils;

/***/ }),

/***/ "./node_modules/@feathersjs/commons/lib/utils.js":
/*!*******************************************************!*
  !*** ./node_modules/@feathersjs/commons/lib/utils.js ***!
  \*******************************************************/
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

/***/ "./node_modules/@feathersjs/errors/lib/index.js":
/*!******************************************************!*
  !*** ./node_modules/@feathersjs/errors/lib/index.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var debug = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js")('@feathersjs/errors');

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

/***/ "./node_modules/debug/src/browser.js":
/*!*******************************************!*
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
/*!******************************************!*
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
/*!*****************************************************!*
  !*** ./packages/client/lib/common/cryptographic.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Simply "stolen" from feathers-offline-xxx
var md5 = __webpack_require__(/*! md5 */ "./node_modules/md5/md5.js");

var _require = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/esm-browser/index.js"),
    uuidV4 = _require.v4;

var shortid = __webpack_require__(/*! shortid */ "./node_modules/shortid/index.js");

var _require2 = __webpack_require__(/*! ./misc */ "./packages/client/lib/common/misc.js"),
    stripProps = _require2.stripProps; // Integrity of short unique identifiers: https://github.com/dylang/shortid/issues/81#issuecomment-259812835


function genUuid(ifShortUuid) {
  return ifShortUuid ? shortid.generate() : uuidV4();
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
/*!*********************************************!*
  !*** ./packages/client/lib/common/index.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var to = __webpack_require__(/*! ./to */ "./packages/client/lib/common/to.js");

var cryptographic = __webpack_require__(/*! ./cryptographic */ "./packages/client/lib/common/cryptographic.js");

var misc = __webpack_require__(/*! ./misc */ "./packages/client/lib/common/misc.js");

var OptionsProxy = __webpack_require__(/*! ./options-proxy */ "./packages/client/lib/common/options-proxy.js");

module.exports = Object.assign(Object.assign(Object.assign({
  to: to
}, cryptographic), misc), {
  OptionsProxy: OptionsProxy
});

/***/ }),

/***/ "./packages/client/lib/common/misc.js":
/*!********************************************!*
  !*** ./packages/client/lib/common/misc.js ***!
  \********************************************/
/***/ ((module) => {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function isObject(value) {
  return _typeof(value) === 'object' && !Array.isArray(value) && value !== null;
}

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
  isObject: isObject,
  stripProps: stripProps
};

/***/ }),

/***/ "./packages/client/lib/common/options-proxy.js":
/*!*****************************************************!*
  !*** ./packages/client/lib/common/options-proxy.js ***!
  \*****************************************************/
/***/ ((module) => {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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

          return obj[key];
        },
        set: function set(obj, key, val) {
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

/***/ "./packages/client/lib/common/to.js":
/*!******************************************!*
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
/*!**************************************!*
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
/*!*************************************************!*
  !*** ./packages/client/lib/own-common/index.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var OwnClass = __webpack_require__(/*! ./own-class */ "./packages/client/lib/own-common/own-class.js");

module.exports = OwnClass;

/***/ }),

/***/ "./packages/client/lib/own-common/own-class.js":
/*!*****************************************************!*
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

var sift_1 = __importDefault(__webpack_require__(/*! sift */ "./node_modules/sift/es5m/index.js"));

var adapter_commons_1 = __webpack_require__(/*! @feathersjs/adapter-commons */ "./node_modules/@feathersjs/adapter-commons/lib/index.js");

var errors_1 = __importDefault(__webpack_require__(/*! @feathersjs/errors */ "./node_modules/@feathersjs/errors/lib/index.js"));

var feathers_localstorage_1 = __importDefault(__webpack_require__(/*! feathers-localstorage */ "./node_modules/feathers-localstorage/lib/index.js"));

var common_1 = __webpack_require__(/*! ../common */ "./packages/client/lib/common/index.js");

var snapshot_1 = __importDefault(__webpack_require__(/*! ../snapshot */ "./packages/client/lib/snapshot/index.js"));

var debug = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js")('@feathersjs-offline:ownclass:service-base');

if (typeof localStorage === 'undefined') {
  debug('Simulating localStorage...');

  var LocalStorage = __webpack_require__(/*! node-localstorage */ "./node_modules/node-localstorage/LocalStorage.js").LocalStorage;

  __webpack_require__.g.localStorage = new LocalStorage('./.scratch');
} else {
  debug('Utilizing built-in localStorage');
}

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
  'fixedName': ''
};
var BOT = new Date(0);
var _adapterTestStrip = ['uuid', 'updatedAt', 'onServerAt', 'deletedAt'];
var nameIx = 0;

var attrStrip = function attrStrip() {
  for (var _len = arguments.length, attr = new Array(_len), _key = 0; _key < _len; _key++) {
    attr[_key] = arguments[_key];
  }

  return function (res) {
    var result;

    if (Array.isArray(res)) {
      result = [];
      res.map(function (v, i, arr) {
        var obj = clone(arr[i]);
        attr.forEach(function (a) {
          return delete obj[a];
        });
        result.push(obj);
      });
    } else {
      result = clone(res);
      attr.forEach(function (a) {
        return delete result[a];
      });
    }

    return result;
  };
};

var OwnClass = /*#__PURE__*/function (_adapter_commons_1$Ad) {
  _inherits(OwnClass, _adapter_commons_1$Ad);

  var _super = _createSuper(OwnClass);

  function OwnClass(opts) {
    var _this;

    _classCallCheck(this, OwnClass);

    var newOpts = Object.assign({}, defaultOptions, opts);
    debug("Constructor started, newOpts = ".concat(JSON.stringify(newOpts)));
    _this = _super.call(this, newOpts);
    _this.wrapperOptions = Object.assign({}, newOpts, _this.options);
    debug("Constructor ended, options = ".concat(JSON.stringify(_this.options)));
    _this.type = 'own-class';
    debug('  Done.');
    return _possibleConstructorReturn(_this, _assertThisInitialized(_this));
  }

  _createClass(OwnClass, [{
    key: "_setup",
    value: function _setup(app, path) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                debug("_SetUp('".concat(path, "') started"));
                return _context.abrupt("return", this.setup(app, path));

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));
    }
  }, {
    key: "setup",
    value: function setup(app, path) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var self, old, localOptions, queueOptions, stripValues, idIx;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                debug("SetUp('".concat(path, "') started"));

                if (!this._setupPerformed) {
                  _context2.next = 3;
                  break;
                }

                return _context2.abrupt("return");

              case 3:
                this._setupPerformed = true;
                this.options = this.wrapperOptions;
                self = this;
                this.thisName = this.options.fixedName !== '' ? this.options.fixedName : "".concat(this.type, "_offline_").concat(nameIx++, "_").concat(path); // Now we are ready to define the path with its underlying service (the remoteService)

                old = app.service(path);

                if (old !== self) {
                  this.remoteService = old || app.service(path); // We want to get the default service (redirects to server or points to a local service)

                  app.use(path, self); // Install this service instance
                } // Get the service name and standard settings


                this.name = path; // Construct the two helper services

                this.localServiceName = this.thisName + '_local';
                this.localServiceQueue = this.thisName + '_queue';
                this.storage = this.options.storage ? this.options.storage : localStorage;
                this.localSpecOptions = {
                  name: this.localServiceName,
                  storage: this.storage,
                  store: this.options.store,
                  reuseKeys: this.options.fixedName !== ''
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
                debug("  Setting up services '".concat(this.localServiceName, "' and '").concat(this.localServiceQueue, "'..."));
                app.use(this.localServiceName, feathers_localstorage_1["default"](localOptions));
                app.use(this.localServiceQueue, feathers_localstorage_1["default"](queueOptions));
                this.localService = app.service(this.localServiceName);
                this.localQueue = app.service(this.localServiceQueue); // We need to make sure that localService is properly initiated - make a dummy search
                //    (one of the quirks of feathers-localstorage)

                _context2.next = 23;
                return this.localService.ready();

              case 23:
                // The initialization/setup of the localService adapter screws-up our options object
                this.options = this.wrapperOptions; // Are we running adapterTests?

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
                } // Make sure we always select the key (id) in our results


                this._select = function (params) {
                  for (var _len2 = arguments.length, others = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                    others[_key2 - 1] = arguments[_key2];
                  }

                  return function (res) {
                    return adapter_commons_1.select.apply(adapter_commons_1, [params].concat(others, [self.id]))(res);
                  };
                }; // Initialize the service wrapper


                this.listening = false;
                this.aIP = 0; // Our semaphore for internal processing

                this.pQActive = false; // Our flag for avoiding more than one processing of queued operations at a time
                // Determine latest registered sync timestamp

                this.syncedAt = new Date(this.storage.getItem(this.thisName + '_syncedAt') || 0).toISOString();
                this.storage.setItem(this.thisName + '_syncedAt', new Date(this.syncedAt).toISOString()); // This is necessary if we get updates to options (e.g. .options.multi = ['patch'])

                if (!(this.remoteService instanceof adapter_commons_1.AdapterService)) {
                  this._listenOptions();
                } // Make sure that the wrapped service is setup correctly


                if (typeof this.remoteService.setup === 'function') {
                  this.remoteService.setup(app, path);
                } // Should we perform a sync every timedSync?


                if (this.options.timedSync && Number.isInteger(this.options.timedSync) && this.options.timedSync > 0) {
                  this._timedSyncHandle = setInterval(function () {
                    return self.sync();
                  }, self.options.timedSync);
                }

                debug('  Done.');
                return _context2.abrupt("return", true);

              case 36:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));
    }
  }, {
    key: "_listenOptions",
    value: function _listenOptions() {
      // This is necessary if we get updates to options (e.g. .options.multi = ['patch'])
      var self = this;
      var optProxy = new common_1.OptionsProxy(self.thisName);
      this.options = optProxy.observe(Object.assign({}, self.remoteService.options ? self.remoteService.options : {}, self.options));
      optProxy.watcher(function () {
        // Update all changes to 'this.options' in both localService and remoteService
        self.remoteService.options = Object.assign({}, self.remoteService.options, self.options);
        self.localService.options = Object.assign({}, self.options, self.localSpecOptions);
      });
    }
  }, {
    key: "getEntries",
    value: function getEntries(params) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var res;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                debug("Calling getEntries(".concat(JSON.stringify(params), "})"));
                res = [];
                _context3.next = 4;
                return this.localService.getEntries(params).then(function (entries) {
                  res = entries;
                });

              case 4:
                return _context3.abrupt("return", Promise.resolve(res).then(this._strip).then(this._select(params)));

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));
    }
  }, {
    key: "get",
    value: function get(id, params) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                debug("Calling get(".concat(JSON.stringify(id), ", ").concat(JSON.stringify(params), "})"));
                return _context4.abrupt("return", this._get(id, params));

              case 2:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));
    }
  }, {
    key: "_get",
    value: function _get(id, params) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                debug("Calling _get(".concat(JSON.stringify(id), ", ").concat(JSON.stringify(params), "})"));
                _context5.next = 3;
                return this.localService.get(id, params).then(this._strip).then(this._select(params))["catch"](function (err) {
                  throw err;
                });

              case 3:
                return _context5.abrupt("return", _context5.sent);

              case 4:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));
    }
  }, {
    key: "find",
    value: function find(params) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                debug("Calling find(".concat(JSON.stringify(params), "})"));
                _context6.t0 = debug;
                _context6.t1 = "  rows=";
                _context6.t2 = JSON;
                _context6.next = 6;
                return this.getEntries();

              case 6:
                _context6.t3 = _context6.sent;
                _context6.t4 = _context6.t2.stringify.call(_context6.t2, _context6.t3);
                _context6.t5 = _context6.t1.concat.call(_context6.t1, _context6.t4);
                (0, _context6.t0)(_context6.t5);
                return _context6.abrupt("return", this._find(params));

              case 11:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));
    }
  }, {
    key: "_find",
    value: function _find(params) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                debug("Calling _find(".concat(JSON.stringify(params), "})"));
                return _context7.abrupt("return", this.localService.find(params).then(this._strip).then(this._select(params)));

              case 2:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));
    }
  }, {
    key: "create",
    value: function create(data, params) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                debug("Calling create(".concat(JSON.stringify(data), ", ").concat(JSON.stringify(params), ")"));

                if (!(Array.isArray(data) && !this.allowsMulti('create'))) {
                  _context8.next = 3;
                  break;
                }

                return _context8.abrupt("return", Promise.reject(new errors_1["default"].MethodNotAllowed('Creating multiple without option \'multi\' set')));

              case 3:
                return _context8.abrupt("return", this._create(data, params));

              case 4:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));
    }
  }, {
    key: "_create",
    value: function _create(data, params) {
      var ts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
        var _this2 = this;

        var self, multi, timestamp, newData, _yield$common_1$to, _yield$common_1$to2, err, res, newParams, queueId, _yield$common_1$to3, _yield$common_1$to4;

        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                debug("Calling _create(".concat(JSON.stringify(data), ", ").concat(JSON.stringify(params), ", ").concat(ts, ")"));
                self = this;

                if (!Array.isArray(data)) {
                  _context11.next = 8;
                  break;
                }

                multi = this.allowsMulti('create');

                if (multi) {
                  _context11.next = 6;
                  break;
                }

                return _context11.abrupt("return", Promise.reject(new errors_1["default"].MethodNotAllowed('Creating multiple without option \'multi\' set')));

              case 6:
                timestamp = new Date(); // In future version we will user Promise.allSettled() instead...

                return _context11.abrupt("return", Promise.all(data.map(function (current) {
                  return self._create(current, params, timestamp);
                })));

              case 8:
                ts = ts || new Date();
                newData = clone(data); // As we do not know if the server is connected we have to make sure the important
                // values are set with reasonable values

                if (!('uuid' in newData)) {
                  newData.uuid = common_1.genUuid(this.options.useShortUuid);
                }

                if (!('updatedAt' in newData)) {
                  newData.updatedAt = ts;
                } // We do not allow the client to set the onServerAt attribute to other than default '0'


                newData.onServerAt = BOT; // Is uuid unique?

                _context11.next = 15;
                return common_1.to(this.localService.find({
                  query: {
                    'uuid': newData.uuid
                  }
                }));

              case 15:
                _yield$common_1$to = _context11.sent;
                _yield$common_1$to2 = _slicedToArray(_yield$common_1$to, 2);
                err = _yield$common_1$to2[0];
                res = _yield$common_1$to2[1];

                if (!(res && res.length)) {
                  _context11.next = 21;
                  break;
                }

                throw new errors_1["default"].BadRequest("Optimistic create requires unique uuid. (".concat(this.type, ") res=").concat(JSON.stringify(res)));

              case 21:
                // We apply optimistic mutation
                newParams = clone(params);
                this.disallowInternalProcessing('_create');
                _context11.next = 25;
                return this._addQueuedEvent('create', newData, clone(newData), params);

              case 25:
                queueId = _context11.sent;
                _context11.next = 28;
                return common_1.to(this.localService.create(newData, clone(params)));

              case 28:
                _yield$common_1$to3 = _context11.sent;
                _yield$common_1$to4 = _slicedToArray(_yield$common_1$to3, 2);
                err = _yield$common_1$to4[0];
                res = _yield$common_1$to4[1];

                if (!res) {
                  _context11.next = 36;
                  break;
                }

                this.remoteService.create(res, clone(params)).then(function (rres) {
                  return __awaiter(_this2, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
                    return regeneratorRuntime.wrap(function _callee9$(_context9) {
                      while (1) {
                        switch (_context9.prev = _context9.next) {
                          case 0:
                            _context9.next = 2;
                            return common_1.to(self._removeQueuedEvent('_create0', queueId, newData, newData.updatedAt));

                          case 2:
                            _context9.next = 4;
                            return self._patchIfNotRemoved(rres[self.id], rres);

                          case 4:
                            // Ok, we have connection - empty queue if we have any items queued
                            self.allowInternalProcessing('_create0');
                            _context9.next = 7;
                            return common_1.to(self._processQueuedEvents());

                          case 7:
                          case "end":
                            return _context9.stop();
                        }
                      }
                    }, _callee9);
                  }));
                })["catch"](function (rerr) {
                  return __awaiter(_this2, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
                    return regeneratorRuntime.wrap(function _callee10$(_context10) {
                      while (1) {
                        switch (_context10.prev = _context10.next) {
                          case 0:
                            if (!(rerr.name !== 'Timeout')) {
                              _context10.next = 5;
                              break;
                            }

                            _context10.next = 3;
                            return common_1.to(self._removeQueuedEvent('_create1', queueId, rerr.message
                            /*newData*/
                            , newData.updatedAt));

                          case 3:
                            _context10.next = 5;
                            return common_1.to(self.localService.remove(res[self.id], params));

                          case 5:
                            self.allowInternalProcessing('_create1');

                          case 6:
                          case "end":
                            return _context10.stop();
                        }
                      }
                    }, _callee10);
                  }));
                });
                _context11.next = 40;
                break;

              case 36:
                _context11.next = 38;
                return common_1.to(this._removeQueuedEvent('_create2', queueId, newData, newData.updatedAt));

              case 38:
                this.allowInternalProcessing('_create2');
                throw err;

              case 40:
                return _context11.abrupt("return", Promise.resolve(res).then(this._strip).then(this._select(params)));

              case 41:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));
    }
  }, {
    key: "update",
    value: function update(id, data, params) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                debug("Calling update(".concat(id, ", ").concat(JSON.stringify(data), ", ").concat(JSON.stringify(params), "})"));

                if (!(id === null || Array.isArray(data))) {
                  _context12.next = 3;
                  break;
                }

                return _context12.abrupt("return", Promise.reject(new errors_1["default"].BadRequest("You can not replace multiple instances. Did you mean 'patch'?")));

              case 3:
                return _context12.abrupt("return", this._update(id, data, params));

              case 4:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));
    }
  }, {
    key: "_update",
    value: function _update(id, data) {
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee15() {
        var _this3 = this;

        var self, _yield$common_1$to5, _yield$common_1$to6, err, res, beforeRecord, beforeUuid, newData, queueId, _yield$common_1$to7, _yield$common_1$to8;

        return regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                debug("Calling _update(".concat(id, ", ").concat(JSON.stringify(data), ", ").concat(JSON.stringify(params), "})"));
                self = this;

                if (!(id === null || Array.isArray(data))) {
                  _context15.next = 4;
                  break;
                }

                return _context15.abrupt("return", Promise.reject(new errors_1["default"].BadRequest("You can not replace multiple instances. Did you mean 'patch'?")));

              case 4:
                _context15.next = 6;
                return common_1.to(this.localService._get(id));

              case 6:
                _yield$common_1$to5 = _context15.sent;
                _yield$common_1$to6 = _slicedToArray(_yield$common_1$to5, 2);
                err = _yield$common_1$to6[0];
                res = _yield$common_1$to6[1];

                if (res && res !== {}) {
                  _context15.next = 12;
                  break;
                }

                throw new errors_1["default"].NotFound("Trying to update non-existing ".concat(this.id, "=").concat(id, ". (").concat(this.type, ") err=").concat(JSON.stringify(err.name)));

              case 12:
                // We don't want our uuid to change type if it can be coerced
                beforeRecord = clone(res);
                beforeUuid = beforeRecord.uuid;
                newData = clone(data);
                newData.uuid = beforeUuid; // eslint-disable-line

                newData.updatedAt = new Date();
                newData.onServerAt = BOT; // Optimistic mutation

                this.disallowInternalProcessing('_update');
                _context15.next = 21;
                return this._addQueuedEvent('update', newData, id, clone(newData), params);

              case 21:
                queueId = _context15.sent;
                _context15.next = 24;
                return common_1.to(this.localService.update(id, newData, clone(params)));

              case 24:
                _yield$common_1$to7 = _context15.sent;
                _yield$common_1$to8 = _slicedToArray(_yield$common_1$to7, 2);
                err = _yield$common_1$to8[0];
                res = _yield$common_1$to8[1];

                if (err) {
                  _context15.next = 32;
                  break;
                }

                this.remoteService.update(id, res, clone(params)).then(function (rres) {
                  return __awaiter(_this3, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
                    return regeneratorRuntime.wrap(function _callee13$(_context13) {
                      while (1) {
                        switch (_context13.prev = _context13.next) {
                          case 0:
                            _context13.next = 2;
                            return common_1.to(self._removeQueuedEvent('_update0', queueId, newData, res.updatedAt));

                          case 2:
                            _context13.next = 4;
                            return self._patchIfNotRemoved(rres[self.id], rres);

                          case 4:
                            self.allowInternalProcessing('_update0');
                            _context13.next = 7;
                            return common_1.to(self._processQueuedEvents());

                          case 7:
                          case "end":
                            return _context13.stop();
                        }
                      }
                    }, _callee13);
                  }));
                })["catch"](function (rerr) {
                  return __awaiter(_this3, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
                    return regeneratorRuntime.wrap(function _callee14$(_context14) {
                      while (1) {
                        switch (_context14.prev = _context14.next) {
                          case 0:
                            if (!(rerr.name === 'Timeout')) {
                              _context14.next = 4;
                              break;
                            }

                            debug("_update TIMEOUT: ".concat(rerr.name, ", ").concat(rerr.message)); // Let's silently ignore missing connection to server
                            // We'll catch-up next time we get a connection

                            _context14.next = 9;
                            break;

                          case 4:
                            debug("_update ERROR: ".concat(rerr.name, ", ").concat(rerr.message));
                            _context14.next = 7;
                            return common_1.to(self._removeQueuedEvent('_update1', queueId, newData, res.updatedAt));

                          case 7:
                            _context14.next = 9;
                            return common_1.to(self.localService.patch(id, beforeRecord));

                          case 9:
                            self.allowInternalProcessing('_update1');

                          case 10:
                          case "end":
                            return _context14.stop();
                        }
                      }
                    }, _callee14);
                  }));
                });
                _context15.next = 36;
                break;

              case 32:
                _context15.next = 34;
                return common_1.to(this._removeQueuedEvent('_update2', queueId, newData, newData.updatedAt));

              case 34:
                this.allowInternalProcessing('_update2');
                throw err;

              case 36:
                return _context15.abrupt("return", Promise.resolve(newData).then(this._strip).then(this._select(params)));

              case 37:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));
    }
  }, {
    key: "patch",
    value: function patch(id, data, params) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee16() {
        return regeneratorRuntime.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                debug("Calling patch(".concat(id, ", ").concat(JSON.stringify(data), ", ").concat(JSON.stringify(params), "})"));

                if (!(id === null && !this.allowsMulti('patch'))) {
                  _context16.next = 3;
                  break;
                }

                return _context16.abrupt("return", Promise.reject(new errors_1["default"].MethodNotAllowed("Can not patch multiple entries")));

              case 3:
                return _context16.abrupt("return", this._patch(id, data, params));

              case 4:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));
    }
  }, {
    key: "_patch",
    value: function _patch(id, data) {
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var ts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee19() {
        var _this4 = this;

        var self, multi, _yield$common_1$to9, _yield$common_1$to10, err, res, beforeRecord, newData, queueId, _yield$common_1$to11, _yield$common_1$to12;

        return regeneratorRuntime.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                debug("Calling _patch(".concat(id, ", ").concat(JSON.stringify(data), ", ").concat(JSON.stringify(params), "})"));
                self = this;

                if (!(id === null)) {
                  _context19.next = 7;
                  break;
                }

                multi = this.allowsMulti('patch');

                if (multi) {
                  _context19.next = 6;
                  break;
                }

                throw new errors_1["default"].MethodNotAllowed('Patching multiple without option \'multi\' set');

              case 6:
                return _context19.abrupt("return", this.find(params).then(function (page) {
                  var res = page.data ? page.data : page;

                  if (!Array.isArray(res)) {
                    res = (_readOnlyError("res"), [res]);
                  }

                  var timestamp = new Date().toISOString();
                  return Promise.all(res.map(function (current) {
                    return self._patch(current[_this4.id], data, params, timestamp);
                  }));
                }));

              case 7:
                ts = ts || new Date();
                _context19.next = 10;
                return common_1.to(this.localService._get(id));

              case 10:
                _yield$common_1$to9 = _context19.sent;
                _yield$common_1$to10 = _slicedToArray(_yield$common_1$to9, 2);
                err = _yield$common_1$to10[0];
                res = _yield$common_1$to10[1];

                if (res && res !== {}) {
                  _context19.next = 16;
                  break;
                }

                throw err;

              case 16:
                // Optimistic mutation
                beforeRecord = clone(res);
                newData = Object.assign({}, beforeRecord, data);
                newData.onServerAt = BOT;
                newData.updatedAt = ts;
                this.disallowInternalProcessing('_patch');
                _context19.next = 23;
                return this._addQueuedEvent('patch', newData, id, clone(newData), params);

              case 23:
                queueId = _context19.sent;
                _context19.next = 26;
                return common_1.to(this.localService.patch(id, newData, clone(params)));

              case 26:
                _yield$common_1$to11 = _context19.sent;
                _yield$common_1$to12 = _slicedToArray(_yield$common_1$to11, 2);
                err = _yield$common_1$to12[0];
                res = _yield$common_1$to12[1];

                if (!res) {
                  _context19.next = 34;
                  break;
                }

                this.remoteService.patch(id, res, clone(params)).then(function (rres) {
                  return __awaiter(_this4, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee17() {
                    return regeneratorRuntime.wrap(function _callee17$(_context17) {
                      while (1) {
                        switch (_context17.prev = _context17.next) {
                          case 0:
                            _context17.next = 2;
                            return common_1.to(self._removeQueuedEvent('_patch0', queueId, rres, res.updatedAt));

                          case 2:
                            _context17.next = 4;
                            return self._patchIfNotRemoved(rres[self.id], rres);

                          case 4:
                            self.allowInternalProcessing('_patch0');
                            _context17.next = 7;
                            return common_1.to(self._processQueuedEvents());

                          case 7:
                          case "end":
                            return _context17.stop();
                        }
                      }
                    }, _callee17);
                  }));
                })["catch"](function (rerr) {
                  return __awaiter(_this4, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee18() {
                    return regeneratorRuntime.wrap(function _callee18$(_context18) {
                      while (1) {
                        switch (_context18.prev = _context18.next) {
                          case 0:
                            if (!(rerr.name === 'Timeout')) {
                              _context18.next = 4;
                              break;
                            }

                            debug("_patch TIMEOUT: ".concat(rerr.name, ", ").concat(rerr.message)); // Let's silently ignore missing connection to server
                            // We'll catch-up next time we get a connection

                            _context18.next = 9;
                            break;

                          case 4:
                            debug("_patch ERROR: ".concat(rerr.name, ", ").concat(rerr.message));
                            _context18.next = 7;
                            return common_1.to(self._removeQueuedEvent('_patch1', queueId, newData, res.updatedAt));

                          case 7:
                            _context18.next = 9;
                            return common_1.to(self.localService.patch(id, beforeRecord));

                          case 9:
                            self.allowInternalProcessing('_patch1');

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
                return common_1.to(this._removeQueuedEvent('_patch2', queueId, newData, newData.updatedAt));

              case 36:
                this.allowInternalProcessing('_patch2');
                throw err;

              case 38:
                return _context19.abrupt("return", Promise.resolve(newData).then(this._strip).then(this._select(params)));

              case 39:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee19, this);
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
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee20() {
        return regeneratorRuntime.wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                return _context20.abrupt("return", this.localService.patch(id, data)["catch"](function (_) {
                  return Promise.resolve(true);
                }));

              case 1:
              case "end":
                return _context20.stop();
            }
          }
        }, _callee20, this);
      }));
    }
  }, {
    key: "remove",
    value: function remove(id, params) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee21() {
        return regeneratorRuntime.wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                debug("Calling remove(".concat(id, ", ").concat(JSON.stringify(params), "})"));

                if (!(id === null && !this.allowsMulti('remove'))) {
                  _context21.next = 3;
                  break;
                }

                return _context21.abrupt("return", Promise.reject(new errors_1["default"].MethodNotAllowed("Can not remove multiple entries")));

              case 3:
                return _context21.abrupt("return", this._remove(id, params));

              case 4:
              case "end":
                return _context21.stop();
            }
          }
        }, _callee21, this);
      }));
    }
  }, {
    key: "_remove",
    value: function _remove(id) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee24() {
        var _this5 = this;

        var self, multi, _yield$common_1$to13, _yield$common_1$to14, err, res, beforeRecord, queueId, _yield$common_1$to15, _yield$common_1$to16;

        return regeneratorRuntime.wrap(function _callee24$(_context24) {
          while (1) {
            switch (_context24.prev = _context24.next) {
              case 0:
                debug("Calling _remove(".concat(id, ", ").concat(JSON.stringify(params), "})"));
                self = this;

                if (!(id === null)) {
                  _context24.next = 7;
                  break;
                }

                multi = this.allowsMulti('remove');

                if (multi) {
                  _context24.next = 6;
                  break;
                }

                throw new errors_1["default"].MethodNotAllowed('Removing multiple without option \'multi\' set');

              case 6:
                return _context24.abrupt("return", this.find(params).then(function (page) {
                  var res = page.data ? page.data : page;

                  if (!Array.isArray(res)) {
                    res = (_readOnlyError("res"), [res]);
                  }

                  return Promise.all(res.map(function (current) {
                    return self._remove(current[_this5.id], params);
                  }));
                }));

              case 7:
                _context24.next = 9;
                return common_1.to(this.localService._get(id));

              case 9:
                _yield$common_1$to13 = _context24.sent;
                _yield$common_1$to14 = _slicedToArray(_yield$common_1$to13, 2);
                err = _yield$common_1$to14[0];
                res = _yield$common_1$to14[1];

                if (res && res !== {}) {
                  _context24.next = 15;
                  break;
                }

                throw new errors_1["default"].BadRequest("Trying to remove non-existing ".concat(this.id, "=").concat(id, ". (").concat(this.type, ") err=").concat(JSON.stringify(err), ", res=").concat(JSON.stringify(res)));

              case 15:
                // Optimistic mutation
                beforeRecord = clone(res);
                this.disallowInternalProcessing('_remove');
                _context24.next = 19;
                return this._addQueuedEvent('remove', beforeRecord, id, params);

              case 19:
                queueId = _context24.sent;
                _context24.next = 22;
                return common_1.to(this.localService.remove(id, clone(params)));

              case 22:
                _yield$common_1$to15 = _context24.sent;
                _yield$common_1$to16 = _slicedToArray(_yield$common_1$to15, 2);
                err = _yield$common_1$to16[0];
                res = _yield$common_1$to16[1];

                if (err) {
                  _context24.next = 30;
                  break;
                }

                this.remoteService.remove(id, clone(params)).then(function (rres) {
                  return __awaiter(_this5, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee22() {
                    return regeneratorRuntime.wrap(function _callee22$(_context22) {
                      while (1) {
                        switch (_context22.prev = _context22.next) {
                          case 0:
                            _context22.next = 2;
                            return common_1.to(self._removeQueuedEvent('_remove0', queueId, beforeRecord, null));

                          case 2:
                            self.allowInternalProcessing('_remove0');
                            _context22.next = 5;
                            return common_1.to(self._processQueuedEvents());

                          case 5:
                          case "end":
                            return _context22.stop();
                        }
                      }
                    }, _callee22);
                  }));
                })["catch"](function (rerr) {
                  return __awaiter(_this5, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee23() {
                    return regeneratorRuntime.wrap(function _callee23$(_context23) {
                      while (1) {
                        switch (_context23.prev = _context23.next) {
                          case 0:
                            if (!(rerr.name === 'Timeout')) {
                              _context23.next = 4;
                              break;
                            }

                            debug("_remove TIMEOUT: ".concat(rerr.name, ", ").concat(rerr.message));
                            _context23.next = 9;
                            break;

                          case 4:
                            debug("_remove ERROR: ".concat(rerr.name, ", ").concat(rerr.message, "\nbeforeRecord = ").concat(JSON.stringify(beforeRecord))); // if (beforeRecord.onServerAt === BOT) {
                            // In all likelihood the document/item was never on the server
                            // so we choose to silently ignore this situation
                            // } else {
                            // We have to restore the record to  the local DB

                            _context23.next = 7;
                            return common_1.to(self._removeQueuedEvent('_remove1', queueId, beforeRecord, null));

                          case 7:
                            _context23.next = 9;
                            return common_1.to(self.localService.create(beforeRecord, null));

                          case 9:
                            self.allowInternalProcessing('_remove1');

                          case 10:
                          case "end":
                            return _context23.stop();
                        }
                      }
                    }, _callee23);
                  }));
                });
                _context24.next = 34;
                break;

              case 30:
                _context24.next = 32;
                return common_1.to(this._removeQueuedEvent('_remove2', queueId, beforeRecord, null));

              case 32:
                this.allowInternalProcessing('_remove2');
                throw err;

              case 34:
                return _context24.abrupt("return", Promise.resolve(beforeRecord).then(this._strip).then(this._select(params)));

              case 35:
              case "end":
                return _context24.stop();
            }
          }
        }, _callee24, this);
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
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee25() {
        var _yield$common_1$to17, _yield$common_1$to18, err, res;

        return regeneratorRuntime.wrap(function _callee25$(_context25) {
          while (1) {
            switch (_context25.prev = _context25.next) {
              case 0:
                debug('addQueuedEvent entered');
                _context25.next = 3;
                return common_1.to(this.localQueue.create({
                  eventName: eventName,
                  record: localRecord,
                  arg1: arg1,
                  arg2: arg2,
                  arg3: arg3
                }));

              case 3:
                _yield$common_1$to17 = _context25.sent;
                _yield$common_1$to18 = _slicedToArray(_yield$common_1$to17, 2);
                err = _yield$common_1$to18[0];
                res = _yield$common_1$to18[1];
                debug("addQueuedEvent added: ".concat(JSON.stringify(res)));
                return _context25.abrupt("return", Promise.resolve(res.id));

              case 9:
              case "end":
                return _context25.stop();
            }
          }
        }, _callee25, this);
      }));
    }
  }, {
    key: "_removeQueuedEvent",
    value: function _removeQueuedEvent(eventName, id, localRecord, updatedAt) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee26() {
        var _yield$common_1$to19, _yield$common_1$to20, err, res;

        return regeneratorRuntime.wrap(function _callee26$(_context26) {
          while (1) {
            switch (_context26.prev = _context26.next) {
              case 0:
                debug('removeQueuedEvent entered');
                _context26.next = 3;
                return common_1.to(this.localQueue.remove(id));

              case 3:
                _yield$common_1$to19 = _context26.sent;
                _yield$common_1$to20 = _slicedToArray(_yield$common_1$to19, 2);
                err = _yield$common_1$to20[0];
                res = _yield$common_1$to20[1];
                return _context26.abrupt("return", Promise.resolve(res));

              case 8:
              case "end":
                return _context26.stop();
            }
          }
        }, _callee26, this);
      }));
    }
    /**
     * This method must be implemented in own-data and own-net classes extending this class
     */

  }, {
    key: "_processQueuedEvents",
    value: function _processQueuedEvents() {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee27() {
        return regeneratorRuntime.wrap(function _callee27$(_context27) {
          while (1) {
            switch (_context27.prev = _context27.next) {
              case 0:
                throw new errors_1["default"].NotImplemented("_processQueuedEvents must be implemented!!!");

              case 1:
              case "end":
                return _context27.stop();
            }
          }
        }, _callee27);
      }));
    }
    /* Event listening */

    /* Synchronization */

    /**
     * Synchronize the relevant documents/items from the remote db with the local db.
     *
     * @param {boolean} bAll If true, we try to sync for the beginning of time.
     * @returns {boolean} True if the process was completed, false otherwise.
     */

  }, {
    key: "sync",
    value: function sync() {
      var bAll = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee29() {
        var _this6 = this;

        var syncOptions, self, result, _yield$common_1$to21, _yield$common_1$to22, err, snap, syncTS;

        return regeneratorRuntime.wrap(function _callee29$(_context29) {
          while (1) {
            switch (_context29.prev = _context29.next) {
              case 0:
                if (this.internalProcessingAllowed()) {
                  _context29.next = 5;
                  break;
                }

                _context29.next = 3;
                return new Promise(function (resolve) {
                  setTimeout(function () {
                    resolve(true);
                  }, 200);
                });

              case 3:
                _context29.next = 0;
                break;

              case 5:
                _context29.next = 7;
                return this._getSyncOptions(bAll);

              case 7:
                syncOptions = _context29.sent;
                debug("".concat(this.type, ".sync(").concat(JSON.stringify(syncOptions), ") started..."));
                self = this;
                result = true;
                _context29.next = 13;
                return common_1.to(snapshot_1["default"](this.remoteService, syncOptions));

              case 13:
                _yield$common_1$to21 = _context29.sent;
                _yield$common_1$to22 = _slicedToArray(_yield$common_1$to21, 2);
                err = _yield$common_1$to22[0];
                snap = _yield$common_1$to22[1];

                if (!err) {
                  _context29.next = 21;
                  break;
                }

                // we silently ignore any errors
                if (err.className === 'timeout') {
                  debug("  TIMEOUT: ".concat(JSON.stringify(err)));
                } else {
                  debug("  ERROR: ".concat(JSON.stringify(err)));
                } // Ok, tell anyone interested about the result


                this.localService.emit('synced', false);
                return _context29.abrupt("return", false);

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
                syncTS = new Date(0).toISOString();
                _context29.next = 25;
                return Promise.all(snap.map(function (v) {
                  return __awaiter(_this6, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee28() {
                    var _yield$common_1$to23, _yield$common_1$to24, err, res, _yield$common_1$to25, _yield$common_1$to26, _yield$common_1$to27, _yield$common_1$to28, _yield$common_1$to29, _yield$common_1$to30;

                    return regeneratorRuntime.wrap(function _callee28$(_context28) {
                      while (1) {
                        switch (_context28.prev = _context28.next) {
                          case 0:
                            _context28.next = 2;
                            return common_1.to(self.localService.get(v[self.id]));

                          case 2:
                            _yield$common_1$to23 = _context28.sent;
                            _yield$common_1$to24 = _slicedToArray(_yield$common_1$to23, 2);
                            err = _yield$common_1$to24[0];
                            res = _yield$common_1$to24[1];

                            if (!res) {
                              _context28.next = 26;
                              break;
                            }

                            syncTS = syncTS < v.onServerAt ? v.onServerAt : syncTS;

                            if (!v.deletedAt) {
                              _context28.next = 17;
                              break;
                            }

                            _context28.next = 11;
                            return common_1.to(self.localService.remove(v[self.id]));

                          case 11:
                            _yield$common_1$to25 = _context28.sent;
                            _yield$common_1$to26 = _slicedToArray(_yield$common_1$to25, 2);
                            err = _yield$common_1$to26[0];
                            res = _yield$common_1$to26[1];
                            _context28.next = 23;
                            break;

                          case 17:
                            _context28.next = 19;
                            return common_1.to(self.localService.patch(v[self.id], v));

                          case 19:
                            _yield$common_1$to27 = _context28.sent;
                            _yield$common_1$to28 = _slicedToArray(_yield$common_1$to27, 2);
                            err = _yield$common_1$to28[0];
                            res = _yield$common_1$to28[1];

                          case 23:
                            if (err) {
                              result = false;
                            }

                            _context28.next = 35;
                            break;

                          case 26:
                            if (v.deletedAt) {
                              _context28.next = 35;
                              break;
                            }

                            syncTS = syncTS < v.onServerAt ? v.onServerAt : syncTS;
                            _context28.next = 30;
                            return common_1.to(self.localService.create(v));

                          case 30:
                            _yield$common_1$to29 = _context28.sent;
                            _yield$common_1$to30 = _slicedToArray(_yield$common_1$to29, 2);
                            err = _yield$common_1$to30[0];
                            res = _yield$common_1$to30[1];

                            if (err) {
                              result = false;
                            }

                          case 35:
                          case "end":
                            return _context28.stop();
                        }
                      }
                    }, _callee28);
                  }));
                }));

              case 25:
                // Save last sync timestamp
                this.storage.setItem(this.thisName + '_syncedAt', new Date(syncTS).toISOString());

                if (!result) {
                  _context29.next = 34;
                  break;
                }

              case 27:
                _context29.next = 29;
                return this._processQueuedEvents();

              case 29:
                if (_context29.sent) {
                  _context29.next = 34;
                  break;
                }

                _context29.next = 32;
                return new Promise(function (resolve) {
                  setTimeout(function () {
                    resolve(true);
                  }, 200);
                });

              case 32:
                _context29.next = 27;
                break;

              case 34:
                ; // Ok, tell anyone interested about the result

                this.localService.emit('synced', result);
                return _context29.abrupt("return", result);

              case 37:
              case "end":
                return _context29.stop();
            }
          }
        }, _callee29, this);
      }));
    }
    /**
     * Determine the relevant options necessary for synchronizing this service.
     *
     * @param {boolean} bAll If true, we try to sync for the beginning of time.
     * @returns {object} The relevant options for snapshot().
     */

  }, {
    key: "_getSyncOptions",
    value: function _getSyncOptions(bAll) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee30() {
        var query, ts, syncTS;
        return regeneratorRuntime.wrap(function _callee30$(_context30) {
          while (1) {
            switch (_context30.prev = _context30.next) {
              case 0:
                query = Object.assign({}, {
                  offline: {
                    _forceAll: true
                  },
                  $sort: {
                    onServerAt: 1
                  }
                });
                ts = bAll ? new Date(0).toISOString() : this.syncedAt;
                syncTS = ts < this.syncedAt ? ts : this.syncedAt;

                if (syncTS !== new Date(ts)) {
                  query.offline.onServerAt = new Date(syncTS);
                }

                return _context30.abrupt("return", query);

              case 5:
              case "end":
                return _context30.stop();
            }
          }
        }, _callee30, this);
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
module.exports = OwnClass; // --- Helper functions

/**
 * Make a full clone of any given object
 * @param {object} obj
 * @returns {object} The copy object
 */

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/***/ }),

/***/ "./packages/client/lib/owndata/index.js":
/*!**********************************************!*
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

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var commons_1 = __webpack_require__(/*! @feathersjs/commons */ "./node_modules/@feathersjs/commons/lib/index.js");

var errors_1 = __importDefault(__webpack_require__(/*! @feathersjs/errors */ "./node_modules/@feathersjs/errors/lib/index.js"));

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

        var _yield$common_1$to, _yield$common_1$to2, err, store, self, stop, _loop;

        return regeneratorRuntime.wrap(function _callee3$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                debug("processQueuedEvents (".concat(this.type, ") entered"));

                if (!(!this.internalProcessingAllowed() || this.pQActive)) {
                  _context4.next = 3;
                  break;
                }

                return _context4.abrupt("return", false);

              case 3:
                this.pQActive = true;
                _context4.next = 6;
                return common_1.to(this.localQueue.getEntries({
                  query: {
                    $sort: _defineProperty({}, this.id, 1)
                  }
                }));

              case 6:
                _yield$common_1$to = _context4.sent;
                _yield$common_1$to2 = _slicedToArray(_yield$common_1$to, 2);
                err = _yield$common_1$to2[0];
                store = _yield$common_1$to2[1];

                if (!(!store || store === [])) {
                  _context4.next = 13;
                  break;
                }

                this.pQActive = false;
                return _context4.abrupt("return", true);

              case 13:
                debug("  processing ".concat(store.length, " queued entries..."));
                self = this;
                stop = false;
                _loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop() {
                  var el, _el, eventName, record, arg1, arg2, _el$arg, arg3, id, _accEvent2;

                  return regeneratorRuntime.wrap(function _loop$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          el = store.shift();
                          _el = el, eventName = _el.eventName, record = _el.record, arg1 = _el.arg1, arg2 = _el.arg2, _el$arg = _el.arg3, arg3 = _el$arg === void 0 ? null : _el$arg, id = _el.id;
                          _accEvent2 = _accEvent(_this2.id, eventName, record, arg1, arg2, arg3, id);
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
                                      return common_1.to(self.localQueue.remove(id));

                                    case 2:
                                      if (!(eventName !== 'remove')) {
                                        _context.next = 5;
                                        break;
                                      }

                                      _context.next = 5;
                                      return common_1.to(self.localService.patch(res[self.id], res));

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
                                      return common_1.to(self.localQueue.remove(id));

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
  debug("owndataWrapper started on path '".concat(path, "'"));

  if (!(app && app.version && app.service && app.services)) {
    throw new errors_1["default"].Unavailable("The FeathersJS app must be supplied as first argument");
  }

  var location = commons_1.stripSlashes(path);
  var old = app.service(location);

  if (typeof old === 'undefined') {
    throw new errors_1["default"].Unavailable("No prior service registered on path '".concat(location, "'"));
  }

  var opts = Object.assign({}, old.options, options);
  app.use(location, Owndata(opts));
  app.service(location).options = opts;

  app.service(location)._listenOptions();

  return app.service(location);
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
/*!*********************************************!*
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

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var commons_1 = __webpack_require__(/*! @feathersjs/commons */ "./node_modules/@feathersjs/commons/lib/index.js");

var errors_1 = __importDefault(__webpack_require__(/*! @feathersjs/errors */ "./node_modules/@feathersjs/errors/lib/index.js"));

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

        var _yield$common_1$to, _yield$common_1$to2, err, store, self, i, j, ids, netOps, ev, stop, eventName, record, arg1, arg2, arg3, _store$i, res, _err, _yield$common_1$to3, _yield$common_1$to4, action, result;

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
                return common_1.to(this.localQueue.getEntries({
                  query: {
                    $sort: {
                      uuid: 1,
                      updatedAt: 1
                    }
                  }
                }));

              case 7:
                _yield$common_1$to = _context4.sent;
                _yield$common_1$to2 = _slicedToArray(_yield$common_1$to, 2);
                err = _yield$common_1$to2[0];
                store = _yield$common_1$to2[1];

                if (!(!store || store === [] || store.length === 0)) {
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
                return common_1.to(self.localService.get(store[j].record[this.id]));

              case 30:
                _yield$common_1$to3 = _context4.sent;
                _yield$common_1$to4 = _slicedToArray(_yield$common_1$to3, 2);
                _err = _yield$common_1$to4[0];
                res = _yield$common_1$to4[1];
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
                                              $in: clone(ids)
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
  debug("ownnetWrapper started on path '".concat(path, "'"));
  if (!(app && app.version && app.service && app.services)) throw new errors_1["default"].Unavailable("The FeathersJS app must be supplied as first argument");
  var location = commons_1.stripSlashes(path);
  var old = app.service(location);

  if (typeof old === 'undefined') {
    throw new errors_1["default"].Unavailable("No prior service registered on path '".concat(location, "'"));
  }

  var opts = Object.assign({}, old.options, options);
  app.use(location, Ownnet(opts));
  app.service(location).options = opts;

  app.service(location)._listenOptions();

  return app.service(location);
}

module.exports = {
  init: init,
  Ownnet: Ownnet,
  ownnetWrapper: ownnetWrapper
};
init.Service = OwnnetClass; // Helpers

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

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
/*!***********************************************!*
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

var debug = debug_1["default"]('@feathersjs-offline:snapshot');

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

/***/ "./node_modules/charenc/charenc.js":
/*!*****************************************!*
  !*** ./node_modules/charenc/charenc.js ***!
  \*****************************************/
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

/***/ "./node_modules/crypt/crypt.js":
/*!*************************************!*
  !*** ./node_modules/crypt/crypt.js ***!
  \*************************************/
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

/***/ "./node_modules/events/events.js":
/*!***************************************!*
  !*** ./node_modules/events/events.js ***!
  \***************************************/
/***/ ((module) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function eventListener() {
      if (errorListener !== undefined) {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };
    var errorListener;

    // Adding an error listener is not optional because
    // if an error is thrown on an event emitter we cannot
    // guarantee that the actual event we are waiting will
    // be fired. The result could be a silent way to create
    // memory or file descriptor leaks, which is something
    // we should avoid.
    if (name !== 'error') {
      errorListener = function errorListener(err) {
        emitter.removeListener(name, eventListener);
        reject(err);
      };

      emitter.once('error', errorListener);
    }

    emitter.once(name, eventListener);
  });
}


/***/ }),

/***/ "./node_modules/feathers-localstorage/lib/index.js":
/*!*********************************************************!*
  !*** ./node_modules/feathers-localstorage/lib/index.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { Service } = __webpack_require__(/*! feathers-memory */ "./node_modules/feathers-memory/lib/index.js");

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

/***/ "./node_modules/feathers-memory/lib/index.js":
/*!***************************************************!*
  !*** ./node_modules/feathers-memory/lib/index.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const errors = __webpack_require__(/*! @feathersjs/errors */ "./node_modules/@feathersjs/errors/lib/index.js");
const { _ } = __webpack_require__(/*! @feathersjs/commons */ "./node_modules/@feathersjs/commons/lib/index.js");
const { sorter, select, AdapterService } = __webpack_require__(/*! @feathersjs/adapter-commons */ "./node_modules/@feathersjs/adapter-commons/lib/index.js");
const sift = __webpack_require__(/*! sift */ "./node_modules/feathers-memory/node_modules/sift/src/index.js").default;

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

/***/ "./node_modules/feathers-memory/node_modules/sift/src/index.js":
/*!*********************************************************************!*
  !*** ./node_modules/feathers-memory/node_modules/sift/src/index.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ sift,
/* harmony export */   "compare": () => /* binding */ compare,
/* harmony export */   "comparable": () => /* binding */ comparable
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

/***/ "./node_modules/graceful-fs/clone.js":
/*!*******************************************!*
  !*** ./node_modules/graceful-fs/clone.js ***!
  \*******************************************/
/***/ ((module) => {

"use strict";


module.exports = clone

function clone (obj) {
  if (obj === null || typeof obj !== 'object')
    return obj

  if (obj instanceof Object)
    var copy = { __proto__: obj.__proto__ }
  else
    var copy = Object.create(null)

  Object.getOwnPropertyNames(obj).forEach(function (key) {
    Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj, key))
  })

  return copy
}


/***/ }),

/***/ "./node_modules/graceful-fs/graceful-fs.js":
/*!*************************************************!*
  !*** ./node_modules/graceful-fs/graceful-fs.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var fs = __webpack_require__(/*! fs */ "?65c5")
var polyfills = __webpack_require__(/*! ./polyfills.js */ "./node_modules/graceful-fs/polyfills.js")
var legacy = __webpack_require__(/*! ./legacy-streams.js */ "./node_modules/graceful-fs/legacy-streams.js")
var clone = __webpack_require__(/*! ./clone.js */ "./node_modules/graceful-fs/clone.js")

var util = __webpack_require__(/*! util */ "?0bed")

/* istanbul ignore next - node 0.x polyfill */
var gracefulQueue
var previousSymbol

/* istanbul ignore else - node 0.x polyfill */
if (typeof Symbol === 'function' && typeof Symbol.for === 'function') {
  gracefulQueue = Symbol.for('graceful-fs.queue')
  // This is used in testing by future versions
  previousSymbol = Symbol.for('graceful-fs.previous')
} else {
  gracefulQueue = '___graceful-fs.queue'
  previousSymbol = '___graceful-fs.previous'
}

function noop () {}

function publishQueue(context, queue) {
  Object.defineProperty(context, gracefulQueue, {
    get: function() {
      return queue
    }
  })
}

var debug = noop
if (util.debuglog)
  debug = util.debuglog('gfs4')
else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ''))
  debug = function() {
    var m = util.format.apply(util, arguments)
    m = 'GFS4: ' + m.split(/\n/).join('\nGFS4: ')
    console.error(m)
  }

// Once time initialization
if (!fs[gracefulQueue]) {
  // This queue can be shared by multiple loaded instances
  var queue = __webpack_require__.g[gracefulQueue] || []
  publishQueue(fs, queue)

  // Patch fs.close/closeSync to shared queue version, because we need
  // to retry() whenever a close happens *anywhere* in the program.
  // This is essential when multiple graceful-fs instances are
  // in play at the same time.
  fs.close = (function (fs$close) {
    function close (fd, cb) {
      return fs$close.call(fs, fd, function (err) {
        // This function uses the graceful-fs shared queue
        if (!err) {
          retry()
        }

        if (typeof cb === 'function')
          cb.apply(this, arguments)
      })
    }

    Object.defineProperty(close, previousSymbol, {
      value: fs$close
    })
    return close
  })(fs.close)

  fs.closeSync = (function (fs$closeSync) {
    function closeSync (fd) {
      // This function uses the graceful-fs shared queue
      fs$closeSync.apply(fs, arguments)
      retry()
    }

    Object.defineProperty(closeSync, previousSymbol, {
      value: fs$closeSync
    })
    return closeSync
  })(fs.closeSync)

  if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || '')) {
    process.on('exit', function() {
      debug(fs[gracefulQueue])
      __webpack_require__(/*! assert */ "?b0c0").equal(fs[gracefulQueue].length, 0)
    })
  }
}

if (!__webpack_require__.g[gracefulQueue]) {
  publishQueue(__webpack_require__.g, fs[gracefulQueue]);
}

module.exports = patch(clone(fs))
if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs.__patched) {
    module.exports = patch(fs)
    fs.__patched = true;
}

function patch (fs) {
  // Everything that references the open() function needs to be in here
  polyfills(fs)
  fs.gracefulify = patch

  fs.createReadStream = createReadStream
  fs.createWriteStream = createWriteStream
  var fs$readFile = fs.readFile
  fs.readFile = readFile
  function readFile (path, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$readFile(path, options, cb)

    function go$readFile (path, options, cb) {
      return fs$readFile(path, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$readFile, [path, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$writeFile = fs.writeFile
  fs.writeFile = writeFile
  function writeFile (path, data, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$writeFile(path, data, options, cb)

    function go$writeFile (path, data, options, cb) {
      return fs$writeFile(path, data, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$writeFile, [path, data, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$appendFile = fs.appendFile
  if (fs$appendFile)
    fs.appendFile = appendFile
  function appendFile (path, data, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$appendFile(path, data, options, cb)

    function go$appendFile (path, data, options, cb) {
      return fs$appendFile(path, data, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$appendFile, [path, data, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$readdir = fs.readdir
  fs.readdir = readdir
  function readdir (path, options, cb) {
    var args = [path]
    if (typeof options !== 'function') {
      args.push(options)
    } else {
      cb = options
    }
    args.push(go$readdir$cb)

    return go$readdir(args)

    function go$readdir$cb (err, files) {
      if (files && files.sort)
        files.sort()

      if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
        enqueue([go$readdir, [args]])

      else {
        if (typeof cb === 'function')
          cb.apply(this, arguments)
        retry()
      }
    }
  }

  function go$readdir (args) {
    return fs$readdir.apply(fs, args)
  }

  if (process.version.substr(0, 4) === 'v0.8') {
    var legStreams = legacy(fs)
    ReadStream = legStreams.ReadStream
    WriteStream = legStreams.WriteStream
  }

  var fs$ReadStream = fs.ReadStream
  if (fs$ReadStream) {
    ReadStream.prototype = Object.create(fs$ReadStream.prototype)
    ReadStream.prototype.open = ReadStream$open
  }

  var fs$WriteStream = fs.WriteStream
  if (fs$WriteStream) {
    WriteStream.prototype = Object.create(fs$WriteStream.prototype)
    WriteStream.prototype.open = WriteStream$open
  }

  Object.defineProperty(fs, 'ReadStream', {
    get: function () {
      return ReadStream
    },
    set: function (val) {
      ReadStream = val
    },
    enumerable: true,
    configurable: true
  })
  Object.defineProperty(fs, 'WriteStream', {
    get: function () {
      return WriteStream
    },
    set: function (val) {
      WriteStream = val
    },
    enumerable: true,
    configurable: true
  })

  // legacy names
  var FileReadStream = ReadStream
  Object.defineProperty(fs, 'FileReadStream', {
    get: function () {
      return FileReadStream
    },
    set: function (val) {
      FileReadStream = val
    },
    enumerable: true,
    configurable: true
  })
  var FileWriteStream = WriteStream
  Object.defineProperty(fs, 'FileWriteStream', {
    get: function () {
      return FileWriteStream
    },
    set: function (val) {
      FileWriteStream = val
    },
    enumerable: true,
    configurable: true
  })

  function ReadStream (path, options) {
    if (this instanceof ReadStream)
      return fs$ReadStream.apply(this, arguments), this
    else
      return ReadStream.apply(Object.create(ReadStream.prototype), arguments)
  }

  function ReadStream$open () {
    var that = this
    open(that.path, that.flags, that.mode, function (err, fd) {
      if (err) {
        if (that.autoClose)
          that.destroy()

        that.emit('error', err)
      } else {
        that.fd = fd
        that.emit('open', fd)
        that.read()
      }
    })
  }

  function WriteStream (path, options) {
    if (this instanceof WriteStream)
      return fs$WriteStream.apply(this, arguments), this
    else
      return WriteStream.apply(Object.create(WriteStream.prototype), arguments)
  }

  function WriteStream$open () {
    var that = this
    open(that.path, that.flags, that.mode, function (err, fd) {
      if (err) {
        that.destroy()
        that.emit('error', err)
      } else {
        that.fd = fd
        that.emit('open', fd)
      }
    })
  }

  function createReadStream (path, options) {
    return new fs.ReadStream(path, options)
  }

  function createWriteStream (path, options) {
    return new fs.WriteStream(path, options)
  }

  var fs$open = fs.open
  fs.open = open
  function open (path, flags, mode, cb) {
    if (typeof mode === 'function')
      cb = mode, mode = null

    return go$open(path, flags, mode, cb)

    function go$open (path, flags, mode, cb) {
      return fs$open(path, flags, mode, function (err, fd) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$open, [path, flags, mode, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  return fs
}

function enqueue (elem) {
  debug('ENQUEUE', elem[0].name, elem[1])
  fs[gracefulQueue].push(elem)
}

function retry () {
  var elem = fs[gracefulQueue].shift()
  if (elem) {
    debug('RETRY', elem[0].name, elem[1])
    elem[0].apply(null, elem[1])
  }
}


/***/ }),

/***/ "./node_modules/graceful-fs/legacy-streams.js":
/*!****************************************************!*
  !*** ./node_modules/graceful-fs/legacy-streams.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Stream = __webpack_require__(/*! stream */ "?cc48").Stream

module.exports = legacy

function legacy (fs) {
  return {
    ReadStream: ReadStream,
    WriteStream: WriteStream
  }

  function ReadStream (path, options) {
    if (!(this instanceof ReadStream)) return new ReadStream(path, options);

    Stream.call(this);

    var self = this;

    this.path = path;
    this.fd = null;
    this.readable = true;
    this.paused = false;

    this.flags = 'r';
    this.mode = 438; /*=0666*/
    this.bufferSize = 64 * 1024;

    options = options || {};

    // Mixin options into this
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }

    if (this.encoding) this.setEncoding(this.encoding);

    if (this.start !== undefined) {
      if ('number' !== typeof this.start) {
        throw TypeError('start must be a Number');
      }
      if (this.end === undefined) {
        this.end = Infinity;
      } else if ('number' !== typeof this.end) {
        throw TypeError('end must be a Number');
      }

      if (this.start > this.end) {
        throw new Error('start must be <= end');
      }

      this.pos = this.start;
    }

    if (this.fd !== null) {
      process.nextTick(function() {
        self._read();
      });
      return;
    }

    fs.open(this.path, this.flags, this.mode, function (err, fd) {
      if (err) {
        self.emit('error', err);
        self.readable = false;
        return;
      }

      self.fd = fd;
      self.emit('open', fd);
      self._read();
    })
  }

  function WriteStream (path, options) {
    if (!(this instanceof WriteStream)) return new WriteStream(path, options);

    Stream.call(this);

    this.path = path;
    this.fd = null;
    this.writable = true;

    this.flags = 'w';
    this.encoding = 'binary';
    this.mode = 438; /*=0666*/
    this.bytesWritten = 0;

    options = options || {};

    // Mixin options into this
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }

    if (this.start !== undefined) {
      if ('number' !== typeof this.start) {
        throw TypeError('start must be a Number');
      }
      if (this.start < 0) {
        throw new Error('start must be >= zero');
      }

      this.pos = this.start;
    }

    this.busy = false;
    this._queue = [];

    if (this.fd === null) {
      this._open = fs.open;
      this._queue.push([this._open, this.path, this.flags, this.mode, undefined]);
      this.flush();
    }
  }
}


/***/ }),

/***/ "./node_modules/graceful-fs/polyfills.js":
/*!***********************************************!*
  !*** ./node_modules/graceful-fs/polyfills.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var constants = __webpack_require__(/*! constants */ "?4c81")

var origCwd = process.cwd
var cwd = null

var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform

process.cwd = function() {
  if (!cwd)
    cwd = origCwd.call(process)
  return cwd
}
try {
  process.cwd()
} catch (er) {}

var chdir = process.chdir
process.chdir = function(d) {
  cwd = null
  chdir.call(process, d)
}

module.exports = patch

function patch (fs) {
  // (re-)implement some things that are known busted or missing.

  // lchmod, broken prior to 0.6.2
  // back-port the fix here.
  if (constants.hasOwnProperty('O_SYMLINK') &&
      process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
    patchLchmod(fs)
  }

  // lutimes implementation, or no-op
  if (!fs.lutimes) {
    patchLutimes(fs)
  }

  // https://github.com/isaacs/node-graceful-fs/issues/4
  // Chown should not fail on einval or eperm if non-root.
  // It should not fail on enosys ever, as this just indicates
  // that a fs doesn't support the intended operation.

  fs.chown = chownFix(fs.chown)
  fs.fchown = chownFix(fs.fchown)
  fs.lchown = chownFix(fs.lchown)

  fs.chmod = chmodFix(fs.chmod)
  fs.fchmod = chmodFix(fs.fchmod)
  fs.lchmod = chmodFix(fs.lchmod)

  fs.chownSync = chownFixSync(fs.chownSync)
  fs.fchownSync = chownFixSync(fs.fchownSync)
  fs.lchownSync = chownFixSync(fs.lchownSync)

  fs.chmodSync = chmodFixSync(fs.chmodSync)
  fs.fchmodSync = chmodFixSync(fs.fchmodSync)
  fs.lchmodSync = chmodFixSync(fs.lchmodSync)

  fs.stat = statFix(fs.stat)
  fs.fstat = statFix(fs.fstat)
  fs.lstat = statFix(fs.lstat)

  fs.statSync = statFixSync(fs.statSync)
  fs.fstatSync = statFixSync(fs.fstatSync)
  fs.lstatSync = statFixSync(fs.lstatSync)

  // if lchmod/lchown do not exist, then make them no-ops
  if (!fs.lchmod) {
    fs.lchmod = function (path, mode, cb) {
      if (cb) process.nextTick(cb)
    }
    fs.lchmodSync = function () {}
  }
  if (!fs.lchown) {
    fs.lchown = function (path, uid, gid, cb) {
      if (cb) process.nextTick(cb)
    }
    fs.lchownSync = function () {}
  }

  // on Windows, A/V software can lock the directory, causing this
  // to fail with an EACCES or EPERM if the directory contains newly
  // created files.  Try again on failure, for up to 60 seconds.

  // Set the timeout this long because some Windows Anti-Virus, such as Parity
  // bit9, may lock files for up to a minute, causing npm package install
  // failures. Also, take care to yield the scheduler. Windows scheduling gives
  // CPU to a busy looping process, which can cause the program causing the lock
  // contention to be starved of CPU by node, so the contention doesn't resolve.
  if (platform === "win32") {
    fs.rename = (function (fs$rename) { return function (from, to, cb) {
      var start = Date.now()
      var backoff = 0;
      fs$rename(from, to, function CB (er) {
        if (er
            && (er.code === "EACCES" || er.code === "EPERM")
            && Date.now() - start < 60000) {
          setTimeout(function() {
            fs.stat(to, function (stater, st) {
              if (stater && stater.code === "ENOENT")
                fs$rename(from, to, CB);
              else
                cb(er)
            })
          }, backoff)
          if (backoff < 100)
            backoff += 10;
          return;
        }
        if (cb) cb(er)
      })
    }})(fs.rename)
  }

  // if read() returns EAGAIN, then just try it again.
  fs.read = (function (fs$read) {
    function read (fd, buffer, offset, length, position, callback_) {
      var callback
      if (callback_ && typeof callback_ === 'function') {
        var eagCounter = 0
        callback = function (er, _, __) {
          if (er && er.code === 'EAGAIN' && eagCounter < 10) {
            eagCounter ++
            return fs$read.call(fs, fd, buffer, offset, length, position, callback)
          }
          callback_.apply(this, arguments)
        }
      }
      return fs$read.call(fs, fd, buffer, offset, length, position, callback)
    }

    // This ensures `util.promisify` works as it does for native `fs.read`.
    read.__proto__ = fs$read
    return read
  })(fs.read)

  fs.readSync = (function (fs$readSync) { return function (fd, buffer, offset, length, position) {
    var eagCounter = 0
    while (true) {
      try {
        return fs$readSync.call(fs, fd, buffer, offset, length, position)
      } catch (er) {
        if (er.code === 'EAGAIN' && eagCounter < 10) {
          eagCounter ++
          continue
        }
        throw er
      }
    }
  }})(fs.readSync)

  function patchLchmod (fs) {
    fs.lchmod = function (path, mode, callback) {
      fs.open( path
             , constants.O_WRONLY | constants.O_SYMLINK
             , mode
             , function (err, fd) {
        if (err) {
          if (callback) callback(err)
          return
        }
        // prefer to return the chmod error, if one occurs,
        // but still try to close, and report closing errors if they occur.
        fs.fchmod(fd, mode, function (err) {
          fs.close(fd, function(err2) {
            if (callback) callback(err || err2)
          })
        })
      })
    }

    fs.lchmodSync = function (path, mode) {
      var fd = fs.openSync(path, constants.O_WRONLY | constants.O_SYMLINK, mode)

      // prefer to return the chmod error, if one occurs,
      // but still try to close, and report closing errors if they occur.
      var threw = true
      var ret
      try {
        ret = fs.fchmodSync(fd, mode)
        threw = false
      } finally {
        if (threw) {
          try {
            fs.closeSync(fd)
          } catch (er) {}
        } else {
          fs.closeSync(fd)
        }
      }
      return ret
    }
  }

  function patchLutimes (fs) {
    if (constants.hasOwnProperty("O_SYMLINK")) {
      fs.lutimes = function (path, at, mt, cb) {
        fs.open(path, constants.O_SYMLINK, function (er, fd) {
          if (er) {
            if (cb) cb(er)
            return
          }
          fs.futimes(fd, at, mt, function (er) {
            fs.close(fd, function (er2) {
              if (cb) cb(er || er2)
            })
          })
        })
      }

      fs.lutimesSync = function (path, at, mt) {
        var fd = fs.openSync(path, constants.O_SYMLINK)
        var ret
        var threw = true
        try {
          ret = fs.futimesSync(fd, at, mt)
          threw = false
        } finally {
          if (threw) {
            try {
              fs.closeSync(fd)
            } catch (er) {}
          } else {
            fs.closeSync(fd)
          }
        }
        return ret
      }

    } else {
      fs.lutimes = function (_a, _b, _c, cb) { if (cb) process.nextTick(cb) }
      fs.lutimesSync = function () {}
    }
  }

  function chmodFix (orig) {
    if (!orig) return orig
    return function (target, mode, cb) {
      return orig.call(fs, target, mode, function (er) {
        if (chownErOk(er)) er = null
        if (cb) cb.apply(this, arguments)
      })
    }
  }

  function chmodFixSync (orig) {
    if (!orig) return orig
    return function (target, mode) {
      try {
        return orig.call(fs, target, mode)
      } catch (er) {
        if (!chownErOk(er)) throw er
      }
    }
  }


  function chownFix (orig) {
    if (!orig) return orig
    return function (target, uid, gid, cb) {
      return orig.call(fs, target, uid, gid, function (er) {
        if (chownErOk(er)) er = null
        if (cb) cb.apply(this, arguments)
      })
    }
  }

  function chownFixSync (orig) {
    if (!orig) return orig
    return function (target, uid, gid) {
      try {
        return orig.call(fs, target, uid, gid)
      } catch (er) {
        if (!chownErOk(er)) throw er
      }
    }
  }

  function statFix (orig) {
    if (!orig) return orig
    // Older versions of Node erroneously returned signed integers for
    // uid + gid.
    return function (target, options, cb) {
      if (typeof options === 'function') {
        cb = options
        options = null
      }
      function callback (er, stats) {
        if (stats) {
          if (stats.uid < 0) stats.uid += 0x100000000
          if (stats.gid < 0) stats.gid += 0x100000000
        }
        if (cb) cb.apply(this, arguments)
      }
      return options ? orig.call(fs, target, options, callback)
        : orig.call(fs, target, callback)
    }
  }

  function statFixSync (orig) {
    if (!orig) return orig
    // Older versions of Node erroneously returned signed integers for
    // uid + gid.
    return function (target, options) {
      var stats = options ? orig.call(fs, target, options)
        : orig.call(fs, target)
      if (stats.uid < 0) stats.uid += 0x100000000
      if (stats.gid < 0) stats.gid += 0x100000000
      return stats;
    }
  }

  // ENOSYS means that the fs doesn't support the op. Just ignore
  // that, because it doesn't matter.
  //
  // if there's no getuid, or if getuid() is something other
  // than 0, and the error is EINVAL or EPERM, then just ignore
  // it.
  //
  // This specific case is a silent failure in cp, install, tar,
  // and most other unix tools that manage permissions.
  //
  // When running as root, or if other types of errors are
  // encountered, then it's strict.
  function chownErOk (er) {
    if (!er)
      return true

    if (er.code === "ENOSYS")
      return true

    var nonroot = !process.getuid || process.getuid() !== 0
    if (nonroot) {
      if (er.code === "EINVAL" || er.code === "EPERM")
        return true
    }

    return false
  }
}


/***/ }),

/***/ "./node_modules/imurmurhash/imurmurhash.js":
/*!*************************************************!*
  !*** ./node_modules/imurmurhash/imurmurhash.js ***!
  \*************************************************/
/***/ ((module) => {

/**
 * @preserve
 * JS Implementation of incremental MurmurHash3 (r150) (as of May 10, 2013)
 *
 * @author <a href="mailto:jensyt@gmail.com">Jens Taylor</a>
 * @see http://github.com/homebrewing/brauhaus-diff
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @see http://github.com/garycourt/murmurhash-js
 * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
 * @see http://sites.google.com/site/murmurhash/
 */
(function(){
    var cache;

    // Call this function without `new` to use the cached object (good for
    // single-threaded environments), or with `new` to create a new object.
    //
    // @param {string} key A UTF-16 or ASCII string
    // @param {number} seed An optional positive integer
    // @return {object} A MurmurHash3 object for incremental hashing
    function MurmurHash3(key, seed) {
        var m = this instanceof MurmurHash3 ? this : cache;
        m.reset(seed)
        if (typeof key === 'string' && key.length > 0) {
            m.hash(key);
        }

        if (m !== this) {
            return m;
        }
    };

    // Incrementally add a string to this hash
    //
    // @param {string} key A UTF-16 or ASCII string
    // @return {object} this
    MurmurHash3.prototype.hash = function(key) {
        var h1, k1, i, top, len;

        len = key.length;
        this.len += len;

        k1 = this.k1;
        i = 0;
        switch (this.rem) {
            case 0: k1 ^= len > i ? (key.charCodeAt(i++) & 0xffff) : 0;
            case 1: k1 ^= len > i ? (key.charCodeAt(i++) & 0xffff) << 8 : 0;
            case 2: k1 ^= len > i ? (key.charCodeAt(i++) & 0xffff) << 16 : 0;
            case 3:
                k1 ^= len > i ? (key.charCodeAt(i) & 0xff) << 24 : 0;
                k1 ^= len > i ? (key.charCodeAt(i++) & 0xff00) >> 8 : 0;
        }

        this.rem = (len + this.rem) & 3; // & 3 is same as % 4
        len -= this.rem;
        if (len > 0) {
            h1 = this.h1;
            while (1) {
                k1 = (k1 * 0x2d51 + (k1 & 0xffff) * 0xcc9e0000) & 0xffffffff;
                k1 = (k1 << 15) | (k1 >>> 17);
                k1 = (k1 * 0x3593 + (k1 & 0xffff) * 0x1b870000) & 0xffffffff;

                h1 ^= k1;
                h1 = (h1 << 13) | (h1 >>> 19);
                h1 = (h1 * 5 + 0xe6546b64) & 0xffffffff;

                if (i >= len) {
                    break;
                }

                k1 = ((key.charCodeAt(i++) & 0xffff)) ^
                     ((key.charCodeAt(i++) & 0xffff) << 8) ^
                     ((key.charCodeAt(i++) & 0xffff) << 16);
                top = key.charCodeAt(i++);
                k1 ^= ((top & 0xff) << 24) ^
                      ((top & 0xff00) >> 8);
            }

            k1 = 0;
            switch (this.rem) {
                case 3: k1 ^= (key.charCodeAt(i + 2) & 0xffff) << 16;
                case 2: k1 ^= (key.charCodeAt(i + 1) & 0xffff) << 8;
                case 1: k1 ^= (key.charCodeAt(i) & 0xffff);
            }

            this.h1 = h1;
        }

        this.k1 = k1;
        return this;
    };

    // Get the result of this hash
    //
    // @return {number} The 32-bit hash
    MurmurHash3.prototype.result = function() {
        var k1, h1;
        
        k1 = this.k1;
        h1 = this.h1;

        if (k1 > 0) {
            k1 = (k1 * 0x2d51 + (k1 & 0xffff) * 0xcc9e0000) & 0xffffffff;
            k1 = (k1 << 15) | (k1 >>> 17);
            k1 = (k1 * 0x3593 + (k1 & 0xffff) * 0x1b870000) & 0xffffffff;
            h1 ^= k1;
        }

        h1 ^= this.len;

        h1 ^= h1 >>> 16;
        h1 = (h1 * 0xca6b + (h1 & 0xffff) * 0x85eb0000) & 0xffffffff;
        h1 ^= h1 >>> 13;
        h1 = (h1 * 0xae35 + (h1 & 0xffff) * 0xc2b20000) & 0xffffffff;
        h1 ^= h1 >>> 16;

        return h1 >>> 0;
    };

    // Reset the hash object for reuse
    //
    // @param {number} seed An optional positive integer
    MurmurHash3.prototype.reset = function(seed) {
        this.h1 = typeof seed === 'number' ? seed : 0;
        this.rem = this.k1 = this.len = 0;
        return this;
    };

    // A cached object to use. This can be safely used if you're in a single-
    // threaded environment, otherwise you need to create new hashes to use.
    cache = new MurmurHash3();

    if (true) {
        module.exports = MurmurHash3;
    } else {}
}());


/***/ }),

/***/ "./node_modules/is-buffer/index.js":
/*!*****************************************!*
  !*** ./node_modules/is-buffer/index.js ***!
  \*****************************************/
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

/***/ "./node_modules/md5/md5.js":
/*!*********************************!*
  !*** ./node_modules/md5/md5.js ***!
  \*********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

(function(){
  var crypt = __webpack_require__(/*! crypt */ "./node_modules/crypt/crypt.js"),
      utf8 = __webpack_require__(/*! charenc */ "./node_modules/charenc/charenc.js").utf8,
      isBuffer = __webpack_require__(/*! is-buffer */ "./node_modules/is-buffer/index.js"),
      bin = __webpack_require__(/*! charenc */ "./node_modules/charenc/charenc.js").bin,

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

/***/ "./node_modules/ms/index.js":
/*!**********************************!*
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


/***/ }),

/***/ "./node_modules/node-localstorage/LocalStorage.js":
/*!********************************************************!*
  !*** ./node_modules/node-localstorage/LocalStorage.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var JSONStorage, KEY_FOR_EMPTY_STRING, LocalStorage, MetaKey, QUOTA_EXCEEDED_ERR, StorageEvent, _emptyDirectory, _escapeKey, _rm, createMap, events, fs, path, writeSync,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  path = __webpack_require__(/*! path */ "?0f27");

  fs = __webpack_require__(/*! fs */ "?65c5");

  events = __webpack_require__(/*! events */ "./node_modules/events/events.js");

  writeSync = __webpack_require__(/*! write-file-atomic */ "./node_modules/write-file-atomic/index.js").sync;

  KEY_FOR_EMPTY_STRING = '---.EMPTY_STRING.---';

  _emptyDirectory = function(target) {
    var i, len, p, ref, results;
    ref = fs.readdirSync(target);
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      p = ref[i];
      results.push(_rm(path.join(target, p)));
    }
    return results;
  };

  _rm = function(target) {
    if (fs.statSync(target).isDirectory()) {
      _emptyDirectory(target);
      return fs.rmdirSync(target);
    } else {
      return fs.unlinkSync(target);
    }
  };

  _escapeKey = function(key) {
    var newKey;
    if (key === '') {
      newKey = KEY_FOR_EMPTY_STRING;
    } else {
      newKey = key.toString();
    }
    return newKey;
  };

  QUOTA_EXCEEDED_ERR = (function(superClass) {
    extend(QUOTA_EXCEEDED_ERR, superClass);

    function QUOTA_EXCEEDED_ERR(message) {
      this.message = message != null ? message : 'Unknown error.';
      QUOTA_EXCEEDED_ERR.__super__.constructor.call(this);
      if (Error.captureStackTrace != null) {
        Error.captureStackTrace(this, this.constructor);
      }
      this.name = this.constructor.name;
    }

    QUOTA_EXCEEDED_ERR.prototype.toString = function() {
      return this.name + ": " + this.message;
    };

    return QUOTA_EXCEEDED_ERR;

  })(Error);

  StorageEvent = (function() {
    function StorageEvent(key1, oldValue1, newValue1, url, storageArea) {
      this.key = key1;
      this.oldValue = oldValue1;
      this.newValue = newValue1;
      this.url = url;
      this.storageArea = storageArea != null ? storageArea : 'localStorage';
    }

    return StorageEvent;

  })();

  MetaKey = (function() {
    function MetaKey(key1, index1) {
      this.key = key1;
      this.index = index1;
      if (!(this instanceof MetaKey)) {
        return new MetaKey(this.key, this.index);
      }
    }

    return MetaKey;

  })();

  createMap = function() {
    var Map;
    Map = function() {};
    Map.prototype = Object.create(null);
    return new Map();
  };

  LocalStorage = (function(superClass) {
    var instanceMap;

    extend(LocalStorage, superClass);

    instanceMap = {};

    function LocalStorage(_location, quota) {
      var handler;
      this._location = _location;
      this.quota = quota != null ? quota : 5 * 1024 * 1024;
      LocalStorage.__super__.constructor.call(this);
      if (!(this instanceof LocalStorage)) {
        return new LocalStorage(this._location, this.quota);
      }
      this._location = path.resolve(this._location);
      if (instanceMap[this._location] != null) {
        return instanceMap[this._location];
      }
      this.length = 0;
      this._bytesInUse = 0;
      this._keys = [];
      this._metaKeyMap = createMap();
      this._eventUrl = "pid:" + process.pid;
      this._init();
      this._QUOTA_EXCEEDED_ERR = QUOTA_EXCEEDED_ERR;
      if (typeof Proxy !== "undefined" && Proxy !== null) {
        handler = {
          set: (function(_this) {
            return function(receiver, key, value) {
              if (_this[key] != null) {
                return _this[key] = value;
              } else {
                return _this.setItem(key, value);
              }
            };
          })(this),
          get: (function(_this) {
            return function(receiver, key) {
              if (_this[key] != null) {
                return _this[key];
              } else {
                return _this.getItem(key);
              }
            };
          })(this)
        };
        instanceMap[this._location] = new Proxy(this, handler);
        return instanceMap[this._location];
      }
      instanceMap[this._location] = this;
      return instanceMap[this._location];
    }

    LocalStorage.prototype._init = function() {
      var _MetaKey, _decodedKey, _keys, e, i, index, k, len, stat;
      try {
        stat = fs.statSync(this._location);
        if ((stat != null) && !stat.isDirectory()) {
          throw new Error("A file exists at the location '" + this._location + "' when trying to create/open localStorage");
        }
        this._bytesInUse = 0;
        this.length = 0;
        _keys = fs.readdirSync(this._location);
        for (index = i = 0, len = _keys.length; i < len; index = ++i) {
          k = _keys[index];
          _decodedKey = decodeURIComponent(k);
          this._keys.push(_decodedKey);
          _MetaKey = new MetaKey(k, index);
          this._metaKeyMap[_decodedKey] = _MetaKey;
          stat = this._getStat(k);
          if ((stat != null ? stat.size : void 0) != null) {
            _MetaKey.size = stat.size;
            this._bytesInUse += stat.size;
          }
        }
        this.length = _keys.length;
      } catch (error) {
        e = error;
        if (e.code !== "ENOENT") {
          throw e;
        }
        try {
          fs.mkdirSync(this._location, {
            recursive: true
          });
        } catch (error) {
          e = error;
          if (e.code !== "EEXIST") {
            throw e;
          }
        }
      }
    };

    LocalStorage.prototype.setItem = function(key, value) {
      var encodedKey, evnt, existsBeforeSet, filename, hasListeners, metaKey, oldLength, oldValue, valueString, valueStringLength;
      hasListeners = events.EventEmitter.listenerCount(this, 'storage');
      oldValue = null;
      if (hasListeners) {
        oldValue = this.getItem(key);
      }
      key = _escapeKey(key);
      encodedKey = encodeURIComponent(key);
      filename = path.join(this._location, encodedKey);
      valueString = value.toString();
      valueStringLength = valueString.length;
      metaKey = this._metaKeyMap[key];
      existsBeforeSet = !!metaKey;
      if (existsBeforeSet) {
        oldLength = metaKey.size;
      } else {
        oldLength = 0;
      }
      if (this._bytesInUse - oldLength + valueStringLength > this.quota) {
        throw new QUOTA_EXCEEDED_ERR();
      }
      writeSync(filename, valueString, 'utf8');
      if (!existsBeforeSet) {
        metaKey = new MetaKey(encodedKey, (this._keys.push(key)) - 1);
        metaKey.size = valueStringLength;
        this._metaKeyMap[key] = metaKey;
        this.length += 1;
        this._bytesInUse += valueStringLength;
      }
      if (hasListeners) {
        evnt = new StorageEvent(key, oldValue, value, this._eventUrl);
        return this.emit('storage', evnt);
      }
    };

    LocalStorage.prototype.getItem = function(key) {
      var filename, metaKey;
      key = _escapeKey(key);
      metaKey = this._metaKeyMap[key];
      if (!!metaKey) {
        filename = path.join(this._location, metaKey.key);
        return fs.readFileSync(filename, 'utf8');
      } else {
        return null;
      }
    };

    LocalStorage.prototype._getStat = function(key) {
      var filename;
      key = _escapeKey(key);
      filename = path.join(this._location, encodeURIComponent(key));
      try {
        return fs.statSync(filename);
      } catch (error) {
        return null;
      }
    };

    LocalStorage.prototype.removeItem = function(key) {
      var evnt, filename, hasListeners, k, meta, metaKey, oldValue, ref, v;
      key = _escapeKey(key);
      metaKey = this._metaKeyMap[key];
      if (!!metaKey) {
        hasListeners = events.EventEmitter.listenerCount(this, 'storage');
        oldValue = null;
        if (hasListeners) {
          oldValue = this.getItem(key);
        }
        delete this._metaKeyMap[key];
        this.length -= 1;
        this._bytesInUse -= metaKey.size;
        filename = path.join(this._location, metaKey.key);
        this._keys.splice(metaKey.index, 1);
        ref = this._metaKeyMap;
        for (k in ref) {
          v = ref[k];
          meta = this._metaKeyMap[k];
          if (meta.index > metaKey.index) {
            meta.index -= 1;
          }
        }
        _rm(filename);
        if (hasListeners) {
          evnt = new StorageEvent(key, oldValue, null, this._eventUrl);
          return this.emit('storage', evnt);
        }
      }
    };

    LocalStorage.prototype.key = function(n) {
      var rawKey;
      rawKey = this._keys[n];
      if (rawKey === KEY_FOR_EMPTY_STRING) {
        return '';
      } else {
        return rawKey;
      }
    };

    LocalStorage.prototype.clear = function() {
      var evnt;
      _emptyDirectory(this._location);
      this._metaKeyMap = createMap();
      this._keys = [];
      this.length = 0;
      this._bytesInUse = 0;
      if (events.EventEmitter.listenerCount(this, 'storage')) {
        evnt = new StorageEvent(null, null, null, this._eventUrl);
        return this.emit('storage', evnt);
      }
    };

    LocalStorage.prototype._getBytesInUse = function() {
      return this._bytesInUse;
    };

    LocalStorage.prototype._deleteLocation = function() {
      delete instanceMap[this._location];
      _rm(this._location);
      this._metaKeyMap = {};
      this._keys = [];
      this.length = 0;
      return this._bytesInUse = 0;
    };

    return LocalStorage;

  })(events.EventEmitter);

  JSONStorage = (function(superClass) {
    extend(JSONStorage, superClass);

    function JSONStorage() {
      return JSONStorage.__super__.constructor.apply(this, arguments);
    }

    JSONStorage.prototype.setItem = function(key, value) {
      var newValue;
      newValue = JSON.stringify(value);
      return JSONStorage.__super__.setItem.call(this, key, newValue);
    };

    JSONStorage.prototype.getItem = function(key) {
      return JSON.parse(JSONStorage.__super__.getItem.call(this, key));
    };

    return JSONStorage;

  })(LocalStorage);

  exports.LocalStorage = LocalStorage;

  exports.JSONStorage = JSONStorage;

  exports.QUOTA_EXCEEDED_ERR = QUOTA_EXCEEDED_ERR;

}).call(this);


/***/ }),

/***/ "./node_modules/shortid/index.js":
/*!***************************************!*
  !*** ./node_modules/shortid/index.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = __webpack_require__(/*! ./lib/index */ "./node_modules/shortid/lib/index.js");


/***/ }),

/***/ "./node_modules/shortid/lib/alphabet.js":
/*!**********************************************!*
  !*** ./node_modules/shortid/lib/alphabet.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var randomFromSeed = __webpack_require__(/*! ./random/random-from-seed */ "./node_modules/shortid/lib/random/random-from-seed.js");

var ORIGINAL = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
var alphabet;
var previousSeed;

var shuffled;

function reset() {
    shuffled = false;
}

function setCharacters(_alphabet_) {
    if (!_alphabet_) {
        if (alphabet !== ORIGINAL) {
            alphabet = ORIGINAL;
            reset();
        }
        return;
    }

    if (_alphabet_ === alphabet) {
        return;
    }

    if (_alphabet_.length !== ORIGINAL.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. You submitted ' + _alphabet_.length + ' characters: ' + _alphabet_);
    }

    var unique = _alphabet_.split('').filter(function(item, ind, arr){
       return ind !== arr.lastIndexOf(item);
    });

    if (unique.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. These characters were not unique: ' + unique.join(', '));
    }

    alphabet = _alphabet_;
    reset();
}

function characters(_alphabet_) {
    setCharacters(_alphabet_);
    return alphabet;
}

function setSeed(seed) {
    randomFromSeed.seed(seed);
    if (previousSeed !== seed) {
        reset();
        previousSeed = seed;
    }
}

function shuffle() {
    if (!alphabet) {
        setCharacters(ORIGINAL);
    }

    var sourceArray = alphabet.split('');
    var targetArray = [];
    var r = randomFromSeed.nextValue();
    var characterIndex;

    while (sourceArray.length > 0) {
        r = randomFromSeed.nextValue();
        characterIndex = Math.floor(r * sourceArray.length);
        targetArray.push(sourceArray.splice(characterIndex, 1)[0]);
    }
    return targetArray.join('');
}

function getShuffled() {
    if (shuffled) {
        return shuffled;
    }
    shuffled = shuffle();
    return shuffled;
}

/**
 * lookup shuffled letter
 * @param index
 * @returns {string}
 */
function lookup(index) {
    var alphabetShuffled = getShuffled();
    return alphabetShuffled[index];
}

function get () {
  return alphabet || ORIGINAL;
}

module.exports = {
    get: get,
    characters: characters,
    seed: setSeed,
    lookup: lookup,
    shuffled: getShuffled
};


/***/ }),

/***/ "./node_modules/shortid/lib/build.js":
/*!*******************************************!*
  !*** ./node_modules/shortid/lib/build.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var generate = __webpack_require__(/*! ./generate */ "./node_modules/shortid/lib/generate.js");
var alphabet = __webpack_require__(/*! ./alphabet */ "./node_modules/shortid/lib/alphabet.js");

// Ignore all milliseconds before a certain time to reduce the size of the date entropy without sacrificing uniqueness.
// This number should be updated every year or so to keep the generated id short.
// To regenerate `new Date() - 0` and bump the version. Always bump the version!
var REDUCE_TIME = 1567752802062;

// don't change unless we change the algos or REDUCE_TIME
// must be an integer and less than 16
var version = 7;

// Counter is used when shortid is called multiple times in one second.
var counter;

// Remember the last time shortid was called in case counter is needed.
var previousSeconds;

/**
 * Generate unique id
 * Returns string id
 */
function build(clusterWorkerId) {
    var str = '';

    var seconds = Math.floor((Date.now() - REDUCE_TIME) * 0.001);

    if (seconds === previousSeconds) {
        counter++;
    } else {
        counter = 0;
        previousSeconds = seconds;
    }

    str = str + generate(version);
    str = str + generate(clusterWorkerId);
    if (counter > 0) {
        str = str + generate(counter);
    }
    str = str + generate(seconds);
    return str;
}

module.exports = build;


/***/ }),

/***/ "./node_modules/shortid/lib/generate.js":
/*!**********************************************!*
  !*** ./node_modules/shortid/lib/generate.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var alphabet = __webpack_require__(/*! ./alphabet */ "./node_modules/shortid/lib/alphabet.js");
var random = __webpack_require__(/*! ./random/random-byte */ "./node_modules/shortid/lib/random/random-byte-browser.js");
var format = __webpack_require__(/*! nanoid/format */ "./node_modules/shortid/node_modules/nanoid/format.browser.js");

function generate(number) {
    var loopCounter = 0;
    var done;

    var str = '';

    while (!done) {
        str = str + format(random, alphabet.get(), 1);
        done = number < (Math.pow(16, loopCounter + 1 ) );
        loopCounter++;
    }
    return str;
}

module.exports = generate;


/***/ }),

/***/ "./node_modules/shortid/lib/index.js":
/*!*******************************************!*
  !*** ./node_modules/shortid/lib/index.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var alphabet = __webpack_require__(/*! ./alphabet */ "./node_modules/shortid/lib/alphabet.js");
var build = __webpack_require__(/*! ./build */ "./node_modules/shortid/lib/build.js");
var isValid = __webpack_require__(/*! ./is-valid */ "./node_modules/shortid/lib/is-valid.js");

// if you are using cluster or multiple servers use this to make each instance
// has a unique value for worker
// Note: I don't know if this is automatically set when using third
// party cluster solutions such as pm2.
var clusterWorkerId = __webpack_require__(/*! ./util/cluster-worker-id */ "./node_modules/shortid/lib/util/cluster-worker-id-browser.js") || 0;

/**
 * Set the seed.
 * Highly recommended if you don't want people to try to figure out your id schema.
 * exposed as shortid.seed(int)
 * @param seed Integer value to seed the random alphabet.  ALWAYS USE THE SAME SEED or you might get overlaps.
 */
function seed(seedValue) {
    alphabet.seed(seedValue);
    return module.exports;
}

/**
 * Set the cluster worker or machine id
 * exposed as shortid.worker(int)
 * @param workerId worker must be positive integer.  Number less than 16 is recommended.
 * returns shortid module so it can be chained.
 */
function worker(workerId) {
    clusterWorkerId = workerId;
    return module.exports;
}

/**
 *
 * sets new characters to use in the alphabet
 * returns the shuffled alphabet
 */
function characters(newCharacters) {
    if (newCharacters !== undefined) {
        alphabet.characters(newCharacters);
    }

    return alphabet.shuffled();
}

/**
 * Generate unique id
 * Returns string id
 */
function generate() {
  return build(clusterWorkerId);
}

// Export all other functions as properties of the generate function
module.exports = generate;
module.exports.generate = generate;
module.exports.seed = seed;
module.exports.worker = worker;
module.exports.characters = characters;
module.exports.isValid = isValid;


/***/ }),

/***/ "./node_modules/shortid/lib/is-valid.js":
/*!**********************************************!*
  !*** ./node_modules/shortid/lib/is-valid.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var alphabet = __webpack_require__(/*! ./alphabet */ "./node_modules/shortid/lib/alphabet.js");

function isShortId(id) {
    if (!id || typeof id !== 'string' || id.length < 6 ) {
        return false;
    }

    var nonAlphabetic = new RegExp('[^' +
      alphabet.get().replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&') +
    ']');
    return !nonAlphabetic.test(id);
}

module.exports = isShortId;


/***/ }),

/***/ "./node_modules/shortid/lib/random/random-byte-browser.js":
/*!****************************************************************!*
  !*** ./node_modules/shortid/lib/random/random-byte-browser.js ***!
  \****************************************************************/
/***/ ((module) => {

"use strict";


var crypto = typeof window === 'object' && (window.crypto || window.msCrypto); // IE 11 uses window.msCrypto

var randomByte;

if (!crypto || !crypto.getRandomValues) {
    randomByte = function(size) {
        var bytes = [];
        for (var i = 0; i < size; i++) {
            bytes.push(Math.floor(Math.random() * 256));
        }
        return bytes;
    };
} else {
    randomByte = function(size) {
        return crypto.getRandomValues(new Uint8Array(size));
    };
}

module.exports = randomByte;


/***/ }),

/***/ "./node_modules/shortid/lib/random/random-from-seed.js":
/*!*************************************************************!*
  !*** ./node_modules/shortid/lib/random/random-from-seed.js ***!
  \*************************************************************/
/***/ ((module) => {

"use strict";


// Found this seed-based random generator somewhere
// Based on The Central Randomizer 1.3 (C) 1997 by Paul Houle (houle@msc.cornell.edu)

var seed = 1;

/**
 * return a random number based on a seed
 * @param seed
 * @returns {number}
 */
function getNextValue() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed/(233280.0);
}

function setSeed(_seed_) {
    seed = _seed_;
}

module.exports = {
    nextValue: getNextValue,
    seed: setSeed
};


/***/ }),

/***/ "./node_modules/shortid/lib/util/cluster-worker-id-browser.js":
/*!********************************************************************!*
  !*** ./node_modules/shortid/lib/util/cluster-worker-id-browser.js ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";


module.exports = 0;


/***/ }),

/***/ "./node_modules/shortid/node_modules/nanoid/format.browser.js":
/*!********************************************************************!*
  !*** ./node_modules/shortid/node_modules/nanoid/format.browser.js ***!
  \********************************************************************/
/***/ ((module) => {

// This file replaces `format.js` in bundlers like webpack or Rollup,
// according to `browser` config in `package.json`.

module.exports = function (random, alphabet, size) {
  // We can’t use bytes bigger than the alphabet. To make bytes values closer
  // to the alphabet, we apply bitmask on them. We look for the closest
  // `2 ** x - 1` number, which will be bigger than alphabet size. If we have
  // 30 symbols in the alphabet, we will take 31 (00011111).
  // We do not use faster Math.clz32, because it is not available in browsers.
  var mask = (2 << Math.log(alphabet.length - 1) / Math.LN2) - 1
  // Bitmask is not a perfect solution (in our example it will pass 31 bytes,
  // which is bigger than the alphabet). As a result, we will need more bytes,
  // than ID size, because we will refuse bytes bigger than the alphabet.

  // Every hardware random generator call is costly,
  // because we need to wait for entropy collection. This is why often it will
  // be faster to ask for few extra bytes in advance, to avoid additional calls.

  // Here we calculate how many random bytes should we call in advance.
  // It depends on ID length, mask / alphabet size and magic number 1.6
  // (which was selected according benchmarks).

  // -~f => Math.ceil(f) if n is float number
  // -~i => i + 1 if n is integer number
  var step = -~(1.6 * mask * size / alphabet.length)
  var id = ''

  while (true) {
    var bytes = random(step)
    // Compact alternative for `for (var i = 0; i < step; i++)`
    var i = step
    while (i--) {
      // If random byte is bigger than alphabet even after bitmask,
      // we refuse it by `|| ''`.
      id += alphabet[bytes[i] & mask] || ''
      // More compact than `id.length + 1 === size`
      if (id.length === +size) return id
    }
  }
}


/***/ }),

/***/ "./node_modules/sift/es5m/index.js":
/*!*****************************************!*
  !*** ./node_modules/sift/es5m/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__,
/* harmony export */   "$Size": () => /* binding */ $Size,
/* harmony export */   "$all": () => /* binding */ $all,
/* harmony export */   "$and": () => /* binding */ $and,
/* harmony export */   "$elemMatch": () => /* binding */ $elemMatch,
/* harmony export */   "$eq": () => /* binding */ $eq,
/* harmony export */   "$exists": () => /* binding */ $exists,
/* harmony export */   "$gt": () => /* binding */ $gt,
/* harmony export */   "$gte": () => /* binding */ $gte,
/* harmony export */   "$in": () => /* binding */ $in,
/* harmony export */   "$lt": () => /* binding */ $lt,
/* harmony export */   "$lte": () => /* binding */ $lte,
/* harmony export */   "$mod": () => /* binding */ $mod,
/* harmony export */   "$ne": () => /* binding */ $ne,
/* harmony export */   "$nin": () => /* binding */ $nin,
/* harmony export */   "$nor": () => /* binding */ $nor,
/* harmony export */   "$not": () => /* binding */ $not,
/* harmony export */   "$options": () => /* binding */ $options,
/* harmony export */   "$or": () => /* binding */ $or,
/* harmony export */   "$regex": () => /* binding */ $regex,
/* harmony export */   "$size": () => /* binding */ $size,
/* harmony export */   "$type": () => /* binding */ $type,
/* harmony export */   "$where": () => /* binding */ $where,
/* harmony export */   "EqualsOperation": () => /* binding */ EqualsOperation,
/* harmony export */   "createDefaultQueryOperation": () => /* binding */ createDefaultQueryOperation,
/* harmony export */   "createEqualsOperation": () => /* binding */ createEqualsOperation,
/* harmony export */   "createOperationTester": () => /* binding */ createOperationTester,
/* harmony export */   "createQueryOperation": () => /* binding */ createQueryOperation,
/* harmony export */   "createQueryTester": () => /* binding */ createQueryTester
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
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
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
        this.success = false;
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
        this.success = false;
        this.done = false;
        for (var i = 0, length_2 = this.children.length; i < length_2; i++) {
            this.children[i].reset();
        }
    };
    /**
     */
    GroupOperation.prototype.childrenNext = function (item, key, owner) {
        var done = true;
        var success = true;
        for (var i = 0, length_3 = this.children.length; i < length_3; i++) {
            var childOperation = this.children[i];
            childOperation.next(item, key, owner);
            if (!childOperation.success) {
                success = false;
            }
            if (childOperation.done) {
                if (!childOperation.success) {
                    break;
                }
            }
            else {
                done = false;
            }
        }
        // console.log("DONE", this.params, done, success);
        this.done = done;
        this.success = success;
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
        return _super !== null && _super.apply(this, arguments) || this;
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
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EqualsOperation.prototype.init = function () {
        this._test = createTester(this.params, this.options.compare);
    };
    EqualsOperation.prototype.next = function (item, key, parent) {
        if (!Array.isArray(parent) || parent.hasOwnProperty(key)) {
            if (this._test(item, key, parent)) {
                this.done = true;
                this.success = true;
            }
        }
    };
    return EqualsOperation;
}(BaseOperation));
var createEqualsOperation = function (params, owneryQuery, options) { return new EqualsOperation(params, owneryQuery, options); };
var NopeOperation = /** @class */ (function (_super) {
    __extends(NopeOperation, _super);
    function NopeOperation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NopeOperation.prototype.next = function () {
        this.done = true;
        this.success = false;
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
var containsOperation = function (query) {
    for (var key in query) {
        if (key.charAt(0) === "$")
            return true;
    }
    return false;
};
var createNestedOperation = function (keyPath, nestedQuery, owneryQuery, options) {
    if (containsOperation(nestedQuery)) {
        var _a = createQueryOperations(nestedQuery, options), selfOperations = _a[0], nestedOperations = _a[1];
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
    var _c = createQueryOperations(query, options), selfOperations = _c[0], nestedOperations = _c[1];
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
var createQueryOperations = function (query, options) {
    var selfOperations = [];
    var nestedOperations = [];
    if (!isVanillaObject(query)) {
        selfOperations.push(new EqualsOperation(query, query, options));
        return [selfOperations, nestedOperations];
    }
    for (var key in query) {
        if (key.charAt(0) === "$") {
            var op = createNamedOperation(key, query[key], query, options);
            // probably just a flag for another operation (like $options)
            if (op != null) {
                selfOperations.push(op);
            }
        }
        else {
            nestedOperations.push(createNestedOperation(key.split("."), query[key], query, options));
        }
    }
    return [selfOperations, nestedOperations];
};
var createOperationTester = function (operation) { return function (item, key, owner) {
    operation.reset();
    operation.next(item, key, owner);
    return operation.success;
}; };
var createQueryTester = function (query, options) {
    if (options === void 0) { options = {}; }
    return createOperationTester(createQueryOperation(query, null, options));
};

var $Ne = /** @class */ (function (_super) {
    __extends($Ne, _super);
    function $Ne() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    $Ne.prototype.init = function () {
        this._test = createTester(this.params, this.options.compare);
    };
    $Ne.prototype.reset = function () {
        _super.prototype.reset.call(this);
        this.success = true;
    };
    $Ne.prototype.next = function (item) {
        if (this._test(item)) {
            this.done = true;
            this.success = false;
        }
    };
    return $Ne;
}(NamedBaseOperation));
// https://docs.mongodb.com/manual/reference/operator/query/elemMatch/
var $ElemMatch = /** @class */ (function (_super) {
    __extends($ElemMatch, _super);
    function $ElemMatch() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    $ElemMatch.prototype.init = function () {
        this._queryOperation = createQueryOperation(this.params, this.owneryQuery, this.options);
    };
    $ElemMatch.prototype.reset = function () {
        _super.prototype.reset.call(this);
        this._queryOperation.reset();
    };
    $ElemMatch.prototype.next = function (item, key, owner) {
        this._queryOperation.reset();
        if (isArray(owner)) {
            this._queryOperation.next(item, key, owner);
            this.done =
                this.done || this._queryOperation.done || key === owner.length - 1;
            this.success = this.success || this._queryOperation.success;
        }
        else {
            this.done = true;
            this.success = false;
        }
    };
    return $ElemMatch;
}(NamedBaseOperation));
var $Not = /** @class */ (function (_super) {
    __extends($Not, _super);
    function $Not() {
        return _super !== null && _super.apply(this, arguments) || this;
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
        this.success = !this._queryOperation.success;
    };
    return $Not;
}(NamedBaseOperation));
var $Size = /** @class */ (function (_super) {
    __extends($Size, _super);
    function $Size() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    $Size.prototype.init = function () { };
    $Size.prototype.next = function (item, key, parent) {
        if (parent && parent.length === this.params) {
            this.done = true;
            this.success = true;
        }
    };
    return $Size;
}(NamedBaseOperation));
var $Or = /** @class */ (function (_super) {
    __extends($Or, _super);
    function $Or() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    $Or.prototype.init = function () {
        var _this = this;
        this._ops = this.params.map(function (op) {
            return createQueryOperation(op, null, _this.options);
        });
    };
    $Or.prototype.reset = function () {
        this.done = false;
        this.success = false;
        for (var i = 0, length_1 = this._ops.length; i < length_1; i++) {
            this._ops[i].reset();
        }
    };
    $Or.prototype.next = function (item, key, owner) {
        var done = false;
        var success = false;
        for (var i = 0, length_2 = this._ops.length; i < length_2; i++) {
            var op = this._ops[i];
            op.next(item, key, owner);
            if (op.success) {
                done = true;
                success = op.success;
                break;
            }
        }
        this.success = success;
        this.done = done;
    };
    return $Or;
}(NamedBaseOperation));
var $Nor = /** @class */ (function (_super) {
    __extends($Nor, _super);
    function $Nor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    $Nor.prototype.next = function (item, key, owner) {
        _super.prototype.next.call(this, item, key, owner);
        this.success = !this.success;
    };
    return $Nor;
}($Or));
var $In = /** @class */ (function (_super) {
    __extends($In, _super);
    function $In() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    $In.prototype.init = function () {
        var _this = this;
        this._testers = this.params.map(function (value) {
            if (containsOperation(value)) {
                throw new Error("cannot nest $ under " + _this.constructor.name.toLowerCase());
            }
            return createTester(value, _this.options.compare);
        });
    };
    $In.prototype.next = function (item, key, owner) {
        var done = false;
        var success = false;
        for (var i = 0, length_3 = this._testers.length; i < length_3; i++) {
            var test = this._testers[i];
            if (test(item)) {
                done = true;
                success = true;
                break;
            }
        }
        this.success = success;
        this.done = done;
    };
    return $In;
}(NamedBaseOperation));
var $Nin = /** @class */ (function (_super) {
    __extends($Nin, _super);
    function $Nin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    $Nin.prototype.next = function (item, key, owner) {
        _super.prototype.next.call(this, item, key, owner);
        this.success = !this.success;
    };
    return $Nin;
}($In));
var $Exists = /** @class */ (function (_super) {
    __extends($Exists, _super);
    function $Exists() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    $Exists.prototype.next = function (item, key, owner) {
        if (owner.hasOwnProperty(key) === this.params) {
            this.done = true;
            this.success = true;
        }
    };
    return $Exists;
}(NamedBaseOperation));
var $And = /** @class */ (function (_super) {
    __extends($And, _super);
    function $And(params, owneryQuery, options, name) {
        return _super.call(this, params, owneryQuery, options, params.map(function (query) { return createQueryOperation(query, owneryQuery, options); }), name) || this;
    }
    $And.prototype.next = function (item, key, owner) {
        this.childrenNext(item, key, owner);
    };
    return $And;
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
var $type = function (clazz, owneryQuery, options) {
    return new EqualsOperation(function (b) { return (b != null ? b instanceof clazz || b.constructor === clazz : false); }, owneryQuery, options);
};
var $and = function (params, ownerQuery, options, name) { return new $And(params, ownerQuery, options, name); };
var $all = $and;
// export const $size = (
//   params: number,
//   ownerQuery: Query<any>,
//   options: Options
// ) => new EqualsOperation(b => {
//   return b && b.length === params;
// }, ownerQuery, options);
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

/***/ "./node_modules/slide/lib/async-map.js":
/*!*********************************************!*
  !*** ./node_modules/slide/lib/async-map.js ***!
  \*********************************************/
/***/ ((module) => {


/*
usage:

// do something to a list of things
asyncMap(myListOfStuff, function (thing, cb) { doSomething(thing.foo, cb) }, cb)
// do more than one thing to each item
asyncMap(list, fooFn, barFn, cb)

*/

module.exports = asyncMap

function asyncMap () {
  var steps = Array.prototype.slice.call(arguments)
    , list = steps.shift() || []
    , cb_ = steps.pop()
  if (typeof cb_ !== "function") throw new Error(
    "No callback provided to asyncMap")
  if (!list) return cb_(null, [])
  if (!Array.isArray(list)) list = [list]
  var n = steps.length
    , data = [] // 2d array
    , errState = null
    , l = list.length
    , a = l * n
  if (!a) return cb_(null, [])
  function cb (er) {
    if (er && !errState) errState = er

    var argLen = arguments.length
    for (var i = 1; i < argLen; i ++) if (arguments[i] !== undefined) {
      data[i - 1] = (data[i - 1] || []).concat(arguments[i])
    }
    // see if any new things have been added.
    if (list.length > l) {
      var newList = list.slice(l)
      a += (list.length - l) * n
      l = list.length
      process.nextTick(function () {
        newList.forEach(function (ar) {
          steps.forEach(function (fn) { fn(ar, cb) })
        })
      })
    }

    if (--a === 0) cb_.apply(null, [errState].concat(data))
  }
  // expect the supplied cb function to be called
  // "n" times for each thing in the array.
  list.forEach(function (ar) {
    steps.forEach(function (fn) { fn(ar, cb) })
  })
}


/***/ }),

/***/ "./node_modules/slide/lib/bind-actor.js":
/*!**********************************************!*
  !*** ./node_modules/slide/lib/bind-actor.js ***!
  \**********************************************/
/***/ ((module) => {

module.exports = bindActor
function bindActor () {
  var args = 
        Array.prototype.slice.call
        (arguments) // jswtf.
    , obj = null
    , fn
  if (typeof args[0] === "object") {
    obj = args.shift()
    fn = args.shift()
    if (typeof fn === "string")
      fn = obj[ fn ]
  } else fn = args.shift()
  return function (cb) {
    fn.apply(obj, args.concat(cb)) }
}


/***/ }),

/***/ "./node_modules/slide/lib/chain.js":
/*!*****************************************!*
  !*** ./node_modules/slide/lib/chain.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = chain
var bindActor = __webpack_require__(/*! ./bind-actor.js */ "./node_modules/slide/lib/bind-actor.js")
chain.first = {} ; chain.last = {}
function chain (things, cb) {
  var res = []
  ;(function LOOP (i, len) {
    if (i >= len) return cb(null,res)
    if (Array.isArray(things[i]))
      things[i] = bindActor.apply(null,
        things[i].map(function(i){
          return (i===chain.first) ? res[0]
           : (i===chain.last)
             ? res[res.length - 1] : i }))
    if (!things[i]) return LOOP(i + 1, len)
    things[i](function (er, data) {
      if (er) return cb(er, res)
      if (data !== undefined) res = res.concat(data)
      LOOP(i + 1, len)
    })
  })(0, things.length) }


/***/ }),

/***/ "./node_modules/slide/lib/slide.js":
/*!*****************************************!*
  !*** ./node_modules/slide/lib/slide.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

exports.asyncMap = __webpack_require__(/*! ./async-map */ "./node_modules/slide/lib/async-map.js")
exports.bindActor = __webpack_require__(/*! ./bind-actor */ "./node_modules/slide/lib/bind-actor.js")
exports.chain = __webpack_require__(/*! ./chain */ "./node_modules/slide/lib/chain.js")


/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/index.js":
/*!*****************************************************!*
  !*** ./node_modules/uuid/dist/esm-browser/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "v1": () => /* reexport safe */ _v1_js__WEBPACK_IMPORTED_MODULE_0__.default,
/* harmony export */   "v3": () => /* reexport safe */ _v3_js__WEBPACK_IMPORTED_MODULE_1__.default,
/* harmony export */   "v4": () => /* reexport safe */ _v4_js__WEBPACK_IMPORTED_MODULE_2__.default,
/* harmony export */   "v5": () => /* reexport safe */ _v5_js__WEBPACK_IMPORTED_MODULE_3__.default,
/* harmony export */   "NIL": () => /* reexport safe */ _nil_js__WEBPACK_IMPORTED_MODULE_4__.default,
/* harmony export */   "version": () => /* reexport safe */ _version_js__WEBPACK_IMPORTED_MODULE_5__.default,
/* harmony export */   "validate": () => /* reexport safe */ _validate_js__WEBPACK_IMPORTED_MODULE_6__.default,
/* harmony export */   "stringify": () => /* reexport safe */ _stringify_js__WEBPACK_IMPORTED_MODULE_7__.default,
/* harmony export */   "parse": () => /* reexport safe */ _parse_js__WEBPACK_IMPORTED_MODULE_8__.default
/* harmony export */ });
/* harmony import */ var _v1_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./v1.js */ "./node_modules/uuid/dist/esm-browser/v1.js");
/* harmony import */ var _v3_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./v3.js */ "./node_modules/uuid/dist/esm-browser/v3.js");
/* harmony import */ var _v4_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./v4.js */ "./node_modules/uuid/dist/esm-browser/v4.js");
/* harmony import */ var _v5_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./v5.js */ "./node_modules/uuid/dist/esm-browser/v5.js");
/* harmony import */ var _nil_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./nil.js */ "./node_modules/uuid/dist/esm-browser/nil.js");
/* harmony import */ var _version_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./version.js */ "./node_modules/uuid/dist/esm-browser/version.js");
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/esm-browser/validate.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/esm-browser/stringify.js");
/* harmony import */ var _parse_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./parse.js */ "./node_modules/uuid/dist/esm-browser/parse.js");










/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/md5.js":
/*!***************************************************!*
  !*** ./node_modules/uuid/dist/esm-browser/md5.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/*
 * Browser-compatible JavaScript MD5
 *
 * Modification of JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
function md5(bytes) {
  if (typeof bytes === 'string') {
    var msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = new Uint8Array(msg.length);

    for (var i = 0; i < msg.length; ++i) {
      bytes[i] = msg.charCodeAt(i);
    }
  }

  return md5ToHexEncodedArray(wordsToMd5(bytesToWords(bytes), bytes.length * 8));
}
/*
 * Convert an array of little-endian words to an array of bytes
 */


function md5ToHexEncodedArray(input) {
  var output = [];
  var length32 = input.length * 32;
  var hexTab = '0123456789abcdef';

  for (var i = 0; i < length32; i += 8) {
    var x = input[i >> 5] >>> i % 32 & 0xff;
    var hex = parseInt(hexTab.charAt(x >>> 4 & 0x0f) + hexTab.charAt(x & 0x0f), 16);
    output.push(hex);
  }

  return output;
}
/**
 * Calculate output length with padding and bit length
 */


function getOutputLength(inputLength8) {
  return (inputLength8 + 64 >>> 9 << 4) + 14 + 1;
}
/*
 * Calculate the MD5 of an array of little-endian words, and a bit length.
 */


function wordsToMd5(x, len) {
  /* append padding */
  x[len >> 5] |= 0x80 << len % 32;
  x[getOutputLength(len) - 1] = len;
  var a = 1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d = 271733878;

  for (var i = 0; i < x.length; i += 16) {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    a = md5ff(a, b, c, d, x[i], 7, -680876936);
    d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
    b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
    a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = md5gg(b, c, d, a, x[i], 20, -373897302);
    a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
    a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
    d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = md5hh(d, a, b, c, x[i], 11, -358537222);
    c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
    a = md5ii(a, b, c, d, x[i], 6, -198630844);
    d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c = safeAdd(c, oldc);
    d = safeAdd(d, oldd);
  }

  return [a, b, c, d];
}
/*
 * Convert an array bytes to an array of little-endian words
 * Characters >255 have their high-byte silently ignored.
 */


function bytesToWords(input) {
  if (input.length === 0) {
    return [];
  }

  var length8 = input.length * 8;
  var output = new Uint32Array(getOutputLength(length8));

  for (var i = 0; i < length8; i += 8) {
    output[i >> 5] |= (input[i / 8] & 0xff) << i % 32;
  }

  return output;
}
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */


function safeAdd(x, y) {
  var lsw = (x & 0xffff) + (y & 0xffff);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return msw << 16 | lsw & 0xffff;
}
/*
 * Bitwise rotate a 32-bit number to the left.
 */


function bitRotateLeft(num, cnt) {
  return num << cnt | num >>> 32 - cnt;
}
/*
 * These functions implement the four basic operations the algorithm uses.
 */


function md5cmn(q, a, b, x, s, t) {
  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
}

function md5ff(a, b, c, d, x, s, t) {
  return md5cmn(b & c | ~b & d, a, b, x, s, t);
}

function md5gg(a, b, c, d, x, s, t) {
  return md5cmn(b & d | c & ~d, a, b, x, s, t);
}

function md5hh(a, b, c, d, x, s, t) {
  return md5cmn(b ^ c ^ d, a, b, x, s, t);
}

function md5ii(a, b, c, d, x, s, t) {
  return md5cmn(c ^ (b | ~d), a, b, x, s, t);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (md5);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/nil.js":
/*!***************************************************!*
  !*** ./node_modules/uuid/dist/esm-browser/nil.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ('00000000-0000-0000-0000-000000000000');

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/parse.js":
/*!*****************************************************!*
  !*** ./node_modules/uuid/dist/esm-browser/parse.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/esm-browser/validate.js");


function parse(uuid) {
  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  var v;
  var arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (parse);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/regex.js":
/*!*****************************************************!*
  !*** ./node_modules/uuid/dist/esm-browser/regex.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/rng.js":
/*!***************************************************!*
  !*** ./node_modules/uuid/dist/esm-browser/rng.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ rng
/* harmony export */ });
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
    // find the complete implementation of crypto (msCrypto) on IE11.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/sha1.js":
/*!****************************************************!*
  !*** ./node_modules/uuid/dist/esm-browser/sha1.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
// Adapted from Chris Veness' SHA1 code at
// http://www.movable-type.co.uk/scripts/sha1.html
function f(s, x, y, z) {
  switch (s) {
    case 0:
      return x & y ^ ~x & z;

    case 1:
      return x ^ y ^ z;

    case 2:
      return x & y ^ x & z ^ y & z;

    case 3:
      return x ^ y ^ z;
  }
}

function ROTL(x, n) {
  return x << n | x >>> 32 - n;
}

function sha1(bytes) {
  var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
  var H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];

  if (typeof bytes === 'string') {
    var msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = [];

    for (var i = 0; i < msg.length; ++i) {
      bytes.push(msg.charCodeAt(i));
    }
  } else if (!Array.isArray(bytes)) {
    // Convert Array-like to Array
    bytes = Array.prototype.slice.call(bytes);
  }

  bytes.push(0x80);
  var l = bytes.length / 4 + 2;
  var N = Math.ceil(l / 16);
  var M = new Array(N);

  for (var _i = 0; _i < N; ++_i) {
    var arr = new Uint32Array(16);

    for (var j = 0; j < 16; ++j) {
      arr[j] = bytes[_i * 64 + j * 4] << 24 | bytes[_i * 64 + j * 4 + 1] << 16 | bytes[_i * 64 + j * 4 + 2] << 8 | bytes[_i * 64 + j * 4 + 3];
    }

    M[_i] = arr;
  }

  M[N - 1][14] = (bytes.length - 1) * 8 / Math.pow(2, 32);
  M[N - 1][14] = Math.floor(M[N - 1][14]);
  M[N - 1][15] = (bytes.length - 1) * 8 & 0xffffffff;

  for (var _i2 = 0; _i2 < N; ++_i2) {
    var W = new Uint32Array(80);

    for (var t = 0; t < 16; ++t) {
      W[t] = M[_i2][t];
    }

    for (var _t = 16; _t < 80; ++_t) {
      W[_t] = ROTL(W[_t - 3] ^ W[_t - 8] ^ W[_t - 14] ^ W[_t - 16], 1);
    }

    var a = H[0];
    var b = H[1];
    var c = H[2];
    var d = H[3];
    var e = H[4];

    for (var _t2 = 0; _t2 < 80; ++_t2) {
      var s = Math.floor(_t2 / 20);
      var T = ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[_t2] >>> 0;
      e = d;
      d = c;
      c = ROTL(b, 30) >>> 0;
      b = a;
      a = T;
    }

    H[0] = H[0] + a >>> 0;
    H[1] = H[1] + b >>> 0;
    H[2] = H[2] + c >>> 0;
    H[3] = H[3] + d >>> 0;
    H[4] = H[4] + e >>> 0;
  }

  return [H[0] >> 24 & 0xff, H[0] >> 16 & 0xff, H[0] >> 8 & 0xff, H[0] & 0xff, H[1] >> 24 & 0xff, H[1] >> 16 & 0xff, H[1] >> 8 & 0xff, H[1] & 0xff, H[2] >> 24 & 0xff, H[2] >> 16 & 0xff, H[2] >> 8 & 0xff, H[2] & 0xff, H[3] >> 24 & 0xff, H[3] >> 16 & 0xff, H[3] >> 8 & 0xff, H[3] & 0xff, H[4] >> 24 & 0xff, H[4] >> 16 & 0xff, H[4] >> 8 & 0xff, H[4] & 0xff];
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (sha1);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/stringify.js":
/*!*********************************************************!*
  !*** ./node_modules/uuid/dist/esm-browser/stringify.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/esm-browser/validate.js");

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stringify);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/v1.js":
/*!**************************************************!*
  !*** ./node_modules/uuid/dist/esm-browser/v1.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rng.js */ "./node_modules/uuid/dist/esm-browser/rng.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/esm-browser/stringify.js");

 // **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

var _nodeId;

var _clockseq; // Previous uuid creation time


var _lastMSecs = 0;
var _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || new Array(16);
  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    var seedBytes = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_0__.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  var msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  var dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  var tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__.default)(b);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v1);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/v3.js":
/*!**************************************************!*
  !*** ./node_modules/uuid/dist/esm-browser/v3.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _v35_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./v35.js */ "./node_modules/uuid/dist/esm-browser/v35.js");
/* harmony import */ var _md5_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./md5.js */ "./node_modules/uuid/dist/esm-browser/md5.js");


var v3 = (0,_v35_js__WEBPACK_IMPORTED_MODULE_0__.default)('v3', 0x30, _md5_js__WEBPACK_IMPORTED_MODULE_1__.default);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v3);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/v35.js":
/*!***************************************************!*
  !*** ./node_modules/uuid/dist/esm-browser/v35.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DNS": () => /* binding */ DNS,
/* harmony export */   "URL": () => /* binding */ URL,
/* harmony export */   "default": () => /* export default binding */ __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/esm-browser/stringify.js");
/* harmony import */ var _parse_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parse.js */ "./node_modules/uuid/dist/esm-browser/parse.js");



function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  var bytes = [];

  for (var i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

var DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
var URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0,_parse_js__WEBPACK_IMPORTED_MODULE_0__.default)(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    var bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (var i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__.default)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/v4.js":
/*!**************************************************!*
  !*** ./node_modules/uuid/dist/esm-browser/v4.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rng.js */ "./node_modules/uuid/dist/esm-browser/rng.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/esm-browser/stringify.js");



function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_0__.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__.default)(rnds);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v4);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/v5.js":
/*!**************************************************!*
  !*** ./node_modules/uuid/dist/esm-browser/v5.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _v35_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./v35.js */ "./node_modules/uuid/dist/esm-browser/v35.js");
/* harmony import */ var _sha1_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sha1.js */ "./node_modules/uuid/dist/esm-browser/sha1.js");


var v5 = (0,_v35_js__WEBPACK_IMPORTED_MODULE_0__.default)('v5', 0x50, _sha1_js__WEBPACK_IMPORTED_MODULE_1__.default);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v5);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/validate.js":
/*!********************************************************!*
  !*** ./node_modules/uuid/dist/esm-browser/validate.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _regex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regex.js */ "./node_modules/uuid/dist/esm-browser/regex.js");


function validate(uuid) {
  return typeof uuid === 'string' && _regex_js__WEBPACK_IMPORTED_MODULE_0__.default.test(uuid);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (validate);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/version.js":
/*!*******************************************************!*
  !*** ./node_modules/uuid/dist/esm-browser/version.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/esm-browser/validate.js");


function version(uuid) {
  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (version);

/***/ }),

/***/ "./node_modules/write-file-atomic/index.js":
/*!*************************************************!*
  !*** ./node_modules/write-file-atomic/index.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
var __filename = "/index.js";

module.exports = writeFile
module.exports.sync = writeFileSync
module.exports._getTmpname = getTmpname // for testing

var fs = __webpack_require__(/*! graceful-fs */ "./node_modules/graceful-fs/graceful-fs.js")
var chain = __webpack_require__(/*! slide */ "./node_modules/slide/lib/slide.js").chain
var MurmurHash3 = __webpack_require__(/*! imurmurhash */ "./node_modules/imurmurhash/imurmurhash.js")
var extend = Object.assign || __webpack_require__(/*! util */ "?0bed")._extend

var invocations = 0
function getTmpname (filename) {
  return filename + '.' +
    MurmurHash3(__filename)
      .hash(String(process.pid))
      .hash(String(++invocations))
      .result()
}

function writeFile (filename, data, options, callback) {
  if (options instanceof Function) {
    callback = options
    options = null
  }
  if (!options) options = {}
  fs.realpath(filename, function (_, realname) {
    _writeFile(realname || filename, data, options, callback)
  })
}
function _writeFile (filename, data, options, callback) {
  var tmpfile = getTmpname(filename)

  if (options.mode && options.chown) {
    return thenWriteFile()
  } else {
    // Either mode or chown is not explicitly set
    // Default behavior is to copy it from original file
    return fs.stat(filename, function (err, stats) {
      if (err || !stats) return thenWriteFile()

      options = extend({}, options)
      if (!options.mode) {
        options.mode = stats.mode
      }
      if (!options.chown && process.getuid) {
        options.chown = { uid: stats.uid, gid: stats.gid }
      }
      return thenWriteFile()
    })
  }

  function thenWriteFile () {
    chain([
      [writeFileAsync, tmpfile, data, options.mode, options.encoding || 'utf8'],
      options.chown && [fs, fs.chown, tmpfile, options.chown.uid, options.chown.gid],
      options.mode && [fs, fs.chmod, tmpfile, options.mode],
      [fs, fs.rename, tmpfile, filename]
    ], function (err) {
      err ? fs.unlink(tmpfile, function () { callback(err) })
        : callback()
    })
  }

  // doing this instead of `fs.writeFile` in order to get the ability to
  // call `fsync`.
  function writeFileAsync (file, data, mode, encoding, cb) {
    fs.open(file, 'w', options.mode, function (err, fd) {
      if (err) return cb(err)
      if (Buffer.isBuffer(data)) {
        return fs.write(fd, data, 0, data.length, 0, syncAndClose)
      } else if (data != null) {
        return fs.write(fd, String(data), 0, String(encoding), syncAndClose)
      } else {
        return syncAndClose()
      }
      function syncAndClose (err) {
        if (err) return cb(err)
        fs.fsync(fd, function (err) {
          if (err) return cb(err)
          fs.close(fd, cb)
        })
      }
    })
  }
}

function writeFileSync (filename, data, options) {
  if (!options) options = {}
  try {
    filename = fs.realpathSync(filename)
  } catch (ex) {
    // it's ok, it'll happen on a not yet existing file
  }
  var tmpfile = getTmpname(filename)

  try {
    if (!options.mode || !options.chown) {
      // Either mode or chown is not explicitly set
      // Default behavior is to copy it from original file
      try {
        var stats = fs.statSync(filename)
        options = extend({}, options)
        if (!options.mode) {
          options.mode = stats.mode
        }
        if (!options.chown && process.getuid) {
          options.chown = { uid: stats.uid, gid: stats.gid }
        }
      } catch (ex) {
        // ignore stat errors
      }
    }

    var fd = fs.openSync(tmpfile, 'w', options.mode)
    if (Buffer.isBuffer(data)) {
      fs.writeSync(fd, data, 0, data.length, 0)
    } else if (data != null) {
      fs.writeSync(fd, String(data), 0, String(options.encoding || 'utf8'))
    }
    fs.fsyncSync(fd)
    fs.closeSync(fd)
    if (options.chown) fs.chownSync(tmpfile, options.chown.uid, options.chown.gid)
    if (options.mode) fs.chmodSync(tmpfile, options.mode)
    fs.renameSync(tmpfile, filename)
  } catch (err) {
    try { fs.unlinkSync(tmpfile) } catch (e) {}
    throw err
  }
}


/***/ }),

/***/ "?b0c0":
/*!************************!*
  !*** assert (ignored) ***!
  \************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?4c81":
/*!***************************!*
  !*** constants (ignored) ***!
  \***************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?65c5":
/*!********************!*
  !*** fs (ignored) ***!
  \********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?0f27":
/*!**********************!*
  !*** path (ignored) ***!
  \**********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?cc48":
/*!************************!*
  !*** stream (ignored) ***!
  \************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?0bed":
/*!**********************!*
  !*** util (ignored) ***!
  \**********************/
/***/ (() => {

/* (ignored) */

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
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
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
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./packages/client/lib/index.js");
/******/ })()
;
//# sourceMappingURL=feathersjs-offline-client.js.map