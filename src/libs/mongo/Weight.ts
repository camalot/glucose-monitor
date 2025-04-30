import DatabaseMongoClient from './Database'
import config from '../../config/env';
import clc from 'cli-color';
import WeightEntry from '../../models/WeightEntry';
import moment from 'moment-timezone';
import { Collection, InsertManyResult } from 'mongodb';

export default class WeightMongoClient extends DatabaseMongoClient<WeightEntry> {

  constructor() {
    super();
    this.collectionName = 'weight';
    console.log("WeightMongoClient initialized");
  }

  async record(entry: WeightEntry): Promise<void> {
    try{
      await this.connect();
      await this.collection.insertOne(entry);
    } catch(error) {
      console.error("Error recording weight entry:", error);
    }

  }

  async recordMany(data: WeightEntry[]): Promise<InsertManyResult<WeightEntry>> {
      try {
        await this.connect();
        const result = await this.collection.insertMany(data);
        console.log('Multiple weight entries recorded successfully.');
        return result;
      } catch (error) {
        console.error('Error recording multiple weight entries:', error);
        throw error;
      }
    }

  async getLimit(limit: number = 10): Promise<WeightEntry[]> {
    try {
      console.log("WeightMongoClient connecting");
      await this.connect();
      // ignore _id from result
      const entries = await this.collection.find({}, { projection: { _id: 0 }, sort: { timestamp: -1 } }).limit(limit).toArray();
      return entries;
    } catch (error) {
      console.error("Error fetching weight entries:", error);
      throw error;
    }
  }

  async getAfter(start: Date): Promise<WeightEntry[]> {
      try {
        await this.connect();
        let ts = moment(start).unix()
        const entries = await this.collection.find({ timestamp: { "$gt": ts } }, { sort: { timestamp: 1 } }).toArray();
        return entries;
      } catch (error) {
        console.error("Error fetching weight entries:", error);
        throw error;
      }
    }

  async getAll(): Promise<WeightEntry[]> {
    try {
      await this.connect();
      return await this.collection.find({}, { sort: { timestamp: 1 } }).toArray();
    } catch(error) {
      console.error("Error retrieving weight entries:", error);
      return [];
    }
  }

  
}
