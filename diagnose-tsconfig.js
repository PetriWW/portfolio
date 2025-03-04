const fs = require('fs');
const path = require('path');

/**
 * Reads and validates TypeScript configuration files
 */
function diagnoseTsConfig() {
  console.log('TypeScript Configuration Diagnosis');
  console.log('=================================\n');
  
  // Read main tsconfig.json
  try {
    const mainConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
    console.log('Main tsconfig.json:');
    console.log('- Has references:', Boolean(mainConfig.references));
    
    if (mainConfig.references && mainConfig.references.length) {
      console.log('- References:');
      mainConfig.references.forEach((ref, index) => {
        console.log(`  ${index + 1}. ${ref.path}`);
        
        // Check if referenced file exists
        const refPath = path.join(__dirname, ref.path);
        const refExists = fs.existsSync(refPath);
        console.log(`     - File exists: ${refExists}`);
        
        if (refExists) {
          try {
            const refConfig = JSON.parse(fs.readFileSync(refPath, 'utf8'));
            console.log(`     - Has composite: ${Boolean(refConfig.compilerOptions?.composite)}`);
            console.log(`     - noEmit: ${refConfig.compilerOptions?.noEmit}`);
            console.log(`     - Output dir: ${refConfig.compilerOptions?.outDir || 'Not specified'}`);
          } catch (e) {
            console.log(`     - ERROR: Could not parse ${ref.path} - ${e.message}`);
          }
        }
      });
    }
    
    // Check for base compiler options that might conflict
    console.log('\nMain compiler options:');
    if (mainConfig.compilerOptions) {
      console.log(`- noEmit: ${mainConfig.compilerOptions.noEmit}`);
      console.log(`- composite: ${mainConfig.compilerOptions.composite}`);
      console.log(`- outDir: ${mainConfig.compilerOptions.outDir || 'Not specified'}`);
    } else {
      console.log('- No compiler options in main tsconfig.json');
    }
    
  } catch (e) {
    console.log(`ERROR reading tsconfig.json: ${e.message}`);
  }
  
  console.log('\nTS Version Info:');
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    console.log(`- TypeScript version: ${packageJson.devDependencies?.typescript || 'Not found'}`);
    console.log(`- Vue TypeScript tools: ${packageJson.devDependencies?.['vue-tsc'] || 'Not found'}`);
  } catch (e) {
    console.log(`ERROR reading package.json: ${e.message}`);
  }
}

diagnoseTsConfig();

// Run the diagnosis
console.log('\nRun this script with: node diagnose-tsconfig.js');
