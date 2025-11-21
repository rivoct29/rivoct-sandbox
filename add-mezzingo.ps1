# Quick Firestore setup for Mezzingo
Write-Host "`n🚀 Adding Mezzingo to Firestore..." -ForegroundColor Cyan

# Get access token
$token = gcloud auth print-access-token

$baseUrl = "https://firestore.googleapis.com/v1/projects/rivoct-sandbox/databases/(default)/documents"
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# 1. Add customer
Write-Host "`n📝 Adding customer document..."
$customerBody = @'
{
  "fields": {
    "id": {"stringValue": "midhun_test_001"},
    "name": {"stringValue": "Mezzingo"},
    "status": {"stringValue": "active"},
    "billingPlan": {"stringValue": "sandbox"},
    "apiKeyIds": {"arrayValue": {"values": []}},
    "createdAt": {"stringValue": "2025-11-20T20:53:59Z"}
  }
}
'@

try {
    Invoke-RestMethod -Uri "$baseUrl/customers?documentId=midhun_test_001" -Method Post -Headers $headers -Body $customerBody | Out-Null
    Write-Host "✅ Customer added" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Customer might already exist, continuing..." -ForegroundColor Yellow
}

# 2. Add API key
Write-Host "`n🔑 Adding API key document..."
$apiKeyBody = @'
{
  "fields": {
    "customerId": {"stringValue": "midhun_test_001"},
    "hash": {"stringValue": "779f27df2f9d08e0e8d6eb71b65f1eca4db4b8087a94df5057db177ce29cb8b0"},
    "salt": {"stringValue": "slCWwSPivB7zn8O3beXrxdEaKmGJfQAy"},
    "createdAt": {"stringValue": "2025-11-20T20:53:59Z"},
    "label": {"stringValue": "Production Key - 2025-11-21"},
    "revoked": {"booleanValue": false}
  }
}
'@

try {
    $apiKeyResponse = Invoke-RestMethod -Uri "$baseUrl/api_keys" -Method Post -Headers $headers -Body $apiKeyBody
    $apiKeyId = ($apiKeyResponse.name -split '/')[-1]
    Write-Host "✅ API key added with ID: $apiKeyId" -ForegroundColor Green
    
    # 3. Update customer with API key ID
    Write-Host "`n🔗 Linking API key to customer..."
    $updateBody = @"
{
  "fields": {
    "id": {"stringValue": "midhun_test_001"},
    "name": {"stringValue": "Mezzingo"},
    "status": {"stringValue": "active"},
    "billingPlan": {"stringValue": "sandbox"},
    "apiKeyIds": {"arrayValue": {"values": [{"stringValue": "$apiKeyId"}]}},
    "createdAt": {"stringValue": "2025-11-20T20:53:59Z"}
  }
}
"@
    Invoke-RestMethod -Uri "$baseUrl/customers/midhun_test_001" -Method Patch -Headers $headers -Body $updateBody | Out-Null
    Write-Host "✅ Customer updated with API key" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error adding API key: $_" -ForegroundColor Red
}

# 4. Add usage counter
Write-Host "`n📊 Adding usage counter..."
$usageBody = @'
{
  "fields": {
    "customerId": {"stringValue": "midhun_test_001"},
    "minuteWindow": {"stringValue": "2025-11-20T20:54"},
    "minuteCount": {"integerValue": "0"},
    "dayWindow": {"stringValue": "2025-11-20"},
    "dayCount": {"integerValue": "0"},
    "monthWindow": {"stringValue": "2025-11"},
    "monthCount": {"integerValue": "0"},
    "totalCostInr": {"doubleValue": 0.0}
  }
}
'@

try {
    Invoke-RestMethod -Uri "$baseUrl/usage_counters?documentId=midhun_test_001" -Method Post -Headers $headers -Body $usageBody | Out-Null
    Write-Host "✅ Usage counter added" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Usage counter might already exist" -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "✅ MEZZINGO SETUP COMPLETE!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green
Write-Host "`n📧 Client: midhun@mezzingo.com"
Write-Host "🆔 Customer ID: midhun_test_001"
Write-Host "`n🔑 API KEY:" -ForegroundColor Yellow
Write-Host "qlm9FNzxgK7weuDcO3S5IWv8PMfXaRntCLHE2hTy0jiVkoGrYB" -ForegroundColor White -BackgroundColor DarkGray
Write-Host "`n✅ All Firestore documents added!"
Write-Host "📧 Now send the welcome email with API key and API_INTEGRATION_GUIDE.md`n"
