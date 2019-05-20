export function runSpecs(InMemoryStore) {

    describe('InMemoryStore', () => {

        let inMemoryStore;

        beforeEach(() => {
            inMemoryStore = new InMemoryStore();
        });

        it('should load empty settings when there are no settings', () => {
            return new Promise(resolve => {
                inMemoryStore.load(settings => {
                    expect(settings).toEqual({});
                    resolve();
                });
            });
        });

        it('should load the correct settings when settings have been saved', () => {
            return new Promise(resolve => {
                inMemoryStore.load(settings => {
                    expect(settings).toEqual({});

                    let savedSettings = {one: 1};

                    inMemoryStore.save(savedSettings, settings => {
                        expect(settings).toEqual(savedSettings);
                        resolve();
                    });
                });
            });
        });

        it('should clear settings', () => {
            return new Promise(resolve => {
                inMemoryStore.load(settings => {
                    expect(settings).toEqual({});

                    let savedSettings = {one: 1};

                    inMemoryStore.save(savedSettings, settings => {
                        expect(settings).toEqual(savedSettings);

                        inMemoryStore.clear(() => {
                            inMemoryStore.load(settings => {
                                expect(settings).toEqual({});
                                resolve();
                            });
                        });
                    });
                });
            });
        });

    });

};