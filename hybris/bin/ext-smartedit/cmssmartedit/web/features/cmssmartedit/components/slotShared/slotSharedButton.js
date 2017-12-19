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
angular.module('slotSharedButtonModule', ['slotSharedServiceModule', 'translationServiceModule'])
    .controller('slotSharedButtonController', function(slotSharedService) {
        this.slotSharedFlag = false;
        this.buttonName = 'slotSharedButton';

        this.$onInit = function() {
            slotSharedService.isSlotShared(this.slotId).then(function(result) {
                this.slotSharedFlag = result;
            }.bind(this));
        };
    })
    .directive('slotSharedButton', function() {
        return {
            templateUrl: 'slotSharedButtonTemplate.html',
            restrict: 'E',
            controller: 'slotSharedButtonController',
            controllerAs: 'ctrl',
            scope: {},
            bindToController: {
                active: '=',
                slotId: '@'
            }
        };
    });
