# Secrets History Scrub Plan (Draft)

Purpose
- Provide a safe, auditable plan to remove archived credentials and secrets from Git history.
- This plan is *destructive* (rewrites history) and must only be executed with explicit approval and coordination.

Preconditions (must be satisfied before scrub)
- All team members shall be notified; avoid concurrent pushes during history rewrite.
- Back up the repository: create local clone and upload a copy to secure storage.
- Confirm which secrets to remove (examples: `tools/archived-credentials/*`, `web/.env.local`, `secrets/*`, `functions/.env`, `api_key_*.json`).
- Rotate affected credentials in external systems (Cloud IAM, carriers, Firebase, Secret Manager) *before* or immediately after scrub.

Recommended approach (safe and recommended): git-filter-repo
1. Install `git-filter-repo` (Python package) on your machine.
2. Create a fresh clone of the remote repository (do this off the production repo):

```pwsh
git clone --mirror https://github.com/<org>/<repo>.git repo-mirror.git
cd repo-mirror.git
```

3. Run `git-filter-repo` to remove files and sensitive content (example):

```pwsh
# remove paths entirely
git filter-repo --path tools/archived-credentials --invert-paths
# or to remove specific files
git filter-repo --path web/.env.local --path secrets --invert-paths
```

4. Verify the repo locally and test the history.
5. Force-push the cleaned repo to the remote (this will rewrite remote history):

```pwsh
git push --force --all
git push --force --tags
```

6. Notify users to reclone the repository.

Alternative (BFG) — simpler, but less flexible
- BFG is easier for removing large files and secrets from history. Follow BFG usage docs.

Safety & Rollback
- Keep the original mirror for at least 30 days in secure storage.
- Rotate all secrets immediately after the scrub.
- Coordinate with CI/CD and update any service tokens that relied on scraped values.

Post-scrub actions
- Add/verify `.gitignore` entries to prevent re-adding secrets.
- Move active secrets to Secret Manager and use runtime injection.
- Add pre-commit hooks to block accidental commits of known secret patterns.

Questions for you
- Which exact paths should be scrubbed from history? (I can propose a conservative list to start.)
- Do you want me to prepare the `git-filter-repo` commands for your review, or execute them from this environment? (Execution will force-push and is irreversible.)

---
Generated: Nov 23, 2025
