export function runSpecs(executeAsync) {

    describe('execute', () => {

        it('should not run a non-function without failing', () => {
            expect(executeAsync(undefined)).toBe(null);
            expect(executeAsync(null)).toBe(null);
            expect(executeAsync({})).toBe(null);
            expect(executeAsync(-2)).toBe(null);
            expect(executeAsync(0)).toBe(null);
            expect(executeAsync(2)).toBe(null);
            expect(executeAsync(true)).toBe(null);
            expect(executeAsync(false)).toBe(null);
            expect(executeAsync('')).toBe(null);
            expect(executeAsync('some string')).toBe(null);
        });

        it('should return a promise which resolves to the function result', () => {
            let fn = jest.fn(() => 'resolved');
            return executeAsync(fn)
                .then(result => {
                    expect(result).toEqual('resolved');
                });
        });

        it('should return a promise which rejects when the function throws', () => {
            let fn = jest.fn(() => {throw 'thrown'});
            return executeAsync(fn)
                .then(fail)
                .catch(error => {
                    expect(error).toEqual('thrown');
                });
        });

        it('should run the specified function', () => {
            return new Promise(resolve => {
                let fn = jest.fn(() => {
                    expect(fn).toHaveBeenCalled();
                    resolve();
                });

                executeAsync(fn);

            });

        });

        it('should run with the specified arguments', () => {
            return new Promise(resolve => {
                let args = [1, 'two', true];

                let fn = jest.fn(function fn() {
                    expect(Array.from(arguments)).toEqual(args);
                    resolve();
                });

                executeAsync(fn, args);
            });
        });

        it('should run with the specified context', () => {
            return new Promise(resolve => {
                let context = {
                    name: 'some name'
                };
                let fn = jest.fn(function fn() {
                    expect(this).toEqual(context);
                    resolve();
                });

                executeAsync(fn, null, context);
                });
        });

        it('should run with the specified arguments and context', () => {
            return new Promise(resolve => {
                let args = [1, 'two', true];
                let context = {
                    name: 'some name'
                };
                let fn = jest.fn(function fn() {
                    expect(Array.from(arguments)).toEqual(args);
                    expect(this).toEqual(context);
                    resolve();
                });

                executeAsync(fn, args, context);
            });
        });

    });

};