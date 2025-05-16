/**
 * PocketBase Migration CLI Script
 */

import { runAllMigrations } from './index';

// PocketBase connection configuration
const PB_URL = 'http://localhost:8090';
const ADMIN_EMAIL = 'por314ug@gmail.com';
const ADMIN_PASSWORD = 'Qwerty1234!';

async function main() {
  try {
    // Dynamically import PocketBase
    const { default: PocketBase } = await import('pocketbase');

    // Initialize PocketBase client
    const pb = new PocketBase(PB_URL);

    console.log(`Authenticating with PocketBase at ${PB_URL}...`);

    // Authenticate as admin
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log('✅ Authentication successful!');

    // Run all migrations
    await runAllMigrations(pb);

    console.log('\n==== All migrations completed ====');
  } catch (error) {
    console.error('Migration script error:', error);
    process.exit(1);
  }
}

// Run the main function
main().catch(console.error);
