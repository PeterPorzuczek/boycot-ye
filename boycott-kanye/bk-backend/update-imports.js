// CommonJS składnia
const { replaceInFile } = require('replace-in-file');
const glob = require('glob');

// Znajdź wszystkie pliki TypeScript w src
const files = glob.sync('src/**/*.ts');

// Aktualizuj importy w znalezionych plikach
const options = {
  files,
  // Regex pattern znajduje importy z lokalnymi modułami (bez ./node_modules)
  // i dodaje rozszerzenie .js
  from: /from ['"](\.\/|\.\.\/|\/(?!node_modules))([^'"\n;]+)['"]/g,
  to: (match) => {
    // Jeśli import już ma rozszerzenie .js, nie dodawaj go ponownie
    if (match.endsWith('.js\'') || match.endsWith('.js"')) {
      return match;
    }
    // Dodaj rozszerzenie .js do importu
    return match.replace(/(['"])$/, '.js$1');
  },
  countMatches: true,
};

try {
  const results = replaceInFile.sync(options);
  console.log('Zaktualizowane pliki:');
  
  let totalReplacements = 0;
  
  results.forEach(result => {
    if (result.hasChanged) {
      totalReplacements += result.numReplacements;
      console.log(`${result.file}: ${result.numReplacements} zmian`);
    }
  });
  
  console.log(`\nZakończono z ${totalReplacements} zmianami w importach`);
} catch (error) {
  console.error('Błąd podczas aktualizacji importów:', error);
} 