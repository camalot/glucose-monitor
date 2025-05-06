import ArrayUtility from '../../libs/Array';

describe('ArrayUtility Class', () => {
  describe('wrap', () => {
    it('should return the same array if the input is already an array', () => {
      const input = [1, 2, 3];
      const result = ArrayUtility.wrap(input);
      expect(result).toBe(input); // Should return the same array reference
    });

    it('should wrap a non-array value into an array', () => {
      const input = 'test';
      const result = ArrayUtility.wrap(input);
      expect(result).toEqual(['test']); // Should wrap the value in an array
    });

    it('should wrap `null` into an array', () => {
      const input = null;
      const result = ArrayUtility.wrap(input);
      expect(result).toEqual([null]); // Should wrap null in an array
    });

    it('should wrap `undefined` into an array', () => {
      const input = undefined;
      const result = ArrayUtility.wrap(input);
      expect(result).toEqual([undefined]); // Should wrap undefined in an array
    });

    it('should wrap an object into an array', () => {
      const input = { key: 'value' };
      const result = ArrayUtility.wrap(input);
      expect(result).toEqual([{ key: 'value' }]); // Should wrap the object in an array
    });

    it('should wrap a number into an array', () => {
      const input = 42;
      const result = ArrayUtility.wrap(input);
      expect(result).toEqual([42]); // Should wrap the number in an array
    });
  });
});