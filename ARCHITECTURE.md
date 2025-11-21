# Rivoct Voice OTP Sandbox – Monorepo Architecture

## Folder Tree
```
rivoct-sandbox/
├── ARCHITECTURE.md
├── package.json               # Workspace root scripts + shared dev deps
├── pnpm-workspace.yaml        # Declares workspaces (functions, web, shared)
├── firebase.json              # Hosting + Functions rewrites
├── firestore.rules            # Security rules enforcing tenant isolation
├── firestore.indexes.json     # Composite indexes for log queries & usage reports
├── .firebaserc                # Firebase project alias mapping
├── shared/
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── types.ts           # Shared DTOs, Firestore shapes
│   │   └── validators.ts      # Multi-use validators (phone, tenant)
├── functions/
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── index.ts           # Firebase Functions entry
│   │   ├── types.ts           # Local Function-only types
│   │   ├── api/
│   │   │   ├── logs.ts        # GET /v1/logs handler
│   │   │   ├── usage.ts       # GET /v1/usage/summary handler
│   │   │   └── voiceOtp.ts    # POST /v1/voice-otp handler
│   │   ├── middleware/
│   │   │   ├── apiKeyAuth.ts  # x-api-key enforcement
│   │   │   └── rateLimit.ts   # Customer-scoped rate limiting (min/day/month)
│   │   ├── services/
│   │   │   ├── otpService.ts  # Orchestrates OTP voice call
│   │   │   ├── usageService.ts# Usage + billing counters
│   │   │   ├── logService.ts  # Firestore logging helpers
│   │   │   ├── customerService.ts
│   │   │   └── apiKeyService.ts
│   │   ├── mcm-mock/
│   │   │   └── provider.ts    # Always returns answered, duration 30-60s
│   │   ├── utils/
│   │   │   ├── firestore.ts   # Admin SDK init + helpers
│   │   │   ├── time.ts        # TTL helpers
│   │   │   └── crypto.ts      # Salt + SHA256 hashing helpers
│   │   └── config.ts          # Env variable parsing
│   └── .eslintrc.cjs
├── webhook/                   # Cloud Run Gen2 webhook microservice
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   ├── src/
│   │   ├── index.ts           # Express server w/ /webhooks/mcm/delivery-status
│   │   ├── services/
│   │   │   └── webhookService.ts
│   │   └── utils/firestore.ts
├── web/
│   ├── package.json
│   ├── next.config.mjs
│   ├── postcss.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── app/
│   │   ├── layout.tsx         # App Router layout w/ providers
│   │   ├── page.tsx           # Marketing landing
│   │   ├── login/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── logs/page.tsx
│   │   ├── settings/page.tsx
│   │   └── admin/customers/page.tsx
│   ├── components/
│   │   ├── Nav.tsx
│   │   ├── ChartCard.tsx
│   │   ├── LogsTable.tsx
│   │   ├── UsageSummary.tsx
│   │   ├── ApiKeyCard.tsx
│   │   └── CustomerForm.tsx
│   └── lib/
│       ├── firebaseClient.ts
│       ├── auth.tsx           # Global auth provider + hook
│       ├── crypto.ts          # Browser hashing helpers
│       └── hooks.ts           # Firestore-backed dashboard hooks
└── tools/
    └── postman_collection.json
```

  **Environment Anchors**
  - Firebase & GCP Project ID: `rivoct-sandbox`
  - Default region for all workloads: `asia-south1`
  - Firebase Hosting site: `rivoct-sandbox-site` mapped to `api.rivoct.com`
  - Cloud Run service: `mcm-webhook` (asia-south1)
  - Secret Manager entries: `SECRET_WEBHOOK`, `SECRET_API_SALT`, `FIREBASE_ADMIN_SDK`, `INTERNAL_BACKEND_TOKEN`

## Naming & Module Rules
- Firestore collections use `snake_case` top-level, documents keyed by customer-specific IDs.
- Functions use camelCase exports.
- Shared DTO names follow `PascalCase + DTO` (e.g., `VoiceOtpRequestDTO`).
- Environment variables consistently uppercase with `RIVOCT_` prefix when not Firebase-managed.

## Firestore Data Model
| Collection | Doc ID | Purpose | Key Fields |
|------------|--------|---------|------------|
| `customers` | customerId | Tenant metadata | `name`, `status`, `apiKeyIds[]`, `ratePlan` |
| `api_keys` | hashed key | Stores salt, customerId | `hash`, `salt`, `customerId`, `createdAt`, `revoked` |
| `voice_logs` | auto | Per-call log with TTL | `customerId`, `phone`, `status`, `requestId`, `duration`, `otpCode`, `pricing`, `expiresAt` (TTL 60d) |
| `usage_counters` | `${customerId}` | Aggregated usage windows | `minute`, `day`, `month`, `minuteCount`, `dayCount`, `monthCount`, `expiresAt` (90d) |
| `phone_history` | `${customerId}_${phone}` | Tracks per-number TTL | `customerId`, `phone`, `lastUsedAt`, `expiresAt` (30d) |
| `billing` | `${customerId}_${YYYYMM}` | Billing ledger | `totalCalls`, `totalCost`, `lineItems[]` |
| `webhook_events` | auto | Stores latest webhook events | `requestId`, `payload`, `status`, `receivedAt` |

### TTL Fields
- `voice_logs.expiresAt` → 60 days
- `phone_history.expiresAt` → 30 days
- `usage_counters.expiresAt` → 90 days

Indexes (defined in `firestore.indexes.json`):
1. `voice_logs` composite on `customerId, createdAt DESC` for `/logs` pagination.
2. `voice_logs` on `customerId, status, createdAt DESC` for filtering answered/failed.
3. `usage_counters` single-field on `customerId` for fast lookups.
4. `billing` composite on `customerId, cycle` for admin views.

## Environment Variables & Secret Manager Layout
Secrets managed via Google Secret Manager (GSM). All secrets are versioned and attached to services (Functions + Cloud Run).

| Secret Name | Description | Consumer |
|-------------|-------------|----------|
| `SECRET_WEBHOOK` | 32-byte secret validating `/webhooks/mcm/delivery-status` (`x-webhook-secret`) | Cloud Run `mcm-webhook` & Functions (forward verification) |
| `SECRET_API_SALT` | Salt used for `sha256(salt + apiKey)` hashing and rotation | Functions middleware & key services |
| `FIREBASE_ADMIN_SDK` | Service account JSON for project `rivoct-sandbox` | Functions + Cloud Run |
| `INTERNAL_BACKEND_TOKEN` | Token for intra-service calls (e.g., automated reconciliation) | Functions, Cloud Run, scheduled jobs |

Non-secret environment variables (set via `.env` for local, `firebase functions:config:set` for prod):
- `RIVOCT_REGION=asia-south1`
- `RIVOCT_RATE_LIMIT_MINUTE=5`
- `RIVOCT_RATE_LIMIT_DAY=100`
- `RIVOCT_RATE_LIMIT_MONTH=1000`
- `RIVOCT_PRICING_PER_CALL=0.09`
- `RIVOCT_WEBHOOK_URL=https://mcm-webhook-<hash>-asia-south1.run.app/webhooks/mcm/delivery-status`
- `NEXT_PUBLIC_FIREBASE_API_KEY=...` etc for Firebase web config
- `NEXT_PUBLIC_RATE_LIMIT_MINUTE=5`, `NEXT_PUBLIC_RATE_LIMIT_DAY=100`, `NEXT_PUBLIC_RATE_LIMIT_MONTH=1000`

## Deployment Topology
```
Client (api.rivoct.com)
  ↓ Firebase Hosting (Next.js 14 static export served from /web/out)
  ↓ /api/* → Cloud Functions Gen2 (Express on asia-south1)
  ↓ Business logic services (mock MCM, rate limiting, logging)
  ↓ Firestore (Native mode, multi-tenancy enforced)
  ↓ Billing results stored and exposed to dashboard

Webhook Provider (Mock MCM) → Cloud Run service /webhooks/mcm/delivery-status → Firestore updates
```

Logging & Monitoring:
- Cloud Logging sinks per service
- Firestore audit logs enabled
- Billing simulation aggregated nightly via scheduled function (future-ready)

Free-tier alignment:
- Single region `asia-south1`
- Mock provider avoids paid telephony
- Rate limits cap resource usage

## Hosting & Routing
- Custom domain `api.rivoct.com` is bound to Firebase Hosting site `rivoct-sandbox-site` and acts as the single ingress.
- Firebase Hosting rewrites `/api/**` → `functions:api` (HTTPS function in `asia-south1`).
- `/webhooks/**` proxies to Cloud Run service `mcm-webhook` (`asia-south1`) with `SECRET_WEBHOOK` validation.
- Default hosting serves the exported Next.js app.

## India-only OTP Enforcement
- Shared validator `isValidIndiaPhone(phone: string): boolean` ensures `+91` followed by 10 digits.
- Middleware rejects non-compliant numbers before hitting services.

## Multi-tenant Isolation
- Every Firestore query filtered by `customerId` from API key context.
- Security rules enforce `request.auth.token.customerId == resource.data.customerId` for web app requests.
- Admin claims determine access to `/admin/*` routes.

## Rate Limiting Strategy
- Counters stored in `usage_counters/{customerId}` document containing nested subfields for rolling minute/day/month windows.
- Middleware increments counters with transaction; rejects when threshold exceeded.

## Secret Manager Blueprint
1. `gcloud secrets create SECRET_WEBHOOK --replication-policy="automatic"`
2. `gcloud secrets versions add SECRET_WEBHOOK --data-file=<(openssl rand -hex 32)`
3. `gcloud secrets create SECRET_API_SALT --replication-policy="automatic"` ➜ `gcloud secrets versions add SECRET_API_SALT --data-file=<(openssl rand -hex 32)`
4. `gcloud secrets create FIREBASE_ADMIN_SDK --replication-policy="automatic"` ➜ upload the service-account JSON (`gcloud secrets versions add FIREBASE_ADMIN_SDK --data-file=svc.json`).
5. `gcloud secrets create INTERNAL_BACKEND_TOKEN --replication-policy="automatic"` ➜ `gcloud secrets versions add INTERNAL_BACKEND_TOKEN --data-file=<(openssl rand -hex 32)`.
6. Grant `roles/secretmanager.secretAccessor` to Functions + Cloud Run service accounts.

## Cloud Functions Grouping
- Single Express app exported as `exports.api = onRequest({region: RIVOCT_REGION, cors: true}, app)`
- Routers under `/v1` mount to functions.
- Additional scheduled functions (optional) can live in same project.

## Cloud Run Service
- `webhook` workspace builds Docker image with Node 20 runtime.
- Exposes `/webhooks/mcm/delivery-status` verifying `x-webhook-secret` header.

## Hosting Rewrites
- firebase.json rewrites `/api/**` to functions API.
- Asset headers add caching for static content.

This document guides all agents to keep the monorepo consistent and production-ready.
