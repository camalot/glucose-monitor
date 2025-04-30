import fs from 'fs';
import Migrations from '../mongo/Migrations';

export default class MigrationRunner {
  // find all migration scripts that match [0-9]+-([a-zA-Z0-9_]+)

  findMigrationScripts(): string[] {
    const migrationFiles = fs.readdirSync(__dirname).filter(file => /^[0-9]+-([a-zA-Z0-9_-]+)\.(?:ts|js)$/.test(file));
    return migrationFiles;
  }

  async initialize(): Promise<void> {
    console.log('Initializing migrations...');
    const migrations = this.findMigrationScripts();
    const mdb = new Migrations();

    // Use Promise.all to handle async filtering
    const filtered = (
      await Promise.all(
        migrations.map(async (x) => {
          const migrationName = x.replace(/\.(ts|js)$/, '');
          const alreadyPerformed = await mdb.migrationAlreadyPerformed(migrationName);
          return { migrationName: x, alreadyPerformed };
        })
      )
    ).filter(({ alreadyPerformed }) => !alreadyPerformed)
     .map(({ migrationName }) => migrationName);

    const migrationPromises = filtered.map(async (migration) => {
      // trim extension off
      const migrationName = migration.replace(/\.(ts|js)$/, '');
      console.log(`Executing migration: ${migrationName}`);
      const module = await import(`./${migrationName}`);
      const MigrationClass = module.default;
      const migrationInstance = new MigrationClass();
      try {
        await migrationInstance.run();
        console.log(`Migration ${migrationName} executed successfully.`);
        await mdb.record(migrationName);
      } catch (error) {
        console.error(`Error recording migration ${migrationName}:`, error);
      } finally {
        console.log(`Finished executing migration: ${migrationName}`);
      }
    });

    await Promise.all(migrationPromises);
  }
}
