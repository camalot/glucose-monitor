// @ts-nocheck
import { Collection } from 'mongodb';
import DatabaseMongoClient from './Database';
import config from '../../config';
import LogsMongoClient from './Logs';

const logger = new LogsMongoClient();
const MODULE = 'SettingsMongoClient';

interface Setting {
  name: string;
  value: any;
}

export default class SettingsMongoClient extends DatabaseMongoClient<Setting> {

  constructor() {
    super();
    this.collectionName = 'settings';
  }

  async list(): Promise<Setting[]> {
    const method = 'list';
    try {
      await this.connect();
      const result = await this.collection.find().toArray();
      return result;
    } catch (err: any) {
      await logger.error(`${MODULE}.${method}`, err.message, { stack: err.stack });
      return [];
    }
  }

  async get<T>(key: string, defaultValue: T): Promise<T> {
    const METHOD = 'get';
    try {
      await this.connect();
      if (!this.db) throw new Error('Database connection is not initialized.');
      this.collection = this.db.collection<Setting>(this.collectionName);
      const result = await this.collection.findOne({ name: key });
      return result ? (result.value as T) : defaultValue;
    } catch (err: any) {
      await logger.error(`${MODULE}.${METHOD}`, err.message, { stack: err.stack });
      return defaultValue;
    }
  }

  async set(key: string, value: any): Promise<boolean> {
    const METHOD = 'set';
    try {
      await this.connect();
      if (!this.db) throw new Error('Database connection is not initialized.');
      this.collection = this.db.collection<Setting>(this.collectionName);
      const result = await this.collection.updateOne(
        { name: key },
        { $set: { value } },
        { upsert: true }
      );
      return result.acknowledged;
    } catch (err: any) {
      await logger.error(`${MODULE}.${METHOD}`, err.message, { stack: err.stack });
      return false;
    }
  }

  async save(): Promise<void> {
    throw new Error('Not implemented');
  }
}