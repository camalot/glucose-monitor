
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

export default class Units {
  convert(value: number, sourceUnit: UnitType, targetUnit: UnitType) {

  }

  private getConversionFactor(sourceUnit: UnitType, targetUnit: UnitType) {
    // convert from all sourceUnit type to targetUnit type
    const conversionTable: ConversionTable = {
      // create the conversion table, returning undefined if not supported
      [UnitType.G]: {
        [UnitType.KG]: 0.001,
        [UnitType.LB]: 0.00220462,
        [UnitType.OZ]: 0.035274,
        [UnitType.ML]: undefined,
        [UnitType.MMOLL]: undefined,
        [UnitType.MGDL]: undefined,
      },
      [UnitType.KG]: {
        [UnitType.G]: 1000,
        [UnitType.LB]: 2.20462,
        [UnitType.OZ]: 35.274,
        [UnitType.ML]: undefined,
        [UnitType.MMOLL]: undefined,
        [UnitType.MGDL]: undefined,
      },
    };


    return conversionTable[sourceUnit.toString()]?.[targetUnit] ?? undefined;
  }

  canConvert(sourceUnit: UnitType, targetUnit: UnitType): boolean {
    const conversionFactor = this.getConversionFactor(sourceUnit, targetUnit);
    return conversionFactor !== undefined;
  }
}