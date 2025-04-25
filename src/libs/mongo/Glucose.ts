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

  async getLimit(limit: number = 10): Promise<GlucoseEntry[]> {
    try {
      console.log("GlucoseMongoClient connecting");
      await this.connect();
      console.log("get only entries from db");
      const entries = await this.collection.find({}).limit(limit).toArray();
      entries.forEach(entry => {
        entry.id = entry._id.toString();
        delete entry._id;
      });
      console.log("got result");
      return entries;
    } catch (error) {
      console.error("Error fetching glucose entries:", error);
      throw error;
    }
  }

  async getLatest(): Promise<GlucoseEntry | null> {
    try {
      const latestEntry = await this.collection.find().sort({ timestamp: -1 }).limit(1).toArray();
      if (latestEntry.length > 0) {
        latestEntry[0].id = latestEntry[0]._id.toString();
        delete latestEntry[0]._id;
        return latestEntry[0];
      }
      return null;
    } catch (error) {

      console.error("Error fetching latest glucose entry:", error);
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