const { Gio, GLib, GObject, Meta, Shell, St } = imports.gi;
const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;

class TilingManager {
    constructor() {
        this._settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.arado');
        this._windowSignals = new Map();
        this._shellSignals = [];
        this._isTiling = false;
        this._idleId = 0;

        // Slot mapping per window (stored by window reference)
        this._windowSlots = new WeakMap();
    }

    enable() {
        this._gridSize = this._settings.get_int('grid-size');

        this._shellSignals.push({
            obj: this._settings,
            id: this._settings.connect('changed::grid-size', () => {
                this._gridSize = this._settings.get_int('grid-size');
                this.scheduleTileAll();
            })
        });

        this._shellSignals.push({
            obj: global.display,
            id: global.display.connect('window-created', (display, window) => {
                this._setupWindow(window);
            })
        });

        this._shellSignals.push({
            obj: global.workspace_manager,
            id: global.workspace_manager.connect('workspace-switched', () => {
                this.scheduleTileAll();
            })
        });

        this._setupKeybindings();

        // Initial setup for existing windows
        global.get_window_actors().forEach(actor => {
            if (actor.meta_window) {
                this._setupWindow(actor.meta_window, false);
            }
        });

        this.scheduleTileAll();
    }

    disable() {
        if (this._idleId) {
            GLib.source_remove(this._idleId);
            this._idleId = 0;
        }

        this._shellSignals.forEach(signal => signal.obj.disconnect(signal.id));
        this._shellSignals = [];

        for (let [window, signals] of this._windowSignals) {
            signals.forEach(id => {
                try {
                    window.disconnect(id);
                } catch (e) {
                    // Window might be destroyed
                }
            });
        }
        this._windowSignals.clear();

        this._removeKeybindings();
    }

    scheduleTileAll() {
        if (this._idleId) return;
        this._idleId = GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, () => {
            this.tileAll();
            this._idleId = 0;
            return GLib.SOURCE_REMOVE;
        });
    }

    _setupWindow(window, doRetile = true) {
        if (this._shouldIgnore(window)) return;

        if (this._windowSignals.has(window)) return;

        let signals = [
            window.connect('unmanaged', () => {
                this._windowSignals.delete(window);
                this.scheduleTileAll();
            }),
            window.connect('size-changed', () => {
                if (!this._isTiling) this.scheduleTileAll();
            }),
            window.connect('position-changed', () => {
                 if (!this._isTiling) this.scheduleTileAll();
            })
        ];

        this._windowSignals.set(window, signals);
        if (doRetile) this.scheduleTileAll();
    }

    _shouldIgnore(window) {
        if (!window || !window.get_window_type || !window.get_workspace) return true;
        
        let type = window.get_window_type();
        if (type !== Meta.WindowType.NORMAL) return true;

        return window.minimized ||
               window.is_attached_dialog() ||
               !window.allows_resize();
    }

    _setupKeybindings() {
        let modes = Shell.ActionMode.NORMAL;

        Main.wm.addKeybinding('move-left', this._settings, Meta.KeyBindingFlags.NONE, modes, () => {
            this._moveFocusedWindow('left');
        });
        Main.wm.addKeybinding('move-right', this._settings, Meta.KeyBindingFlags.NONE, modes, () => {
            this._moveFocusedWindow('right');
        });
        Main.wm.addKeybinding('move-up', this._settings, Meta.KeyBindingFlags.NONE, modes, () => {
            this._moveFocusedWindow('up');
        });
        Main.wm.addKeybinding('move-down', this._settings, Meta.KeyBindingFlags.NONE, modes, () => {
            this._moveFocusedWindow('down');
        });
    }

    _removeKeybindings() {
        Main.wm.removeKeybinding('move-left');
        Main.wm.removeKeybinding('move-right');
        Main.wm.removeKeybinding('move-up');
        Main.wm.removeKeybinding('move-down');
    }

    _moveFocusedWindow(direction) {
        let window = global.display.focus_window;
        if (!window || this._shouldIgnore(window)) return;

        let currentSlot = this._windowSlots.get(window) || 0;
        let newSlot = currentSlot;

        if (this._gridSize === 2) {
            if (direction === 'left') newSlot = 0;
            if (direction === 'right') newSlot = 1;
        } else if (this._gridSize === 4) {
            // 0 1
            // 2 3
            if (direction === 'left') newSlot = (currentSlot % 2 === 1) ? currentSlot - 1 : currentSlot;
            if (direction === 'right') newSlot = (currentSlot % 2 === 0) ? currentSlot + 1 : currentSlot;
            if (direction === 'up') newSlot = (currentSlot >= 2) ? currentSlot - 2 : currentSlot;
            if (direction === 'down') newSlot = (currentSlot <= 1) ? currentSlot + 2 : currentSlot;
        }

        this._windowSlots.set(window, newSlot);
        this.scheduleTileAll();
    }

    tileAll() {
        if (this._isTiling) return;
        this._isTiling = true;

        let workspace = global.workspace_manager.get_active_workspace();
        let windows = workspace.list_windows().filter(w => !this._shouldIgnore(w));

        // Group windows by monitor
        let monitorWindows = new Map();
        windows.forEach(w => {
            let idx = w.get_monitor();
            if (!monitorWindows.has(idx)) monitorWindows.set(idx, []);
            monitorWindows.get(idx).push(w);
        });

        monitorWindows.forEach((winList, monitorIndex) => {
            this._tileMonitor(monitorIndex, winList);
        });

        this._isTiling = false;
    }

    _tileMonitor(monitorIndex, windows) {
        let workArea = Main.layoutManager.getWorkAreaForMonitor(monitorIndex);
        let gap = 2;
        let margin = 2;

        let cols = 2;
        let rows = (this._gridSize === 2) ? 1 : 2;

        let slotWidth = Math.floor((workArea.width - (margin * 2) - (gap * (cols - 1))) / cols);
        let slotHeight = Math.floor((workArea.height - (margin * 2) - (gap * (rows - 1))) / rows);

        windows.forEach((window, index) => {
            // Unmaximize if needed
            if (window.get_maximized() !== Meta.MaximizeFlags.NONE) {
                window.unmaximize(Meta.MaximizeFlags.BOTH);
            }

            // If window has no assigned slot, use its index in the window list (modulo gridSize)
            let slot = this._windowSlots.get(window);
            if (slot === undefined) {
                slot = index % this._gridSize;
                this._windowSlots.set(window, slot);
            }

            let col = slot % 2;
            let row = Math.floor(slot / 2);

            let x = Math.floor(workArea.x + margin + (col * (slotWidth + gap)));
            let y = Math.floor(workArea.y + margin + (row * (slotHeight + gap)));

            // Move and resize the window only if geometry changed
            let rect = window.get_frame_rect();
            if (rect.x !== x || rect.y !== y || rect.width !== slotWidth || rect.height !== slotHeight) {
                window.move_resize_frame(false, x, y, slotWidth, slotHeight);
            }
        });
    }
}

function init() {
    return new TilingManager();
}
