import config from '../../../config';
import * as fs from 'fs';
import LogsMongoClient from '../../../libs/mongo/Logs';
import GlucoseMongoClient from '../../../libs/mongo/Glucose';
import GlucoseEntry from '../../../models/GlucoseEntry';
import GlucoseUtils from '../../../libs/Glucose';
import Reflection from '../../../libs/Reflection';
import { Request, Response, NextFunction } from 'express';
import Time from '../../../libs/Time';
// import moment from 'moment'
import moment from 'moment-timezone'
import { UnitType } from '../../../libs/Units';

export default class GlucoseController {
  constructor() {
    // set the default timezone for moment
    moment.tz.setDefault(Time.DEFAULT_TIMEZONE);
  }
  private logger = new LogsMongoClient();
  private MODULE = this.constructor.name;

  async chart(req: Request, resp: Response, next: NextFunction): Promise<void> {
    const METHOD = Reflection.getCallingMethodName();
    try {
      const db = new GlucoseMongoClient();
      await db.connect();
      let data = await db.getLimit(10);
      let tzOffset = moment().tz(Time.DEFAULT_TIMEZONE).utcOffset();
      // loop data array and convert time from unixtime to iso string
      data = data.map(entry => ({
        ...entry,
        time: moment.unix(entry.timestamp).tz(Time.DEFAULT_TIMEZONE).toISOString(),
        tz_offset: tzOffset
      }));

      await resp.json(data);
    } catch (error) {
      await this.logger.error(`${this.MODULE}.${METHOD}`, error.message, {
        stack: error.stack,
        headers: req.headers,
        body: req.body,
      });
      await next(error);
    }
  }

  async a1c(req: Request, resp: Response, next: NextFunction): Promise<void> {
    const METHOD = Reflection.getCallingMethodName();
    try {
      const db = new GlucoseMongoClient();
      await db.connect();
      const reduced: number[] = [];

      // get 3 months ago
      const threeMonthsAgo = moment().subtract(3, 'months').toDate();
      let latestDate = moment.unix(0).tz(Time.DEFAULT_TIMEZONE).toISOString();
      const entries = await db.getAfter(threeMonthsAgo);
      console.log(entries);
      entries.forEach(entry => {
        if (entry.value > 0) {
          reduced.push(entry.value);
          // store the date if it is the most recent compared to latestDate
          if (moment.unix(entry.timestamp)
            .tz(Time.DEFAULT_TIMEZONE)
            .isAfter(moment(latestDate).tz(Time.DEFAULT_TIMEZONE))
          ) {
            latestDate = moment.unix(entry.timestamp)
              .tz(Time.DEFAULT_TIMEZONE).toISOString();
          }
        }
      });

      const a1cValue = GlucoseUtils.calculateA1C(reduced).toFixed(2);
      resp.json({ time: latestDate, value: a1cValue });
    } catch (error) {
      await this.logger.error(`${this.MODULE}.${METHOD}`, error.message, {
        stack: error.stack,
        headers: req.headers,
        body: req.body,
      });
      await next(error);
    }
  }

  async last(req: Request, resp: Response, next: NextFunction): Promise<void> {
    const METHOD = Reflection.getCallingMethodName();

    try {
      const db = new GlucoseMongoClient();
      await db.connect();
      let data = await db.getLatest();
      let entry = null;
      if (data) {
        entry = {
          time: data ? moment.unix(data.timestamp).tz(Time.DEFAULT_TIMEZONE).toISOString() : null,
          value: data ? data.value : null
        }
      } else {
        entry = null;
      }
      await resp.json(entry);
    } catch (error) {
      await this.logger.error(`${this.MODULE}.${METHOD}`, error.message, {
        stack: error.stack,
        headers: req.headers,
        body: req.body,
      });
      await next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    const METHOD = Reflection.getCallingMethodName();
    try {
      const glucose = new GlucoseMongoClient();
      console.log("get all");
      const entries = await glucose.getAll();
      console.log("return entries");
      await res.status(200).json(entries);
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

  async record(req: Request, res: Response, next: NextFunction): Promise<void> {
    const METHOD = Reflection.getCallingMethodName();
    try {
      const glucose = new GlucoseMongoClient();
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
      const entry: GlucoseEntry = new GlucoseEntry(value, UnitType.MGDL, timestamp, notes);
      await glucose.record(entry);

      await res.status(201).json({ message: 'Glucose entry recorded successfully.' });
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
