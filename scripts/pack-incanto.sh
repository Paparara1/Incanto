#!/usr/bin/env bash
set -euo pipefail

# Script to create a clean ZIP archive of the Incanto portfolio bundle for platform escrow / distribution.

OUTPUT_ZIP="incanto.zip"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${REPO_ROOT}"

echo "Creating clean archive ${OUTPUT_ZIP} from ${REPO_ROOT}..."

# Remove existing zip if present
rm -f "${OUTPUT_ZIP}"

# Create zip file excluding git history, dependencies, build artifacts, and existing zips
zip -r "${OUTPUT_ZIP}" . \
    -x "*.git*" \
    -x "*node_modules*" \
    -x "*.terraform*" \
    -x "*.zip" \
    -x "*.DS_Store" \
    -x "*tmp*" \
    -x "*.log"

echo "Successfully created ${OUTPUT_ZIP}!"
echo "Archive size: $(du -h "${OUTPUT_ZIP}" | cut -f1)"
