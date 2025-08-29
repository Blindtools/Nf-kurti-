#!/bin/bash

# Nukkad Fabrics WhatsApp Bot Startup Script

echo "🏢 Starting Nukkad Fabrics WhatsApp Bot..."
echo "================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from the bot directory."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies."
        exit 1
    fi
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. You can customize it if needed."
fi

# Check if auth_info_multi directory exists
if [ -d "auth_info_multi" ]; then
    echo "🔐 Found existing WhatsApp authentication data."
else
    echo "📱 First time setup - QR code will be generated for WhatsApp connection."
fi

echo "🚀 Starting the bot..."
echo "📱 QR Code will be available at: http://localhost:${PORT:-3000}/qr"
echo "📊 Status dashboard: http://localhost:${PORT:-3000}/"
echo ""
echo "Press Ctrl+C to stop the bot"
echo "================================================"

# Start the bot
npm start

