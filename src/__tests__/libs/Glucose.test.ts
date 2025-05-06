import Glucose from '../../libs/Glucose';

describe('Glucose Class', () => {
  describe('calculateA1C', () => {
    it('should calculate the correct A1C value for valid entries', () => {
      const entries = [100, 120, 140, 160, 180];
      const result = Glucose.calculateA1C(entries);
      const expectedA1C = (entries.reduce((sum, entry) => sum + entry, 0) / entries.length + 46.7) / 28.7;
      expect(result).toBeCloseTo(expectedA1C, 5); // Allow for floating-point precision
    });

    it('should throw an error if entries is not an array', () => {
      expect(() => Glucose.calculateA1C(null as unknown as number[])).toThrow(
        "Invalid entries: must be a non-empty array"
      );
    });

    it('should throw an error if entries is an empty array', () => {
      expect(() => Glucose.calculateA1C([])).toThrow("Invalid entries: must be a non-empty array");
    });
  });

  // describe('getAverage', () => {
  //   it('should calculate the correct average for valid entries', () => {
  //     const entries = [100, 120, 140, 160, 180];
  //     const result = Glucose.getAverage(entries);
  //     const expectedAverage = entries.reduce((sum, entry) => sum + entry, 0) / entries.length;
  //     expect(result).toBe(expectedAverage);
  //   });

  //   it('should throw an error if entries is not an array', () => {
  //     expect(() => Glucose.getAverage(null as unknown as number[])).toThrow(
  //       "Invalid entries: must be a non-empty array"
  //     );
  //   });

  //   it('should throw an error if entries is an empty array', () => {
  //     expect(() => Glucose.getAverage([])).toThrow("Invalid entries: must be a non-empty array");
  //   });
  // });
});