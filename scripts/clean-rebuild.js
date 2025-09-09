// Clean rebuild script for production environments
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('Cleaning Next.js cache...');

// Remove .next folder if it exists
const nextDir = path.join(__dirname, '..', '.next');
if (fs.existsSync(nextDir)) {
  try {
    fs.rmSync(nextDir, { recursive: true, force: true });
    console.log('✅ Removed .next folder');
  } catch (err) {
    console.error('Error removing .next folder:', err);
  }
}

// Run npm cache clean
console.log('Cleaning npm cache...');
exec('npm cache clean --force', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error cleaning npm cache: ${error}`);
    return;
  }
  console.log('✅ Cleaned npm cache');
  
  // Rebuild the project
  console.log('Rebuilding the project...');
  exec('npm run build', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error during build: ${error}`);
      console.log(stderr);
      process.exit(1);
    }
    
    console.log(stdout);
    console.log('✅ Build completed successfully!');
  });
});
