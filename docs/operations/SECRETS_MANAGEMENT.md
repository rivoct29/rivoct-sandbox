# Secrets Management

## Active Secrets

### WEBHOOK_SECRET
- **Status**: ✅ ACTIVE
- **Used By**: Webhook service (Cloud Run)
- **Purpose**: Validates incoming webhook delivery status calls
- **Location**: `webhook/src/index.ts` line 28-32

### FIREBASE_ADMIN_SDK
- **Status**: ✅ ACTIVE  
- **Used By**: Webhook service (Cloud Run)
- **Purpose**: Firebase Admin SDK credentials for Firestore access
- **Location**: Mounted as environment variable in Cloud Run

## Provisioned But Unused Secrets

### SECRET_API_SALT
- **Status**: ⚠️ PROVISIONED BUT UNUSED
- **Intended Purpose**: Global salt for API key hashing
- **Current Implementation**: Per-key salts stored in Firestore documents
- **Recommendation**: Remove from Secret Manager OR implement global salt layer

### SECRET_WEBHOOK (Functions)
- **Status**: ⚠️ PROVISIONED BUT UNUSED
- **Intended Purpose**: Sign outbound webhook calls to external services
- **Current Implementation**: Mock MCM provider writes directly to Firestore
- **Recommendation**: Keep for future real MCM provider integration

### INTERNAL_BACKEND_TOKEN
- **Status**: ⚠️ PROVISIONED BUT UNUSED
- **Intended Purpose**: Service-to-service authentication for admin endpoints
- **Current Implementation**: No admin endpoints requiring internal auth
- **Recommendation**: Keep for future internal tooling and scheduled jobs

## Recommendations

### Option 1: Remove Unused Secrets
```powershell
gcloud secrets delete SECRET_API_SALT --project=rivoct-sandbox
# Keep SECRET_WEBHOOK and INTERNAL_BACKEND_TOKEN for future use
```

### Option 2: Implement Unused Secrets

#### Implement SECRET_API_SALT
Add an additional hashing layer using global salt:
```typescript
const globalSalt = await secrets.getApiSalt();
const combinedSalt = `${perKeySalt}:${globalSalt}`;
const hash = await hashWithSalt(apiKey, combinedSalt);
```

#### Implement SECRET_WEBHOOK
Use for outbound webhook signatures when integrating real MCM provider:
```typescript
const webhookSecret = await secrets.getWebhookSecret();
const signature = hmac('sha256', webhookSecret).update(payload).digest('hex');
headers['x-webhook-signature'] = signature;
```

#### Implement INTERNAL_BACKEND_TOKEN
Protect admin endpoints:
```typescript
app.get('/admin/profit-analytics', async (req, res) => {
  const token = req.headers['x-internal-token'];
  const expectedToken = await secrets.getInternalToken();
  if (token !== expectedToken) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  // ... admin logic
});
```

## Current Decision

**Keep all secrets** for future implementation:
- SECRET_API_SALT: Reserved for enhanced security layer
- SECRET_WEBHOOK: Required for real MCM provider integration
- INTERNAL_BACKEND_TOKEN: Required for admin tooling

The lazy-loading pattern in `config.ts` ensures these secrets don't impact performance when unused.
