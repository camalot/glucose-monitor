import moment from 'moment-timezone';
import Food from '../libs/FatSecret/structures/Food';
import Identity from '../libs/Identity';

export default class FoodEntry {
  [key: string]: any;
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
  quantity?: number;
  upc?: string;
  info_url?: string
  source?: string;
  source_id?: string | number;

  public readonly json: string;

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
    quantity?: number,
    upc?: string,
    info_url?: string,
    source?: string,
    source_id?: string | number,

  ) {
    this.name = name;
    this.brand = brand;
    this.description = description;
    this.serving = serving || undefined;
    this.weight = weight || undefined;
    this.weight_unit = weight ? weight_unit : undefined;
    this.calories = calories || undefined;
    this.calories_unit = calories ? calories_unit : undefined;
    this.carbs = carbs || undefined;
    this.carbs_unit = carbs ? carbs_unit : undefined;
    this.timestamp = timestamp || moment().unix();
    this.fat = fat || undefined;
    this.fat_unit = fat ? fat_unit : undefined;
    this.protein = protein || undefined;
    this.protein_unit = protein ? protein_unit : undefined;
    this.sodium = sodium || undefined;
    this.sodium_unit = sodium ? sodium_unit : undefined;
    this.cholesterol = cholesterol || undefined;
    this.cholesterol_unit = cholesterol ? cholesterol_unit : undefined;
    this.notes = notes || undefined;
    this.quantity = quantity || 1;

    this.upc = upc || undefined;
    this.info_url = info_url || undefined;

    this.source = source || undefined;
    this.source_id = source_id || undefined;
    this.json = JSON.stringify(
      Object.keys(this).reduce((result, key) => {
        if (key !== 'json') {
          result[key] = (this as Record<string, any>)[key];
        }
        return result;
      }, {} as Record<string, any>)
    );
  }

  static isEmpty(entry: FoodEntry): boolean {
    if (!entry || !entry.name) {
      return true;
    }

    return false;
  }

  static empty(): FoodEntry {
    return new FoodEntry(
      "", // name
      undefined, // brand
      undefined, // description
      undefined, // serving
      undefined, // weight
      undefined, // weight_unit
      undefined, // calories
      undefined, // calories_unit
      undefined, // carbs
      undefined, // carbs_unit
      undefined, // timestamp
      undefined, // fat
      undefined, // fat_unit
      undefined, // protein
      undefined, // protein_unit
      undefined, // sodium
      undefined, // sodium_unit
      undefined, // cholesterol
      undefined, // cholesterol_unit
      undefined, // notes
      1, // quantity
      undefined, // upc
      undefined, // info_url
      undefined, // source
      undefined, // source_id
    );
  }

  static fromFoodSearchResultV3(data: Food): FoodEntry {
    const firstServing = data.servings?.[0] || undefined;
    return new FoodEntry(
      data.name || "",
      data.brandName,
      firstServing?.description || undefined,
      firstServing?.metricServingAmount ? firstServing.metricServingAmount.valueOf() : undefined,
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
      1,
      undefined,
      data.url || undefined,
      'fatsecret',
      data.id || Identity.generate(data)
    )
  }
}