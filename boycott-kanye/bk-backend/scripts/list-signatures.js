/**
 * Script to list all signatures in PocketBase
 */
require('dotenv').config();

async function listSignatures() {
  try {
    // Dynamically import PocketBase
    const { default: PocketBase } = await import('pocketbase');
    
    // Get credentials from environment
    const pbUrl = process.env.PB_URL || 'http://localhost:8090';
    const adminEmail = process.env.PB_ADMIN_EMAIL;
    const adminPassword = process.env.PB_ADMIN_PASSWORD;
    
    // Initialize PocketBase client
    const pb = new PocketBase(pbUrl);
    
    // Try to authenticate as admin if credentials are provided
    if (adminEmail && adminPassword) {
      try {
        console.log('Authenticating as admin...');
        await pb.admins.authWithPassword(adminEmail, adminPassword);
        console.log('✅ Admin authentication successful');
      } catch (authError) {
        console.warn('Admin authentication failed:', authError.message);
        console.log('Continuing as unauthenticated user...');
      }
    } else {
      console.log('No admin credentials found in .env. Continuing as unauthenticated user.');
    }
    
    console.log('Retrieving all signatures...');
    
    try {
      const signatures = await pb.collection('signatures').getList(1, 50, {
        sort: '-created'
      });
      
      console.log(`Found ${signatures.totalItems} signatures:`);
      
      if (signatures.items.length === 0) {
        console.log('No signatures found.');
      } else {
        signatures.items.forEach((sig, index) => {
          console.log(`\n${index + 1}. Signature ID: ${sig.id}`);
          Object.keys(sig).forEach(key => {
            if (!['id', 'collectionId', 'collectionName'].includes(key)) {
              console.log(`   ${key}: ${JSON.stringify(sig[key])}`);
            }
          });
        });
      }
    } catch (error) {
      console.error('Error listing signatures:', error.message);
      if (error.response?.data) {
        console.error('Error details:', JSON.stringify(error.response.data, null, 2));
      }
    }
    
    console.log('\n✅ Listing completed');
  } catch (error) {
    console.error('General error:', error.message);
    process.exit(1);
  }
}

// Run the function
listSignatures().catch(console.error); 