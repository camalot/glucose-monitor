import FoodEntry from "../../models/FoodEntry";
import moment from "moment-timezone";
import Food from "../../libs/FatSecret/structures/Food";
import { Serving } from "../../libs/FatSecret";
import { Units, UnitType } from "../../libs/Units";
import { Unit } from "mathjs";

describe("FoodEntry Class", () => {
  it("should initialize with correct values", () => {
    const timestamp = moment().unix();
    const foodEntry = new FoodEntry(
      "Apple",
      "Brand A",
      "Fresh Apple",
      "1 medium",
      150,
      "g",
      95,
      "kcal",
      25,
      "g",
      timestamp,
      0.3,
      "g",
      0.5,
      "g",
      1,
      "mg",
      0,
      "mg",
      "A healthy snack",
      1,
      "123456789012",
      "https://example.com/apple",
      "testSource",
      "testSourceId"
    );

    expect(foodEntry.name).toBe("Apple");
    expect(foodEntry.brand).toBe("Brand A");
    expect(foodEntry.description).toBe("Fresh Apple");
    expect(foodEntry.serving).toBe("1 medium");
    expect(foodEntry.weight).toBe(150);
    expect(foodEntry.weight_unit).toBe("g");
    expect(foodEntry.calories).toBe(95);
    expect(foodEntry.calories_unit).toBe("kcal");
    expect(foodEntry.carbs).toBe(25);
    expect(foodEntry.carbs_unit).toBe("g");
    expect(foodEntry.timestamp).toBe(timestamp);
    expect(foodEntry.fat).toBe(0.3);
    expect(foodEntry.fat_unit).toBe("g");
    expect(foodEntry.protein).toBe(0.5);
    expect(foodEntry.protein_unit).toBe("g");
    expect(foodEntry.sodium).toBe(1);
    expect(foodEntry.sodium_unit).toBe("mg");
    expect(foodEntry.cholesterol).toBeUndefined();
    expect(foodEntry.cholesterol_unit).toBeUndefined();
    expect(foodEntry.notes).toBe("A healthy snack");
    expect(foodEntry.quantity).toBe(1);
    expect(foodEntry.upc).toBe("123456789012");
    expect(foodEntry.info_url).toBe("https://example.com/apple");
    expect(foodEntry.source).toBe("testSource");
    expect(foodEntry.source_id).toBe("testSourceId");
  });

  it("should return an empty FoodEntry object when using empty()", () => {
    const emptyFoodEntry = FoodEntry.empty();

    expect(emptyFoodEntry.name).toBe("");
    expect(emptyFoodEntry.quantity).toBe(1);
    expect(emptyFoodEntry.timestamp).toBeDefined();
  });

  it("should set name to empty string if name is not defined", () => {
    const mockFood: Food = {
      name: undefined,
      computeServing: function (amount: math.Unit, roundN?: number): Serving | undefined {
        throw new Error("Function not implemented.");
      },
      toJSON: function (): { id: string | undefined; name: string | undefined; type: "Brand" | "Generic" | undefined; brandName: string | undefined; url: string | undefined; servings: { id: string | undefined; description: string | undefined; url: string | undefined; measurementDescription: string | undefined; metricServingAmount: number | null; metricServingUnit: string | null; numberOfUnits: number | undefined; calories: number | undefined; carbohydrate: number | undefined; protein: number | undefined; fat: number | undefined; saturatedFat: number | undefined; polyunsaturatedFat: number | undefined; monounsaturatedFat: number | undefined; transFat: number | undefined; cholesterol: number | undefined; sodium: number | undefined; potassium: number | undefined; fiber: number | undefined; sugar: number | undefined; addedSugars: number | undefined; vitaminD: number | undefined; vitaminA: number | undefined; vitaminC: number | undefined; calcium: number | undefined; iron: number | undefined; }[] | undefined; } {
        throw new Error("Function not implemented.");
      }
    }

    const foodEntry = FoodEntry.fromFoodSearchResultV3(mockFood);
    
    expect(foodEntry.name).toBe("");
    expect(foodEntry.quantity).toBe(1);
    expect(foodEntry.timestamp).toBeDefined();
  });

  it("should correctly create a FoodEntry from FoodSearchResultV3", () => {
    const mockFood: Food = {
      name: "Banana",
      brandName: "Brand B",
      servings: [
        {
          description: "1 medium (118g)",
          metricServingAmount: Units.toUnit(UnitType.G, 118),
          calories: Units.toUnit(UnitType.KCAL, 105),
          carbohydrate: Units.toUnit(UnitType.G, 27),
          fat: Units.toUnit(UnitType.G, 0.3),
          protein: Units.toUnit(UnitType.G, 1.3),
          sodium: Units.toUnit(UnitType.G, 1),
          cholesterol: Units.toUnit(UnitType.MG, 0),
          computeServing: function (amount: math.Unit, roundN?: number): Serving | undefined {
            throw new Error("Function not implemented.");
          },
          toJSON: function (): { id: string | undefined; description: string | undefined; url: string | undefined; measurementDescription: string | undefined; metricServingAmount: number | null; metricServingUnit: string | null; numberOfUnits: number | undefined; calories: number | undefined; carbohydrate: number | undefined; protein: number | undefined; fat: number | undefined; saturatedFat: number | undefined; polyunsaturatedFat: number | undefined; monounsaturatedFat: number | undefined; transFat: number | undefined; cholesterol: number | undefined; sodium: number | undefined; potassium: number | undefined; fiber: number | undefined; sugar: number | undefined; addedSugars: number | undefined; vitaminD: number | undefined; vitaminA: number | undefined; vitaminC: number | undefined; calcium: number | undefined; iron: number | undefined; } {
            throw new Error("Function not implemented.");
          },
          debugLog: function (): void {
            throw new Error("Function not implemented.");
          }
        }
      ],
      url: "https://example.com/banana",
      id: "banana123",
      computeServing: function (amount: math.Unit, roundN?: number): Serving | undefined {
        throw new Error("Function not implemented.");
      },
      toJSON: function (): { id: string | undefined; name: string | undefined; type: "Brand" | "Generic" | undefined; brandName: string | undefined; url: string | undefined; servings: { id: string | undefined; description: string | undefined; url: string | undefined; measurementDescription: string | undefined; metricServingAmount: number | null; metricServingUnit: string | null; numberOfUnits: number | undefined; calories: number | undefined; carbohydrate: number | undefined; protein: number | undefined; fat: number | undefined; saturatedFat: number | undefined; polyunsaturatedFat: number | undefined; monounsaturatedFat: number | undefined; transFat: number | undefined; cholesterol: number | undefined; sodium: number | undefined; potassium: number | undefined; fiber: number | undefined; sugar: number | undefined; addedSugars: number | undefined; vitaminD: number | undefined; vitaminA: number | undefined; vitaminC: number | undefined; calcium: number | undefined; iron: number | undefined; }[] | undefined; } {
        throw new Error("Function not implemented.");
      }
    };

    const foodEntry = FoodEntry.fromFoodSearchResultV3(mockFood);

    expect(foodEntry.name).toBe("Banana");
    expect(foodEntry.brand).toBe("Brand B");
    expect(foodEntry.description).toBe("1 medium (118g)");
    expect(foodEntry.serving).toBe("118 g");
    expect(foodEntry.weight).toBeUndefined();
    expect(foodEntry.weight_unit).toBeUndefined();
    expect(foodEntry.calories).toBe(105);
    expect(foodEntry.calories_unit).toBe("kcal");
    expect(foodEntry.carbs).toBe(27);
    expect(foodEntry.carbs_unit).toBe("g");
    expect(foodEntry.fat).toBe(0.3);
    expect(foodEntry.fat_unit).toBe("g");
    expect(foodEntry.protein).toBe(1.3);
    expect(foodEntry.protein_unit).toBe("g");
    expect(foodEntry.sodium).toBe(1);
    expect(foodEntry.sodium_unit).toBe("g");
    expect(foodEntry.cholesterol).toBeUndefined();
    expect(foodEntry.cholesterol_unit).toBeUndefined();
    expect(foodEntry.info_url).toBe("https://example.com/banana");
    expect(foodEntry.source).toBe("fatsecret");
    expect(foodEntry.source_id).toBe("banana123");
  });

  it("should correctly serialize to JSON", () => {
    const foodEntry = new FoodEntry(
      "Orange",
      "Brand C",
      "Fresh Orange",
      "1 medium",
      130,
      "g",
      62,
      "kcal",
      15,
      "g",
      moment().unix(),
      0.2,
      "g",
      1.2,
      "g",
      0,
      "mg",
      0,
      "mg",
      "A juicy fruit",
      1,
      "987654321098",
      "https://example.com/orange",
      "testSource",
      "testSourceId"
    );

    const json = JSON.parse(foodEntry.json);

    expect(json.name).toBe("Orange");
    expect(json.brand).toBe("Brand C");
    expect(json.description).toBe("Fresh Orange");
    expect(json.serving).toBe("1 medium");
    expect(json.weight).toBe(130);
    expect(json.weight_unit).toBe("g");
    expect(json.calories).toBe(62);
    expect(json.calories_unit).toBe("kcal");
    expect(json.carbs).toBe(15);
    expect(json.carbs_unit).toBe("g");
    expect(json.notes).toBe("A juicy fruit");
    expect(json.upc).toBe("987654321098");
    expect(json.info_url).toBe("https://example.com/orange");
  });
  it("should return true for an empty FoodEntry object", () => {
    const emptyEntry = FoodEntry.empty();
    expect(FoodEntry.isEmpty(emptyEntry)).toBe(true);
  });

  it("should return true for null or undefined FoodEntry", () => {
    expect(FoodEntry.isEmpty(null as unknown as FoodEntry)).toBe(true);
    expect(FoodEntry.isEmpty(undefined as unknown as FoodEntry)).toBe(true);
  });

  it("should return true for a FoodEntry with only an empty name", () => {
    const entry = new FoodEntry("");
    expect(FoodEntry.isEmpty(entry)).toBe(true);
  });

  it("should return false for a non-empty FoodEntry", () => {
    const entry = new FoodEntry("Apple");
    expect(FoodEntry.isEmpty(entry)).toBe(false);
  });

  it("should return a FoodEntry object with default values", () => {
    const emptyEntry = FoodEntry.empty();

    expect(emptyEntry.name).toBe("");
    expect(emptyEntry.brand).toBeUndefined();
    expect(emptyEntry.description).toBeUndefined();
    expect(emptyEntry.serving).toBeUndefined();
    expect(emptyEntry.weight).toBeUndefined();
    expect(emptyEntry.weight_unit).toBeUndefined();
    expect(emptyEntry.calories).toBeUndefined();
    expect(emptyEntry.calories_unit).toBeUndefined();
    expect(emptyEntry.carbs).toBeUndefined();
    expect(emptyEntry.carbs_unit).toBeUndefined();
    expect(emptyEntry.timestamp).toBeDefined();
    expect(emptyEntry.fat).toBeUndefined();
    expect(emptyEntry.fat_unit).toBeUndefined();
    expect(emptyEntry.protein).toBeUndefined();
    expect(emptyEntry.protein_unit).toBeUndefined();
    expect(emptyEntry.sodium).toBeUndefined();
    expect(emptyEntry.sodium_unit).toBeUndefined();
    expect(emptyEntry.cholesterol).toBeUndefined();
    expect(emptyEntry.cholesterol_unit).toBeUndefined();
    expect(emptyEntry.notes).toBeUndefined();
    expect(emptyEntry.quantity).toBe(1);
    expect(emptyEntry.upc).toBeUndefined();
    expect(emptyEntry.info_url).toBeUndefined();
    expect(emptyEntry.source).toBeUndefined();
    expect(emptyEntry.source_id).toBeUndefined();
  });
});

describe("FoodEntry Class - Constructor", () => {
  it("should set weight_unit when weight is provided", () => {
    const entry = new FoodEntry("Apple", undefined, undefined, undefined, 100, UnitType.G);
    expect(entry.weight_unit).toBe(UnitType.G);
  });

  it("should set weight_unit to undefined when weight is not provided", () => {
    const entry = new FoodEntry("Apple");
    expect(entry.weight_unit).toBeUndefined();
  });

  it("should set calories_unit when calories are provided", () => {
    const entry = new FoodEntry("Apple", undefined, undefined, undefined, undefined, undefined, 50, "kcal");
    expect(entry.calories_unit).toBe("kcal");
  });

  it("should set calories_unit to undefined when calories are not provided", () => {
    const entry = new FoodEntry("Apple");
    expect(entry.calories_unit).toBeUndefined();
  });

  it("should set carbs_unit when carbs are provided", () => {
    const entry = new FoodEntry("Apple", undefined, undefined, undefined, undefined, undefined, undefined, undefined, 20, "g");
    expect(entry.carbs_unit).toBe("g");
  });

  it("should set carbs_unit to undefined when carbs are not provided", () => {
    const entry = new FoodEntry("Apple");
    expect(entry.carbs_unit).toBeUndefined();
  });

  it("should set fat_unit when fat is provided", () => {
    const entry = new FoodEntry("Apple", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 0.5, "g");
    expect(entry.fat_unit).toBe("g");
  });

  it("should set fat_unit to undefined when fat is not provided", () => {
    const entry = new FoodEntry("Apple");
    expect(entry.fat_unit).toBeUndefined();
  });

  it("should set protein_unit when protein is provided", () => {
    const entry = new FoodEntry("Apple", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 1, "g");
    expect(entry.protein_unit).toBe("g");
  });

  it("should set protein_unit to undefined when protein is not provided", () => {
    const entry = new FoodEntry("Apple");
    expect(entry.protein_unit).toBeUndefined();
  });

  it("should set sodium_unit when sodium is provided", () => {
    const entry = new FoodEntry("Apple", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 10, "mg");
    expect(entry.sodium_unit).toBe("mg");
  });

  it("should set sodium_unit to undefined when sodium is not provided", () => {
    const entry = new FoodEntry("Apple");
    expect(entry.sodium_unit).toBeUndefined();
  });

  it("should set cholesterol_unit when cholesterol is provided", () => {
    const entry = new FoodEntry("Apple", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 5, "mg");
    expect(entry.cholesterol_unit).toBe("mg");
  });

  it("should set cholesterol_unit to undefined when cholesterol is not provided", () => {
    const entry = new FoodEntry("Apple");
    expect(entry.cholesterol_unit).toBeUndefined();
  });
});


describe("FoodEntry.fromFoodSearchResultV3", () => {
  it("should correctly create a FoodEntry when all properties are provided", () => {
    const mockFood: Food = {
      name: "Banana",
      brandName: "Brand B",
      servings: [
        {
          description: "1 medium (118g)",
          metricServingAmount: Units.toUnit(UnitType.G, 118),
          calories: Units.toUnit(UnitType.KCAL, 105),
          carbohydrate: Units.toUnit(UnitType.G, 27),
          fat: Units.toUnit(UnitType.G, 0.3),
          protein: Units.toUnit(UnitType.G, 1.3),
          sodium: Units.toUnit(UnitType.MG, 1),
          cholesterol: Units.toUnit(UnitType.MG, 0),
          computeServing: function (amount: math.Unit, roundN?: number): Serving | undefined {
            throw new Error("Function not implemented.");
          },
          toJSON: function (): { id: string | undefined; description: string | undefined; url: string | undefined; measurementDescription: string | undefined; metricServingAmount: number | null; metricServingUnit: string | null; numberOfUnits: number | undefined; calories: number | undefined; carbohydrate: number | undefined; protein: number | undefined; fat: number | undefined; saturatedFat: number | undefined; polyunsaturatedFat: number | undefined; monounsaturatedFat: number | undefined; transFat: number | undefined; cholesterol: number | undefined; sodium: number | undefined; potassium: number | undefined; fiber: number | undefined; sugar: number | undefined; addedSugars: number | undefined; vitaminD: number | undefined; vitaminA: number | undefined; vitaminC: number | undefined; calcium: number | undefined; iron: number | undefined; } {
            throw new Error("Function not implemented.");
          },
          debugLog: function (): void {
            throw new Error("Function not implemented.");
          }
        },
      ],
      url: "https://example.com/banana",
      id: "banana123",
      computeServing: function (amount: math.Unit, roundN?: number): Serving | undefined {
        throw new Error("Function not implemented.");
      },
      toJSON: function (): { id: string | undefined; name: string | undefined; type: "Brand" | "Generic" | undefined; brandName: string | undefined; url: string | undefined; servings: { id: string | undefined; description: string | undefined; url: string | undefined; measurementDescription: string | undefined; metricServingAmount: number | null; metricServingUnit: string | null; numberOfUnits: number | undefined; calories: number | undefined; carbohydrate: number | undefined; protein: number | undefined; fat: number | undefined; saturatedFat: number | undefined; polyunsaturatedFat: number | undefined; monounsaturatedFat: number | undefined; transFat: number | undefined; cholesterol: number | undefined; sodium: number | undefined; potassium: number | undefined; fiber: number | undefined; sugar: number | undefined; addedSugars: number | undefined; vitaminD: number | undefined; vitaminA: number | undefined; vitaminC: number | undefined; calcium: number | undefined; iron: number | undefined; }[] | undefined; } {
        throw new Error("Function not implemented.");
      }
    };

    const foodEntry = FoodEntry.fromFoodSearchResultV3(mockFood);

    expect(foodEntry.name).toBe("Banana");
    expect(foodEntry.brand).toBe("Brand B");
    expect(foodEntry.description).toBe("1 medium (118g)");
    expect(foodEntry.serving).toBe("118 g");
    expect(foodEntry.weight).toBeUndefined();
    expect(foodEntry.weight_unit).toBeUndefined();
    expect(foodEntry.calories).toBe(105);
    expect(foodEntry.calories_unit).toBe("kcal");
    expect(foodEntry.carbs).toBe(27);
    expect(foodEntry.carbs_unit).toBe("g");
    expect(foodEntry.fat).toBe(0.3);
    expect(foodEntry.fat_unit).toBe("g");
    expect(foodEntry.protein).toBe(1.3);
    expect(foodEntry.protein_unit).toBe("g");
    expect(foodEntry.sodium).toBe(1);
    expect(foodEntry.sodium_unit).toBe("g");
    expect(foodEntry.cholesterol).toBeUndefined();
    expect(foodEntry.cholesterol_unit).toBeUndefined();
    expect(foodEntry.info_url).toBe("https://example.com/banana");
    expect(foodEntry.source).toBe("fatsecret");
    expect(foodEntry.source_id).toBe("banana123");
  });

  it("should handle missing servings gracefully", () => {
    const mockFood: Food = {
      name: "Apple",
      brandName: "Brand A",
      servings: [],
      url: "https://example.com/apple",
      id: "apple123",
      computeServing: function (amount: math.Unit, roundN?: number): Serving | undefined {
        throw new Error("Function not implemented.");
      },
      toJSON: function (): { id: string | undefined; name: string | undefined; type: "Brand" | "Generic" | undefined; brandName: string | undefined; url: string | undefined; servings: { id: string | undefined; description: string | undefined; url: string | undefined; measurementDescription: string | undefined; metricServingAmount: number | null; metricServingUnit: string | null; numberOfUnits: number | undefined; calories: number | undefined; carbohydrate: number | undefined; protein: number | undefined; fat: number | undefined; saturatedFat: number | undefined; polyunsaturatedFat: number | undefined; monounsaturatedFat: number | undefined; transFat: number | undefined; cholesterol: number | undefined; sodium: number | undefined; potassium: number | undefined; fiber: number | undefined; sugar: number | undefined; addedSugars: number | undefined; vitaminD: number | undefined; vitaminA: number | undefined; vitaminC: number | undefined; calcium: number | undefined; iron: number | undefined; }[] | undefined; } {
        throw new Error("Function not implemented.");
      }
    };

    const foodEntry = FoodEntry.fromFoodSearchResultV3(mockFood);

    expect(foodEntry.name).toBe("Apple");
    expect(foodEntry.brand).toBe("Brand A");
    expect(foodEntry.description).toBeUndefined();
    expect(foodEntry.serving).toBeUndefined();
    expect(foodEntry.weight).toBeUndefined();
    expect(foodEntry.weight_unit).toBeUndefined();
    expect(foodEntry.calories).toBeUndefined();
    expect(foodEntry.calories_unit).toBeUndefined();
    expect(foodEntry.carbs).toBeUndefined();
    expect(foodEntry.carbs_unit).toBeUndefined();
    expect(foodEntry.fat).toBeUndefined();
    expect(foodEntry.fat_unit).toBeUndefined();
    expect(foodEntry.protein).toBeUndefined();
    expect(foodEntry.protein_unit).toBeUndefined();
    expect(foodEntry.sodium).toBeUndefined();
    expect(foodEntry.sodium_unit).toBeUndefined();
    expect(foodEntry.cholesterol).toBeUndefined();
    expect(foodEntry.cholesterol_unit).toBeUndefined();
    expect(foodEntry.info_url).toBe("https://example.com/apple");
    expect(foodEntry.source).toBe("fatsecret");
    expect(foodEntry.source_id).toBe("apple123");
  });

  it("should handle missing optional properties in the first serving", () => {
    const mockFood: Food = {
      name: "Orange",
      brandName: "Brand C",
      servings: [
        {
          description: undefined,
          metricServingAmount: undefined,
          calories: undefined,
          carbohydrate: undefined,
          fat: undefined,
          protein: undefined,
          sodium: undefined,
          cholesterol: undefined,
          computeServing: function (amount: math.Unit, roundN?: number): Serving | undefined {
            throw new Error("Function not implemented.");
          },
          toJSON: function (): { id: string | undefined; description: string | undefined; url: string | undefined; measurementDescription: string | undefined; metricServingAmount: number | null; metricServingUnit: string | null; numberOfUnits: number | undefined; calories: number | undefined; carbohydrate: number | undefined; protein: number | undefined; fat: number | undefined; saturatedFat: number | undefined; polyunsaturatedFat: number | undefined; monounsaturatedFat: number | undefined; transFat: number | undefined; cholesterol: number | undefined; sodium: number | undefined; potassium: number | undefined; fiber: number | undefined; sugar: number | undefined; addedSugars: number | undefined; vitaminD: number | undefined; vitaminA: number | undefined; vitaminC: number | undefined; calcium: number | undefined; iron: number | undefined; } {
            throw new Error("Function not implemented.");
          },
          debugLog: function (): void {
            throw new Error("Function not implemented.");
          }
        },
      ],
      url: undefined,
      id: undefined,
      computeServing: function (amount: math.Unit, roundN?: number): Serving | undefined {
        throw new Error("Function not implemented.");
      },
      toJSON: function (): { id: string | undefined; name: string | undefined; type: "Brand" | "Generic" | undefined; brandName: string | undefined; url: string | undefined; servings: { id: string | undefined; description: string | undefined; url: string | undefined; measurementDescription: string | undefined; metricServingAmount: number | null; metricServingUnit: string | null; numberOfUnits: number | undefined; calories: number | undefined; carbohydrate: number | undefined; protein: number | undefined; fat: number | undefined; saturatedFat: number | undefined; polyunsaturatedFat: number | undefined; monounsaturatedFat: number | undefined; transFat: number | undefined; cholesterol: number | undefined; sodium: number | undefined; potassium: number | undefined; fiber: number | undefined; sugar: number | undefined; addedSugars: number | undefined; vitaminD: number | undefined; vitaminA: number | undefined; vitaminC: number | undefined; calcium: number | undefined; iron: number | undefined; }[] | undefined; } {
        throw new Error("Function not implemented.");
      }
    };

    const foodEntry = FoodEntry.fromFoodSearchResultV3(mockFood);

    expect(foodEntry.name).toBe("Orange");
    expect(foodEntry.brand).toBe("Brand C");
    expect(foodEntry.description).toBeUndefined();
    expect(foodEntry.serving).toBeUndefined();
    expect(foodEntry.weight).toBeUndefined();
    expect(foodEntry.weight_unit).toBeUndefined();
    expect(foodEntry.calories).toBeUndefined();
    expect(foodEntry.calories_unit).toBeUndefined(); // Updated to beUndefined()
    expect(foodEntry.carbs).toBeUndefined();
    expect(foodEntry.carbs_unit).toBeUndefined(); // Updated to beUndefined()
    expect(foodEntry.fat).toBeUndefined();
    expect(foodEntry.fat_unit).toBeUndefined();
    expect(foodEntry.protein).toBeUndefined();
    expect(foodEntry.protein_unit).toBeUndefined();
    expect(foodEntry.sodium).toBeUndefined();
    expect(foodEntry.sodium_unit).toBeUndefined(); // Updated to beUndefined()
    expect(foodEntry.cholesterol).toBeUndefined();
    expect(foodEntry.cholesterol_unit).toBeUndefined();
    expect(foodEntry.info_url).toBeUndefined();
    expect(foodEntry.source).toBe("fatsecret");
    expect(foodEntry.source_id).toBeDefined(); // Should generate a unique ID
  });

  it("should handle missing servings and missing brandName", () => {
    const mockFood: Food = {
      name: "Grapes",
      servings: [],
      url: undefined,
      id: undefined,
      computeServing: function (amount: math.Unit, roundN?: number): Serving | undefined {
        throw new Error("Function not implemented.");
      },
      toJSON: function (): { id: string | undefined; name: string | undefined; type: "Brand" | "Generic" | undefined; brandName: string | undefined; url: string | undefined; servings: { id: string | undefined; description: string | undefined; url: string | undefined; measurementDescription: string | undefined; metricServingAmount: number | null; metricServingUnit: string | null; numberOfUnits: number | undefined; calories: number | undefined; carbohydrate: number | undefined; protein: number | undefined; fat: number | undefined; saturatedFat: number | undefined; polyunsaturatedFat: number | undefined; monounsaturatedFat: number | undefined; transFat: number | undefined; cholesterol: number | undefined; sodium: number | undefined; potassium: number | undefined; fiber: number | undefined; sugar: number | undefined; addedSugars: number | undefined; vitaminD: number | undefined; vitaminA: number | undefined; vitaminC: number | undefined; calcium: number | undefined; iron: number | undefined; }[] | undefined; } {
        throw new Error("Function not implemented.");
      }
    };

    const foodEntry = FoodEntry.fromFoodSearchResultV3(mockFood);

    expect(foodEntry.name).toBe("Grapes");
    expect(foodEntry.brand).toBeUndefined();
    expect(foodEntry.description).toBeUndefined();
    expect(foodEntry.serving).toBeUndefined();
    expect(foodEntry.weight).toBeUndefined();
    expect(foodEntry.weight_unit).toBeUndefined();
    expect(foodEntry.calories).toBeUndefined();
    expect(foodEntry.calories_unit).toBeUndefined();
    expect(foodEntry.carbs).toBeUndefined();
    expect(foodEntry.carbs_unit).toBeUndefined();
    expect(foodEntry.fat).toBeUndefined();
    expect(foodEntry.fat_unit).toBeUndefined();
    expect(foodEntry.protein).toBeUndefined();
    expect(foodEntry.protein_unit).toBeUndefined();
    expect(foodEntry.sodium).toBeUndefined();
    expect(foodEntry.sodium_unit).toBeUndefined();
    expect(foodEntry.cholesterol).toBeUndefined();
    expect(foodEntry.cholesterol_unit).toBeUndefined();
    expect(foodEntry.info_url).toBeUndefined();
    expect(foodEntry.source).toBe("fatsecret");
    expect(foodEntry.source_id).toBeDefined(); // Should generate a unique ID
  });

  it("should have cholesterol undefined if the serving is undefined", () => {
    const mockFood: Food = {
      name: "Orange",
      brandName: "Brand C",
      servings: undefined,
      url: "https://example.com/orange",
      id: "orange123",
      computeServing: function (amount: math.Unit, roundN?: number): Serving | undefined {
        throw new Error("Function not implemented.");
      },
      toJSON: function (): { id: string | undefined; name: string | undefined; type: "Brand" | "Generic" | undefined; brandName: string | undefined; url: string | undefined; servings: { id: string | undefined; description: string | undefined; url: string | undefined; measurementDescription: string | undefined; metricServingAmount: number | null; metricServingUnit: string | null; numberOfUnits: number | undefined; calories: number | undefined; carbohydrate: number | undefined; protein: number | undefined; fat: number | undefined; saturatedFat: number | undefined; polyunsaturatedFat: number | undefined; monounsaturatedFat: number | undefined; transFat: number | undefined; cholesterol: number | undefined; sodium: number | undefined; potassium: number | undefined; fiber: number | undefined; sugar: number | undefined; addedSugars: number | undefined; vitaminD: number | undefined; vitaminA: number | undefined; vitaminC: number | undefined; calcium: number | undefined; iron: number | undefined; }[] | undefined; } {
        throw new Error("Function not implemented.");
      }
    };

    const foodEntry = FoodEntry.fromFoodSearchResultV3(mockFood);

    expect(foodEntry.serving).toBeUndefined(); 
    expect(foodEntry.cholesterol).toBeUndefined(); 
  });

  it("should have cholesterol undefined if the value is undefined", () => {
    const mockFood: Food = {
      name: "Orange",
      brandName: "Brand C",
      servings: [
        {
          description: "1 medium (150g)",
          metricServingAmount: undefined,
          cholesterol: undefined,
          computeServing: function (amount: math.Unit, roundN?: number): Serving | undefined {
            throw new Error("Function not implemented.");
          },
          toJSON: function (): { id: string | undefined; description: string | undefined; url: string | undefined; measurementDescription: string | undefined; metricServingAmount: number | null; metricServingUnit: string | null; numberOfUnits: number | undefined; calories: number | undefined; carbohydrate: number | undefined; protein: number | undefined; fat: number | undefined; saturatedFat: number | undefined; polyunsaturatedFat: number | undefined; monounsaturatedFat: number | undefined; transFat: number | undefined; cholesterol: number | undefined; sodium: number | undefined; potassium: number | undefined; fiber: number | undefined; sugar: number | undefined; addedSugars: number | undefined; vitaminD: number | undefined; vitaminA: number | undefined; vitaminC: number | undefined; calcium: number | undefined; iron: number | undefined; } {
            throw new Error("Function not implemented.");
          },
          debugLog: function (): void {
            throw new Error("Function not implemented.");
          }
        }
      ],
      url: "https://example.com/orange",
      id: "orange123",
      computeServing: function (amount: math.Unit, roundN?: number): Serving | undefined {
        throw new Error("Function not implemented.");
      },
      toJSON: function (): { id: string | undefined; name: string | undefined; type: "Brand" | "Generic" | undefined; brandName: string | undefined; url: string | undefined; servings: { id: string | undefined; description: string | undefined; url: string | undefined; measurementDescription: string | undefined; metricServingAmount: number | null; metricServingUnit: string | null; numberOfUnits: number | undefined; calories: number | undefined; carbohydrate: number | undefined; protein: number | undefined; fat: number | undefined; saturatedFat: number | undefined; polyunsaturatedFat: number | undefined; monounsaturatedFat: number | undefined; transFat: number | undefined; cholesterol: number | undefined; sodium: number | undefined; potassium: number | undefined; fiber: number | undefined; sugar: number | undefined; addedSugars: number | undefined; vitaminD: number | undefined; vitaminA: number | undefined; vitaminC: number | undefined; calcium: number | undefined; iron: number | undefined; }[] | undefined; } {
        throw new Error("Function not implemented.");
      }
    };

    const foodEntry = FoodEntry.fromFoodSearchResultV3(mockFood);

    expect(foodEntry.cholesterol).toBeUndefined(); 
  });

  it("should have cholesterol undefined if the value is 0", () => {
    const mockFood: Food = {
      name: "Orange",
      brandName: "Brand C",
      servings: [
        {
          description: "1 medium (150g)",
          metricServingAmount: undefined,
          cholesterol: Units.toUnit(UnitType.MG, 0),
          computeServing: function (amount: math.Unit, roundN?: number): Serving | undefined {
            throw new Error("Function not implemented.");
          },
          toJSON: function (): { id: string | undefined; description: string | undefined; url: string | undefined; measurementDescription: string | undefined; metricServingAmount: number | null; metricServingUnit: string | null; numberOfUnits: number | undefined; calories: number | undefined; carbohydrate: number | undefined; protein: number | undefined; fat: number | undefined; saturatedFat: number | undefined; polyunsaturatedFat: number | undefined; monounsaturatedFat: number | undefined; transFat: number | undefined; cholesterol: number | undefined; sodium: number | undefined; potassium: number | undefined; fiber: number | undefined; sugar: number | undefined; addedSugars: number | undefined; vitaminD: number | undefined; vitaminA: number | undefined; vitaminC: number | undefined; calcium: number | undefined; iron: number | undefined; } {
            throw new Error("Function not implemented.");
          },
          debugLog: function (): void {
            throw new Error("Function not implemented.");
          }
        }
      ],
      url: "https://example.com/orange",
      id: "orange123",
      computeServing: function (amount: math.Unit, roundN?: number): Serving | undefined {
        throw new Error("Function not implemented.");
      },
      toJSON: function (): { id: string | undefined; name: string | undefined; type: "Brand" | "Generic" | undefined; brandName: string | undefined; url: string | undefined; servings: { id: string | undefined; description: string | undefined; url: string | undefined; measurementDescription: string | undefined; metricServingAmount: number | null; metricServingUnit: string | null; numberOfUnits: number | undefined; calories: number | undefined; carbohydrate: number | undefined; protein: number | undefined; fat: number | undefined; saturatedFat: number | undefined; polyunsaturatedFat: number | undefined; monounsaturatedFat: number | undefined; transFat: number | undefined; cholesterol: number | undefined; sodium: number | undefined; potassium: number | undefined; fiber: number | undefined; sugar: number | undefined; addedSugars: number | undefined; vitaminD: number | undefined; vitaminA: number | undefined; vitaminC: number | undefined; calcium: number | undefined; iron: number | undefined; }[] | undefined; } {
        throw new Error("Function not implemented.");
      }
    };

    const foodEntry = FoodEntry.fromFoodSearchResultV3(mockFood);

    expect(foodEntry.cholesterol).toBeUndefined();
  });

  it("should have cholesterol set if the value is greater than 0", () => {
    const mockFood: Food = {
      name: "Orange",
      brandName: "Brand C",
      servings: [
        {
          description: "1 medium (150g)",
          metricServingAmount: undefined,
          cholesterol: Units.toUnit(UnitType.MG, 5),
          computeServing: function (amount: math.Unit, roundN?: number): Serving | undefined {
            throw new Error("Function not implemented.");
          },
          toJSON: function (): { id: string | undefined; description: string | undefined; url: string | undefined; measurementDescription: string | undefined; metricServingAmount: number | null; metricServingUnit: string | null; numberOfUnits: number | undefined; calories: number | undefined; carbohydrate: number | undefined; protein: number | undefined; fat: number | undefined; saturatedFat: number | undefined; polyunsaturatedFat: number | undefined; monounsaturatedFat: number | undefined; transFat: number | undefined; cholesterol: number | undefined; sodium: number | undefined; potassium: number | undefined; fiber: number | undefined; sugar: number | undefined; addedSugars: number | undefined; vitaminD: number | undefined; vitaminA: number | undefined; vitaminC: number | undefined; calcium: number | undefined; iron: number | undefined; } {
            throw new Error("Function not implemented.");
          },
          debugLog: function (): void {
            throw new Error("Function not implemented.");
          }
        }
      ],
      url: "https://example.com/orange",
      id: "orange123",
      computeServing: function (amount: math.Unit, roundN?: number): Serving | undefined {
        throw new Error("Function not implemented.");
      },
      toJSON: function (): { id: string | undefined; name: string | undefined; type: "Brand" | "Generic" | undefined; brandName: string | undefined; url: string | undefined; servings: { id: string | undefined; description: string | undefined; url: string | undefined; measurementDescription: string | undefined; metricServingAmount: number | null; metricServingUnit: string | null; numberOfUnits: number | undefined; calories: number | undefined; carbohydrate: number | undefined; protein: number | undefined; fat: number | undefined; saturatedFat: number | undefined; polyunsaturatedFat: number | undefined; monounsaturatedFat: number | undefined; transFat: number | undefined; cholesterol: number | undefined; sodium: number | undefined; potassium: number | undefined; fiber: number | undefined; sugar: number | undefined; addedSugars: number | undefined; vitaminD: number | undefined; vitaminA: number | undefined; vitaminC: number | undefined; calcium: number | undefined; iron: number | undefined; }[] | undefined; } {
        throw new Error("Function not implemented.");
      }
    };

    const foodEntry = FoodEntry.fromFoodSearchResultV3(mockFood);

    expect(foodEntry.cholesterol).toBe(5);
  });
});

describe("FoodEntry.fromFoodSearchResultV3 - metricServingAmount Branches", () => {
  it("should set serving to undefined when firstServing is undefined", () => {
    const mockFood: Food = {
      name: "Apple",
      brandName: "Brand A",
      servings: undefined, // No servings provided
      url: "https://example.com/apple",
      id: "apple123",
      computeServing: function (amount: math.Unit, roundN?: number): Serving | undefined {
        throw new Error("Function not implemented.");
      },
      toJSON: function (): { id: string | undefined; name: string | undefined; type: "Brand" | "Generic" | undefined; brandName: string | undefined; url: string | undefined; servings: { id: string | undefined; description: string | undefined; url: string | undefined; measurementDescription: string | undefined; metricServingAmount: number | null; metricServingUnit: string | null; numberOfUnits: number | undefined; calories: number | undefined; carbohydrate: number | undefined; protein: number | undefined; fat: number | undefined; saturatedFat: number | undefined; polyunsaturatedFat: number | undefined; monounsaturatedFat: number | undefined; transFat: number | undefined; cholesterol: number | undefined; sodium: number | undefined; potassium: number | undefined; fiber: number | undefined; sugar: number | undefined; addedSugars: number | undefined; vitaminD: number | undefined; vitaminA: number | undefined; vitaminC: number | undefined; calcium: number | undefined; iron: number | undefined; }[] | undefined; } {
        throw new Error("Function not implemented.");
      }
    };

    const foodEntry = FoodEntry.fromFoodSearchResultV3(mockFood);

    expect(foodEntry.serving).toBeUndefined();
  });

  it("should set serving to undefined when firstServing.metricServingAmount is undefined", () => {
    const mockFood: Food = {
      name: "Banana",
      brandName: "Brand B",
      servings: [
        {
          description: "1 medium (118g)",
          metricServingAmount: undefined,
          computeServing: function (amount: math.Unit, roundN?: number): Serving | undefined {
            throw new Error("Function not implemented.");
          },
          toJSON: function (): { id: string | undefined; description: string | undefined; url: string | undefined; measurementDescription: string | undefined; metricServingAmount: number | null; metricServingUnit: string | null; numberOfUnits: number | undefined; calories: number | undefined; carbohydrate: number | undefined; protein: number | undefined; fat: number | undefined; saturatedFat: number | undefined; polyunsaturatedFat: number | undefined; monounsaturatedFat: number | undefined; transFat: number | undefined; cholesterol: number | undefined; sodium: number | undefined; potassium: number | undefined; fiber: number | undefined; sugar: number | undefined; addedSugars: number | undefined; vitaminD: number | undefined; vitaminA: number | undefined; vitaminC: number | undefined; calcium: number | undefined; iron: number | undefined; } {
            throw new Error("Function not implemented.");
          },
          debugLog: function (): void {
            throw new Error("Function not implemented.");
          }
        },
      ],
      url: "https://example.com/banana",
      id: "banana123",
      computeServing: function (amount: math.Unit, roundN?: number): Serving | undefined {
        throw new Error("Function not implemented.");
      },
      toJSON: function (): { id: string | undefined; name: string | undefined; type: "Brand" | "Generic" | undefined; brandName: string | undefined; url: string | undefined; servings: { id: string | undefined; description: string | undefined; url: string | undefined; measurementDescription: string | undefined; metricServingAmount: number | null; metricServingUnit: string | null; numberOfUnits: number | undefined; calories: number | undefined; carbohydrate: number | undefined; protein: number | undefined; fat: number | undefined; saturatedFat: number | undefined; polyunsaturatedFat: number | undefined; monounsaturatedFat: number | undefined; transFat: number | undefined; cholesterol: number | undefined; sodium: number | undefined; potassium: number | undefined; fiber: number | undefined; sugar: number | undefined; addedSugars: number | undefined; vitaminD: number | undefined; vitaminA: number | undefined; vitaminC: number | undefined; calcium: number | undefined; iron: number | undefined; }[] | undefined; } {
        throw new Error("Function not implemented.");
      }
    };

    const foodEntry = FoodEntry.fromFoodSearchResultV3(mockFood);

    expect(foodEntry.serving).toBeUndefined();
  });

  it("should set serving to the value of firstServing.metricServingAmount when it is defined", () => {
    const mockFood: Food = {
      name: "Orange",
      brandName: "Brand C",
      servings: [
        {
          description: "1 medium (150g)",
          metricServingAmount: Units.toUnit(UnitType.G, 150),
          computeServing: function (amount: math.Unit, roundN?: number): Serving | undefined {
            throw new Error("Function not implemented.");
          },
          toJSON: function (): { id: string | undefined; description: string | undefined; url: string | undefined; measurementDescription: string | undefined; metricServingAmount: number | null; metricServingUnit: string | null; numberOfUnits: number | undefined; calories: number | undefined; carbohydrate: number | undefined; protein: number | undefined; fat: number | undefined; saturatedFat: number | undefined; polyunsaturatedFat: number | undefined; monounsaturatedFat: number | undefined; transFat: number | undefined; cholesterol: number | undefined; sodium: number | undefined; potassium: number | undefined; fiber: number | undefined; sugar: number | undefined; addedSugars: number | undefined; vitaminD: number | undefined; vitaminA: number | undefined; vitaminC: number | undefined; calcium: number | undefined; iron: number | undefined; } {
            throw new Error("Function not implemented.");
          },
          debugLog: function (): void {
            throw new Error("Function not implemented.");
          }
        },
      ],
      url: "https://example.com/orange",
      id: "orange123",
      computeServing: function (amount: math.Unit, roundN?: number): Serving | undefined {
        throw new Error("Function not implemented.");
      },
      toJSON: function (): { id: string | undefined; name: string | undefined; type: "Brand" | "Generic" | undefined; brandName: string | undefined; url: string | undefined; servings: { id: string | undefined; description: string | undefined; url: string | undefined; measurementDescription: string | undefined; metricServingAmount: number | null; metricServingUnit: string | null; numberOfUnits: number | undefined; calories: number | undefined; carbohydrate: number | undefined; protein: number | undefined; fat: number | undefined; saturatedFat: number | undefined; polyunsaturatedFat: number | undefined; monounsaturatedFat: number | undefined; transFat: number | undefined; cholesterol: number | undefined; sodium: number | undefined; potassium: number | undefined; fiber: number | undefined; sugar: number | undefined; addedSugars: number | undefined; vitaminD: number | undefined; vitaminA: number | undefined; vitaminC: number | undefined; calcium: number | undefined; iron: number | undefined; }[] | undefined; } {
        throw new Error("Function not implemented.");
      }
    };

    const foodEntry = FoodEntry.fromFoodSearchResultV3(mockFood);

    expect(foodEntry.serving).toBe('150 g'); // metricServingAmount value
  });
});