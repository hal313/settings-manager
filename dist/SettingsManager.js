(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.SettingsManager = mod.exports;
  }
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.isFunction = isFunction;
  _exports.isObject = isObject;
  _exports.isArray = isArray;
  _exports.merge = merge;
  _exports.execute = execute;
  _exports.executeAsync = executeAsync;
  _exports.SettingsManager = _exports.InMemoryStore = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  /**
   * Determines if a value is a function.
   *
   * @param {*} candidate the candidate to test
   * @returns {boolean} true, if candidate is a Function
   */
  function isFunction(candidate) {
    return 'function' === typeof candidate;
  }
  /**
   * Determines if a value is an object.
   *
   * @param {*} candidate the candidate to test
   * @returns {boolean} true, if candidate is an object
   */


  function isObject(candidate) {
    return null !== candidate && 'object' === _typeof(candidate) && !isArray(candidate);
  }
  /**
   * Determines if a value is an array.
   *
   * @param {*} candidate the candidate to test
   * @returns {boolean} true, if candidate is an array
   */


  function isArray(candidate) {
    return Array.isArray(candidate);
  }
  /**
   * Merges two objects; members of the second object take precedence over the first object.
   *
   * @param {Object} target an object to merge to
   * @returns {Object} the target object, populated with the source object's members
   */


  function merge(target, source) {
    // Merge algorithm adapted from:
    // From (http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically)
    var array = isArray(source),
        dest = array && [] || {};

    if (array) {
      target = target || [];
      dest = dest.concat(target);
      source.forEach(function onItem(e, i) {
        if ('undefined' === typeof dest[i]) {
          dest[i] = e;
        } else if ('object' === _typeof(e)) {
          dest[i] = merge(target[i], e);
        } else {
          if (target.indexOf(e) === -1) {
            dest.push(e);
          }
        }
      });
    } else {
      if (isObject(target)) {
        Object.keys(target || {}).forEach(function (key) {
          dest[key] = target[key];
        });
      }

      Object.keys(source || {}).forEach(function (key) {
        if (!isObject(source[key]) || !source[key]) {
          dest[key] = source[key];
        } else {
          if (!target[key]) {
            dest[key] = source[key];
          } else {
            dest[key] = merge(target[key], source[key]);
          }
        }
      });
    }

    return dest;
  }
  /**
   * Executes a function.
   *
   * @param {Function} fn the function to execute
   * @param {*[]} args an array of arguments to execute the function with
   * @param {Object} [context] the optional context
   * @returns {*} the return value of the function execution, or null if no function is provided
   */


  function execute(fn, args, context) {
    if (isFunction(fn)) {
      return fn.apply(context || {}, args);
    }

    return null;
  }
  /**
   * Executes a function asynchronously.
   *
   * @param {Function} fn the function to execute
   * @param {*[]} args an array of arguments to execute the function with
   * @param {Object} [context] the optional context
   */


  function executeAsync(fn, args, context) {
    if (isFunction(fn)) {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          try {
            resolve(fn.apply(context || {}, args));
          } catch (error) {
            reject(error);
          }
        });
      });
    }

    return null;
  }
  /**
   * A store implementation in memory.
   */


  var InMemoryStore =
  /*#__PURE__*/
  function () {
    //this.settings = {};

    /**
     * Creates an instance.
     */
    function InMemoryStore() {
      _classCallCheck(this, InMemoryStore);

      this.settings = {};
    }
    /**
     * Loads values.
     *
     * @param {Function} successCallback the callback invoked on success (with parameter {})
     */


    _createClass(InMemoryStore, [{
      key: "load",
      value: function load(successCallback) {
        executeAsync(successCallback, [merge({}, this.settings)]);
      }
    }, {
      key: "save",

      /**
       * Saves values.
       *
       * @param {Object} settings the settings to save
       * @param {Function} successCallback the success callback to invoke on success
       */
      value: function save(settings, successCallback) {
        // Assign the settings
        this.settings = merge(this.settings, settings); // Invoke the callback

        executeAsync(successCallback, [merge({}, this.settings)]);
      }
    }, {
      key: "clear",

      /**
       * Clears values.
       *
       * @param {Function} successCallback the success callback to invoke on success
       */
      value: function clear(successCallback) {
        this.settings = {};
        executeAsync(successCallback, [{}]);
      }
    }]);

    return InMemoryStore;
  }();

  _exports.InMemoryStore = InMemoryStore;
  ;
  /**
   * Implementation for SettingsManager, a class for storing settings.
   *
   * @param {Object} [backingStore] optional backing store to wrap
   */

  var SettingsManager =
  /*#__PURE__*/
  function () {
    /**
     * Creates a SettingsManager instance backed by an optional store.
     *
     * @param {Store} [backingStore] optional store implementation to use
     */
    function SettingsManager(backingStore) {
      _classCallCheck(this, SettingsManager);

      this.backingStore = backingStore || new InMemoryStore();
    }
    /**
     * Loads values.
     *
     * @param {Function} [successCallback] the callback invoked on success (invoked with the settings)
     * @param {Function} [errorCallback] the error callback, invoked on failure
     */


    _createClass(SettingsManager, [{
      key: "load",
      value: function load(successCallback, errorCallback) {
        this.backingStore.load(function onLoad(settings) {
          execute(successCallback, [settings], this.backingStore);
        }, errorCallback);
      }
    }, {
      key: "save",

      /**
       * Saves values.
       *
       * @param {Object} settings the settings to save
       * @param {Function} [successCallback] the callback invoked on success
       * @param {Function} [errorCallback] the error callback, invoked on failure
       */
      value: function save(settings, successCallback, errorCallback) {
        if (!settings) {
          executeAsync(successCallback, [{}]);
        } else if (isObject(settings)) {
          execute(this.backingStore.save, [settings, successCallback, errorCallback], this.backingStore);
        } else {
          executeAsync(errorCallback, ['"settings" is not an object']);
        }
      }
    }, {
      key: "clear",

      /**
       * Clears values.
       *
       * @param {Function} successCallback the success callback to invoke on success
       * @param {Function} [errorCallback] the error callback, invoked on failure
       */
      value: function clear(successCallback, errorCallback) {
        executeAsync(this.backingStore.clear, [successCallback, errorCallback], this.backingStore);
      }
    }]);

    return SettingsManager;
  }();

  _exports.SettingsManager = SettingsManager;
});