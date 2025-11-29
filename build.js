const fs = require('fs');
const path = require('path');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Files to copy
const filesToCopy = ['index.html', 'style.css', 'game.js', 'README.md'];

// Copy each file to dist directory
let hasErrors = false;
filesToCopy.forEach(file => {
  const srcPath = path.join(__dirname, file);
  const destPath = path.join(distDir, file);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✓ Copied ${file} to dist/`);
  } else {
    console.error(`✗ Error: ${file} not found`);
    hasErrors = true;
  }
});

if (hasErrors) {
  console.error('\n❌ Build failed: Required files are missing');
  process.exit(1);
}

console.log('\n✅ Build completed successfully!');
console.log(`📦 Output directory: ${distDir}`);
