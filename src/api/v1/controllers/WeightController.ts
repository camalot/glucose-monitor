import config from '../../../config';
import { Request, Response, NextFunction } from 'express';
import Reflection from '../../../libs/reflection';
import LogsMongoClient from '../../../libs/mongo/Logs';
import WeightMongoClient from '../../../libs/mongo/Weight';
import moment from 'moment-timezone'
import Time from '../../../libs/time';

export default class WeightController {
  private logger = new LogsMongoClient();
  private db = new WeightMongoClient();
  private MODULE = this.constructor.name;

  public async getChartData(req: Request, resp: Response, next: NextFunction): Promise<void> {
    const METHOD = Reflection.getCallingMethodName();
    try {
      await this.db.connect();
      const data = await this.db.getLimit(10);
      let tzOffset = moment().tz(Time.DEFAULT_TIMEZONE).utcOffset();
      const mapped = data.map(entry => ({
        ...entry,
        time: moment.unix(entry.timestamp).tz(Time.DEFAULT_TIMEZONE).toISOString(),
        tz_offset: tzOffset
      }));
      resp.json(mapped);
    } catch (error) {
      this.logger.error(`${this.MODULE}.${METHOD}`, error.message, error);
      next(error);
    }
  }
}
