export function runSpecs(execute) {

    describe('execute', () => {

        describe('should not run a non-function without failing', () => {

            [
                null, undefined,
                true, false,
                Number.MIN_VALUE, Number.MAX_VALUE, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY,
                -10.1, 1, 0, 1, 10.1,
                'test', '',
                {},
                ['test', true]
            ].forEach(value => {

                it(`should not run a non-function without failing (${value})`, () => {
                    return execute(value)
                    .then(result => expect(result).toBe(undefined));
                });

            });
        });

        it('should run the specified function', () => {
            let fn = jest.fn();

            return execute(fn)
            .then(() => expect(fn).toHaveBeenCalled());
        });

        it('should run with the specified arguments', () => {
            let args = [1, 'two', true];

            let fn = jest.fn(function fn() {
                expect(Array.from(arguments)).toEqual(args);
            });

            return execute(fn, args)
            .then(() => expect(fn).toHaveBeenCalled());
        });

        it('should run with the specified context', () => {
            let context = {
                name: 'some name'
            };
            let fn = jest.fn(function fn() {
                expect(this).toEqual(context);
            });

            return execute(fn, null, context)
            .then(() => expect(fn).toHaveBeenCalled());
        });

        it('should run with the specified arguments and context', () => {
            let args = [1, 'two', true];
            let context = {
                name: 'some name'
            };
            let fn = jest.fn(function fn() {
                expect(Array.from(arguments)).toEqual(args);
                expect(this).toEqual(context);
            });

            return execute(fn, args, context)
            .then(() => expect(fn).toHaveBeenCalled());
        });

        it('should reject when the function throws an error', () => {
            let fn = jest.fn(() => {throw 'error!'});

            return execute(fn)
            .then(() => fail('should not call then'))
            .catch(() => expect(fn).toHaveBeenCalled());
        });

    });

};