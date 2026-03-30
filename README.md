# Arado v2

**A minimal, keyboard-driven tiling extension for GNOME.**

Arado simplifies your workspace by organizing windows into a 1, 2, or 4-slot grid. Built for efficiency, it prioritizes a predictable, automatic layout that snaps your windows into place, allowing you to focus on your work rather than window management.

## Key Features

- **Dynamic Grid Layouts:** Choose between 1-slot (maximized), 2-slot (vertical split), or 4-slot (2x2 grid) modes.
- **Automatic Tiling:** Windows are automatically assigned to slots as they are opened, moved, or resized.
- **Persistent Slot Assignments:** Arado remembers where your windows belong, ensuring your layout stays consistent.
- **Keyboard-First Design:** Move windows between slots and cycle through grid sizes using simple `SUPER` key combinations.
- **Multi-Monitor Support:** Each monitor maintains its own independent grid, while sharing global configuration settings.
- **Intelligent Gaps:** Clean 2px gaps and margins provide visual separation without wasting screen real estate.
- **Built for GNOME 42.9:** Optimized for stability and performance on Ubuntu 22.04 LTS and similar environments.

## Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `SUPER + G` | Cycle through Grid Sizes (1 → 2 → 4 slots) |
| `SUPER + Left` | Move focused window to the left slot |
| `SUPER + Right` | Move focused window to the right slot |
| `SUPER + Up` | Move focused window to the upper slot (4-slot mode) |
| `SUPER + Down` | Move focused window to the lower slot (4-slot mode) |

## Installation

### Quick Install
Clone the repository and run the included installation script:

```bash
git clone https://github.com/federico-duppa/arado.git
cd arado
./install.sh
```

### Enabling the Extension
After installation, you need to restart GNOME Shell and enable the extension:

1.  **Restart GNOME Shell:**
    - **X11:** Press `Alt + F2`, type `r`, and press `Enter`.
    - **Wayland:** Log out and log back in.
2.  **Enable Arado:**
    - Use the **Extensions** app (or GNOME Tweaks).
    - Or run: `gnome-extensions enable arado@federico.duppa`

## Requirements

- **GNOME Shell:** 42.9 (Tested on Ubuntu 22.04 LTS)
- **Dependencies:** `glib-compile-schemas` (usually pre-installed with GNOME)

