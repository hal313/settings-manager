// Build User: unknown
// Version:    1.0.0
// Build Date: Mon Apr 29 2019 16:29:26 GMT-0400 (EDT)

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

    /**
     * Determines if a value is a function.
     *
     * @param {Object} func the function to test
     * @returns {boolean} true, if func is a Function
     */
    var isFunction = function isFunction(func) {
        return !!func && 'function' === typeof func;
    },
        /**
         * Merges two objects; members of the second object take precedence over the first object.
         *
         * @param {Object} target an object to merge to
         * @returns {Object} the target object, populated with the source object's members
         */
        merge = function merge(target, source) {
            // From (http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically)

            var array = Array.isArray(source),
                dest = array && [] || {};
                // Merge algorithm adapted from:
                // (http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically)

            if (array) {
                target = target || [];
                dest = dest.concat(target);
                source.forEach(function onItem(e, i) {
                    if (typeof dest[i] === 'undefined') {
                        dest[i] = e;
                    } else if (typeof e === 'object') {
                        dest[i] = merge(target[i], e);
                    } else {
                        if (target.indexOf(e) === -1) {
                            dest.push(e);
                        }
                    }
                });
            } else {
                if (target && typeof target === 'object') {
                    Object.keys(target).forEach(function (key) {
                        dest[key] = target[key];
                    });
                }
                Object.keys(source).forEach(function (key) {
                    if (typeof source[key] !== 'object' || !source[key]) {
                        dest[key] = source[key];
                    }
                    else {
                        if (!target[key]) {
                            dest[key] = source[key];
                        } else {
                            dest[key] = merge(target[key], source[key]);
                        }
                    }
                });
            }

            return dest;
        },
        /**
         * A store implementation in memory.
         */
        InMemoryStore = function InMemoryStore() {

            var emptySettings = {},
                /**
                 * Loads values.
                 *
                 * @param {Function} successCallback the callback invoked on success (with parameter {})
                 */
                load = function load(successCallback) {
                    if (isFunction(successCallback)) {
                        setTimeout(function onTimeout() {successCallback.call(null, emptySettings);}, 0);
                    }
                },
                /**
                 * Saves values.
                 *
                 * @param {Object} settings the settings to save
                 * @param {Function} successCallback the success callback to invoke on success
                 */
                save = function save(settings, successCallback) {
                    emptySettings = merge(emptySettings, settings);

                    if (isFunction(successCallback)) {
                        setTimeout(function onTimeout() {successCallback.call(null);}, 0);
                    }
                },
                /**
                 * Clears values.
                 *
                 * @param {Function} successCallback the success callback to invoke on success
                 */
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
        /**
         * Implementation for SettingsManager, a class for storing settings.
         *
         * @param {Object} [backingStore] optional backing store to wrap
         */
        SettingsManager = function SettingsManager(backingStore) {

            // Make sure this is a new instance
            if (!(this instanceof SettingsManager)) {
                return new SettingsManager(backingStore);
            }

            var normalizedBackingStore = backingStore || new InMemoryStore(),
                /**
                 * Loads values.
                 *
                 * @param {Function} successCallback the callback invoked on success (invoked with the settings)
                 */
                load = function load(successCallback, errorCallback) {
                    normalizedBackingStore.load(function onLoad(settings) {
                        if (isFunction(successCallback)) {
                            setTimeout(function onTimeout() {
                                successCallback.call(null, settings);
                            }, 0);
                        }
                    }, errorCallback);
                },
                /**
                 * Saves values.
                 *
                 * @param {Object} settings the settings to save
                 * @param {Function} successCallback the success callback to invoke on success
                 */
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
                /**
                 * Clears values.
                 *
                 * @param {Function} successCallback the success callback to invoke on success
                 */
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
    SettingsManager.version = '1.0.0';

    return SettingsManager;

});