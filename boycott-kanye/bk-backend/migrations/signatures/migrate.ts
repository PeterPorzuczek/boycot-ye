/**
 * Signatures collection migration
 */
import { signaturesCollection } from './schema';
import { testSignatures } from './data';

/**
 * Creates the signatures collection in PocketBase with test data
 *
 * @param pb PocketBase instance
 * @returns Boolean indicating success
 */
export async function migrateSignaturesCollection(pb: any): Promise<boolean> {
  try {
    // First delete collection if exists
    try {
      await pb.collections.delete('signatures');
      console.log('Deleted existing signatures collection');
    } catch (e) {
      // Collection doesn't exist or couldn't be deleted
      console.log(
        'No existing signatures collection to delete or deletion failed',
      );
    }

    console.log('Creating signatures collection...');

    // Create signatures collection with fields
    await pb.collections.create(signaturesCollection);

    console.log('✅ Signatures collection created successfully!');

    // Create test records if they exist
    if (testSignatures && testSignatures.length > 0) {
      console.log('Creating test signature records...');

      for (const signature of testSignatures) {
        try {
          const record = await pb.collection('signatures').create(signature);
          console.log(`✅ Created signature for user: ${signature.user}`);
        } catch (error) {
          console.error(`Failed to create signature:`, error);
        }
      }
    }

    return true;
  } catch (error) {
    console.error('Migration error:', error);
    return false;
  }
}
