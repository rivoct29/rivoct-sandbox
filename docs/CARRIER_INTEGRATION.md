# Carrier (Exotel) Integration — Workspace Audit & Workflow

This document summarizes the workspace audit, build/test/deploy workflow, and recommended next steps to integrate Exotel as the carrier for service activation.

## High-level repo layout
- `functions/` — Firebase Functions (codebase `api`, Node.js 20). Exposes an Express app in `src/index.ts` and uses Secret Manager in `src/config.ts`.
- `web/` — Next.js 14 frontend dashboard. Build output placed in `web/out` and served by Firebase Hosting.
- `shared/` — shared types/utilities used by packages.

## Build & Test workflow
- Root uses pnpm workspaces. Primary scripts in `package.json`:
  - `pnpm run build` — builds all packages (`pnpm -r run build`).
  - `pnpm test:ci` — CI-friendly test runner across workspaces.
  - `pnpm run deploy:sandbox` — builds and runs `firebase deploy --only hosting,functions`.

## Functions details
- `firebase.json` configures Functions source as `functions`, runtime `nodejs20`, and Hosting rewrites `/v1/**` to Cloud Run / Functions service `api` in `asia-south1`.
- `functions/src/config.ts` uses `@google-cloud/secret-manager` and provides cached getters for secrets (e.g. `getCarrierApiKey`, `getCarrierClientId`).
- `functions/src/index.ts` exposes `api`, `webhooks`, `consoleApi`, and `userOnboarding` handlers. We added `POST /v1/carrier/activate` which uses `apiKeyAuth` and `rateLimit`.

## Secrets & IAM
- The carrier scaffold expects these Secret Manager object names (placeholders):
  - `CARRIER_API_KEY`
  - `CARRIER_CLIENT_ID`

Ensure the Functions runtime/service account has `roles/secretmanager.secretAccessor` on those secrets. Typical service accounts to grant:
- `rivoct-sandbox@appspot.gserviceaccount.com` (default Functions runtime SA)
- `663012819768-compute@developer.gserviceaccount.com` (build service account seen in Cloud Build output)

Granting example (gcloud):
```powershell
gcloud secrets create CARRIER_API_KEY --replication-policy="automatic"
echo -n "<exotel-key>" | gcloud secrets versions add CARRIER_API_KEY --data-file=-

gcloud secrets create CARRIER_CLIENT_ID --replication-policy="automatic"
echo -n "<client-id>" | gcloud secrets versions add CARRIER_CLIENT_ID --data-file=-

gcloud projects add-iam-policy-binding rivoct-sandbox --member="serviceAccount:rivoct-sandbox@appspot.gserviceaccount.com" --role="roles/secretmanager.secretAccessor"
gcloud projects add-iam-policy-binding rivoct-sandbox --member="serviceAccount:663012819768-compute@developer.gserviceaccount.com" --role="roles/secretmanager.secretAccessor"
```

If you prefer using the Firebase CLI or console, you can also add secrets there and grant access via IAM.

## Exotel specifics (what I need from you)
- Which Exotel API do you want to call for "activation"? (Ex: voice call connect, create call flow, DID provisioning)
- Exotel credentials format: do you have `SID` + `TOKEN`, an API key, or OAuth creds? Typical Exotel APIs use Basic Auth with `SID:TOKEN` — confirm exact auth.
- Tenant-specific base URL: e.g. `https://api.exotel.com` or any tenant host.

## Next technical steps I can take
1. Provision secrets (create Secret Manager entries) with test credentials you provide, or I can create placeholders you replace later. (I can run the `gcloud` commands if you allow.)
2. Update `functions/src/providers/carrier.ts` to implement Exotel-specific request payload, auth (Basic or Bearer), and response mapping.
3. Add a CI-friendly test script in `functions/package.json` (`vitest --run`) and a smoke test script under `tools/` that hits `/v1/carrier/activate` (local emulator + test creds).
4. Deploy functions (or re-deploy both hosting + functions) and run smoke tests; tail logs to verify activation flow.

## Quick safety notes
- Avoid committing real credentials to the repo. Use Secret Manager and IAM to provide runtime access.
- Tests that call the real carrier should be gated (integration tests) and run only with test credentials or in CI with restricted access.

---
If you confirm Exotel details (auth type, endpoints) I will implement the Exotel-specific provider and finish wiring the activation flow, provision test secrets (if you approve), and run a smoke test against the emulator or deployed function.
