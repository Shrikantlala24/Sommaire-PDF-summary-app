// Enhanced deployment script for Render
const { execSync } = require('child_process');

try {
  console.log('Starting Render deployment build...');
  
  console.log('Installing dependencies with legacy peer deps...');
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
  
  console.log('Building Next.js application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
  console.log('The application is ready to be started with "npm start"');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  console.error('If you are seeing dependency conflicts, verify that dotenv is set to version 16.4.5 in package.json');
  process.exit(1);
}
