const fs = require('fs');
const path = require('path');

// Check font directories
const fontDirectories = [
  './public/fonts',
  './src/assets/fonts'
];

console.log('Font File Check');
console.log('==============');

fontDirectories.forEach(dir => {
  console.log(`\nChecking directory: ${dir}`);
  
  if (!fs.existsSync(dir)) {
    console.log(`  Directory does not exist. Creating it...`);
    try {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`  Directory created successfully.`);
    } catch (err) {
      console.error(`  Error creating directory: ${err.message}`);
    }
    return;
  }
  
  try {
    const files = fs.readdirSync(dir);
    if (files.length === 0) {
      console.log(`  Directory is empty.`);
    } else {
      console.log(`  Found ${files.length} files:`);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        console.log(`    - ${file} (${Math.round(stats.size / 1024)}KB)`);
      });
    }
  } catch (err) {
    console.error(`  Error reading directory: ${err.message}`);
  }
});

console.log('\nFont folders need to contain JetBrainsMono-Regular.ttf and other font variants.');
console.log('Copy your font files to one of these directories.');
