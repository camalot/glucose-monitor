"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FoodImage_1 = __importDefault(require("./FoodImage"));
const Serving_1 = __importDefault(require("./Serving"));
const FoodAttribute_1 = __importDefault(require("./FoodAttribute"));
var FoodType;
(function (FoodType) {
    FoodType["GENERIC"] = "Generic";
    FoodType["BRAND"] = "Brand";
    FoodType["CUSTOM"] = "Custom";
})(FoodType || (FoodType = {}));
class Food {
    constructor(data) {
        this.food_id = data.food_id;
        this.food_name = data.food_name;
        this.food_type = data.food_type;
        this.brand_name = data.brand_name || undefined;
        this.food_sub_categories = data.food_sub_categories ? new FoodSubCategories(data.food_sub_categories) : undefined;
        this.food_url = data.food_url || '';
        this.food_images = data.food_images ? new FoodImages(data.food_images) : undefined;
        this.servings = data.servings ? new FoodServings(data.servings) : undefined;
        if (data.food_attributes) {
            this.food_attributes = new FoodAttribute_1.default(data.food_attributes);
        }
    }
}
class FoodSubCategories {
    constructor(data) {
        this.food_sub_category = data.food_sub_category || []; // Default to an empty array
    }
}
class FoodServings {
    constructor(data) {
        this.serving = Array.isArray(data.serving)
            ? data.serving.map((item) => new Serving_1.default(item))
            : []; // Default to an empty array if data.serving is not an array
    }
}
class FoodImages {
    constructor(data) {
        this.food_image = Array.isArray(data.food_image)
            ? data.food_image.map((img) => new FoodImage_1.default(img.image_url, img.image_type))
            : []; // Default to an empty array if data.food_image is not an array
    }
}
exports.default = Food;
