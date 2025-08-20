# Screenshot Generation Scripts

This directory contains automated screenshot generation scripts for the Questionnaire Builder documentation.

## Scripts

### `update-screenshots.sh`
Main shell script that handles the complete screenshot generation process.

**Usage:**
```bash
# Basic screenshots (recommended)
./scripts/update-screenshots.sh

# Comprehensive screenshots (experimental)
./scripts/update-screenshots.sh full
```

**What it does:**
- Installs required dependencies if needed
- Starts the development server
- Launches a headless browser
- Takes screenshots of the application
- Saves them to `docs/screenshots/`
- Cleans up processes

### `simple-screenshots.js`
Takes basic screenshots of the application interface without complex interactions.

**Usage:**
```bash
npm run screenshots
# or
node scripts/simple-screenshots.js
```

**What it captures:**
- Main interface overview
- Current application state

### `take-screenshots.js`
Advanced script that attempts to interact with the UI to create different field types and capture comprehensive screenshots.

**Usage:**
```bash
npm run screenshots:full
# or
node scripts/take-screenshots.js
```

**What it attempts to capture:**
- Main interface
- Different field types being added
- Edit mode screenshots
- Preview mode screenshots
- Individual field screenshots

## Requirements

- Node.js and npm installed
- Google Chrome browser available on the system
- Project dependencies installed (`npm install`)

## Dependencies

The scripts use:
- `puppeteer-core` - For headless browser automation
- System Chrome browser (automatically detected)
- Vite development server

## Output

Screenshots are saved to `docs/screenshots/` directory with these typical files:
- `main-interface.png` - Main application interface
- Additional files depending on the script used

## Troubleshooting

### Common Issues

1. **Browser not found**: Ensure Google Chrome is installed on your system
2. **Server timeout**: Check if port 5173 (or alternative) is available
3. **Permission errors**: Make sure the script has execute permissions (`chmod +x scripts/update-screenshots.sh`)

### Debugging

Run the simple version first to verify basic functionality:
```bash
npm run screenshots
```

For verbose output, check the console logs during script execution.

## Integration

Add the screenshot update to your workflow:

```bash
# Before committing documentation changes
./scripts/update-screenshots.sh

# Add to git
git add docs/screenshots/
git commit -m "Update documentation screenshots"
```