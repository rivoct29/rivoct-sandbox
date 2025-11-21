# Rivoct Sandbox: Voice OTP Engine

**Status:** Production Ready (Phase 4 Complete)
**Version:** 2.0.0 (Cyber-Industrial UI)

## Overview
Rivoct is a high-performance, low-cost Voice OTP engine designed for the Indian market. It leverages Firebase Functions v2 for serverless compute and Firestore for real-time state management.

## Key Features
- **₹0 Infra Cost:** Fully serverless architecture (Firebase Functions + Firestore).
- **₹1 Crore UI:** "Cyber-Industrial" design system for the dashboard.
- **Smart Routing:** Intelligent failover and provider selection.
- **Developer Friendly:** Comprehensive API documentation and integration guides.

## Project Structure
```
rivoct-sandbox/
├── functions/       # Backend API (Firebase Functions v2)
├── web/            # Frontend Dashboard (Next.js 14 + Tailwind)
├── shared/         # Shared Types & Utilities
├── tools/          # Admin Scripts & Smoke Tests
└── docs/           # Architecture & Integration Guides
```

## Quick Start

### Prerequisites
- Node.js 20.x or higher
- pnpm (install via `corepack enable`)
- Firebase CLI (`npm install -g firebase-tools`)

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment Variables (Web Dashboard)

For local development of the web dashboard:

```bash
cd web
cp .env.local.example .env.local
```

Edit `.env.local` and fill in your Firebase project credentials:
- Navigate to [Firebase Console](https://console.firebase.google.com/project/rivoct-sandbox/settings/general)
- Under "Your apps" → Select Web app
- Copy configuration values to `.env.local`

**Required Environment Variables:**
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### 3. Build All Packages
```bash
pnpm -r run build
```

### 4. Run Development Server (Optional)

**Web Dashboard:**
```bash
cd web
pnpm dev
```
Web app available at: http://localhost:3000

**Firebase Functions (Local Emulator):**
```bash
cd functions
pnpm serve
```
Functions available at: http://localhost:5001

### 5. Deploy to Production
```bash
firebase deploy
```

## Documentation
- [Architecture Overview](ARCHITECTURE.md)
- [Integration Guide](API_INTEGRATION_GUIDE.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Monitoring & Alerts](MONITORING.md)

## Recent Updates (v2.0)
- **UI Overhaul:** Complete redesign of the dashboard with "Cyber-Industrial" theme.
- **Consolidation:** Removed Cloud Run dependency; migrated webhooks to Functions.
- **Performance:** Optimized cold starts and database queries.

---
*Rivoct Engineering*
