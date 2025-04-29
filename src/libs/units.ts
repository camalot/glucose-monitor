
type ConversionTable = Record<UnitType, Record<UnitType, number | undefined>>;

enum UnitType {

  // weights
  KG = "kg",    // Kilograms
  G = "g",     // Grams
  LB = "lb",    // Pounds
  OZ = "oz",    // Ounces

  // fluids
  ML = "ml",    // Milliliters 
  MMOLL = "mmol/L",  // (mmol/L)
  MGDL = "mg/dL",  // Milligrams per deciliter (mg/dL)
}

class Units {
  static convert(value: number, sourceUnit: UnitType, targetUnit: UnitType) {
    const conversionFactor = Units.getConversionFactor(sourceUnit, targetUnit);
    if (conversionFactor === undefined) {
      throw new Error(`Conversion from ${sourceUnit} to ${targetUnit} is not supported.`);
    }
    return value * conversionFactor;
  }

  private static getConversionFactor(sourceUnit: UnitType, targetUnit: UnitType) {
    // convert from all sourceUnit type to targetUnit type
    const conversionTable: ConversionTable = {
      // create the conversion table, returning undefined if not supported
      [UnitType.G]: {
        [UnitType.G]: 1,
        [UnitType.KG]: 0.001,
        [UnitType.LB]: 0.00220462,
        [UnitType.OZ]: 0.035274,
        [UnitType.ML]: undefined,
        [UnitType.MMOLL]: undefined,
        [UnitType.MGDL]: undefined,
      },
      [UnitType.KG]: {
        [UnitType.KG]: 1,
        [UnitType.G]: 1000,
        [UnitType.LB]: 2.20462,
        [UnitType.OZ]: 35.274,
        [UnitType.ML]: undefined,
        [UnitType.MMOLL]: undefined,
        [UnitType.MGDL]: undefined,
      },
      [UnitType.LB]: {
        [UnitType.G]: 453.592,
        [UnitType.KG]: 0.453592,
        [UnitType.LB]: 1,
        [UnitType.OZ]: 16,
        [UnitType.ML]: undefined,
        [UnitType.MMOLL]: undefined,
        [UnitType.MGDL]: undefined,
      },
      [UnitType.OZ]: {
        [UnitType.OZ]: 1,
        [UnitType.G]: 28.3495,
        [UnitType.KG]: 0.0283495,
        [UnitType.LB]: 0.0625,
        [UnitType.ML]: undefined,
        [UnitType.MMOLL]: undefined,
        [UnitType.MGDL]: undefined,
      },
      [UnitType.ML]: {
        [UnitType.ML]: 1,
        [UnitType.G]: 1000,
        [UnitType.KG]: 1,
        [UnitType.LB]: 0.00220462,
        [UnitType.OZ]: 0.035274,
        [UnitType.MMOLL]: undefined,
        [UnitType.MGDL]: undefined,
      },
      [UnitType.MMOLL]: {
        [UnitType.MMOLL]: 1,
        [UnitType.G]: undefined,
        [UnitType.KG]: undefined,
        [UnitType.LB]: undefined,
        [UnitType.OZ]: undefined,
        [UnitType.ML]: undefined,
        [UnitType.MGDL]: 18.018,
      },
      [UnitType.MGDL]: {
        [UnitType.MGDL]: 1,
        [UnitType.G]: undefined,
        [UnitType.KG]: undefined,
        [UnitType.LB]: undefined,
        [UnitType.OZ]: undefined,
        [UnitType.ML]: undefined,
        [UnitType.MMOLL]: 0.0555,
      }
    };


    return conversionTable[sourceUnit]?.[targetUnit] ?? undefined;
  }

  static canConvert(sourceUnit: UnitType, targetUnit: UnitType): boolean {
    const conversionFactor = Units.getConversionFactor(sourceUnit, targetUnit);
    return conversionFactor !== undefined;
  }
}

export default {
  Units,
  UnitType
}