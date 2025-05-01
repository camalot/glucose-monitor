// const stripJsonComments = require('strip-json-comments').default;
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Helper function to execute shell commands
function runCommand(command, description) {
  try {
    console.log(`\n[INFO] ${description}`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`[ERROR] Failed to ${description}`);
    console.error(error.message);
    process.exit(1);
  }
}

// read the tsconfig.json file
const tsconfigPath = path.resolve(__dirname, 'tsconfig.json');
if (!fs.existsSync(tsconfigPath)) {
  console.error(`[ERROR] tsconfig.json not found at ${tsconfigPath}`);
  process.exit(1);
}

// Parse JSON with comments allowed
const tsconfigContent = fs.readFileSync(tsconfigPath, 'utf8');
const tsconfig = JSON.parse(tsconfigContent);
if (!tsconfig.compilerOptions) {
  console.error(`[ERROR] Invalid tsconfig.json: missing compilerOptions`);
  process.exit(1);
}


const appDir = path.resolve(__dirname, tsconfig.compilerOptions.outDir);
if (!fs.existsSync(appDir)) {
  fs.mkdirSync(appDir, { recursive: true });
}

// Empty everything in the app directory
if (process.argv.includes('--clean')) {
  fs.rmSync(appDir, { recursive: true, force: true });
  fs.mkdirSync(appDir, { recursive: true });
}

// Run package-sync.js
runCommand('node package-sync.js', 'sync package.json');

// only run this if `--install` flag passed in

if (process.argv.includes('--install')) {
  //  Install dependencies in the ./app directory
  runCommand(`npm install --prefix ${appDir}`, `install dependencies in ${appDir}`);
}

// Compile TypeScript
runCommand('tsc', 'compile TypeScript');

// Copy migrations data
runCommand(
  `npx copyfiles -u 4 ./src/libs/migrations/data/**/* ${appDir}/libs/migrations/data/`,
  'copy migrations data'
);

// Copy assets
runCommand(
  `npx copyfiles -u 2 ./src/assets/**/* ${appDir}/assets/`,
  'copy assets'
);

// Copy views
runCommand(
  `npx copyfiles -u 2 ./src/views/**/* ${appDir}/views/`,
  'copy views'
);

// Copy .env file
runCommand(
  `npx copyfiles -u 0 .env ${appDir}/`,
  'copy .env file'
);

console.log('\n[INFO] Build process completed successfully!');