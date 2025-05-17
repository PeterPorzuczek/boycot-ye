import dotenv from 'dotenv';
import PocketBase from './pocketbase-cjs';
import { runAllMigrations } from './index';

dotenv.config();

interface TestUserData {
  email: string;
  password: string;
  passwordConfirm: string;
  emailVisibility: boolean;
}

interface TestPostData {
  author_id: string;
  title: string;
  content: string;
  published: boolean;
}

interface TestSignatureData {
  author_id: string;
  agree_checkbox: boolean;
  public_display: boolean;
}

async function main() {
  try {
    const pb = new PocketBase(process.env.POCKETBASE_URL);
    console.log(
      `Attempting to connect to PocketBase at ${process.env.POCKETBASE_URL}`,
    );

    await pb.admins.authWithPassword(
      process.env.POCKETBASE_ADMIN_EMAIL || '',
      process.env.POCKETBASE_ADMIN_PASSWORD || '',
    );
    console.log('✅ Admin authentication successful!');

    const migrationResults = await runAllMigrations(pb);

    if (!migrationResults.posts && !migrationResults.signatures) {
      console.error('All migrations failed. Skipping test data creation.');
      process.exit(1);
    }

    console.log('\n==== Attempting Test Data Creation ====');
    let userId: string | null = null;
    try {
      console.log('Attempting to authenticate or create a test user...');
      pb.authStore.clear();
      try {
        const authData = await pb
          .collection('users')
          .authWithPassword('test@example.com', 'password123');
        userId = authData.record.id;
        console.log(`✅ Authenticated as existing test user (ID: ${userId})`);
      } catch (authError) {
        console.log(
          'Test user not found or auth failed, creating new test user...',
        );
        const userData: TestUserData = {
          email: 'test@example.com',
          password: 'password123',
          passwordConfirm: 'password123',
          emailVisibility: true,
        };
        const newUser = await pb.collection('users').create(userData);
        userId = newUser.id;
        console.log(`✅ Created new test user (ID: ${userId})`);
        await pb
          .collection('users')
          .authWithPassword('test@example.com', 'password123');
        console.log('✅ Authenticated as newly created test user.');
      }
    } catch (userError: any) {
      console.error('❌ Error during test user setup:', userError);
      if (userError.response && userError.response.data) {
        console.error(
          'User setup error details:',
          JSON.stringify(userError.response.data, null, 2),
        );
      }
      userId = null;
    }

    if (userId) {
      if (migrationResults.signatures) {
        try {
          console.log('\nAttempting to create a test signature record...');
          const testSignatureData: TestSignatureData = {
            author_id: userId,
            agree_checkbox: true,
            public_display: true,
          };
          const createdSignature = await pb
            .collection('signatures')
            .create(testSignatureData);
          console.log(
            `✅ Test signature record created successfully (ID: ${createdSignature.id})`,
          );

          const fetchedSignature = await pb
            .collection('signatures')
            .getOne(createdSignature.id);
          console.log(
            'Fetched signature record:',
            JSON.stringify(fetchedSignature, null, 2),
          );
        } catch (signatureError: any) {
          console.error(
            '❌ Error creating test signature record:',
            signatureError,
          );
          if (signatureError.response && signatureError.response.data) {
            console.error(
              'Signature creation error details:',
              JSON.stringify(signatureError.response.data, null, 2),
            );
          }
        }
      } else {
        console.log(
          'Skipping signature test data creation because signature migration failed.',
        );
      }

      if (migrationResults.posts) {
        try {
          console.log('\nAttempting to create test data for posts...');
          const testPostsData: TestPostData[] = [
            {
              author_id: userId,
              title: 'My First Test Post by Test User',
              content:
                'This is the content of the first test post, created by the test user.',
              published: true,
            },
            {
              author_id: userId,
              title: 'Another Awesome Post by Test User',
              content:
                'Content here, checking if migrations and user-specific test data work.',
              published: false,
            },
          ];

          for (const postData of testPostsData) {
            const createdPost = await pb.collection('posts').create(postData);
            console.log(
              `  ✅ Created test post "${postData.title}" with ID: ${createdPost.id} (Author: ${userId})`,
            );
          }
        } catch (postError: any) {
          console.error('❌ Error creating test post record:', postError);
          if (postError.response && postError.response.data) {
            console.error(
              'Post creation error details:',
              JSON.stringify(postError.response.data, null, 2),
            );
          }
        }
      } else {
        console.log(
          'Skipping posts test data creation because posts migration failed.',
        );
      }
    } else {
      console.log('Skipping test record creation due to user setup failure.');
    }

    console.log('\n==== CLI script finished ====');
  } catch (error: any) {
    console.error('❌ Unhandled error in main CLI function:', error);
    if (error.response && error.response.data) {
      console.error(
        'Error details:',
        JSON.stringify(error.response.data, null, 2),
      );
    }
    process.exit(1);
  }
}

main().catch(console.error);
