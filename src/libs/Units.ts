import * as mathjs from "mathjs";
// define the calorie
mathjs.createUnit({
  calorie: {
    definition: "4.184J",
    prefixes: "short",
    aliases: ["cal", "kcal", "calories"]
  },
  // mmol/L
  // mmoll: {

  //   definition: "1mmol/L = 18.015g/L",
  //   prefixes: "short",
  //   aliases: ["mmol", "millimoles"]
  // },
  // mg/dL
});
type ConversionTable = Record<UnitType, Record<UnitType, number | undefined>>;

export enum UnitType {

  // weights
  KG = "kg",    // Kilograms
  G = "g",     // Grams
  MG = "mg",   // Milligrams
  UG = "ug",   // microgram
  LB = "lb",    // Pounds
  OZ = "oz",    // Ounces

  // fluids
  ML = "ml",    // Milliliters 
  MMOLL = "mmol/L",  // (mmol/L)
  MGDL = "mg/dL",  // Milligrams per deciliter (mg/dL)

  KCAL = "kcal",

  PERCENT = "%"
}

export enum UnitName {
  KG = "kg",
  KILOGRAMS = "kg",
  G = "g",
  UG = "ug",
  GRAMS = "g",
  MILLIGRAMS = "mg",
  MG = "mg",
  LB = "lb",
  POUNDS = "lb",
  OUNCES = "oz",
  OZ = "oz",
  ML = "ml",
  MILLILITERS = "ml",
  PERCENT = "%",
  ["%"] = "%"
}

export namespace UnitNameUtils {
  export function fromName(name: string): UnitName | undefined {
    return UnitName[name.toUpperCase() as keyof typeof UnitName] || undefined;
  }
}

type StringConversionTable = Record<string, UnitType>;

export class Units {

  static toUnit(unitType: UnitType, n?: number): math.Unit | undefined { 
    if (!unitType || !mathjs) {
      return undefined;
    }
    return n ? mathjs.unit(n, unitType.valueOf()) : undefined; 
  }

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
        [UnitType.UG]: 1000000,
        [UnitType.ML]: undefined,
        [UnitType.MMOLL]: undefined,
        [UnitType.MGDL]: undefined,

        [UnitType.KCAL]: undefined,
        [UnitType.PERCENT]: undefined,
      },
      [UnitType.KG]: {
        [UnitType.KG]: 1,
        [UnitType.G]: 1000,
        [UnitType.MG]: 1e+6,
        [UnitType.UG]: 1e+9,
        
        [UnitType.LB]: 2.20462,
        [UnitType.OZ]: 35.274,
        [UnitType.ML]: undefined,
        [UnitType.MMOLL]: undefined,
        [UnitType.MGDL]: undefined,

        [UnitType.KCAL]: undefined,
        [UnitType.PERCENT]: undefined,
      },
      [UnitType.LB]: {
        [UnitType.LB]: 1,
        [UnitType.OZ]: 16.000269140320000361,
        [UnitType.G]: 453.5999999997256964,

        [UnitType.KG]: 0.45359237,
        [UnitType.MG]: 453599.9999997257255,
        [UnitType.UG]: 453599999.99972569942,

        [UnitType.ML]: undefined,
        [UnitType.MMOLL]: undefined,
        [UnitType.MGDL]: undefined,

        [UnitType.KCAL]: undefined,
        [UnitType.PERCENT]: undefined,

      },
      [UnitType.MG]: {
        [UnitType.MG]: 1,
        [UnitType.G]: 0.001,
        [UnitType.KG]: 1e-6,

        [UnitType.UG]: 0.001,
        [UnitType.LB]: 0.00000220462,
        [UnitType.OZ]: 0.000035274,
        [UnitType.ML]: undefined,
        [UnitType.MMOLL]: undefined,
        [UnitType.MGDL]: undefined,

        [UnitType.KCAL]: undefined,
        [UnitType.PERCENT]: undefined,
      },
      [UnitType.UG]: {
        [UnitType.UG]: 1,
        [UnitType.G]: 0.000001,
        [UnitType.KG]: 1e-9,
        [UnitType.MG]: 0.001,
        [UnitType.LB]: 2.20462e-9,
        [UnitType.OZ]: 3.5274e-8,
        [UnitType.ML]: undefined,
        [UnitType.MMOLL]: undefined,
        [UnitType.MGDL]: undefined,

        [UnitType.KCAL]: undefined,
        [UnitType.PERCENT]: undefined,
      },
      [UnitType.OZ]: {
        [UnitType.OZ]: 1,
        [UnitType.G]: 28.3495,
        [UnitType.MG]: 28349.5,
        [UnitName.UG]: 28349999.99998286,
        [UnitType.KG]: 0.0283495,
        [UnitType.LB]: 0.0625,
        [UnitType.ML]: undefined,
        [UnitType.MMOLL]: undefined,
        [UnitType.MGDL]: undefined,

        [UnitType.KCAL]: undefined,
        [UnitType.PERCENT]: undefined,
      },
      [UnitType.ML]: {
        [UnitType.ML]: 1,
        [UnitType.G]: 1000,
        [UnitType.KG]: 1,
        [UnitType.LB]: 0.00220462,
        [UnitType.OZ]: 0.035274,
        [UnitType.MG]: undefined,
        [UnitType.UG]: undefined,
        [UnitType.MMOLL]: undefined,
        [UnitType.MGDL]: undefined,

        [UnitType.KCAL]: undefined,
        [UnitType.PERCENT]: undefined,
      },
      [UnitType.MMOLL]: {
        [UnitType.MMOLL]: 1,
        [UnitType.G]: undefined,
        [UnitType.MG]: undefined,
        [UnitType.UG]: undefined,
        [UnitType.KG]: undefined,
        [UnitType.LB]: undefined,
        [UnitType.OZ]: undefined,
        [UnitType.ML]: undefined,
        [UnitType.MGDL]: 18.018,

        [UnitType.KCAL]: undefined,
        [UnitType.PERCENT]: undefined,
      },
      [UnitType.MGDL]: {
        [UnitType.MGDL]: 1,
        [UnitType.G]: undefined,
        [UnitType.MG]: undefined,
        [UnitType.UG]: undefined,
        [UnitType.KG]: undefined,
        [UnitType.LB]: undefined,
        [UnitType.OZ]: undefined,
        [UnitType.ML]: undefined,
        [UnitType.MMOLL]: 0.0555,

        [UnitType.KCAL]: undefined,
        [UnitType.PERCENT]: undefined,
      },

      [UnitType.KCAL]: {
        [UnitType.KCAL]: 1,
        
        [UnitType.MGDL]: undefined,
        [UnitType.G]: undefined,
        [UnitType.MG]: undefined,
        [UnitType.UG]: undefined,
        [UnitType.KG]: undefined,
        [UnitType.LB]: undefined,
        [UnitType.OZ]: undefined,
        [UnitType.ML]: undefined,
        [UnitType.MMOLL]: undefined,

        [UnitType.PERCENT]: undefined,

      },
      [UnitType.PERCENT]: {
        [UnitType.PERCENT]: 1,
        [UnitType.KCAL]: undefined,
        [UnitType.MGDL]: undefined,
        [UnitType.G]: undefined,
        [UnitType.MG]: undefined,
        [UnitType.UG]: undefined,
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
