export function runSpecs(InMemoryStore) {

    describe('InMemoryStore', () => {

        let inMemoryStore;

        beforeEach(() => {
            inMemoryStore = new InMemoryStore();
        });

        it('should load empty settings when there are no settings', () => {
            return inMemoryStore.load()
            .then(settings => expect(settings).toEqual({}));
        });

        it('should load the correct settings when settings have been saved', () => {
            let savedSettings = {one: 1};

            return inMemoryStore.load()
            .then(settings => expect(settings).toEqual({}))
            .then(() => inMemoryStore.save(savedSettings))
            .then(settings => expect(settings).toEqual(savedSettings))
            .then(() => inMemoryStore.load())
            .then(settings => expect(settings).toEqual(savedSettings));
        });

        it('should clear settings', () => {
            let savedSettings = {one: 1};

            return inMemoryStore.load()
            .then(settings => expect(settings).toEqual({}))
            .then(() => inMemoryStore.save(savedSettings))
            .then(settings => expect(settings).toEqual(savedSettings))
            .then(() => inMemoryStore.load())
            .then(settings => expect(settings).toEqual(savedSettings))
            .then(() => inMemoryStore.clear())
            .then(() => inMemoryStore.load())
            .then(settings => expect(settings).toEqual({}));
        });

    });

};