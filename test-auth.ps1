# Test authenticated access to Cloud Run services

Write-Host "Getting identity token..." -ForegroundColor Cyan
$token = gcloud auth print-identity-token 2>$null

Write-Host "`nTesting Webhook Health..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "https://mcm-webhook-663012819768.asia-south1.run.app/health" -Headers @{"Authorization"="Bearer $token"}
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTesting API Health..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "https://api-663012819768.asia-south1.run.app/health" -Headers @{"Authorization"="Bearer $token"}
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
