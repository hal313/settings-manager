/*global beforeEach,describe,it: true*/
/*global SettingsManager: true*/

/**
 * @author: jghidiu
 * Date: 2014-12-08
 */

(function() {
    'use strict';

    beforeEach(function() {
        this.settingsManager = new SettingsManager();
    });

    describe('Lifecycle', function() {

        it('exists as a global', function () {
            expect(SettingsManager).to.be.a('function');
        });

        it('has a version', function () {
            expect(SettingsManager.version).to.be.a('string');
        });

    });

})();
