// This is a diagnostic script to find all tsconfig files
const fs = require('fs');
const path = require('path');

function findTsConfigFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && file !== 'node_modules') {
      findTsConfigFiles(filePath, fileList);
    } else if (file.startsWith('tsconfig') && file.endsWith('.json')) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

const tsConfigFiles = findTsConfigFiles('.');
console.log('Found the following tsconfig files:');
tsConfigFiles.forEach(file => console.log(` - ${file}`));

// Read and display the content of each file
tsConfigFiles.forEach(file => {
  console.log(`\nContent of ${file}:`);
  const content = fs.readFileSync(file, 'utf8');
  console.log(content);
});

// Check for specific project references
const mainTsConfig = fs.readFileSync('tsconfig.json', 'utf8');
console.log('\nMain tsconfig.json references:');
const config = JSON.parse(mainTsConfig);
console.log(config.references);

// Check if referenced files exist
if (config.references) {
  config.references.forEach(ref => {
    const refPath = ref.path;
    console.log(`Checking if ${refPath} exists: ${fs.existsSync(refPath)}`);
  });
}
