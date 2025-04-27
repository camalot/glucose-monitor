import config from '../../../config';
import * as FatSecret from '../../../libs/FatSecret';
import { Request, Response, NextFunction } from 'express';

import LogsMongoClient from '../../../libs/mongo/Logs';

class FoodController {
  private logger = new LogsMongoClient();
  private MODULE = 'FoodController';

  async list(req: Request, resp: Response, next: NextFunction): Promise<void> {
    const METHOD = 'list';
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

  private async createClient(): Promise<FatSecret.Client> {
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
    const METHOD = 'search';
    const client = await this.createClient();
    try {
      const query = req.query.q;
      const max_results = req.query.max_results || 20;
      console.log(`query: ${query}`);
      const response = await client.getFoodSearchV3({ 
        searchExpression: String(query), 
        maxResults: Number(max_results),
        pageNumber: req.query.page_number ? Number(req.query.page_number) : undefined,
        language: req.query.language ? String(req.query.language) : undefined
      });
      await resp.json(response);
    } catch (error: any) {
      // await this.logger.error(`${this.MODULE}.${METHOD}`, error.message, { stack: error.stack });
      await next(error);
      return;
    }
  }
}

export default FoodController;
