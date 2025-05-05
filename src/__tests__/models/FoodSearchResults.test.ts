import { FoodSearchResults } from "../../models/FoodSearchResults";
import FoodEntry from "../../models/FoodEntry";

describe("FoodSearchResults Class", () => {
  it("should initialize with correct values", () => {
    const mockResults: FoodEntry[] = [
      new FoodEntry("Apple", "Brand A", "Fresh Apple", "1 medium", 150, "g", 95, "kcal", 25, "g", 1627849200),
      new FoodEntry("Banana", "Brand B", "Fresh Banana", "1 medium", 120, "g", 105, "kcal", 27, "g", 1627849201),
    ];

    const foodSearchResults = new FoodSearchResults(2, 10, 1, 1, mockResults);

    expect(foodSearchResults.totalResults).toBe(2);
    expect(foodSearchResults.maxResults).toBe(10);
    expect(foodSearchResults.pageNumber).toBe(1);
    expect(foodSearchResults.totalPages).toBe(1);
    expect(foodSearchResults.results).toEqual(mockResults);
  });

  it("should handle an empty results array", () => {
    const foodSearchResults = new FoodSearchResults(0, 10, 1, 0, []);

    expect(foodSearchResults.totalResults).toBe(0);
    expect(foodSearchResults.maxResults).toBe(10);
    expect(foodSearchResults.pageNumber).toBe(1);
    expect(foodSearchResults.totalPages).toBe(0);
    expect(foodSearchResults.results).toEqual([]);
  });

  it("should correctly handle multiple pages of results", () => {
    const mockResults: FoodEntry[] = [
      new FoodEntry("Orange", "Brand C", "Fresh Orange", "1 medium", 130, "g", 62, "kcal", 15, "g", 1627849202),
    ];

    const foodSearchResults = new FoodSearchResults(50, 10, 2, 5, mockResults);

    expect(foodSearchResults.totalResults).toBe(50);
    expect(foodSearchResults.maxResults).toBe(10);
    expect(foodSearchResults.pageNumber).toBe(2);
    expect(foodSearchResults.totalPages).toBe(5);
    expect(foodSearchResults.results).toEqual(mockResults);
  });
});