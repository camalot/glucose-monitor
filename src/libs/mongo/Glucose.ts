import DatabaseMongoClient from './Database'
import config from '../../config/env';
import clc from 'cli-color';
import { GlucoseEntry } from '../../models/GlucoseEntry';
import { Collection } from 'mongodb';

class GlucoseMongoClient extends DatabaseMongoClient {
  private collectionName: string;
  private collection: Collection<GlucoseEntry>;

  constructor() {
    super();
    this.collectionName = 'glucose';
    this.collection = this.db.collection<GlucoseEntry>(this.collectionName);
  }

  async recordGlucose(data: GlucoseEntry): Promise<void> {
    try {
      await this.collection.insertOne(data);
      console.log(clc.green('Glucose entry recorded successfully.'));
    } catch (error) {
      console.error(clc.red('Error recording glucose entry:'), error);
      throw error;
    }
  }
}

export default GlucoseMongoClient;