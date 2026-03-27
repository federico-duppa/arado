# Specification: Arado GNOME Extension v1

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
    - Windows are assigned to the "next available slot" in a left-to-right, top-to-bottom order using a modulo operation based on their stack order.
    - **Slot Persistence:** Once a window is assigned to a slot (either automatically or via keyboard shortcuts), it remembers its assignment as long as it remains managed.
    - **Overflow Handling:** If there are more windows than slots (e.g., 2 windows in a 1-slot grid, or 3 windows in a 2-slot grid), the engine will wrap around (e.g., in a 2-slot grid, the 3rd window goes to the 1st slot, the 4th to the 2nd). Users can rely on standard OS task switching (e.g., Alt-Tab) to bring stacked windows to the foreground.
    - **Margins & Gaps:** The engine applies a fixed, non-configurable `2px` gap between windows and a `2px` margin around the edges of the screen. Due to pixel rounding, the right and bottom margins may occasionally be `3px`.
    - The engine must respect the `struts` (e.g., GNOME top bar) to avoid overlapping system UI by using the monitor's work area.
- **Dynamic & Automatic Updates:** Tiling is fully automatic. The layout recalculates immediately when windows are opened, closed, moved, resized, maximized, or when the workspace changes. Manual movement or resizing of a tiled window will cause it to snap back to its assigned slot.
- **Multi-Monitor Support:** Each monitor maintains its own independent tiling grid based on the windows currently residing on that monitor. All monitors share the same global grid size configuration.
- **Window Exclusions:** The engine excludes the following from the tiling grid:
    - Non-normal windows (transients, desktops, docks, etc.).
    - Minimized windows.
    - Attached dialogs.
    - Windows that explicitly do not allow resizing.
    - Maximized windows are automatically unmaximized and tiled when they become the target of the tiling engine.

### 2. Configuration UI (Preferences)
- A GTK4/Libadwaita-based preferences window (accessible via `gnome-extensions-app`).
- **Options:**
    - **Grid Size:** A dropdown to select between "1 Slot", "2 Slots", and "4 Slots".

### 3. Keyboard Shortcuts
- **Grid Configuration:**
    - `SUPER + G`: Cycle through grid sizes (1-slot -> 2-slot -> 4-slot -> 1-slot...).
- **Window Movement:**
    - `SUPER + Left`: Move the focused window to the slot on the left.
    - `SUPER + Right`: Move the focused window to the slot on the right.
    - `SUPER + Up`: Move the focused window to the slot above (in 4-slot mode).
    - `SUPER + Down`: Move the focused window to the slot below (in 4-slot mode).
- **Shortcut Override:** The extension registers these shortcuts via the GNOME Shell window manager, which typically overrides default behaviors for these key combinations while the extension is active.

## Implementation Strategy
- Use `Meta` (Mutter) signals (`window-created`, `unmanaged`, `size-changed`, `position-changed`, `workspace-switched`) to track window and environment lifecycle.
- Implement a `TilingManager` class to handle the layout math, window positioning, and multi-monitor logic.
- Use a `WeakMap` to persist slot assignments for active windows.
- Use `extension.js` for the shell logic and `prefs.js` for the configuration UI using `Adw` (Libadwaita).
- Hook into the GNOME keybinding manager to register and override `SUPER + <Arrow Keys>`.

## Verification & Testing
- Test on GNOME 42.9.
- Verify window resizing and positioning across both 2-slot and 4-slot modes.
- Verify 2px gaps and margins are applied correctly.
- Ensure the top bar is never obscured.
- Verify shortcut responsiveness and ensure default GNOME snapping is overridden.
- Test stacking behavior when exceeding slot capacity.
- Test multi-monitor setups to ensure grids are isolated per display.
