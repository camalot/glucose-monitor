import IdKeyValue from "./IdKeyValue";

class FoodAttribute {
  allergens: FoodAttributeAllergen;
  preferences: FoodAttributePreference;
  constructor(data: any) {
    this.allergens = data.allergens ? new FoodAttributeAllergen(data.allergens) : new FoodAttributeAllergen({});
    this.preferences = data.preferences ? new FoodAttributePreference(data.preferences) : new FoodAttributePreference({});
  }
}

class FoodAttributeAllergen {
  allergen: IdKeyValue[];
  constructor(data: any) {
    this.allergen = Array.isArray(data.allergen) ? data.allergen : [];
  }
}

class FoodAttributePreference {
  preference: IdKeyValue[];  
  constructor(data: any) {
    this.preference = Array.isArray(data.preference) ? data.preference : [];
  }
}

export default FoodAttribute;
export type { FoodAttributeAllergen, FoodAttributePreference };