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
angular.module('componentItemModule', ['assetsServiceModule'])
    .controller('componentItemController', function(assetsService) {

        this.$onInit = function() {
            this.imageRoot = assetsService.getAssetsRoot();
        };

    })
    .component('componentItem', {
        templateUrl: 'componentItemTemplate.html',
        controller: 'componentItemController',
        bindings: {
            componentInfo: '<'
        }
    });
