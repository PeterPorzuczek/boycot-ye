/**
 * Posts collection schema definition
 */

export const postsCollection = {
  name: 'posts',
  type: 'base',
  fields: [
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
  // API access rules
  listRule: '@request.auth.id != ""',      
  viewRule: '@request.auth.id != ""',      
  createRule: '@request.auth.id != ""',    
  updateRule: '@request.auth.id != ""',    
  deleteRule: '@request.auth.id != ""'     
  
  /* Alternatively, you can use more restrictive rules:
  
  listRule: 'published = true || @request.auth.id != ""',  // Published posts visible to all, unpublished only to auth users
  viewRule: 'published = true || @request.auth.id != ""',  // Same as list
  createRule: '@request.auth.id != ""',  // Only authenticated users
  updateRule: '@request.auth.id != ""',  // Only authenticated users
  deleteRule: '@request.auth.id != ""'   // Only authenticated users
  
  */
}; 