#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get command line arguments
const [, , targetPackage, sourcePackage] = process.argv;

if (!targetPackage || !sourcePackage) {
  console.error('Usage: node sync-deps.js <target-package> <source-package>');
  console.error('Example: node sync-deps.js forms-editor forms-engine');
  process.exit(1);
}

try {
  // Read source package version
  const sourcePackagePath = path.join(__dirname, '..', 'packages', sourcePackage, 'package.json');
  const sourcePackageJson = JSON.parse(fs.readFileSync(sourcePackagePath, 'utf8'));
  const sourceVersion = sourcePackageJson.version;
  
  // Update target package dependency
  const targetPackagePath = path.join(__dirname, '..', 'packages', targetPackage, 'package.json');
  const targetPackageJson = JSON.parse(fs.readFileSync(targetPackagePath, 'utf8'));
  
  const depKey = `@mieweb/${sourcePackage}`;
  
  if (targetPackageJson.dependencies && targetPackageJson.dependencies[depKey]) {
    targetPackageJson.dependencies[depKey] = `^${sourceVersion}`;
    
    fs.writeFileSync(targetPackagePath, JSON.stringify(targetPackageJson, null, targetPackage === 'forms-editor' ? '\t' : 2) + '\n');
    console.log(`✅ Updated ${targetPackage}: ${depKey} -> ^${sourceVersion}`);
  } else {
    console.log(`ℹ️  ${targetPackage} does not depend on ${depKey}`);
  }
  
} catch (error) {
  console.error('❌ Error syncing dependencies:', error.message);
  process.exit(1);
}