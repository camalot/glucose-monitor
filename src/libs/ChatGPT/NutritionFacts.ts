import axios from 'axios';
import FoodEntry from '../../models/FoodEntry';
import config from '../../config';

export default class NutritionFacts {
  private static readonly CHATGPT_API_URL = config.chatgpt.apiUrl;
  private static readonly MODEL = config.chatgpt.model; // Use the desired ChatGPT model
  private static readonly API_KEY = config.chatgpt.apiKey; // Ensure this is set in your environment variables

  static async getNutritionFacts(foodName: string): Promise<FoodEntry> {
    if (!this.API_KEY) {
      throw new Error('ChatGPT API key is not set in the environment variables.');
    }

    try {
      // Prompt to ask ChatGPT for nutrition facts
      const prompt = `
        Provide the nutrition facts for "${foodName}" in JSON format. 
        The JSON should match the following structure:
        {
          "name": string,
          "brand": string | null,
          "description": string | null,
          "serving": string | null,
          "weight": number | null,
          "weight_unit": string | null,
          "calories": number | null,
          "calories_unit": string | null,
          "carbs": number | null,
          "carbs_unit": string | null,
          "fat": number | null,
          "fat_unit": string | null,
          "protein": number | null,
          "protein_unit": string | null,
          "sodium": number | null,
          "sodium_unit": string | null,
          "cholesterol": number | null,
          "cholesterol_unit": string | null,
          "timestamp": number,
          "notes": string | null,
          "upc": string | null,
          "info_url": string | null,
          "source": 'chatgpt',
          "source_id": string | number
        }
        Ensure the response is valid JSON and matches the structure exactly. For source_id use a unique identifier 
        to make this result unique. it could even be a md5hash of the name, and all the serving, and other 
        nutrition data.
      `;

      // Make a request to ChatGPT
      const response = await axios.post(
        this.CHATGPT_API_URL,
        {
          model: this.MODEL,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.API_KEY}`,
          },
        }
      );

      // Parse the response from ChatGPT
      const responseData = response.data.choices[0].message.content;
      const foodEntryData = JSON.parse(responseData);

      // Validate and return the FoodEntry object
      return new FoodEntry(
        foodEntryData.name,
        foodEntryData.brand,
        foodEntryData.description,
        foodEntryData.serving,
        foodEntryData.weight,
        foodEntryData.weight_unit,
        foodEntryData.calories,
        foodEntryData.calories_unit,
        foodEntryData.carbs,
        foodEntryData.carbs_unit,
        foodEntryData.timestamp,
        foodEntryData.fat,
        foodEntryData.fat_unit,
        foodEntryData.protein,
        foodEntryData.protein_unit,
        foodEntryData.sodium,
        foodEntryData.sodium_unit,
        foodEntryData.cholesterol,
        foodEntryData.cholesterol_unit,
        foodEntryData.notes,
        foodEntryData.upc,
        foodEntryData.source,
        foodEntryData.source_id
      );
    } catch (error) {
      console.error('Error fetching nutrition facts from ChatGPT:', error);
      throw new Error('Failed to fetch nutrition facts from ChatGPT.');
    }
  }
}