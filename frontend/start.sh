#!/bin/bash

echo ""
echo "========================================"
echo " CityForge - Mumbai Pulse Frontend"
echo " Urban Resilience Powered by NASA Data"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not available"
    echo "Please ensure npm is installed with Node.js"
    exit 1
fi

echo "Node.js $(node --version) and npm $(npm --version) are available"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    echo "This may take a few minutes..."
    echo ""
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install dependencies"
        exit 1
    fi
    echo ""
    echo "Dependencies installed successfully!"
    echo ""
else
    echo "Dependencies already installed"
    echo ""
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "Creating environment configuration..."
    cp ".env.example" ".env"
    echo "Environment file created from template"
    echo "You can edit .env to customize your configuration"
    echo ""
fi

echo "Starting development server..."
echo ""
echo "The application will open in your browser at:"
echo "http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the development server
npm run dev
