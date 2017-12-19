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
angular.module('editorModalServiceModule', ['genericEditorModalServiceModule', 'gatewayProxyModule', 'typeStructureRestServiceModule', 'basicTabModule', 'visibilityTabModule', 'genericTabModule', 'renderServiceModule', 'componentEditorModule', 'cmsitemsRestServiceModule', 'slotVisibilityServiceModule'])
    .factory('editorModalService', function($q, genericEditorModalService, gatewayProxy, renderService, cmsitemsRestService, slotVisibilityService) {

        function EditorModalService() {
            this.gatewayId = 'EditorModal';
            gatewayProxy.initForService(this, ["open", "openAndRerenderSlot"]);
        }

        var tabs = [{
            id: 'genericTab',
            title: 'se.cms.editortabset.generictab.title',
            templateUrl: 'genericTabTemplate.html'
        }, {
            id: 'basicTab',
            title: 'se.cms.editortabset.basictab.title',
            templateUrl: 'basicTabTemplate.html'
        }, {
            id: 'visibilityTab',
            title: 'se.cms.editortabset.visibilitytab.title',
            templateUrl: 'visibilityTabTemplate.html'
        }];

        var _createComponentData = function(componentAttributes, targetSlotId, position) {
            var type;
            try {
                type = componentAttributes.smarteditComponentType.toLowerCase();
            } catch (e) {
                throw "editorModalService._createComponentData - invalid component type in componentAttributes." + e;
            }
            return {
                componentId: componentAttributes.smarteditComponentId,
                componentUuid: componentAttributes.smarteditComponentUuid,
                componentType: componentAttributes.smarteditComponentType,
                title: 'type.' + type + '.name',
                catalogVersionUuid: componentAttributes.catalogVersionUuid,
                targetSlotId: targetSlotId,
                position: targetSlotId ? position : undefined
            };
        };

        var _setActiveTab = function(tabs, selectedTabId) {
            tabs.map(function(tab) {
                tab.active = (tab.id === selectedTabId);
                return tab.active;
            });
        };

        EditorModalService.prototype.openAndRerenderSlot = function(componentType, componentUuid, slotId, selectedTabId) {

            var componentAttributes = {
                smarteditComponentType: componentType,
                smarteditComponentUuid: componentUuid
            };

            var componentData = _createComponentData(componentAttributes);

            _setActiveTab(tabs, selectedTabId);

            return genericEditorModalService.open(componentData, tabs, function() {
                slotVisibilityService.getSlotsForComponent(componentData.componentUuid).then(function(slotIds) {
                    renderService.renderSlots(slotIds);
                });
            });

        };

        EditorModalService.prototype.open = function(_componentAttributes, _targetSlotId, position, selectedTabTitle) {

            return legacyMode(_componentAttributes, _targetSlotId, position).then(function(componentAttributes) {
                var componentData = _createComponentData(componentAttributes, componentAttributes.targetSlotId, position);

                _setActiveTab(tabs, selectedTabTitle);

                return genericEditorModalService.open(componentData, tabs, function() {
                    if (componentData.componentId) {
                        return slotVisibilityService.getSlotsForComponent(componentData.componentUuid).then(function(slotIds) {
                            renderService.renderSlots(slotIds);
                        });
                    }
                });

            });
        };


        //@deprecated since 6.4
        //old signature of EditorModalService.prototype.open was componentType, componentId
        function legacyMode(_componentAttributes /*is componentType in legacy mode*/ , _targetSlotId /*is componentId in legacy mode*/ ) {

            var retunedValue;
            if (typeof _componentAttributes === 'string') {

                var componentType = _componentAttributes;
                var componentUID = _targetSlotId !== 0 ? _targetSlotId : undefined;
                if (componentUID) {
                    retunedValue = cmsitemsRestService._getByUIdAndType(componentUID, _componentAttributes).then(function(component) {
                        return {
                            smarteditComponentType: componentType,
                            smarteditComponentId: component.uid,
                            smarteditComponentUuid: component.uuid
                        };
                    });
                } else {
                    retunedValue = {
                        smarteditComponentType: componentType
                    };
                }
            } else {
                retunedValue = _componentAttributes;
                retunedValue.targetSlotId = _targetSlotId;
            }

            return $q.when(retunedValue);
        }


        return new EditorModalService();
    });
