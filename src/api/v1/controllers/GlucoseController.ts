import config from '../../../config';
import * as fs from 'fs';
import LogsMongoClient from '../../../libs/mongo/Logs';
import GlucoseMongoClient from '../../../libs/mongo/Glucose';
import GlucoseEntry from '../../../models/GlucoseEntry';
import GlucoseUtils from '../../../libs/Glucose';
import Reflection from '../../../libs/Reflection';
import { Request, Response, NextFunction } from 'express';
import Time, { Timeframe } from '../../../libs/Time';
// import moment from 'moment'
import moment from 'moment-timezone'
import { UnitType } from '../../../libs/Units';
import A1C from '../../../models/A1C';

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
      const timeframe = req.query.timeframe as Timeframe || Timeframe.NINETY_DAYS;
      const offsetDate = Time.subtractTimeframe(timeframe, moment().tz(Time.DEFAULT_TIMEZONE).toDate());
      const db = new GlucoseMongoClient();
      await db.connect();

      // let data = await db.getLimit(10);
      let data = await db.getAfter(offsetDate.toDate());
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
      const timeframe = req.query.timeframe as Timeframe || Timeframe.NINETY_DAYS;
      const offsetDate = Time.subtractTimeframe(timeframe, moment().tz(Time.DEFAULT_TIMEZONE).startOf('day').toDate());
      const db = new GlucoseMongoClient();
      await db.connect();

      // let latestDate = moment.unix(0).tz(Time.DEFAULT_TIMEZONE).toISOString();
      const entries = (await db.getAfter(offsetDate.toDate())).filter(entry => entry.value > 0);
      const latestTimestamp = entries.length > 0 ? Math.max(...entries.map(entry => entry.timestamp)) : moment().unix();

      // push all values from entries to reduced. 
      const reduced: number[] = entries.map(e => e.value);
      
      // entries.forEach(entry => {
      //   if (entry.value > 0) {
      //     reduced.push(entry.value);
      //     // store the date if it is the most recent compared to latestDate
      //     if (moment.unix(entry.timestamp)
      //       .tz(Time.DEFAULT_TIMEZONE)
      //       .isAfter(moment(latestDate).tz(Time.DEFAULT_TIMEZONE))
      //     ) {
      //       latestDate = moment.unix(entry.timestamp)
      //         .tz(Time.DEFAULT_TIMEZONE).toISOString();
      //     }
      //   }
      // });

      const a1cValue: number = parseFloat(GlucoseUtils.calculateA1C(reduced).toFixed(2));
      resp.json(new A1C(a1cValue, latestTimestamp));
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
      const data = await db.getLatest();      
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

  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    const METHOD = Reflection.getCallingMethodName();
    try {
      const glucose = new GlucoseMongoClient();
      const entries = await glucose.getAll();
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
