import FoodEntry from "../../models/FoodEntry";
import moment from "moment-timezone";
import Identity from "../../libs/Identity";
import Food from "../../libs/FatSecret/structures/Food";
import { Unit, BaseUnit, Fraction, BigNumber, MathJSON, FormatOptions } from "mathjs";
import { Serving } from "../../libs/FatSecret";

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
    expect(foodEntry.cholesterol).toBe(0);
    expect(foodEntry.cholesterol_unit).toBe("mg");
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

  it("should correctly create a FoodEntry from FoodSearchResultV3", () => {
    const mockFood: Food = {
      name: "Banana",
      brandName: "Brand B",
      servings: [
        {
          description: "1 medium (118g)",
          metricServingAmount: {
            valueOf: () => "118 g",
            clone: function (): Unit {
              throw new Error("Function not implemented.");
            },
            hasBase: function (base: BaseUnit | string | undefined): boolean {
              throw new Error("Function not implemented.");
            },
            equalBase: function (unit: Unit): boolean {
              throw new Error("Function not implemented.");
            },
            equals: function (unit: Unit): boolean {
              throw new Error("Function not implemented.");
            },
            multiply: function (unit: Unit): Unit {
              throw new Error("Function not implemented.");
            },
            divide: function (unit: Unit): Unit | number {
              throw new Error("Function not implemented.");
            },
            pow: function (unit: Unit): Unit {
              throw new Error("Function not implemented.");
            },
            abs: function (unit: Unit): Unit {
              throw new Error("Function not implemented.");
            },
            to: function (unit: string): Unit {
              throw new Error("Function not implemented.");
            },
            toNumber: function (unit?: string): number {
              throw new Error("Function not implemented.");
            },
            toNumeric: function (unit?: string): number | Fraction | BigNumber {
              throw new Error("Function not implemented.");
            },
            toSI: function (): Unit {
              throw new Error("Function not implemented.");
            },
            toJSON: function (): MathJSON {
              throw new Error("Function not implemented.");
            },
            formatUnits: function (): string {
              throw new Error("Function not implemented.");
            },
            format: function (options: FormatOptions): string {
              throw new Error("Function not implemented.");
            },
            simplify: function (): Unit {
              throw new Error("Function not implemented.");
            },
            splitUnit: function (parts: ReadonlyArray<string | Unit>): Unit[] {
              throw new Error("Function not implemented.");
            },
            units: [],
            dimensions: [],
            value: 0,
            fixPrefix: false,
            skipAutomaticSimplification: true
          },
          calories: {
            valueOf: () => '105 kcal',
            clone: function (): Unit {
              throw new Error("Function not implemented.");
            },
            hasBase: function (base: BaseUnit | string | undefined): boolean {
              throw new Error("Function not implemented.");
            },
            equalBase: function (unit: Unit): boolean {
              throw new Error("Function not implemented.");
            },
            equals: function (unit: Unit): boolean {
              throw new Error("Function not implemented.");
            },
            multiply: function (unit: Unit): Unit {
              throw new Error("Function not implemented.");
            },
            divide: function (unit: Unit): Unit | number {
              throw new Error("Function not implemented.");
            },
            pow: function (unit: Unit): Unit {
              throw new Error("Function not implemented.");
            },
            abs: function (unit: Unit): Unit {
              throw new Error("Function not implemented.");
            },
            to: function (unit: string): Unit {
              throw new Error("Function not implemented.");
            },
            toNumber: function (unit?: string): number {
              throw new Error("Function not implemented.");
            },
            toNumeric: function (unit?: string): number | Fraction | BigNumber {
              throw new Error("Function not implemented.");
            },
            toSI: function (): Unit {
              throw new Error("Function not implemented.");
            },
            toJSON: function (): MathJSON {
              throw new Error("Function not implemented.");
            },
            formatUnits: function (): string {
              throw new Error("Function not implemented.");
            },
            format: function (options: FormatOptions): string {
              throw new Error("Function not implemented.");
            },
            simplify: function (): Unit {
              throw new Error("Function not implemented.");
            },
            splitUnit: function (parts: ReadonlyArray<string | Unit>): Unit[] {
              throw new Error("Function not implemented.");
            },
            units: [],
            dimensions: [],
            value: 0,
            fixPrefix: false,
            skipAutomaticSimplification: true
          },
          carbohydrate: {
            valueOf: () => '27 g',
            clone: function (): Unit {
              throw new Error("Function not implemented.");
            },
            hasBase: function (base: BaseUnit | string | undefined): boolean {
              throw new Error("Function not implemented.");
            },
            equalBase: function (unit: Unit): boolean {
              throw new Error("Function not implemented.");
            },
            equals: function (unit: Unit): boolean {
              throw new Error("Function not implemented.");
            },
            multiply: function (unit: Unit): Unit {
              throw new Error("Function not implemented.");
            },
            divide: function (unit: Unit): Unit | number {
              throw new Error("Function not implemented.");
            },
            pow: function (unit: Unit): Unit {
              throw new Error("Function not implemented.");
            },
            abs: function (unit: Unit): Unit {
              throw new Error("Function not implemented.");
            },
            to: function (unit: string): Unit {
              throw new Error("Function not implemented.");
            },
            toNumber: function (unit?: string): number {
              throw new Error("Function not implemented.");
            },
            toNumeric: function (unit?: string): number | Fraction | BigNumber {
              throw new Error("Function not implemented.");
            },
            toSI: function (): Unit {
              throw new Error("Function not implemented.");
            },
            toJSON: function (): MathJSON {
              throw new Error("Function not implemented.");
            },
            formatUnits: function (): string {
              throw new Error("Function not implemented.");
            },
            format: function (options: FormatOptions): string {
              throw new Error("Function not implemented.");
            },
            simplify: function (): Unit {
              throw new Error("Function not implemented.");
            },
            splitUnit: function (parts: ReadonlyArray<string | Unit>): Unit[] {
              throw new Error("Function not implemented.");
            },
            units: [],
            dimensions: [],
            value: 0,
            fixPrefix: false,
            skipAutomaticSimplification: true
          },
          fat: {
            valueOf: () => '0.3 g',
            clone: function (): Unit {
              throw new Error("Function not implemented.");
            },
            hasBase: function (base: BaseUnit | string | undefined): boolean {
              throw new Error("Function not implemented.");
            },
            equalBase: function (unit: Unit): boolean {
              throw new Error("Function not implemented.");
            },
            equals: function (unit: Unit): boolean {
              throw new Error("Function not implemented.");
            },
            multiply: function (unit: Unit): Unit {
              throw new Error("Function not implemented.");
            },
            divide: function (unit: Unit): Unit | number {
              throw new Error("Function not implemented.");
            },
            pow: function (unit: Unit): Unit {
              throw new Error("Function not implemented.");
            },
            abs: function (unit: Unit): Unit {
              throw new Error("Function not implemented.");
            },
            to: function (unit: string): Unit {
              throw new Error("Function not implemented.");
            },
            toNumber: function (unit?: string): number {
              throw new Error("Function not implemented.");
            },
            toNumeric: function (unit?: string): number | Fraction | BigNumber {
              throw new Error("Function not implemented.");
            },
            toSI: function (): Unit {
              throw new Error("Function not implemented.");
            },
            toJSON: function (): MathJSON {
              throw new Error("Function not implemented.");
            },
            formatUnits: function (): string {
              throw new Error("Function not implemented.");
            },
            format: function (options: FormatOptions): string {
              throw new Error("Function not implemented.");
            },
            simplify: function (): Unit {
              throw new Error("Function not implemented.");
            },
            splitUnit: function (parts: ReadonlyArray<string | Unit>): Unit[] {
              throw new Error("Function not implemented.");
            },
            units: [],
            dimensions: [],
            value: 0,
            fixPrefix: false,
            skipAutomaticSimplification: true
          },
          protein: {
            valueOf: () => '1.3 g',
            clone: function (): Unit {
              throw new Error("Function not implemented.");
            },
            hasBase: function (base: BaseUnit | string | undefined): boolean {
              throw new Error("Function not implemented.");
            },
            equalBase: function (unit: Unit): boolean {
              throw new Error("Function not implemented.");
            },
            equals: function (unit: Unit): boolean {
              throw new Error("Function not implemented.");
            },
            multiply: function (unit: Unit): Unit {
              throw new Error("Function not implemented.");
            },
            divide: function (unit: Unit): Unit | number {
              throw new Error("Function not implemented.");
            },
            pow: function (unit: Unit): Unit {
              throw new Error("Function not implemented.");
            },
            abs: function (unit: Unit): Unit {
              throw new Error("Function not implemented.");
            },
            to: function (unit: string): Unit {
              throw new Error("Function not implemented.");
            },
            toNumber: function (unit?: string): number {
              throw new Error("Function not implemented.");
            },
            toNumeric: function (unit?: string): number | Fraction | BigNumber {
              throw new Error("Function not implemented.");
            },
            toSI: function (): Unit {
              throw new Error("Function not implemented.");
            },
            toJSON: function (): MathJSON {
              throw new Error("Function not implemented.");
            },
            formatUnits: function (): string {
              throw new Error("Function not implemented.");
            },
            format: function (options: FormatOptions): string {
              throw new Error("Function not implemented.");
            },
            simplify: function (): Unit {
              throw new Error("Function not implemented.");
            },
            splitUnit: function (parts: ReadonlyArray<string | Unit>): Unit[] {
              throw new Error("Function not implemented.");
            },
            units: [],
            dimensions: [],
            value: 0,
            fixPrefix: false,
            skipAutomaticSimplification: true
          },
          sodium: {
            valueOf: () => '1 g',
            clone: function (): Unit {
              throw new Error("Function not implemented.");
            },
            hasBase: function (base: BaseUnit | string | undefined): boolean {
              throw new Error("Function not implemented.");
            },
            equalBase: function (unit: Unit): boolean {
              throw new Error("Function not implemented.");
            },
            equals: function (unit: Unit): boolean {
              throw new Error("Function not implemented.");
            },
            multiply: function (unit: Unit): Unit {
              throw new Error("Function not implemented.");
            },
            divide: function (unit: Unit): Unit | number {
              throw new Error("Function not implemented.");
            },
            pow: function (unit: Unit): Unit {
              throw new Error("Function not implemented.");
            },
            abs: function (unit: Unit): Unit {
              throw new Error("Function not implemented.");
            },
            to: function (unit: string): Unit {
              throw new Error("Function not implemented.");
            },
            toNumber: function (unit?: string): number {
              throw new Error("Function not implemented.");
            },
            toNumeric: function (unit?: string): number | Fraction | BigNumber {
              throw new Error("Function not implemented.");
            },
            toSI: function (): Unit {
              throw new Error("Function not implemented.");
            },
            toJSON: function (): MathJSON {
              throw new Error("Function not implemented.");
            },
            formatUnits: function (): string {
              throw new Error("Function not implemented.");
            },
            format: function (options: FormatOptions): string {
              throw new Error("Function not implemented.");
            },
            simplify: function (): Unit {
              throw new Error("Function not implemented.");
            },
            splitUnit: function (parts: ReadonlyArray<string | Unit>): Unit[] {
              throw new Error("Function not implemented.");
            },
            units: [],
            dimensions: [],
            value: 0,
            fixPrefix: false,
            skipAutomaticSimplification: true
          },
          cholesterol: {
            valueOf: () => '0 mg',
            clone: function (): Unit {
              throw new Error("Function not implemented.");
            },
            hasBase: function (base: BaseUnit | string | undefined): boolean {
              throw new Error("Function not implemented.");
            },
            equalBase: function (unit: Unit): boolean {
              throw new Error("Function not implemented.");
            },
            equals: function (unit: Unit): boolean {
              throw new Error("Function not implemented.");
            },
            multiply: function (unit: Unit): Unit {
              throw new Error("Function not implemented.");
            },
            divide: function (unit: Unit): Unit | number {
              throw new Error("Function not implemented.");
            },
            pow: function (unit: Unit): Unit {
              throw new Error("Function not implemented.");
            },
            abs: function (unit: Unit): Unit {
              throw new Error("Function not implemented.");
            },
            to: function (unit: string): Unit {
              throw new Error("Function not implemented.");
            },
            toNumber: function (unit?: string): number {
              throw new Error("Function not implemented.");
            },
            toNumeric: function (unit?: string): number | Fraction | BigNumber {
              throw new Error("Function not implemented.");
            },
            toSI: function (): Unit {
              throw new Error("Function not implemented.");
            },
            toJSON: function (): MathJSON {
              throw new Error("Function not implemented.");
            },
            formatUnits: function (): string {
              throw new Error("Function not implemented.");
            },
            format: function (options: FormatOptions): string {
              throw new Error("Function not implemented.");
            },
            simplify: function (): Unit {
              throw new Error("Function not implemented.");
            },
            splitUnit: function (parts: ReadonlyArray<string | Unit>): Unit[] {
              throw new Error("Function not implemented.");
            },
            units: [],
            dimensions: [],
            value: 0,
            fixPrefix: false,
            skipAutomaticSimplification: true
          },
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
    expect(foodEntry.weight).toBe(undefined);
    expect(foodEntry.weight_unit).toBe(undefined);
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
    expect(foodEntry.cholesterol).toBe(0);
    expect(foodEntry.cholesterol_unit).toBe("mg");
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
});