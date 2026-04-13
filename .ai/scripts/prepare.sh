#!/bin/bash
# prepare.sh — Manage task document lifecycle
# Usage:
#   ./prepare.sh           # Clear all task documents for fresh start
#   ./prepare.sh --backup  # Archive current docs to timestamped backup
#   ./prepare.sh --earliest # Print path to earliest unprocessed backup

set -e

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TASK_DIR="$REPO_ROOT/.ai/TaskLogs"
LEARNING_DIR="$REPO_ROOT/.ai/Learning"

TASK_FILES=(
  "Scrum.md"
  "Task.md"
  "Planning.md"
  "Execution.md"
  "Execution_Finding.md"
  "KB.md"
  "Investigate.md"
)

# Ensure TaskLogs directory exists
mkdir -p "$TASK_DIR"

case "${1:-}" in
  --backup)
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_DIR="$LEARNING_DIR/backup_$TIMESTAMP"
    mkdir -p "$BACKUP_DIR"
    echo "$BACKUP_DIR"

    FOUND=0
    for f in "Task.md" "Planning.md" "Execution.md" "Execution_Finding.md"; do
      if [ -f "$TASK_DIR/$f" ]; then
        cp "$TASK_DIR/$f" "$BACKUP_DIR/$f"
        rm "$TASK_DIR/$f"
        FOUND=1
      fi
    done

    if [ "$FOUND" -eq 0 ]; then
      rmdir "$BACKUP_DIR" 2>/dev/null || true
      echo "No task documents to backup."
      exit 1
    fi

    echo "Backed up to: $BACKUP_DIR"
    ;;

  --earliest)
    EARLIEST=""
    for dir in "$LEARNING_DIR"/backup_*/; do
      if [ -d "$dir" ]; then
        if [ -z "$EARLIEST" ] || [[ "$dir" < "$EARLIEST" ]]; then
          EARLIEST="$dir"
        fi
      fi
    done

    if [ -z "$EARLIEST" ]; then
      echo "No backup folders found."
      exit 1
    fi

    # Remove trailing slash
    echo "${EARLIEST%/}"
    ;;

  "")
    # Clear all task documents — fresh start
    for f in "${TASK_FILES[@]}"; do
      if [ -f "$TASK_DIR/$f" ]; then
        rm "$TASK_DIR/$f"
      fi
    done

    # Create empty working files
    echo "# !!!SCRUM!!!" > "$TASK_DIR/Scrum.md"
    echo "# !!!TASK!!!" > "$TASK_DIR/Task.md"
    echo "# !!!PLANNING!!!" > "$TASK_DIR/Planning.md"
    echo "# !!!EXECUTION!!!" > "$TASK_DIR/Execution.md"
    echo "# !!!KNOWLEDGE BASE!!!" > "$TASK_DIR/KB.md"
    echo "# !!!INVESTIGATE!!!" > "$TASK_DIR/Investigate.md"

    echo "Task documents cleared and initialized."
    ;;

  *)
    echo "Usage: prepare.sh [--backup|--earliest]"
    exit 1
    ;;
esac
