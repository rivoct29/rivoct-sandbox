Run the visual sweep (Playwright)

Prereqs:
- From the `web` folder, install deps and Playwright browsers: `pnpm install` then `pnpm run pw:install`.
- Start the dev server (in another terminal): `pnpm dev` (defaults to http://localhost:3000).

Quick run (from `web`):

```powershell
# from repository root
pnpm --filter web dev
# in a separate terminal (also from repo root)
node web/tools/visual-sweep/visual-sweep.js http://localhost:3000
```

Output:
- Screenshots saved under `web/test-results/visual-sweep/`.
- `summary.json` contains ranked variants and top 3 results.

Notes:
- The script varies CSS variables `--cta-saturation`, `--footer-bg-opacity`, `--footer-text-opacity` to explore pixel-level variants.
- For larger Monte Carlo runs or finer-grained pixel diffs, extend the script to use pixelmatch or Playwright's built-in compareSnapshot utilities.
