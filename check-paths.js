const fs = require('fs');
const path = require('path');

// Check for important configuration files
const filesToCheck = [
  'tsconfig.json',
  'tsconfig.app.json',
  'tsconfig.node.json',
  'package.json'
];

console.log('Checking for required configuration files:');
filesToCheck.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${file}: ${exists ? 'Found' : 'MISSING'}`);
  
  if (exists) {
    // Check if file is valid JSON
    try {
      const content = fs.readFileSync(file, 'utf8');
      JSON.parse(content);
      console.log(`  - Valid JSON: Yes`);
    } catch (e) {
      console.log(`  - Valid JSON: No - ${e.message}`);
    }
  }
});
