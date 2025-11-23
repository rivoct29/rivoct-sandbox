#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ARCHIVE_DIR="$ROOT/tools/archived-versions/duplicates"
DRY_RUN=0
if [ "${1:-}" = "--dry-run" ]; then DRY_RUN=1; fi

mkdir -p "$ARCHIVE_DIR"

# Find files, group by basename
find "$ROOT" -path "$ROOT/node_modules" -prune -o -type f -print0 |
  while IFS= read -r -d '' file; do
    base="$(basename "$file")"
    printf "%s\0%s\0" "$base" "$file"
  done |
  awk -v RS='\0' 'NR%2==1{b=$0;next}{print b"\t"$0}' |
  sort |
  awk -F"\t" '{arr[$1]=arr[$1] "\n" $2} END{for (k in arr) if (split(arr[k], a, "\n")>2) print k arr[k]}' |
  while IFS= read -r line; do
    basename="$(echo "$line" | awk '{print $1}')"
    paths=$(echo "$line" | cut -d' ' -f2-)
    set -f
    IFS=$'\n'
    files=($paths)
    set +f
    if [ "${#files[@]}" -le 1 ]; then
      continue
    fi
    IFS=$'\n' sorted=($(for f in "${files[@]}"; do stat -c "%Y %n" "$f"; done | sort -rn | awk '{$1=""; sub(/^ /,""); print }'))
    keep="${sorted[0]}"
    echo "Duplicate basename: $basename → keeping: $keep"
    for ((i=1;i<${#sorted[@]};i++)); do
      f="${sorted[i]}"
      ts=$(date +%Y%m%d%H%M%S)
      dst="$ARCHIVE_DIR/${basename}.$ts.$i"
      if [ "$DRY_RUN" -eq 1 ]; then
        echo "[DRYRUN] mv \"$f\" \"$dst\""
      else
        mkdir -p "$(dirname "$dst")"
        mv -f "$f" "$dst"
        echo "Archived: $f -> $dst"
      fi
    done
  done

echo "Deduplication complete (older copies moved to $ARCHIVE_DIR)."
