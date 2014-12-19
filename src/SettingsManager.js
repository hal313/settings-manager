// Build User: ${build.user}
// Version: ${build.version}
// Build Date: ${build.date}

(function(root, factory) {
    'use strict';

    // Try to define a console object
    (function(){
        try {
            if (!console && ('undefined' !== typeof window)) {
                // Define the console if it does not exist
                if (!window.console) {
                    window.console = {};
                }

                // Union of Chrome, FF, IE, and Safari console methods
                var consoleFunctions = [
                    'log', 'info', 'warn', 'error', 'debug', 'trace', 'dir', 'group',
                    'groupCollapsed', 'groupEnd', 'time', 'timeEnd', 'profile', 'profileEnd',
                    'dirxml', 'assert', 'count', 'markTimeline', 'timeStamp', 'clear'
                ];
                // Define undefined methods as no-ops to prevent errors
                for (var i = 0; i < consoleFunctions.length; i++) {
                    if (!window.console[consoleFunctions[i]]) {
                        window.console[consoleFunctions[i]] = function() {};
                    }
                }
            }
        } catch(error) {
            // Not much to do if there is no console
        }

    })();

    // Determine the module system (if any)
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(factory);
    } else {
        // Node
        if (typeof exports !== 'undefined') {
            module.exports = factory();
        } else {
            // None
            root.SettingsManager = factory();
        }
    }

})(this, function() {
    'use strict';

    var _isFunction = function(func) {
        return func && 'function' === typeof func;
    };

    var InMemoryStore = function() {

        var _settings = {};

        var _merge = function(object1, object2) {
            // TODO: Merge (http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically)

            var array = Array.isArray(object2);
            var dst = array && [] || {};

            if (array) {
                object1 = object1 || [];
                dst = dst.concat(object1);
                object2.forEach(function(e, i) {
                    if (typeof dst[i] === 'undefined') {
                        dst[i] = e;
                    } else if (typeof e === 'object') {
                        dst[i] = _merge(object1[i], e);
                    } else {
                        if (object1.indexOf(e) === -1) {
                            dst.push(e);
                        }
                    }
                });
            } else {
                if (object1 && typeof object1 === 'object') {
                    Object.keys(object1).forEach(function (key) {
                        dst[key] = object1[key];
                    });
                }
                Object.keys(object2).forEach(function (key) {
                    if (typeof object2[key] !== 'object' || !object2[key]) {
                        dst[key] = object2[key];
                    }
                    else {
                        if (!object1[key]) {
                            dst[key] = object2[key];
                        } else {
                            dst[key] = _merge(object1[key], object2[key]);
                        }
                    }
                });
            }

            return dst;
        };

        var _load = function(successCallback) {
            if (_isFunction(successCallback)) {
                // TODO: Use {successCallback.call(null, _settings) instead?
                setTimeout(function() {successCallback.call(null, _settings);}, 0);
            }
        };

        var _save = function(settings, successCallback) {
            _settings = _merge(_settings, settings);

            if (_isFunction(successCallback)) {
                setTimeout(function() {successCallback.call(null);}, 0);
            }
        };

        var _clear = function(successCallback) {
            _settings = {};

            if (_isFunction(successCallback)) {
                setTimeout(function() {successCallback.call(null);}, 0);
            }
        };

        return {
            load: _load,
            save: _save,
            clear: _clear
        };
    };

    var SettingsManager = function(backingStore) {

        if (!(this instanceof SettingsManager)) {
            return new SettingsManager(backingStore);
        }

        var _backingStore = backingStore || new InMemoryStore();

        var _load = function(successCallback, errorCallback) {
            _backingStore.load(function(settings) {
                if (_isFunction(successCallback)) {
                    setTimeout(function() {successCallback.call(null, settings);}, 0);
                }
            }, errorCallback);
        };

        var _save = function(settings, successCallback, errorCallback) {
            if (!settings) {
                if (_isFunction(successCallback)) {
                    setTimeout(function() {successCallback.call(null);}, 0);
                }
            } else if (settings && 'object' === typeof settings && !Array.isArray(settings)) {
                _backingStore.save(settings, successCallback, errorCallback);
            } else {
                if (_isFunction(errorCallback)) {
                    setTimeout(function() {errorCallback.call(null);}, 0);
                }
            }
        };

        var _clear = function(successCallback, errorCallback) {
            _backingStore.clear(successCallback, errorCallback);
        };

        return {
            load: _load,
            save: _save,
            clear: _clear
        };

    };

    // Place the version as a member in the function
    SettingsManager.version = '${build.version}';

    return SettingsManager;

});