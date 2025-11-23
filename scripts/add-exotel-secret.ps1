# Upload Exotel credential to Google Secret Manager
# Usage: run in an environment with gcloud authenticated and project set
$secretFile = "secrets/CARRIER_API_KEY.txt"
if (-not (Test-Path $secretFile)) {
    Write-Error "Secret file not found: $secretFile"
    exit 1
}
# Create secret if it doesn't exist
$exists = (gcloud secrets list --filter="name:CARRIER_API_KEY" --format="value(name)")
if (-not $exists) {
    gcloud secrets create CARRIER_API_KEY --data-file=$secretFile --replication-policy="automatic"
} else {
    gcloud secrets versions add CARRIER_API_KEY --data-file=$secretFile
}
Write-Host "Secret upload attempted (check gcloud output for success)."