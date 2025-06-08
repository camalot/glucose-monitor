// @ts-nocheck
import DatabaseMongoClient from './Database'
import config from '../../config/env';
import clc from 'cli-color';
import GlucoseEntry from '../../models/GlucoseEntry';
import { Collection, InsertManyResult, InsertOneResult } from 'mongodb';
import moment from 'moment-timezone';

class GlucoseMongoClient extends DatabaseMongoClient<GlucoseEntry> {

  constructor() {
    super();
    this.collectionName = 'glucose';
    console.log("GlucoseMongoClient initialized");
  }

  async getAll(): Promise<GlucoseEntry[]> {
    try {
      await this.connect();
      const entries = await this.collection.find({}, { sort: { timestamp: 1 }}).toArray();
      return entries;
    } catch (error) {
      console.error("Error fetching glucose entries:", error);
      throw error;
    }
  }

  async getAfter(start: Date): Promise<GlucoseEntry[]> {
    try {
      await this.connect();
      let ts = moment(start).unix()
      const entries = await this.collection.find({ timestamp: { "$gt": ts } }, { sort: { timestamp: 1 } }).toArray();
      return entries;
    } catch (error) {
      console.error("Error fetching glucose entries:", error);
      throw error;
    }
  }

  async getLimit(limit: number = 10): Promise<GlucoseEntry[]> {
    try {
      await this.connect();
      // ignore _id from result
      const entries = await this.collection.find({}, { projection: { _id: 0 }, sort: { timestamp: -1 } }).limit(limit).toArray();
      return entries;
    } catch (error) {
      console.error("Error fetching glucose entries:", error);
      throw error;
    }
  }

  async getLatest(): Promise<GlucoseEntry | null> {
    try {
      await this.connect();
      const latestEntry = await this.collection.find({}, { projection: { _id: 0 }, sort: { timestamp: -1 } }).limit(1).toArray();
      if (latestEntry.length > 0) {
        return latestEntry[0];
      }
      return null;
    } catch (error) {

      console.error("Error fetching latest glucose entry:", error);
      throw error;
    }
  }

  async record(data: GlucoseEntry): Promise<InsertOneResult<GlucoseEntry>> {
    try {
      await this.connect();
      const result = await this.collection.insertOne(data);
      console.log(clc.green('Glucose entry recorded successfully.'));
      return result
    } catch (error) {
      console.error(clc.red('Error recording glucose entry:'), error);
      throw error;
    }
  }

  async recordMany(data: GlucoseEntry[]): Promise<InsertManyResult<GlucoseEntry>> {
    try {
      await this.connect();
      const result = await this.collection.insertMany(data);
      console.log('Multiple glucose entries recorded successfully.');
      return result;
    } catch (error) {
      console.error('Error recording multiple glucose entries:', error);
      throw error;
    }
  }
}

export default GlucoseMongoClient;