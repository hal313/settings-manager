export function runSpecs(isObject) {

    describe('isObject', () => {

        it('should return false when the candidate is not an object', () => {
            expect(isObject(undefined)).toBe(false);
            expect(isObject(null)).toBe(false);
            expect(isObject(()=>{})).toBe(false);
            expect(isObject([])).toBe(false);
            expect(isObject(true)).toBe(false);
            expect(isObject(false)).toBe(false);
            expect(isObject(NaN)).toBe(false);
            expect(isObject(Number.NEGATIVE_INFINITY)).toBe(false);
            expect(isObject(Number.POSITIVE_INFINITY)).toBe(false);
            expect(isObject(Number.MAX_VALUE)).toBe(false);
            expect(isObject(Number.MIN_VALUE)).toBe(false);
            expect(isObject(0)).toBe(false);
            expect(isObject('')).toBe(false);
            expect(isObject('some string')).toBe(false);
        });

        it('should return true when the candidate is an object', () => {
            expect(isObject({})).toBe(true);
        });

    });

};