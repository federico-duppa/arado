#!/bin/bash

# Arado GNOME Extension Installer
# This script installs the Arado extension to the local user directory.

UUID="arado@federico.duppa"
INSTALL_BASE="$HOME/.local/share/gnome-shell/extensions"
INSTALL_PATH="$INSTALL_BASE/$UUID"

echo "Installing Arado extension ($UUID)..."

# Create destination directory
mkdir -p "$INSTALL_PATH"

# Copy extension files
cp extension.js metadata.json prefs.js "$INSTALL_PATH/"
cp -r schemas "$INSTALL_PATH/"

# Compile schemas
echo "Compiling GSettings schemas..."
glib-compile-schemas "$INSTALL_PATH/schemas/"

echo "--------------------------------------------------"
echo "Installation complete!"
echo "To enable the extension:"
echo "1. Restart GNOME Shell (Alt+F2, type 'r', Enter on X11; or Log out/Log in on Wayland)."
echo "2. Enable it via 'Extensions' app or run:"
echo "   gnome-extensions enable $UUID"
echo "--------------------------------------------------"
