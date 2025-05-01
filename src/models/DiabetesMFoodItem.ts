import FoodEntry from './FoodEntry';

export class DiabetesMFoodItem {
  id: string;
  categoryId?: number;
  name: string;
  description: string;
  serving?: string;
  weight?: number;
  weight_unit?: string;
  carbs?: number;
  carbs_unit?: string;
  protein?: number;
  protein_unit?: string;
  calories?: number;
  calories_unit?: string;
  upc?: string;
  timestamp: number;

  constructor(
    id: string,
    categoryId: number,
    name: string,
    description: string,
    serving: string, // need to split by <space> go get size and unit
    weight: number,
    carbs: number,
    protein: number,
    calories: number,
    timestamp: number
  ) {

    this.categoryId = categoryId;
    this.name = name || description;
    this.description = description;
    this.serving = serving;
    this.weight = weight * 1000; // convert weight to grams
    this.weight_unit = 'g';
    this.carbs = carbs;
    this.carbs_unit = 'g'; // assuming carbs are in grams
    this.protein = protein;
    this.protein_unit = 'g'; // assuming protein is in grams
    this.calories = calories;
    this.calories_unit = 'kcal'; // assuming calories are in kilocalories
    this.timestamp = timestamp;
    this.upc = this.findUpcCode();
    this.id = this.validateId(id);
  }

  private findUpcCode(): string {
    if (this.name) {
      const upcMatch = this.name.match(/UPC:\s?([0-9]+)/);
      if (upcMatch) {
        return upcMatch[1].trim();
      }
    }
    return undefined;
  }

  private validateId(id: string): string {
    if (id === '-1' || id === null || id === undefined || id === '') {
      let upc = this.findUpcCode();
      if (upc) {
        return upc;
      } else {
        if (this.timestamp) {
          return this.timestamp.toString();
        } else {
          return undefined;
        }
      }
    } else {
      return id;
    }
  }

  toFoodEntry() {
    return new FoodEntry(
      this.name,
      this.description,
      this.serving.trim(),
      this.weight,
      this.weight_unit,
      this.calories,
      this.calories_unit,
      this.carbs,
      this.carbs_unit,
      this.timestamp,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      this.upc,
      'Diabetes:M',
      this.id
    );
  }
}