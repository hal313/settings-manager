(function() {
    'use strict';

    var SettingsManager = require('../../dist/SettingsManager'),
        SettingsManagerRunner = require('./../util/SettingsManagerRunner');

        SettingsManagerRunner().runSpecs(SettingsManager);

}());