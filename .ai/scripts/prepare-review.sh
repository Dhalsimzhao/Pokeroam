#!/bin/bash
# prepare-review.sh — Manage review board files between rounds
# Renames Writing files to Finished, deleting old Finished files first.

set -e

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TASK_DIR="$REPO_ROOT/.ai/TaskLogs"

# Delete old Finished files
for f in "$TASK_DIR"/Review_Finished_*.md; do
  if [ -f "$f" ]; then
    rm "$f"
    echo "Deleted: $(basename "$f")"
  fi
done

# Rename Writing files to Finished
FOUND=0
for f in "$TASK_DIR"/Review_Writing_*.md; do
  if [ -f "$f" ]; then
    NEW_NAME="${f/Writing/Finished}"
    mv "$f" "$NEW_NAME"
    echo "Renamed: $(basename "$f") -> $(basename "$NEW_NAME")"
    FOUND=1
  fi
done

if [ "$FOUND" -eq 0 ]; then
  echo "No review files to process."
fi
