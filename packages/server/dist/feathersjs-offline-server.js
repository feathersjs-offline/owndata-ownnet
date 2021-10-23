var feathersjsOfflineServer;feathersjsOfflineServer =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./packages/server/lib/cryptographic.js":
/*!**********************************************!*\
  !*** ./packages/server/lib/cryptographic.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Simply "stolen" from feathers-offline-xxx
var md5 = __webpack_require__(/*! md5 */ "./packages/server/node_modules/md5/md5.js");

var _require = __webpack_require__(/*! nanoid */ "./packages/server/node_modules/nanoid/index.dev.js"),
    nanoid = _require.nanoid;

var _require2 = __webpack_require__(/*! ./misc */ "./packages/server/lib/misc.js"),
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

/***/ "./packages/server/lib/index.js":
/*!**************************************!*\
  !*** ./packages/server/lib/index.js ***!
  \**************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
})); // Main module for server

var adapter_commons_1 = __webpack_require__(/*! @feathersjs/adapter-commons */ "./packages/server/node_modules/@feathersjs/adapter-commons/lib/index.js");

var commons_1 = __webpack_require__(/*! @feathersjs/commons */ "./packages/server/node_modules/@feathersjs/commons/lib/index.js");

var errors_1 = __importDefault(__webpack_require__(/*! @feathersjs/errors */ "./packages/server/node_modules/@feathersjs/errors/lib/index.js"));

var cloneDeep_1 = __importDefault(__webpack_require__(/*! lodash/cloneDeep */ "./packages/server/node_modules/lodash/cloneDeep.js"));

var cryptographic_1 = __webpack_require__(/*! ./cryptographic */ "./packages/server/lib/cryptographic.js");

var strings_to_dates_1 = __importDefault(__webpack_require__(/*! ./strings-to-dates */ "./packages/server/lib/strings-to-dates.js"));

var misc_1 = __webpack_require__(/*! ./misc */ "./packages/server/lib/misc.js");

var debug = __webpack_require__(/*! debug */ "./packages/server/node_modules/debug/src/browser.js")('@feathersjs-offline:server:index');

var defOptions = {
  useShortUuid: true,
  adapterTest: false,
  dates: false
};
var BOT = new Date(0);
/**
 * A RealtimeServiceWrapper is a SERVER adapter wrapping a standard AdapterService to ensure all records/documents
 * contains 'onServerAt' and to provide a getSyncInfo() function to support proper sync'ing of clients.
 */

var RealtimeClass = /*#__PURE__*/function (_adapter_commons_1$Ad) {
  _inherits(RealtimeClass, _adapter_commons_1$Ad);

  var _super = _createSuper(RealtimeClass);

  function RealtimeClass(opts) {
    var _this;

    _classCallCheck(this, RealtimeClass);

    var newOpts = Object.assign({}, defOptions, opts);
    debug("Constructor started, newOpts = ".concat(JSON.stringify(newOpts)));
    _this = _super.call(this, newOpts);
    _this.wrapperOptions = Object.assign({}, newOpts, _this.options);
    debug("Constructor ended, options = ".concat(JSON.stringify(_this.options)));
    _this.type = 'realtime-class';
    debug('  Done.');
    return _this;
  }

  _createClass(RealtimeClass, [{
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
        var self, old, stripValues, idIx;
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
                this._dates = this.options.dates;
                self = this; // Now we are ready to define the path with its underlying service (the remoteService)

                old = app.service(path);

                if (old !== self) {
                  this.wrappedService = old || app.service(path); // We want to get the default service (redirects to server or points to a local service)

                  app.use(path, self); // Install this service instance
                } // Get the service name and standard settings


                this.name = (0, commons_1.stripSlashes)(path); // The initialization/setup of the localService adapter screws-up our options object

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
                  for (var _len = arguments.length, others = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    others[_key - 1] = arguments[_key];
                  }

                  return function (res) {
                    return (0, adapter_commons_1.select).apply(void 0, [params].concat(others, [self.id]))(res);
                  };
                }; // Initialize the service wrapper


                this.listening = false; // This is necessary if we get updates to options (e.g. .options.multi = ['patch'])

                if (!(this.wrappedService instanceof adapter_commons_1.AdapterService)) {
                  this._listenOptions();
                } // Make sure that the wrapped service is setup correctly


                if (typeof this.wrappedService.setup === 'function') {
                  this.wrappedService.setup(app, path);
                }

                debug('  Done.');
                return _context2.abrupt("return", true);

              case 18:
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
      this.options = observe(Object.assign({}, this.wrappedService.options ? this.wrappedService.options : {}, self.options));
      watcher(function () {
        // Update all changes to 'this.options' in both localService and remoteService
        self.wrappedService.options = Object.assign({}, self.wrappedService.options, self.options);
      });
    } // Allow access to our internal services (e.g. for application hooks). Use with care!

  }, {
    key: "_get",
    value: function _get(id, params) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var _fixParams, newParams, offline;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _fixParams = fixParams(params), newParams = _fixParams.newParams, offline = _fixParams.offline;
                debug("Calling _get(".concat(id, ", ").concat(JSON.stringify(newParams), ") params=").concat(JSON.stringify(params)));
                return _context3.abrupt("return", this.wrappedService.get(id, newParams).then(this._strip).then(this._select(newParams)).then((0, strings_to_dates_1["default"])(this._dates)));

              case 3:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));
    }
  }, {
    key: "_find",
    value: function _find(params) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var _fixParams2, newParams, offline;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _fixParams2 = fixParams(params), newParams = _fixParams2.newParams, offline = _fixParams2.offline;
                debug("Calling _find(".concat(JSON.stringify(newParams), "), offline=").concat(JSON.stringify(offline), ", query was=").concat(JSON.stringify(params.query ? params.query : {})));
                return _context4.abrupt("return", this.wrappedService.find(newParams).then(this._strip).then(this._select(newParams)).then((0, strings_to_dates_1["default"])(this._dates)).then(function (result) {
                  debug("Find result=".concat(JSON.stringify(result)));
                  return result;
                }));

              case 3:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));
    }
  }, {
    key: "_create",
    value: function _create(data) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var ts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        var _this2 = this;

        var _fixParams3, newParams, offline, _ts, newData, myParams;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _fixParams3 = fixParams(params), newParams = _fixParams3.newParams, offline = _fixParams3.offline;
                debug("Calling _create(".concat(JSON.stringify(data), ", ").concat(JSON.stringify(params), "),  newParams=").concat(JSON.stringify(newParams)));

                if (!Array.isArray(data)) {
                  _context5.next = 5;
                  break;
                }

                _ts = new Date();
                return _context5.abrupt("return", Promise.all(data.map(function (current) {
                  return _this2._create(current, newParams, _ts);
                })));

              case 5:
                ts = ts || new Date();
                newData = (0, cloneDeep_1["default"])(data); // We require a 'uuid' attribute along with 'updatedAt' and 'onServerAt'

                if (!('uuid' in newData)) {
                  newData.uuid = (0, cryptographic_1.genUuid)(this.options.useShortUuid);
                }

                if (!('updatedAt' in newData)) {
                  newData.updatedAt = ts;
                }

                newData.onServerAt = ts;
                myParams = Object.assign({}, params, {
                  dummy: 123
                });
                return _context5.abrupt("return", this.wrappedService.create(newData, newParams).then(this._strip).then(this._select(newParams)).then((0, strings_to_dates_1["default"])(this._dates)));

              case 12:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));
    }
  }, {
    key: "_update",
    value: function _update(id, data, params) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
        var _fixParams4, newParams, offline, newData, active;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                debug("Calling _update(".concat(id, ", ").concat(JSON.stringify(data), ", ").concat(JSON.stringify(params), ")"));
                _fixParams4 = fixParams(params), newParams = _fixParams4.newParams, offline = _fixParams4.offline;
                newData = (0, cloneDeep_1["default"])(data);
                _context6.next = 5;
                return this.wrappedService.get(id, newParams);

              case 5:
                active = _context6.sent;

                if (!('uuid' in newData)) {
                  newData.uuid = active.uuid;
                }

                if (!('updatedAt' in newData)) {
                  newData.updatedAt = active.updatedAt;
                }

                debug("newData: ".concat(JSON.stringify(newData)));

                if (!(new Date(active.onServerAt).getTime() > newData.updatedAt)) {
                  _context6.next = 13;
                  break;
                }

                return _context6.abrupt("return", Promise.resolve(active).then(this._strip));

              case 13:
                newData.onServerAt = new Date();
                return _context6.abrupt("return", this.wrappedService.update(id, newData, newParams).then(this._strip).then(this._select(newParams)).then((0, strings_to_dates_1["default"])(this._dates)));

              case 15:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));
    }
  }, {
    key: "_patch",
    value: function _patch(id, data) {
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var ts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
        var _this3 = this;

        var _fixParams5, newParams, offline, multi, _ts2, newData, active;

        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _fixParams5 = fixParams(params), newParams = _fixParams5.newParams, offline = _fixParams5.offline;
                debug("Calling _patch(".concat(id, ", ").concat(JSON.stringify(data), ", ").concat(JSON.stringify(newParams), ")"));

                if (!(id === null)) {
                  _context7.next = 8;
                  break;
                }

                multi = this.allowsMulti('patch');

                if (multi) {
                  _context7.next = 6;
                  break;
                }

                throw new errors_1["default"].MethodNotAllowed('Patching multiple without option \'multi\' set');

              case 6:
                _ts2 = new Date();
                return _context7.abrupt("return", this.wrappedService.find(newParams).then(function (page) {
                  var res = page.data ? page.data : page; // if (!Array.isArray(res)) {
                  //   res = [res];
                  // }

                  var self = _this3;
                  return Promise.all(res.map(function (current) {
                    return self._patch(current[self.id], data, params, _ts2);
                  }));
                }));

              case 8:
                newData = (0, cloneDeep_1["default"])(data);
                _context7.next = 11;
                return this.wrappedService.get(id, newParams);

              case 11:
                active = _context7.sent;

                if (!(new Date(active.onServerAt).getTime() > newData.updatedAt)) {
                  _context7.next = 16;
                  break;
                }

                return _context7.abrupt("return", Promise.resolve(active).then(this._strip).then(this._select(newParams)));

              case 16:
                newData.onServerAt = ts || new Date();
                return _context7.abrupt("return", this.wrappedService.patch(id, newData, newParams).then(this._strip).then(this._select(params)).then((0, strings_to_dates_1["default"])(this._dates)));

              case 18:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));
    }
  }, {
    key: "_remove",
    value: function _remove(id) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var ts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
        var _this4 = this;

        var _fixParams6, newParams, offline, multi, _ts3;

        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _fixParams6 = fixParams(params), newParams = _fixParams6.newParams, offline = _fixParams6.offline;
                debug("Calling _remove(".concat(id, ", ").concat(JSON.stringify(newParams), ")"));

                if (!(id === null)) {
                  _context8.next = 8;
                  break;
                }

                multi = this.allowsMulti('remove');

                if (multi) {
                  _context8.next = 6;
                  break;
                }

                throw new errors_1["default"].MethodNotAllowed('Removing multiple without option \'multi\' set');

              case 6:
                _ts3 = new Date();
                return _context8.abrupt("return", this.wrappedService.find(newParams).then(function (page) {
                  var res = page.data ? page.data : page; // if (!Array.isArray(res)) {
                  //   res = [res];
                  // }

                  var self = _this4;
                  return Promise.all(res.map(function (current) {
                    return self._remove(current[self.id], params, _ts3);
                  }));
                }));

              case 8:
                ts = ts || new Date();

                if (!(offline && offline._forceAll)) {
                  _context8.next = 13;
                  break;
                }

                return _context8.abrupt("return", this.wrappedService.remove(id, newParams).then(this._strip).then(this._select(newParams)));

              case 13:
                return _context8.abrupt("return", this.wrappedService.patch(id, {
                  deletedAt: ts
                }, newParams).then(function (res) {
                  return res;
                }).then(this._strip).then(this._select(newParams)).then((0, strings_to_dates_1["default"])(this._dates)));

              case 14:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));
    }
  }, {
    key: "wrapped",
    get: function get() {
      return this.wrappedService;
    }
  }]);

  return RealtimeClass;
}(adapter_commons_1.AdapterService);

;

var init = function init(options, app) {
  return new RealtimeClass(options, app);
};

init.Service = RealtimeClass;
var Realtime = init;
/**
 * A realtimeWrapper is a SERVER adapter wrapping for FeathersJS services extending them to
 * implement the offline `own-data` / `own-net` principle (**LINK-TO-DOC**).
 *
 * @example ```
 * import feathers from '(at)feathersjs/feathers';
 * import memory from 'feathers-memory';
 * import { realtimeWrapper } from '(at)feathersjs-offline/server';
 * const app = feathers();
 * app.use('/testpath', memory({id: 'uuid'}));
 * realtimeWrapper(app, '/testpath');
 * app.service('testpath').create({givenName: 'James', familyName: 'Bond'})
 * // ...
 * ```
 *
 * It works in co-existence with it's CLIENT counterparts, `owndataWrapper` and `ownnetWrapper`.
 *
 * @param {object} app  The application handle
 * @param {object} path The service path (as used in ```app.use(path, serviceAdapter)```)
 * @param {object} options The options for the serviceAdaptor AND the realtimeWrapper
 *
 */

function realtimeWrapper(app, path) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  debug("realtimeWrapper started on path '".concat(path, "'"));
  if (!(app && app.version && app.service && app.services)) throw new errors_1["default"].Unavailable("The FeathersJS app must be supplied as first argument");
  var location = (0, commons_1.stripSlashes)(path);
  var old = app.service(location);

  if (typeof old === 'undefined') {
    throw new errors_1["default"].Unavailable("No prior service registered on path '".concat(location, "'"));
  }

  var opts = Object.assign({}, old.options, options);
  var service = Realtime(opts, app);
  app.use(location, service);
  service = app.service(location);
  service.options = opts;

  service._listenOptions();

  service.wrappedService = old;
  return service;
}

module.exports = {
  init: init,
  Realtime: Realtime,
  realtimeWrapper: realtimeWrapper
}; // --- Helper functions

var _adapterTestStrip = ['uuid', 'updatedAt', 'onServerAt', 'deletedAt'];

var attrStrip = function attrStrip() {
  for (var _len2 = arguments.length, attr = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    attr[_key2] = arguments[_key2];
  }

  return function (res) {
    return Array.isArray(res) ? res.map(function (val) {
      return (0, misc_1.stripProps)(val, attr);
    }) : (0, misc_1.stripProps)(res, attr);
  };
};
/**
 * Fixes params so that `query` adheres to the standard i.e. it splits `{ query:
 * { ..., offline: { ... }}}` into `{ newParams, offline }`.
 *
 * Iff `offline` contains `_forceAll: true` we remove `offline` and
 * `deletedAt`from `query`.
 *
 * `deletedAt` is normally forced to `null` in `query` so we do not operate on
 * soft-deleted items, but iff `query.offline._forceAll` we remove the attribute
 * from `query` to be able to query all items in the collection regardless of
 * their deletion status.
 *
 * @param {object} params A normal params object with possible `offline` query
 * @return {object} Returns `{ newParams, offline }`
 */


var fixParams = function fixParams(params) {
  if (!params) return {
    newParams: {
      query: {
        'deletedAt': null
      }
    },
    offline: {}
  };
  params = JSON.parse(JSON.stringify(params));

  var _params = params,
      paginate = _params.paginate,
      _params$query = _params.query,
      query = _params$query === void 0 ? {} : _params$query,
      other = __rest(params, ["paginate", "query"]);

  var _query = query,
      offline = _query.offline,
      rest = __rest(query, ["offline"]);

  query = rest;
  var newParams = Object.assign({}, {
    paginate: paginate
  }, other);

  if (offline) {
    if (offline._forceAll) {
      query = (0, misc_1.stripProps)(query, 'deletedAt');
      query.onServerAt = {
        $gte: query.onServerAt ? new Date(query.onServerAt).getTime() : BOT.getTime()
      };
    } else {
      query.deletedAt = null;
      var at = query.onServerAt || BOT.toISOString();
      query.onServerAt = {
        $gte: new Date(at).getTime()
      };
    }
  } else {
    query.deletedAt = null;
  }

  newParams.query = query;
  return {
    newParams: newParams,
    offline: offline !== undefined ? offline : {}
  };
};
/* Support for updating adapter options through the wrapper */


var depends = [];
var watchingFn = null;
/**
 * Package the data to be observed in a proxy that updates according to
 * relevant recipes registered with watcher().
 * @param {object} data The data object to observe
 */

function observe(data) {
  return new Proxy(data, {
    get: function get(obj, key) {
      if (watchingFn) {
        if (!depends[key]) depends[key] = [];
        depends[key].push(watchingFn);
      }

      return obj[key];
    },
    set: function set(obj, key, val) {
      obj[key] = val;
      if (depends[key]) depends[key].forEach(function (cb) {
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


function watcher(target) {
  watchingFn = target;
  target();
  watchingFn = null;
}

/***/ }),

/***/ "./packages/server/lib/misc.js":
/*!*************************************!*\
  !*** ./packages/server/lib/misc.js ***!
  \*************************************/
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

/***/ "./packages/server/lib/strings-to-dates.js":
/*!*************************************************!*\
  !*** ./packages/server/lib/strings-to-dates.js ***!
  \*************************************************/
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

/***/ "./packages/server/node_modules/@feathersjs/adapter-commons/lib/filter-query.js":
/*!**************************************************************************************!*\
  !*** ./packages/server/node_modules/@feathersjs/adapter-commons/lib/filter-query.js ***!
  \**************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {

"use strict";


function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.OPERATORS = exports.FILTERS = void 0;

var commons_1 = __webpack_require__(/*! @feathersjs/commons */ "./packages/server/node_modules/@feathersjs/commons/lib/index.js");

var errors_1 = __webpack_require__(/*! @feathersjs/errors */ "./packages/server/node_modules/@feathersjs/errors/lib/index.js");

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

/***/ "./packages/server/node_modules/@feathersjs/adapter-commons/lib/index.js":
/*!*******************************************************************************!*\
  !*** ./packages/server/node_modules/@feathersjs/adapter-commons/lib/index.js ***!
  \*******************************************************************************/
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

var commons_1 = __webpack_require__(/*! @feathersjs/commons */ "./packages/server/node_modules/@feathersjs/commons/lib/index.js");

var service_1 = __webpack_require__(/*! ./service */ "./packages/server/node_modules/@feathersjs/adapter-commons/lib/service.js");

Object.defineProperty(exports, "AdapterService", ({
  enumerable: true,
  get: function get() {
    return service_1.AdapterService;
  }
}));

var filter_query_1 = __webpack_require__(/*! ./filter-query */ "./packages/server/node_modules/@feathersjs/adapter-commons/lib/filter-query.js");

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

__exportStar(__webpack_require__(/*! ./sort */ "./packages/server/node_modules/@feathersjs/adapter-commons/lib/sort.js"), exports); // Return a function that filters a result object or array
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

/***/ "./packages/server/node_modules/@feathersjs/adapter-commons/lib/service.js":
/*!*********************************************************************************!*\
  !*** ./packages/server/node_modules/@feathersjs/adapter-commons/lib/service.js ***!
  \*********************************************************************************/
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

var errors_1 = __webpack_require__(/*! @feathersjs/errors */ "./packages/server/node_modules/@feathersjs/errors/lib/index.js");

var filter_query_1 = __importDefault(__webpack_require__(/*! ./filter-query */ "./packages/server/node_modules/@feathersjs/adapter-commons/lib/filter-query.js"));

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

/***/ "./packages/server/node_modules/@feathersjs/adapter-commons/lib/sort.js":
/*!******************************************************************************!*\
  !*** ./packages/server/node_modules/@feathersjs/adapter-commons/lib/sort.js ***!
  \******************************************************************************/
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

/***/ "./packages/server/node_modules/@feathersjs/commons/lib/hooks.js":
/*!***********************************************************************!*\
  !*** ./packages/server/node_modules/@feathersjs/commons/lib/hooks.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.enableHooks = exports.processHooks = exports.getHooks = exports.isHookObject = exports.convertHookData = exports.makeArguments = exports.defaultMakeArguments = exports.createHookObject = exports.ACTIVATE_HOOKS = void 0;

var utils_1 = __webpack_require__(/*! ./utils */ "./packages/server/node_modules/@feathersjs/commons/lib/utils.js");

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

/***/ "./packages/server/node_modules/@feathersjs/commons/lib/index.js":
/*!***********************************************************************!*\
  !*** ./packages/server/node_modules/@feathersjs/commons/lib/index.js ***!
  \***********************************************************************/
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

var hookUtils = __importStar(__webpack_require__(/*! ./hooks */ "./packages/server/node_modules/@feathersjs/commons/lib/hooks.js"));

__exportStar(__webpack_require__(/*! ./utils */ "./packages/server/node_modules/@feathersjs/commons/lib/utils.js"), exports);

exports.hooks = hookUtils;

/***/ }),

/***/ "./packages/server/node_modules/@feathersjs/commons/lib/utils.js":
/*!***********************************************************************!*\
  !*** ./packages/server/node_modules/@feathersjs/commons/lib/utils.js ***!
  \***********************************************************************/
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

/***/ "./packages/server/node_modules/@feathersjs/errors/lib/index.js":
/*!**********************************************************************!*\
  !*** ./packages/server/node_modules/@feathersjs/errors/lib/index.js ***!
  \**********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var debug = __webpack_require__(/*! debug */ "./packages/server/node_modules/debug/src/browser.js")('@feathersjs/errors');

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

/***/ "./packages/server/node_modules/debug/src/browser.js":
/*!***********************************************************!*\
  !*** ./packages/server/node_modules/debug/src/browser.js ***!
  \***********************************************************/
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

module.exports = __webpack_require__(/*! ./common */ "./packages/server/node_modules/debug/src/common.js")(exports);
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

/***/ "./packages/server/node_modules/debug/src/common.js":
/*!**********************************************************!*\
  !*** ./packages/server/node_modules/debug/src/common.js ***!
  \**********************************************************/
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
  createDebug.humanize = __webpack_require__(/*! ms */ "./packages/server/node_modules/ms/index.js");
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

/***/ "./packages/server/node_modules/charenc/charenc.js":
/*!*********************************************************!*\
  !*** ./packages/server/node_modules/charenc/charenc.js ***!
  \*********************************************************/
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

/***/ "./packages/server/node_modules/crypt/crypt.js":
/*!*****************************************************!*\
  !*** ./packages/server/node_modules/crypt/crypt.js ***!
  \*****************************************************/
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

/***/ "./packages/server/node_modules/is-buffer/index.js":
/*!*********************************************************!*\
  !*** ./packages/server/node_modules/is-buffer/index.js ***!
  \*********************************************************/
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

/***/ "./packages/server/node_modules/lodash/_DataView.js":
/*!**********************************************************!*\
  !*** ./packages/server/node_modules/lodash/_DataView.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ "./packages/server/node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "./packages/server/node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;


/***/ }),

/***/ "./packages/server/node_modules/lodash/_Hash.js":
/*!******************************************************!*\
  !*** ./packages/server/node_modules/lodash/_Hash.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var hashClear = __webpack_require__(/*! ./_hashClear */ "./packages/server/node_modules/lodash/_hashClear.js"),
    hashDelete = __webpack_require__(/*! ./_hashDelete */ "./packages/server/node_modules/lodash/_hashDelete.js"),
    hashGet = __webpack_require__(/*! ./_hashGet */ "./packages/server/node_modules/lodash/_hashGet.js"),
    hashHas = __webpack_require__(/*! ./_hashHas */ "./packages/server/node_modules/lodash/_hashHas.js"),
    hashSet = __webpack_require__(/*! ./_hashSet */ "./packages/server/node_modules/lodash/_hashSet.js");

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

/***/ "./packages/server/node_modules/lodash/_ListCache.js":
/*!***********************************************************!*\
  !*** ./packages/server/node_modules/lodash/_ListCache.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var listCacheClear = __webpack_require__(/*! ./_listCacheClear */ "./packages/server/node_modules/lodash/_listCacheClear.js"),
    listCacheDelete = __webpack_require__(/*! ./_listCacheDelete */ "./packages/server/node_modules/lodash/_listCacheDelete.js"),
    listCacheGet = __webpack_require__(/*! ./_listCacheGet */ "./packages/server/node_modules/lodash/_listCacheGet.js"),
    listCacheHas = __webpack_require__(/*! ./_listCacheHas */ "./packages/server/node_modules/lodash/_listCacheHas.js"),
    listCacheSet = __webpack_require__(/*! ./_listCacheSet */ "./packages/server/node_modules/lodash/_listCacheSet.js");

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

/***/ "./packages/server/node_modules/lodash/_Map.js":
/*!*****************************************************!*\
  !*** ./packages/server/node_modules/lodash/_Map.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ "./packages/server/node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "./packages/server/node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;


/***/ }),

/***/ "./packages/server/node_modules/lodash/_MapCache.js":
/*!**********************************************************!*\
  !*** ./packages/server/node_modules/lodash/_MapCache.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var mapCacheClear = __webpack_require__(/*! ./_mapCacheClear */ "./packages/server/node_modules/lodash/_mapCacheClear.js"),
    mapCacheDelete = __webpack_require__(/*! ./_mapCacheDelete */ "./packages/server/node_modules/lodash/_mapCacheDelete.js"),
    mapCacheGet = __webpack_require__(/*! ./_mapCacheGet */ "./packages/server/node_modules/lodash/_mapCacheGet.js"),
    mapCacheHas = __webpack_require__(/*! ./_mapCacheHas */ "./packages/server/node_modules/lodash/_mapCacheHas.js"),
    mapCacheSet = __webpack_require__(/*! ./_mapCacheSet */ "./packages/server/node_modules/lodash/_mapCacheSet.js");

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

/***/ "./packages/server/node_modules/lodash/_Promise.js":
/*!*********************************************************!*\
  !*** ./packages/server/node_modules/lodash/_Promise.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ "./packages/server/node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "./packages/server/node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;


/***/ }),

/***/ "./packages/server/node_modules/lodash/_Set.js":
/*!*****************************************************!*\
  !*** ./packages/server/node_modules/lodash/_Set.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ "./packages/server/node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "./packages/server/node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;


/***/ }),

/***/ "./packages/server/node_modules/lodash/_Stack.js":
/*!*******************************************************!*\
  !*** ./packages/server/node_modules/lodash/_Stack.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ListCache = __webpack_require__(/*! ./_ListCache */ "./packages/server/node_modules/lodash/_ListCache.js"),
    stackClear = __webpack_require__(/*! ./_stackClear */ "./packages/server/node_modules/lodash/_stackClear.js"),
    stackDelete = __webpack_require__(/*! ./_stackDelete */ "./packages/server/node_modules/lodash/_stackDelete.js"),
    stackGet = __webpack_require__(/*! ./_stackGet */ "./packages/server/node_modules/lodash/_stackGet.js"),
    stackHas = __webpack_require__(/*! ./_stackHas */ "./packages/server/node_modules/lodash/_stackHas.js"),
    stackSet = __webpack_require__(/*! ./_stackSet */ "./packages/server/node_modules/lodash/_stackSet.js");

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

/***/ "./packages/server/node_modules/lodash/_Symbol.js":
/*!********************************************************!*\
  !*** ./packages/server/node_modules/lodash/_Symbol.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(/*! ./_root */ "./packages/server/node_modules/lodash/_root.js");

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),

/***/ "./packages/server/node_modules/lodash/_Uint8Array.js":
/*!************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_Uint8Array.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(/*! ./_root */ "./packages/server/node_modules/lodash/_root.js");

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;


/***/ }),

/***/ "./packages/server/node_modules/lodash/_WeakMap.js":
/*!*********************************************************!*\
  !*** ./packages/server/node_modules/lodash/_WeakMap.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ "./packages/server/node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "./packages/server/node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;


/***/ }),

/***/ "./packages/server/node_modules/lodash/_arrayEach.js":
/*!***********************************************************!*\
  !*** ./packages/server/node_modules/lodash/_arrayEach.js ***!
  \***********************************************************/
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

/***/ "./packages/server/node_modules/lodash/_arrayFilter.js":
/*!*************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_arrayFilter.js ***!
  \*************************************************************/
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

/***/ "./packages/server/node_modules/lodash/_arrayLikeKeys.js":
/*!***************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_arrayLikeKeys.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseTimes = __webpack_require__(/*! ./_baseTimes */ "./packages/server/node_modules/lodash/_baseTimes.js"),
    isArguments = __webpack_require__(/*! ./isArguments */ "./packages/server/node_modules/lodash/isArguments.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./packages/server/node_modules/lodash/isArray.js"),
    isBuffer = __webpack_require__(/*! ./isBuffer */ "./packages/server/node_modules/lodash/isBuffer.js"),
    isIndex = __webpack_require__(/*! ./_isIndex */ "./packages/server/node_modules/lodash/_isIndex.js"),
    isTypedArray = __webpack_require__(/*! ./isTypedArray */ "./packages/server/node_modules/lodash/isTypedArray.js");

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

/***/ "./packages/server/node_modules/lodash/_arrayPush.js":
/*!***********************************************************!*\
  !*** ./packages/server/node_modules/lodash/_arrayPush.js ***!
  \***********************************************************/
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

/***/ "./packages/server/node_modules/lodash/_assignValue.js":
/*!*************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_assignValue.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseAssignValue = __webpack_require__(/*! ./_baseAssignValue */ "./packages/server/node_modules/lodash/_baseAssignValue.js"),
    eq = __webpack_require__(/*! ./eq */ "./packages/server/node_modules/lodash/eq.js");

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

/***/ "./packages/server/node_modules/lodash/_assocIndexOf.js":
/*!**************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_assocIndexOf.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var eq = __webpack_require__(/*! ./eq */ "./packages/server/node_modules/lodash/eq.js");

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

/***/ "./packages/server/node_modules/lodash/_baseAssign.js":
/*!************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_baseAssign.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var copyObject = __webpack_require__(/*! ./_copyObject */ "./packages/server/node_modules/lodash/_copyObject.js"),
    keys = __webpack_require__(/*! ./keys */ "./packages/server/node_modules/lodash/keys.js");

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

/***/ "./packages/server/node_modules/lodash/_baseAssignIn.js":
/*!**************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_baseAssignIn.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var copyObject = __webpack_require__(/*! ./_copyObject */ "./packages/server/node_modules/lodash/_copyObject.js"),
    keysIn = __webpack_require__(/*! ./keysIn */ "./packages/server/node_modules/lodash/keysIn.js");

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

/***/ "./packages/server/node_modules/lodash/_baseAssignValue.js":
/*!*****************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_baseAssignValue.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var defineProperty = __webpack_require__(/*! ./_defineProperty */ "./packages/server/node_modules/lodash/_defineProperty.js");

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

/***/ "./packages/server/node_modules/lodash/_baseClone.js":
/*!***********************************************************!*\
  !*** ./packages/server/node_modules/lodash/_baseClone.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Stack = __webpack_require__(/*! ./_Stack */ "./packages/server/node_modules/lodash/_Stack.js"),
    arrayEach = __webpack_require__(/*! ./_arrayEach */ "./packages/server/node_modules/lodash/_arrayEach.js"),
    assignValue = __webpack_require__(/*! ./_assignValue */ "./packages/server/node_modules/lodash/_assignValue.js"),
    baseAssign = __webpack_require__(/*! ./_baseAssign */ "./packages/server/node_modules/lodash/_baseAssign.js"),
    baseAssignIn = __webpack_require__(/*! ./_baseAssignIn */ "./packages/server/node_modules/lodash/_baseAssignIn.js"),
    cloneBuffer = __webpack_require__(/*! ./_cloneBuffer */ "./packages/server/node_modules/lodash/_cloneBuffer.js"),
    copyArray = __webpack_require__(/*! ./_copyArray */ "./packages/server/node_modules/lodash/_copyArray.js"),
    copySymbols = __webpack_require__(/*! ./_copySymbols */ "./packages/server/node_modules/lodash/_copySymbols.js"),
    copySymbolsIn = __webpack_require__(/*! ./_copySymbolsIn */ "./packages/server/node_modules/lodash/_copySymbolsIn.js"),
    getAllKeys = __webpack_require__(/*! ./_getAllKeys */ "./packages/server/node_modules/lodash/_getAllKeys.js"),
    getAllKeysIn = __webpack_require__(/*! ./_getAllKeysIn */ "./packages/server/node_modules/lodash/_getAllKeysIn.js"),
    getTag = __webpack_require__(/*! ./_getTag */ "./packages/server/node_modules/lodash/_getTag.js"),
    initCloneArray = __webpack_require__(/*! ./_initCloneArray */ "./packages/server/node_modules/lodash/_initCloneArray.js"),
    initCloneByTag = __webpack_require__(/*! ./_initCloneByTag */ "./packages/server/node_modules/lodash/_initCloneByTag.js"),
    initCloneObject = __webpack_require__(/*! ./_initCloneObject */ "./packages/server/node_modules/lodash/_initCloneObject.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./packages/server/node_modules/lodash/isArray.js"),
    isBuffer = __webpack_require__(/*! ./isBuffer */ "./packages/server/node_modules/lodash/isBuffer.js"),
    isMap = __webpack_require__(/*! ./isMap */ "./packages/server/node_modules/lodash/isMap.js"),
    isObject = __webpack_require__(/*! ./isObject */ "./packages/server/node_modules/lodash/isObject.js"),
    isSet = __webpack_require__(/*! ./isSet */ "./packages/server/node_modules/lodash/isSet.js"),
    keys = __webpack_require__(/*! ./keys */ "./packages/server/node_modules/lodash/keys.js"),
    keysIn = __webpack_require__(/*! ./keysIn */ "./packages/server/node_modules/lodash/keysIn.js");

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

/***/ "./packages/server/node_modules/lodash/_baseCreate.js":
/*!************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_baseCreate.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(/*! ./isObject */ "./packages/server/node_modules/lodash/isObject.js");

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

/***/ "./packages/server/node_modules/lodash/_baseGetAllKeys.js":
/*!****************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_baseGetAllKeys.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayPush = __webpack_require__(/*! ./_arrayPush */ "./packages/server/node_modules/lodash/_arrayPush.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./packages/server/node_modules/lodash/isArray.js");

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

/***/ "./packages/server/node_modules/lodash/_baseGetTag.js":
/*!************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_baseGetTag.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(/*! ./_Symbol */ "./packages/server/node_modules/lodash/_Symbol.js"),
    getRawTag = __webpack_require__(/*! ./_getRawTag */ "./packages/server/node_modules/lodash/_getRawTag.js"),
    objectToString = __webpack_require__(/*! ./_objectToString */ "./packages/server/node_modules/lodash/_objectToString.js");

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

/***/ "./packages/server/node_modules/lodash/_baseIsArguments.js":
/*!*****************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_baseIsArguments.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./packages/server/node_modules/lodash/_baseGetTag.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./packages/server/node_modules/lodash/isObjectLike.js");

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

/***/ "./packages/server/node_modules/lodash/_baseIsMap.js":
/*!***********************************************************!*\
  !*** ./packages/server/node_modules/lodash/_baseIsMap.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getTag = __webpack_require__(/*! ./_getTag */ "./packages/server/node_modules/lodash/_getTag.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./packages/server/node_modules/lodash/isObjectLike.js");

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

/***/ "./packages/server/node_modules/lodash/_baseIsNative.js":
/*!**************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_baseIsNative.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isFunction = __webpack_require__(/*! ./isFunction */ "./packages/server/node_modules/lodash/isFunction.js"),
    isMasked = __webpack_require__(/*! ./_isMasked */ "./packages/server/node_modules/lodash/_isMasked.js"),
    isObject = __webpack_require__(/*! ./isObject */ "./packages/server/node_modules/lodash/isObject.js"),
    toSource = __webpack_require__(/*! ./_toSource */ "./packages/server/node_modules/lodash/_toSource.js");

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

/***/ "./packages/server/node_modules/lodash/_baseIsSet.js":
/*!***********************************************************!*\
  !*** ./packages/server/node_modules/lodash/_baseIsSet.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getTag = __webpack_require__(/*! ./_getTag */ "./packages/server/node_modules/lodash/_getTag.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./packages/server/node_modules/lodash/isObjectLike.js");

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

/***/ "./packages/server/node_modules/lodash/_baseIsTypedArray.js":
/*!******************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_baseIsTypedArray.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./packages/server/node_modules/lodash/_baseGetTag.js"),
    isLength = __webpack_require__(/*! ./isLength */ "./packages/server/node_modules/lodash/isLength.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./packages/server/node_modules/lodash/isObjectLike.js");

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

/***/ "./packages/server/node_modules/lodash/_baseKeys.js":
/*!**********************************************************!*\
  !*** ./packages/server/node_modules/lodash/_baseKeys.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isPrototype = __webpack_require__(/*! ./_isPrototype */ "./packages/server/node_modules/lodash/_isPrototype.js"),
    nativeKeys = __webpack_require__(/*! ./_nativeKeys */ "./packages/server/node_modules/lodash/_nativeKeys.js");

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

/***/ "./packages/server/node_modules/lodash/_baseKeysIn.js":
/*!************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_baseKeysIn.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(/*! ./isObject */ "./packages/server/node_modules/lodash/isObject.js"),
    isPrototype = __webpack_require__(/*! ./_isPrototype */ "./packages/server/node_modules/lodash/_isPrototype.js"),
    nativeKeysIn = __webpack_require__(/*! ./_nativeKeysIn */ "./packages/server/node_modules/lodash/_nativeKeysIn.js");

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

/***/ "./packages/server/node_modules/lodash/_baseTimes.js":
/*!***********************************************************!*\
  !*** ./packages/server/node_modules/lodash/_baseTimes.js ***!
  \***********************************************************/
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

/***/ "./packages/server/node_modules/lodash/_baseUnary.js":
/*!***********************************************************!*\
  !*** ./packages/server/node_modules/lodash/_baseUnary.js ***!
  \***********************************************************/
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

/***/ "./packages/server/node_modules/lodash/_cloneArrayBuffer.js":
/*!******************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_cloneArrayBuffer.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Uint8Array = __webpack_require__(/*! ./_Uint8Array */ "./packages/server/node_modules/lodash/_Uint8Array.js");

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

/***/ "./packages/server/node_modules/lodash/_cloneBuffer.js":
/*!*************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_cloneBuffer.js ***!
  \*************************************************************/
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
var root = __webpack_require__(/*! ./_root */ "./packages/server/node_modules/lodash/_root.js");

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

/***/ "./packages/server/node_modules/lodash/_cloneDataView.js":
/*!***************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_cloneDataView.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var cloneArrayBuffer = __webpack_require__(/*! ./_cloneArrayBuffer */ "./packages/server/node_modules/lodash/_cloneArrayBuffer.js");

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

/***/ "./packages/server/node_modules/lodash/_cloneRegExp.js":
/*!*************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_cloneRegExp.js ***!
  \*************************************************************/
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

/***/ "./packages/server/node_modules/lodash/_cloneSymbol.js":
/*!*************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_cloneSymbol.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(/*! ./_Symbol */ "./packages/server/node_modules/lodash/_Symbol.js");

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

/***/ "./packages/server/node_modules/lodash/_cloneTypedArray.js":
/*!*****************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_cloneTypedArray.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var cloneArrayBuffer = __webpack_require__(/*! ./_cloneArrayBuffer */ "./packages/server/node_modules/lodash/_cloneArrayBuffer.js");

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

/***/ "./packages/server/node_modules/lodash/_copyArray.js":
/*!***********************************************************!*\
  !*** ./packages/server/node_modules/lodash/_copyArray.js ***!
  \***********************************************************/
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

/***/ "./packages/server/node_modules/lodash/_copyObject.js":
/*!************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_copyObject.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assignValue = __webpack_require__(/*! ./_assignValue */ "./packages/server/node_modules/lodash/_assignValue.js"),
    baseAssignValue = __webpack_require__(/*! ./_baseAssignValue */ "./packages/server/node_modules/lodash/_baseAssignValue.js");

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

/***/ "./packages/server/node_modules/lodash/_copySymbols.js":
/*!*************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_copySymbols.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var copyObject = __webpack_require__(/*! ./_copyObject */ "./packages/server/node_modules/lodash/_copyObject.js"),
    getSymbols = __webpack_require__(/*! ./_getSymbols */ "./packages/server/node_modules/lodash/_getSymbols.js");

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

/***/ "./packages/server/node_modules/lodash/_copySymbolsIn.js":
/*!***************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_copySymbolsIn.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var copyObject = __webpack_require__(/*! ./_copyObject */ "./packages/server/node_modules/lodash/_copyObject.js"),
    getSymbolsIn = __webpack_require__(/*! ./_getSymbolsIn */ "./packages/server/node_modules/lodash/_getSymbolsIn.js");

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

/***/ "./packages/server/node_modules/lodash/_coreJsData.js":
/*!************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_coreJsData.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(/*! ./_root */ "./packages/server/node_modules/lodash/_root.js");

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;


/***/ }),

/***/ "./packages/server/node_modules/lodash/_defineProperty.js":
/*!****************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_defineProperty.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ "./packages/server/node_modules/lodash/_getNative.js");

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;


/***/ }),

/***/ "./packages/server/node_modules/lodash/_freeGlobal.js":
/*!************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_freeGlobal.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

module.exports = freeGlobal;


/***/ }),

/***/ "./packages/server/node_modules/lodash/_getAllKeys.js":
/*!************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_getAllKeys.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetAllKeys = __webpack_require__(/*! ./_baseGetAllKeys */ "./packages/server/node_modules/lodash/_baseGetAllKeys.js"),
    getSymbols = __webpack_require__(/*! ./_getSymbols */ "./packages/server/node_modules/lodash/_getSymbols.js"),
    keys = __webpack_require__(/*! ./keys */ "./packages/server/node_modules/lodash/keys.js");

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

/***/ "./packages/server/node_modules/lodash/_getAllKeysIn.js":
/*!**************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_getAllKeysIn.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetAllKeys = __webpack_require__(/*! ./_baseGetAllKeys */ "./packages/server/node_modules/lodash/_baseGetAllKeys.js"),
    getSymbolsIn = __webpack_require__(/*! ./_getSymbolsIn */ "./packages/server/node_modules/lodash/_getSymbolsIn.js"),
    keysIn = __webpack_require__(/*! ./keysIn */ "./packages/server/node_modules/lodash/keysIn.js");

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

/***/ "./packages/server/node_modules/lodash/_getMapData.js":
/*!************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_getMapData.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isKeyable = __webpack_require__(/*! ./_isKeyable */ "./packages/server/node_modules/lodash/_isKeyable.js");

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

/***/ "./packages/server/node_modules/lodash/_getNative.js":
/*!***********************************************************!*\
  !*** ./packages/server/node_modules/lodash/_getNative.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsNative = __webpack_require__(/*! ./_baseIsNative */ "./packages/server/node_modules/lodash/_baseIsNative.js"),
    getValue = __webpack_require__(/*! ./_getValue */ "./packages/server/node_modules/lodash/_getValue.js");

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

/***/ "./packages/server/node_modules/lodash/_getPrototype.js":
/*!**************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_getPrototype.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var overArg = __webpack_require__(/*! ./_overArg */ "./packages/server/node_modules/lodash/_overArg.js");

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;


/***/ }),

/***/ "./packages/server/node_modules/lodash/_getRawTag.js":
/*!***********************************************************!*\
  !*** ./packages/server/node_modules/lodash/_getRawTag.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(/*! ./_Symbol */ "./packages/server/node_modules/lodash/_Symbol.js");

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

/***/ "./packages/server/node_modules/lodash/_getSymbols.js":
/*!************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_getSymbols.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayFilter = __webpack_require__(/*! ./_arrayFilter */ "./packages/server/node_modules/lodash/_arrayFilter.js"),
    stubArray = __webpack_require__(/*! ./stubArray */ "./packages/server/node_modules/lodash/stubArray.js");

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

/***/ "./packages/server/node_modules/lodash/_getSymbolsIn.js":
/*!**************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_getSymbolsIn.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayPush = __webpack_require__(/*! ./_arrayPush */ "./packages/server/node_modules/lodash/_arrayPush.js"),
    getPrototype = __webpack_require__(/*! ./_getPrototype */ "./packages/server/node_modules/lodash/_getPrototype.js"),
    getSymbols = __webpack_require__(/*! ./_getSymbols */ "./packages/server/node_modules/lodash/_getSymbols.js"),
    stubArray = __webpack_require__(/*! ./stubArray */ "./packages/server/node_modules/lodash/stubArray.js");

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

/***/ "./packages/server/node_modules/lodash/_getTag.js":
/*!********************************************************!*\
  !*** ./packages/server/node_modules/lodash/_getTag.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var DataView = __webpack_require__(/*! ./_DataView */ "./packages/server/node_modules/lodash/_DataView.js"),
    Map = __webpack_require__(/*! ./_Map */ "./packages/server/node_modules/lodash/_Map.js"),
    Promise = __webpack_require__(/*! ./_Promise */ "./packages/server/node_modules/lodash/_Promise.js"),
    Set = __webpack_require__(/*! ./_Set */ "./packages/server/node_modules/lodash/_Set.js"),
    WeakMap = __webpack_require__(/*! ./_WeakMap */ "./packages/server/node_modules/lodash/_WeakMap.js"),
    baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./packages/server/node_modules/lodash/_baseGetTag.js"),
    toSource = __webpack_require__(/*! ./_toSource */ "./packages/server/node_modules/lodash/_toSource.js");

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

/***/ "./packages/server/node_modules/lodash/_getValue.js":
/*!**********************************************************!*\
  !*** ./packages/server/node_modules/lodash/_getValue.js ***!
  \**********************************************************/
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

/***/ "./packages/server/node_modules/lodash/_hashClear.js":
/*!***********************************************************!*\
  !*** ./packages/server/node_modules/lodash/_hashClear.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "./packages/server/node_modules/lodash/_nativeCreate.js");

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

/***/ "./packages/server/node_modules/lodash/_hashDelete.js":
/*!************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_hashDelete.js ***!
  \************************************************************/
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

/***/ "./packages/server/node_modules/lodash/_hashGet.js":
/*!*********************************************************!*\
  !*** ./packages/server/node_modules/lodash/_hashGet.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "./packages/server/node_modules/lodash/_nativeCreate.js");

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

/***/ "./packages/server/node_modules/lodash/_hashHas.js":
/*!*********************************************************!*\
  !*** ./packages/server/node_modules/lodash/_hashHas.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "./packages/server/node_modules/lodash/_nativeCreate.js");

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

/***/ "./packages/server/node_modules/lodash/_hashSet.js":
/*!*********************************************************!*\
  !*** ./packages/server/node_modules/lodash/_hashSet.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "./packages/server/node_modules/lodash/_nativeCreate.js");

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

/***/ "./packages/server/node_modules/lodash/_initCloneArray.js":
/*!****************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_initCloneArray.js ***!
  \****************************************************************/
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

/***/ "./packages/server/node_modules/lodash/_initCloneByTag.js":
/*!****************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_initCloneByTag.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var cloneArrayBuffer = __webpack_require__(/*! ./_cloneArrayBuffer */ "./packages/server/node_modules/lodash/_cloneArrayBuffer.js"),
    cloneDataView = __webpack_require__(/*! ./_cloneDataView */ "./packages/server/node_modules/lodash/_cloneDataView.js"),
    cloneRegExp = __webpack_require__(/*! ./_cloneRegExp */ "./packages/server/node_modules/lodash/_cloneRegExp.js"),
    cloneSymbol = __webpack_require__(/*! ./_cloneSymbol */ "./packages/server/node_modules/lodash/_cloneSymbol.js"),
    cloneTypedArray = __webpack_require__(/*! ./_cloneTypedArray */ "./packages/server/node_modules/lodash/_cloneTypedArray.js");

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

/***/ "./packages/server/node_modules/lodash/_initCloneObject.js":
/*!*****************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_initCloneObject.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseCreate = __webpack_require__(/*! ./_baseCreate */ "./packages/server/node_modules/lodash/_baseCreate.js"),
    getPrototype = __webpack_require__(/*! ./_getPrototype */ "./packages/server/node_modules/lodash/_getPrototype.js"),
    isPrototype = __webpack_require__(/*! ./_isPrototype */ "./packages/server/node_modules/lodash/_isPrototype.js");

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

/***/ "./packages/server/node_modules/lodash/_isIndex.js":
/*!*********************************************************!*\
  !*** ./packages/server/node_modules/lodash/_isIndex.js ***!
  \*********************************************************/
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

/***/ "./packages/server/node_modules/lodash/_isKeyable.js":
/*!***********************************************************!*\
  !*** ./packages/server/node_modules/lodash/_isKeyable.js ***!
  \***********************************************************/
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

/***/ "./packages/server/node_modules/lodash/_isMasked.js":
/*!**********************************************************!*\
  !*** ./packages/server/node_modules/lodash/_isMasked.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var coreJsData = __webpack_require__(/*! ./_coreJsData */ "./packages/server/node_modules/lodash/_coreJsData.js");

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

/***/ "./packages/server/node_modules/lodash/_isPrototype.js":
/*!*************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_isPrototype.js ***!
  \*************************************************************/
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

/***/ "./packages/server/node_modules/lodash/_listCacheClear.js":
/*!****************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_listCacheClear.js ***!
  \****************************************************************/
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

/***/ "./packages/server/node_modules/lodash/_listCacheDelete.js":
/*!*****************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_listCacheDelete.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "./packages/server/node_modules/lodash/_assocIndexOf.js");

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

/***/ "./packages/server/node_modules/lodash/_listCacheGet.js":
/*!**************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_listCacheGet.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "./packages/server/node_modules/lodash/_assocIndexOf.js");

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

/***/ "./packages/server/node_modules/lodash/_listCacheHas.js":
/*!**************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_listCacheHas.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "./packages/server/node_modules/lodash/_assocIndexOf.js");

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

/***/ "./packages/server/node_modules/lodash/_listCacheSet.js":
/*!**************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_listCacheSet.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "./packages/server/node_modules/lodash/_assocIndexOf.js");

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

/***/ "./packages/server/node_modules/lodash/_mapCacheClear.js":
/*!***************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_mapCacheClear.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Hash = __webpack_require__(/*! ./_Hash */ "./packages/server/node_modules/lodash/_Hash.js"),
    ListCache = __webpack_require__(/*! ./_ListCache */ "./packages/server/node_modules/lodash/_ListCache.js"),
    Map = __webpack_require__(/*! ./_Map */ "./packages/server/node_modules/lodash/_Map.js");

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

/***/ "./packages/server/node_modules/lodash/_mapCacheDelete.js":
/*!****************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_mapCacheDelete.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(/*! ./_getMapData */ "./packages/server/node_modules/lodash/_getMapData.js");

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

/***/ "./packages/server/node_modules/lodash/_mapCacheGet.js":
/*!*************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_mapCacheGet.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(/*! ./_getMapData */ "./packages/server/node_modules/lodash/_getMapData.js");

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

/***/ "./packages/server/node_modules/lodash/_mapCacheHas.js":
/*!*************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_mapCacheHas.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(/*! ./_getMapData */ "./packages/server/node_modules/lodash/_getMapData.js");

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

/***/ "./packages/server/node_modules/lodash/_mapCacheSet.js":
/*!*************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_mapCacheSet.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(/*! ./_getMapData */ "./packages/server/node_modules/lodash/_getMapData.js");

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

/***/ "./packages/server/node_modules/lodash/_nativeCreate.js":
/*!**************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_nativeCreate.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ "./packages/server/node_modules/lodash/_getNative.js");

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;


/***/ }),

/***/ "./packages/server/node_modules/lodash/_nativeKeys.js":
/*!************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_nativeKeys.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var overArg = __webpack_require__(/*! ./_overArg */ "./packages/server/node_modules/lodash/_overArg.js");

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;


/***/ }),

/***/ "./packages/server/node_modules/lodash/_nativeKeysIn.js":
/*!**************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_nativeKeysIn.js ***!
  \**************************************************************/
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

/***/ "./packages/server/node_modules/lodash/_nodeUtil.js":
/*!**********************************************************!*\
  !*** ./packages/server/node_modules/lodash/_nodeUtil.js ***!
  \**********************************************************/
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
var freeGlobal = __webpack_require__(/*! ./_freeGlobal */ "./packages/server/node_modules/lodash/_freeGlobal.js");

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

/***/ "./packages/server/node_modules/lodash/_objectToString.js":
/*!****************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_objectToString.js ***!
  \****************************************************************/
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

/***/ "./packages/server/node_modules/lodash/_overArg.js":
/*!*********************************************************!*\
  !*** ./packages/server/node_modules/lodash/_overArg.js ***!
  \*********************************************************/
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

/***/ "./packages/server/node_modules/lodash/_root.js":
/*!******************************************************!*\
  !*** ./packages/server/node_modules/lodash/_root.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var freeGlobal = __webpack_require__(/*! ./_freeGlobal */ "./packages/server/node_modules/lodash/_freeGlobal.js");

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),

/***/ "./packages/server/node_modules/lodash/_stackClear.js":
/*!************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_stackClear.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ListCache = __webpack_require__(/*! ./_ListCache */ "./packages/server/node_modules/lodash/_ListCache.js");

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

/***/ "./packages/server/node_modules/lodash/_stackDelete.js":
/*!*************************************************************!*\
  !*** ./packages/server/node_modules/lodash/_stackDelete.js ***!
  \*************************************************************/
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

/***/ "./packages/server/node_modules/lodash/_stackGet.js":
/*!**********************************************************!*\
  !*** ./packages/server/node_modules/lodash/_stackGet.js ***!
  \**********************************************************/
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

/***/ "./packages/server/node_modules/lodash/_stackHas.js":
/*!**********************************************************!*\
  !*** ./packages/server/node_modules/lodash/_stackHas.js ***!
  \**********************************************************/
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

/***/ "./packages/server/node_modules/lodash/_stackSet.js":
/*!**********************************************************!*\
  !*** ./packages/server/node_modules/lodash/_stackSet.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ListCache = __webpack_require__(/*! ./_ListCache */ "./packages/server/node_modules/lodash/_ListCache.js"),
    Map = __webpack_require__(/*! ./_Map */ "./packages/server/node_modules/lodash/_Map.js"),
    MapCache = __webpack_require__(/*! ./_MapCache */ "./packages/server/node_modules/lodash/_MapCache.js");

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

/***/ "./packages/server/node_modules/lodash/_toSource.js":
/*!**********************************************************!*\
  !*** ./packages/server/node_modules/lodash/_toSource.js ***!
  \**********************************************************/
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

/***/ "./packages/server/node_modules/lodash/cloneDeep.js":
/*!**********************************************************!*\
  !*** ./packages/server/node_modules/lodash/cloneDeep.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseClone = __webpack_require__(/*! ./_baseClone */ "./packages/server/node_modules/lodash/_baseClone.js");

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

/***/ "./packages/server/node_modules/lodash/eq.js":
/*!***************************************************!*\
  !*** ./packages/server/node_modules/lodash/eq.js ***!
  \***************************************************/
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

/***/ "./packages/server/node_modules/lodash/isArguments.js":
/*!************************************************************!*\
  !*** ./packages/server/node_modules/lodash/isArguments.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsArguments = __webpack_require__(/*! ./_baseIsArguments */ "./packages/server/node_modules/lodash/_baseIsArguments.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./packages/server/node_modules/lodash/isObjectLike.js");

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

/***/ "./packages/server/node_modules/lodash/isArray.js":
/*!********************************************************!*\
  !*** ./packages/server/node_modules/lodash/isArray.js ***!
  \********************************************************/
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

/***/ "./packages/server/node_modules/lodash/isArrayLike.js":
/*!************************************************************!*\
  !*** ./packages/server/node_modules/lodash/isArrayLike.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isFunction = __webpack_require__(/*! ./isFunction */ "./packages/server/node_modules/lodash/isFunction.js"),
    isLength = __webpack_require__(/*! ./isLength */ "./packages/server/node_modules/lodash/isLength.js");

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

/***/ "./packages/server/node_modules/lodash/isBuffer.js":
/*!*********************************************************!*\
  !*** ./packages/server/node_modules/lodash/isBuffer.js ***!
  \*********************************************************/
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
var root = __webpack_require__(/*! ./_root */ "./packages/server/node_modules/lodash/_root.js"),
    stubFalse = __webpack_require__(/*! ./stubFalse */ "./packages/server/node_modules/lodash/stubFalse.js");

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

/***/ "./packages/server/node_modules/lodash/isFunction.js":
/*!***********************************************************!*\
  !*** ./packages/server/node_modules/lodash/isFunction.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./packages/server/node_modules/lodash/_baseGetTag.js"),
    isObject = __webpack_require__(/*! ./isObject */ "./packages/server/node_modules/lodash/isObject.js");

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

/***/ "./packages/server/node_modules/lodash/isLength.js":
/*!*********************************************************!*\
  !*** ./packages/server/node_modules/lodash/isLength.js ***!
  \*********************************************************/
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

/***/ "./packages/server/node_modules/lodash/isMap.js":
/*!******************************************************!*\
  !*** ./packages/server/node_modules/lodash/isMap.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsMap = __webpack_require__(/*! ./_baseIsMap */ "./packages/server/node_modules/lodash/_baseIsMap.js"),
    baseUnary = __webpack_require__(/*! ./_baseUnary */ "./packages/server/node_modules/lodash/_baseUnary.js"),
    nodeUtil = __webpack_require__(/*! ./_nodeUtil */ "./packages/server/node_modules/lodash/_nodeUtil.js");

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

/***/ "./packages/server/node_modules/lodash/isObject.js":
/*!*********************************************************!*\
  !*** ./packages/server/node_modules/lodash/isObject.js ***!
  \*********************************************************/
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

/***/ "./packages/server/node_modules/lodash/isObjectLike.js":
/*!*************************************************************!*\
  !*** ./packages/server/node_modules/lodash/isObjectLike.js ***!
  \*************************************************************/
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

/***/ "./packages/server/node_modules/lodash/isSet.js":
/*!******************************************************!*\
  !*** ./packages/server/node_modules/lodash/isSet.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsSet = __webpack_require__(/*! ./_baseIsSet */ "./packages/server/node_modules/lodash/_baseIsSet.js"),
    baseUnary = __webpack_require__(/*! ./_baseUnary */ "./packages/server/node_modules/lodash/_baseUnary.js"),
    nodeUtil = __webpack_require__(/*! ./_nodeUtil */ "./packages/server/node_modules/lodash/_nodeUtil.js");

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

/***/ "./packages/server/node_modules/lodash/isTypedArray.js":
/*!*************************************************************!*\
  !*** ./packages/server/node_modules/lodash/isTypedArray.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsTypedArray = __webpack_require__(/*! ./_baseIsTypedArray */ "./packages/server/node_modules/lodash/_baseIsTypedArray.js"),
    baseUnary = __webpack_require__(/*! ./_baseUnary */ "./packages/server/node_modules/lodash/_baseUnary.js"),
    nodeUtil = __webpack_require__(/*! ./_nodeUtil */ "./packages/server/node_modules/lodash/_nodeUtil.js");

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

/***/ "./packages/server/node_modules/lodash/keys.js":
/*!*****************************************************!*\
  !*** ./packages/server/node_modules/lodash/keys.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayLikeKeys = __webpack_require__(/*! ./_arrayLikeKeys */ "./packages/server/node_modules/lodash/_arrayLikeKeys.js"),
    baseKeys = __webpack_require__(/*! ./_baseKeys */ "./packages/server/node_modules/lodash/_baseKeys.js"),
    isArrayLike = __webpack_require__(/*! ./isArrayLike */ "./packages/server/node_modules/lodash/isArrayLike.js");

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

/***/ "./packages/server/node_modules/lodash/keysIn.js":
/*!*******************************************************!*\
  !*** ./packages/server/node_modules/lodash/keysIn.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayLikeKeys = __webpack_require__(/*! ./_arrayLikeKeys */ "./packages/server/node_modules/lodash/_arrayLikeKeys.js"),
    baseKeysIn = __webpack_require__(/*! ./_baseKeysIn */ "./packages/server/node_modules/lodash/_baseKeysIn.js"),
    isArrayLike = __webpack_require__(/*! ./isArrayLike */ "./packages/server/node_modules/lodash/isArrayLike.js");

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

/***/ "./packages/server/node_modules/lodash/stubArray.js":
/*!**********************************************************!*\
  !*** ./packages/server/node_modules/lodash/stubArray.js ***!
  \**********************************************************/
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

/***/ "./packages/server/node_modules/lodash/stubFalse.js":
/*!**********************************************************!*\
  !*** ./packages/server/node_modules/lodash/stubFalse.js ***!
  \**********************************************************/
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

/***/ "./packages/server/node_modules/md5/md5.js":
/*!*************************************************!*\
  !*** ./packages/server/node_modules/md5/md5.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

(function(){
  var crypt = __webpack_require__(/*! crypt */ "./packages/server/node_modules/crypt/crypt.js"),
      utf8 = __webpack_require__(/*! charenc */ "./packages/server/node_modules/charenc/charenc.js").utf8,
      isBuffer = __webpack_require__(/*! is-buffer */ "./packages/server/node_modules/is-buffer/index.js"),
      bin = __webpack_require__(/*! charenc */ "./packages/server/node_modules/charenc/charenc.js").bin,

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

/***/ "./packages/server/node_modules/ms/index.js":
/*!**************************************************!*\
  !*** ./packages/server/node_modules/ms/index.js ***!
  \**************************************************/
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

/***/ "./packages/server/node_modules/nanoid/index.dev.js":
/*!**********************************************************!*\
  !*** ./packages/server/node_modules/nanoid/index.dev.js ***!
  \**********************************************************/
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
/* harmony import */ var _url_alphabet_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./url-alphabet/index.js */ "./packages/server/node_modules/nanoid/url-alphabet/index.js");
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

/***/ "./packages/server/node_modules/nanoid/url-alphabet/index.js":
/*!*******************************************************************!*\
  !*** ./packages/server/node_modules/nanoid/url-alphabet/index.js ***!
  \*******************************************************************/
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
/******/ 	return __webpack_require__("./packages/server/lib/index.js");
/******/ })()
;
//# sourceMappingURL=feathersjs-offline-server.js.map