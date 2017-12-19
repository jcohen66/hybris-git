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
 * @name slotVisibilityServiceModule
 * @description
 *
 * The slot visibility service module provides factories and services to manage all backend calls and loads an internal
 * structure that provides the necessary data to the slot visibility button and slot visibility component.
 */
angular.module('slotVisibilityServiceModule', ['resourceModule', 'componentHandlerServiceModule', 'cmsitemsRestServiceModule', 'crossFrameEventServiceModule'])
    /**
     * @ngdoc service
     * @name slotVisibilityServiceModule.service:SlotVisibilityService
     * @description
     *
     * The SlotVisibilityService class provides methods to interact with the backend.
     * The definition of the class is not instantiated immediately, whereas the service instance of
     * this same class (@see slotVisibilityService) returns an instance of this service definition.
     *
     * @param {Object} cmsitemsRestService Gets all components based on their UUIDs.
     * @param {Object} pagesContentSlotsComponentsResource Gets content slots and components based on their page IDs.
     * @param {Object} componentHandlerService Gets the current page ID.
     */
    .service('SlotVisibilityService', function($q, cmsitemsRestService, pagesContentSlotsComponentsResource, componentHandlerService) {

        var SlotVisibilityService = function() {};

        /**
         * Function that filters the given SlotsToComponentsMap to return only those components that are hidden in the storefront.
         * @param {Object} allSlotsToComponentsMap object containing slotId - components list.
         *
         * @return {Object} allSlotsToComponentsMap object containing slotId - components list.
         */
        SlotVisibilityService.prototype._filterVisibleComponents = function(allSlotsToComponentsMap) {

            //filter allSlotsToComponentsMap to show only hidden components
            Object.keys(allSlotsToComponentsMap).forEach(function(slotId) {

                var componentsOnDOM = [];
                componentHandlerService.getOriginalComponentsWithinSlot(slotId).get().forEach(function(component) {
                    componentsOnDOM.push(componentHandlerService.getId(component));
                });

                var hiddenComponents = allSlotsToComponentsMap[slotId].filter(function(component) {
                    return componentsOnDOM.indexOf(component.uid) === -1;
                });

                allSlotsToComponentsMap[slotId] = hiddenComponents;

            });

            return allSlotsToComponentsMap;
        };

        /**
         * Converts the provided list of pageContentSlotsComponents to slotId - components list map.
         * @param {Object} pageContentSlotsComponents object containing list of slots and components for the page in context
         */
        SlotVisibilityService.prototype._loadSlotsToComponentsMap = function(pageContentSlotsComponents) {
            var componentUuids = (pageContentSlotsComponents.pageContentSlotComponentList || [])
                .map(function(pageContentSlotComponent) {
                    return pageContentSlotComponent.componentUuid;
                });
            return cmsitemsRestService.get({
                uuids: componentUuids.join(',')
            }).then(function(components) {

                //load all components as ComponentUuid-Component map
                var allComponentsMap = (components.response || []).reduce(function(map, component) {
                    map[component.uuid] = component;
                    return map;
                }, {});

                //load all components as SlotUuid-Component[] map
                var allSlotsToComponentsMap = (pageContentSlotsComponents.pageContentSlotComponentList || [])
                    .reduce(function(map, pageContentSlotComponent) {
                        map[pageContentSlotComponent.slotId] = map[pageContentSlotComponent.slotId] || [];
                        if (allComponentsMap[pageContentSlotComponent.componentUuid]) {
                            map[pageContentSlotComponent.slotId].push(allComponentsMap[pageContentSlotComponent.componentUuid]);
                        }
                        return map;
                    }, {});

                return allSlotsToComponentsMap;
            });
        };

        SlotVisibilityService.prototype._getPagesContentSlotsComponentsPromise = function() {
            return this.hiddenComponentsMapPromise || this.reloadSlotsInfo();
        };

        /**
         * @ngdoc method
         * @name slotVisibilityServiceModule.service:SlotVisibilityService#reloadSlotInfo
         * @methodOf slotVisibilityServiceModule.service:SlotVisibilityService
         *
         * @description
         * Reloads and cache's the pagesContentSlotsComponents for the current page in context.
         * this method can be called when ever a component is added or modified to the slot so that the pagesContentSlotsComponents is re-evalated.
         *
         * @return {Promise} A promise that resolves to the pagesContentSlotsComponents for the page in context.
         */
        SlotVisibilityService.prototype.reloadSlotsInfo = function() {
            try {
                var currentPageId = componentHandlerService.getPageUID();
                this.hiddenComponentsMapPromise = pagesContentSlotsComponentsResource.get({
                    pageId: currentPageId
                });
                return this.hiddenComponentsMapPromise;
            } catch (e) {
                if (e.name === "InvalidStorefrontPageError") {
                    return $q.when({});
                } else {
                    throw e;
                }
            }

        };

        /**
         * @ngdoc method
         * @name slotVisibilityServiceModule.service:SlotVisibilityService#getSlotsForComponent
         * @methodOf slotVisibilityServiceModule.service:SlotVisibilityService
         *
         * @description
         * Returns an array of slotId's in which the provided component (identified by its componentUuid) exists.
         *
         * @param {String} componentUuid The uuid of the component.
         *
         * @return {Promise} A promise that resolves to a array of slotId's for the given componnet uuid.
         */
        SlotVisibilityService.prototype.getSlotsForComponent = function(componentUuid) {
            var slotIds = [];
            return this._getSlotToComponentsMap(true).then(function(allSlotsToComponentsMap) {
                Object.keys(allSlotsToComponentsMap).forEach(function(slotId) {
                    if (allSlotsToComponentsMap[slotId].find(function(component) {
                            return component.uuid === componentUuid;
                        })) {
                        slotIds.push(slotId);
                    }
                });

                return slotIds;
            });
        };

        /**
         * Function to load slot to component map for the current page in context
         * @param reload boolean to specify if the pagesContentSlotsComponents resource needs to be re-called.
         */
        SlotVisibilityService.prototype._getSlotToComponentsMap = function(reload) {
            return (reload ? this.reloadSlotsInfo() : this._getPagesContentSlotsComponentsPromise()).then(this._loadSlotsToComponentsMap);
        };

        /**
         * @ngdoc method
         * @name slotVisibilityServiceModule.service:SlotVisibilityService#getHiddenComponents
         * @methodOf slotVisibilityServiceModule.service:SlotVisibilityService
         *
         * @description
         * Returns the list of hidden components for a given slotId
         *
         * @param {String} slotId the slot id
         *
         * @return {Promise} A promise that resolves to a list of hidden components for the slotId
         */
        SlotVisibilityService.prototype.getHiddenComponents = function(slotId) {
            return this._getSlotToComponentsMap(false).then(this._filterVisibleComponents).then(function(hiddenComponentsMap) {
                return hiddenComponentsMap[slotId] || [];
            }, function() {
                return [];
            });
        };

        return SlotVisibilityService;

    })
    .service('slotVisibilityService', function(SlotVisibilityService, crossFrameEventService, EVENTS) {
        var instance = new SlotVisibilityService();
        crossFrameEventService.subscribe(EVENTS.PAGE_CHANGE, function() {
            instance._getSlotToComponentsMap(true);
        });
        return instance;
    });
