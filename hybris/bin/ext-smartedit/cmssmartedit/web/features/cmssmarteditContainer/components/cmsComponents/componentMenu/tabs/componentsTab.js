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
angular.module('componentsTabModule', ['eventServiceModule', 'componentMenuServiceModule', 'componentServiceModule', 'componentItemModule'])
    .controller('componentsTabController', function($q, systemEventService, componentMenuService, ComponentService) {

        // --------------------------------------------------------------------------------------------------
        // Constants
        // --------------------------------------------------------------------------------------------------

        // --------------------------------------------------------------------------------------------------
        // Lifecycle Methods
        // --------------------------------------------------------------------------------------------------
        this.$onInit = function() {
            // Catalog Version Selector
            this.catalogVersions = null;
            this.selectedCatalogVersionId = null;
            this.selectedCatalogVersion = null;
            this.catalogVersionTemplate = 'catalogVersionTemplate.html';

            if (this.hasMultipleContentCatalogs) {
                this.catalogVersionsFetchStrategy = {
                    fetchAll: this.fetchCatalogVersions
                };
            } else {
                this.fetchCatalogVersions().then(function() {
                    this.onCatalogVersionChange();
                }.bind(this));
            }

            // Infinite Scrolling
            this.resetComponentsList = function() {};
            this.searchTerm = '';
        };

        // --------------------------------------------------------------------------------------------------
        // Event Handlers
        // --------------------------------------------------------------------------------------------------
        this.onCatalogVersionChange = function() {
            if (this.selectedCatalogVersionId) {
                this.selectedCatalogVersion = this.catalogVersions.filter(function(catalogVersion) {
                    return catalogVersion.id === this.selectedCatalogVersionId;
                }.bind(this))[0];

                componentMenuService.persistCatalogVersion(this.selectedCatalogVersionId);
                this.resetComponentsList();
            }
        }.bind(this);

        this.onSearchTermChanged = function(searchTerm) {
            this.searchTerm = searchTerm;
        }.bind(this);

        // --------------------------------------------------------------------------------------------------
        // Helper Methods
        // --------------------------------------------------------------------------------------------------
        this.fetchCatalogVersions = function() {
            return componentMenuService.getValidContentCatalogVersions().then(function(catalogVersions) {
                this.catalogVersions = catalogVersions;

                return componentMenuService.getInitialCatalogVersion(this.catalogVersions).then(function(selectedCatalogVersion) {
                    this.selectedCatalogVersion = selectedCatalogVersion;
                    this.selectedCatalogVersionId = this.selectedCatalogVersion.id;

                    return catalogVersions;
                }.bind(this));

            }.bind(this));
        }.bind(this);

        this.loadComponentItems = function(mask, pageSize, currentPage) {
            if (!this.selectedCatalogVersion) {
                return $q.when({
                    results: []
                });
            }

            var payload = {
                catalogId: this.selectedCatalogVersion.catalogId,
                catalogVersion: this.selectedCatalogVersion.catalogVersionId,
                mask: mask,
                pageSize: pageSize,
                page: currentPage
            };

            return ComponentService.loadPagedComponentItemsByCatalogVersion(payload)
                .then(function(loadedPage) {
                    componentMenuService.refreshDragAndDrop();
                    loadedPage.results = loadedPage.response;
                    delete loadedPage.response;

                    return loadedPage;
                }.bind(this));
        }.bind(this);

    })
    .component('componentsTab', {
        templateUrl: 'componentsTabTemplate.html',
        controller: 'componentsTabController',
        bindings: {
            hasMultipleContentCatalogs: '<',
            isActive: '<'
        }
    });
