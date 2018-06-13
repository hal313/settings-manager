// Build User: User
// Version:    0.0.15
// Build Date: Tue Jun 12 2018 23:43:24 GMT-0400 (Eastern Daylight Time)

(function (root, factory) {
    'use strict';

    // Determine the module system (if any)
    if ('function' === typeof define && define.amd) {
        // AMD
        define(factory);
    } else {
        // Node
        if ('undefined' !== typeof exports) {
            module.exports = factory();
        } else {
            // None
            root.SettingsManager = factory();
        }
    }

})(this, function () {
    'use strict';

    var isFunction = function isFunction(func) {
        return !!func && 'function' === typeof func;
    },
        merge = function merge(object1, object2) {
            // From (http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically)

            var array = Array.isArray(object2),
                dest = array && [] || {};
                // Merge algorithm adapted from:
                // (http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically)

            if (array) {
                object1 = object1 || [];
                dest = dest.concat(object1);
                object2.forEach(function onItem(e, i) {
                    if (typeof dest[i] === 'undefined') {
                        dest[i] = e;
                    } else if (typeof e === 'object') {
                        dest[i] = merge(object1[i], e);
                    } else {
                        if (object1.indexOf(e) === -1) {
                            dest.push(e);
                        }
                    }
                });
            } else {
                if (object1 && typeof object1 === 'object') {
                    Object.keys(object1).forEach(function (key) {
                        dest[key] = object1[key];
                    });
                }
                Object.keys(object2).forEach(function (key) {
                    if (typeof object2[key] !== 'object' || !object2[key]) {
                        dest[key] = object2[key];
                    }
                    else {
                        if (!object1[key]) {
                            dest[key] = object2[key];
                        } else {
                            dest[key] = merge(object1[key], object2[key]);
                        }
                    }
                });
            }

            return dest;
        },
        InMemoryStore = function InMemoryStore() {

            var emptySettings = {},
                load = function load(successCallback) {
                    if (isFunction(successCallback)) {
                        setTimeout(function onTimeout() {successCallback.call(null, emptySettings);}, 0);
                    }
                },
                save = function save(settings, successCallback) {
                    emptySettings = merge(emptySettings, settings);

                    if (isFunction(successCallback)) {
                        setTimeout(function onTimeout() {successCallback.call(null);}, 0);
                    }
                },
                clear = function clear(successCallback) {
                    emptySettings = {};

                    if (isFunction(successCallback)) {
                        setTimeout(function onTimeout() {successCallback.call(null);}, 0);
                    }
                };

            return {
                load: load,
                save: save,
                clear: clear
            };
        },
        SettingsManager = function SettingsManager(backingStore) {

            if (!(this instanceof SettingsManager)) {
                return new SettingsManager(backingStore);
            }

            var normalizedBackingStore = backingStore || new InMemoryStore(),
                load = function load(successCallback, errorCallback) {
                    normalizedBackingStore.load(function onLoad(settings) {
                        if (isFunction(successCallback)) {
                            setTimeout(function onTimeout() {
                                successCallback.call(null, settings);
                            }, 0);
                        }
                    }, errorCallback);
                },
                save = function save(settings, successCallback, errorCallback) {
                    if (!settings) {
                        if (isFunction(successCallback)) {
                            setTimeout(function onTimeout() {
                                successCallback.call(null);
                            }, 0);
                        }
                    } else if (settings && 'object' === typeof settings && !Array.isArray(settings)) {
                        normalizedBackingStore.save(settings, successCallback, errorCallback);
                    } else {
                        if (isFunction(errorCallback)) {
                            setTimeout(function onTimeout() {
                                errorCallback.call(null);
                            }, 0);
                        }
                    }
                },
                clear = function clear(successCallback, errorCallback) {
                    normalizedBackingStore.clear(successCallback, errorCallback);
                };

            return {
                load: load,
                save: save,
                clear: clear
            };

        };

    // Place the version as a member in the function
    SettingsManager.version = '0.0.15';

    return SettingsManager;

});