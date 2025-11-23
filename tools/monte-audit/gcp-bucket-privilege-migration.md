**GCP Bucket Least-Privilege Migration Plan**

Overview
- Buckets discovered (from `tools/monte-audit/audit-latest/copilot-audit-buckets.json`):
  - `gcf-sources-663012819768-us-central1` (cloud functions sources)
  - `gcf-v2-sources-663012819768-asia-south1` (cloud functions v2 sources)
  - `gcf-v2-uploads-663012819768.asia-south1.cloudfunctions.appspot.com` (function uploads)
  - `rivoct-sandbox_cloudbuild` (cloudbuild artifacts)

Findings
- Per-bucket IAM (`gcs-iam-*.json`) shows legacy roles (`roles/storage.legacyBucketOwner`, `roles/storage.legacyObjectOwner`, etc.) assigned via project-level members (`projectEditor`, `projectOwner`, `projectViewer`). This creates a broad blast radius.

Goal
- Replace project-scoped legacy roles with narrowly scoped service account roles. Where possible:
  - Use `roles/storage.objectAdmin` or `roles/storage.objectCreator` for services that need to write objects.
  - Use `roles/storage.objectViewer` for read-only consumers.
  - Avoid `storage.admin` and legacy bucket/object roles except for explicit admin accounts.

Proposed Service-Account Mapping
- `rivoct-sandbox_cloudbuild`:
  - Current likely user: Cloud Build service account `663012819768@cloudbuild.gserviceaccount.com` and project owners.
  - Proposed: grant `roles/storage.objectAdmin` to `663012819768@cloudbuild.gserviceaccount.com` on `gs://rivoct-sandbox_cloudbuild` only.

- `gcf-sources-663012819768-us-central1` and `gcf-v2-sources-663012819768-asia-south1`:
  - These buckets are managed by Cloud Functions service agents and contain function source artifacts.
  - Proposed: grant `roles/storage.objectViewer` to Cloud Functions service agent/service accounts that need read; grant `roles/storage.objectAdmin` to Cloud Functions deployment service accounts if they write artifacts.
  - Verify `goog-managed-by: cloudfunctions` label — coordinate with Cloud Functions deployment IAM (service-663012819768@gcf-admin-robot.iam.gserviceaccount.com) and limit to bucket-level roles.

- `gcf-v2-uploads-...`:
  - Likely used for uploads from web or functions. Identify which service account or runtime user uploads (e.g., function runtime SA or appspot SA).
  - Proposed: grant `roles/storage.objectCreator` to the specific runtime SA; grant `roles/storage.objectViewer` to any backend SA that needs to read.

Practical Migration Steps (recommended)
1. Inventory usage: For each bucket, run object access logs / check usage to map principals that read/write. Use `gs://` bucket-level logs and Cloud Audit Logs to identify service accounts and users.
2. Create or identify service accounts for each role (e.g., `sa-cloudbuild@...`, `sa-functions-deploy@...`). Prefer existing service accounts in `copilot-audit-iam.json` such as `663012819768@cloudbuild.gserviceaccount.com` and `rivoct-sandbox@appspot.gserviceaccount.com`.
3. Apply IAM narrowly:
   - `gcloud storage buckets add-iam-policy-binding gs://BUCKET --member=serviceAccount:SA --role=roles/storage.objectAdmin`
   - Remove the legacy `projectEditor`/`projectOwner` bindings from bucket-level policies where present.
4. Run tests: Deploy to staging, verify read/write operations, watch logs for access denials.
5. Rollforward: Once stable, remove project-level legacy roles from bucket policies and update documentation.

Rollback Plan
- If services fail after migration, restore previous bucket IAM bindings (record current policy before modifying) and iterate on narrower grants.

Notes & References
- Project IAM bindings in `tools/monte-audit/audit-latest/copilot-audit-iam.json` show service accounts with `roles/storage.admin` and `roles/secretmanager.secretAccessor`. Use those SAs where appropriate rather than broad user accounts.
- Example commands and audit queries are included in `tools/monte-audit/README_EVENTLOG.md` and in `tools/monte-audit/audit-latest/`.

If you want, I can:
- Option 1: Generate `gcloud` commands to apply the proposed bindings (dry-run), grouped per-bucket.
- Option 2: Create a ticket/PR that lists exact `gcloud` commands and a CI job to validate access.
