import { execSync } from 'child_process';
import * as path from 'path';

// Use CommonJS __dirname directly
const rootDir = path.join(__dirname, '..', '..');

console.log('==== Starting PocketBase migration and verification ====\n');

// Step 1: Create .env file
console.log('Step 1: Creating .env file...');
try {
  // Let NodeJS resolve the path relative to current working directory
  execSync('node ./dist/migrations/scripts/create-env.js', {
    stdio: 'inherit',
  });
  console.log('✅ .env file created successfully\n');
} catch (error) {
  console.error('❌ Failed to create .env file:', error.message);
  process.exit(1);
}

// Step 2: Run migration
console.log('Step 2: Running database migration...');
try {
  // Let NodeJS resolve the path relative to current working directory
  execSync('node ./dist/migrations/cli.js', { stdio: 'inherit' });
  console.log('✅ Migration and test data creation completed successfully\n');
} catch (error) {
  console.error('❌ Migration or test data creation failed:', error.message);
  process.exit(1);
}

console.log('==== All steps completed successfully ====');
console.log('PocketBase collections (posts, signatures) are ready to use.');
console.log('Test data has been created.');
console.log(
  '\nYou can interact with them through the PocketBase admin UI or API.',
);
