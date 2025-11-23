# Monte Carlo Audit Event Log — Summary

This file summarizes the Monte Carlo Tree Branch audit findings and the set of patterns we're about to permanently purge.

Summary of findings (from `monte_audit_summary.json`):

- Files under `tools/archived-credentials/` contain sensitive or stale welcome emails.
- Many `web/out/` and `.next` static export files are present (build artifacts).
- There are archived duplicate folders under `tools/archived-versions/duplicates/auto-20251123-010558/` that contain node_modules, build artifacts, and large pack files.

Planned permanent purge patterns:

- `tools/archived-versions/` (entire folder)
- `tools/archived-credentials/` (entire folder)
- `web/out/`, `web/.next/`, `web/.next_cache/`
- `**/node_modules/**` (any `node_modules` unintentionally committed)
- `**/*.pack` (large pack files)

After purge, tools created:

- `tools/event-log.md` — canonical event log (append-only)
- `tools/log-event.js` — helper to append events
