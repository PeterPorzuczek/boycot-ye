/**
 * PocketBase Migration CLI Script
 */

// Load environment variables
require('dotenv').config();

async function main() {
  try {
    // Import dependencies
    const { default: PocketBase } = await import('pocketbase');
    const { runAllMigrations } = await import('./index.js');
    
    // Connect to PocketBase
    const pb = new PocketBase(process.env.PB_URL);
    console.log(`Attempting to connect to PocketBase at ${process.env.PB_URL}`);
    
    // Authenticate as admin
    await pb.admins.authWithPassword(
      process.env.PB_ADMIN_EMAIL,
      process.env.PB_ADMIN_PASSWORD
    );
    console.log('✅ Admin authentication successful!');
    
    // Run migrations
    const migrationResults = await runAllMigrations(pb);
    
    if (!migrationResults.posts && !migrationResults.signatures) {
        console.error('All migrations failed. Skipping test data creation.');
        process.exit(1);
    }

    // Test data creation only if migrations were somewhat successful
    console.log('\n==== Attempting Test Data Creation ====');
    let userId = null;
    try {
      console.log('Attempting to authenticate or create a test user...');
      pb.authStore.clear(); // Clear admin auth before authenticating as user
      try {
        const authData = await pb.collection('users').authWithPassword('test@example.com', 'password123');
        userId = authData.record.id;
        console.log(`✅ Authenticated as existing test user (ID: ${userId})`);
      } catch (authError) {
        console.log('Test user not found or auth failed, creating new test user...');
        const userData = {
          email: 'test@example.com',
          password: 'password123',
          passwordConfirm: 'password123',
          emailVisibility: true, // Required by default PocketBase user settings
        };
        const newUser = await pb.collection('users').create(userData);
        userId = newUser.id;
        console.log(`✅ Created new test user (ID: ${userId})`);
        // Re-authenticate as the new user to ensure authStore is populated for record creation
        await pb.collection('users').authWithPassword('test@example.com', 'password123');
        console.log('✅ Authenticated as newly created test user.');
      }
    } catch (userError) {
      console.error('❌ Error during test user setup:', userError);
      if (userError.response && userError.response.data) {
        console.error('User setup error details:', JSON.stringify(userError.response.data, null, 2));
      }
      userId = null; // Ensure userId is null if setup failed
    }

    if (userId) {
      if (migrationResults.signatures) {
        try {
          console.log('\nAttempting to create a test signature record...');
          const testSignatureData = {
            author_id: userId,
            agree_checkbox: true,
            public_display: true,
          };
          const createdSignature = await pb.collection('signatures').create(testSignatureData);
          console.log(`✅ Test signature record created successfully (ID: ${createdSignature.id})`);
          
          const fetchedSignature = await pb.collection('signatures').getOne(createdSignature.id);
          console.log('Fetched signature record:', JSON.stringify(fetchedSignature, null, 2));

        } catch (signatureError) {
          console.error('❌ Error creating test signature record:', signatureError);
          if (signatureError.response && signatureError.response.data) {
            console.error('Signature creation error details:', JSON.stringify(signatureError.response.data, null, 2));
          }
        }
      } else {
        console.log('Skipping signature test data creation because signature migration failed.');
      }

      // Create test data for posts collection if its migration was successful
      if (migrationResults.posts) {
        try {
          console.log('\nAttempting to create test data for posts...');
          const testPostsData = [
            {
              author_id: userId,
              title: 'My First Test Post by Test User',
              content: 'This is the content of the first test post, created by the test user.',
              published: true,
              // 'created' field will be handled by PocketBase system field
            },
            {
              author_id: userId,
              title: 'Another Awesome Post by Test User',
              content: 'Content here, checking if migrations and user-specific test data work.',
              published: false,
            },
          ];

          for (const postData of testPostsData) {
            const createdPost = await pb.collection('posts').create(postData);
            console.log(`  ✅ Created test post "${postData.title}" with ID: ${createdPost.id} (Author: ${userId})`);
          }
        } catch (postError) {
          console.error('❌ Error creating test post record:', postError);
          if (postError.response && postError.response.data) {
            console.error('Post creation error details:', JSON.stringify(postError.response.data, null, 2));
          }
        }
      } else {
        console.log('Skipping posts test data creation because posts migration failed.');
      }

      // Note: Test data for posts is created within its own migration file (migratePostsCollection) - COMMENTED OUT, MOVED HERE
      // if(migrationResults.posts){
      //     console.log('\nChecking for test posts (created during posts migration)...');
      //     const posts = await pb.collection('posts').getList(1, 5);
      //     if(posts.items.length > 0){
      //         console.log(`Found ${posts.items.length} post(s). First one:`, JSON.stringify(posts.items[0], null, 2));
      //     } else {
      //         console.log('No test posts found from migration script.');
      //     }
      // }

    } else {
      console.log('Skipping test record creation due to user setup failure.');
    }
    
    console.log('\n==== CLI script finished ====');
  } catch (error) {
    console.error('❌ Unhandled error in main CLI function:', error);
    if (error.response && error.response.data) {
        console.error('Error details:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

main().catch(console.error); 