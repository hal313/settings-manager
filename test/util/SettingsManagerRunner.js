module.exports = function() {
    'use strict';

    return {
        runSpecs: function runSpecs(SettingsManager) {
            var settingsManager;

            beforeEach(function() {
                settingsManager = new SettingsManager();
            });

            // A mock backing store (to test delegation)
            var BackingStore = function() {

                var _load = function(successCallback) {
                    successCallback();
                };

                var _save = function(settings, successCallback) {
                    successCallback();
                };

                var _clear = function(successCallback) {
                    successCallback();
                };

                return {
                    load: _load,
                    save: _save,
                    clear: _clear
                };
            };

            describe('Lifecycle', function() {

                test('exists as a global', function () {
                    expect(SettingsManager).toEqual(expect.any(Function));
                });

                test('has a version', function () {
                    expect(SettingsManager.version).toEqual(expect.any(String));
                });

            });

            describe('API', function() {

                // Backing store

                describe('load()', function() {

                    test('returns the empty object when no settings are provided', function(done) {
                        settingsManager.load(function(settings) {
                            expect(settings).toEqual({});
                            done();
                        });
                    });

                    test('returns the correct settings', function(done) {
                        var _settings = {
                            one: '1',
                            child: {
                                one: 'won'
                            }
                        };

                        settingsManager.save(_settings, function() {
                            settingsManager.load(function(settings) {
                                expect(settings).toEqual(_settings);
                                done();
                            });
                        });
                    });

                });

                describe('save()', function() {

                    test('saves settings', function(done) {
                        var _settings = {
                            one: '1',
                            child: {
                                one: 'won'
                            }
                        };

                        settingsManager.save(_settings, function() {
                            settingsManager.load(function(settings) {
                                expect(settings).toEqual(_settings);
                                done();
                            });
                        });
                    });

                    test('merges settings correctly', function(done) {
                        var _originalSettings = {
                            one: '1',
                            child: {
                                one: 'won'
                            }
                        };
                        var _overrideSettings = {
                            child: {
                                one: 'one',
                                two: 'two'
                            }
                        };
                        var _resultantSettings = {
                            one: '1',
                            child: {
                                one: 'one',
                                two: 'two'
                            }
                        };

                        settingsManager.save(_originalSettings, function() {
                            settingsManager.save(_overrideSettings, function() {
                                settingsManager.load(function(settings) {
                                    expect(settings).toEqual(_resultantSettings);
                                    done();
                                });
                            });

                        });
                    });

                    test('handles no settings passed in', function(done) {
                        settingsManager.save(null, function() {
                            settingsManager.load(function(settings) {
                                expect(settings).toEqual({});
                                done();
                            });
                        });
                    });

                    test('handles empty settings passed in', function(done) {
                        settingsManager.save({}, function() {
                            settingsManager.load(function(settings) {
                                expect(settings).toEqual({});
                                done();
                            });
                        });
                    });

                    test('handles string passed in', function(done) {
                        settingsManager.save('test', null, function() {
                            // Check that the error callback is being invoked
                            done();
                        });
                    });

                    test('handles number passed in', function(done) {
                        settingsManager.save(4, null, function() {
                            // Check that the error callback is being invoked
                            done();
                        });
                    });

                    test('handles array passed in', function(done) {
                        settingsManager.save([1, 2, 3], null, function() {
                            // Check that the error callback is being invoked
                            done();
                        });
                    });

                });

                describe('clear()', function() {

                    test('clears settings', function(done) {
                        var _originalSettings = {
                            one: '1',
                            child: {
                                one: 'won'
                            }
                        };

                        settingsManager.save(_originalSettings, function() {
                            settingsManager.clear(function() {
                                settingsManager.load(function(settings) {
                                    expect(settings).toEqual({});
                                    done();
                                });
                            });

                        });
                    });

                });

            });

            describe('Backing Store', function() {

                test('invokes backing store save()', function(done) {
                    var settingsManager = new SettingsManager(new BackingStore());

                    settingsManager.save(null, function() {
                        done();
                    });
                });

                test('invokes backing store load()', function(done) {
                    var settingsManager = new SettingsManager(new BackingStore());

                    settingsManager.load(function() {
                        done();
                    });
                });

                test('invokes backing store clear()', function(done) {
                    var settingsManager = new SettingsManager(new BackingStore());

                    settingsManager.clear(function() {
                        done();
                    });
                });

            });

        }
    };

};
