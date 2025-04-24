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

  

async createClient(): Promise<FatSecret.Client> {
  const client = new FatSecret.Client({
    credentials: {
      clientId: config.fatsecret.clientId,
      clientSecret: config.fatsecret.clientSecret,
      scope: ['basic'], // your scopes
    },
  });

  
  return client;
}

async getById(req: Request, resp: Response, next: NextFunction): Promise<any> {
  const foodId: number = parseInt(req.params.id);
  const client = await this.createClient();

  try {
    const response = await client.getFood({ foodId: String(foodId) });
    return await resp.json(response);
  } catch (error) {
    await this.logger.error(`${this.MODULE}.getById`, error.message, { stack: error.stack });
    await next(error);

    return;
  }
}

async autocomplete(req: Request, resp: Response, next: NextFunction): Promise<AutocompleteResponse> {
  const query = req.query.q;
  const client = await this.createClient();
  try {
    const response = await client.getAutocompleteV2({ expression: String(query) });
    return await resp.json(response);
  } catch (error: any) {
    await this.logger.error(`${this.MODULE}.autocomplete`, error.message, { stack: error.stack });
    await next(error);

    return;
  }
}

  async search(req: Request, resp: Response, next: NextFunction): Promise<SearchResponse> {
  const client = await this.createClient();
  try {
    const query = req.query.q;
    const client = await this.createClient();

    const response = await client.getFoodSearchV1({ searchExpression: String(query) });
    return await resp.json(response);
  } catch (error: any) {
    await this.logger.error(`${this.MODULE}.search`, error.message, { stack: error.stack });
    await next(error);
    return;
  }
}
}

export default FoodController;
