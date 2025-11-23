#!/usr/bin/env pwsh
# Local Preview Server for Testing Production Build

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "RIVOCT LOCAL PREVIEW SERVER" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Check if build exists
if (-not (Test-Path "web/out/index.html")) {
    Write-Host "ERROR: Build not found. Run 'pnpm run build' first." -ForegroundColor Red
    exit 1
}

Write-Host "`nStarting local server on http://localhost:8080" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop`n" -ForegroundColor Yellow

# Start simple HTTP server
Set-Location web/out
python -m http.server 8080
