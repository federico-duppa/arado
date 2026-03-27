#!/bin/bash

# Arado v1 Release Script
# This script packages the extension for submission to extensions.gnome.org

UUID="arado@federico.duppa"
VERSION="v1"
ZIP_NAME="${UUID}.${VERSION}.zip"

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
