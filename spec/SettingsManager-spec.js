/*global beforeEach,describe,it: true*/
/*global SettingsManager: true*/

/**
 * @author: jghidiu
 * Date: 2014-12-08
 */

(function() {
    'use strict';

    beforeEach(function() {
        this.settingsManager = new SettingsManager();
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

    describe('API', function() {

        // Backing store

        describe('load()', function() {

            it('returns the empty object when no default settings are provided', function(done) {
                this.settingsManager.load(function(settings) {
                    settings.should.deep.equal({});
                    done();
                });
            });

            it('returns the correct settings', function(done) {
                var _settings = {
                    one: '1',
                    child: {
                        one: 'won'
                    }
                };
                var settingsManager = this.settingsManager;

                settingsManager.save(_settings, function() {
                    settingsManager.load(function(settings) {
                        settings.should.deep.equal(_settings);
                        done();
                    });
                });
            });

        });

        describe('save()', function() {

            it('saves settings', function(done) {
                var _settings = {
                    one: '1',
                    child: {
                        one: 'won'
                    }
                };
                var settingsManager = this.settingsManager;

                settingsManager.save(_settings, function() {
                    settingsManager.load(function(settings) {
                        settings.should.deep.equal(_settings);
                        done();
                    });
                });
            });

            it('merges settings correctly', function(done) {
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

                var settingsManager = this.settingsManager;

                settingsManager.save(_originalSettings, function() {
                    settingsManager.save(_overrideSettings, function() {
                        settingsManager.load(function(settings) {
                            settings.should.deep.equal(_resultantSettings);
                            done();
                        });
                    });

                });
            });

            it('handles no settings passed in', function(done) {
                var settingsManager = this.settingsManager;

                settingsManager.save(null, function() {
                    settingsManager.load(function(settings) {
                        settings.should.be.deep.equal({});
                        done();
                    });
                });
            });

            it('handles empty settings passed in', function(done) {
                var settingsManager = this.settingsManager;

                settingsManager.save({}, function() {
                    settingsManager.load(function(settings) {
                        settings.should.be.deep.equal({});
                        done();
                    });
                });
            });

            it('handles string passed in', function(done) {
                var settingsManager = this.settingsManager;

                settingsManager.save('test', null, function() {
                    // Check that the error callback is being invoked
                    done();
                });
            });

            it('handles number passed in', function(done) {
                var settingsManager = this.settingsManager;

                settingsManager.save(4, null, function() {
                    // Check that the error callback is being invoked
                    done();
                });
            });

            it('handles array passed in', function(done) {
                var settingsManager = this.settingsManager;

                settingsManager.save([1, 2, 3], null, function() {
                    // Check that the error callback is being invoked
                    done();
                });
            });

        });

        describe('clear()', function() {

            it('clears settings', function(done) {
                var _originalSettings = {
                    one: '1',
                    child: {
                        one: 'won'
                    }
                };

                var settingsManager = this.settingsManager;

                settingsManager.save(_originalSettings, function() {
                    settingsManager.clear(function() {
                        settingsManager.load(function(settings) {
                            settings.should.deep.equal({});
                            done();
                        });
                    });

                });
            });

        });

    });

    describe('Backing Store', function() {

        it('invokes backing store save()', function(done) {
            var settingsManager = new SettingsManager(new BackingStore());

            settingsManager.save(null, function() {
                done();
            });
        });

        it('invokes backing store load()', function(done) {
            var settingsManager = new SettingsManager(new BackingStore());

            settingsManager.load(function() {
                done();
            });
        });

        it('invokes backing store clear()', function(done) {
            var settingsManager = new SettingsManager(new BackingStore());

            settingsManager.clear(function() {
                done();
            });
        });

    });

})();