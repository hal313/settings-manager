export function runSpecs(merge) {

    describe('merge', () => {

        describe('Objects', () => {

            describe('null, undefined and empty objects', () => {

                it('should return an empty object when the source and target are both undefined or null', () => {
                    expect(merge(undefined, undefined)).toEqual({});
                    expect(merge(null, null)).toEqual({});
                });

                it('should return a copy of the source object, when the target is undefined or null', () => {
                    let source = {
                        one: 1,
                        bool: true
                    };

                    expect(merge(undefined, source)).toEqual(source);
                    expect(merge(null, source)).toEqual(source);
                });

                it('should return the target object when the source object is undefined, null or empty', () => {
                    let target = {
                        one: 1,
                        bool: true
                    };

                    expect(merge(target, undefined)).toEqual(target);
                    expect(merge(target, null)).toEqual(target);
                    expect(merge(target, {})).toEqual(target);
                });

            });

            describe('Flat Objects', () => {

                it('should override values with the same name in the target and source with the source value', () => {
                    let target = {
                        one: 1,
                        bool: true
                    };
                    let source = {
                        bool: false
                    };

                    expect(merge(target, source)).toEqual({
                        one: 1,
                        bool: false
                    });
                });

                it('should merge the objects with no keys with the same name', () => {
                    let target = {
                        one: 1,
                        bool: true
                    };
                    let source = {
                        two: 2,
                        str: 'string'
                    };

                    expect(merge(target, source)).toEqual({
                        one: 1,
                        bool: true,
                        two: 2,
                        str: 'string'
                    });
                });

            });

            describe('Nested Objects', () => {

                it('should combine objects with nested objects which share no same key name', () => {
                    let target = {
                        firstname: {
                            firstname: 'first name'
                        }
                    };
                    let source = {
                        lastname: {
                            lastname: 'last name'
                        }
                    };

                    expect(merge(target, source)).toEqual({
                        firstname: {
                            firstname: 'first name'
                        },
                        lastname: {
                            lastname: 'last name'
                        }
                    });
                });

                it('should combine objects with nested objects with the same key name', () => {
                    let target = {
                        person: {
                            firstname: 'first name'
                        }
                    };
                    let source = {
                        person: {
                            lastname: 'last name'
                        }
                    };

                    expect(merge(target, source)).toEqual({
                        person: {
                            firstname: 'first name',
                            lastname: 'last name'
                        }
                    });
                });

                it('should combine objects with nested objects with the same key name and override nested values with the same key name from the source', () => {
                    let target = {
                        person: {
                            firstname: 'first name'
                        }
                    };
                    let source = {
                        person: {
                            firstname: 'overridden',
                            lastname: 'last name'
                        }
                    };

                    expect(merge(target, source)).toEqual({
                        person: {
                            firstname: 'overridden',
                            lastname: 'last name'
                        }
                    });
                });

            });

        });

        describe('Arrays', () => {

            it('should return the source array when the target is null or undefined', () => {
                expect(merge(undefined, [])).toEqual([]);
                expect(merge(null, [])).toEqual([]);
                expect(merge(undefined, [1, 'two', true])).toEqual([1, 'two', true]);
                expect(merge(null, [1, 'two', true])).toEqual([1, 'two', true]);
            });

            it('should combine arrays with no similar values', () => {
                expect(merge([1, 2, 3], [4, 5, 6])).toEqual([1, 2, 3, 4, 5, 6]);
            });

            it('should combine arrays with similar values', () => {
                expect(merge([1, 2, 3], [3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
                expect(merge([1, 2, '3'], [3, 4, 5])).not.toEqual([1, 2, 3, 4, 5]);
            });

            it('should merge sub arrays', () => {
                expect(merge([[1, 2, 3]], [[3, 4, 5]])).toEqual([[1, 2, 3, 4, 5]]);
            });

            it('should override values with sub arrays with objects with the same key names', () => {
                expect(merge([[{name: 'target'}, 2, 3]], [[{name: 'source'}, 4, 5]])).toEqual([[{name: 'source'}, 2, 3, 4, 5]]);
            });

        });

    });

};