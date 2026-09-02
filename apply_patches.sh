#!/bin/bash
# apply_patches.sh - Apply Boussole NSOE patches in order

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "=== BOUSSOLE NSOE Patch Applicator ==="
echo "Project: $PROJECT_DIR"

cd "$PROJECT_DIR"

# Ensure we're on a clean state
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  Unstaged changes detected. Stashing..."
    git stash push -m "stash before patches"
fi

# Check if patches exist
PATCHES_DIR="$SCRIPT_DIR/patches"
if [ ! -d "$PATCHES_DIR" ]; then
    PATCHES_DIR="$PROJECT_DIR"
fi

# Apply patches in order
for patch in \
    "0001-feat-fix-methodology-improvements-critical-bug-fixes.patch" \
    "0002-fix-stats-remove-all-demo-statistics-integrate-metho.patch" \
    "0003-feat-methodology-BOUSSOLE-NSOE-the-4-training-stages.patch" \
    "0004-feat-methodology-BOUSSOLE-NSOE-rank-wind-map-in-30s-.patch"; do
    
    if [ -f "$PATCHES_DIR/$patch" ]; then
        echo "Applying: $patch"
        git apply "$PATCHES_DIR/$patch" || {
            echo "❌ Patch failed: $patch"
            echo "Attempting fallback to git am..."
            git am "$PATCHES_DIR/$patch" || {
                echo "❌ Patch application failed. Manual intervention required."
                exit 1
            }
        }
        echo "✓ Applied: $patch"
    else
        echo "⚠️  Patch not found: $patch"
    fi
done

echo ""
echo "=== All patches applied successfully ==="
echo "Run: ./verify.sh to validate"