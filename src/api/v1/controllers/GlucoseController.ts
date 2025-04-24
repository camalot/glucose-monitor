import config from '../../../config';
import * as fs from 'fs';
import LogsMongoClient from '../../../libs/mongo/Logs';
import GlucoseMongoClient from '../../../libs/mongo/Glucose';
import GlucoseEntry from '../../../models/GlucoseEntry';
import { Request, Response } from 'express';

class GlucoseController {
  private logger = new LogsMongoClient();
  private MODULE = 'GlucoseController';

async get(req: Request, res: Response): Promise<void> {
  const METHOD = 'get';
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
    await res.status(500).json({ error: 'Internal server error' });
    return;
  }
}

async record(req: Request, res: Response): Promise<void> {
  const METHOD = 'record';
  try {
    const glucose = new GlucoseMongoClient();
    const { bloodGlucose, recordedAt } = req.body;

    if (!bloodGlucose || !recordedAt) {
      res.status(400).json({ error: 'Missing required fields: bloodGlucose or recordedAt' });
      return;
    }

    const entry: GlucoseEntry = new GlucoseEntry(bloodGlucose, recordedAt);
    await glucose.record(entry);

    res.status(201).json({ message: 'Glucose entry recorded successfully.' });
    return;
  } catch (err: any) {
    await this.logger.error(`${this.MODULE}.${METHOD}`, err.message, {
      stack: err.stack,
      headers: req.headers,
      body: req.body,
    });
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
}
}

export default GlucoseController;
