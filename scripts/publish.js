#!/usr/bin/env node

import { execSync } from 'child_process';
import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PACKAGES = ['forms-engine', 'forms-editor', 'forms-renderer', 'all'];
const BUMP_TYPES = ['major', 'minor', 'patch'];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function exec(command, cwd = process.cwd()) {
  try {
    execSync(command, { cwd, stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`❌ Command failed: ${command}`);
    return false;
  }
}

function syncDeps(targetPackage, sourcePackage) {
  const sourcePackagePath = path.join(__dirname, '..', 'packages', sourcePackage, 'package.json');
  const sourcePackageJson = JSON.parse(fs.readFileSync(sourcePackagePath, 'utf8'));
  const sourceVersion = sourcePackageJson.version;
  
  const targetPackagePath = path.join(__dirname, '..', 'packages', targetPackage, 'package.json');
  const targetPackageJson = JSON.parse(fs.readFileSync(targetPackagePath, 'utf8'));
  
  const depKey = `@mieweb/${sourcePackage}`;
  
  if (targetPackageJson.dependencies && targetPackageJson.dependencies[depKey]) {
    targetPackageJson.dependencies[depKey] = `^${sourceVersion}`;
    fs.writeFileSync(targetPackagePath, JSON.stringify(targetPackageJson, null, targetPackage === 'forms-editor' ? '\t' : 2) + '\n');
    console.log(`✅ Synced ${targetPackage}: ${depKey} -> ^${sourceVersion}`);
  }
}

async function publishPackage(packageName, bumpType, shouldPublish) {
  console.log(`\n📦 Processing: ${packageName}`);
  console.log(`   Bump: ${bumpType}`);
  console.log(`   Publish: ${shouldPublish ? 'Yes' : 'No (dry-run)'}`);
  
  const packagePath = path.join(__dirname, '..', 'packages', packageName);
  
  // Build
  console.log(`\n🔨 Building ${packageName}...`);
  if (!exec(`npm run build --workspace=packages/${packageName}`)) {
    return false;
  }
  
  // Version bump
  console.log(`\n📌 Bumping version (${bumpType})...`);
  if (!exec(`npm version ${bumpType} --workspace=packages/${packageName}`)) {
    return false;
  }
  
  // Sync dependencies
  console.log(`\n🔗 Syncing dependencies...`);
  
  // If we're publishing forms-engine, update editor and renderer to use new engine version
  if (packageName === 'forms-engine') {
    syncDeps('forms-editor', 'forms-engine');
    syncDeps('forms-renderer', 'forms-engine');
  }
  // If we're publishing editor or renderer, sync them to latest engine
  else if (packageName === 'forms-editor') {
    syncDeps('forms-editor', 'forms-engine');
  }
  else if (packageName === 'forms-renderer') {
    syncDeps('forms-renderer', 'forms-engine');
  }
  
  // Publish
  if (shouldPublish) {
    console.log(`\n🚀 Publishing ${packageName}...`);
    if (!exec(`npm publish --workspace=packages/${packageName} --access public`)) {
      return false;
    }
    console.log(`✅ ${packageName} published successfully!`);
  } else {
    console.log(`\n✅ ${packageName} version bumped (not published)`);
  }
  
  return true;
}

function checkNpmAuth() {
  try {
    execSync('npm whoami', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  console.log('📦 Package Publisher\n');
  
  // Check npm authentication
  if (!checkNpmAuth()) {
    console.log('⚠️  You are not logged in to npm.\n');
    const loginAnswer = await question('Would you like to login now? (y/n): ');
    
    if (loginAnswer.toLowerCase() === 'y') {
      console.log('\n🔑 Please login to npm...\n');
      exec('npm login');
      
      if (!checkNpmAuth()) {
        console.error('\n❌ Login failed or cancelled');
        rl.close();
        process.exit(1);
      }
      console.log('\n✅ Successfully logged in!\n');
    } else {
      console.log('\n❌ Publishing requires npm login. Exiting.');
      rl.close();
      process.exit(1);
    }
  } else {
    try {
      const username = execSync('npm whoami', { encoding: 'utf8' }).trim();
      console.log(`✅ Logged in as: ${username}\n`);
    } catch (error) {
      // Silent fail, we already know they're authed
    }
  }
  
  // Select package
  console.log('Available packages:');
  PACKAGES.forEach((pkg, i) => console.log(`  ${i + 1}. ${pkg}`));
  
  let packageChoice = await question('\nSelect package (1-4): ');
  packageChoice = parseInt(packageChoice) - 1;
  
  if (packageChoice < 0 || packageChoice >= PACKAGES.length) {
    console.error('❌ Invalid package selection');
    rl.close();
    process.exit(1);
  }
  
  const selectedPackage = PACKAGES[packageChoice];
  
  // Select bump type
  console.log('\nVersion bump types:');
  BUMP_TYPES.forEach((type, i) => console.log(`  ${i + 1}. ${type} (${type === 'major' ? '1.0.0' : type === 'minor' ? '0.1.0' : '0.0.1'})`));
  
  let bumpChoice = await question('\nSelect bump type (1-3): ');
  bumpChoice = parseInt(bumpChoice) - 1;
  
  if (bumpChoice < 0 || bumpChoice >= BUMP_TYPES.length) {
    console.error('❌ Invalid bump type selection');
    rl.close();
    process.exit(1);
  }
  
  const bumpType = BUMP_TYPES[bumpChoice];
  
  // Publish or dry-run
  const publishAnswer = await question('\nPublish to npm? (y/n): ');
  const shouldPublish = publishAnswer.toLowerCase() === 'y';
  
  rl.close();
  
  // Process packages
  if (selectedPackage === 'all') {
    console.log('\n📦 Publishing all packages...\n');
    
    // Build all first
    console.log('🔨 Building all packages...');
    if (!exec('npm run build:packages')) {
      process.exit(1);
    }
    
    // Process in order: engine first, then editor and renderer
    for (const pkg of ['forms-engine', 'forms-editor', 'forms-renderer']) {
      if (!await publishPackage(pkg, bumpType, shouldPublish)) {
        console.error(`\n❌ Failed to process ${pkg}`);
        process.exit(1);
      }
    }
    
    console.log('\n✅ All packages processed successfully!');
  } else {
    await publishPackage(selectedPackage, bumpType, shouldPublish);
  }
}

main().catch(error => {
  console.error('❌ Error:', error);
  rl.close();
  process.exit(1);
});
