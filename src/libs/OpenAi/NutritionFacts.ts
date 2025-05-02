import axios from 'axios';
import FoodEntry from '../../models/FoodEntry';
import config from '../../config';
import GeoLocation from '../../models/GeoLocation';

export default class NutritionFacts {
  private static readonly API_URL = config.chatgpt.apiUrl;
  private static readonly MODEL = config.chatgpt.model; // Use the desired ChatGPT model
  private static readonly API_KEY = config.chatgpt.apiKey; // Ensure this is set in your environment variables

  static async getNutritionFacts(foodName: string, geo: GeoLocation): Promise<FoodEntry> {
    if (!this.API_KEY) {
      console.error('ChatGPT API key is not set in the environment variables.');
      return null;
    }

    try {
      const geoString = geo.toString();
      let geoPrompt = "";
      if (geoString) {
        geoPrompt = `The user's Geographic Location: ${geoString}.`;
      }
      // Prompt to ask ChatGPT for nutrition facts
      const prompt = `
        Provide the nutrition facts for "${foodName}" in JSON format.
        ${geoPrompt}
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
        nutrition data. Set any property as null if necessary, except for 'name', 'source' and 'source_id'.
      `;

      // Make a request to ChatGPT
      const response = await axios.post(
        this.API_URL,
        {
          model: this.MODEL,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
        },
        {
          timeout: 5000,
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
      const foodEntry = new FoodEntry(
        foodEntryData.name.replace(new RegExp(foodEntryData.brand, 'g'), '').trim(),
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
        NutritionFacts.validateUpc(foodEntryData.upc) || undefined,
        foodEntryData.info_url,
        foodEntryData.source,
        foodEntryData.source_id
      );
      // save this?
      console.log(foodEntry);
      return foodEntry;
    } catch (error) {
      console.error('Error fetching nutrition facts from ChatGPT:', error);
      return null;
    }
  }

  static validateUpc(upc: string): string | undefined {
    if (upc.length !== 12) {
      return undefined;
    }
    return upc;
  }
}