import moment from 'moment-timezone';

export default class FoodEntry {
  name: string;
  description?: string;
  serving?: string;
  weight?: number;
  weight_unit?: string;
  calories?: number;
  calories_unit?: string;
  carbs?: number;
  carbs_unit?: string;
  fat?: number;
  fat_unit?: string;
  protein?: number;
  protein_unit?: string;
  sodium?: number;
  sodium_unit?: string;
  cholesterol?: number;
  cholesterol_unit?: string;
  timestamp: number;
  notes?: string;
  upc?: string;
  source?: string;
  source_id?: string | number;

  constructor(
    name: string,
    description?: string,
    serving?: string,
    weight?: number,
    weight_unit?: string,
    calories?: number,
    calories_unit?: string,
    carbs?: number,
    carbs_unit?: string,
    timestamp?: number,
    fat?: number,
    fat_unit?: string,
    protein?: number,
    protein_unit?: string,
    sodium?: number,
    sodium_unit?: string,
    cholesterol?: number,
    cholesterol_unit?: string,
    notes?: string,
    upc?: string,
    source? : string,
    source_id?: string | number,

  ) {
    this.name = name;
    this.description = description;
    this.serving = serving || undefined;
    this.weight = weight || undefined;
    this.weight_unit = weight ? weight_unit || undefined : undefined;
    this.calories = calories || undefined;
    this.calories_unit = calories ? calories_unit || undefined : undefined;
    this.carbs = carbs || undefined;
    this.carbs_unit = carbs ? carbs_unit || undefined : undefined;
    this.timestamp = timestamp || moment().unix();
    this.fat = fat || undefined;
    this.fat_unit = fat ? fat_unit || undefined : undefined;
    this.protein = protein || undefined;
    this.protein_unit = protein ? protein_unit || undefined : undefined;
    this.sodium = sodium || undefined;
    this.sodium_unit = sodium ? sodium_unit || undefined : undefined;
    this.cholesterol = cholesterol || undefined;
    this.cholesterol_unit = cholesterol ? cholesterol_unit || undefined : undefined;
    this.notes = notes || undefined;

    this.upc = upc || undefined;
    this.source = source || undefined;
    this.source_id = source_id || undefined;
  }
}