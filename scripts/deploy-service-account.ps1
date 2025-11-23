Param(
    [Parameter(Mandatory=$false)]
    [string]$KeyPath
)

if (-not $KeyPath) {
    if ($env:GOOGLE_APPLICATION_CREDENTIALS) {
        $KeyPath = $env:GOOGLE_APPLICATION_CREDENTIALS
    } else {
        Write-Error "Provide the path to the service account JSON key as an argument, or set the GOOGLE_APPLICATION_CREDENTIALS environment variable."
        Exit 2
    }
}

if (-not (Test-Path $KeyPath)) {
    Write-Error "Service account key not found at path: $KeyPath"
    Exit 3
}

Write-Host "Using service account key: $KeyPath"
$env:GOOGLE_APPLICATION_CREDENTIALS = (Resolve-Path $KeyPath).Path

# Move to repo root (one level up from scripts folder) so pnpm runs in workspace root
Set-Location (Join-Path $PSScriptRoot "..")

Write-Host "Installing dependencies and building workspace..."
pnpm install --frozen-lockfile
pnpm -r build

Write-Host "Starting deploy (hosting + functions)"
pnpm run deploy
