# Deployment & Operations Guide

## 1. Prerequisites
- Firebase CLI ≥ 13 (`npm install -g firebase-tools`).
- gcloud CLI authenticated against the target project (`gcloud auth login`).
- Node.js 20 + pnpm 8 (`corepack enable`).
- Firestore in *Native* mode inside region `asia-south1`.

## 2. Environment Variables
### Functions (`functions/.runtimeconfig.json` or `firebase functions:config:set`)
| Key | Sample | Purpose |
| --- | --- | --- |
| `rivoct.region` | `asia-south1` | Deployment region for HTTPS function |
| `rivoct.rate_limit.minute` | `5` | Per-minute call cap |
| `rivoct.rate_limit.day` | `100` | Per-day call cap |
| `rivoct.rate_limit.month` | `1000` | Per-month call cap |
| `rivoct.pricing_per_call` | `0.09` | Billing rate in INR |
| `rivoct.webhook_url` | `https://mcm-webhook-<hash>-asia-south1.run.app/webhooks/mcm/delivery-status` | Internal webhook target |

Set via:
```bash
firebase functions:config:set \
  rivoct.region="asia-south1" \
  rivoct.rate_limit.minute="5" \
  rivoct.rate_limit.day="100" \
  rivoct.rate_limit.month="1000" \
  rivoct.pricing_per_call="0.09" \
  rivoct.webhook_url="https://mcm-webhook-<hash>-asia-south1.run.app/webhooks/mcm/delivery-status"
```

### Web Frontend (`web/.env.local`)
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_RATE_LIMIT_MINUTE=5
NEXT_PUBLIC_RATE_LIMIT_DAY=100
NEXT_PUBLIC_RATE_LIMIT_MONTH=1000
```

## 3. Secret Manager
| Secret | Value | Attached Services |
| --- | --- | --- |
| `SECRET_WEBHOOK` | Random 32-byte string for validating `x-webhook-secret` | Cloud Run `mcm-webhook`, Functions (forward verify) |
| `SECRET_API_SALT` | Random 32-byte salt for hashing stored API keys | Functions |
| `FIREBASE_ADMIN_SDK` | Service-account JSON for `rivoct-sandbox` | Functions + Cloud Run |
| `INTERNAL_BACKEND_TOKEN` | Token for intra-service auth flows | Functions + Cloud Run |

Provision:
```bash
gcloud secrets create SECRET_WEBHOOK --replication-policy="automatic"
openssl rand -hex 32 | gcloud secrets versions add SECRET_WEBHOOK --data-file=-

gcloud secrets create SECRET_API_SALT --replication-policy="automatic"
openssl rand -hex 32 | gcloud secrets versions add SECRET_API_SALT --data-file=-

gcloud secrets create FIREBASE_ADMIN_SDK --replication-policy="automatic"
gcloud secrets versions add FIREBASE_ADMIN_SDK --data-file=service-account.json

gcloud secrets create INTERNAL_BACKEND_TOKEN --replication-policy="automatic"
openssl rand -hex 32 | gcloud secrets versions add INTERNAL_BACKEND_TOKEN --data-file=-
```
Grant `secretmanager.secretAccessor` to the Functions and Cloud Run service accounts.

## 4. Firestore Setup
1. Enable TTL on `voice_logs.expiresAt`, `usage_counters.expiresAt`, `phone_history.expiresAt` via Firebase console ➜ Firestore ➜ TTL.
2. Deploy security rules and indexes after first `firebase deploy` (`firebase deploy --only firestore:rules,firestore:indexes`).
3. Seed collections:
   - `customers/{customerId}` with `{ id, name, status: "active", billingPlan: "sandbox", apiKeyIds: [] }`.
   - `users/{uid}` mapping Firebase Auth users to `{ customerId, roles: ["admin"] }`.

## 5. Build & Deploy Pipeline
```bash
pnpm install
pnpm --filter @rivoct/shared run build
pnpm --filter @rivoct/functions run build
pnpm --filter @rivoct/web run build   # emits static site to web/out
firebase deploy --only hosting,functions
```

### Cloud Run (Decommissioned)
*Note: The webhook service has been consolidated into Firebase Functions (`functions/lib/api/webhooks.js`). No separate Cloud Run deployment is required.*

## 6. DNS & Hosting
- Point the mandated hostname `api.rivoct.com` to Firebase Hosting site `rivoct-sandbox-site` by adding the **A/AAAA** records (or CNAME to `ghs.googlehosted.com`) provided by Firebase.
- Keep `api.rivoct.com` as the single ingress so that `/api/**` rewrites into Functions and `/webhooks/**` chains into Functions without extra proxies.
- SSL certificates are automatically managed by Firebase once DNS verification completes.

## 7. Real MCM Provider Swap Guide
1. Implement a new provider inside `functions/src/services` (e.g., `realMcmProvider.ts`) that uses the telco vendor SDK.
2. Inject it via `OtpService` (feature flag on `process.env.RIVOCT_PROVIDER=mock|real`).
3. Ensure the external call returns `{ status, durationSeconds, requestId }` so downstream logging remains unchanged.
4. Update Cloud Run webhook to validate the vendor signature instead of `x-webhook-secret` and to map payload fields to the canonical schema.
5. Increase rate limits and pricing via config once production-ready.

## 8. Operations Checklist
- **Monitoring:** enable Cloud Logging metrics for `functions.googleapis.com/cloud-functions` and `run.googleapis.com/request_count`.
- **Backups:** export `voice_logs`, `billing`, and `usage_counters` daily using Cloud Scheduler + `gcloud firestore export`.
- **Access Control:** lock down Firestore with custom claims (`roles: ["admin"]`) for console admins.
- **Key Rotation:** API keys are salted and hashed per record; revocation is a metadata update in `api_keys/{id}`.

## 9. Smoke Test Script
1. `firebase emulators:start --only functions` (optional) or deploy to staging.
2. Add Firebase Auth user + `users/{uid}` profile referencing a test `customerId`.
3. Generate API key via dashboard Settings ➜ copy once.
4. `curl -X POST https://api.rivoct.com/api/v1/voice-otp -H "x-api-key: <key>" -d '{"phone":"+919876543210","otpCode":"123456"}'`.
5. Visit dashboard ➜ verify usage counters increment within 2 seconds.
6. Trigger webhook manually via Postman collection ➜ ensure log status updates.
7. Hit OTP endpoint 6 times rapidly ➜ final request should return `429 RATE_LIMIT_MINUTE_EXCEEDED`.

Keep this doc with the repo to unblock anyone deploying or operating the sandbox.
