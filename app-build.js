// const stripJsonComments = require('strip-json-comments').default;
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Helper function to execute shell commands
function runCommand (command, description) {
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
  console.error('[ERROR] Invalid tsconfig.json: missing compilerOptions');
  process.exit(1);
}

const appDir = path.resolve(__dirname, tsconfig.compilerOptions.outDir);
if (!fs.existsSync(appDir)) {
  console.log(`[INFO] Creating directory: ${appDir}`);
  fs.mkdirSync(appDir, { recursive: true });
}

// Empty everything in the app directory
if (process.argv.includes('--clean')) {
  console.log(`[INFO] Cleaning directory: ${appDir}`);
  fs.rmSync(appDir, { recursive: true, force: true });
  fs.mkdirSync(appDir, { recursive: true });
}

// copy package.json
// runCommand(`npx copyfiles -u 0 package.json ${SRC_DIR}`, 'copy package.json');
// runCommand(`npm install --prefix ${SRC_DIR}`, `install dependencies in ${SRC_DIR}`);
// fs.rmSync(`${SRC_DIR}/package-lock.json`, { force: true });
// fs.rmSync(`${SRC_DIR}/package.json`, { force: true });

// Run package-sync.js
runCommand('node package-sync.js', 'sync package.json');

// only run this if `--install` flag passed in

if (process.argv.includes('--install')) {
  //  Install dependencies in the ./app directory
  runCommand(`npm install --prefix ${appDir}`, `install dependencies in ${appDir}`);
}

// Compile TypeScript
runCommand('npx tsc', 'compile TypeScript');

// Copy migrations data
runCommand(
  `npx copyfiles -u 4 ./src/libs/migrations/data/* ${appDir}/libs/migrations/data/`,
  'copy migrations data'
);

// Copy assets
runCommand(
  `npx copyfiles -u 2 ./src/assets/* ${appDir}/assets/`,
  `copy ./src/assets/* => ${appDir}/assets/`
);
runCommand(
  `npx copyfiles -u 2 ./src/assets/**/* ${appDir}/assets/`,
  `copy ./src/assets/**/* => ${appDir}/assets/`
);
runCommand(`ls ${appDir}/assets`, `list ${appDir}/assets`);


// Copy views
runCommand(
  `npx copyfiles -u 2 ./src/views/* ${appDir}/views/`,
  `copy ./src/views/* => ${appDir}/views/`
);
runCommand(
  `npx copyfiles -u 2 ./src/views/**/* ${appDir}/views/`,
  `copy ./src/views/**/* => ${appDir}/views/`
);
runCommand(`ls ${appDir}/views`, `list ${appDir}/views`);

// only copy .env if it exists
// Copy .env file
if (fs.existsSync('.env')) {
  runCommand(
    `npx copyfiles -u 0 .env ${appDir}/`,
    `copy .env => ${appDir}/`
  );
}

console.log('\n[INFO] Build process completed successfully!');
