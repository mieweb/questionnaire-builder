#!/usr/bin/env node

/**
 * Automated Screenshot Generator for Questionnaire Builder
 * 
 * This script automatically takes screenshots of the questionnaire builder
 * interface for documentation purposes. It starts the dev server, navigates
 * to different states of the application, and captures screenshots.
 */

import puppeteer from 'puppeteer-core';
import { spawn } from 'child_process';
import { readFileSync, mkdirSync, existsSync } from 'fs';
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

class ScreenshotGenerator {
  constructor() {
    this.browser = null;
    this.page = null;
    this.devServer = null;
    this.serverUrl = 'http://localhost:5173';
  }

  async init() {
    console.log('🚀 Starting screenshot generation...');
    
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
      let outputBuffer = '';
      
      this.devServer.stdout.on('data', (data) => {
        const output = data.toString();
        outputBuffer += output;
        console.log('Server output:', output.trim());
        
        // Extract the actual server URL
        const urlMatch = output.match(/Local:\s+(http:\/\/localhost:\d+)/);
        if (urlMatch) {
          this.serverUrl = urlMatch[1];
          console.log(`🔗 Server URL updated to: ${this.serverUrl}`);
        }
        
        if ((output.includes('Local:') || output.includes('localhost:') || output.includes('ready in')) && !serverReady) {
          serverReady = true;
          console.log('✅ Development server ready');
          // Wait a bit more for the server to be fully ready
          setTimeout(resolve, 3000);
        }
      });

      this.devServer.stderr.on('data', (data) => {
        const output = data.toString();
        console.log('Server stderr:', output.trim());
        
        // Sometimes vite outputs to stderr
        if ((output.includes('Local:') || output.includes('localhost:') || output.includes('ready in')) && !serverReady) {
          serverReady = true;
          console.log('✅ Development server ready (from stderr)');
          setTimeout(resolve, 3000);
        }
      });

      this.devServer.on('error', (error) => {
        console.error('Server spawn error:', error);
        reject(error);
      });
      
      // More generous timeout
      setTimeout(() => {
        if (!serverReady) {
          console.log('Server output so far:', outputBuffer);
          reject(new Error('Server failed to start within 60 seconds'));
        }
      }, 60000);
    });
  }

  async takeScreenshot(filename, description) {
    const filepath = join(screenshotDir, filename);
    await this.page.screenshot({
      path: filepath,
      fullPage: false
    });
    console.log(`📸 Captured: ${description} -> ${filename}`);
  }

  async waitForElement(selector, timeout = 5000) {
    try {
      await this.page.waitForSelector(selector, { timeout });
      return true;
    } catch (error) {
      console.warn(`⚠️  Element ${selector} not found within ${timeout}ms`);
      return false;
    }
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async findElementByText(tag, text, timeout = 3000) {
    try {
      const element = await this.page.evaluateHandle((tag, text) => {
        const elements = Array.from(document.querySelectorAll(tag));
        return elements.find(el => el.textContent.includes(text));
      }, tag, text);
      
      if (element && element.asElement) {
        return element.asElement();
      }
      return null;
    } catch (error) {
      console.warn(`⚠️  Element with text "${text}" not found`);
      return null;
    }
  }

  async addField(fieldType, question, options = []) {
    try {
      // Look for the add field button
      let addButton = await this.findElementByText('button', 'Add Field');
      if (!addButton) {
        addButton = await this.page.$('button[data-testid="add-field"], .add-field-btn, button[title*="Add"]');
      }
      
      if (addButton) {
        await addButton.click();
        await this.sleep(500);
        console.log('✅ Clicked add field button');
      } else {
        console.warn('⚠️  Add field button not found');
        return;
      }

      // Try to find and click the specific field type button
      let fieldTypeButton = await this.findElementByText('button', fieldType);
      if (!fieldTypeButton) {
        fieldTypeButton = await this.page.$(`[data-field="${fieldType}"], .field-type-${fieldType.toLowerCase()}`);
      }
      
      if (fieldTypeButton) {
        await fieldTypeButton.click();
        await this.sleep(1000);
        console.log(`✅ Selected field type: ${fieldType}`);
      } else {
        console.warn(`⚠️  Field type button not found: ${fieldType}`);
      }

      // Fill in the question field
      const questionInput = await this.page.$('input[placeholder*="question"], input[name="question"], textarea[placeholder*="question"]');
      if (questionInput && question) {
        await questionInput.click();
        await questionInput.type(question);
        console.log(`✅ Entered question: ${question}`);
      }

      // For fields with options, add them
      if (options && options.length > 0) {
        for (let i = 0; i < options.length; i++) {
          const optionInput = await this.page.$(`input[placeholder*="option"], input[name*="option"], .option-input`);
          if (optionInput) {
            await optionInput.click();
            await optionInput.type(options[i]);
            await this.sleep(200);
          }
        }
      }

      // Save the field
      let saveButton = await this.findElementByText('button', 'Save');
      if (!saveButton) {
        saveButton = await this.findElementByText('button', 'Add');
      }
      if (!saveButton) {
        saveButton = await this.page.$('button[type="submit"], .save-field-btn');
      }
      
      if (saveButton) {
        await saveButton.click();
        await this.sleep(1000);
        console.log('✅ Saved field');
      }

      console.log(`✅ Added ${fieldType} field: ${question}`);
    } catch (error) {
      console.warn(`⚠️  Could not add ${fieldType} field:`, error.message);
    }
  }

  async generateScreenshots() {
    try {
      console.log('🌐 Navigating to application...');
      await this.page.goto(this.serverUrl, { waitUntil: 'networkidle2' });
      await this.sleep(3000);

      // 1. Main interface screenshot
      await this.takeScreenshot('main-interface.png', 'Main interface');

      // 2. Add sample fields to demonstrate different types
      console.log('🏗️  Creating field examples...');
      
      await this.addField('Input Field', 'Full Name');
      await this.addField('Radio Field', 'Gender', ['Male', 'Female', 'Other']);
      await this.addField('Check Field', 'Interests', ['Reading', 'Sports', 'Music']);
      await this.addField('Dropdown Field', 'Country', ['USA', 'Canada', 'UK']);
      
      // Wait for fields to be added
      await this.sleep(2000);

      // 3. Take screenshot of builder with fields in edit mode
      await this.takeScreenshot('all-field-types-edit.png', 'All field types in edit mode');

      // 4. Switch to preview mode
      console.log('🔄 Switching to preview mode...');
      let previewToggle = await this.findElementByText('button', 'Preview');
      if (!previewToggle) {
        previewToggle = await this.page.$('.preview-toggle, [data-testid="preview"]');
      }
      
      if (previewToggle) {
        await previewToggle.click();
        await this.sleep(2000);
        await this.takeScreenshot('all-field-types-preview.png', 'All field types in preview mode');
        
        // 5. Take individual field screenshots in preview mode
        console.log('📸 Taking individual field screenshots...');
        await this.takeIndividualFieldScreenshots();
      } else {
        console.warn('⚠️  Preview toggle not found');
      }

      console.log('✅ Screenshot generation completed!');
      
    } catch (error) {
      console.error('❌ Error during screenshot generation:', error);
      throw error;
    }
  }

  async takeIndividualFieldScreenshots() {
    try {
      // Look for form fields in preview mode
      const fields = await this.page.$$('.form-field, .field-preview, .question-field, .field-container');
      
      if (fields.length === 0) {
        console.warn('⚠️  No fields found for individual screenshots');
        return;
      }

      for (let i = 0; i < fields.length; i++) {
        try {
          // Scroll the field into view
          await fields[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
          await this.sleep(500);

          // Get the field type from various possible attributes
          const fieldInfo = await fields[i].evaluate(el => {
            const className = el.className || '';
            const dataType = el.getAttribute('data-field-type') || '';
            const textContent = el.textContent || '';
            
            // Try to determine field type
            let type = 'field';
            if (className.includes('input') || dataType === 'input' || el.querySelector('input[type="text"]')) {
              type = 'input';
            } else if (className.includes('radio') || dataType === 'radio' || el.querySelector('input[type="radio"]')) {
              type = 'radio';
            } else if (className.includes('check') || dataType === 'check' || el.querySelector('input[type="checkbox"]')) {
              type = 'check';
            } else if (className.includes('dropdown') || className.includes('selection') || dataType === 'selection' || el.querySelector('select')) {
              type = 'dropdown';
            } else if (className.includes('section') || dataType === 'section') {
              type = 'section';
            }

            return { type, index: arguments[0] };
          }, i);

          // Get bounding box and take screenshot
          const boundingBox = await fields[i].boundingBox();
          if (boundingBox) {
            const filename = `${fieldInfo.type}-field-preview.png`;
            await this.page.screenshot({
              path: join(screenshotDir, filename),
              clip: {
                x: Math.max(0, boundingBox.x - 20),
                y: Math.max(0, boundingBox.y - 20),
                width: Math.min(1200, boundingBox.width + 40),
                height: Math.min(800, boundingBox.height + 40)
              }
            });
            console.log(`📸 Captured: ${fieldInfo.type} field preview -> ${filename}`);
          }
        } catch (error) {
          console.warn(`⚠️  Could not capture field ${i}:`, error.message);
        }
      }
    } catch (error) {
      console.warn('⚠️  Error taking individual field screenshots:', error.message);
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
  const generator = new ScreenshotGenerator();
  
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

export default ScreenshotGenerator;