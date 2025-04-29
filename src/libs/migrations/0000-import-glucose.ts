import fs from 'fs';
import path from 'path';
import Units from '../Units';
import GlucoseMongoClient from '../mongo/Glucose';
import moment from 'moment-timezone';

export default class GlucoseFromMyDiabetesMMigration implements Migration {
  async run(): Promise<void> {
    // Path to the JSON file  
    const JSON_FILE_PATH = path.join(__dirname, 'data', 'entries_table.json');
    let client: GlucoseMongoClient;

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
      client = new GlucoseMongoClient();
      await client.connect();

      // Prepare the data for insertion
      const glucoseData = entries.filter(x => {
        const glucoseIndex = fields.indexOf('glucose');
        const glucose = parseFloat(x[glucoseIndex]);
        return glucose > 0;
      }).map((entry: any) => {
        const glucoseIndex = fields.indexOf('glucose');
        const glucose = parseFloat(entry[glucoseIndex]);

        const timestampIndex = fields.indexOf('entry_datetime');

        const timestamp = moment(parseInt(entry[timestampIndex])).unix();
        const glucoseMgDl = Units.Units.convert(glucose, Units.UnitType.MMOLL, Units.UnitType.MGDL);
        console.log({
          entry_datetime: timestamp,
          glucose: glucose,
          converted_glucose: glucoseMgDl,
        });

        return {
          timestamp,
          glucose: glucoseMgDl,
        };
      });

      // Insert the data into the glucose collection
      // const result = await client.recordMany(glucoseData);
      // console.log(`${result.insertedCount} records inserted into the glucose collection`);
    } catch (error) {
      console.error('Error importing glucose data:', error);
    } finally {
      // Close the MongoDB connection
      if (client) {
        await client.close();
        console.log('MongoDB connection closed');
      }
    }
  }
}