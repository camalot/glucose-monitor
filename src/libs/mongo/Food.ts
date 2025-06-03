// @ts-nocheck
import DatabaseMongoClient from './Database'
import FoodEntry from '../../models/FoodEntry';
import Identity from '../Identity';
import clc from 'cli-color';
import moment from 'moment-timezone';

export default class FoodMongoClient extends DatabaseMongoClient<FoodEntry> {

  constructor() {
    super();
    this.collectionName = 'foods';
    console.log("FoodMongoClient initialized");
  }

  async getToday(): Promise<FoodEntry[]> {
    return await this.getBetween(moment().startOf('day').toDate(), moment().endOf('day').toDate());
  }

  async getBetween(start: Date, end: Date): Promise<FoodEntry[]> {
      try {
        await this.connect();
        const tsstart = moment(start).unix();
        const tsend = moment(end).unix();
        const entries = await this.collection.find({ timestamp: { "$gt": tsstart, "$lt": tsend } }, { sort: { timestamp: -1 } }).toArray();
        return entries;
      } catch (error) {
        console.error("Error fetching food entries:", error);
        throw error;
      } finally {
        await this.close();
      }
    }

  // async recordMany(entries: FoodEntry[]): Promise<void> {
  //   try {
  //     const modified = FoodEntry[];
  //     for (const entry of entries) {
  //       if (FoodEntry.isEmpty(entry)) {
  //         throw new Error("Cannot add an empty food entry.");
  //       }
  //       if (!entry.source_id) {
  //         entry.source_id = Identity.generate(entry);
  //       }
  //       const { json, ...entryWithoutJson } = entry;
  //       modified.push(entryWithoutJson);
  //     }
  //     // skip json field.
  //     await this.connect();
  //     await this.collection.updateMany(
  //       { source_id: entry.source_id },
  //       { $set: entryWithoutJson },
  //       { upsert: true }
  //     );
  //   } catch (error) {
  //     console.error(clc.red('Error recording food entry:'), error);
  //     throw error;
  //   }
  // }


  async record(entry: FoodEntry): Promise<void> {
    try {
      if (FoodEntry.isEmpty(entry)) {
        throw new Error("Cannot add an empty food entry.");
      }
      if (!entry.source_id) {
        entry.source_id = Identity.generate(entry);
      }
      // skip json field.
      const { json, ...entryWithoutJson } = entry;
      await this.connect();
      await this.collection.updateOne(
        // use the source_id and the timestamp
        { source_id: entry.source_id, timestamp: entry.timestamp }, 
        { $set: entryWithoutJson }, 
        { upsert: true }
      );
    } catch (error) {
      console.error(clc.red('Error recording food entry:'), error);
      throw error;
    } finally {
      await this.close();
    }
  }

}
