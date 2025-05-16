/**
 * Posts collection migration
 */

const postsCollectionDefinition = {
  name: 'posts',
  type: 'base',
  fields: [
    {
      name: 'author_id',
      type: 'text',
      required: true
    },
    {
      name: 'title',
      type: 'text',
      required: true
    },
    {
      name: 'content',
      type: 'text', 
      required: false
    },
    {
      name: 'published',
      type: 'bool',
      required: false
    },
    {
      name: 'created',
      type: 'date',
      required: false
    }
  ],
  listRule: '@request.auth.id != ""',      
  viewRule: '@request.auth.id != ""',      
  createRule: '@request.auth.id != ""',    
  updateRule: '@request.auth.id != ""',    
  deleteRule: '@request.auth.id != ""'
};

// Test data for posts - REMOVED as it will be handled in cli.js
// const testPosts = [
//   {
//     author_id: "test_user_id_placeholder",
//     title: 'My First Test Post from Migration',
//     content: 'This is the content of the first test post.',
//     published: true,
//   },
//   {
//     author_id: "test_user_id_placeholder",
//     title: 'Another Awesome Post',
//     content: 'Content here, checking if migrations work.',
//     published: false,
//   },
// ];

/**
 * Creates or updates the posts collection in PocketBase.
 * @param {object} pb PocketBase instance
 * @param {object} collectionDefinition The definition of the collection to create
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
async function migratePostsCollection(pb, collectionDefinition) {
  const collectionName = collectionDefinition.name;
  try {
    try {
      await pb.collections.delete(collectionName);
      console.log(`Deleted existing ${collectionName} collection.`);
    } catch (e) {
      console.log(`No existing ${collectionName} collection to delete, or deletion failed (this might be okay).`);
    }
    
    console.log(`Attempting to create ${collectionName} collection with definition:`);
    console.log(JSON.stringify(collectionDefinition, null, 2));
    
    const createdCollection = await pb.collections.create(collectionDefinition);
    console.log(`✅ ${collectionName} collection created/updated via SDK. Response ID: ${createdCollection.id}`);
    
    console.log(`Fetching ${collectionName} (ID: ${createdCollection.id}) to verify schema...`);
    const verifiedCollection = await pb.collections.getOne(createdCollection.id);
    console.log(`Verified ${collectionName} collection details retrieved from server:`);
    console.log(JSON.stringify(verifiedCollection, null, 2));
    
    const actualSchema = verifiedCollection.fields || verifiedCollection.schema || [];
    
    if (actualSchema.length > 1) { // Check if schema has more than just system fields
      console.log(`✅ ${collectionName} schema appears to be created with ${actualSchema.length} fields:`);
      actualSchema.forEach(f => console.log(`  - Field: ${f.name}, Type: ${f.type}`));

      // Check if all defined fields are present
      const definedFieldNames = collectionDefinition.fields.map(f => f.name);
      const actualFieldNames = actualSchema.map(f => f.name);
      const missingFields = definedFieldNames.filter(df => !actualFieldNames.includes(df));
      if (missingFields.length > 0) {
        console.error(`❌ ERROR: Some defined fields are missing in the created schema: ${missingFields.join(', ')}`);
        return false; // Schema creation failed if fields are missing
      }

      // Add test data - REMOVED
      // console.log(`Attempting to create test data for ${collectionName}...`);
      // for (const post of testPosts) {
      //   try {
      //     const record = await pb.collection(collectionName).create(post);
      //     console.log(`  ✅ Created test post "${post.title}" with ID: ${record.id}`);
      //   } catch (error) {
      //     console.error(`  ❌ Failed to create test post "${post.title}":`, error.message);
      //     if (error.response && error.response.data) {
      //       console.error(`     Error details:`, JSON.stringify(error.response.data, null, 2));
      //     }
      //   }
      // }
      return true; // Overall success if schema is correct
    } else {
      console.error(`❌ ${collectionName} schema NOT created as expected. Only ${actualSchema.length} field(s) found.`);
      return false;
    }
  } catch (error) {
    console.error(`Error during ${collectionName} migration:`, error);
    if (error.response && error.response.data) {
      console.error(`Error details for ${collectionName} from server:`, JSON.stringify(error.response.data, null, 2));
    }
    return false;
  }
}

module.exports = { migratePostsCollection, postsCollectionDefinition }; 