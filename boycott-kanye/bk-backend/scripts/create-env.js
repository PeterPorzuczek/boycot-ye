/**
 * Script to create a .env file with PocketBase credentials
 * Run this script with: node scripts/create-env.js
 */
const fs = require('fs');
const path = require('path');

// Default values (can be overridden by command line arguments)
const pbUrl = process.argv[2] || 'http://localhost:8090';
const pbAdminEmail = process.argv[3] || 'por314ug@gmail.com';
const pbAdminPassword = process.argv[4] || 'Qwerty1234!';

// Create .env content
const envContent = `PB_URL=${pbUrl}
PB_ADMIN_EMAIL=${pbAdminEmail}
PB_ADMIN_PASSWORD=${pbAdminPassword}
`;

// Path to .env file (in project root)
const envPath = path.join(__dirname, '..', '.env');

// Write the file
fs.writeFileSync(envPath, envContent);

console.log(`✅ Created .env file at ${envPath}`);
console.log('The file contains the following PocketBase credentials:');
console.log(`- URL: ${pbUrl}`);
console.log(`- Admin Email: ${pbAdminEmail}`);
console.log(`- Admin Password: ${pbAdminPassword.replace(/./g, '*')}`);
console.log('\nYou can now run migrations with:');
console.log('npm run migrate'); 