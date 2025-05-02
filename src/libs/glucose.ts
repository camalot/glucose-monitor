export default class Glucose {
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

}