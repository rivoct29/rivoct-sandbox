Branch: `audit/dep-upgrades/next-14.2.21`

Summary:
- Bumps `next` from `14.2.5` to `14.2.21` to address multiple security advisories (cache poisoning, DoS via server actions, image optimization DoS). This is a minimal patch-level bump within Next.js 14.x.

Notes for reviewer:
- After merging, run `pnpm install` (or CI will run) to update `pnpm-lock.yaml`.
- Run full test suite and validate server-side rendering routes and image config.
- If any app-router vs pages-router compatibility issues occur, consider follow-up migration to a later major release with testing.

Automated changes: `web/package.json` version bump only. Lockfile changes are intentionally left for CI to produce.
