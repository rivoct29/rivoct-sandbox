#!/usr/bin/env pwsh
# Deployment Script for Rivoct Sandbox
# Handles build and deployment validation

param(
    [string]$Environment = "sandbox"
)

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "RIVOCT DEPLOYMENT SYSTEM" -ForegroundColor Cyan
Write-Host "Environment: $Environment" -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor Cyan

# Step 1: Clean previous builds
Write-Host "`n[1/5] Cleaning previous builds..." -ForegroundColor Green
pnpm run clean
if ($LASTEXITCODE -ne 0) {
    Write-Host "Clean failed, continuing anyway..." -ForegroundColor Yellow
}

# Step 2: Run tests
Write-Host "`n[2/5] Running test suite..." -ForegroundColor Green
pnpm test:ci
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Tests failed. Aborting deployment." -ForegroundColor Red
    exit 1
}

# Step 3: Build production bundle
Write-Host "`n[3/5] Building production bundle..." -ForegroundColor Green
pnpm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed. Aborting deployment." -ForegroundColor Red
    exit 1
}

# Step 4: Verify build output
Write-Host "`n[4/5] Verifying build output..." -ForegroundColor Green
if (-not (Test-Path "web/out/index.html")) {
    Write-Host "ERROR: Build output missing. Aborting deployment." -ForegroundColor Red
    exit 1
}

$buildSize = (Get-ChildItem -Path "web/out" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "Build size: $([math]::Round($buildSize, 2)) MB" -ForegroundColor Cyan

# Step 5: Deployment instructions
Write-Host "`n[5/5] Deployment Ready" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Build completed successfully!" -ForegroundColor Green
Write-Host "`nTo deploy, authenticate first:" -ForegroundColor Yellow
Write-Host "  firebase login --reauth" -ForegroundColor White
Write-Host "`nThen deploy:" -ForegroundColor Yellow
Write-Host "  firebase deploy --only `"hosting,functions`"" -ForegroundColor White
Write-Host "`nOr use CI/CD token:" -ForegroundColor Yellow
Write-Host "  firebase login:ci" -ForegroundColor White
Write-Host "  firebase deploy --token <TOKEN> --only `"hosting,functions`"" -ForegroundColor White
Write-Host "=====================================" -ForegroundColor Cyan
