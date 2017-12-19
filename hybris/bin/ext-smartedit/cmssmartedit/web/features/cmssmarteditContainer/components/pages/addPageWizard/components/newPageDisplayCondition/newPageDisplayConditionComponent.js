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
 * @name newPageDisplayConditionModule
 * @description
 * #newPageDisplayConditionModule
 *
 * The newPageDisplayConditionModule module contains the
 * {@link newPageDisplayConditionModule.directive:newPageDisplayCondition newPageDisplayCondition} component
 *
 */
angular.module('newPageDisplayConditionModule', ['catalogServiceModule', 'pageServiceModule', 'pageDisplayConditionsServiceModule'])

/**
 * @ngdoc object
 * @name newPageDisplayConditionModule.object:newPageDisplayConditionResult
 *
 * @description
 * The (optional) output of the
 * {@link newPageDisplayConditionModule.directive:newPageDisplayCondition newPageDisplayCondition} component
 * ```
 * {
    isPrimary: {Boolean} True if the chosen new page display condition is Primary
    primaryPage: {Object} [Optional] If isPrimary is false (meaning this is a variant page),
            the value is a page object, representing the primary page that this
            new page will be a variant of.
 * }
 * ```
 */


.controller('newPageDisplayConditionController', function($scope, catalogService, pageService, pageDisplayConditionsService, lodash) {

    var cache = {};

    this.$onInit = function() {

        this.previousPageTypeCode = null;
        this.previousTargetCatalogVersion = null;
        this.conditions = null;
        this.conditionSelected = null;
        this.primarySelected = null;
        this.ready = false;
        this.resultFn = this.resultFn || function() {};
        this.initialConditionSelected = this.initialConditionSelected || "page.displaycondition.primary";

        this.showPrimarySelector = function() {
            return !(this.conditionSelected && this.conditionSelected.isPrimary === true);
        };

        this.dataChanged = function() {
            this.resultFn(this._getResults());
        };
    };

    this.$onChanges = function $onChanges(changes) {
        if ((changes.pageTypeCode && this.pageTypeCode !== this.previousPageTypeCode) ||
            (changes.targetCatalogVersion && this.targetCatalogVersion !== this.previousTargetCatalogVersion)) {

            this.previousPageTypeCode = this.pageTypeCode;
            this.previousTargetCatalogVersion = this.targetCatalogVersion;

            if (!this.targetCatalogVersion || this._isUriContextEqualToCatalogVersion(this.uriContext, this.targetCatalogVersion)) {
                this._getPrimaryPages();
            } else {
                this._getOnlyPrimaryDisplayCondition();
            }
        }
    };

    this._getResults = function _getResults() {
        var result = {
            isPrimary: this.conditionSelected.isPrimary
        };
        if (!this.conditionSelected.isPrimary) {
            result.primaryPage = this.primarySelected;
        }
        return result;
    };

    this._getPrimaryPages = function _getPrimaryPages() {

        if (this.pageTypeCode) {
            if (cache[this.pageTypeCode]) {
                this.primaryPageChoices = cache[this.pageTypeCode];
                this._getAllPrimaryDisplayCondition();
            } else {
                pageService.getPrimaryPagesForPageType(this.pageTypeCode, this.uriContext).then(
                        function(primaryPages) {
                            this.primaryPageChoices = primaryPages;
                            cache[this.pageTypeCode] = primaryPages;
                        }.bind(this),
                        function(error) {
                            console.error(error);
                            this.primaryPageChoices = [];
                        }.bind(this))
                    .finally(function() {
                        this._getAllPrimaryDisplayCondition();
                    }.bind(this));
            }
        } else {
            this._getAllPrimaryDisplayCondition();
        }
    };

    this._getAllPrimaryDisplayCondition = function() {
        pageDisplayConditionsService.getNewPageConditions(this.pageTypeCode, this.uriContext).then(function(response) {
            this.conditions = response;
            this.conditionSelected = this.conditions[0];

            if (this.conditions.length > 1) {
                this.conditionSelected = lodash.find(this.conditions, function(condition) {
                    return condition.label === this.initialConditionSelected;
                }.bind(this));
            }

            if (this.primaryPageChoices && this.primaryPageChoices.length > 0) {
                if (this.initialPrimaryPageSelected) {
                    this.primarySelected = this.primaryPageChoices.find(function(page) {
                        return page.label === this.initialPrimaryPageSelected;
                    }.bind(this));
                }
                if (!this.primarySelected) {
                    this.primarySelected = this.primaryPageChoices[0];
                }
            }

            this.ready = true;
        }.bind(this)).finally(function() {
            if (this.targetCatalogVersion && !this._isUriContextEqualToCatalogVersion(this.uriContext, this.targetCatalogVersion)) {
                this._getOnlyPrimaryDisplayCondition();
            } else {
                this.dataChanged();
            }
        }.bind(this));
    };

    this._getOnlyPrimaryDisplayCondition = function() {
        this.conditions = [{
            description: "page.displaycondition.primary.description",
            isPrimary: true,
            label: "page.displaycondition.primary"
        }];

        this.conditionSelected = this.conditions[0];
        this.primarySelected = true;

        this.ready = true;
        this.dataChanged();
    };

    this._isUriContextEqualToCatalogVersion = function(uriContext, catalogVersion) {
        return uriContext && catalogVersion && catalogVersion.siteId === uriContext.CURRENT_CONTEXT_SITE_ID &&
            catalogVersion.catalogId === uriContext.CURRENT_CONTEXT_CATALOG &&
            catalogVersion.version === uriContext.CURRENT_CONTEXT_CATALOG_VERSION;
    };
})

/**
 * @ngdoc directive
 * @name newPageDisplayConditionModule.directive:newPageDisplayCondition
 * @scope
 * @restrict E
 * @element new-page-display-condition
 *
 * @description
 * Component for selecting the page condition that can be applied to a new page.
 * The component takes a page type and some URI params that it needs to load the necessary information, and outputs
 * a display condition result. See below
 *
 * @param {< String} pageTypeCode The page typeCode of a potential new page
 * @param {< Object} uriContext The uri context containing site/catalog information. This is necessary for the
 * component to determine which display conditions can be applied.
 * @param {String} uriContext.siteUID The site ID for the new page
 * @param {String} uriContext.catalogId The catalog ID for the new page
 * @param {String} uriContext.catalogVersion The catalog version for the new page
 * @param {< Function =} resultFn An optional output function binding. Every time there is a change to the output,
 * or resulting display condition, this function (if it exists) will get executed with a
 * {@link newPageDisplayConditionModule.object:newPageDisplayConditionResult newPageDisplayConditionResult} as the single
 * parameter.
 * @param {< String =} initialPrimaryPageSelected A page label if primary page associated to the variation must be selected by default.
 * @param {< String =} initialConditionSelected An optional string to provide if any display condition must be selected by default.
 * @param {< String =} targetCatalogVersion An optional string to provide if the target catalog version selected
 */
.component('newPageDisplayCondition', {
    controller: 'newPageDisplayConditionController',
    templateUrl: 'newPageDisplayConditionTemplate.html',
    bindings: {
        pageTypeCode: '<',
        uriContext: '<',
        resultFn: '<?',
        initialPrimaryPageSelected: '<?',
        initialConditionSelected: '<?',
        targetCatalogVersion: '<?'
    }
});
