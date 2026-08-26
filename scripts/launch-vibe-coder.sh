#!/usr/bin/env bash
# ==============================================================================
# INCANTO — GitHub Vibe Coding AI Suite Launcher
# Launches the standalone browser-based Vibe Coding AI environment.
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
PORT="${1:-8080}"

VIBE_FILE="${REPO_ROOT}/vibe-coder/index.html"

if [[ ! -f "$VIBE_FILE" ]]; then
  echo "❌ Error: File vibe-coder/index.html not found!"
  exit 1
fi

echo "============================================================"
echo "⚡ INCANTO GitHub Vibe Coding AI Suite Launcher"
echo "============================================================"
echo "📄 File location : ${VIBE_FILE}"
echo "🌐 Local URL     : http://localhost:${PORT}/vibe-coder/index.html"
echo "============================================================"

# Try opening directly in default browser if xdg-open / open / sensible-browser is available
if command -v xdg-open &>/dev/null; then
  xdg-open "http://localhost:${PORT}/vibe-coder/index.html" 2>/dev/null || true
elif command -v open &>/dev/null; then
  open "http://localhost:${PORT}/vibe-coder/index.html" 2>/dev/null || true
fi

echo "🚀 Starting HTTP server on port ${PORT}..."
echo "Press Ctrl+C to stop."

python3 -m http.server "${PORT}" --directory "${REPO_ROOT}"
