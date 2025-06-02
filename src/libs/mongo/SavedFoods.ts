// @ts-nocheck
import DatabaseMongoClient from './Database'
import FoodEntry from '../../models/FoodEntry';
import { Abortable, Filter, FindOptions, InsertManyResult, InsertOneResult, UpdateResult } from 'mongodb';

export default class SavedFoodMongoClient extends DatabaseMongoClient<FoodEntry> {
  constructor() {
    super();
    this.collectionName = 'saved_foods';
    console.log("FoodMongoClient initialized");
  }

  async find(filter: Filter<FoodEntry>, prediction?: FindOptions<FoodEntry> & Abortable): Promise<FoodEntry[]> {
    try {
      await this.connect();
      const results = await this.collection.find(filter, prediction).toArray();
      return results;
    } catch (error) {
      console.error('Error in find method:', error);
      throw error;
    }
  }

  async record(data: FoodEntry): Promise<UpdateResult<FoodEntry>> {
    try {
      if (FoodEntry.isEmpty(data)) {
        console.warn('Empty food entry data provided, skipping record.');
        return { acknowledged: true, matchedCount: 0, modifiedCount: 0, upsertedId: null } as UpdateResult<FoodEntry>;
      }
      await this.connect();
      const result = await this.collection.updateOne(
        { source_id: data.source_id },
        { $set: data },
        { upsert: true }
      );
      console.log('Food entry recorded successfully.');
      return result;
    } catch (error) {
      console.error('Error recording food entry:', error);
      throw error;
    }
  }

  async recordMany(data: FoodEntry[]): Promise<InsertManyResult<FoodEntry>> {
      try {
        await this.connect();
        // do not insert duplicates that have the same source_id and source if source_id is not undefined, and source is not empty or undefined
        const filteredData: FoodEntry[] = [];
        for (const entry of data) {
          if (entry.source_id !== undefined && entry.source && entry.source.trim() !== '') {
            const existingEntry = await this.collection.findOne({
              source_id: entry.source_id,
              source: entry.source,
            });
            if (!existingEntry) {
              // also check if filteredData already has this record
              if (!filteredData.some(
                existing => existing.source_id === entry.source_id && existing.source === entry.source
              )) {
                filteredData.push(entry);
              }
            }
          } else {
            filteredData.push(entry); // Include entries without source_id or source
          }
        }

        if (filteredData.length === 0) {
          console.log('No new entries to insert.');
          return { acknowledged: true, insertedCount: 0, insertedIds: {} } as InsertManyResult<FoodEntry>;
        }

        // Insert the filtered data
        const result = await this.collection.insertMany(filteredData);
        console.log('Multiple food entries recorded successfully.');
        return result;
        // const result = await this.collection.insertMany(data);
        // console.log('Multiple food entries recorded successfully.');
        // return result;
      } catch (error) {
        console.error('Error recording multiple food entries:', error);
        throw error;
      } finally {
        await this.close();
      }
    }
}
