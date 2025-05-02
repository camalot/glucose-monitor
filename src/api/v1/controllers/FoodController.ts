import config from '../../../config';
import * as FatSecret from '../../../libs/FatSecret';
import Reflection from '../../../libs/Reflection';

import { Request, Response, NextFunction } from 'express';
import SavedFoodMongoClient from '../../../libs/mongo/SavedFoods';
import LogsMongoClient from '../../../libs/mongo/Logs';
import FoodEntry from '../../../models/FoodEntry';
import FoodSearchResultsV3 from '../../../libs/FatSecret/structures/FoodSearchResultsV3';
import FSFood from '../../../libs/FatSecret/structures/Food'
import { FoodSearchResults } from '../../../models/FoodSearchResults';
import math from 'mathjs';

export default class FoodController {
  private logger = new LogsMongoClient();
  private MODULE = this.constructor.name;
  private savedFoodClient = new SavedFoodMongoClient();

  async list(req: Request, resp: Response, next: NextFunction): Promise<void> {
    const METHOD = Reflection.getCallingMethodName();
    const count = req.params.count || 3;
    try {
      let data = [
        {
          time: new Date().toISOString(),
          food: {
            name: 'Sample Food Name',
            calories: 100,
            carbohydrates: 20
          }
        },

        {
          time: new Date().toISOString(),
          food: {
            name: 'Another Food Name',
            calories: 200,
            carbohydrates: 30
          }
        },

        {
          time: new Date().toISOString(),
          food: {
            name: 'Third Food Name',
            calories: 230,
            carbohydrates: 5
          }
        }
      ];
      await resp.json(data);
    } catch (error) {
      await this.logger.error(`${this.MODULE}.${METHOD}`, error.message, { stack: error.stack });
      await next(error);
    }
  }

  async getTotalCaloriesToday(req: Request, resp: Response, next: NextFunction): Promise<void> {
    const METHOD = Reflection.getCallingMethodName();
    try {
      const totalCalories = 0;
      await resp.json({ totalCalories });
    } catch (error) {
      await this.logger.error(`${this.MODULE}.${METHOD}`, error.message, { stack: error.stack });
      await next(error);
    }
  }

  async getTotalCarbsToday(req: Request, resp: Response, next: NextFunction): Promise<void> {
    const METHOD = Reflection.getCallingMethodName();
    try {
      const totalCarbs = 0;
      await resp.json({ totalCarbs });
    } catch (error) {
      await this.logger.error(`${this.MODULE}.${METHOD}`, error.message, { stack: error.stack });
      await next(error);
    }
  }

  private async createClient(): Promise<FatSecret.Client> {
    const METHOD = Reflection.getCallingMethodName();
    console.log("Create before promise");
    // return a Promise
    return new Promise<FatSecret.Client>((resolve, reject) => {
      try {
        console.log("Creating client...");
        const client = new FatSecret.Client({
          credentials: {
            clientId: config.fatsecret.clientId,
            clientSecret: config.fatsecret.clientSecret,
            scope: config.fatsecret.scopes as ("basic" | "premier" | "barcode" | "localization")[], // your scopes
          },
        });
        console.log("Client created");
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
    } catch (error) {
      await this.logger.error(`${this.MODULE}.${METHOD}`, error.message, { stack: error.stack });
      await next(error);

      return;
    }
  }

  async autocomplete(req: Request, resp: Response, next: NextFunction): Promise<void> {
    const METHOD = Reflection.getCallingMethodName();
    const query = req.query.q;
    console.log("Received autocomplete request with query:", query);
    const client = await this.createClient();
    try {
      const response = await client.getAutocompleteV2({ expression: String(query) });
      // map array to array of objects with `{ name: 'name', source: 'fatsecret' }`

      const mappedResponse = response.map(item => ({
        value: item,
        source: 'fatsecret',
        img: '/images/fatsecret-16x16.png'
      }));

      // get local items

      await resp.json(mappedResponse);
    } catch (error: any) {
      console.log(error);
      await this.logger.error(`${this.MODULE}.${METHOD}`, error.message, { stack: error.stack });
      await next(error);

      return;
    }
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
      
      let remoteResults: FoodSearchResultsV3 = null;
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
      let totalResults = remoteResults?.totalResults || 0;

      const localResults: FoodEntry[] = await this.savedFoodClient.find(
        {
          name: { $regex: new RegExp(`.*${String(query)}.*`), $options: 'i' },
        },
        { limit: max_subset, skip: skip }
      );

      totalResults += localResults.length;

      const actualResults = localResults.length + (remoteResults?.foods.length || 0);

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

      // loop over response to put into FoodEntry[]. use FoodEntry.fromFoodSearchResultV3
      const response: FoodSearchResults = new FoodSearchResults(
        totalResults,
        actualResults,
        page,
        totalPages,
        // combine remoteResults FoodEntry map with localResults
        [
          ...remoteResults.foods.map((food: FSFood) => formatNumericFields(FoodEntry.fromFoodSearchResultV3(food))),
          ...localResults.map((localFood: FoodEntry) => formatNumericFields(localFood)) // include localResults
        ]
      );

      await resp.json(response);
    } catch (error: any) {
      // await this.logger.error(`${this.MODULE}.${METHOD}`, error.message, { stack: error.stack });
      await next(error);
      return;
    }
  }
}
