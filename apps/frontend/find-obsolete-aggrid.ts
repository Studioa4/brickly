const fs = require('fs');
const path = require('path');

const TARGET_DIR = path.resolve(__dirname, 'src');

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      if (
        content.includes('ModuleRegistry') ||
        content.includes('ClientSideRowModelModule') ||
        content.includes('@ag-grid-community/core') ||
        content.includes('@ag-grid-community/client-side-row-model')
      ) {
        console.log('⚠️  Found obsolete AG Grid import in:', fullPath);
      }
    }
  }
}

console.log('🔍 Scanning for obsolete AG Grid modules...');
scanDir(TARGET_DIR);
console.log('✅ Scan complete.');