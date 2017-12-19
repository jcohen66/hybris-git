/*
 * [y] hybris Platform
 *
 * Copyright (c) 2017 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */
/* jshint unused:false, undef:false */
module.exports = (function() {

    var componentObject = {};

    componentObject.getInSyncSlotDecorators = function() {
        return element.all(by.css('.sync-indicator-decorator.NOT_SYNC'));
    };

    componentObject.getOutOfSyncSlotDecorators = function() {
        return element.all(by.css('.sync-indicator-decorator.IN_SYNC'));
    };
    componentObject.getDecoratorBySlotId = function(slotId) {
        return element(by.css('[data-smartedit-component-id="' + slotId + '"] .sync-indicator-decorator'));
    };
    componentObject.getDecoratorStatusBySlotId = function(slotId) {
        return this.getDecoratorBySlotId(slotId).getAttribute("data-sync-status");
    };
    componentObject.assertions = {

        inSyncSlotDecoratorsCount: function(expectedCount) {
            browser.waitUntil(function() {
                return componentObject.getInSyncSlotDecorators().count().then(function(actualCount) {
                    return actualCount === expectedCount;
                });
            }, "was expecting " + expectedCount + " inSync slot decorators");
        },

        outOfSyncSlotDecoratorsCount: function(expectedCount) {
            browser.waitUntil(function() {
                return componentObject.getOutOfSyncSlotDecorators().count().then(function(actualCount) {
                    return actualCount === expectedCount;
                });
            }, "was expecting " + expectedCount + " out of Sync slot decorators");
        },
    };

    return componentObject;
})();
