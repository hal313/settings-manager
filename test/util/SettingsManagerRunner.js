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
                let errorCallback = jest.fn();

                return settingsManager.load(
                    (settings) => expect(settings).toEqual({}),
                    errorCallback
                )
                .then(() => expect(errorCallback).not.toHaveBeenCalled());
            });

            it('should return the correct settings', () => {
                let savedSettings = {
                    one: '1',
                    child: {
                        one: 'won'
                    }
                };
                let errorCallback = jest.fn();

                return settingsManager.save(savedSettings,
                    () => settingsManager.load(
                        (settings) => expect(settings).toEqual(savedSettings),
                        errorCallback
                    ),
                    errorCallback
                )
                .then(() => expect(errorCallback).not.toHaveBeenCalled());
            });

        });

        describe('save()', () => {

            it('should save settings', () => {
                let savedSettings = {
                    one: '1',
                    child: {
                        one: 'won'
                    }
                };
                let errorCallback = jest.fn();

                return settingsManager.save(savedSettings,
                    () => settingsManager.load(
                        (settings) => expect(settings).toEqual(savedSettings),
                        errorCallback
                    ),
                    errorCallback
                )
                .then(() => expect(errorCallback).not.toHaveBeenCalled());
            });

            it('should merge settings correctly', () => {
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
                let errorCallback = jest.fn();

                return settingsManager.save(originalSettings,
                    () => settingsManager.save(overrideSettings,
                        () => settingsManager.load(
                            (settings) => expect(settings).toEqual(resultantSettings),
                            errorCallback
                        ),
                        errorCallback
                    ),
                    errorCallback
                )
                .then(() => expect(errorCallback).not.toHaveBeenCalled());
            });

            it('should handle empty settings passed in', () => {
                let errorCallback = jest.fn();

                return settingsManager.save({},
                    () => settingsManager.load(
                        (settings) => expect(settings).toEqual({}),
                        errorCallback
                    ),
                    errorCallback
                )
                .then(() => expect(errorCallback).not.toHaveBeenCalled());
            });

        });

        describe('clear()', () => {

            it('clears settings', () => {
                let originalSettings = {
                    one: '1',
                    child: {
                        one: 'won'
                    }
                };
                let errorCallback = jest.fn();

                return settingsManager.save(originalSettings,
                    () => settingsManager.clear(
                        () => settingsManager.load(
                            (settings) => expect(settings).toEqual({}),
                            errorCallback
                        ),
                        errorCallback
                    ),
                    errorCallback
                )
                .then(() => expect(errorCallback).not.toHaveBeenCalled());
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

                it(`should not invoke backingStore.save() when a non object is passed in (${value})`, () => {
                    spyOn(backingStore, 'save').and.callThrough();

                    let successCallback = jest.fn();
                    let errorCallback = jest.fn();

                    return settingsManager.save(value, successCallback, errorCallback)
                    .catch(() => {
                        expect(backingStore.save).not.toHaveBeenCalled()
                        expect(successCallback).not.toHaveBeenCalled();
                        expect(errorCallback).toHaveBeenCalled();
                    });
                });

            });

        });

        describe('Failing API Support', () => {

            it('should invoke the error callback when the backing store function fails', () => {
                let errorMessage = 'failing save()';
                spyOn(backingStore, 'save').and.returnValue(Promise.reject(errorMessage));

                let successCallback = jest.fn();
                let errorCallback = jest.fn();

                return settingsManager.save({}, successCallback, errorCallback)
                .then(() => expect(backingStore.save).toHaveBeenCalled())
                .then(() => {
                    expect(successCallback).not.toHaveBeenCalled();
                    expect(errorCallback).toHaveBeenCalledWith(errorMessage);
                });
            });

        });

        describe('API', () => {

            it('should invoke backingStore.save() when settings are passed in', () => {
                spyOn(backingStore, 'save').and.callThrough();

                let successCallback = jest.fn();
                let errorCallback = jest.fn();

                return settingsManager.save({}, successCallback, errorCallback)
                .then(() => expect(backingStore.save).toHaveBeenCalled())
                .then(() => {
                    expect(successCallback).toHaveBeenCalled();
                    expect(errorCallback).not.toHaveBeenCalled();
                });
            });

            it('should invoke backingStore.load()', () => {
                spyOn(backingStore, 'load').and.callThrough();

                let successCallback = jest.fn();
                let errorCallback = jest.fn();

                return settingsManager.load(successCallback, errorCallback)
                .then(() => expect(backingStore.load).toHaveBeenCalled())
                .then(() => {
                    expect(successCallback).toHaveBeenCalled();
                    expect(errorCallback).not.toHaveBeenCalled();
                });
            });

            it('should invoke backingStore.clear()', () => {
                spyOn(backingStore, 'clear').and.callThrough();

                let successCallback = jest.fn();
                let errorCallback = jest.fn();

                return settingsManager.clear(successCallback, errorCallback)
                .then(() => expect(backingStore.clear).toHaveBeenCalled())
                .then(() => {
                    expect(successCallback).toHaveBeenCalled();
                    expect(errorCallback).not.toHaveBeenCalled();
                });
            });

        });

    });

};