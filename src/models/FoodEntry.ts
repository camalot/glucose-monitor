import moment from 'moment-timezone';
import Food from '../libs/FatSecret/structures/Food';

export default class FoodEntry {
  name: string;
  brand?: string;
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
  info_url?: string
  source?: string;
  source_id?: string | number;

  constructor(
    name: string,
    brand?: string,
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
    info_url?: string,
    source? : string,
    source_id?: string | number,

  ) {
    this.name = name;
    this.brand = brand;
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
    this.info_url = info_url || undefined;
    
    this.source = source || undefined;
    this.source_id = source_id || undefined;
  }

  static fromFoodSearchResultV3(data: Food) {
    const firstServing = data.servings?.[0] || undefined;

    return new FoodEntry(
      data.name,
      data.brandName,
      firstServing?.description || undefined,
      firstServing?.metricServingAmount?.toString() !== 'NaN' ? firstServing.metricServingAmount.toString() : undefined,
      0,
      'g',
      parseFloat(firstServing?.calories?.toString() || '0'),
      'kcal',
      parseFloat(firstServing?.carbohydrate?.toString() || '0'),
      'g',
      undefined,
      parseFloat(firstServing?.fat?.toString() || '0'),
      'g',
      parseFloat(firstServing?.protein?.toString() || '0'),
      'g',
      parseFloat(firstServing?.sodium?.toString() || '0'),
      'g',
      parseFloat(firstServing?.cholesterol?.toString() || '0'),
      'mg',
      firstServing?.description || undefined,
      undefined,
      data.url || undefined,
      'fatsecret',
      data.id || String(moment().unix())
    )
  }
}