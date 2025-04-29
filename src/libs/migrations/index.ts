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
    console.log(migrations);

    const migrationPromises = migrations.map(migration => {

      // trim extension off
      const migrationName = migration.replace(/\.(ts|js)$/, '');
      // check if this migration was ran

      console.log(`Executing migration: ${migrationName}`);
      return import(`./${migrationName}`).then(module => {
        const MigrationClass = module.default;
        const migrationInstance = new MigrationClass();


        return migrationInstance.run().then(() => {
          return new Promise<void>((resolve, reject) => {
            console.log(`Migration ${migrationName} executed successfully.`);
            const m = new Migrations();
            return m.connect().then(() => {
              return m.record(migrationName);
            }).then(() => {
              console.log(`Migration ${migrationName} has been completed.`);
              resolve();
            }).catch((error) => {
              console.error(`Error recording migration ${migrationName}:`, error);
              reject(error);
            });
          });
        }).catch(error => {
          console.error(`Error running migration ${migrationName}:`, error);
        }).finally(() => {
          console.log(`Finished executing migration: ${migrationName}`);
        });
      });
    });

    await Promise.all(migrationPromises);
  }
}
