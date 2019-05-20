export function runSpecs(execute) {

    describe('execute', () => {

        it('should not run a non-function without failing', () => {
            expect(execute(undefined)).toBe(null);
            expect(execute(null)).toBe(null);
            expect(execute({})).toBe(null);
            expect(execute(-2)).toBe(null);
            expect(execute(0)).toBe(null);
            expect(execute(2)).toBe(null);
            expect(execute(true)).toBe(null);
            expect(execute(false)).toBe(null);
            expect(execute('')).toBe(null);
            expect(execute('some string')).toBe(null);
        });

        it('should run the specified function', () => {
            let fn = jest.fn();

            execute(fn);

            expect(fn).toHaveBeenCalled();
        });

        it('should run with the specified arguments', () => {
            let args = [1, 'two', true];

            let fn = jest.fn(function fn() {
                expect(Array.from(arguments)).toEqual(args);
            });

            execute(fn, args);
        });

        it('should run with the specified context', () => {
            let context = {
                name: 'some name'
            };
            let fn = jest.fn(function fn() {
                expect(this).toEqual(context);
            });

            execute(fn, null, context);
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

            execute(fn, args, context);
        });

    });

};