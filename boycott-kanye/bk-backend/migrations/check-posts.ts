/**
 * Script to check posts records
 * 
 * Run with: npx ts-node migrations/check-posts.ts
 * Or with custom credentials: npx ts-node migrations/check-posts.ts admin@example.com password
 */

// Import dotenv for environment variables
import * as dotenv from 'dotenv';
// Load .env file if it exists
dotenv.config();

// Use a different name to avoid redeclaration
const PocketBaseLib = require('pocketbase/cjs');
import { getPocketBaseUrl, getPocketBaseAdminCredentials } from '../src/config/pocketbase.config';

async function checkPosts(adminEmail: string, adminPassword: string) {
  try {
    console.log('Connecting to PocketBase...');
    const pb = new PocketBaseLib(getPocketBaseUrl());

    // Login as admin
    console.log('Logging in as admin...');
    await pb.admins.authWithPassword(adminEmail, adminPassword);

    // Get posts collection
    console.log('Getting posts collection schema...');
    const postsCollection = await pb.collections.getOne('posts');
    
    console.log('\nPOSTS COLLECTION FIELDS:');
    for (const field of postsCollection.fields) {
      if (!field.system) { // Skip system fields like ID
        console.log(`- ${field.name} (${field.type}, required: ${field.required})`);
      }
    }
    
    // Get records
    console.log('\nFETCHING POSTS:');
    const records = await pb.collection('posts').getFullList();
    
    console.log(`Found ${records.length} posts:`);
    for (const record of records) {
      console.log(`\n[${record.id}] ${record.title}`);
      console.log(`Published: ${record.published}`);
      console.log(`Content: ${record.content.substring(0, 50)}${record.content.length > 50 ? '...' : ''}`);
      console.log(`Created: ${record.created}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Get credentials from command line arguments or config
const cliArgs = process.argv.slice(2);
const configCreds = getPocketBaseAdminCredentials();

// Use CLI args if provided, otherwise use config
const adminEmail = cliArgs[0] || configCreds.email;
const adminPassword = cliArgs[1] || configCreds.password;

if (!adminEmail || !adminPassword) {
  console.error('Error: Admin credentials not provided and not found in environment');
  console.error('Usage: npx ts-node migrations/check-posts.ts admin@example.com password');
  process.exit(1);
}

console.log(`Using admin email: ${adminEmail}`);

// Run check
checkPosts(adminEmail, adminPassword); 