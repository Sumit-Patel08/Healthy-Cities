#!/bin/bash
# Deploy backend to Railway with correct Python detection

echo "🚀 Deploying Mumbai Pulse Backend to Railway..."

# Install Railway CLI if not installed
if ! command -v railway &> /dev/null; then
    echo "Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Login to Railway
echo "Please login to Railway..."
railway login

# Navigate to backend directory
cd backend

# Initialize Railway project
railway init

# Set environment variables
railway variables set NIXPACKS_PYTHON_VERSION=3.11
railway variables set FLASK_ENV=production
railway variables set PORT=5000

# Deploy
echo "Deploying backend..."
railway up

echo "✅ Backend deployment complete!"
echo "Check your Railway dashboard for the deployment URL"
