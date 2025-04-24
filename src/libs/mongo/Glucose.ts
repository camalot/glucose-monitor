import DatabaseMongoClient from './Database'
import config from '../../config/env';
import clc from 'cli-color';
import GlucoseEntry from '../../models/GlucoseEntry';
import { Collection } from 'mongodb';

class GlucoseMongoClient extends DatabaseMongoClient<GlucoseEntry> {

  constructor() {
    super();
    this.collectionName = 'glucose';
    console.log("GlucoseMongoClient initialized");
  }

  async getAll(): Promise<GlucoseEntry[]> {
    try {

      console.log("GlucoseMongoClient connecting");
      await this.connect();
      console.log("get all entries from db");
      const entries = await this.collection.find({}).toArray();
      console.log("got result");
      return entries;
    } catch (error) {
      console.error("Error fetching glucose entries:", error);
      throw error;
    }
  }

  async record(data: GlucoseEntry): Promise<void> {
    try {
      await this.connect();
      await this.collection.insertOne(data);
      console.log(clc.green('Glucose entry recorded successfully.'));
    } catch (error) {
      console.error(clc.red('Error recording glucose entry:'), error);
      throw error;
    }
  }
}

export default GlucoseMongoClient;