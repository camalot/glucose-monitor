import config from '../../../config';
import * as fs from 'fs';
import LogsMongoClient from '../../../libs/mongo/Logs';
import GlucoseMongoClient from '../../../libs/mongo/Glucose';
import GlucoseEntry from '../../../models/GlucoseEntry';
import GlucoseUtils from '../../../libs/glucose';
import Reflection from '../../../libs/reflection';
import { Request, Response, NextFunction } from 'express';

export default class GlucoseController {
  private logger = new LogsMongoClient();
  private MODULE = this.constructor.name;
  async chart(req: Request, resp: Response, next: NextFunction): Promise<void> {
    const METHOD = Reflection.getCallingMethodName();
    try {
      const db = new GlucoseMongoClient();
      await db.connect();
      let data = await db.getLimit(10);
      // loop data array and convert time from unixtime to iso string
      data = data.map(entry => ({
        ...entry,
        time: new Date(entry.timestamp * 1000).toISOString(),
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
      const reduced = [];

      const entries = await db.getAll();
      entries.forEach(entry => {
        reduced.push(entry.value);
      });

      const a1cValue = GlucoseUtils.calculateA1C(reduced).toFixed(2);
      // set as ISO 8601 string
      const currentTime = new Date().toISOString();
      resp.json({ time: currentTime, value: a1cValue });
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
          id: data ? data.id : null,
          time: data ? new Date(data.timestamp * 1000).toISOString() : null,
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
      const { bloodGlucose, recordedAt } = req.body;

      if (!bloodGlucose || !recordedAt) {
        res.status(400).json({ error: 'Missing required fields: bloodGlucose or recordedAt' });
        return;
      }

      const entry: GlucoseEntry = new GlucoseEntry(bloodGlucose, recordedAt);
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
