/**
 * Script to verify the signatures collection schema in PocketBase
 */
require('dotenv').config();

async function checkSignatures() {
  try {
    // Dynamically import PocketBase
    const { default: PocketBase } = await import('pocketbase');
    
    // Get credentials from environment
    const pbUrl = process.env.PB_URL || 'http://localhost:8090';
    const adminEmail = process.env.PB_ADMIN_EMAIL;
    const adminPassword = process.env.PB_ADMIN_PASSWORD;
    
    if (!adminEmail || !adminPassword) {
      console.error('Error: Missing environment variables. Run npm run setup:env first.');
      process.exit(1);
    }
    
    // Initialize PocketBase client
    const pb = new PocketBase(pbUrl);
    
    // Authenticate as admin
    console.log('Authenticating as admin...');
    await pb.admins.authWithPassword(adminEmail, adminPassword);
    console.log('✅ Authentication successful\n');
    
    // Get collections list
    const collections = await pb.collections.getFullList();
    const sigCollection = collections.find(c => c.name === 'signatures');
    
    if (!sigCollection) {
      console.log('❌ Signatures collection not found!');
      console.log('Run the migration first with: npm run migrate');
      process.exit(1);
    }
    
    console.log('✅ Signatures collection exists');
    console.log('Collection details:');
    console.log(`- ID: ${sigCollection.id}`);
    console.log(`- Name: ${sigCollection.name}`);
    console.log(`- Type: ${sigCollection.type}`);
    
    // Verify schema fields
    if (sigCollection.schema && sigCollection.schema.length > 0) {
      console.log('\nSchema fields:');
      sigCollection.schema.forEach(field => {
        console.log(`- ${field.name} (${field.type})`);
      });
    } else {
      console.log('\n❌ Schema fields not found or empty!');
    }
    
    // Verify rules
    console.log('\nAPI Rules:');
    console.log(`- List Rule: ${sigCollection.listRule || '(empty)'}`);
    console.log(`- View Rule: ${sigCollection.viewRule || '(empty)'}`);
    console.log(`- Create Rule: ${sigCollection.createRule || '(empty)'}`);
    console.log(`- Update Rule: ${sigCollection.updateRule || '(empty)'}`);
    console.log(`- Delete Rule: ${sigCollection.deleteRule || '(empty)'}`);
    
    // List records
    try {
      console.log('\nFetching records...');
      const records = await pb.collection('signatures').getList(1, 10);
      
      console.log(`Found ${records.totalItems} signature(s):`);
      records.items.forEach((record, i) => {
        console.log(`\n[${i+1}] ID: ${record.id}`);
        Object.keys(record).forEach(key => {
          if (key !== 'id' && key !== 'collectionId' && key !== 'collectionName') {
            console.log(`  ${key}: ${JSON.stringify(record[key])}`);
          }
        });
      });
    } catch (error) {
      console.error('Error fetching records:', error.message);
    }
    
    console.log('\nVerification completed');
  } catch (error) {
    console.error('Error during verification:', error.message);
    process.exit(1);
  }
}

// Run the function
checkSignatures().catch(console.error); 