import { Units, UnitType, UnitName, UnitNameUtils } from '../../libs/Units';
import * as mathjs from 'mathjs';

describe('Units Class', () => {
  describe('toUnit', () => {
    it('should return a math.js unit when valid unitType and number are provided', () => {
      const result = Units.toUnit(UnitType.G, 100);
      expect(result?.toString()).toBe('100 g');
    });

    it('should return undefined when unitType is invalid', () => {
      const result = Units.toUnit(undefined as unknown as UnitType, 100);
      expect(result).toBeUndefined();
    });

    it('should return undefined when number is not provided', () => {
      const result = Units.toUnit(UnitType.G);
      expect(result).toBeUndefined();
    });
  });

  describe('convert', () => {
    it('should convert between valid units', () => {
      const result = Units.convert(1000, UnitType.G, UnitType.KG);
      expect(result).toBe(1);
    });

    it('should throw an error when conversion is not supported', () => {
      expect(() => Units.convert(100, UnitType.G, UnitType.ML)).toThrow(
        'Conversion from g to ml is not supported.'
      );
    });
  });

  describe('nameConversion', () => {
    it('should return the corresponding UnitType for a valid UnitName', () => {
      const result = Units.nameConversion(UnitName.G);
      expect(result).toBe(UnitType.G);
    });

    it('should return undefined for an invalid UnitName', () => {
      const result = Units.nameConversion('invalid' as unknown as UnitName);
      expect(result).toBeUndefined();
    });
  });

  describe('getConversionFactor (private)', () => {
    it('should return the correct conversion factor for valid units', () => {
      const result = (Units as any).getConversionFactor(UnitType.G, UnitType.KG);
      expect(result).toBe(0.001);
    });

    it('should return undefined for unsupported conversions', () => {
      const result = (Units as any).getConversionFactor(UnitType.G, UnitType.ML);
      expect(result).toBeUndefined();
    });

    it('should return undefined when sourceUnit is undefined', () => {
      const result = (Units as any).getConversionFactor(undefined as unknown as UnitType, UnitType.KG);
      expect(result).toBeUndefined();
    });

    it('should return undefined when targetUnit is undefined', () => {
      const result = (Units as any).getConversionFactor(UnitType.G, undefined as unknown as UnitType);
      expect(result).toBeUndefined();
    });

    it('should return undefined when both sourceUnit and targetUnit are undefined', () => {
      const result = (Units as any).getConversionFactor(undefined as unknown as UnitType, undefined as unknown as UnitType);
      expect(result).toBeUndefined();
    });

    it('should return the correct conversion factor for valid units', () => {
      const result = (Units as any).getConversionFactor(UnitType.G, UnitType.KG);
      expect(result).toBe(0.001); // 1 gram = 0.001 kilograms
    });

    it('should return undefined for unsupported conversions', () => {
      const result = (Units as any).getConversionFactor(UnitType.G, UnitType.ML);
      expect(result).toBeUndefined(); // Conversion from grams to milliliters is not supported
    });
  });

  describe('canConvert', () => {
    it('should return true for supported conversions', () => {
      const result = Units.canConvert(UnitType.G, UnitType.KG);
      expect(result).toBe(true);
    });

    it('should return false for unsupported conversions', () => {
      const result = Units.canConvert(UnitType.G, UnitType.ML);
      expect(result).toBe(false);
    });
  });
});

describe('UnitNameUtils', () => {
  describe('fromName', () => {
    it('should return the correct UnitName for a valid name', () => {
      const result = UnitNameUtils.fromName('g');
      expect(result).toBe(UnitName.G);
    });

    it('should return undefined for an invalid name', () => {
      const result = UnitNameUtils.fromName('invalid');
      expect(result).toBeUndefined();
    });
  });
});