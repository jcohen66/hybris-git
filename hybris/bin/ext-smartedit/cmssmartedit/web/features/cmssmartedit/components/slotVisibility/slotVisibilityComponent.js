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
 * @name slotVisibilityComponentModule
 *
 * @description
 * The slot visibility component module provides a directive and controller to display the hidden components of a specified content slot.
 *
 * @requires componentVisibilityAlertServiceModule
 * @requires editorModalServiceModule
 */
angular.module('slotVisibilityComponentModule', [
    "componentVisibilityAlertServiceModule",
    "editorModalServiceModule"
])

.controller('slotVisibilityComponentController', function(
    componentVisibilityAlertService,
    editorModalService
) {

    this.imageRoot = '/cmssmartedit/images';

    this.openEditorModal = function() {
        editorModalService.openAndRerenderSlot(
            this.component.typeCode,
            this.component.uuid,
            this.slotId,
            "visibilityTab"
        ).then(function(item) {
            componentVisibilityAlertService.checkAndAlertOnComponentVisibility({
                itemId: item.uuid,
                itemType: item.itemtype,
                catalogVersion: item.catalogVersion,
                restricted: item.restricted,
                slotId: this.slotId,
                visible: item.visible
            });
        }.bind(this));
    };

    this.$onInit = function() {
        this.componentVisbilitySwitch = this.component.visible ? 'se.cms.component.visibility.status.on' : 'se.cms.component.visibility.status.off';
        this.componentRestrictionsCount = '(' + (this.component.restrictions ? this.component.restrictions.length : 0) + ')';
    };
})

/**
 * @ngdoc directive
 * @name slotVisibilityComponentModule.directive:slotVisibilityComponent
 *
 * @description
 * The slot visibility component directive is used to display information about a specified hidden component.
 * It receives the component on its scope and it binds it to its own controller.
 */
.component('slotVisibilityComponent', {
    templateUrl: 'slotVisibilityComponentTemplate.html',
    transclude: false,
    controller: 'slotVisibilityComponentController',
    controllerAs: 'ctrl',
    bindings: {
        component: '=',
        slotId: '@'
    }
});
