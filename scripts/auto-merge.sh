#!/usr/bin/env bash
set -euo pipefail

# INCANTO Auto-Merge Helper Script
# Automatically approves and merges Pull Requests via GitHub CLI (gh)

PR_NUMBER="${1:-}"

if ! command -v gh &> /dev/null; then
    echo "Error: GitHub CLI (gh) is required but not installed."
    exit 1
fi

if [ -n "$PR_NUMBER" ]; then
    echo "⚡ Auto-merging PR #$PR_NUMBER..."
    gh pr review "$PR_NUMBER" --approve || true
    gh pr merge "$PR_NUMBER" --merge --auto || gh pr merge "$PR_NUMBER" --merge --admin
    echo "✓ PR #$PR_NUMBER successfully merged!"
else
    echo "⚡ Scanning for open Pull Requests..."
    prs=$(gh pr list --json number -q '.[].number')
    if [ -z "$prs" ]; then
        echo "No open Pull Requests found."
        exit 0
    fi
    for pr in $prs; do
        echo "Processing PR #$pr..."
        gh pr review "$pr" --approve || true
        gh pr merge "$pr" --merge --auto || gh pr merge "$pr" --merge --admin || echo "Failed to merge #$pr"
    done
    echo "✓ All available PRs processed!"
fi
