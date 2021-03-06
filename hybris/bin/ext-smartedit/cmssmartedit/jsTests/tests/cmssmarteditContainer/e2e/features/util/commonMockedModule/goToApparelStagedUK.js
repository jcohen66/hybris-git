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
angular.module('goToApparelStagedUK', ['resourceLocationsModule'])
    .run(function($location, STOREFRONT_PATH) {

        var pathWithExperience = STOREFRONT_PATH
            .replace(":siteId", "apparel-uk")
            .replace(":catalogId", "apparel-ukContentCatalog")
            .replace(":catalogVersion", "Staged");
        $location.path(pathWithExperience);
    });
try {
    angular.module('smarteditloader').requires.push('goToApparelStagedUK');
} catch (e) {}
try {
    angular.module('smarteditcontainer').requires.push('goToApparelStagedUK');
} catch (e) {}
