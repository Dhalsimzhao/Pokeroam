#!/bin/bash
# copilot-prepare.sh — Manage task document lifecycle
# Usage:
#   ./copilot-prepare.sh           # Clear all task documents for fresh start
#   ./copilot-prepare.sh --backup  # Archive current docs to timestamped backup
#   ./copilot-prepare.sh --earliest # Print path to earliest unprocessed backup

set -e

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TASK_DIR="$REPO_ROOT/.github/TaskLogs"
LEARNING_DIR="$REPO_ROOT/.github/Learning"

TASK_FILES=(
  "Copilot_Scrum.md"
  "Copilot_Task.md"
  "Copilot_Planning.md"
  "Copilot_Execution.md"
  "Copilot_Execution_Finding.md"
  "Copilot_KB.md"
  "Copilot_Investigate.md"
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
    for f in "Copilot_Task.md" "Copilot_Planning.md" "Copilot_Execution.md" "Copilot_Execution_Finding.md"; do
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
    echo "# !!!SCRUM!!!" > "$TASK_DIR/Copilot_Scrum.md"
    echo "# !!!TASK!!!" > "$TASK_DIR/Copilot_Task.md"
    echo "# !!!PLANNING!!!" > "$TASK_DIR/Copilot_Planning.md"
    echo "# !!!EXECUTION!!!" > "$TASK_DIR/Copilot_Execution.md"
    echo "# !!!KNOWLEDGE BASE!!!" > "$TASK_DIR/Copilot_KB.md"
    echo "# !!!INVESTIGATE!!!" > "$TASK_DIR/Copilot_Investigate.md"

    echo "Task documents cleared and initialized."
    ;;

  *)
    echo "Usage: copilot-prepare.sh [--backup|--earliest]"
    exit 1
    ;;
esac
