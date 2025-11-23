#!/usr/bin/env bash
# Quick deployment script for Unix-based systems

echo "======================================"
echo "RIVOCT DEPLOYMENT SYSTEM"
echo "======================================"

# Build
echo "[1/3] Building..."
pnpm run build

if [ $? -ne 0 ]; then
    echo "Build failed!"
    exit 1
fi

# Test
echo "[2/3] Testing..."
pnpm test:ci

if [ $? -ne 0 ]; then
    echo "Tests failed!"
    exit 1
fi

# Deploy
echo "[3/3] Deploying to Firebase..."
firebase deploy --only "hosting,functions"

echo "======================================"
echo "Deployment complete!"
echo "======================================"
