const fs = require('fs');
const path = require('path');

// Paths to package.json files
const rootPackagePath = path.resolve(__dirname, 'package.json');
const appPackagePath = path.resolve(__dirname, 'app', 'package.json');

console.log(`Looking for package.json files...`);
console.log(`root: ${rootPackagePath}`);
console.log(`app: ${appPackagePath}`);


if (!fs.existsSync(rootPackagePath)) {
  console.log("Root package does not exist");
  process.exit(1);
}

// Read and parse the root package.json
console.log(`Reading root package.json from ${rootPackagePath}`);
const rootPackage = JSON.parse(fs.readFileSync(rootPackagePath, 'utf-8'));

const BUILD_VERSION = process.env.BUILD_VERSION || rootPackage.version || '1.0.0-snapshot';
const BUILD_REF = process.env.BUILD_REF || 'default-ref';
const BUILD_SHA = process.env.BUILD_SHA || 'default-sha';
const BUILD_DATE = process.env.BUILD_DATE || new Date().toISOString();

if (!fs.existsSync(appPackagePath)) {
  console.log("App package does not exist");
  // create it
  fs.writeFileSync(appPackagePath, JSON.stringify({ name: `${rootPackage.name}-app`, version: "1.0.0", dependencies: {} }, null, 2), 'utf-8');
}

// Read and parse the app package.json
console.log(`Reading app package.json from ${appPackagePath}`);
const appPackage = JSON.parse(fs.readFileSync(appPackagePath, 'utf-8'));

// Sync dependencies
appPackage.dependencies = {
  ...rootPackage.dependencies,
  ...appPackage.dependencies, // Keep any additional dependencies in app/package.json
};

console.log(`Updating application version from ${appPackage.version} to ${BUILD_VERSION}`);
appPackage.version = BUILD_VERSION;
appPackage.buildSha = BUILD_SHA;
appPackage.buildDate = BUILD_DATE;
appPackage.buildRef = BUILD_REF;
appPackage.name = `${rootPackage.name}-app`;
appPackage.description = rootPackage.description;
appPackage.author = rootPackage.author;
appPackage.license = rootPackage.license;

// Write the updated app package.json back to disk
fs.writeFileSync(appPackagePath, JSON.stringify(appPackage, null, 2), 'utf-8');

console.log(`Dependencies synced from root package.json to app/package.json on ${new Date().toISOString()}`);