// @ts-nocheck
import DatabaseMongoClient from './Database'
import MigrationEntry from '../../models/MigrationEntry';

export default class MigrationsMongoClient extends DatabaseMongoClient<MigrationEntry> {

  constructor() {
    super();
    this.collectionName = 'migrations';
    console.log("MigrationsMongoClient initialized");
  }

  async record(id: string): Promise<MigrationEntry | null> {
    try {
      if (await this.migrationAlreadyPerformed(id)) {
        console.log(`Migration for ID: ${id} has already been performed.`);
        return null;
      }

      console.log(`Recording migration for ID: ${id}`);
      const migrationEntry = new MigrationEntry(id);
      await this.connect();
      await this.collection.insertOne(migrationEntry);
      return migrationEntry;
    } catch (error) {
      console.error(`Error recording migration for ID: ${id}`, error);
      return null;
    }
  }

  async getMigration(id: string): Promise<MigrationEntry | null> {
    try {
      console.log(`Fetching migration for ID: ${id}`);
      await this.connect();

      const migrationEntry = await this.collection.findOne({ id });
      return migrationEntry ? new MigrationEntry(migrationEntry.id, migrationEntry.timestamp, migrationEntry.ran) : null;
    } catch (error) {
      console.error(`Error fetching migration for ID: ${id}`, error);
      return null;
    }
  }

  async migrationAlreadyPerformed(id: string): Promise<boolean> {
    try {
      console.log(`Checking if migration has been performed for ID: ${id}`);
      await this.connect();
      const migrationEntry = await this.collection.findOne({ id });
      console.log(`Migration entry found: ${migrationEntry !== null}`);
      return migrationEntry !== null;
    } catch (error) {
      console.error(`Error checking migration status for ID: ${id}`, error);
      return false;
    }
  }

}
