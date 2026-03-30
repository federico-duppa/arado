#!/bin/bash

# Arado Version Bumper
# Usage: ./bump-version.sh <version_number>

NEW_VERSION=$1

if [ -z "$NEW_VERSION" ]; then
    echo "Usage: $0 <version_number>"
    echo "Example: $0 3"
    exit 1
fi

echo "Bumping version to ${NEW_VERSION}..."

# 1. Update metadata.json (the source of truth)
sed -i "s/\"version\": [0-9]*/\"version\": $NEW_VERSION/" metadata.json

# 2. Update README.md
sed -i "s/# Arado v[0-9]*/# Arado v$NEW_VERSION/" README.md

# 3. Update SPEC.md
sed -i "s/Arado GNOME Extension v[0-9]*/Arado GNOME Extension v$NEW_VERSION/" SPEC.md

# 4. Update script headers
sed -i "s/# Arado v[0-9]*/# Arado v$NEW_VERSION/" install.sh
sed -i "s/# Arado v[0-9]*/# Arado v$NEW_VERSION/" release.sh

echo "Done! Version bumped to $NEW_VERSION in metadata.json, README.md, SPEC.md, install.sh, and release.sh."
echo "You can now run ./release.sh to package the extension."
