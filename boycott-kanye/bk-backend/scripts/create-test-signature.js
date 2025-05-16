/**
 * Script to create a test signature record in PocketBase
 */
require('dotenv').config();

async function createTestSignature() {
  try {
    // Dynamically import PocketBase
    const { default: PocketBase } = await import('pocketbase');
    
    // Get credentials from environment
    const pbUrl = process.env.PB_URL || 'http://localhost:8090';
    
    // Initialize PocketBase client
    const pb = new PocketBase(pbUrl);
    
    // First create or authenticate as a test user
    console.log('Setting up test user...');
    let testUser;
    
    try {
      // Try to authenticate with existing user
      await pb.collection('users').authWithPassword('test@example.com', 'password123');
      testUser = pb.authStore.model;
      console.log('✅ Authenticated as existing test user');
    } catch (error) {
      // If authentication fails, create a new user
      console.log('Creating new test user...');
      try {
        const userData = {
          email: 'test@example.com',
          password: 'password123',
          passwordConfirm: 'password123',
          name: 'Test User'
        };
        testUser = await pb.collection('users').create(userData);
        await pb.collection('users').authWithPassword('test@example.com', 'password123');
        console.log('✅ Created and authenticated as new test user');
      } catch (createError) {
        console.error('Failed to create test user:', createError.message);
        throw createError;
      }
    }
    
    console.log('Test user ID:', pb.authStore.model.id);
    
    // Create a signature record
    console.log('\nCreating test signature...');
    const signatureData = {
      user: pb.authStore.model.id,
      agree_checkbox: true,
      public_display: true
    };
    
    try {
      const signature = await pb.collection('signatures').create(signatureData);
      
      console.log('✅ Signature created successfully:');
      console.log(JSON.stringify(signature, null, 2));
      
      // List all signatures for this user
      console.log('\nTrying to list signatures for the user...');
      try {
        const signatures = await pb.collection('signatures').getList(1, 10, {
          filter: `user="${pb.authStore.model.id}"`
        });
        
        console.log(`Found ${signatures.totalItems} signatures:`);
        signatures.items.forEach((sig, index) => {
          console.log(`${index + 1}. Signature ID: ${sig.id}`);
          console.log(`   Agree: ${sig.agree_checkbox}`);
          console.log(`   Public: ${sig.public_display}`);
          console.log(`   Created: ${sig.created}`);
        });
      } catch (listError) {
        console.error('Error listing signatures:', listError);
        if (listError.response) {
          console.error('List error details:', JSON.stringify(listError.response.data, null, 2));
        }
      }
    } catch (createError) {
      console.error('Error creating signature:', createError.message);
      if (createError.response?.data) {
        console.error('Error details:', JSON.stringify(createError.response.data, null, 2));
      }
      process.exit(1);
    }
    
    console.log('\n✅ Test completed');
  } catch (error) {
    console.error('General error:', error.message);
    process.exit(1);
  }
}

// Run the function
createTestSignature().catch(console.error); 