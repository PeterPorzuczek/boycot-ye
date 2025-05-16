/**
 * PocketBase Migration CLI Script
 * 
 * Improved version that:
 * 1. Uses environment variables from .env
 * 2. Correctly defines the schema
 * 3. Is more efficient
 */

// Load environment variables
require('dotenv').config();

// PocketBase connection configuration from environment variables
const PB_URL = process.env.PB_URL || 'http://localhost:8090';
const ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Error: Missing PocketBase credentials in .env file');
  console.error('Please create a .env file with PB_ADMIN_EMAIL and PB_ADMIN_PASSWORD');
  process.exit(1);
}

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
    
    // Delete existing signatures collection if it exists
    try {
      await pb.collections.delete('signatures');
      console.log('Deleted existing signatures collection');
    } catch (e) {
      // Collection doesn't exist or couldn't be deleted
      console.log('No existing signatures collection to delete or deletion failed');
    }
    
    // Create signatures collection with proper schema
    console.log('Creating signatures collection...');
    
    const signaturesCollection = {
      name: 'signatures',
      type: 'base',
      schema: [
        {
          name: 'user',
          type: 'relation',
          required: true,
          options: {
            collectionId: '_pb_users_auth_',
            cascadeDelete: false,
            maxSelect: 1
          }
        },
        {
          name: 'agree_checkbox',
          type: 'bool',
          required: true
        },
        {
          name: 'public_display',
          type: 'bool',
          required: true,
          default: false
        },
        {
          name: 'created_at',
          type: 'date',
          required: false,
          options: {
            autoCreate: true
          }
        }
      ],
      listRule: '',
      viewRule: '',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""'
    };
    
    try {
      const collection = await pb.collections.create(signaturesCollection);
      console.log(`✅ Signatures collection created successfully! (ID: ${collection.id})`);
      
      // Verify the schema is correct
      const createdCollection = await pb.collections.getOne(collection.id);
      console.log('Schema fields created:');
      if (createdCollection.schema && Array.isArray(createdCollection.schema)) {
        createdCollection.schema.forEach(field => {
          console.log(`- ${field.name} (${field.type})`);
        });
      } else {
        console.log('(Schema information not available in the API response)');
      }
    } catch (error) {
      console.error('Error creating collection:', error);
      if (error.response?.data) {
        console.error('Error details:', JSON.stringify(error.response.data, null, 2));
      }
      process.exit(1);
    }
    
    console.log('\n==== Migration completed successfully ====');
  } catch (error) {
    console.error('Migration script error:', error);
    process.exit(1);
  }
}

// Run the main function
main().catch(console.error); 