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
angular.module('editPageVisibilityTabModule', ['eventServiceModule', 'pageRestrictionsModule', 'restrictionsServiceModule', 'pageRestrictionsInfoMessageModule', 'cmsitemsRestServiceModule'])
    .controller('EditPageVisibilityTabCtrl', function(systemEventService, pageRestrictionsFacade, restrictionsService, cmsitemsRestService) {

        this.restrictionsResult = function(onlyOneRestrictionMustApply, restrictions) {
            var restrictionsObj = {
                onlyOneRestrictionMustApply: onlyOneRestrictionMustApply,
                restrictions: restrictions
            };

            this.restrictions = restrictions;
            systemEventService.sendAsynchEvent("EDIT_PAGE_RESTRICTIONS_UPDATED_EVENT", restrictionsObj);

            //Clear all errors when we make a change to page restrictions
            this.errors = [];
        }.bind(this);

        this.getRestrictionTypes = function() {
            return pageRestrictionsFacade.getRestrictionTypesByPageType(this.page.typeCode);
        }.bind(this);

        this.getSupportedRestrictionTypes = function() {
            return restrictionsService.getSupportedRestrictionTypeCodes();
        };

        this.unregFn = systemEventService.registerEventHandler("EDIT_PAGE_RESTRICTIONS_ERRORS_EVENT", function(event, errors) {
            this.errors = errors;
        }.bind(this));

        this.$onDestroy = function() {
            this.unregFn();
        };

        this.$onInit = function() {
            this.isReady = false;
            this.page = this.model;

            cmsitemsRestService.getById(this.page.uuid).then(function(itemData) {
                this.page.restrictions = itemData.restrictions;
                this.errors = [];
                this.restrictions = this.page.restrictions;
                this.isReady = true;
            }.bind(this));
        };
    })
    .directive('editPageVisibilityTab', function() {
        return {
            restrict: 'E',
            scope: {},
            templateUrl: 'editPageVisibilityTabInnerTemplate.html',
            controller: 'EditPageVisibilityTabCtrl',
            controllerAs: 'ctrl',
            bindToController: {
                model: '=',
                saveTab: '=',
                resetTab: '=',
                cancelTab: '=',
                isDirtyTab: '=',
                tabId: '='
            }
        };
    });
