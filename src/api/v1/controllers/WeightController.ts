import config from '../../../config';
import { Request, Response, NextFunction } from 'express';
import LogsMongoClient from '../../../libs/mongo/Logs';

export default class WeightController {
  private logger = new LogsMongoClient();
  private MODULE = 'WeightController';

  public async getChartData(req: Request, resp: Response, next: NextFunction): Promise<void> {
    try {
      resp.json([
        { time: '2025-04-24T13:00:00.000Z', value: 335 },
        { time: '2025-04-25T04:47:58.000Z', value: 335 }
      ]);
    } catch (error) {
      next(error);
    }
  }
}
