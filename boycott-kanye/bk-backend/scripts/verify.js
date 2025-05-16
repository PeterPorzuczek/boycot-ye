/**
 * Simple script to verify collections
 */
require('dotenv').config();

async function verify() {
  try {
    // Import PocketBase
    const { default: PocketBase } = await import('pocketbase');
    
    // Connect
    const pb = new PocketBase(process.env.PB_URL);
    console.log(`Connecting to ${process.env.PB_URL}...`);
    await pb.admins.authWithPassword(process.env.PB_ADMIN_EMAIL, process.env.PB_ADMIN_PASSWORD);
    console.log('Connected to PocketBase\n');
    
    // Get all collections
    const collections = await pb.collections.getFullList();
    console.log('Collections:');
    collections.forEach(col => {
      console.log(`- ${col.name}`);
    });
    
    // Get signatures collection
    console.log('\nSignatures collection schema:');
    try {
      const signatures = await pb.collections.getOne('signatures');
      console.log(`ID: ${signatures.id}`);
      console.log(`Name: ${signatures.name}`);
      console.log(`Fields: ${signatures.schema ? 'Yes' : 'No'}`);
      
      if (signatures.schema) {
        console.log('Schema:');
        signatures.schema.forEach(field => {
          console.log(`- ${field.name} (${field.type})`);
        });
      } else if (signatures.fields) {
        console.log('Fields:');
        signatures.fields.forEach(field => {
          console.log(`- ${field.name} (${field.type})`);
        });
      } else {
        console.log('No schema or fields found in collection');
        console.log('Available properties:', Object.keys(signatures).join(', '));
      }
    } catch (e) {
      console.error('Error getting signatures collection:', e.message);
    }
    
    // Get all signature records
    console.log('\nSignatures records:');
    try {
      const records = await pb.collection('signatures').getFullList();
      console.log(`Found ${records.length} records`);
      
      if (records.length > 0) {
        console.log('First record:', JSON.stringify(records[0], null, 2));
        console.log('Fields available:', Object.keys(records[0]).join(', '));
      }
    } catch (e) {
      console.error('Error getting records:', e.message);
    }
    
    // Get user
    try {
      const users = await pb.collection('users').getFullList();
      console.log(`\nFound ${users.length} users`);
      
      // Create signature record
      if (users.length > 0) {
        const userId = users[0].id;
        console.log(`Using user ID: ${userId}`);
        
        const data = {
          user: userId,
          agree_checkbox: true,
          public_display: true
        };
        
        console.log('Creating record with data:', JSON.stringify(data));
        const newRecord = await pb.collection('signatures').create(data);
        console.log(`\nCreated test record: ${newRecord.id}`);
        
        // Verify if data was saved correctly
        const record = await pb.collection('signatures').getOne(newRecord.id);
        console.log('Record:', JSON.stringify(record, null, 2));
      }
    } catch (e) {
      console.error('Error with users/records:', e.message);
      if (e.response?.data) {
        console.error('Response data:', e.response.data);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

verify(); 