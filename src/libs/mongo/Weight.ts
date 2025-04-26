import DatabaseMongoClient from './Database'
import config from '../../config/env';
import clc from 'cli-color';
import WeightEntry from '../../models/WeightEntry';
import { Collection } from 'mongodb';

export default class WeightMongoClient extends DatabaseMongoClient<WeightEntry> {

  constructor() {
    super();
    this.collectionName = 'weight';
    console.log("WeightMongoClient initialized");
  }

  async add(entry: WeightEntry): Promise<void> {
    try{
      await this.connect();
      await this.collection.insertOne(entry);
    } catch(error) {
      console.error("Error adding weight entry:", error);
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
