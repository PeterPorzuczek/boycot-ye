/**
 * Posts collection migration
 */
import { postsCollection } from './schema';
import { testPosts } from './data';

/**
 * Creates the posts collection in PocketBase with test data
 * 
 * @param pb PocketBase instance
 * @returns Boolean indicating success
 */
export async function migratePostsCollection(pb: any): Promise<boolean> {
  try {
    // First delete collection if exists
    try {
      await pb.collections.delete('posts');
      console.log('Deleted existing posts collection');
    } catch (e) {
      // Collection doesn't exist or couldn't be deleted
    }
    
    console.log('Creating posts collection...');
    
    // Create posts collection with fields
    await pb.collections.create(postsCollection);
    
    console.log('✅ Posts collection created successfully!');
    
    // Create test records
    console.log('Creating test post records...');
    
    for (const post of testPosts) {
      try {
        const record = await pb.collection('posts').create(post);
        console.log(`✅ Created post "${post.title}" with ID: ${record.id}`);
      } catch (error) {
        console.error(`Failed to create post "${post.title}":`, error);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Migration error:', error);
    return false;
  }
} 