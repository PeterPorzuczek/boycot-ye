const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Function to process a TypeScript file and remove .js extensions from imports
function processFile(filePath) {
  console.log(`Processing ${filePath}...`);
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Regular expression to match import statements with .js extensions
    const importRegex = /from\s+['"](.+?)\.js['"]/g;
    const updatedContent = content.replace(importRegex, (match, importPath) => {
      return `from '${importPath}'`;
    });
    
    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`  Updated imports in ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`  Error processing ${filePath}:`, error);
    return false;
  }
}

// Find all TypeScript files
console.log('Finding TypeScript files...');
const files = glob.sync('**/*.ts', {
  ignore: ['node_modules/**', 'dist/**'],
  cwd: __dirname
});

console.log(`Found ${files.length} TypeScript files.`);

// Process all files
let updatedCount = 0;
for (const file of files) {
  const filePath = path.join(__dirname, file);
  const updated = processFile(filePath);
  if (updated) {
    updatedCount++;
  }
}

console.log(`Done! Updated imports in ${updatedCount} files.`); 