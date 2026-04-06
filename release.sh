#!/bin/bash

# Arado v3 Release Script
# This script packages the extension for submission to extensions.gnome.org

UUID="arado@federico.duppa"
VERSION="v$(jq -r '.version' metadata.json)"
ZIP_NAME="${UUID}.${VERSION}.zip"

# Check if README.md is in sync
README_VERSION=$(grep -oE "Arado v[0-9]+" README.md | head -n 1 | sed 's/Arado //')
if [ "$README_VERSION" != "$VERSION" ]; then
    echo "Warning: README.md version ($README_VERSION) is not in sync with metadata.json ($VERSION)."
fi

echo "Packaging Arado ${VERSION}..."

# 1. Compile schemas to ensure they are valid (optional but good practice)
if command -v glib-compile-schemas >/dev/null 2>&1; then
    echo "Validating schemas..."
    glib-compile-schemas schemas/
else
    echo "Warning: glib-compile-schemas not found. Skipping schema validation."
fi

# 2. Create the ZIP file
# We only include the essential files required by extensions.gnome.org
echo "Creating ${ZIP_NAME}..."
zip -r "${ZIP_NAME}" \
    extension.js \
    metadata.json \
    prefs.js \
    schemas/ \
    -x "*.gschema.override" -x "schemas/gschemas.compiled"

echo "Done! Package created: ${ZIP_NAME}"
echo "You can now upload this file to https://extensions.gnome.org/upload/"
