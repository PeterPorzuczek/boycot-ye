/**
 * Script to set up and test the database
 * This script:
 * 1. Creates a .env file
 * 2. Runs migrations
 * 3. Creates a test signature
 * 4. Checks the database structure
 */
const { execSync } = require('child_process');
const path = require('path');

// Path to project root
const rootDir = path.join(__dirname, '..');

console.log('==== Starting PocketBase migration and verification ====\n');

// Step 1: Create .env file
console.log('Step 1: Creating .env file...');
try {
  execSync('node scripts/create-env.js', { cwd: rootDir, stdio: 'inherit' });
  console.log('✅ .env file created successfully\n');
} catch (error) {
  console.error('❌ Failed to create .env file:', error.message);
  process.exit(1);
}

// Step 2: Run migration
console.log('Step 2: Running database migration...');
try {
  execSync('node migrations/cli.js', { cwd: rootDir, stdio: 'inherit' });
  console.log('✅ Migration completed successfully\n');
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}

// Step 3: Create test data
console.log('Step 3: Creating test signature...');
try {
  execSync('node scripts/create-test-signature.js', { cwd: rootDir, stdio: 'inherit' });
  console.log('✅ Test data created successfully\n');
} catch (error) {
  console.error('❌ Failed to create test data:', error.message);
  // Continue execution even if this fails
}

// Step 4: Verify database structure
console.log('Step 4: Verifying database structure...');
try {
  execSync('node scripts/check-signatures.js', { cwd: rootDir, stdio: 'inherit' });
  console.log('✅ Database verification completed\n');
} catch (error) {
  console.error('❌ Verification failed:', error.message);
  process.exit(1);
}

console.log('==== All steps completed successfully ====');
console.log('PocketBase signatures collection is ready to use.');
console.log('\nYou can interact with it through the following endpoints:');
console.log('- GET    /api/collections/signatures/records      - List all signatures');
console.log('- GET    /api/collections/signatures/records/:id  - Get a single signature');
console.log('- POST   /api/collections/signatures/records      - Create a new signature');
console.log('- PATCH  /api/collections/signatures/records/:id  - Update a signature');
console.log('- DELETE /api/collections/signatures/records/:id  - Delete a signature'); 