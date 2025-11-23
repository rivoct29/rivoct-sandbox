#!/usr/bin/env bash
set -euo pipefail
DRY_RUN=0
if [ "${1:-}" = "--dry-run" ]; then
  DRY_RUN=1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/docs"

declare -A MOVES=(
  ["ARCHITECTURE.md"]="$DEST/architecture/ARCHITECTURE.md"
  ["DEPLOYMENT.md"]="$DEST/deployment/DEPLOYMENT.md"
  ["DEPLOYMENT_STATUS.md"]="$DEST/deployment/DEPLOYMENT_STATUS.md"
  ["FRONTEND_AUDIT_FIXES.md"]="$DEST/reports/FRONTEND_AUDIT_FIXES.md"
  ["QUICK_START_GUIDE.md"]="$DEST/onboarding/QUICK_START_GUIDE.md"
  ["VOICE_OTP_API_REFERENCE.md"]="$DEST/api/VOICE_OTP_API_REFERENCE.md"
  ["API_INTEGRATION_GUIDE.md"]="$DEST/api/API_INTEGRATION_GUIDE.md"
  ["README.md"]="$ROOT/README.md"
)

echo "Reorganizing docs → target: $DEST (dry-run=$DRY_RUN)"
mkdir -p "$DEST"/{api,architecture,deployment,onboarding,operations,reports,workflows}

for SRC in "${!MOVES[@]}"; do
  SRC_PATH="$ROOT/$SRC"
  DST_PATH="${MOVES[$SRC]}"
  if [ -f "$SRC_PATH" ]; then
    echo "Found: $SRC_PATH -> $DST_PATH"
    if [ "$DRY_RUN" -eq 1 ]; then
      echo "[DRYRUN] mkdir -p \"$(dirname "$DST_PATH")\" && mv -n \"$SRC_PATH\" \"$DST_PATH\""
    else
      mkdir -p "$(dirname "$DST_PATH")"
      if [ -f "$DST_PATH" ]; then
        ts=$(date +%Y%m%d%H%M%S)
        archive_dir="$ROOT/tools/archived-versions/$(basename "$(dirname "$DST_PATH")")"
        mkdir -p "$archive_dir"
        mv -f "$DST_PATH" "$archive_dir/$(basename "$DST_PATH").$ts"
      fi
      mv -f "$SRC_PATH" "$DST_PATH"
      echo "Moved -> $DST_PATH"
    fi
  else
    echo "Skip: $SRC_PATH (not present)"
  fi
done

echo "Reorg complete."
