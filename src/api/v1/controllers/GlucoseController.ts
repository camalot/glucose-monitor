import config from '../../../config';
import * as fs from 'fs';
import LogsMongoClient from '../../../libs/mongo/Logs';
import GlucoseMongoClient from '../../../libs/mongo/Glucose';
import { Request, Response } from 'express';

const logger = new LogsMongoClient();
const glucose = new GlucoseMongoClient();
const MODULE = 'GlucoseController';

async function record(req: Request, res: Response): Promise<void> {
  const METHOD = 'record';
  try {
    const { bloodGlucose, recordedAt } = req.body;

    if (!bloodGlucose || !recordedAt) {
      res.status(400).json({ error: 'Missing required fields: bloodGlucose or recordedAt' });
      return;
    }

    const entry = {
      bloodGlucose: parseFloat(bloodGlucose),
      recordedAt: new Date(recordedAt),
    };

    await glucose.recordGlucose(entry);

    res.status(201).json({ message: 'Glucose entry recorded successfully.' });
    return;
  } catch (err: any) {
    await logger.error(`${MODULE}.${METHOD}`, err.message, {
      stack: err.stack,
      headers: req.headers,
      body: req.body,
    });
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
}

export default {
  record,
};

// const config = require('../../../config');
// const fs = require('fs');
// const LogsMongoClient = require('../../../libs/mongo/Logs');
// const GluecoseMongoClient = require('../../../libs/mongo/Glucose');

// const logger = new LogsMongoClient();
// const glucose = new GlucoseMongoClient();
// const MODULE = 'GlucoseController';

// async function record() {

// }

// module.exports = {
//   record,
// };