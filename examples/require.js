// import { SettingsManager } from './src/SettingsManager';
let SettingsManager = require('../dist/SettingsManager').SettingsManager;

function onSettingsLoaded(settings) {
    console.log('loaded', settings);
}
function onSettingsSaved() {
    console.log('settings saved');
}

function onError(error) {
    console.log('error:', error);
}

let settingsManager = new SettingsManager();

// Start with a load
settingsManager.load(function onLoad(settings) {
    // Handle the load response and start a save
    onSettingsLoaded(settings);
    settingsManager.save({one: 1, two: 'two'}, function onSave() {
        // Handle the save response and start another load
        onSettingsSaved();
        settingsManager.load(function onLoad(settings) {
            // Handle the load response and start another save
            onSettingsLoaded(settings);
            settingsManager.save({three: 3, two: 2}, function onSave() {
                // Handle the save response and start another load
                onSettingsSaved();
                settingsManager.load(function onLoad(settings) {
                    // Handle the load response
                    onSettingsLoaded(settings);
                }, onError);
            }, onError);
        }, onError);
    }, onError);
}, onError);
