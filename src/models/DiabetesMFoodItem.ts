import Identity from '../libs/Identity';
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

  private findUpcCode(): string | undefined {
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
          return Identity.random();
        }
      }
    } else {
      return id;
    }
  }

  toFoodEntry() {
    return new FoodEntry(
      this.name, // name
      undefined, // brand
      this.description, // description
      this.serving?.trim(), // serving
      this.weight, // weight
      this.weight_unit, // weight unit
      this.calories, // calories
      this.calories_unit, // calories unit
      this.carbs, // carbs
      this.carbs_unit, // carbs unit
      this.timestamp, // timestamp
      undefined, // fat
      undefined, // fat unit
      undefined, // protein
      undefined, // protein unit
      undefined, // sodium
      undefined, // sodium unit
      undefined, // cholesterol
      undefined, // cholesterol unit
      undefined, // notes
      1, // quantity
      this.upc, // upc
      undefined, // info_url
      'Diabetes:M', // source name
      this.id // source id
    );
  }
}