(function() {
    'use strict';

    var SettingsManager = require('../../dist/SettingsManager.min'),
        SettingsManagerRunner = require('./../util/SettingsManagerRunner');

        SettingsManagerRunner().runSpecs(SettingsManager);

}());