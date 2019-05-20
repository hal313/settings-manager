import { SettingsManager } from '../src/SettingsManager.js';

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


// The results element
let resultsElement = document.getElementById('js-results-section');
// Handlers
function onSettingsLoaded(settings) {
    console.log('loaded', settings);
    let element = document.createElement('div');
    element.append(document.createTextNode('loaded'));
    resultsElement.append(element);
}
function onSettingsSaved() {
    console.log('settings saved');
    let element = document.createElement('div');
    element.append(document.createTextNode('saved'));
    resultsElement.append(element);
}
function onError(error) {
    console.log('error:', error);
    let element = document.createElement('div');
    element.append(document.createTextNode(`error: ${error}`));
    resultsElement.append(element);
}
