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

            it('should return the empty object when no settings are provided', done => {
                expect.assertions(1);

                settingsManager.load(
                    settings => {
                        expect(settings).toEqual({});
                        done();
                    },
                    done.fail
                );
            });

            it('should return the correct settings', done => {
                expect.assertions(1);

                let savedSettings = {
                    one: '1',
                    child: {
                        one: 'won'
                    }
                };

                settingsManager.save(savedSettings,
                    () => settingsManager.load(
                        (settings) => {
                            expect(settings).toEqual(savedSettings);
                            done();
                        },
                        done.fail
                    ),
                    done.fail
                );
            });

        });

        describe('save()', () => {

            it('should save settings', done => {
                expect.assertions(1);

                let savedSettings = {
                    one: '1',
                    child: {
                        one: 'won'
                    }
                };

                settingsManager.save(savedSettings,
                    () => settingsManager.load(
                        settings => {
                            expect(settings).toEqual(savedSettings);
                            done();
                        },
                        done.fail
                    ),
                    done.fail
                );
            });

            it('should return saved settings', done => {
                expect.assertions(1);

                let savedSettings = {
                    one: '1',
                    child: {
                        one: 'won'
                    }
                };

                settingsManager.save(savedSettings,
                    settings => {
                        expect(settings).toEqual(savedSettings);
                        done();
                    },
                    done.fail
                )
            });

            it('should merge settings correctly', done => {
                expect.assertions(1);

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

                settingsManager.save(originalSettings,
                    () => settingsManager.save(overrideSettings,
                        () => settingsManager.load(
                            settings => {
                                expect(settings).toEqual(resultantSettings);
                                done();
                            },
                            done.fail
                        ),
                        done.fail
                    ),
                    done.fail
                );
            });

            it('should handle empty settings passed in', done => {
                expect.assertions(1);

                settingsManager.save({},
                    () => settingsManager.load(
                        settings => {
                            expect(settings).toEqual({});
                            done();
                        },
                        done.fail
                    ),
                    done.fail
                );
            });

        });

        describe('clear()', () => {

            it('clears settings', done => {
                expect.assertions(1);

                let originalSettings = {
                    one: '1',
                    child: {
                        one: 'won'
                    }
                };

                settingsManager.save(originalSettings,
                    () => settingsManager.clear(
                        () => settingsManager.load(
                            settings => {
                                expect(settings).toEqual({});
                                done();
                            },
                            done.fail
                        ),
                        done.fail
                    ),
                    done.fail
                );
            });

        });

    });

    describe('Backing Store', () => {

        describe('Parameter Type Checking', () => {

            [
                null, undefined,
                true, false,
                Number.MIN_VALUE, Number.MAX_VALUE, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY,
                -10.1, 1, 0, 1, 10.1,
                'test', '',
                () => {},
                ['test', true]
            ].forEach(value => {

                it(`should not invoke backingStore.save() when a non object is passed in (${value})`, done => {
                    expect.assertions(1);

                    spyOn(backingStore, 'save').and.callThrough();

                    settingsManager.save(value, done.fail, () => {
                        expect(backingStore.save).not.toHaveBeenCalled()
                        done();
                    });
                });

            });

        });

        describe('Failing API Support', () => {

            it('should invoke the error callback when the backing store function fails', done => {
                expect.assertions(2);

                let errorMessage = 'failing save()';
                spyOn(backingStore, 'save').and.returnValue(Promise.reject(errorMessage));

                settingsManager.save({}, done.fail, thrown => {
                    expect(backingStore.save).toHaveBeenCalled();
                    expect(thrown).toEqual(errorMessage);
                    done();
                });
            });

        });

        describe('API', () => {

            it('should invoke backingStore.save() when settings are passed in', done => {
                expect.assertions(1);

                spyOn(backingStore, 'save').and.callThrough();

                settingsManager.save({}, () => {
                    expect(backingStore.save).toHaveBeenCalled();
                    done();
                }, done.fail);
            });

            it('should invoke backingStore.load()', done => {
                expect.assertions(1);

                spyOn(backingStore, 'load').and.callThrough();

                settingsManager.load(() => {
                    expect(backingStore.load).toHaveBeenCalled();
                    done();
                }, done.fail);
            });

            it('should invoke backingStore.clear()', done => {
                expect.assertions(1);

                spyOn(backingStore, 'clear').and.callThrough();

                settingsManager.clear(() => {
                    expect(backingStore.clear).toHaveBeenCalled();
                    done();
                }, done.fail);
            });

        });

    });

};