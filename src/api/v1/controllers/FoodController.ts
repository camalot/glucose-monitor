import config from '../../../config';
import FatSecret from '../../../libs/FatSecret'
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
class FoodController {
  private logger = new LogsMongoClient();
  private MODULE = 'FoodController';



async createClient(): Promise<FatSecret.Client> {
  const client = new FatSecret.Client({
    credentials: {
      clientId: config.fatsecret.clientId,
      clientSecret: config.fatsecret.clientSecret,
      scope: ['basic', 'premier'], // your scopes
    },
  });
  return client;
}

async autocomplete(req: Request, resp: Response, next: NextFunction): Promise<AutocompleteResponse> {
  const query = req.query.q;
  const client = await this.createClient();
  try {
    const response = await client.getAutocomplete({ expression: String(query) });
    console.log(response);
    return await resp.json(response);
  } catch (error: any) {
    await this.logger.error(`${this.MODULE}.autocomplete`, error.message, { stack: error.stack });
    await next(error);

    return;
  }
}

async search(query: string): Promise<SearchResponse> {
  const client = await this.createClient();
  try {
    const response = await client.getFoodSearch({ searchExpression: query });
    console.log(response);
    return response;
  } catch (error: any) {
    await this.logger.error(`${this.MODULE}.search`, error.message, { stack: error.stack });
    throw error;
  }
}
}

export default FoodController;
