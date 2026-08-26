#!/usr/bin/env bash
set -euo pipefail

# INCANTO Automated GitHub Repository Creator
# Usage: ./scripts/create-repo.sh <repo-name> [public|private] [description] [org_name]

REPO_NAME="${1:-}"
VISIBILITY="${2:-public}"
DESCRIPTION="${3:-Incanto Portfolio Project Repository}"
ORG_NAME="${4:-}"

if [ -z "$REPO_NAME" ]; then
    echo "Usage: $0 <repo-name> [public|private] [description] [org_name]"
    echo "Example: $0 my-new-ai-tool public 'Cyberpunk AI Dashboard'"
    exit 1
fi

if ! command -v gh &> /dev/null; then
    echo "Error: GitHub CLI (gh) is required but not installed."
    exit 1
fi

FULL_NAME="$REPO_NAME"
if [ -n "$ORG_NAME" ]; then
    FULL_NAME="$ORG_NAME/$REPO_NAME"
fi

echo "🚀 Creating GitHub repository: $FULL_NAME ($VISIBILITY)..."

gh repo create "$FULL_NAME" \
    --"$VISIBILITY" \
    --description "$DESCRIPTION" || {
        echo "Fallback: creating repository $FULL_NAME..."
        gh repo create "$FULL_NAME" --"$VISIBILITY" -d "$DESCRIPTION"
    }

echo "✅ Repository '$FULL_NAME' created successfully!"
echo "🔗 URL: https://github.com/$FULL_NAME"
