import PocketBase from './pocketbase-cjs';
import {
  migratePostsCollection,
  postsCollectionDefinition,
} from './migrate/posts/migrate';
import {
  migrateSignaturesCollection,
  signaturesCollectionDefinition,
} from './migrate/signatures/migrate';

interface MigrationResults {
  posts: boolean;
  signatures: boolean;
}

export async function runAllMigrations(
  pb: PocketBase,
): Promise<MigrationResults> {
  console.log('Starting all migrations...');
  const results: MigrationResults = {
    posts: false,
    signatures: false,
  };

  try {
    console.log('\nMigrating posts collection...');
    results.posts = await migratePostsCollection(pb, postsCollectionDefinition);
  } catch (e) {
    console.error('Error encountered directly in posts migration process:', e);
    results.posts = false;
  }

  try {
    console.log('\nMigrating signatures collection...');
    results.signatures = await migrateSignaturesCollection(
      pb,
      signaturesCollectionDefinition,
    );
  } catch (e) {
    console.error(
      'Error encountered directly in signatures migration process:',
      e,
    );
    results.signatures = false;
  }

  console.log('\n==== Migration Execution Summary ====');
  console.log(
    `Posts Collection Migration: ${results.posts ? '✅ Success' : '❌ Failed'}`,
  );
  console.log(
    `Signatures Collection Migration: ${results.signatures ? '✅ Success' : '❌ Failed'}`,
  );

  if (!results.posts || !results.signatures) {
    console.error(
      'One or more migrations failed. Please check the logs above.',
    );
  }

  console.log('All migrations process completed.');
  return results;
}
