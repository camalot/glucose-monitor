import config from '../../../config';
import { Request, Response, NextFunction } from 'express';
import Reflection from '../../../libs/Reflection';
import LogsMongoClient from '../../../libs/mongo/Logs';
import WeightMongoClient from '../../../libs/mongo/Weight';
import moment from 'moment-timezone'
import Time from '../../../libs/Time';
import WeightEntry from '../../../models/WeightEntry';
import { UnitType } from '../../../libs/Units';

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

  async record(req: Request, res: Response, next: NextFunction): Promise<void> {
    const METHOD = Reflection.getCallingMethodName();
    try {
      const glucose = new WeightMongoClient();
      const { value, time, notes } = req.body;


      if (!value || !time) {
        res.status(400).json({ error: 'Missing required fields: value or time' });
        return;
      }

      const timestamp = moment(time).tz(Time.DEFAULT_TIMEZONE).unix();
      console.log({
        timestamp,
        value,
        notes,
        time
      });
      const entry: WeightEntry = new WeightEntry(value, UnitType.LB, timestamp, notes);
      await this.db.record(entry);

      await res.status(201).json({ message: 'Weight entry recorded successfully.' });
      return;
    } catch (err: any) {
      await this.logger.error(`${this.MODULE}.${METHOD}`, err.message, {
        stack: err.stack,
        headers: req.headers,
        body: req.body,
      });
      await next(err);
      return;
    }
  }
}
