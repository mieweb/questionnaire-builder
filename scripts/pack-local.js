#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outputDir = path.join(rootDir, 'local-packages');

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Clean old .tgz files
console.log('🧹 Cleaning old packages...');
const oldFiles = fs.readdirSync(outputDir).filter(f => f.endsWith('.tgz'));
oldFiles.forEach(f => fs.unlinkSync(path.join(outputDir, f)));

const packages = [
  'packages/forms-engine',
  'packages/forms-editor',
  'packages/forms-renderer'
];

console.log('📦 Packing packages...\n');

packages.forEach(pkgPath => {
  const fullPath = path.join(rootDir, pkgPath);
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(fullPath, 'package.json'), 'utf-8')
  );
  
  console.log(`Packing ${packageJson.name}@${packageJson.version}...`);
  
  // Run npm pack in the package directory
  execSync('npm pack', { cwd: fullPath, stdio: 'inherit' });
  
  // Move the .tgz file to output directory
  const tgzFiles = fs.readdirSync(fullPath).filter(f => f.endsWith('.tgz'));
  tgzFiles.forEach(tgzFile => {
    const srcPath = path.join(fullPath, tgzFile);
    const destPath = path.join(outputDir, tgzFile);
    fs.renameSync(srcPath, destPath);
    console.log(`✓ Moved to local-packages/${tgzFile}\n`);
  });
});

console.log('✨ All packages packed and ready!');
console.log(`📁 Location: ${outputDir}\n`);
console.log('To install in another project:');
console.log('  npm install /path/to/local-packages/mieweb-forms-engine-*.tgz');
console.log('  npm install /path/to/local-packages/mieweb-forms-editor-*.tgz');
console.log('  npm install /path/to/local-packages/mieweb-forms-renderer-*.tgz');
