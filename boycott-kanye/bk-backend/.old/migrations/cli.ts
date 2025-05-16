#!/usr/bin/env ts-node
/**
 * PocketBase Migration CLI Script
 * 
 * Run with: npx ts-node migrations/cli.ts 
 * Or with custom credentials: npx ts-node migrations/cli.ts admin@example.com your_admin_password
 */

// Import dotenv for environment variables
import * as dotenv from 'dotenv';
// Load .env file if it exists
dotenv.config();

const PocketBaseLib = require('pocketbase/cjs');
import { runAllMigrations } from './index';
import { getPocketBaseUrl, getPocketBaseAdminCredentials } from '../src/config/pocketbase.config';

/**
 * Main migration function
 */
async function runMigrations(adminEmail: string, adminPassword: string): Promise<void> {
  try {
    console.log('Starting migration process...');
    // Use the URL from config
    const pb = new PocketBaseLib(getPocketBaseUrl());

    // Login as admin
    console.log('Logging in as admin...');
    await pb.admins.authWithPassword(adminEmail, adminPassword);

    // Run all migrations
    const results = await runAllMigrations(pb);
    
    // Check if all migrations were successful
    const allSuccessful = Object.values(results).every(success => success === true);
    if (allSuccessful) {
      console.log('\nAll migrations completed successfully!');
    } else {
      console.error('\nSome migrations failed. Check the logs above for details.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Migration process error:', error);
    process.exit(1);
  }
}

// Get credentials from command line arguments or from config
const cliArgs = process.argv.slice(2);
const configCreds = getPocketBaseAdminCredentials();

// Use CLI args if provided, otherwise use config
const adminEmail = cliArgs[0] || configCreds.email;
const adminPassword = cliArgs[1] || configCreds.password;

if (!adminEmail || !adminPassword) {
  console.error('Error: Admin credentials not provided and not found in environment');
  console.error('Usage: npx ts-node migrations/cli.ts admin@example.com your_admin_password');
  process.exit(1);
}

console.log(`Using admin email: ${adminEmail}`);

// Run migrations
runMigrations(adminEmail, adminPassword)
  .then(() => {
    process.exit(0);
  })
  .catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
  }); 