/**
 * Sample posts data for migration
 */

export const testPosts = [
  {
    title: 'Welcome to the Blog',
    content: 'This is the first post created by the migration script.',
    published: true,
    created: new Date().toISOString(),
  },
  {
    title: 'How to Use PocketBase with NestJS',
    content:
      'PocketBase is a great backend solution that works well with NestJS.',
    published: false,
    created: new Date().toISOString(),
  },
];
