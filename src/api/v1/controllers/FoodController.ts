import config from '../../../config';
import * as FatSecret from '../../../libs/FatSecret';
import Reflection from '../../../libs/Reflection';
import {Units, UnitName, UnitType, UnitNameUtils} from '../../../libs/Units'
import { Request, Response, NextFunction } from 'express';
import SavedFoodMongoClient from '../../../libs/mongo/SavedFoods';
import FoodMongoClient from '../../../libs/mongo/Food';
import LogsMongoClient from '../../../libs/mongo/Logs';
import FoodEntry from '../../../models/FoodEntry';
import FoodSearchResultsV3 from '../../../libs/FatSecret/structures/FoodSearchResultsV3';
import FSFood from '../../../libs/FatSecret/structures/Food'
import { FoodSearchResults } from '../../../models/FoodSearchResults';
import NutritionFacts from '../../../libs/OpenAi/NutritionFacts';
import moment from 'moment-timezone';
import Identity from '../../../libs/Identity';

export default class FoodController {
  private logger = new LogsMongoClient();
  private MODULE = this.constructor.name;
  private savedFoodClient = new SavedFoodMongoClient();
  private foodClient = new FoodMongoClient();

  async addEntry(req: Request, resp: Response, next: NextFunction): Promise<void> {
    try {
      // create a FoodEntry and populate it from the form submission. 
      const foodEntry = FoodEntry.empty();

      let entryQuantity = req.body.quantity || 1;
      if (entryQuantity < 1 ) {
        entryQuantity = 1;
      }

      // for each form entry, find the property in the FoodEntry and set the value
      for (const key in req.body) {
        if (req.body.hasOwnProperty(key)) {
          switch (key) { 
            case "recordedAt": 
            case "time":
              foodEntry.timestamp = moment(String(req.body[key])).unix();
              continue;
            case "search": 
            case "json":
              continue;
            case "calories":
            case "carbs":
            case "fat":
            case "protein":
            case "sodium":
            case "cholesterol":
            case "weight":
            case "quantity":
              if (req.body[key]) {
                foodEntry[key] = parseFloat(req.body[key]);
              } else {
                foodEntry[key] = undefined;
              }
              break;
            case "notes":
              foodEntry.notes = req.body[key].replace(/\\r\\n/g, '\\n');
              break;
            default: 
              // does food entry have the property?
              const empty = FoodEntry.empty();
              if (empty.hasOwnProperty(key)) {
                foodEntry[key] = req.body[key];
              }
              break;
          }
        }
      }

      if (!foodEntry.name) {
        await resp.status(400).json({ message: 'Name is required' });
        return;
      }

      if (!foodEntry.quantity) {
        foodEntry.quantity = 1; // assume 1 if not found.
      }

      if (!foodEntry.timestamp) {
        await resp.status(400).json({ message: 'Record Time is required' });
        return;
      }

      await this.foodClient.record(foodEntry);

      // save as a saved food as well.
      // before we do so, set the quantity to 1
      foodEntry.quantity = 1; // set quantity to 1 before saving
      await this.savedFoodClient.record(foodEntry);
      
      const entryWord = entryQuantity > 1 ? 'entries' : 'entry';
      await resp.status(201).json({
        message: `${entryQuantity} Food ${entryWord} added successfully`, 
        foodEntry 
      });
    } catch (error) {
      await next(error);
    }

  }

  async list(req: Request, resp: Response, next: NextFunction): Promise<void> {
    const METHOD = Reflection.getCallingMethodName();
    const count = parseInt(req.params.count || '3');
    try {
      const entries = (await this.foodClient.getToday()).slice(0, count);
      // console.log(entries);
      
      await resp.json(entries);
    } catch (error: any) {
      await this.logger.error(`${this.MODULE}.${METHOD}`, error.message, { stack: error.stack });
      await next(error);
    }
  }

  async getTotalCaloriesToday(req: Request, resp: Response, next: NextFunction): Promise<void> {
    const METHOD = Reflection.getCallingMethodName();
    try {
      const entries = await this.foodClient.getToday();
      // get total calories per entry, multiply by the quantity and add to the sum
      let totalCalories = 0; 
      for (const entry of entries) {
        totalCalories += ((entry.calories || 0) * (entry.quantity || 1));
      }
      // const totalCalories = entries.reduce((sum, entry) => sum + ((entry.calories || 0) * (entry.quantity || 0)), 0);
      const latestTimestamp = entries.length > 0 ? Math.max(...entries.map(entry => entry.timestamp)) : moment().unix();
      const unit = UnitType.KCAL;
      await resp.json({ 
        value: Math.round(totalCalories), 
        unit: unit, 
        timestamp: latestTimestamp 
      });
    } catch (error: any) {
      await this.logger.error(`${this.MODULE}.${METHOD}`, error.message, { stack: error.stack });
      await next(error);
    }
  }

  async getTotalCarbsToday(req: Request, resp: Response, next: NextFunction): Promise<void> {
    const METHOD = Reflection.getCallingMethodName();
    try {
      const entries = await this.foodClient.getToday();
      // get total carbs per entry, multiply by the quantity and add to the sum
      let totalCarbs = 0;
      for (const entry of entries) {
        totalCarbs += ((entry.carbs || 0) * (entry.quantity || 1));
      }
      // const totalCarbs = entries.reduce((sum, entry) => sum + ((entry.carbs || 0) * (entry.quantity || 0)), 0);
      const unit = UnitType.G;
      const latestTimestamp = entries.length > 0 ? Math.max(...entries.map(entry => entry.timestamp)) : moment().unix();
      await resp.json({ 
        value: Math.round(totalCarbs),
        unit: unit, 
        timestamp: latestTimestamp 
      });
    } catch (error: any) {
      await this.logger.error(`${this.MODULE}.${METHOD}`, error.message, { stack: error.stack });
      await next(error);
    }
  }

  private async createClient(): Promise<FatSecret.Client> {
    const METHOD = Reflection.getCallingMethodName();
    // console.log("Create before promise");
    // return a Promise
    return new Promise<FatSecret.Client>((resolve, reject) => {
      try {
        // console.log("Creating client...");
        const client = new FatSecret.Client({
          credentials: {
            clientId: config.fatsecret.clientId,
            clientSecret: config.fatsecret.clientSecret,
            scope: config.fatsecret.scopes as ("basic" | "premier" | "barcode" | "localization")[], // your scopes
          },
        });
        // console.log("Client created");
        return resolve(client);
      } catch (error) {

        console.log(error);
        reject(error);
      }
    });
  }

  async getById(req: Request, resp: Response, next: NextFunction): Promise<void> {
    const METHOD = Reflection.getCallingMethodName();
    const foodId: number = parseInt(req.params.id);
    const client = await this.createClient();

    try {
      const response = await client.getFood({ foodId: String(foodId) });
      await resp.json(response);
    } catch (error: any) {
      await this.logger.error(`${this.MODULE}.${METHOD}`, error.message, { stack: error.stack });
      await next(error);

      return;
    }
  }

  async autocomplete(req: Request, resp: Response, next: NextFunction): Promise<void> {
    const METHOD = Reflection.getCallingMethodName();
    const query = req.query.q;
    // console.log("Received autocomplete request with query:", query);
    const client = await this.createClient();
    try {
      const response = await client.getAutocompleteV2({ expression: String(query) });
      // map array to array of objects with `{ name: 'name', source: 'fatsecret' }`
      if (response) {
        const mappedResponse = response.map(item => ({
          value: item,
          source: 'fatsecret',
          img: '/images/fatsecret-16x16.png'
        }));

        // get local items

        await resp.json(mappedResponse);
      } else {
        await resp.json([]);
      }
    } catch (error: any) {
      console.log(error);
      await this.logger.error(`${this.MODULE}.${METHOD}`, error.message, { stack: error.stack });
      await next(error);

      return;
    }
  }

  private async aiSearch(req: Request, resp: Response, next: NextFunction): Promise<FoodEntry | null> {
    if (resp.locals?.geoLocation) {
      const query = req.query?.q;
      const geoLocation = resp.locals?.geoLocation;
      const nutritionFacts = await NutritionFacts.getNutritionFacts(String(query), geoLocation);
      if (nutritionFacts && !FoodEntry.isEmpty(nutritionFacts)) {
        await this.savedFoodClient.record(nutritionFacts);
      }
      return nutritionFacts;
    }
    return null;
  }

  async search(req: Request, resp: Response, next: NextFunction): Promise<void> {
    const METHOD = Reflection.getCallingMethodName();
    const client = await this.createClient();
    try {
      const query = req.query.q;
      const max_results: number = parseInt(String(req.query?.max_results || '20') || '20', 10);
      const page = req.query.page_number ? Number(req.query.page_number) : 0;
      const skip = Math.floor(max_results / 2) * page;
      const source: string = req.query.source ? String(req.query.source) : '';

      // used to "split" between the datasources.
      // if fatsecret not included, then the max_subset = max_results
      let max_subset = Math.floor(max_results / 2);


      const localResults: FoodEntry[] = await this.savedFoodClient.find(
        {
          $or: [
            { name: { $regex: new RegExp(`.*${String(query)}.*`), $options: 'i' } },
            { brand: { $regex: new RegExp(`.*${String(query)}.*`), $options: 'i' } }
          ]
        },
        { limit: max_subset, skip: skip }
      );

      let totalResults = localResults.length;

      if (totalResults < max_subset) {
        max_subset = max_results - totalResults;
      }

      let remoteResults: FoodSearchResultsV3 = new FoodSearchResultsV3({});
      // if source does not contain 'fatsecret', do not perform the execution here
      if (source.includes('fatsecret') || source === '' || source === undefined || source === null) {
        remoteResults = await client.getFoodSearchV3({
          searchExpression: String(query),
          maxResults: max_subset,
          pageNumber: page,
          language: req.query.language ? String(req.query.language) : undefined
        });
      } else {
        max_subset = max_results;
      }
      totalResults = remoteResults.totalResults || 0;

      let actualResults = localResults.length + (remoteResults.foods?.length || 0);

      const totalPages = Math.ceil(totalResults / max_results);

      // map all numeric fields in localResults and remoteResults that have a value to be a float with 2 digit precision
      const formatNumericFields = (food: FoodEntry): FoodEntry => {
        const formattedFood: any = Array.isArray(food) ? [] : {};

        for (const key in food) {
          if (typeof food[key] === 'number') {
            // Format numeric fields to 2 decimal places
            formattedFood[key] = parseFloat(food[key].toFixed(2));
          } else if (typeof food[key] === 'object' && food[key] !== null) {
            // Recursively format nested objects
            formattedFood[key] = formatNumericFields(food[key]);
          } else {
            // Copy other fields as-is
            formattedFood[key] = food[key];
          }
        }
        return formattedFood;
      };

      const aiResults: FoodEntry[] = [await this.aiSearch(req, resp, next)].filter(result => result !== null);
      if (aiResults && aiResults[0]) {
        // increase the counts 
        totalResults += aiResults.length;
        actualResults += aiResults.length;
      }

      // for all the FoodEntry in aiResults where the key is like `_unit`, convert the unit to a known unit
      // using the Units.nameConversion
      aiResults.forEach((aiResult: FoodEntry) => {
        for (const key in aiResult) {
          if (aiResult.hasOwnProperty(key)) {
            if (key.match(/_unit$/)) {
              const unitName: UnitName | undefined = UnitNameUtils.fromName(key);
              if (unitName) {
                aiResult[key] = Units.nameConversion(unitName);
              }
            }
          }
        }
      });
      // loop over response to put into FoodEntry[]. use FoodEntry.fromFoodSearchResultV3
      const response: FoodSearchResults = new FoodSearchResults(
        totalResults,
        actualResults,
        page,
        totalPages,
        // combine remoteResults FoodEntry map with localResults
        [
          ...localResults.map((localFood: FoodEntry) => formatNumericFields(localFood)), // include localResults
          ...aiResults.map((aiResult: FoodEntry) => formatNumericFields(aiResult)), // include aiResults
          ...(remoteResults.foods || []).map((food: FSFood) => formatNumericFields(FoodEntry.fromFoodSearchResultV3(food))),
        ]
      );

      await resp.json(response);
    } catch (error: any) {
      //await this.logger.error(`${this.MODULE}.${METHOD}`, error.message, { stack: error.stack });
      await next(error);
      return;
    }
  }
}
