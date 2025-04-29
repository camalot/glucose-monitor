import fs from 'fs'

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

      console.log(`Executing migration: ${migrationName}`);
      return import(`./${migration}`).then(module => {
        const MigrationClass = module.default;
        const migrationInstance = new MigrationClass();
        return migrationInstance.run().catch(error => {
          console.error(`Error running migration ${migrationName}:`, error);
        }).finally(() => {
          console.log(`Finished executing migration: ${migrationName}`);
        });
      });
    });

    await Promise.all(migrationPromises);
  }
}
