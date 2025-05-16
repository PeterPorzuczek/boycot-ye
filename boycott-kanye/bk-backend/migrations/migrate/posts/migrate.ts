import PocketBase from 'pocketbase';
import { postsCollectionDefinition } from '../../models/posts/schema.js';

interface PostsField {
  name: string;
  type: string;
  required: boolean;
  options?: Record<string, any>;
}

interface PostsCollectionDefinition {
  name: string;
  type: string;
  fields: PostsField[];
  listRule: string;
  viewRule: string;
  createRule: string;
  updateRule: string;
  deleteRule: string;
}

export { postsCollectionDefinition };

export async function migratePostsCollection(
  pb: PocketBase,
  collectionDefinition: PostsCollectionDefinition,
): Promise<boolean> {
  const collectionName = collectionDefinition.name;
  try {
    try {
      await pb.collections.delete(collectionName);
      console.log(`Deleted existing ${collectionName} collection.`);
    } catch (e) {
      console.log(
        `No existing ${collectionName} collection to delete, or deletion failed (this might be okay).`,
      );
    }

    console.log(
      `Attempting to create ${collectionName} collection with definition:`,
    );
    console.log(JSON.stringify(collectionDefinition, null, 2));

    const createdCollection = await pb.collections.create(collectionDefinition);
    console.log(
      `✅ ${collectionName} collection created/updated via SDK. Response ID: ${createdCollection.id}`,
    );

    console.log(
      `Fetching ${collectionName} (ID: ${createdCollection.id}) to verify schema...`,
    );
    const verifiedCollection = await pb.collections.getOne(
      createdCollection.id,
    );
    console.log(
      `Verified ${collectionName} collection details retrieved from server:`,
    );
    console.log(JSON.stringify(verifiedCollection, null, 2));

    const actualSchema =
      verifiedCollection.fields || verifiedCollection.schema || [];

    if (actualSchema.length > 1) {
      console.log(
        `✅ ${collectionName} schema appears to be created with ${actualSchema.length} fields:`,
      );
      actualSchema.forEach((f) =>
        console.log(`  - Field: ${f.name}, Type: ${f.type}`),
      );

      const definedFieldNames = collectionDefinition.fields.map((f) => f.name);
      const actualFieldNames = actualSchema.map((f) => f.name);
      const missingFields = definedFieldNames.filter(
        (df) => !actualFieldNames.includes(df),
      );
      if (missingFields.length > 0) {
        console.error(
          `❌ ERROR: Some defined fields are missing in the created schema: ${missingFields.join(', ')}`,
        );
        return false;
      }
      return true;
    } else {
      console.error(
        `❌ ${collectionName} schema NOT created as expected. Only ${actualSchema.length} field(s) found.`,
      );
      return false;
    }
  } catch (error: any) {
    console.error(`Error during ${collectionName} migration:`, error);
    if (error.response && error.response.data) {
      console.error(
        `Error details for ${collectionName} from server:`,
        JSON.stringify(error.response.data, null, 2),
      );
    }
    return false;
  }
}
