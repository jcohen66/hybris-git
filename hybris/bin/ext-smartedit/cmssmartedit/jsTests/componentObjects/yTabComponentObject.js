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
        /**
         * Get tab by id
         * @param {String} id The id of the tab
         * @returns {ElementFinder|ElementArrayFinder|webdriver.WebElement}
         */
        getTabById: function(id) {
            return element(by.xpath('//y-tab[@data-tab-id="' + id + '"]'));
        }
    };

    return componentObject;
}());
