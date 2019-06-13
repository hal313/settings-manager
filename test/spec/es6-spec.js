let SettingsManager = require('../../dist/SettingsManager.es6.js');

require('../util/SettingsManagerRunner.js').runSpecs(SettingsManager.SettingsManager, SettingsManager.InMemoryStore);
require('../util/InMemoryStoreRunner').runSpecs(SettingsManager.InMemoryStore);
require('../util/ExecuteRunner.js').runSpecs(SettingsManager.execute);
require('../util/IsArrayRunner.js').runSpecs(SettingsManager.isArray);
require('../util/IsFunctionRunner.js').runSpecs(SettingsManager.isFunction);
require('../util/IsObjectRunner.js').runSpecs(SettingsManager.isObject);
require('../util/MergeRunner.js').runSpecs(SettingsManager.merge);
