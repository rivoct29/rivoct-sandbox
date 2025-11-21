#!/usr/bin/env pwsh
# Admin tool for onboarding new clients

param(
    [Parameter(Mandatory=$false)]
    [string]$Action = "help",
    
    [Parameter(Mandatory=$false)]
    [string]$CustomerId,
    
    [Parameter(Mandatory=$false)]
    [string]$CustomerName,
    
    [Parameter(Mandatory=$false)]
    [string]$Email,
    
    [Parameter(Mandatory=$false)]
    [string]$BillingPlan = "sandbox"
)

$PROJECT_ID = "rivoct-sandbox"
$API_URL = "https://api-663012819768.asia-south1.run.app"

function Show-Help {
    Write-Host ""
    Write-Host "Rivoct Voice OTP - Admin CLI" -ForegroundColor Cyan
    Write-Host "=============================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\admin-cli.ps1 -Action <action> [options]" -ForegroundColor White
    Write-Host ""
    Write-Host "Actions:" -ForegroundColor Yellow
    Write-Host "  create-customer    Create a new customer account"
    Write-Host "  generate-api-key   Generate API key for a customer"
    Write-Host "  list-customers     List all customers"
    Write-Host "  get-usage          Get usage stats for a customer"
    Write-Host "  revoke-api-key     Revoke an API key"
    Write-Host "  onboard            Complete onboarding (all steps)"
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Yellow
    Write-Host "  # Onboard a new client (recommended)"
    Write-Host "  .\admin-cli.ps1 -Action onboard -CustomerId 'customer_acme' -CustomerName 'Acme Corp' -Email 'admin@acme.com'"
    Write-Host ""
    Write-Host "  # Just create customer"
    Write-Host "  .\admin-cli.ps1 -Action create-customer -CustomerId 'customer_acme' -CustomerName 'Acme Corp'"
    Write-Host ""
    Write-Host "  # Generate API key"
    Write-Host "  .\admin-cli.ps1 -Action generate-api-key -CustomerId 'customer_acme'"
    Write-Host ""
    Write-Host "  # Check usage"
    Write-Host "  .\admin-cli.ps1 -Action get-usage -CustomerId 'customer_acme'"
    Write-Host ""
}

function Create-Customer {
    param($CustomerId, $CustomerName, $BillingPlan)
    
    Write-Host "📝 Creating customer: $CustomerName" -ForegroundColor Cyan
    
    $customerData = @{
        id = $CustomerId
        name = $CustomerName
        status = "active"
        createdAt = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
        apiKeyIds = @()
        billingPlan = $BillingPlan
    } | ConvertTo-Json
    
    # Use Firebase CLI to add document
    $customerData | Set-Content -Path "temp_customer.json"
    
    Write-Host "Run this command to create the customer in Firestore:" -ForegroundColor Yellow
    Write-Host "firebase firestore:set customers/$CustomerId --data temp_customer.json --project $PROJECT_ID"
    
    Write-Host "✅ Customer data prepared" -ForegroundColor Green
}

function Generate-ApiKey {
    param($CustomerId)
    
    Write-Host "🔑 Generating API key for: $CustomerId" -ForegroundColor Cyan
    
    # Generate secure random API key
    $apiKey = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 48 | ForEach-Object {[char]$_})
    
    # Generate salt
    $salt = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
    
    # Create hash (SHA256) - matches Functions code: sha256(salt:apiKey)
    $stringToHash = "$salt`:$apiKey"
    $hasher = [System.Security.Cryptography.SHA256]::Create()
    $hashBytes = $hasher.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($stringToHash))
    $hash = [System.BitConverter]::ToString($hashBytes) -replace '-', ''
    
    $apiKeyData = @{
        customerId = $CustomerId
        hash = $hash.ToLower()
        salt = $salt
        createdAt = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
        revoked = $false
        label = "Production Key - $(Get-Date -Format 'yyyy-MM-dd')"
    } | ConvertTo-Json
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "API KEY GENERATED" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "API Key: $apiKey" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "⚠️  SAVE THIS KEY SECURELY - IT CANNOT BE RETRIEVED LATER!" -ForegroundColor Red
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    
    # Save to file for Firestore import
    $apiKeyData | Set-Content -Path "temp_api_key.json"
    
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Run this command to add API key to Firestore:"
    Write-Host "   firebase firestore:add api_keys --data temp_api_key.json --project $PROJECT_ID"
    Write-Host "2. Note the generated document ID"
    Write-Host "3. Update customer's apiKeyIds array with that ID"
    Write-Host ""
    
    # Save API key to secure file
    @{
        customerId = $CustomerId
        apiKey = $apiKey
        generatedAt = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
    } | ConvertTo-Json | Set-Content -Path "api_key_$CustomerId.json"
    
    Write-Host "✅ API key saved to: api_key_$CustomerId.json" -ForegroundColor Green
}

function Initialize-UsageCounters {
    param($CustomerId)
    
    Write-Host "📊 Initializing usage counters for: $CustomerId" -ForegroundColor Cyan
    
    $usageData = @{
        customerId = $CustomerId
        minuteCount = 0
        dayCount = 0
        monthCount = 0
        minuteLimit = 5
        dayLimit = 100
        monthLimit = 1000
        totalCostInr = 0
        updatedAt = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
    } | ConvertTo-Json
    
    $usageData | Set-Content -Path "temp_usage.json"
    
    Write-Host "Run this command to create usage counter:" -ForegroundColor Yellow
    Write-Host "firebase firestore:set usage_counters/$CustomerId --data temp_usage.json --project $PROJECT_ID"
    
    Write-Host "✅ Usage counter data prepared" -ForegroundColor Green
}

function Get-Usage {
    param($CustomerId)
    
    Write-Host "📊 Getting usage for: $CustomerId" -ForegroundColor Cyan
    Write-Host "Run this command:" -ForegroundColor Yellow
    Write-Host "firebase firestore:get usage_counters/$CustomerId --project $PROJECT_ID"
}

function Complete-Onboarding {
    param($CustomerId, $CustomerName, $Email, $BillingPlan)
    
    if (-not $CustomerId -or -not $CustomerName) {
        Write-Host "❌ Error: CustomerId and CustomerName are required" -ForegroundColor Red
        return
    }
    
    Write-Host ""
    Write-Host "🚀 Starting complete onboarding process..." -ForegroundColor Cyan
    Write-Host ""
    
    # Step 1: Create customer
    Write-Host "Step 1: Creating customer account" -ForegroundColor Yellow
    Create-Customer -CustomerId $CustomerId -CustomerName $CustomerName -BillingPlan $BillingPlan
    Write-Host ""
    
    # Step 2: Generate API key
    Write-Host "Step 2: Generating API key" -ForegroundColor Yellow
    Generate-ApiKey -CustomerId $CustomerId
    Write-Host ""
    
    # Step 3: Initialize usage counters
    Write-Host "Step 3: Initializing usage counters" -ForegroundColor Yellow
    Initialize-UsageCounters -CustomerId $CustomerId
    Write-Host ""
    
    # Step 4: Create welcome email template
    Write-Host "Step 4: Creating welcome email" -ForegroundColor Yellow
    $apiKeyData = Get-Content "api_key_$CustomerId.json" | ConvertFrom-Json
    
    $emailTemplate = @"
Subject: Welcome to Rivoct Voice OTP Service

Hi $CustomerName,

Welcome to Rivoct Voice OTP! Your account has been successfully created.

API CREDENTIALS
===============
Customer ID: $CustomerId
API Key: $($apiKeyData.apiKey)

⚠️ Keep your API key secure - treat it like a password!

API ENDPOINT
===========
Base URL: $API_URL

QUICK START
===========
Send a voice OTP:

PowerShell:
```powershell
`$headers = @{"x-api-key" = "$($apiKeyData.apiKey)"}
`$body = @{phone = "+919876543210"; otpCode = "123456"} | ConvertTo-Json
Invoke-WebRequest -Uri "$API_URL/v1/voice-otp" -Method POST -Headers `$headers -Body `$body
```

RATE LIMITS
===========
- Per Minute: 5 calls
- Per Day: 100 calls  
- Per Month: 1000 calls

PRICING
=======
₹0.32 per successful call

Need help? Reply to this email or visit our documentation.

Best regards,
Rivoct Team
"@
    
    $emailTemplate | Set-Content -Path "welcome_email_$CustomerId.txt"
    Write-Host "✅ Welcome email saved to: welcome_email_$CustomerId.txt" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "🎉 ONBOARDING COMPLETE!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Run the Firebase commands listed above"
    Write-Host "2. Send the welcome email to: $Email"
    Write-Host "3. Monitor first API call in Firestore logs"
    Write-Host ""
    Write-Host "Files created:" -ForegroundColor Cyan
    Write-Host "- temp_customer.json (customer data)"
    Write-Host "- temp_api_key.json (API key data)"
    Write-Host "- temp_usage.json (usage counters)"
    Write-Host "- api_key_$CustomerId.json (API key record)"
    Write-Host "- welcome_email_$CustomerId.txt (welcome email)"
    Write-Host ""
}

# Main execution
switch ($Action) {
    "create-customer" {
        Create-Customer -CustomerId $CustomerId -CustomerName $CustomerName -BillingPlan $BillingPlan
    }
    "generate-api-key" {
        Generate-ApiKey -CustomerId $CustomerId
    }
    "init-usage" {
        Initialize-UsageCounters -CustomerId $CustomerId
    }
    "get-usage" {
        Get-Usage -CustomerId $CustomerId
    }
    "onboard" {
        Complete-Onboarding -CustomerId $CustomerId -CustomerName $CustomerName -Email $Email -BillingPlan $BillingPlan
    }
    "help" {
        Show-Help
    }
    default {
        Write-Host "Unknown action: $Action" -ForegroundColor Red
        Show-Help
    }
}
