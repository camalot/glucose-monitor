import moment from 'moment-timezone';

class MealEntry {
  name: string;
  description: string;
  calories: number;
  carbs: number;
  fat: number;
  protein: number;
  sodium: number;
  cholesterol: number;
  timestamp: number;
  notes: string;
  fatsecret_id?: number;

  constructor(
    name: string,
    description: string,
    calories?: number,
    carbs?: number,
    timestamp?: number,
    fat?: number,
    protein?: number,
    sodium?: number,
    cholesterol?: number,
    notes?: string,
    fatsecret_id?: number,
  ) {
    this.name = name;
    this.description = description;
    this.calories = calories || -1;
    this.carbs = carbs || -1;
    this.timestamp = timestamp || moment().unix();
    this.fat = fat || -1;
    this.protein = protein || -1;
    this.sodium = sodium || -1;
    this.cholesterol = cholesterol || -1;
    this.notes = notes || "";

    this.fatsecret_id = fatsecret_id || null;
  }
}

export default MealEntry;