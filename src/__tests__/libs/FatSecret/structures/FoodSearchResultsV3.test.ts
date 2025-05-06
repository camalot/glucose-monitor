import FoodSearchResultsV3 from '../../../../libs/FatSecret/structures/FoodSearchResultsV3';
import Food from '../../../../libs/FatSecret/structures/Food';
import ArrayUtility from "../../../../libs/Array";

jest.mock('../../../../libs/FatSecret/structures/Food');
jest.mock('../../../../libs/Array');

const MockedFood = jest.mocked(Food);
const MockedValueToArray = jest.mocked(ArrayUtility.wrap);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('FoodSearchResultsV3 Class', () => {
  describe('constructor', () => {
    it('should correctly assign properties from options', () => {
      const options = {
        maxResults: 10,
        pageNumber: 1,
        totalResults: 100,
        foods: [],
      };

      const results = new FoodSearchResultsV3(options);

      expect(results.maxResults).toBe(10);
      expect(results.pageNumber).toBe(1);
      expect(results.totalResults).toBe(100);
      expect(results.foods).toEqual([]);
    });
  });

  describe('fromResponse', () => {
    it('should create an instance of FoodSearchResultsV3 with all properties from a valid response', () => {
      MockedValueToArray.mockImplementation((value) => value); // Mock valueToArray to return the input
      MockedFood.fromResponse.mockImplementation((food) => food); // Mock Food.fromResponse to return the input

      const response = {
        max_results: '10',
        page_number: '1',
        total_results: '100',
        results: {
          food: [{ id: '123', name: 'Apple' }],
        },
      };

      const results = FoodSearchResultsV3.fromResponse(response);

      expect(results).toBeInstanceOf(FoodSearchResultsV3);
      expect(results.maxResults).toBe(10);
      expect(results.pageNumber).toBe(1);
      expect(results.totalResults).toBe(100);
      expect(results.foods).toEqual([{ id: '123', name: 'Apple' }]);

      expect(MockedValueToArray).toHaveBeenCalledWith(response.results.food);
      expect(MockedFood.fromResponse).toHaveBeenCalledWith({ id: '123', name: 'Apple' });
    });

    it('should handle a response with no foods gracefully', () => {
      MockedValueToArray.mockImplementation((value) => value); // Mock valueToArray to return the input

      const response = {
        max_results: '10',
        page_number: '1',
        total_results: '100',
        results: {
          food: undefined, // No foods provided
        },
      };

      const results = FoodSearchResultsV3.fromResponse(response);

      expect(results).toBeInstanceOf(FoodSearchResultsV3);
      expect(results.maxResults).toBe(10);
      expect(results.pageNumber).toBe(1);
      expect(results.totalResults).toBe(100);
      expect(results.foods).toEqual([]);

      expect(MockedValueToArray).toHaveBeenCalledWith([]);
    });

    it('should handle a null or undefined response gracefully', () => {
      MockedValueToArray.mockImplementation((value) => value); // Mock valueToArray to return the input

      const resultsFromNull = FoodSearchResultsV3.fromResponse(null);
      const resultsFromUndefined = FoodSearchResultsV3.fromResponse(undefined);

      expect(resultsFromNull).toBeInstanceOf(FoodSearchResultsV3);
      expect(resultsFromNull.maxResults).toBeNaN();
      expect(resultsFromNull.pageNumber).toBeNaN();
      expect(resultsFromNull.totalResults).toBeNaN();
      expect(resultsFromNull.foods).toEqual([]);

      expect(resultsFromUndefined).toBeInstanceOf(FoodSearchResultsV3);
      expect(resultsFromUndefined.maxResults).toBeNaN();
      expect(resultsFromUndefined.pageNumber).toBeNaN();
      expect(resultsFromUndefined.totalResults).toBeNaN();
      expect(resultsFromUndefined.foods).toEqual([]);

      expect(MockedValueToArray).toHaveBeenCalledWith([]);
    });

    it('should handle an empty response object gracefully', () => {
      MockedValueToArray.mockImplementation((value) => value); // Mock valueToArray to return the input

      const response = {};

      const results = FoodSearchResultsV3.fromResponse(response);

      expect(results).toBeInstanceOf(FoodSearchResultsV3);
      expect(results.maxResults).toBeNaN();
      expect(results.pageNumber).toBeNaN();
      expect(results.totalResults).toBeNaN();
      expect(results.foods).toEqual([]);

      expect(MockedValueToArray).toHaveBeenCalledWith([]);
    });
  });
});