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
 * @name componentEditingFacadeModule
 * @description
 * # The componentEditingFacadeModule
 *
 * The componentEditingFacadeModule contains a service with methods that allow adding or removing components in the page.
 *
 */
angular.module('componentEditingFacadeModule', [
    'alertServiceModule',
    'componentServiceModule',
    'componentVisibilityAlertServiceModule',
    'editorModalServiceModule',
    'renderServiceModule',
    'restServiceFactoryModule',
    'slotVisibilityServiceModule',
    'translationServiceModule'
])

/**
 * @ngdoc service
 * @name componentEditingFacadeModule.service:componentEditingFacade
 *
 * @description
 * This service provides methods that allow adding or removing components in the page.
 */
.service('componentEditingFacade', function($q, ComponentService, componentHandlerService, restServiceFactory, editorModalService, removeComponentService, renderService, alertService, PAGES_CONTENT_SLOT_COMPONENT_RESOURCE_URI, componentVisibilityAlertService, slotVisibilityService) {

    var _contentSlotComponentsRestService;

    function _generateSuccessMessage(sourceComponentId, targetSlotId) {
        return {
            message: "se.cms.draganddrop.success",
            messagePlaceholders: {
                sourceComponentId: sourceComponentId,
                targetSlotId: targetSlotId
            }
        };
    }

    function _generateErrorMessage(sourceComponentId, targetSlotId, requestResponse) {
        var detailedError = (requestResponse.data && requestResponse.data.errors && requestResponse.data.errors.length > 0) ?
            requestResponse.data.errors[0].message : "";

        return {
            message: "se.cms.draganddrop.error",
            messagePlaceholders: {
                sourceComponentId: sourceComponentId,
                targetSlotId: targetSlotId,
                detailedError: detailedError
            }
        };
    }

    /**
     * @ngdoc method
     * @name componentEditingFacadeModule.service:componentEditingFacade#addNewComponentToSlot
     * @methodOf componentEditingFacadeModule.service:componentEditingFacade
     *
     * @description
     * This methods adds a new component to the slot and opens a component modal to edit its properties.
     *
     * @param {Object} slotInfo The target slot for the new component
     * @param {Object} slotInfo.targetSlotId The Uid of the slot where to drop the new component.
     * @param {Object} slotInfo.targetSlotUUId The UUid of the slot where to drop the new component.
     * @param {String} catalogVersionUuid The catalog version on which to create the new component
     * @param {String} componentType The type of the new component to add.
     * @param {Number} position The position in the slot where to add the new component.
     *
     */
    this.addNewComponentToSlot = function(slotInfo, catalogVersionUuid, componentType, position) {

        var componentAttributes = {
            smarteditComponentType: componentType,
            catalogVersionUuid: catalogVersionUuid
        };

        return editorModalService.open(componentAttributes, slotInfo.targetSlotUUId, position).then(function(response) {

            alertService.showSuccess(_generateSuccessMessage(response.uid, slotInfo.targetSlotId));

            renderService.renderSlots([slotInfo.targetSlotId]).then(function() {
                slotVisibilityService.reloadSlotsInfo();
            });
        }).catch(function(response) {
            var errorMessageObject = _generateErrorMessage(0, slotInfo.targetSlotId, response);
            alertService.showDanger(errorMessageObject);
        }.bind(this));
    };

    /**
     * @ngdoc method
     * @name componentEditingFacadeModule.service:componentEditingFacade#addExistingComponentToSlot
     * @methodOf componentEditingFacadeModule.service:componentEditingFacade
     *
     * @description
     * This methods adds an existing component to the slot and display an Alert whenever the component is either hidden or restricted.
     *
     * @param {String} targetSlotId The ID of the slot where to drop the component.
     * @param {Object} dragInfo The dragInfo object containing the componentId, componentUuid and componentType.
     * @param {Number} position The position in the slot where to add the component.
     *
     */
    this.addExistingComponentToSlot = function(targetSlotId, dragInfo, position) {
        var pageId = componentHandlerService.getPageUID();

        return ComponentService.addExistingComponent(pageId, dragInfo.componentId, targetSlotId, position).then(

            function() {
                return ComponentService.loadComponentItem(dragInfo.componentUuid).then(function(item) {
                    componentVisibilityAlertService.checkAndAlertOnComponentVisibility({
                        itemId: dragInfo.componentUuid,
                        itemType: dragInfo.componentType,
                        catalogVersion: item.catalogVersion,
                        restricted: item.restricted,
                        slotId: targetSlotId,
                        visible: item.visible
                    });

                    alertService.showSuccess(_generateSuccessMessage(dragInfo.componentId, targetSlotId));

                    renderService.renderSlots(targetSlotId).then(function() {
                        slotVisibilityService.reloadSlotsInfo();
                    });

                });
            },

            function(response) {
                var errorMessageObject = _generateErrorMessage(dragInfo.componentId, targetSlotId, response);
                alertService.showDanger(errorMessageObject);
                return $q.reject();
            }.bind(this)

        );
    };


    /**
     * @ngdoc method
     * @name componentEditingFacadeModule.service:componentEditingFacade#moveComponent
     * @methodOf componentEditingFacadeModule.service:componentEditingFacade
     *
     * @description
     * This methods moves a component from two slots in a page.
     *
     * @param {String} sourceSlotId The ID of the slot where the component is initially located.
     * @param {String} targetSlotId The ID of the slot where to drop the component.
     * @param {String} componentId The ID of the component to add into the slot.
     * @param {Number} position The position in the slot where to add the component.
     *
     */
    this.moveComponent = function(sourceSlotId, targetSlotId, componentId, position) {
        var contentSlotComponentsResourceLocation = PAGES_CONTENT_SLOT_COMPONENT_RESOURCE_URI + '/pages/:pageId/contentslots/:currentSlotId/components/:componentId';
        _contentSlotComponentsRestService = _contentSlotComponentsRestService || restServiceFactory.get(contentSlotComponentsResourceLocation, 'componentId');
        return _contentSlotComponentsRestService.update({
            pageId: componentHandlerService.getPageUID(),
            currentSlotId: sourceSlotId,
            componentId: componentId,
            slotId: targetSlotId,
            position: position
        }).then(
            function() {
                renderService.renderSlots([sourceSlotId, targetSlotId]).then(function() {
                    slotVisibilityService.reloadSlotsInfo();
                });
            },
            function(response) {
                var errorMessageObject = (response === undefined) ? {
                        message: "se.cms.draganddrop.move.failed",
                        messagePlaceholders: {
                            slotID: targetSlotId,
                            componentID: componentId
                        }
                    } :
                    _generateErrorMessage(componentId, targetSlotId, response);

                alertService.showDanger(errorMessageObject);

            }.bind(this)
        );
    };

});
