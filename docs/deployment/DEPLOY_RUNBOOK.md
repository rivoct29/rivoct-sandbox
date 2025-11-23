# Deploy Runbook

This runbook explains how to perform a non-interactive CI-style Firebase deploy using a Google service account key, and how to re-authenticate interactively if needed.

Prerequisites
- `gcloud` (optional, for creating service accounts) or use the Google Cloud Console
- `firebase-tools` CLI installed
- `pnpm` and project dependencies installed

Recommended non-interactive flow (CI / automation)

1. Create a service account in the GCP project (via Console or `gcloud`).
   - Recommended roles to grant:
     - `roles/firebase.admin` (Firebase Admin)
     - `roles/iam.serviceAccountUser` (allow using service accounts)
     - If you prefer broader permissions, a project-level `Editor` or `Owner` may work, but avoid granting more than necessary.

   Example (gcloud):

   ```powershell
   gcloud iam service-accounts create rivoct-deployer --display-name="Rivoct Deployer"
   gcloud projects add-iam-policy-binding <PROJECT_ID> --member="serviceAccount:rivoct-deployer@<PROJECT_ID>.iam.gserviceaccount.com" --role="roles/firebase.admin"
   gcloud projects add-iam-policy-binding <PROJECT_ID> --member="serviceAccount:rivoct-deployer@<PROJECT_ID>.iam.gserviceaccount.com" --role="roles/iam.serviceAccountUser"
   gcloud iam service-accounts keys create C:\secure-path\rivoct-deployer-key.json --iam-account=rivoct-deployer@<PROJECT_ID>.iam.gserviceaccount.com
   ```

2. Store the downloaded JSON key securely (CI secret store or protected path on the deploy runner). Never commit it to git.

3. Set the environment variable `GOOGLE_APPLICATION_CREDENTIALS` to the key path before running `pnpm run deploy`.

   PowerShell example (one-liner):
   ```powershell
   $env:GOOGLE_APPLICATION_CREDENTIALS = 'C:\secure-path\rivoct-deployer-key.json'
   Set-Location 'D:\Rivoct\rivoct-sandbox'
   pnpm install --frozen-lockfile
   pnpm -r build
   pnpm run deploy
   ```

Interactive re-auth (developer machine)

If you prefer interactive developer re-authentication, run:

```powershell
firebase login --reauth
Set-Location 'D:\Rivoct\rivoct-sandbox'
pnpm install --frozen-lockfile
pnpm -r build
pnpm run deploy
```

Notes
- The previously used `FIREBASE_TOKEN` approach is deprecated by `firebase-tools`. Use a service account key (`GOOGLE_APPLICATION_CREDENTIALS`) for CI.
- If you see HTTP 401 errors during deploy, confirm the service account has the necessary roles and that `GOOGLE_APPLICATION_CREDENTIALS` points to the correct JSON file.
- For additional details see: https://cloud.google.com/docs/authentication/getting-started

Troubleshooting
- 401 / invalid authentication: check `gcloud auth` and the service account key path.
- Permission denied errors: ensure the service account has `firebase.admin` role and the `iam.serviceAccountUser` role.
- If hosting target resolution fails, ensure `firebase.json` contains the correct `hosting.site` value or `.firebaserc` targets are configured.
