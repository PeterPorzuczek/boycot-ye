import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get directory path in ES modules
const currentModulePath = fileURLToPath(import.meta.url);
const currentModuleDir = path.dirname(currentModulePath);

// Default values (can be overridden by command line arguments)
const pbUrl: string = process.argv[2] || '';
const pbAdminEmail: string = process.argv[3] || '';
const pbAdminPassword: string = process.argv[4] || '';

// Create .env content
const envContent: string = `POCKETBASE_URL=${pbUrl}
POCKETBASE_ADMIN_EMAIL=${pbAdminEmail}
POCKETBASE_ADMIN_PASSWORD=${pbAdminPassword}
`;

// Path to .env file (in project root)
// Assuming this script, after compilation, runs from a path like 'dist/migrations/scripts/'
// The project root is then three levels up from currentModuleDir.
const envPath: string = path.resolve(currentModuleDir, '..', '..', '.env');

// Write the file
fs.writeFileSync(envPath, envContent);

console.log(`✅ Created .env file at ${envPath}`);
console.log('The file contains the following PocketBase credentials:');
console.log(`- URL: ${pbUrl}`);
console.log(`- Admin Email: ${pbAdminEmail}`);
console.log(`- Admin Password: ${pbAdminPassword.replace(/./g, '*')}`);
console.log('\nYou can now run migrations with:');
console.log('npm run migrate');
