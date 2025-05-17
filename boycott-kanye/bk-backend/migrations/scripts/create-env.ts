import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get directory path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Default values (can be overridden by command line arguments)
const pbUrl: string = process.argv[2] || 'http://localhost:8090';
const pbAdminEmail: string = process.argv[3] || 'admin@example.com';
const pbAdminPassword: string = process.argv[4] || 'your_password_here';

// Create .env content
const envContent: string = `PB_URL=${pbUrl}
PB_ADMIN_EMAIL=${pbAdminEmail}
PB_ADMIN_PASSWORD=${pbAdminPassword}
`;

// Path to .env file (in project root)
const envPath: string = path.join(__dirname, '..', '..', '.env');

// Write the file
fs.writeFileSync(envPath, envContent);

console.log(`✅ Created .env file at ${envPath}`);
console.log('The file contains the following PocketBase credentials:');
console.log(`- URL: ${pbUrl}`);
console.log(`- Admin Email: ${pbAdminEmail}`);
console.log(`- Admin Password: ${pbAdminPassword.replace(/./g, '*')}`);
console.log('\nYou can now run migrations with:');
console.log('npm run migrate');
