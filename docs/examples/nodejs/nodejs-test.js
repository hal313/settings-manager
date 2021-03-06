// Get the SettingsManager
let SettingsManager = require('@hal313/settings-manager').SettingsManager;

// Create an instance of the SettingsManager
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

// Handler functions
function onSettingsLoaded(settings) {
    console.log('loaded', settings);
}
function onSettingsSaved() {
    console.log('settings saved');
}
function onError(error) {
    console.log('error:', error);
}
