import fs from 'fs';
import path from 'path';
import { Units, UnitType } from '../Units';
import WeightMongoClient from '../mongo/Weight';
import WeightEntry from '../../models/WeightEntry';
import moment from 'moment-timezone';

export default class WeightFromMyDiabetesMMigration implements Migration {
  async run(): Promise<void> {
    // Path to the JSON file  
    const JSON_FILE_PATH = path.join(__dirname, 'data', 'entries_table.json');
    let client: WeightMongoClient;

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
      client = new WeightMongoClient();
      await client.connect();

      // Prepare the data for insertion
      const data = entries.filter(x => {
        const itemIndex = fields.indexOf('weight_entry');
        const item_entry = parseFloat(x[itemIndex]);
        return item_entry > 0;
      }).map((entry: any) => {
        const itemIndex = fields.indexOf('weight_entry');
        const item_entry = parseFloat(entry[itemIndex]);

        const timestampIndex = fields.indexOf('entry_datetime');

        const timestamp = moment(parseInt(entry[timestampIndex])).unix();
        const item_converted = Units.convert(item_entry, UnitType.KG, UnitType.LB);
        // console.log({
        //   entry_datetime: timestamp,
        //   weight: item_entry,
        //   converted_weight: item_converted,
        // });

        return new WeightEntry(
          item_converted, 
          UnitType.LB, 
          timestamp, 
          "imported from MyDiabetesM"
        );
      });

      // Insert the data into the weight collection
      const result = await client.recordMany(data);
      console.log(`${result.insertedCount} records inserted into the weight collection`);
    } catch (error) {
      console.error('Error importing weight data:', error);
    } finally {
      // Close the MongoDB connection
      if (client) {
        await client.close();
        console.log('MongoDB connection closed');
      }
    }
  }
}