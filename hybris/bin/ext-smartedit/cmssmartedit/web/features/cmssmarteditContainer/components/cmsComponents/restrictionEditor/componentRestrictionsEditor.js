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
angular.module('componentRestrictionsEditorModule', ['restrictionTypesServiceModule', 'restrictionsServiceModule'])
    .controller('componentRestrictionsEditorController', function(restrictionTypesService, restrictionsService) {

        this.restrictionsResult = function(onlyOneRestrictionMustApply, restrictions) {
            this.model.onlyOneRestrictionMustApply = onlyOneRestrictionMustApply;
            this.model.restrictions = restrictions;
        }.bind(this);

        this.getRestrictionTypes = function() {
            return restrictionTypesService.getRestrictionTypes();
        };

        this.getSupportedRestrictionTypes = function() {
            return restrictionsService.getSupportedRestrictionTypeCodes();
        };

        this.$onChanges = function(changesObj) {

            if (changesObj.model) {
                this.model.restrictions = changesObj.model.currentValue.restrictions;
                this.model.onlyOneRestrictionMustApply = changesObj.model.currentValue.onlyOneRestrictionMustApply;
            }
        };

    })
    /**
     * @name cmsItemDropdownModule.directive:cmsItemDropdown
     * @scope
     * @restrict E
     * @element component-restrictions-editor
     * 
     * @description
     * Component wrapper for Restrictions on top of {@link restrictionsEditorModule.restrictionsEditor restrictionsEditor} component.
     * 
     * @param {<Object} model The component model
     */
    .component('componentRestrictionsEditor', {
        templateUrl: 'componentRestrictionsEditorTemplate.html',
        controller: 'componentRestrictionsEditorController',
        controllerAs: 'componentRestrictionsEditorCtrl',
        bindings: {
            model: '<'
        }
    });
