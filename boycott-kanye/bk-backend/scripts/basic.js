/**
 * Basic collection creation test
 */
require('dotenv').config();

async function createCollection() {
  try {
    const { default: PocketBase } = await import('pocketbase');
    
    // Connect as admin
    const pb = new PocketBase(process.env.PB_URL || 'http://localhost:8090');
    await pb.admins.authWithPassword(
      process.env.PB_ADMIN_EMAIL || 'por314ug@gmail.com', 
      process.env.PB_ADMIN_PASSWORD || 'Qwerty1234!'
    );
    console.log('Connected to PocketBase');
    
    // Delete existing collections for a clean start
    try {
      await pb.collections.delete('test_collection');
      console.log('Deleted old test collection');
    } catch (e) {
      console.log('No existing test collection found');
    }
    
    // Create simple collection
    try {
      const collectionData = {
        name: 'test_collection',
        type: 'base',
        fields: [
          {
            name: 'title',
            type: 'text',
            required: true
          }
        ],
        listRule: '',
        viewRule: '',
        createRule: '',
        updateRule: '',
        deleteRule: ''
      };
      
      console.log('Creating collection with data:');
      console.log(JSON.stringify(collectionData, null, 2));
      
      const result = await pb.collections.create(collectionData);
      console.log('Collection created successfully!');
      console.log('Collection ID:', result.id);
    } catch (err) {
      console.error('Error creating collection:');
      console.error(err);
      
      if (err.response && err.response.data) {
        console.error('Error response data:');
        console.error(JSON.stringify(err.response.data, null, 2));
      }
    }
  } catch (e) {
    console.error('Script error:', e);
  }
}

createCollection(); 