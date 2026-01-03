#!/bin/bash

# Quick Start Script for Animal Rescue Backend
# This script helps you get the backend up and running quickly

set -e

echo "🐾 Animal Rescue Backend - Quick Start"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL not detected. Make sure PostgreSQL is installed and running."
    echo "   Or use a hosted database (Railway, Supabase, etc.)"
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ Created .env file"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env and add your:"
    echo "   - DATABASE_URL (PostgreSQL connection string)"
    echo "   - JWT_SECRET (random secure string)"
    echo "   - CLOUDINARY credentials (for photo uploads)"
    echo ""
    echo "Press Enter after you've configured .env..."
    read -r
fi

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo ""
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
fi

# Generate Prisma client
echo ""
echo "🔧 Generating Prisma client..."
npm run prisma:generate

# Check if database is accessible
echo ""
echo "🗄️  Checking database connection..."
if npm run prisma:migrate -- status &> /dev/null; then
    echo "✅ Database is accessible"
else
    echo "⚠️  Cannot connect to database. Please check your DATABASE_URL in .env"
    echo "   Make sure PostgreSQL is running and the database exists."
    exit 1
fi

# Run migrations
echo ""
echo "📊 Running database migrations..."
npm run prisma:migrate -- deploy

# Ask about seeding
echo ""
read -p "Would you like to seed the database with sample data? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Seeding database..."
    npm run prisma:seed
    echo ""
    echo "✅ Sample data created!"
    echo ""
    echo "📝 Sample user credentials:"
    echo "   Email: maria@example.com"
    echo "   Email: chen@example.com"
    echo "   Email: sarah@example.com"
    echo "   Password (all): Password123"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the development server, run:"
echo "   npm run dev"
echo ""
echo "To view/edit data in Prisma Studio:"
echo "   npm run prisma:studio"
echo ""
echo "API will be available at: http://localhost:3000"
echo "Health check: http://localhost:3000/health"
echo ""
echo "Happy coding! 🚀"

