export function runSpecs(SettingsManager, BackingStore) {

    let settingsManager;
    let backingStore;

    beforeEach(() => {
        backingStore = new BackingStore();
        settingsManager = new SettingsManager(backingStore);
    });

    describe('Lifecycle', () => {

        it('should exist as a function', () => {
            expect(SettingsManager).toEqual(expect.any(Function));
        });

    });

    describe('API', () => {

        describe('load()', () => {

            it('should return the empty object when no settings are provided', () => {
                return new Promise(resolve => {
                    settingsManager.load(settings => {
                        expect(settings).toEqual({});
                        resolve();
                    });
                });
            });

            it('should return the correct settings', () => {
                return new Promise(resolve => {
                    let savedSettings = {
                        one: '1',
                        child: {
                            one: 'won'
                        }
                    };

                    settingsManager.save(savedSettings, () => {
                        settingsManager.load(settings => {
                            expect(settings).toEqual(savedSettings);
                            resolve();
                        });
                    });
                });
            });

        });

        describe('save()', () => {

            it('should save settings', () => {
                return new Promise(resolve => {
                    let savedSettings = {
                        one: '1',
                        child: {
                            one: 'won'
                        }
                    };

                    settingsManager.save(savedSettings, () => {
                        settingsManager.load(settings => {
                            expect(settings).toEqual(savedSettings);
                            resolve();
                        });
                    });
                });
            });

            it('should merge settings correctly', () => {
                return new Promise(resolve => {
                    let originalSettings = {
                        one: '1',
                        child: {
                            one: 'won'
                        }
                    };
                    let overrideSettings = {
                        child: {
                            one: 'one',
                            two: 'two'
                        }
                    };
                    let resultantSettings = {
                        one: '1',
                        child: {
                            one: 'one',
                            two: 'two'
                        }
                    };

                    settingsManager.save(originalSettings, () => {
                        settingsManager.save(overrideSettings, () => {
                            settingsManager.load(settings => {
                                expect(settings).toEqual(resultantSettings);
                                resolve();
                            });
                        });

                    });
                });
            });

            it('should handle no settings passed in', () => {
                return new Promise(resolve => {
                    settingsManager.save(null, () => {
                        settingsManager.load(settings => {
                            expect(settings).toEqual({});
                            resolve();
                        });
                    });
                });
            });

            it('should handle empty settings passed in', () => {
                return new Promise(resolve => {
                    settingsManager.save({}, () => {
                        settingsManager.load(settings => {
                            expect(settings).toEqual({});
                            resolve();
                        });
                    });
                });
            });

            it('should invoke the error callback when a non-object is passed in', () => {
                return new Promise(resolve => {
                    let successCallback = jest.fn();
                    settingsManager.save('test', successCallback, () => {
                        expect(successCallback).not.toHaveBeenCalled();
                        resolve();
                    });
                });
            });

            it('should invoke the error callback when a number passed in', () => {
                return new Promise(resolve => {
                    let successCallback = jest.fn();
                    settingsManager.save(4, successCallback, () => {
                        expect(successCallback).not.toHaveBeenCalled();
                        resolve();
                    });
                });
            });

            it('should invoke the error callback when an array is passed in', () => {
                return new Promise(resolve => {
                    let successCallback = jest.fn();
                    settingsManager.save([1, 2, 3], successCallback, () => {
                        expect(successCallback).not.toHaveBeenCalled();
                        resolve();
                    });
                });
            });

        });

        describe('clear()', () => {

            it('clears settings', () => {
                return new Promise(resolve => {
                    let originalSettings = {
                        one: '1',
                        child: {
                            one: 'won'
                        }
                    };

                    settingsManager.save(originalSettings, () => {
                        settingsManager.clear(() => {
                            settingsManager.load(settings => {
                                expect(settings).toEqual({});
                                resolve();
                            });
                        });
                    });
                });
            });

        });

    });

    describe('Backing Store', () => {

        it('should not invoke backingStore.save() when no settings are passed in', () => {
            return new Promise(resolve => {
                spyOn(backingStore, 'save').and.callThrough();

                settingsManager.save(null, () => {
                    expect(backingStore.save).not.toHaveBeenCalled();
                    resolve();
                });
            });
        });

        it('should invoke backingStore.save() when settings are passed in', () => {
            return new Promise(resolve => {
                spyOn(backingStore, 'save').and.callThrough();

                settingsManager.save({}, () => {
                    expect(backingStore.save).toHaveBeenCalled();
                    resolve();
                });
            });
        });

        it('should invoke backingStore.load()', () => {
            return new Promise(resolve => {
                spyOn(backingStore, 'load').and.callThrough();

                settingsManager.load(() => {
                    expect(backingStore.load).toHaveBeenCalled();
                    resolve();
                });
            });
        });

        it('should invoke backingStore.clear()', () => {
            return new Promise(resolve => {
                spyOn(backingStore, 'clear').and.callThrough();

                settingsManager.clear(() => {
                    expect(backingStore.clear).toHaveBeenCalled();
                    resolve();
                });
            });
        });

    });

};