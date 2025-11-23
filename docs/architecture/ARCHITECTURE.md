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
# ARCHITECTURE (moved to docs/architecture/ARCHITECTURE.md)

This file was moved into the canonical documentation tree: `docs/architecture/ARCHITECTURE.md`.

Please open the canonical document under `docs/architecture/` for the full monorepo architecture and deployment topology.
