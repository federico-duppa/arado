# Arado GNOME Extension - Project Context

## Project Overview
**Arado** is a minimal, keyboard-driven tiling extension for GNOME Shell (version 46). It provides a predictable, automatic grid-based window management system (1, 2, or 4 slots) that prioritizes efficiency and a "snap-to-grid" experience.

### Key Technologies
- **GJS (GNOME JavaScript):** The core logic is written in JavaScript using the GObject Introspection (GI) library.
- **Mutter (Meta) / Shell Toolkit (St):** Used for window management, workspace tracking, and Shell UI integration.
- **GTK4 / Libadwaita:** Employed in `prefs.js` for the extension's configuration interface.
- **GSettings:** Used for persistent configuration (e.g., grid size, keyboard shortcuts).

### Main Features
- **Automatic Tiling:** Windows are automatically assigned to slots (1, 2, or 4) based on their stack order.
- **Keyboard Shortcuts:**
    - `SUPER + G`: Cycle through grid sizes (1 → 2 → 4).
    - `SUPER + Arrows`: Move focused window between slots.
- **Multi-Monitor Support:** Each monitor maintains an independent tiling grid.
- **Slot Persistence:** Windows remember their slot assignment while active.

---

## Building and Running
The extension is installed directly to the user's local extension directory.

### Commands
- **Install:** `./install.sh` (copies files to `~/.local/share/gnome-shell/extensions/arado@federico.duppa` and compiles GSettings schemas).
- **Enable:** `gnome-extensions enable arado@federico.duppa`.
- **Disable:** `gnome-extensions disable arado@federico.duppa`.
- **Restart GNOME Shell:**
    - **X11:** Press `Alt + F2`, type `r`, and press `Enter`.
    - **Wayland:** Log out and log back in.
- **Compile Schemas (Manually):** `glib-compile-schemas schemas/`.
- **Version Management:** `./bump-version.sh [major|minor|patch]` (updates `metadata.json`).
- **Release:** `./release.sh` (creates a ZIP archive for distribution).

---

## Development Conventions

### Specification-Driven Development
- **Source of Truth:** `SPEC.md` is the primary document for the extension's functional behavior.
- **Mandatory Updates:** Any change to tiling logic, shortcuts, or window filtering **MUST** be reflected in `SPEC.md`.

### Architectural Standards
- **Separation of Concerns:**
    - `extension.js`: Handles Shell/Meta/St logic. **Do NOT import GTK or Libadwaita here.**
    - `prefs.js`: Handles GTK4/Adw logic for settings. **Do NOT import Shell, Meta, or St here.**
- **Resource Management:** All signals (e.g., `connect`), idle sources (`GLib.idle_add`), and timeouts **MUST** be explicitly disconnected or removed in the `disable()` method of `TilingManager` to prevent memory leaks and crashes.
- **Imports:** Use modern GJS ESM imports (e.g., `import Meta from 'gi://Meta'`).

### Tiling Engine Constraints
- **Gaps & Margins:** Fixed at `2px` (as defined in `SPEC.md`).
- **Window Exclusions:** Only `Meta.WindowType.NORMAL` windows are tiled. Minimized windows and attached dialogs are ignored.
- **Work Area:** Tiling must always respect the `monitor.work_area` to avoid overlapping the GNOME top bar.

### File Structure Highlights
- `extension.js`: Entry point and main tiling engine.
- `prefs.js`: Configuration UI using Libadwaita.
- `metadata.json`: Extension UUID, name, and shell version compatibility.
- `schemas/`: XML definitions for GSettings.
- `AGENTS.md`: Specific instructions for AI agents working on this codebase.
