import fs from 'fs';
import path from 'path';
import { Units, UnitType } from '../Units';
import SavedFoodMongoClient from '../mongo/SavedFoods';
import FoodEntry from '../../models/FoodEntry';
import moment from 'moment-timezone';
import { DiabetesMFoodItem } from '../../models/DiabetesMFoodItem';

export default class FoodsFromMyDiabetesMMigration implements Migration {
  async run(): Promise<void> {
    // Path to the JSON file  
    const JSON_FILE_PATH = path.join(__dirname, 'data', 'entries_table.json');
    let client: SavedFoodMongoClient;

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
      client = new SavedFoodMongoClient();
      await client.connect();

      // Prepare the data for insertion
      const data = entries.filter(x => {
        const itemIndex = fields.indexOf('food_list');
        const item_entry = x[itemIndex];
        return item_entry !== '' && item_entry !== 'NULL';
      }).map((entry: any) => {
        const itemIndex = fields.indexOf('food_list');
        const item_entry = entry[itemIndex];

        const timestampIndex = fields.indexOf('entry_datetime');

        // write item_entry to food_item_entries.txt
        fs.appendFileSync(path.join(__dirname, 'data', 'food_item_entries.txt'), item_entry + '\n'); // append item_entry to file

        const timestamp = moment(parseInt(entry[timestampIndex])).unix();
        // const item_converted = Units.convert(item_entry, UnitType.KG, UnitType.LB);

        // 639|12|Air Popped Popcorn|Air Popped Popcorn - 2.0 cup|cup|0.8|12.0|2.0|62.0
        // id|category_id|name|description|serving|weight|carbohydrates|protein|calories
        // take the item_entry and split it by |
        
        const itemDetails = item_entry.split('|');
        const id = parseInt(itemDetails[0]);
        const categoryId = parseInt(itemDetails[1]);
        const name = itemDetails[2] || itemDetails[3];
        const description = itemDetails[3] || itemDetails[2];
        const serving = itemDetails[4];
        const weight = parseFloat(itemDetails[5]);
        const carbs = parseFloat(itemDetails[6]);
        const protein = parseFloat(itemDetails[7]);
        const calories = parseFloat(itemDetails[8]);

        if (name === null || name.trim() === '' || name === undefined) {
          // skip
          return null; // skip this entry
        }

        return new DiabetesMFoodItem(
          id.toString(),
          categoryId,
          name,
          description,
          serving,
          weight,
          carbs,
          protein,
          calories,
          timestamp
        ).toFoodEntry();
      });
      // disabled because it was running multiple times.
      const filteredData = data.filter(x => x !== null && x !== undefined);
      // Insert the data into the weight collection
      // const result = await client.recordMany(filteredData);
      // console.log(`${result.insertedCount} records inserted into the saved foods collection`);
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