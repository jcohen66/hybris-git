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
/**
 * @ngdoc overview
 * @name createPageServiceModule
 * @description
 * # The createPageServiceModule
 *
 * The create page service module provides a service that allows creating new pages.
 *
 */
angular.module('createPageServiceModule', ['restServiceFactoryModule', 'resourceLocationsModule'])

/**
 * @ngdoc service
 * @name createPageServiceModule.service:createPageService
 *
 * @description
 * The createPageService allows creating new pages.
 *
 */
.factory('createPageService', function(restServiceFactory, PAGES_LIST_RESOURCE_URI) {
    var pageRestService = restServiceFactory.get(PAGES_LIST_RESOURCE_URI);

    return {
        /**
         * @ngdoc method
         * @name createPageServiceModule.service:createPageService#createPage
         * @methodOf createPageServiceModule.service:createPageService
         *
         * @description
         * When called this service creates a new page based on the information provided.
         *
         * @param {Object} uriContext A {@link resourceLocationsModule.object:UriContext UriContext}
         * @param {String} page The payload containing the information necessary to create the new page.
         * NOTE: The payload must at least provide the following fields.
         * - type: The type of the page.
         * - typeCode: The type code of the page.
         * - template: The uid of the page template to use.
         *
         * @returns {Promise} A promise that will resolve after saving the page in the backend.
         */
        createPage: function(uriContext, page) {
            var payload = angular.extend({}, page, uriContext);
            return pageRestService.save(payload);
        }
    };
});
