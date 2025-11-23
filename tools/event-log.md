# Event Log

This file records high-level events performed by automation and humans during the repository audit/cleanup.

- Format: ISO8601 timestamp | actor | action | details
- Do not remove prior entries — this is the canonical event trail for audits.

2025-11-23T00:00:00Z | system | monte-audit:created | Initial audit summary written to `tools/monte-audit/monte_audit_summary.json`
2025-11-23T01:28:30.871Z | system | purge | git-filter-repo removed archived-versions, archived-credentials, web/out, web/.next, node_modules, and .pack files
2025-11-23T01:39:15.749Z | system | dry-run | cloud dry-run listings saved under tools/cloud-dryrun for project rivoct-sandbox
