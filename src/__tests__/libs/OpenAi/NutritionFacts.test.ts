import axios from 'axios';
import NutritionFacts from '../../../libs/OpenAi/NutritionFacts';
import FoodEntry from '../../../models/FoodEntry';
import GeoLocation from '../../../models/GeoLocation';
import config from '../../../config';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedConfig = config as jest.Mocked<typeof config>;

jest.mock('../../../config', () => ({
  chatgpt: {
    apiUrl: 'https://api.openai.mock/v1/chat/completions',
    model: 'gpt-3.5-turbo',
    apiKey: 'mock-api-key', // Default mock API key
  },
}));

describe('NutritionFacts Class', () => {
  const mockGeoLocation: GeoLocation = {
    status: 'success',
    country: 'USA',
    countryCode: 'US',
    region: 'California',
    regionName: 'California',
    city: 'Los Angeles',
    zip: '90001',
    lat: 34.0522,
    lon: -118.2437,
    timezone: 'America/Los_Angeles',
    isp: 'Mock ISP',
    org: 'Mock Org',
    as: 'Mock AS',
    query: '127.0.0.1',
  };
  const mockFoodName = 'Apple';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getNutritionFacts', () => {

    it('should return null if API_KEY is not set', async () => {
      const originalApiKey = config.chatgpt.apiKey;
      config.chatgpt.apiKey = "";
      const result = await NutritionFacts.getNutritionFacts(mockFoodName, mockGeoLocation);

      expect(result).toBeNull();
      config.chatgpt.apiKey = originalApiKey;
    });

    it('should fetch nutrition facts and return a FoodEntry object', async () => {
      const mockResponseData = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                name: 'Apple',
                brand: null,
                description: 'A fresh apple',
                serving: '1 medium',
                weight: 182,
                weight_unit: 'g',
                calories: 95,
                calories_unit: 'kcal',
                carbs: 25,
                carbs_unit: 'g',
                fat: 0.3,
                fat_unit: 'g',
                protein: 0.5,
                protein_unit: 'g',
                sodium: 1,
                sodium_unit: 'mg',
                cholesterol: 1,
                cholesterol_unit: 'mg',
                timestamp: 1627849200,
                notes: null,
                upc: '123456789012',
                info_url: 'https://example.com/apple',
                source: 'chatgpt',
                source_id: 'apple123',
              }),
            },
          },
        ],
      };

      mockedAxios.post.mockResolvedValueOnce({ data: mockResponseData });

      const result = await NutritionFacts.getNutritionFacts(mockFoodName, mockGeoLocation);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        mockedConfig.chatgpt.apiUrl,
        {
          model: mockedConfig.chatgpt.model,
          messages: [
            {
              role: 'user',
              content: expect.stringContaining('Provide the nutrition facts for "Apple" in JSON format.'),
            },
          ],
          temperature: 0.7,
        },
        {
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${mockedConfig.chatgpt.apiKey}`,
          },
        }
      );

      expect(result).toBeInstanceOf(FoodEntry);
      expect(result?.name).toBe('Apple');
      expect(result?.brand).toBeNull();
      expect(result?.description).toBe('A fresh apple');
      expect(result?.serving).toBe('1 medium');
      expect(result?.weight).toBe(182);
      expect(result?.weight_unit).toBe('g');
      expect(result?.calories).toBe(95);
      expect(result?.calories_unit).toBe('kcal');
      expect(result?.carbs).toBe(25);
      expect(result?.carbs_unit).toBe('g');
      expect(result?.fat).toBe(0.3);
      expect(result?.fat_unit).toBe('g');
      expect(result?.protein).toBe(0.5);
      expect(result?.protein_unit).toBe('g');
      expect(result?.sodium).toBe(1);
      expect(result?.sodium_unit).toBe('mg');
      expect(result?.cholesterol).toBe(1);
      expect(result?.cholesterol_unit).toBe('mg');
      expect(result?.info_url).toBe('https://example.com/apple');
      expect(result?.source).toBe('chatgpt');
      expect(result?.source_id).toBe('apple123');
    });

    it('should return null and log an error if the API request fails', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('API Error'));

      const result = await NutritionFacts.getNutritionFacts(mockFoodName, mockGeoLocation);

      expect(result).toBeNull();
      expect(mockedAxios.post).toHaveBeenCalled();
    });
  });

  describe('validateUpc', () => {
    it('should fetch nutrition facts and return a FoodEntry object with an invalid upc', async () => {
      const mockResponseData = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                name: 'Apple',
                brand: null,
                description: 'A fresh apple',
                serving: '1 medium',
                weight: 182,
                weight_unit: 'g',
                calories: 95,
                calories_unit: 'kcal',
                carbs: 25,
                carbs_unit: 'g',
                fat: 0.3,
                fat_unit: 'g',
                protein: 0.5,
                protein_unit: 'g',
                sodium: 1,
                sodium_unit: 'mg',
                cholesterol: 1,
                cholesterol_unit: 'mg',
                timestamp: 1627849200,
                notes: null,
                upc: '123456',
                info_url: 'https://example.com/apple',
                source: 'chatgpt',
                source_id: 'apple123',
              }),
            },
          },
        ],
      };

      mockedAxios.post.mockResolvedValueOnce({ data: mockResponseData });

      const result = await NutritionFacts.getNutritionFacts(mockFoodName, mockGeoLocation);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        mockedConfig.chatgpt.apiUrl,
        {
          model: mockedConfig.chatgpt.model,
          messages: [
            {
              role: 'user',
              content: expect.stringContaining('Provide the nutrition facts for "Apple" in JSON format.'),
            },
          ],
          temperature: 0.7,
        },
        {
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${mockedConfig.chatgpt.apiKey}`,
          },
        }
      );

      expect(result).toBeInstanceOf(FoodEntry);
      expect(result?.name).toBe('Apple');
      expect(result?.brand).toBeNull();
      expect(result?.description).toBe('A fresh apple');
      expect(result?.serving).toBe('1 medium');
      expect(result?.weight).toBe(182);
      expect(result?.weight_unit).toBe('g');
      expect(result?.calories).toBe(95);
      expect(result?.calories_unit).toBe('kcal');
      expect(result?.carbs).toBe(25);
      expect(result?.carbs_unit).toBe('g');
      expect(result?.fat).toBe(0.3);
      expect(result?.fat_unit).toBe('g');
      expect(result?.protein).toBe(0.5);
      expect(result?.protein_unit).toBe('g');
      expect(result?.sodium).toBe(1);
      expect(result?.sodium_unit).toBe('mg');
      expect(result?.cholesterol).toBe(1);
      expect(result?.cholesterol_unit).toBe('mg');
      expect(result?.info_url).toBe('https://example.com/apple');
      expect(result?.source).toBe('chatgpt');
      expect(result?.source_id).toBe('apple123');

      expect(result?.upc).toBeUndefined();
    });

    it('should return the UPC if it is valid', () => {
      const validUpc = '123456789012';
      const result = NutritionFacts.validateUpc(validUpc);

      expect(result).toBe(validUpc);
    });

    it('should return undefined if the UPC is invalid', () => {
      const invalidUpc = '12345';
      const result = NutritionFacts.validateUpc(invalidUpc);

      expect(result).toBeUndefined();
    });

    it('should return undefined if the UPC is null or undefined', () => {
      expect(NutritionFacts.validateUpc(null as unknown as string)).toBeUndefined();
      expect(NutritionFacts.validateUpc(undefined as unknown as string)).toBeUndefined();
    });
  });
});