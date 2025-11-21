# Client Onboarding Guide

## Overview
This guide explains how to onboard new clients to your Voice OTP service.

## Step 1: Create Customer Account

### Using Firebase Console (Manual)
1. Go to Firestore: https://console.firebase.google.com/project/rivoct-sandbox/firestore
2. Navigate to `customers` collection
3. Click "Add document"
4. Set document ID: `customer_<unique_id>` (e.g., `customer_acme_corp`)
5. Add fields:
```json
{
  "id": "customer_acme_corp",
  "name": "Acme Corporation",
  "status": "active",
  "createdAt": "2025-11-21T00:00:00Z",
  "apiKeyIds": [],
  "billingPlan": "sandbox"
}
```

### Using Admin Script (Recommended)
```powershell
# Create a customer via API (requires admin endpoint)
$body = @{
  id = "customer_acme_corp"
  name = "Acme Corporation"
  email = "admin@acme.com"
  billingPlan = "sandbox"
} | ConvertTo-Json

Invoke-WebRequest -Uri "https://api-663012819768.asia-south1.run.app/admin/customers" `
  -Method POST `
  -Headers @{"x-internal-token"="your-internal-token"} `
  -Body $body `
  -ContentType "application/json"
```

## Step 2: Generate API Key

### Manual Generation
```powershell
# Generate a secure API key
$apiKey = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
Write-Host "Generated API Key: $apiKey"
# Example: xK9mPq2Lv8NcRt4Yw6Zf1Hj3Bd7Sg5Ux
```

### Create API Key Record in Firestore
1. Navigate to `api_keys` collection
2. Add document with auto-generated ID
3. Add fields:
```json
{
  "customerId": "customer_acme_corp",
  "hash": "<hash_of_api_key>",
  "salt": "<random_salt>",
  "createdAt": "2025-11-21T00:00:00Z",
  "revoked": false,
  "label": "Production Key - Acme Corp"
}
```

### Using API Key Service (Recommended)
Create an admin script to generate API keys programmatically:

```typescript
// admin-tools/create-api-key.ts
import * as admin from 'firebase-admin';
import * as crypto from 'crypto';

admin.initializeApp();

async function generateApiKey(customerId: string, label: string) {
  // Generate random API key
  const apiKey = crypto.randomBytes(32).toString('hex');
  
  // Generate salt and hash
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHash('sha256')
    .update(apiKey + salt)
    .digest('hex');
  
  // Store in Firestore
  const apiKeyDoc = await admin.firestore().collection('api_keys').add({
    customerId,
    hash,
    salt,
    createdAt: new Date().toISOString(),
    revoked: false,
    label
  });
  
  // Update customer's apiKeyIds
  await admin.firestore().collection('customers').doc(customerId).update({
    apiKeyIds: admin.firestore.FieldValue.arrayUnion(apiKeyDoc.id)
  });
  
  console.log('API Key generated:', apiKey);
  console.log('Save this key securely - it cannot be retrieved later!');
  
  return apiKey;
}

// Usage
generateApiKey('customer_acme_corp', 'Production Key')
  .then(() => process.exit(0))
  .catch(console.error);
```

## Step 3: Initialize Usage Counters

Create usage tracking document:
```json
// Collection: usage_counters
// Document ID: customer_acme_corp
{
  "customerId": "customer_acme_corp",
  "minuteCount": 0,
  "dayCount": 0,
  "monthCount": 0,
  "minuteLimit": 5,
  "dayLimit": 100,
  "monthLimit": 1000,
  "totalCostInr": 0,
  "updatedAt": "2025-11-21T00:00:00Z"
}
```

## Step 4: Provide Client Documentation

Send the client an email with:

### 1. API Credentials
```
Your Voice OTP API Key: xK9mPq2Lv8NcRt4Yw6Zf1Hj3Bd7Sg5Ux
Customer ID: customer_acme_corp

⚠️ Keep this API key secure - treat it like a password!
```

### 2. API Endpoint
```
Base URL: https://api-663012819768.asia-south1.run.app
```

### 3. Quick Start Example
```powershell
# Send a voice OTP
$headers = @{
  "x-api-key" = "xK9mPq2Lv8NcRt4Yw6Zf1Hj3Bd7Sg5Ux"
  "Content-Type" = "application/json"
}

$body = @{
  phone = "+919876543210"
  otpCode = "123456"
  metadata = @{
    purpose = "login"
    userId = "user_789"
  }
} | ConvertTo-Json

$response = Invoke-WebRequest `
  -Uri "https://api-663012819768.asia-south1.run.app/v1/voice-otp" `
  -Method POST `
  -Headers $headers `
  -Body $body

$result = $response.Content | ConvertFrom-Json
Write-Host "Request ID: $($result.requestId)"
Write-Host "Status: $($result.status)"
Write-Host "Duration: $($result.durationSeconds) seconds"
Write-Host "Billed: ₹$($result.billedAmountInr)"
```

### 4. Rate Limits
```
- Per Minute: 5 calls
- Per Day: 100 calls
- Per Month: 1000 calls

Pricing: ₹0.32 per call
```

### 5. Integration Code Examples

**Node.js/TypeScript:**
```typescript
import axios from 'axios';

const API_KEY = 'xK9mPq2Lv8NcRt4Yw6Zf1Hj3Bd7Sg5Ux';
const BASE_URL = 'https://api-663012819768.asia-south1.run.app';

async function sendVoiceOTP(phone: string, otpCode: string) {
  const response = await axios.post(
    `${BASE_URL}/v1/voice-otp`,
    {
      phone,
      otpCode,
      metadata: { purpose: 'login' }
    },
    {
      headers: { 'x-api-key': API_KEY }
    }
  );
  
  return response.data;
}

// Usage
sendVoiceOTP('+919876543210', '123456')
  .then(result => console.log('OTP sent:', result))
  .catch(error => console.error('Error:', error.response?.data));
```

**Python:**
```python
import requests

API_KEY = 'xK9mPq2Lv8NcRt4Yw6Zf1Hj3Bd7Sg5Ux'
BASE_URL = 'https://api-663012819768.asia-south1.run.app'

def send_voice_otp(phone: str, otp_code: str):
    response = requests.post(
        f'{BASE_URL}/v1/voice-otp',
        json={
            'phone': phone,
            'otpCode': otp_code,
            'metadata': {'purpose': 'login'}
        },
        headers={'x-api-key': API_KEY}
    )
    response.raise_for_status()
    return response.json()

# Usage
result = send_voice_otp('+919876543210', '123456')
print(f"Request ID: {result['requestId']}")
print(f"Billed: ₹{result['billedAmountInr']}")
```

**PHP:**
```php
<?php
$apiKey = 'xK9mPq2Lv8NcRt4Yw6Zf1Hj3Bd7Sg5Ux';
$baseUrl = 'https://api-663012819768.asia-south1.run.app';

function sendVoiceOTP($phone, $otpCode) {
    global $apiKey, $baseUrl;
    
    $data = [
        'phone' => $phone,
        'otpCode' => $otpCode,
        'metadata' => ['purpose' => 'login']
    ];
    
    $ch = curl_init("$baseUrl/v1/voice-otp");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'x-api-key: ' . $apiKey,
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    return json_decode($response, true);
}

$result = sendVoiceOTP('+919876543210', '123456');
echo "Request ID: " . $result['requestId'] . "\n";
echo "Billed: ₹" . $result['billedAmountInr'] . "\n";
?>
```

## Step 5: Monitor Client Usage

### Check Usage via API
```powershell
$headers = @{"x-api-key" = "client-api-key"}

$usage = Invoke-WebRequest `
  -Uri "https://api-663012819768.asia-south1.run.app/v1/usage/summary" `
  -Headers $headers | ConvertFrom-Json

Write-Host "Total Calls: $($usage.totalCalls)"
Write-Host "Total Cost: ₹$($usage.totalCost)"
Write-Host "Current Month: $($usage.monthCount)/$($usage.monthLimit)"
```

### Monitor in Firestore
1. Go to `usage_counters` collection
2. Find client's document
3. Check:
   - `totalCostInr`: Total amount to bill
   - `monthCount`: Calls this month
   - `dayCount`: Calls today
   - `minuteCount`: Calls this minute

### View Call Logs
```powershell
$logs = Invoke-WebRequest `
  -Uri "https://api-663012819768.asia-south1.run.app/v1/logs?limit=50" `
  -Headers @{"x-api-key" = "client-api-key"} | ConvertFrom-Json

$logs | ForEach-Object {
  Write-Host "$($_.createdAt) | $($_.phone) | $($_.status) | ₹$($_.pricingInr)"
}
```

## Step 6: Billing and Invoicing

### Generate Monthly Invoice
```powershell
# Get usage for billing period
$customerId = "customer_acme_corp"
$usage = Get-Content "usage_counters/$customerId"

# Calculate invoice
$totalCalls = $usage.monthCount
$pricePerCall = 0.32
$totalAmount = $totalCalls * $pricePerCall

Write-Host "Invoice for $($usage.customerId)"
Write-Host "Period: November 2025"
Write-Host "Total Calls: $totalCalls"
Write-Host "Rate: ₹$pricePerCall per call"
Write-Host "Amount Due: ₹$totalAmount"
```

### Export Call Details
```powershell
# Export logs to CSV for invoicing
$logs = Invoke-WebRequest `
  -Uri "https://api-663012819768.asia-south1.run.app/v1/logs?limit=1000" `
  -Headers @{"x-api-key" = "admin-key"} | ConvertFrom-Json

$logs | Export-Csv -Path "invoice_$customerId_nov2025.csv" -NoTypeInformation
```

## Step 7: Client Support

### Common Issues

**1. API Key Not Working**
- Verify key is not revoked in Firestore
- Check `api_keys` collection for `revoked: false`
- Ensure key is being sent in `x-api-key` header

**2. Rate Limit Exceeded**
- Check `usage_counters` document
- Adjust limits if needed:
```javascript
db.collection('usage_counters').doc(customerId).update({
  minuteLimit: 10,
  dayLimit: 200,
  monthLimit: 5000
});
```

**3. Invalid Phone Number**
- Must be Indian format: `+91` followed by 10 digits
- Example: `+919876543210`

### Support Checklist
- [ ] Customer account created
- [ ] API key generated and securely delivered
- [ ] Usage counters initialized
- [ ] Client successfully made first API call
- [ ] Client received documentation
- [ ] Monitoring and alerting configured
- [ ] Billing arrangement confirmed

## Onboarding Automation Script

Create a complete onboarding script:

```powershell
# onboard-client.ps1
param(
    [Parameter(Mandatory=$true)]
    [string]$CustomerId,
    
    [Parameter(Mandatory=$true)]
    [string]$CustomerName,
    
    [Parameter(Mandatory=$true)]
    [string]$Email,
    
    [string]$BillingPlan = "sandbox"
)

Write-Host "🚀 Onboarding client: $CustomerName ($CustomerId)" -ForegroundColor Cyan

# Step 1: Create customer document
Write-Host "Creating customer account..." -ForegroundColor Yellow
# Add customer to Firestore via admin API

# Step 2: Generate API key
Write-Host "Generating API key..." -ForegroundColor Yellow
# Generate and store API key

# Step 3: Initialize usage counters
Write-Host "Initializing usage tracking..." -ForegroundColor Yellow
# Create usage_counters document

# Step 4: Send welcome email
Write-Host "Sending welcome email..." -ForegroundColor Yellow
# Email API credentials and documentation

Write-Host "✅ Client onboarded successfully!" -ForegroundColor Green
Write-Host "API Key: <securely_generated_key>"
Write-Host "Remember to save the API key - it cannot be retrieved later!"
```

## Next Steps

1. **Create admin tools** for customer and API key management
2. **Set up billing automation** for monthly invoicing
3. **Configure monitoring** for client usage patterns
4. **Prepare support documentation** and FAQ
5. **Set up webhook notifications** for client alerts

---

**Need Help?**
- Documentation: `/docs`
- Support: admin@rivoct.com
- Dashboard: https://console.firebase.google.com/project/rivoct-sandbox
