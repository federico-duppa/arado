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
        model: Gtk.StringList.new(['2 Slots', '4 Slots'])
    });

    // Map GSettings (2 or 4) to UI index (0 or 1)
    row.selected = settings.get_int('grid-size') === 4 ? 1 : 0;

    row.connect('notify::selected', () => {
        const newValue = row.selected === 1 ? 4 : 2;
        settings.set_int('grid-size', newValue);
    });

    group.add(row);
    window.add(page);
}
