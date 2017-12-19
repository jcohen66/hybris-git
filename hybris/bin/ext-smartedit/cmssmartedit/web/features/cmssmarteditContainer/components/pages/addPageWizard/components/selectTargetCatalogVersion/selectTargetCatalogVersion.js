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
 * @name selectTargetCatalogVersionModule
 * @description
 * #selectTargetCatalogVersionModule
 *
 * The selectTargetCatalogVersionModule module contains the {@link selectTargetCatalogVersionModule.directive:selectTargetCatalogVersion selectTargetCatalogVersion} component
 *
 */
angular.module('selectTargetCatalogVersionModule', [
    'yLoDashModule',
    'pageFacadeModule',
    'catalogVersionRestServiceModule',
    'pageServiceModule',
    'resourceLocationsModule'
])

/**
 * @ngdoc directive
 * @name selectTargetCatalogVersionModule.directive:selectTargetCatalogVersion
 * @scope
 * @restrict E
 * @element select-target-catalog-version
 *
 * @description
 * Displays a list of catalog versions used for selecting the target catalog version that will be applied to the cloned page
 *
 * @param {< Object} uriContext The uri context containing site/catalog information. This is necessary for the
 * component to determine the list of catalog versions to display
 * @param {String} uriContext.siteUID The site ID for the new page
 * @param {String} uriContext.catalogId The catalog ID for the new page
 * @param {String} uriContext.catalogVersion The catalog version for the new page
 * @param {< String} pageTypeCode The page typeCode of a potential new page
 * @param {< String} pageLabel The page label of a potential new page
 * @param {< Function =} onTargetCatalogVersionSelected An optional output function binding. Every time there is a change to the catalogVersion selection,
 * or resulting target catalog version, this function (if it exists) will get executed
 */
.component('selectTargetCatalogVersion', {
    controller: 'selectTargetCatalogVersionController',
    templateUrl: 'selectTargetCatalogVersionTemplate.html',
    bindings: {
        uriContext: '<',
        pageTypeCode: '<',
        pageLabel: '<',
        basePageInfo: '<',
        onTargetCatalogVersionSelected: '&'
    }
})

.controller('selectTargetCatalogVersionController', ['$q', 'lodash', 'pageFacade', 'catalogVersionRestService', 'catalogService', 'pageService', 'PAGE_CONTEXT_SITE_ID', 'PAGE_CONTEXT_CATALOG', 'PAGE_CONTEXT_CATALOG_VERSION',
    function($q, lodash, pageFacade, catalogVersionRestService, catalogService, pageService, PAGE_CONTEXT_SITE_ID, PAGE_CONTEXT_CATALOG, PAGE_CONTEXT_CATALOG_VERSION) {

        this.catalogVersions = [];
        this.selectedCatalogVersion = null;
        this.catalogVersionContainsPageWithSameLabel = false;
        this.catalogVersionContainsPageWithSameTypeCode = false;

        this.catalogVersionSelectorFetchStrategy = {
            fetchAll: function() {
                return $q.when(lodash.forEach(this.catalogVersions, function(catalogVersion) {
                    catalogVersion.id = catalogVersion.uuid;
                    catalogVersion.label = catalogVersion.name;
                }));
            }.bind(this)
        };

        this.onSelectionChanged = function() {
            if (this.selectedCatalogVersion) {
                catalogService.getCatalogVersionByUuid(this.selectedCatalogVersion).then(function(catalogVersion) {
                    if (this.pageTypeCode === 'ContentPage') {
                        pageFacade.contentPageWithLabelExists(this.pageLabel, catalogVersion.catalogId, catalogVersion.version).then(function(pageExists) {
                            this.catalogVersionContainsPageWithSameLabel = pageExists;
                            this.onTargetCatalogVersionSelected({
                                $catalogVersion: catalogVersion
                            });
                        }.bind(this));
                    } else {
                        var uriContextForSelectedCatalogVersion = {};
                        uriContextForSelectedCatalogVersion[PAGE_CONTEXT_SITE_ID] = catalogVersion.siteId;
                        uriContextForSelectedCatalogVersion[PAGE_CONTEXT_CATALOG] = catalogVersion.catalogId;
                        uriContextForSelectedCatalogVersion[PAGE_CONTEXT_CATALOG_VERSION] = catalogVersion.version;

                        pageService.getPrimaryPagesForPageType(this.pageTypeCode, uriContextForSelectedCatalogVersion).then(function(result) {
                            this.catalogVersionContainsPageWithSameTypeCode = !lodash.isEmpty(result);
                            this.onTargetCatalogVersionSelected({
                                $catalogVersion: catalogVersion
                            });
                        }.bind(this));
                    }
                }.bind(this));
            }
        }.bind(this);

        this.$onInit = function() {
            catalogVersionRestService.getCloneableTargets(this.uriContext).then(function(targets) {
                this.catalogVersions = targets.versions;

                if (!lodash.isEmpty(this.catalogVersions)) {
                    catalogService.getCatalogVersionUUid(this.uriContext).then(function(uuid) {
                        var currentCatalogVersion = lodash.find(this.catalogVersions, function(catalogVersion) {
                            return catalogVersion.uuid === uuid;
                        });

                        if (currentCatalogVersion) {
                            this.selectedCatalogVersion = currentCatalogVersion.uuid;
                        } else {
                            this.selectedCatalogVersion = this.catalogVersions[0].uuid;
                        }
                    }.bind(this));
                }
            }.bind(this));
        };
    }
]);
