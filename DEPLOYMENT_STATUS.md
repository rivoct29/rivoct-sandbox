# 🚀 Rivoct Sandbox - Deployment Status Report

**Generated**: November 20, 2025  
**Project**: `rivoct-sandbox`  
**Status**: ✅ **FULLY DEPLOYED & OPERATIONAL**

---

## 📍 Service URLs

### Primary Services

| Service | URL | Status | Authentication |
|---------|-----|--------|----------------|
| **Cloud Functions (API)** | `https://asia-south1-rivoct-sandbox.cloudfunctions.net/api` | ✅ Live | API Key (`x-api-key` header) |
| **Cloud Run (Webhook)** | `https://mcm-webhook-wju6e5vpmq-el.a.run.app` | ✅ Live | Bearer Token + Webhook Secret |
| **Firebase Hosting** | `https://rivoct-sandbox.web.app` | ✅ Live | Firebase Auth (Email/Password) |
| **Alternative Webhook URL** | `https://mcm-webhook-663012819768.asia-south1.run.app` | ✅ Configured | Same as above |

### API Endpoints

**Base URL**: `https://asia-south1-rivoct-sandbox.cloudfunctions.net/api`

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/health` | GET | Health check | ❌ Public |
| `/v1/voice-otp` | POST | Trigger voice OTP call | ✅ API Key |
| `/v1/usage/:customerId/:period` | GET | Get usage summary | ✅ API Key |
| `/v1/logs/:customerId` | GET | Retrieve call logs | ✅ API Key |

**Webhook Endpoint**: `https://mcm-webhook-wju6e5vpmq-el.a.run.app/webhooks/mcm/delivery-status`

---

## 🔐 Authentication Methods

### 1. API Key Authentication (External Clients)

**Header Format**:
```http
x-api-key: <your-api-key>
```

**Usage**:
- Generate API keys via Web Dashboard → Settings
- Keys are hashed with SHA-256 + salt before storage
- Rate limited: 5/minute, 100/day, 1000/month

**Example**:
```bash
curl -X POST https://asia-south1-rivoct-sandbox.cloudfunctions.net/api/v1/voice-otp \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"phone":"+919876543210","otpCode":"123456"}'
```

### 2. Bearer Token Authentication (Cloud Run Webhook)

**Required Headers**:
```http
Authorization: Bearer <gcloud-identity-token>
x-webhook-secret: <SECRET_WEBHOOK>
Content-Type: application/json
```

**How to Get Identity Token**:
```powershell
$token = (gcloud auth print-identity-token)
```

**Current IAM Policy**:
- ⚠️ Organization policy **prevents** `allUsers` and `allAuthenticatedUsers`
- ✅ Authenticated users with valid identity tokens can access
- Service-to-service calls work via default service account

**Example**:
```powershell
$token = (gcloud auth print-identity-token)
$headers = @{
    "Authorization" = "Bearer $token"
    "x-webhook-secret" = "test-secret"
    "Content-Type" = "application/json"
}
$body = @{
    requestId = "test-123"
    customerId = "cust-123"
    status = "answered"
    durationSeconds = 45
    deliveredAt = "2025-11-20T10:00:00Z"
} | ConvertTo-Json

Invoke-WebRequest -Uri "https://mcm-webhook-wju6e5vpmq-el.a.run.app/webhooks/mcm/delivery-status" `
    -Method POST -Headers $headers -Body $body
```

### 3. Firebase Authentication (Web Dashboard)

**Method**: Email/Password  
**Users Collection**: `users/{uid}` with `customerId` and `roles` fields  
**Access**: Admin users can manage customers, API keys, and view logs

---

## 🔒 IAM & Security Configuration

### Current Setup

✅ **Secret Manager Integration**:
- `SECRET_WEBHOOK` - Webhook validation secret
- `SECRET_API_SALT` - API key hashing salt
- `FIREBASE_ADMIN_SDK` - Service account credentials
- `INTERNAL_BACKEND_TOKEN` - Internal service auth

✅ **Service Accounts**:
- Functions: `rivoct-sandbox@appspot.gserviceaccount.com`
- Cloud Run: Default compute service account
- Both have `secretmanager.secretAccessor` role

✅ **Firestore Security**:
- Native mode in `asia-south1`
- TTL policies enabled (60d logs, 90d counters)
- Rules enforce tenant isolation via `customerId`

### IAM Limitations

⚠️ **Organization Policy Restriction**:
- Policy `iam.allowedPolicyMemberDomains` prevents public access
- Cannot set `allUsers` or `allAuthenticatedUsers` on Cloud Run
- **Workaround**: Use authenticated requests with identity tokens

**For Production**:
Consider requesting organization policy exemption or:
1. Use Cloud Run service-to-service invocation
2. Deploy API Gateway in front of Cloud Run
3. Use VPC Service Controls for internal-only access

---

## 📊 Current Configuration

### Rate Limits
```json
{
  "minute": 5,
  "day": 100,
  "month": 1000
}
```

### Pricing
- **Per Call**: ₹0.09 INR
- Tracked in `usage_counters` collection
- Aggregated by day/month/year

### Regions
- **Functions**: `asia-south1` (explicitly set)
- **Cloud Run**: `asia-south1`
- **Firestore**: `asia-south1` (native mode)

### Runtime
- **Functions**: Node.js 20, 256MB memory, 60s timeout
- **Cloud Run**: Node.js 20, containerized, auto-scaling
- **Web**: Next.js 14 static export

---

## ✅ Deployment Validation

### Build Status
All packages compile successfully:
- ✅ `shared` - TypeScript compiled
- ✅ `webhook` - TypeScript compiled (Cloud Run)
- ✅ `functions` - TypeScript compiled (Cloud Functions)
- ✅ `web` - Next.js static export

### Service Health Checks

| Check | Status | Details |
|-------|--------|---------|
| Functions API Health | ✅ Pass | `/health` endpoint responding |
| Cloud Run Webhook | ✅ Pass | Accepts authenticated POST requests |
| Firebase Hosting | ✅ Pass | Web dashboard accessible |
| Secret Manager Access | ✅ Pass | All secrets accessible to services |
| Firestore Connectivity | ✅ Pass | Read/write operations working |
| API Key Authentication | ✅ Pass | Validates and rate limits correctly |
| Webhook Secret Validation | ✅ Pass | Rejects invalid secrets |

### Recent Test Results

**Webhook Test** (November 20, 2025):
```
✅ Authenticated webhook call succeeded
✅ Request ID: test-req-123456789
✅ Status update logged to Firestore
✅ Response: 200 OK
```

**Rate Limit Test**:
```
✅ Calls 1-5: Successful (200 OK)
✅ Call 6: Rate limited (429 Too Many Requests)
✅ Error message: "RATE_LIMIT_MINUTE_EXCEEDED"
```

---

## 📋 Next Steps & Improvements

### High Priority

1. **⚠️ Migrate from `functions.config()` to `.env` files**
   - Deadline: March 2026
   - Cloud Runtime Config API being deprecated
   - Action: Follow [migration guide](https://firebase.google.com/docs/functions/config-env#migrate-to-dotenv)

2. **🔧 Resolve IAM Public Access Issue**
   - Current: Webhook requires authenticated identity tokens
   - Options:
     - Request org policy exemption for specific services
     - Implement API Gateway for public-facing endpoints
     - Use service-to-service authentication only

3. **📊 Enable Cloud Monitoring**
   ```bash
   # Set up alerting for errors and rate limits
   gcloud logging metrics create rate_limit_exceeded \
     --description="Rate limit 429 responses" \
     --log-filter='resource.type="cloud_function" AND httpRequest.status=429'
   ```

### Medium Priority

4. **🧪 CI/CD Pipeline**
   - GitHub Actions workflow created (`.github/workflows/deploy.yml`)
   - Requires secrets: `GCP_SA_KEY`, `RIVOCT_TEST_API_KEY`, Firebase config
   - Action: Configure and test automated deployments

5. **📝 API Documentation**
   - Create OpenAPI/Swagger spec
   - Host on Firebase Hosting
   - Include authentication examples

6. **🔄 Real MCM Provider Integration**
   - Replace mock provider with actual telco vendor SDK
   - Update webhook signature validation
   - Test with production credentials
   - Increase rate limits after testing

### Low Priority

7. **💾 Automated Backups**
   ```bash
   # Schedule daily Firestore exports
   gcloud scheduler jobs create http firestore-backup \
     --schedule="0 2 * * *" \
     --uri="https://firestore.googleapis.com/v1/projects/rivoct-sandbox/databases/(default):exportDocuments" \
     --message-body='{"outputUriPrefix":"gs://rivoct-backups/firestore"}'
   ```

8. **📈 Usage Dashboard Enhancements**
   - Add billing projections
   - Customer usage trends
   - Cost analysis reports

9. **🔐 API Key Rotation Policy**
   - Implement expiration dates
   - Auto-disable unused keys (90+ days)
   - Notification system for expiring keys

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue**: `429 Rate Limit Exceeded`  
**Solution**: Wait for rate limit window to reset (minute/day/month)

**Issue**: `401 Unauthorized` on webhook  
**Solution**: Include valid Bearer token: `gcloud auth print-identity-token`

**Issue**: `403 Missing or invalid API key`  
**Solution**: Verify API key in `x-api-key` header and check key is active

**Issue**: Firestore permission denied  
**Solution**: Check `customerId` matches authenticated user's tenant

### Logs & Debugging

**Cloud Functions Logs**:
```bash
firebase functions:log --project rivoct-sandbox --only api
```

**Cloud Run Logs**:
```bash
gcloud run logs read mcm-webhook --region=asia-south1 --limit=50
```

**Firestore Query Performance**:
- Check indexes: Firebase Console → Firestore → Indexes
- Monitor TTL deletions: Logs → filter `ttl_deletes`

### Useful Commands

```bash
# Check function status
firebase functions:list --project rivoct-sandbox

# View current config
firebase functions:config:get --project rivoct-sandbox

# Redeploy after changes
firebase deploy --only functions,hosting

# Cloud Run status
gcloud run services describe mcm-webhook --region=asia-south1

# Test health endpoint
curl https://asia-south1-rivoct-sandbox.cloudfunctions.net/api/health
```

---

## 📚 Documentation References

- **Architecture**: [`ARCHITECTURE.md`](./ARCHITECTURE.md)
- **Deployment Guide**: [`DEPLOYMENT.md`](./DEPLOYMENT.md)
- **Phase 2 Report**: [`PHASE2_COMPLETION_REPORT.md`](./PHASE2_COMPLETION_REPORT.md)
- **Smoke Tests**: [`tools/smoke-test.sh`](./tools/smoke-test.sh)
- **Postman Collection**: [`tools/postman_collection.json`](./tools/postman_collection.json)

---

## 🎯 Summary

✅ **All services deployed and operational**  
✅ **Authentication working correctly**  
✅ **Rate limiting enforced**  
✅ **Secrets properly configured**  
✅ **Firestore TTL policies active**  
⚠️ **IAM policy requires authenticated webhook access**  
⚠️ **functions.config() migration needed before March 2026**

**The Rivoct Voice OTP Sandbox is production-ready for internal testing and development. Address the high-priority items before promoting to full production with external customers.**

---

*Last Updated: November 20, 2025*  
*Next Review: December 2025*
