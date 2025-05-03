
type ConversionTable = Record<UnitType, Record<UnitType, number | undefined>>;

export enum UnitType {

  // weights
  KG = "kg",    // Kilograms
  G = "g",     // Grams
  MG = "mg",   // Milligrams
  LB = "lb",    // Pounds
  OZ = "oz",    // Ounces

  // fluids
  ML = "ml",    // Milliliters 
  MMOLL = "mmol/L",  // (mmol/L)
  MGDL = "mg/dL",  // Milligrams per deciliter (mg/dL)

  KCAL = "kcal",
}

export enum UnitName {
  KG = "kg",
  KILOGRAMS = "kg",
  G = "g",
  GRAMS = "g",
  MILLIGRAMS = "mg",
  MG = "mg",
  LB = "lb",
  POUNDS = "lb",
  OUNCES = "oz",
  OZ = "oz",
  ML = "ml",
  MILLILITERS = "ml",
}

type StringConversionTable = Record<string, UnitType>;

export class Units {
  static convert(value: number, sourceUnit: UnitType, targetUnit: UnitType) {
    const conversionFactor = Units.getConversionFactor(sourceUnit, targetUnit);
    if (conversionFactor === undefined) {
      throw new Error(`Conversion from ${sourceUnit} to ${targetUnit} is not supported.`);
    }
    return value * conversionFactor;
  }

  static nameConversion(unit: UnitName) {
    const conversionTable: StringConversionTable = {
      [unit]: UnitType[unit.toString().toUpperCase() as keyof typeof UnitType] || undefined,
    };
    return conversionTable[unit];
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
        [UnitType.MG]: 1000,
        [UnitType.ML]: undefined,
        [UnitType.MMOLL]: undefined,
        [UnitType.MGDL]: undefined,

        [UnitType.KCAL]: undefined,
      },
      [UnitType.KG]: {
        [UnitType.KG]: 1,
        [UnitType.G]: 1000,
        [UnitType.MG]: 1e+6,
        [UnitType.LB]: 2.20462,
        [UnitType.OZ]: 35.274,
        [UnitType.ML]: undefined,
        [UnitType.MMOLL]: undefined,
        [UnitType.MGDL]: undefined,

        [UnitType.KCAL]: undefined,
      },
      [UnitType.MG]: {
        [UnitType.MG]: 1,
        [UnitType.G]: 0.001,
        [UnitType.KG]: 1e-6,
        [UnitType.LB]: 0.00000220462,
        [UnitType.OZ]: 0.000035274,
        [UnitType.ML]: undefined,
        [UnitType.MMOLL]: undefined,
        [UnitType.MGDL]: undefined,

        [UnitType.KCAL]: undefined,
      },
      [UnitType.LB]: {
        [UnitType.G]: 453.592,
        [UnitType.KG]: 0.453592,
        [UnitType.MG]: 453592,
        [UnitType.LB]: 1,
        [UnitType.OZ]: 16,
        [UnitType.ML]: undefined,
        [UnitType.MMOLL]: undefined,
        [UnitType.MGDL]: undefined,

        [UnitType.KCAL]: undefined,
      },
      [UnitType.OZ]: {
        [UnitType.OZ]: 1,
        [UnitType.G]: 28.3495,
        [UnitType.MG]: 28349.5,
        [UnitType.KG]: 0.0283495,
        [UnitType.LB]: 0.0625,
        [UnitType.ML]: undefined,
        [UnitType.MMOLL]: undefined,
        [UnitType.MGDL]: undefined,

        [UnitType.KCAL]: undefined,
      },
      [UnitType.ML]: {
        [UnitType.ML]: 1,
        [UnitType.G]: 1000,
        [UnitType.KG]: 1,
        [UnitType.LB]: 0.00220462,
        [UnitType.OZ]: 0.035274,
        [UnitType.MG]: undefined,
        [UnitType.MMOLL]: undefined,
        [UnitType.MGDL]: undefined,

        [UnitType.KCAL]: undefined,
      },
      [UnitType.MMOLL]: {
        [UnitType.MMOLL]: 1,
        [UnitType.G]: undefined,
        [UnitType.MG]: undefined,
        [UnitType.KG]: undefined,
        [UnitType.LB]: undefined,
        [UnitType.OZ]: undefined,
        [UnitType.ML]: undefined,
        [UnitType.MGDL]: 18.018,

        [UnitType.KCAL]: undefined,
      },
      [UnitType.MGDL]: {
        [UnitType.MGDL]: 1,
        [UnitType.G]: undefined,
        [UnitType.MG]: undefined,
        [UnitType.KG]: undefined,
        [UnitType.LB]: undefined,
        [UnitType.OZ]: undefined,
        [UnitType.ML]: undefined,
        [UnitType.MMOLL]: 0.0555,

        [UnitType.KCAL]: undefined,
      },

      [UnitType.KCAL]: {
        [UnitType.KCAL]: 1,
        
        [UnitType.MGDL]: undefined,
        [UnitType.G]: undefined,
        [UnitType.MG]: undefined,
        [UnitType.KG]: undefined,
        [UnitType.LB]: undefined,
        [UnitType.OZ]: undefined,
        [UnitType.ML]: undefined,
        [UnitType.MMOLL]: undefined,

      },

    };


    return conversionTable[sourceUnit]?.[targetUnit] ?? undefined;
  }

  static canConvert(sourceUnit: UnitType, targetUnit: UnitType): boolean {
    const conversionFactor = Units.getConversionFactor(sourceUnit, targetUnit);
    return conversionFactor !== undefined;
  }
}
