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
module.exports = {

    BUTTON_SELECTOR: '[data-item-key="se.cms.pageSyncMenu"] > button',

    click: function() {
        return browser.switchToParent().then(function() {
            browser.click(this.BUTTON_SELECTOR);
            browser.click(this.BUTTON_SELECTOR); //Open and close dropdown to ensure the menu is made available
            return browser.click(this.BUTTON_SELECTOR);
        }.bind(this));
    },
    getPanel: function() {
        return element(by.css("synchronization-panel"));
    },
    getPanelHeader: function() {
        return element(by.css("page-synchronization-header > div")).getText();
    },
    getSyncCautionIcon: function() {
        return element(by.css(".se-toolbar-menu-ddlb--button__caution"));
    },
    assertSyncCautionIconIsDisplayed: function() {
        expect(this.getSyncCautionIcon().isDisplayed()).toBe(true);
    }

};
