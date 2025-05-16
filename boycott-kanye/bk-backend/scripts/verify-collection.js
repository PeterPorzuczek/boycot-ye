/**
 * Script to verify the signatures collection exists in PocketBase
 */

async function verifyCollection() {
  try {
    // Dynamically import PocketBase
    const { default: PocketBase } = await import('pocketbase');
    
    // Initialize PocketBase client
    const pb = new PocketBase('http://localhost:8090');
    
    console.log('Authenticating with PocketBase...');
    await pb.admins.authWithPassword('por314ug@gmail.com', 'Qwerty1234!');
    console.log('✅ Authentication successful!');
    
    // List collections
    const collections = await pb.collections.getFullList();
    console.log('\nAvailable collections:');
    
    // Check if signatures collection exists
    let signaturesCollection = null;
    collections.forEach(collection => {
      console.log(`- ${collection.name} (ID: ${collection.id})`);
      if (collection.name === 'signatures') {
        signaturesCollection = collection;
      }
    });
    
    if (signaturesCollection) {
      console.log('\n✅ Signatures collection exists!');
      console.log('Signature Collection Details:');
      console.log('- ID:', signaturesCollection.id);
      console.log('- Name:', signaturesCollection.name);
      console.log('- Type:', signaturesCollection.type);
      
      // Print the schema if it exists
      if (signaturesCollection.schema) {
        console.log('- Schema fields:');
        signaturesCollection.schema.forEach(field => {
          console.log(`  - ${field.name} (${field.type})`);
        });
      } else {
        console.log('- Schema not available in the API response');
      }
      
      // Print the rules
      console.log('\nAPI Rules:');
      console.log('- List Rule:', signaturesCollection.listRule || '(empty)');
      console.log('- View Rule:', signaturesCollection.viewRule || '(empty)');
      console.log('- Create Rule:', signaturesCollection.createRule || '(empty)');
      console.log('- Update Rule:', signaturesCollection.updateRule || '(empty)');
      console.log('- Delete Rule:', signaturesCollection.deleteRule || '(empty)');
    } else {
      console.log('\n❌ Signatures collection does not exist!');
    }
  } catch (error) {
    console.error('Verification error:', error);
    if (error.response) {
      console.error('Error details:', error.response);
    }
    process.exit(1);
  }
}

// Run the verification
verifyCollection().catch(console.error); 