class Glucose {
  constructor() { }

  static calculateA1C(entries: number[]): number {
    if (!Array.isArray(entries) || entries.length === 0) {
      throw new Error("Invalid entries: must be a non-empty array");
    }

    const total = entries.reduce((sum, entry) => sum + entry, 0);
    const average = total / entries.length;

    const a1c = (average + 46.7) / 28.7;
    return a1c;
  }

  static getAverage(entries: number[]): number {
    if (!Array.isArray(entries) || entries.length === 0) {
      throw new Error("Invalid entries: must be a non-empty array");
    }

    const total = entries.reduce((sum, entry) => sum + entry, 0);
    return total / entries.length;
  }

  static convertMGDLToMMOLL(mgdl: number): number {
    if (typeof mgdl !== 'number' || mgdl < 0) {
      throw new Error("Invalid mg/dL value: must be a non-negative number");
    }

    const mmolL = mgdl / 18.01559;
    return mmolL;
  }

  static convertMMOLLToMGDL(mmoll: number): number {
    if (typeof mmoll !== 'number' || mmoll < 0) {
      throw new Error("Invalid mmol/L value: must be a non-negative number");
    }

    const mgdl = mmoll * 18.01559;
    return mgdl;
  }
}

export default Glucose;



// class Glucose {
//   constructor() {

//   }

//   calculateA1C(entries) {
//     if (!Array.isArray(entries) || entries.length === 0) {
//       throw new Error("Invalid entries: must be a non-empty array");
//     }

//     const total = entries.reduce((sum, entry) => sum + entry, 0);
//     const average = total / entries.length;

//     const a1c = (average + 46.7) / 28.7;
//     return a1c;
//   }

//   getAverage(entries) {
//     if (!Array.isArray(entries) || entries.length === 0) {
//       throw new Error("Invalid entries: must be a non-empty array");
//     }
    
//     const total = entries.reduce((sum, entry) => sum + entry, 0);
//     return total / entries.length;
//   }

//   convertMGDLToMMOLL(mgdl) {
//     if (typeof mgdl !== 'number' || mgdl < 0) {
//       throw new Error("Invalid mg/dL value: must be a non-negative number");
//     }
    
//     const mmolL = mgdl / 18.01559;
//     return mmolL;
//   }

//   convertMMOLLToMGDL(mmoll) {
//     if (typeof mmoll !== 'number' || mmoll < 0) {
//       throw new Error("Invalid mmol/L value: must be a non-negative number");
//     }
    
//     const mgdl = mmoll * 18.01559;
//     return mgdl;
//   }
// }