# Setting up CI deploy (GitHub Actions)

This document explains how to configure GitHub Actions to perform a deploy using a service account key.

1. Create a service account in GCP and grant it `roles/firebase.admin` and `roles/iam.serviceAccountUser`.
2. Download the JSON key file and base64-encode it.

   PowerShell (Windows):

   ```powershell
   $b = [Convert]::ToBase64String([IO.File]::ReadAllBytes('C:\secure-path\rivoct-deployer-key.json'))
   Write-Host $b
   ```

3. In your GitHub repo, go to Settings → Secrets → Actions and create a secret named `GOOGLE_APPLICATION_CREDENTIALS_BASE64` with the base64 value.

4. Trigger the workflow manually: Actions → CI Deploy (manual) → Run workflow → choose `environment` (sandbox|production) and click `Run workflow`.

Notes
- The workflow writes the decoded JSON to the runner workspace only for the duration of the job.
- Do not store the raw JSON in the repo. Use GitHub Secrets only.
