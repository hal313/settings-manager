(function() {
    'use strict';

    var SettingsManager = require('../../src/SettingsManager'),
        SettingsManagerRunner = require('./../util/SettingsManagerRunner');

        SettingsManagerRunner().runSpecs(SettingsManager);

}());