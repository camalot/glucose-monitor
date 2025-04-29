import moment from 'moment-timezone';

export default class FoodEntry {
  name: string;
  description?: string;
  calories?: number;
  carbs?: number;
  fat?: number;
  protein?: number;
  sodium?: number;
  cholesterol?: number;
  timestamp: number;
  notes?: string;
  fatsecret_id?: number;

  constructor(
    name: string,
    description?: string,
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
    this.calories = calories || undefined;
    this.carbs = carbs || undefined;
    this.timestamp = timestamp || moment().unix();
    this.fat = fat || undefined;
    this.protein = protein || undefined;
    this.sodium = sodium || undefined;
    this.cholesterol = cholesterol || undefined;
    this.notes = notes || undefined;

    this.fatsecret_id = fatsecret_id || undefined;
  }
}