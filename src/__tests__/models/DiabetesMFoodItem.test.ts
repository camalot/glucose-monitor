import { DiabetesMFoodItem } from "../../models/DiabetesMFoodItem";
import FoodEntry from "../../models/FoodEntry";

describe("DiabetesMFoodItem Class", () => {
  it("should initialize with correct values and convert weight to grams", () => {
    const item = new DiabetesMFoodItem(
      "123",
      1,
      "Test Food",
      "Test Food Description",
      "1 cup",
      0.5, // weight in kg
      10, // carbs
      5, // protein
      100, // calories
      1627849200 // timestamp
    );

    expect(item.id).toBe("123");
    expect(item.categoryId).toBe(1);
    expect(item.name).toBe("Test Food");
    expect(item.description).toBe("Test Food Description");
    expect(item.serving).toBe("1 cup");
    expect(item.weight).toBe(500); // weight converted to grams
    expect(item.weight_unit).toBe("g");
    expect(item.carbs).toBe(10);
    expect(item.carbs_unit).toBe("g");
    expect(item.protein).toBe(5);
    expect(item.protein_unit).toBe("g");
    expect(item.calories).toBe(100);
    expect(item.calories_unit).toBe("kcal");
    expect(item.timestamp).toBe(1627849200);
  });

  it("should extract UPC code from the name", () => {
    const item = new DiabetesMFoodItem(
      "123",
      1,
      "Test Food UPC: 123456789012",
      "Test Food Description",
      "1 cup",
      0.5,
      10,
      5,
      100,
      1627849200
    );

    expect(item.upc).toBe("123456789012");
  });

  it("should validate and generate a new ID if the provided ID is invalid", () => {
    const item = new DiabetesMFoodItem(
      "",
      1,
      "Test Food",
      "Test Food Description",
      "1 cup",
      0.5,
      10,
      5,
      100,
      1627849200
    );

    expect(item.id).toBe("1627849200"); // Uses timestamp as ID
  });

  it("should generate a random ID if no valid ID or timestamp is provided", () => {
    const item = new DiabetesMFoodItem(
      "",
      1,
      "Test Food",
      "Test Food Description",
      "1 cup",
      0.5,
      10,
      5,
      100,
      0 
    );

    expect(item.id).toMatch(/^[a-z0-9]{7}$/); // Matches random ID format
  });

  it("should convert to a FoodEntry object correctly", () => {
    const item = new DiabetesMFoodItem(
      "123",
      1,
      "Test Food",
      "Test Food Description",
      "1 cup",
      0.5,
      10,
      5,
      100,
      1627849200
    );

    const foodEntry = item.toFoodEntry();

    expect(foodEntry).toBeInstanceOf(FoodEntry);
    expect(foodEntry.name).toBe("Test Food");
    expect(foodEntry.description).toBe("Test Food Description");
    expect(foodEntry.serving).toBe("1 cup");
    expect(foodEntry.weight).toBe(500);
    expect(foodEntry.weight_unit).toBe("g");
    expect(foodEntry.calories).toBe(100);
    expect(foodEntry.calories_unit).toBe("kcal");
    expect(foodEntry.carbs).toBe(10);
    expect(foodEntry.carbs_unit).toBe("g");
    expect(foodEntry.timestamp).toBe(1627849200);
    expect(foodEntry.upc).toBe(item.upc);
    expect(foodEntry.source).toBe("Diabetes:M");
    expect(foodEntry.source_id).toBe("123");
  });
});