import config from '../../../config';
import * as FatSecret from '../../../libs/FatSecret';
import { Request, Response, NextFunction } from 'express';

import LogsMongoClient from '../../../libs/mongo/Logs';

interface AutocompleteResponse {
  // Define the structure of the autocomplete response if known
  [key: string]: any;
}


interface SearchResponse {
  // Define the structure of the search response if known
  [key: string]: any;
}

interface FoodResponse {

}
class FoodController {
  private logger = new LogsMongoClient();
  private MODULE = 'FoodController';

  async list(req: Request, resp: Response, next: NextFunction): Promise<void> {
    const METHOD = 'list';
    const count = req.params.count || 3;

    // await this.logger.info(`${this.MODULE}.${METHOD}`, `Request received`);
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
        }
      ];
      await resp.json(data);
    } catch (error) {
      await this.logger.error(`${this.MODULE}.${METHOD}`, error.message, { stack: error.stack });
      await next(error);
    }
  }

  async createClient(): Promise<FatSecret.Client> {
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
    const METHOD = 'getById';
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
    const METHOD = 'autocomplete';
    const query = req.query.q;
    console.log("Received autocomplete request with query:", query);
    const client = await this.createClient();
    try {
      console.log("autocomplete");
      const response = await client.getAutocompleteV2({ expression: String(query) });
      await resp.json(response);
    } catch (error: any) {
      console.log(error);
      await this.logger.error(`${this.MODULE}.${METHOD}`, error.message, { stack: error.stack });
      await next(error);

      return;
    }
  }

  async search(req: Request, resp: Response, next: NextFunction): Promise<void> {
    const METHOD = 'search';
    const client = await this.createClient();
    try {
      const query = req.query.q;

      const response = await client.getFoodSearchV1({ searchExpression: String(query) });
      await resp.json(response);
    } catch (error: any) {
      await this.logger.error(`${this.MODULE}.${METHOD}`, error.message, { stack: error.stack });
      await next(error);
      return;
    }
  }
}

export default FoodController;
