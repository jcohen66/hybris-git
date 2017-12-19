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
/* jshint unused:false, undef:false, undef:false */
sfConfigManager.registerDelayStrategy(sfConfigManager.ALIASES.DEFAULT_DELAY_ALIAS, {
    getComponentDelay: function(componentId) {
        return 0;
    },
    getContentDelay: function(componentId) {
        return 0;
    }
});
