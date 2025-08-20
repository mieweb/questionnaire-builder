#!/usr/bin/env node

/**
 * Simple Screenshot Generator for Questionnaire Builder
 * 
 * This script takes basic screenshots of the questionnaire builder
 * interface for documentation purposes. It focuses on capturing
 * the current state without complex interactions.
 */

import puppeteer from 'puppeteer-core';
import { spawn } from 'child_process';
import { mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const screenshotDir = join(rootDir, 'docs', 'screenshots');

// Ensure screenshots directory exists
if (!existsSync(screenshotDir)) {
  mkdirSync(screenshotDir, { recursive: true });
}

class SimpleScreenshotGenerator {
  constructor() {
    this.browser = null;
    this.page = null;
    this.devServer = null;
    this.serverUrl = 'http://localhost:5173';
  }

  async init() {
    console.log('🚀 Starting simple screenshot generation...');
    
    // Start dev server
    await this.startDevServer();
    
    // Launch browser
    this.browser = await puppeteer.launch({
      executablePath: '/usr/bin/google-chrome',
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
    
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1200, height: 800 });
    
    console.log('✅ Browser launched');
  }

  async startDevServer() {
    return new Promise((resolve, reject) => {
      console.log('📦 Starting development server...');
      
      this.devServer = spawn('npm', ['run', 'dev'], {
        cwd: rootDir,
        stdio: 'pipe'
      });

      let serverReady = false;
      
      this.devServer.stdout.on('data', (data) => {
        const output = data.toString();
        console.log('Server:', output.trim());
        
        // Extract the actual server URL
        const urlMatch = output.match(/Local:\s+(http:\/\/localhost:\d+)/);
        if (urlMatch) {
          this.serverUrl = urlMatch[1];
          console.log(`🔗 Server URL updated to: ${this.serverUrl}`);
        }
        
        if ((output.includes('Local:') || output.includes('ready in')) && !serverReady) {
          serverReady = true;
          console.log('✅ Development server ready');
          setTimeout(resolve, 3000);
        }
      });

      this.devServer.stderr.on('data', (data) => {
        console.log('Server stderr:', data.toString().trim());
      });

      this.devServer.on('error', reject);
      
      setTimeout(() => {
        if (!serverReady) {
          reject(new Error('Server failed to start within 60 seconds'));
        }
      }, 60000);
    });
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async takeScreenshot(filename, description) {
    const filepath = join(screenshotDir, filename);
    await this.page.screenshot({
      path: filepath,
      fullPage: false
    });
    console.log(`📸 Captured: ${description} -> ${filename}`);
  }

  async generateScreenshots() {
    try {
      console.log('🌐 Navigating to application...');
      await this.page.goto(this.serverUrl, { waitUntil: 'networkidle2' });
      await this.sleep(3000);

      // 1. Main interface screenshot
      await this.takeScreenshot('main-interface.png', 'Main questionnaire builder interface');
      
      // 2. Get current page title to understand the app structure
      const title = await this.page.title();
      console.log(`📄 Page title: ${title}`);
      
      // 3. Check what's visible on the page
      const pageInfo = await this.page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button')).map(b => b.textContent?.trim()).filter(Boolean);
        const inputs = document.querySelectorAll('input').length;
        const forms = document.querySelectorAll('form').length;
        const body = document.body.textContent?.substring(0, 200) || '';
        
        return {
          buttons: buttons.slice(0, 10), // First 10 buttons
          inputCount: inputs,
          formCount: forms,
          hasPreview: buttons.some(b => b.toLowerCase().includes('preview')),
          hasAdd: buttons.some(b => b.toLowerCase().includes('add')),
          bodyText: body
        };
      });
      
      console.log('📊 Page analysis:', JSON.stringify(pageInfo, null, 2));

      console.log('✅ Basic screenshot generation completed!');
      console.log('📸 Screenshots saved to docs/screenshots/');
      
    } catch (error) {
      console.error('❌ Error during screenshot generation:', error);
      throw error;
    }
  }

  async cleanup() {
    console.log('🧹 Cleaning up...');
    
    if (this.browser) {
      await this.browser.close();
    }
    
    if (this.devServer) {
      this.devServer.kill();
      
      // Wait for server to stop
      await new Promise((resolve) => {
        this.devServer.on('exit', resolve);
        setTimeout(resolve, 2000);
      });
    }
    
    console.log('✅ Cleanup completed');
  }
}

// Main execution
async function main() {
  const generator = new SimpleScreenshotGenerator();
  
  try {
    await generator.init();
    await generator.generateScreenshots();
  } catch (error) {
    console.error('❌ Screenshot generation failed:', error);
    process.exit(1);
  } finally {
    await generator.cleanup();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default SimpleScreenshotGenerator;