/**
 * PocketBase migrations main module
 */
import { migratePostsCollection } from './posts/migrate';
import { migrateSignaturesCollection } from './signatures/migrate';

/**
 * Central function to run all available migrations
 *
 * @param pb PocketBase instance
 * @returns A record of migration results
 */
export async function runAllMigrations(
  pb: any,
): Promise<Record<string, boolean>> {
  const results: Record<string, boolean> = {};

  console.log('==== Starting PocketBase migrations ====');

  // Run posts collection migration
  console.log('\n> Migrating posts collection...');
  results.posts = await migratePostsCollection(pb);

  // Run signatures collection migration
  console.log('\n> Migrating signatures collection...');
  results.signatures = await migrateSignaturesCollection(pb);

  // Add more migrations here as needed:
  // results.users = await migrateUsersCollection(pb);
  // results.comments = await migrateCommentsCollection(pb);

  console.log('\n==== Migration Summary ====');
  for (const [name, success] of Object.entries(results)) {
    console.log(`${name}: ${success ? '✅ Success' : '❌ Failed'}`);
  }

  return results;
}
