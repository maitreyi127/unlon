#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set production environment
process.env.NODE_ENV = 'production';

// Check if dist/index.js exists
const distIndexPath = path.join(__dirname, 'dist', 'index.js');
const distPublicPath = path.join(__dirname, 'dist', 'public');
const serverPublicPath = path.join(__dirname, 'server', 'public');

console.log('🚀 Starting production server...');

// Build if dist/index.js doesn't exist
if (!fs.existsSync(distIndexPath)) {
  console.log('📦 Build output not found, building application...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

// Create server/public directory link if it doesn't exist
if (!fs.existsSync(serverPublicPath)) {
  if (fs.existsSync(distPublicPath)) {
    try {
      // Try to copy the directory since symlinks aren't working
      execSync(`cp -r "${distPublicPath}" "${serverPublicPath}"`, { stdio: 'inherit' });
      console.log('📁 Created server/public directory');
    } catch (error) {
      console.error('⚠️  Warning: Could not create server/public directory:', error.message);
    }
  }
}

// Start the server
console.log('🌟 Starting server...');
try {
  import('./dist/index.js');
} catch (error) {
  console.error('❌ Failed to start server:', error.message);
  process.exit(1);
}