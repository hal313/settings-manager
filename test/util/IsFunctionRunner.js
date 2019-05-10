export function runSpecs(isFunction) {

    describe('isFunction', () => {

        it('should return false when the candidate is not a function', () => {
            expect(isFunction(undefined)).toBe(false);
            expect(isFunction(null)).toBe(false);
            expect(isFunction({})).toBe(false);
            expect(isFunction([])).toBe(false);
            expect(isFunction(true)).toBe(false);
            expect(isFunction(false)).toBe(false);
            expect(isFunction(NaN)).toBe(false);
            expect(isFunction(Number.NEGATIVE_INFINITY)).toBe(false);
            expect(isFunction(Number.POSITIVE_INFINITY)).toBe(false);
            expect(isFunction(Number.MAX_VALUE)).toBe(false);
            expect(isFunction(Number.MIN_VALUE)).toBe(false);
            expect(isFunction(0)).toBe(false);
            expect(isFunction('')).toBe(false);
            expect(isFunction('some string')).toBe(false);
        });

        it('should return true when the candidate is a function', () => {
            expect(isFunction(()=>{})).toBe(true);
        });

    });

};