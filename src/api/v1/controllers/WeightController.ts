import config from '../../../config';
import { Request, Response, NextFunction } from 'express';
import LogsMongoClient from '../../../libs/mongo/Logs';
import WeightMongoClient from '../../../libs/mongo/Weight';

export default class WeightController {
  private logger = new LogsMongoClient();
  private db = new WeightMongoClient();
  private MODULE = 'WeightController';

  public async getChartData(req: Request, resp: Response, next: NextFunction): Promise<void> {
    const METHOD = 'getChartData';
    try {
      await this.db.connect();
      const data = await this.db.getLimit(10);
      const mapped = data.map(entry => ({
        ...entry,
        time: new Date(entry.timestamp * 1000).toISOString(),
      }));
      resp.json(mapped);
    } catch (error) {
      this.logger.error(`${this.MODULE}.${METHOD}`, error.message, error);
      next(error);
    }
  }
}
