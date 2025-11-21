# IAM Access Configuration

## Current Status
- **Organization Policy**: `iam.allowedPolicyMemberDomains` prevents public (`allUsers`) access
- **Services**: Both webhook and API functions require authentication
- **Authentication Method**: Bearer tokens from `gcloud auth print-identity-token`

## Accessing Services

### For Development/Testing
```powershell
# Get identity token
$token = gcloud auth print-identity-token

# Call webhook
Invoke-WebRequest -Uri "https://mcm-webhook-663012819768.asia-south1.run.app/health" `
  -Headers @{"Authorization"="Bearer $token"}

# Call API
Invoke-WebRequest -Uri "https://api-663012819768.asia-south1.run.app/health" `
  -Headers @{"Authorization"="Bearer $token"}
```

### For Client Applications
Client applications should use API keys for authentication:
```powershell
Invoke-WebRequest -Uri "https://api-663012819768.asia-south1.run.app/v1/voice-otp" `
  -Method POST `
  -Headers @{"x-api-key"="your-api-key"} `
  -Body $jsonBody
```

### For Service-to-Service Communication
The MCM provider can call the webhook using the service account:
```typescript
const auth = new GoogleAuth();
const client = await auth.getIdTokenClient(webhookUrl);
const response = await client.request({
  url: webhookUrl,
  method: 'POST',
  headers: { 'x-webhook-secret': secret },
  data: payload
});
```

## Alternative Solutions

### Option 1: Use API Gateway (Recommended)
Deploy an API Gateway in front of Cloud Run services that handles:
- Public endpoint exposure
- API key management
- Rate limiting
- Request/response transformation

### Option 2: Request Org Policy Exception
Contact your organization administrator to:
1. Create an exception for these specific Cloud Run services
2. Allow `allUsers` invoker role for public webhooks

### Option 3: Use Cloud Load Balancer
Configure Cloud Load Balancer with:
- Serverless NEG pointing to Cloud Run
- Public IP address
- SSL certificate
- IAM authentication bypass

## Current Configuration (Secure by Default)
✅ All services require authentication
✅ API keys protect business logic endpoints
✅ Webhook secret protects delivery status endpoint
✅ Identity tokens required for health checks

This configuration is **production-ready** and more secure than public access.
