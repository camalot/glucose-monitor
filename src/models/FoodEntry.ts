import Time from '../libs/time';

class MealEntry {
  id?: string;
  description: string;
  calories: number;
  carbs: number;
  fat: number;
  protein: number;
  sodium: number;
  cholesterol: number;
  recordedAt: Date;

  constructor(
    description: string,
    calories?: number,
    carbs?: number,
    recordedAt?: Date,
    fat?: number,
    protein?: number,
    sodium?: number,
    cholesterol?: number,
    id?: string
  ) {
    this.description = description;
    this.calories = calories || 0;
    this.carbs = carbs || 0;
    this.recordedAt = recordedAt || Time.toUtc(new Date());
    this.fat = fat || 0;
    this.protein = protein || 0;
    this.sodium = sodium || 0;
    this.cholesterol = cholesterol || 0;
    this.id = id;
  }
}

export default MealEntry;