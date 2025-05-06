import fs from 'fs';
import path from 'path';
import { Units, UnitType } from '../Units';
import SavedFoodMongoClient from '../mongo/SavedFoods';
import FoodEntry from '../../models/FoodEntry';
import moment from 'moment-timezone';
import { DiabetesMFoodItem } from '../../models/DiabetesMFoodItem';
import { time } from 'console';

export default class FoodTableMyDiabetesMMigration implements Migration {
  async run(): Promise<void> {
    // Path to the JSON file  
    const JSON_FILE_PATH = path.join(__dirname, 'data', 'food_table.json');
    let client: SavedFoodMongoClient;
    client = new SavedFoodMongoClient();

    try {
      // Read and parse the JSON file
      const fileContent = fs.readFileSync(JSON_FILE_PATH, 'utf-8');
      const root = JSON.parse(fileContent);
      if (root.length === 0) {
        console.warn('No entries found in the JSON file.');
        return;
      }
      const importData = root[0];
      const fields: string[] = importData.header;
      const entries: any[] = importData.rows;

      // Connect to MongoDB
      await client.connect();

      // Prepare the data for insertion
      const data = entries.filter(x => {
        const itemIndex = fields.indexOf('_id');
        const item_entry = x[itemIndex];
        return item_entry !== '' && item_entry !== 'NULL';
      }).map((entry: any) => {
        /*
          "_id",
          "device_id",
          "input_id",
          "timestamp",
          "name",
          "portion",
          "category",
          "carbs",
          "proteins",
          "fats",
          "calories",
          "deleted",
          "barcode",
          "sync_flags"
        */
        const idIndex = fields.indexOf('_id');
        const id = entry[idIndex];

        const timestampIndex = fields.indexOf('timestamp');
        const timestamp = moment(parseInt(entry[timestampIndex])).unix();
        // const item_converted = Units.convert(item_entry, UnitType.KG, UnitType.LB);

        const nameIndex = fields.indexOf('name');
        const name = entry[nameIndex];

        const servingIndex = fields.indexOf('portion');
        const serving = entry[servingIndex];

        const carbsIndex = fields.indexOf('carbs');
        const carbs = parseFloat(entry[carbsIndex]);

        const proteinIndex = fields.indexOf('proteins');
        const protein = parseFloat(entry[proteinIndex]);

        const caloriesIndex = fields.indexOf('calories');
        const calories = parseFloat(entry[caloriesIndex]);

        const upcIndex = fields.indexOf('barcode');
        const upc = entry[upcIndex] === 'NULL' ? null : entry[upcIndex];

        if (name === null || name.trim() === '' || name === undefined) {
          // skip
          return null; // skip this entry
        }

        return new FoodEntry(
          name,
          undefined,
          undefined,
          serving,
          undefined,
          undefined,
          calories,
          'kcal',
          carbs,
          'g',
          timestamp,
          undefined,
          undefined,
          protein,
          'g',
          undefined,
          undefined,
          undefined,
          undefined,
          '',
          upc,
          'Diabetes:M',
          id
        );
      });


      // disabled because it was running multiple times.

      const filteredData = data.filter(x => x !== null && x !== undefined);

      // Insert the data into the weight collection
      const result = await client.recordMany(filteredData);
      console.log(`${result.insertedCount} records inserted into the saved foods collection`);
    } catch (error) {
      console.error('Error importing foods data:', error);
    } finally {
      // Close the MongoDB connection
      if (client) {
        await client.close();
        console.log('MongoDB connection closed');
      }
    }
  }
}