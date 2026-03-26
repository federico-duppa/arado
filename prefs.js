const { Adw, Gio, Gtk } = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;

function init() {
}

function fillPreferencesWindow(window) {
    const settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.arado');

    const page = new Adw.PreferencesPage();
    const group = new Adw.PreferencesGroup({
        title: 'Tiling Settings',
        description: 'Configure how Arado tiles your windows.'
    });
    page.add(group);

    const row = new Adw.ComboRow({
        title: 'Grid Size',
        subtitle: 'Select the number of slots for the tiling grid.',
        model: Gtk.StringList.new(['1 Slot', '2 Slots', '4 Slots'])
    });

    // Map GSettings (1, 2 or 4) to UI index (0, 1 or 2)
    const currentGridSize = settings.get_int('grid-size');
    if (currentGridSize === 1) {
        row.selected = 0;
    } else if (currentGridSize === 4) {
        row.selected = 2;
    } else {
        row.selected = 1;
    }

    row.connect('notify::selected', () => {
        let newValue;
        if (row.selected === 0) {
            newValue = 1;
        } else if (row.selected === 2) {
            newValue = 4;
        } else {
            newValue = 2;
        }
        settings.set_int('grid-size', newValue);
    });

    group.add(row);
    window.add(page);
}
