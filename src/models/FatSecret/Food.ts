import FoodSubCategory from './FoodSubCategory';
import FoodImage from './FoodImage';
import Serving from './Serving';
import FoodAttribute from './FoodAttribute';

enum FoodType {
  GENERIC = "Generic",
  BRAND = "Brand",

  CUSTOM = "Custom"
}

class Food {
  food_id: number;
  food_name: string;
  food_type: FoodType; 
  brand_name?: string;
  food_sub_categories?: FoodSubCategories;
  food_url?: string;
  food_images?: FoodImages;
  food_attributes?: FoodAttribute;
  servings?: FoodServings;

  constructor(data: any) {
    this.food_id = data.food_id;
    this.food_name = data.food_name;
    this.food_type = data.food_type as FoodType;
    this.brand_name = data.brand_name || undefined;
    this.food_sub_categories = data.food_sub_categories ? new FoodSubCategories(data.food_sub_categories) : undefined;
    this.food_url = data.food_url || '';
    this.food_images = data.food_images ? new FoodImages(data.food_images) : undefined;
    this.servings = data.servings ? new FoodServings(data.servings) : undefined;
    if (data.food_attributes) {
      this.food_attributes = new FoodAttribute(data.food_attributes);
    }
  }
}

class FoodSubCategories {
  food_sub_category: string[]
  constructor(data: any) {
    this.food_sub_category = data.food_sub_category || []; // Default to an empty array
  }
}

class FoodServings {
  serving: Serving[];
  constructor(data: any) {
    this.serving = Array.isArray(data.serving)
      ? data.serving.map((item: any) => new Serving(item))
      : []; // Default to an empty array if data.serving is not an array
  }
}

class FoodImages {
  food_image: FoodImage[];
  constructor(data: any) {
    this.food_image = Array.isArray(data.food_image)
      ? data.food_image.map((img: any) => new FoodImage(img.image_url, img.image_type))
      : []; // Default to an empty array if data.food_image is not an array
  }
}

export default Food;
export type { FoodSubCategories, FoodServings, FoodImages };