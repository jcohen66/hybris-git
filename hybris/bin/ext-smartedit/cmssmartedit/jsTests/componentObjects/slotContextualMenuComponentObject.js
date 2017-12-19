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

    componentObject.elements = {
        visibilityButtonBySlotId: function(slotId) {
            return element(by.id('slot-visibility-button-' + slotId));
        },
        visibilityDropdownBySlotId: function(slotId) {
            return element(by.id('slot-visibility-list-' + slotId));
        },
        visibilityListBySlotId: function(slotId) {
            return this.visibilityDropdownBySlotId(slotId).all(by.css('li'));
        },
        sharedSlotButtonBySlotId: function(slotId) {
            return element(by.id('sharedSlotButton-' + slotId));
        },
        syncButtonBySlotId: function(slotId) {
            return element(by.id('slot-sync-button-' + slotId));
        },
        syncyDropdownBySlotId: function(slotId) {
            return element(by.id('slot-sync-list-' + slotId));
        },
        syncButtonStatusBySlotId: function(slotId) {
            browser.waitForPresence(by.css("div[data-smartedit-component-id='" + slotId + "'] slot-sync-button"), 'cannot find slot sync icon');
            return element(by.css("#slot-sync-button-" + slotId + " > span:nth-child(2)"));
        },
        sharedSlotButtonMessage: function() {
            browser.waitUntil(function() {
                return element.all(by.css('.shared-slot-button-template__menu__title__text__msg')).then(function(popovers) {
                    return popovers.length === 1;
                });
            }, 'no popovers are available');

            return element(by.css('.shared-slot-button-template__menu__title__text__msg')).getAttribute("innerHTML").then(function(innerHTML) {
                return innerHTML.replace(" class=\"ng-scope\"", "");
            });
        }
    };

    componentObject.actions = {
        hoverOverSharedSlotBySlotId: function(slotId) {
            return browser.actions()
                .mouseMove(componentObject.elements.sharedSlotButtonBySlotId(slotId))
                .perform();
        }
    };

    return componentObject;
})();
