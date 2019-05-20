export function runSpecs(isArray) {

    describe('isArray', () => {

        it('should return false when the candidate is not an array', () => {
            expect(isArray(undefined)).toBe(false);
            expect(isArray(null)).toBe(false);
            expect(isArray({})).toBe(false);
            expect(isArray(()=>{})).toBe(false);
            expect(isArray(true)).toBe(false);
            expect(isArray(false)).toBe(false);
            expect(isArray(NaN)).toBe(false);
            expect(isArray(Number.NEGATIVE_INFINITY)).toBe(false);
            expect(isArray(Number.POSITIVE_INFINITY)).toBe(false);
            expect(isArray(Number.MAX_VALUE)).toBe(false);
            expect(isArray(Number.MIN_VALUE)).toBe(false);
            expect(isArray(0)).toBe(false);
            expect(isArray('')).toBe(false);
            expect(isArray('some string')).toBe(false);
        });

        it('should return true when the candidate is an array', () => {
            expect(isArray([])).toBe(true);
        });

    });

};