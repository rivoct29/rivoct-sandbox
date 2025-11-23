
```markdown
# Event Log

This file records high-level events performed by automation and humans during the repository audit/cleanup.

- Format: ISO8601 timestamp | actor | action | details
- Do not remove prior entries — this is the canonical event trail for audits.

2025-11-23T00:00:00Z | system | monte-audit:created | Initial audit summary written to `tools/monte-audit/monte_audit_summary.json`
2025-11-23T01:28:30.871Z | system | purge | git-filter-repo removed archived-versions, archived-credentials, web/out, web/.next, node_modules, and .pack files
2025-11-23T01:39:15.749Z | system | dry-run | cloud dry-run listings saved under tools/cloud-dryrun for project rivoct-sandbox
2025-11-23T01:39:31.911Z | system | dry-run | gcloud dry-run listings saved under tools/cloud-dryrun (gcloud-based)
2025-11-23T01:39:35.821Z | system | dry-run | listed secrets for project rivoct-sandbox and saved to tools/cloud-dryrun/secrets-list.txt
2025-11-23T01:40:05.685Z | system | delete | secret:CARRIER_ACCOUNT_SID deleted
2025-11-23T01:40:13.219Z | system | delete | secret:CARRIER_API_KEY deleted
2025-11-23T01:40:20.925Z | system | delete | secret:CARRIER_API_TOKEN deleted
2025-11-23T01:40:28.303Z | system | delete | secret:CARRIER_CLIENT_ID deleted
2025-11-23T01:40:35.376Z | system | delete | secret:CARRIER_FLOW deleted
2025-11-23T01:40:43.193Z | system | delete | secret:CARRIER_FROM_NUMBER deleted
2025-11-23T01:40:50.626Z | system | delete | secret:FIREBASE_ADMIN_SDK deleted
2025-11-23T01:40:57.867Z | system | delete | secret:INTERNAL_BACKEND_TOKEN deleted
2025-11-23T01:41:05.272Z | system | delete | secret:SECRET_API_SALT deleted
2025-11-23T01:41:12.339Z | system | delete | secret:SECRET_WEBHOOK deleted
2025-11-23T01:41:25.641Z | system | verify | cloud storage dry-run: no matching objects found for archive/build patterns across buckets; secrets deleted

2025-11-23T02:10:00Z | system | finalize_audit | final cloud-vs-local audit report and API audit summary added to `tools/monte-audit/` and event log finalized

```
