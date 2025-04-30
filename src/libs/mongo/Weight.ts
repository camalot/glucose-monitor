import DatabaseMongoClient from './Database'
import config from '../../config/env';
import clc from 'cli-color';
import WeightEntry from '../../models/WeightEntry';
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

  async getLimit(count: number = 10): Promise<WeightEntry[]> {
    try {
      await this.connect();
      return await this.collection
        .find({}, { sort: { timestamp: 1 }, limit: count }).toArray();
    } catch (error) {
      console.error("Error retrieving weight entries:", error);
      return [];
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
