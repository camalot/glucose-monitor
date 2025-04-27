"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FoodAttribute {
    constructor(data) {
        this.allergens = data.allergens ? new FoodAttributeAllergen(data.allergens) : new FoodAttributeAllergen({});
        this.preferences = data.preferences ? new FoodAttributePreference(data.preferences) : new FoodAttributePreference({});
    }
}
class FoodAttributeAllergen {
    constructor(data) {
        this.allergen = Array.isArray(data.allergen) ? data.allergen : [];
    }
}
class FoodAttributePreference {
    constructor(data) {
        this.preference = Array.isArray(data.preference) ? data.preference : [];
    }
}
exports.default = FoodAttribute;
