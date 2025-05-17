import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const currentModulePath = fileURLToPath(import.meta.url);
const currentModuleDir = path.dirname(currentModulePath);

// Determine project root. This script might be run from src or from dist.
// If run from '.../dist/migrations/scripts/', project root is three levels up.
// If run from '.../migrations/scripts/' (e.g. using ts-node), project root is two levels up.
let projectRoot: string;
if (currentModulePath.includes(path.sep + 'dist' + path.sep)) {
  // Running from compiled version in dist (e.g. project_root/dist/migrations/scripts/create-env.js)
  projectRoot = path.resolve(currentModuleDir, '..', '..', '..');
} else {
  // Running from source (e.g. project_root/migrations/scripts/create-env.ts)
  projectRoot = path.resolve(currentModuleDir, '..', '..');
}

const sourceEnvPath = path.join(projectRoot, '.env');
const distDir = path.join(projectRoot, 'dist');
const destinationEnvPath = path.join(distDir, '.env');

console.log(`Source .env path: ${sourceEnvPath}`);
console.log(`Destination .env path: ${destinationEnvPath}`);

// Check if source .env file exists
if (!fs.existsSync(sourceEnvPath)) {
  console.error(`❌ Error: Source .env file not found at ${sourceEnvPath}`);
  console.error('Please ensure a .env file exists in the project root.');
  process.exit(1); // Exit with an error code
}

try {
  // Ensure the dist directory exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
    console.log(`📂 Created directory: ${distDir}`);
  }

  // Copy the .env file
  fs.copyFileSync(sourceEnvPath, destinationEnvPath);
  console.log(
    `✅ Successfully copied ${sourceEnvPath} to ${destinationEnvPath}`,
  );
  console.log(
    '\nThis .env file will now be available to your compiled application in the "dist" directory.',
  );
  console.log('You can now run migrations or start your application.');
} catch (error) {
  console.error(`❌ Error copying .env file: ${error}`);
  process.exit(1);
}
