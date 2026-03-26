# Specification: Arado GNOME Extension

## Objective
Develop "Arado", a tiling window manager extension for GNOME 42.9 (Ubuntu 22.04 LTS context). The extension provides a simple, configurable grid-based tiling system (1, 2 or 4 slots) with keyboard-driven window movement.

## Target Environment
- **GNOME Version:** 42.9
- **Platform:** Linux (Wayland/X11)
- **Frameworks:** GJS (Gnome JavaScript), St (Shell Toolkit), GTK4 (for Preferences)

## Core Features

### 1. Tiling Engine
- **Grid Modes:**
    - **1-Slot:** Occupies the entire monitor area (minus top bar and margins). Essentially, all windows in this mode are "maximized" within the grid.
    - **2-Slot:** Splits the monitor into two equal vertical halves (left and right). Each window occupies 50% width and 100% height (minus the top bar and margins).
    - **4-Slot:** Splits the monitor into a 2x2 grid. Each window occupies 50% width and 50% height (minus the top bar and margins).
- **Layout Logic:**
    - Windows are assigned to the "next available slot" in a left-to-right, top-to-bottom order.
    - **Overflow Handling:** If there are more windows than slots (e.g., 2 windows in a 1-slot grid, or 3 windows in a 2-slot grid), the engine will wrap around. The extra windows will be placed in the first available slot (on top of existing windows). Users can rely on standard OS task switching (e.g., Alt-Tab) to bring stacked windows to the foreground.
    - **Margins & Gaps:** The engine applies a fixed, non-configurable `2px` gap between windows and a `2px` margin around the edges of the screen.
    - The engine must respect the `struts` (e.g., GNOME top bar) to avoid overlapping system UI.
- **Dynamic & Automatic Updates:** Tiling is fully automatic. The layout recalculates immediately when windows are opened, closed, or moved.
- **Multi-Monitor Support:** Each monitor maintains its own independent tiling grid. For example, if 2-slot mode is selected, Monitor A will have 2 slots and Monitor B will have 2 slots.
- **Window Exclusions:** The engine should attempt to exclude transient windows, dialogs, settings windows, and popups from the tiling grid, leaving them floating. If a window type cannot be reliably identified as a popup, it will be tiled.

### 2. Configuration UI (Preferences)
- A simple GTK4-based preferences window (accessible via `gnome-extensions-app`).
- **Options:**
    - **Grid Type:** Radio buttons or a dropdown to select between "1-Slot", "2-Slot (Vertical)" and "4-Slot (2x2)".

### 3. Keyboard Shortcuts
- **Window Movement:**
    - `SUPER + Left`: Move the focused window to the slot on the left.
    - `SUPER + Right`: Move the focused window to the slot on the right.
    - `SUPER + Up`: Move the focused window to the slot above (in 4-slot mode).
    - `SUPER + Down`: Move the focused window to the slot below (in 4-slot mode).
- **Shortcut Override:** The extension will explicitly override GNOME's default `SUPER + Arrow Keys` behavior (which usually handles snapping and maximizing) to exclusively control movement within the Arado grid.

## Implementation Strategy
- Use `Meta` (Mutter) signals (`window-created`, `window-unmanaged`, `size-changed`) to track window lifecycle.
- Implement a `TilingManager` class to handle the layout math, window positioning, and multi-monitor logic.
- Use `extension.js` for the shell logic and `prefs.js` for the configuration UI.
- Hook into the GNOME keybinding manager to register and override `SUPER + <Arrow Keys>`.

## Verification & Testing
- Test on GNOME 42.9.
- Verify window resizing and positioning across both 2-slot and 4-slot modes.
- Verify 2px gaps and margins are applied correctly.
- Ensure the top bar is never obscured.
- Verify shortcut responsiveness and ensure default GNOME snapping is overridden.
- Test stacking behavior when exceeding slot capacity.
- Test multi-monitor setups to ensure grids are isolated per display.
