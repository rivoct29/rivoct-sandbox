# Pre-deploy credential check
Param()

Write-Host "Checking deployment credentials..."

if ($env:GOOGLE_APPLICATION_CREDENTIALS) {
    $path = $env:GOOGLE_APPLICATION_CREDENTIALS
    Write-Host "GOOGLE_APPLICATION_CREDENTIALS is set: $path"
    if (-not (Test-Path $path)) {
        Write-Error "Service account key not found at path: $path"
        Exit 2
    }
    try {
        $content = Get-Content -Raw -Path $path
        if ($content -match '"type"\s*:\s*"service_account"') {
            Write-Host "Found service account key (type=service_account)."
            Exit 0
        } else {
            Write-Error "The JSON at $path does not appear to be a service account key."
            Exit 3
        }
    } catch {
        Write-Error "Failed to read $path: ${_}"
        Exit 4
    }
} elseif ($env:FIREBASE_TOKEN) {
    Write-Warning "FIREBASE_TOKEN is set but deprecated; prefer GOOGLE_APPLICATION_CREDENTIALS for CI deploys."
    Exit 0
} else {
    Write-Error "No deployment credentials found. Set GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_TOKEN."
    Exit 1
}
