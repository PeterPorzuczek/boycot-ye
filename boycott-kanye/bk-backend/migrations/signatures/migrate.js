/**
 * Signatures collection migration
 */

const signaturesCollectionDefinition = {
  name: 'signatures',
  type: 'base',
  fields: [
    {
      name: 'author_id',
      type: 'text',
      required: true,
      options: {}
    },
    {
      name: 'agree_checkbox',
      type: 'bool',
      required: true,
      options: {}
    },
    {
      name: 'public_display',
      type: 'bool',
      required: true,
      options: {}
    }
    // {
    //   name: 'user',
    //   type: 'relation',
    //   required: true,
    //   options: {
    //     collectionId: '_pb_users_auth_',
    //     cascadeDelete: true,
    //     minSelect: null,
    //     maxSelect: 1,
    //     displayFields: null
    //   }
    // }
  ],
  // API access rules
  listRule: '',                                 // Available publicly for everyone
  viewRule: '',                                 // Available publicly for everyone
  createRule: '@request.auth.id != ""',         // Only logged in users can create
  updateRule: '@request.auth.id != ""',         // Only logged in users can update
  deleteRule: '@request.auth.id != ""'          // Only logged in users can delete
};

// Empty test data array
const testSignatures = [];

/**
 * Creates or updates the signatures collection in PocketBase. This uses a one-step approach.
 * @param {object} pb PocketBase instance
 * @param {object} collectionDefinition The definition of the collection to create
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
async function migrateSignaturesCollection(pb, collectionDefinition) {
  const collectionName = collectionDefinition.name;
  try {
    // Delete existing collection if any to ensure a clean state
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
    
    const actualSchema = verifiedCollection.fields || verifiedCollection.schema || []; // Prefer fields
    
    // We expect at least id + defined fields
    const expectedMinFields = collectionDefinition.fields.length;
    if (actualSchema.filter(f => !f.system).length >= expectedMinFields) {
      console.log(`✅ ${collectionName} schema appears to be created with ${actualSchema.length} total fields (${actualSchema.filter(f => !f.system).length} custom):`);
      actualSchema.forEach(f => console.log(`  - Field: ${f.name}, Type: ${f.type}, System: ${f.system || false}`));
      const definedFieldNames = collectionDefinition.fields.map(f => f.name);
      const actualFieldNames = actualSchema.map(f => f.name);
      const missingFields = definedFieldNames.filter(df => !actualFieldNames.includes(df));
      if (missingFields.length > 0) {
        console.error(`❌ ERROR: Some defined fields are missing in the created schema: ${missingFields.join(', ')}`);
        return false;
      }
      return true;
    } else {
      console.error(`❌ ${collectionName} schema NOT created as expected. Expected ${expectedMinFields} custom fields, found ${actualSchema.filter(f => !f.system).length}. Total fields on server: ${actualSchema.length}`);
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

module.exports = { migrateSignaturesCollection, signaturesCollectionDefinition }; 