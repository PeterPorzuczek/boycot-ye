/**
 * Script to check posts collection API rules
 * 
 * Run with: npx ts-node migrations/check-rules.ts
 * Or with custom credentials: npx ts-node migrations/check-rules.ts admin@example.com password
 */

// Import dotenv for environment variables
import * as dotenv from 'dotenv';
// Load .env file if it exists
dotenv.config();

// Use a different name to avoid redeclaration
const PocketBaseLib = require('pocketbase/cjs');
import { getPocketBaseUrl, getPocketBaseAdminCredentials } from '../src/config/pocketbase.config';

// Define a type for collection field
interface CollectionField {
  name: string;
  system: boolean;
  // Add other field properties as needed
}

async function checkRules(adminEmail: string, adminPassword: string) {
  try {
    console.log('Connecting to PocketBase...');
    const pb = new PocketBaseLib(getPocketBaseUrl());

    // Login as admin
    console.log('Logging in as admin...');
    await pb.admins.authWithPassword(adminEmail, adminPassword);

    // Get posts collection
    console.log('Getting posts collection...');
    const postsCollection = await pb.collections.getOne('posts');
    
    console.log('\nPOSTS COLLECTION API RULES:');
    console.log(`List Rule:   "${postsCollection.listRule || '(empty = allow all)'}"`);
    console.log(`View Rule:   "${postsCollection.viewRule || '(empty = allow all)'}"`);
    console.log(`Create Rule: "${postsCollection.createRule || '(empty = allow all)'}"`);
    console.log(`Update Rule: "${postsCollection.updateRule || '(empty = allow all)'}"`);
    console.log(`Delete Rule: "${postsCollection.deleteRule || '(empty = allow all)'}"`);
    
    // Print fields summary
    console.log('\nFIELDS SUMMARY:');
    const fieldNames = postsCollection.fields
      .filter((f: CollectionField) => !f.system)
      .map((f: CollectionField) => f.name)
      .join(', ');
    console.log(`Fields: ${fieldNames}`);
    
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
  console.error('Usage: npx ts-node migrations/check-rules.ts admin@example.com password');
  process.exit(1);
}

console.log(`Using admin email: ${adminEmail}`);

// Run check
checkRules(adminEmail, adminPassword); 