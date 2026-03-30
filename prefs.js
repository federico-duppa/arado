import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';

import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/shell/extensions/prefs.js';

export default class AradoPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();

        const page = new Adw.PreferencesPage();
        const group = new Adw.PreferencesGroup({
            title: _('Tiling Settings'),
            description: _('Configure how Arado tiles your windows.')
        });
        page.add(group);

        const row = new Adw.ComboRow({
            title: _('Grid Size'),
            subtitle: _('Select the number of slots for the tiling grid.'),
            model: Gtk.StringList.new([
                _('1 Slot'),
                _('2 Slots'),
                _('4 Slots')
            ])
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
}
