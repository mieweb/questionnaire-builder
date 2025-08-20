#!/bin/bash

# Automated Screenshot Generator for Questionnaire Builder Documentation
# 
# This script automatically takes screenshots of the questionnaire builder
# interface and saves them to docs/screenshots/ for use in documentation.
#
# Usage: 
#   ./scripts/update-screenshots.sh        - Take basic screenshots
#   ./scripts/update-screenshots.sh full   - Take comprehensive screenshots (experimental)
#
# Prerequisites:
# - Node.js and npm installed
# - Development dependencies installed (npm install)
# - Google Chrome browser available on the system

set -e  # Exit on any error

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🔄 Updating documentation screenshots..."
echo "📁 Project root: $PROJECT_ROOT"

# Change to project directory
cd "$PROJECT_ROOT"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies first..."
    npm install
fi

# Check if puppeteer-core is installed
if ! npm list puppeteer-core > /dev/null 2>&1; then
    echo "🤖 Installing puppeteer-core..."
    PUPPETEER_SKIP_DOWNLOAD=true npm install --save-dev puppeteer-core
fi

# Ensure screenshots directory exists
mkdir -p "docs/screenshots"

echo "🚀 Starting screenshot generation..."

# Choose which script to run based on argument
if [ "$1" = "full" ]; then
    echo "📸 Running comprehensive screenshot generation (experimental)..."
    node scripts/take-screenshots.js
else
    echo "📸 Running basic screenshot generation..."
    node scripts/simple-screenshots.js
fi

echo "✅ Screenshots updated successfully!"
echo "📸 Screenshots saved to: docs/screenshots/"

# List the generated screenshots
echo ""
echo "Generated screenshots:"
ls -la docs/screenshots/ | grep '\.png$' | awk '{print "  📷 " $9}'

echo ""
echo "🎉 Documentation screenshots are now up to date!"
echo "💡 You can now commit these changes with: git add docs/screenshots/ && git commit -m 'Update documentation screenshots'"