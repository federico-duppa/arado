# Agent Instructions: Arado Project

## Specification Maintenance
The `SPEC.md` file is the **source of truth** for the functional behavior of the Arado extension.

- **Mandatory Update:** Any implementation that introduces a new feature or modifies existing behavior **MUST** include a corresponding update to `SPEC.md`.
- **Bug Fixes:** If a bug fix changes how a feature works (or clarifies its behavior), `SPEC.md` must be updated to reflect the correct implementation.
- **Consistency:** Ensure that the implementation details (window filtering, slot assignment, keyboard shortcuts) always match the descriptions in the specification.

## GNOME Extension Guidelines
Adhere to the [GNOME Shell Extension Review Guidelines](https://gjs.guide/extensions/review-guidelines/review-guidelines.html):
- **Resource Management:** Ensure all signals, idle sources, and objects are cleaned up in the `disable()` method.
- **Separation of Concerns:** `extension.js` must NOT import GTK/Libadwaita; `prefs.js` must NOT import Shell/Meta/St/Clutter.
- **Initialization:** Do not initialize settings or connect signals in the constructor or `init()`; use `enable()` instead.
