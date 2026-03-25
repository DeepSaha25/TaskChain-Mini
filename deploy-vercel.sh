#!/usr/bin/env bash
# Deployment script for TaskChain Mini to Vercel

echo "🚀 TaskChain Mini - Vercel Deployment Script"
echo "=============================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "✅ Vercel CLI ready"
echo ""

# Navigate to client directory
echo "📁 Navigating to client directory..."
cd client || exit

echo ""
echo "🔧 Building client for production..."
npm run build

echo ""
echo "🚀 Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo "Your live URL: https://taskchain-mini.vercel.app"
