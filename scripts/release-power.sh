#!/bin/bash

# Script to create a release archive of oicp-power
# Excludes node_modules and other build artifacts

set -e

POWER_DIR="oicp-power"
VERSION=$(node -p "require('./${POWER_DIR}/power.json').version")
OUTPUT_FILE="oicp-power-${VERSION}.tar.gz"

echo "Creating release archive for OICP Power v${VERSION}..."

# Create archive excluding node_modules and other artifacts
tar -czf "${OUTPUT_FILE}" \
  --exclude="node_modules" \
  --exclude="dist" \
  --exclude=".DS_Store" \
  --exclude="*.log" \
  --exclude=".git" \
  "${POWER_DIR}"

echo "✓ Release archive created: ${OUTPUT_FILE}"
echo "  Size: $(du -h "${OUTPUT_FILE}" | cut -f1)"
