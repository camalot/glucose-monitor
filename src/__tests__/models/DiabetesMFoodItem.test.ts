import { UnitType } from "../../libs/Units";
import { DiabetesMFoodItem } from "../../models/DiabetesMFoodItem";
import FoodEntry from "../../models/FoodEntry";

describe("DiabetesMFoodItem Class", () => {
  it("should initialize with correct values and convert weight to grams", () => {
    const item = new DiabetesMFoodItem(
      "123",
      1,
      "Test Food",
      "Test Food Description",
      1627849200, // timestamp
      "1 cup",
      0.5, // weight in kg
      10, // carbs
      5, // protein
      100, // calories
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

  it("should use the description for the name, if name is not provided", () => {
    const item = new DiabetesMFoodItem(
      "123",
      1,
      "",
      "A description for name",
      1627849200, // timestamp
      "1 cup",
      0.5, // weight in kg
      10, // carbs
      5, // protein
      100, // calories
    );
    expect(item.name).toBe("A description for name");
    expect(item.description).toBe("A description for name");
    expect(item.description).toBe(item.name);
    expect(item.name).toBe(item.description);
    expect(item.name).not.toBe("");
    expect(item.name).not.toBeUndefined();
  });

  it("should extract UPC code from the name", () => {
    const item = new DiabetesMFoodItem(
      "123",
      1,
      "Test Food UPC: 123456789012",
      "Test Food Description",
      1627849200,
      "1 cup",
      0.5,
      10,
      5,
      100,
    );

    expect(item.upc).toBe("123456789012");
  });

  it("should extract UPC code from the name and use that for the id if ID is invalid", () => {
    const item = new DiabetesMFoodItem(
      "-1",
      1,
      "Test Food UPC: 123456789012",
      "Test Food Description",
      1627849200,
      "1 cup",
      0.5,
      10,
      5,
      100,
    );

    expect(item.upc).toBe("123456789012");
    expect(item.id).toBe("123456789012");
  });

  it("should validate and generate a new ID if the provided ID is invalid", () => {
    const item = new DiabetesMFoodItem(
      "",
      1,
      "Test Food",
      "Test Food Description",
      1627849200,
      "1 cup",
      0.5,
      10,
      5,
      100,
    );

    expect(item.id).toBe("1627849200"); // Uses timestamp as ID
  });

  it("should generate a random ID if no valid ID or timestamp is provided", () => {
    const item = new DiabetesMFoodItem(
      "",
      1,
      "Test Food",
      "Test Food Description",
      0, 
      "1 cup",
      0.5,
      10,
      5,
      100,
    );

    expect(item.id).toMatch(/^[a-z0-9]{7}$/); // Matches random ID format
  });

  it("should convert to a FoodEntry object correctly", () => {
    const item = new DiabetesMFoodItem(
      "123",
      1,
      "Test Food",
      "Test Food Description",
      1627849200,
      "1 cup",
      0.5,
      10,
      5,
      100,
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

  it("should convert to a FoodEntry object correctly when no serving is provided", () => {
    const item = new DiabetesMFoodItem(
      "123",
      1,
      "Test Food",
      "Test Food Description",
      1627849200,
      "",
      0.5,
      10,
      5,
      100,
    );

    const foodEntry = item.toFoodEntry();

    expect(foodEntry).toBeInstanceOf(FoodEntry);
    expect(foodEntry.name).toBe("Test Food");
    expect(foodEntry.description).toBe("Test Food Description");
    expect(foodEntry.serving).toBeUndefined();
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

  it("should use the timestamp as the ID if the provided ID is invalid and timestamp is valid", () => {
    const item = new DiabetesMFoodItem(
      "", // Invalid ID
      1,
      "Test Food",
      "Test Food Description",
      1627849200, // Valid timestamp
      "1 cup",
      0.5,
      10,
      5,
      100,
    );

    expect(item.id).toBe("1627849200"); // Uses timestamp as ID
  });

  it("should return the timestamp as the ID when the provided ID is invalid and timestamp is valid", () => {
    const item = new DiabetesMFoodItem(
      "-1", // Invalid ID
      1,
      "Test Food",
      "Test Food Description",
      1746463139, // Valid timestamp
      "1 cup",
      0.5,
      10,
      5,
      100,
    );

    expect(item.id).toBe("1746463139"); // Uses timestamp as ID
  });

  it("should correctly initialize weight and weight_unit when weight is provided", () => {
    const item = new DiabetesMFoodItem(
      "1", // id
      1, // categoryId
      "Test Food", // name
      "Test Description", // description
      1627849200, // timestamp
      "1 cup", // serving
      0.5 // weight in kilograms
    );

    expect(item.weight).toBe(500); // 0.5 kg converted to grams
    expect(item.weight_unit).toBe(UnitType.G);
  });

  it("should set weight and weight_unit to undefined when weight is not provided", () => {
    const item = new DiabetesMFoodItem(
      "1", // id
      1, // categoryId
      "Test Food", // name
      "Test Description", // description
      1627849200, // timestamp
      "1 cup" // serving
    );

    expect(item.weight).toBeUndefined();
    expect(item.weight_unit).toBeUndefined();
  });

  it("should correctly initialize carbs and carbs_unit when carbs are provided", () => {
    const item = new DiabetesMFoodItem(
      "1", // id
      1, // categoryId
      "Test Food", // name
      "Test Description", // description
      1627849200, // timestamp
      "1 cup", // serving
      undefined, // weight
      10 // carbs in grams
    );

    expect(item.carbs).toBe(10);
    expect(item.carbs_unit).toBe(UnitType.G);
  });

  it("should set carbs and carbs_unit to undefined when carbs are not provided", () => {
    const item = new DiabetesMFoodItem(
      "1", // id
      1, // categoryId
      "Test Food", // name
      "Test Description", // description
      1627849200, // timestamp
      "1 cup" // serving
    );

    expect(item.carbs).toBeUndefined();
    expect(item.carbs_unit).toBeUndefined();
  });

  it("should correctly initialize protein and protein_unit when protein is provided", () => {
    const item = new DiabetesMFoodItem(
      "1", // id
      1, // categoryId
      "Test Food", // name
      "Test Description", // description
      1627849200, // timestamp
      "1 cup", // serving
      undefined, // weight
      undefined, // carbs
      5 // protein in grams
    );

    expect(item.protein).toBe(5);
    expect(item.protein_unit).toBe(UnitType.G);
  });

  it("should set protein and protein_unit to undefined when protein is not provided", () => {
    const item = new DiabetesMFoodItem(
      "1", // id
      1, // categoryId
      "Test Food", // name
      "Test Description", // description
      1627849200, // timestamp
      "1 cup" // serving
    );

    expect(item.protein).toBeUndefined();
    expect(item.protein_unit).toBeUndefined();
  });

  it("should correctly initialize calories and calories_unit when calories are provided", () => {
    const item = new DiabetesMFoodItem(
      "1", // id
      1, // categoryId
      "Test Food", // name
      "Test Description", // description
      1627849200, // timestamp
      "1 cup", // serving
      undefined, // weight
      undefined, // carbs
      undefined, // protein
      100 // calories in kilocalories
    );

    expect(item.calories).toBe(100);
    expect(item.calories_unit).toBe(UnitType.KCAL);
  });

  it("should set calories and calories_unit to undefined when calories are not provided", () => {
    const item = new DiabetesMFoodItem(
      "1", // id
      1, // categoryId
      "Test Food", // name
      "Test Description", // description
      1627849200, // timestamp
      "1 cup" // serving
    );

    expect(item.calories).toBeUndefined();
    expect(item.calories_unit).toBeUndefined();
  });

  it("should trim the serving string if it contains leading or trailing whitespace", () => {
    const item = new DiabetesMFoodItem(
      "1", // id
      1, // categoryId
      "Test Food", // name
      "Test Description", // description
      1627849200, // timestamp
      "  1 cup  " // serving with whitespace
    );

    const foodEntry = item.toFoodEntry();
    expect(foodEntry.serving).toBe("1 cup"); // Whitespace should be trimmed
  });

  it("should return the serving string as-is if it does not contain whitespace", () => {
    const item = new DiabetesMFoodItem(
      "1", // id
      1, // categoryId
      "Test Food", // name
      "Test Description", // description
      1627849200, // timestamp
      "1 cup" // serving without whitespace
    );

    const foodEntry = item.toFoodEntry();
    expect(foodEntry.serving).toBe("1 cup"); // No trimming needed
  });

  it("should set the serving to undefined if the serving property is not defined", () => {
    const item = new DiabetesMFoodItem(
      "1", // id
      1, // categoryId
      "Test Food", // name
      "Test Description", // description
      1627849200 // timestamp
      // No serving provided
    );

    const foodEntry = item.toFoodEntry();
    expect(foodEntry.serving).toBeUndefined(); // Serving should remain undefined
  });
});