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
(function() {
    angular.module('visibilityTabModule', ['genericEditorModule', 'resourceLocationsModule', 'componentEditorModule', 'eventServiceModule', 'seConstantsModule'])
        .controller('visibilityTabCtrl', function(systemEventService, COMPONENT_EDITOR_TAB_CONTENT_CHANGED_EVENT, GENERIC_EDITOR_UNRELATED_VALIDATION_MESSAGES_EVENT, VALIDATION_MESSAGE_TYPES) {

            this.$onInit = function() {

                this.showDisclaimer = false;

                this.tabStructure = [{
                    cmsStructureType: 'Boolean',
                    qualifier: 'visible',
                    prefixText: 'se.cms.visible.prefix.text',
                    labelText: 'se.cms.visible.postfix.text'
                }, {
                    cmsStructureType: 'CMSComponentRestrictionsEditor',
                    qualifier: 'restrictions',
                    i18nKey: 'se.cms.display.conditions.header.restrictions'
                }];

                //initialize default content if there is not componentId associated
                if (!this.componentId) {
                    this.content = {
                        onlyOneRestrictionMustApply: false,
                        restrictions: []
                    };
                }

                this.handleComponentEditorChange = function(eventId, data) {
                    if (data.tabId === this.tabId) {
                        this.showDisclaimer = !!data.component && !data.component.visible;
                    }
                };

                this.handleUnrelatedMessagesEvent = function(eventId, data) {
                    var restrictionRelatedError = data.messages.filter(function(message) {
                        return message.type === VALIDATION_MESSAGE_TYPES.VALIDATION_ERROR;
                    }).find(function(message) {
                        return message.subject.indexOf('restrictions') === 0;
                    });

                    if (restrictionRelatedError) {
                        systemEventService.sendAsynchEvent("EDITOR_IN_ERROR_EVENT", this.tabId);
                    }
                };

                this.unregisterChangeEvent = systemEventService.registerEventHandler(COMPONENT_EDITOR_TAB_CONTENT_CHANGED_EVENT, this.handleComponentEditorChange.bind(this));
                this.unregisterUnrelatedMessagesEvent = systemEventService.registerEventHandler(GENERIC_EDITOR_UNRELATED_VALIDATION_MESSAGES_EVENT, this.handleUnrelatedMessagesEvent.bind(this));
            };

            this.$onDestroy = function() {
                this.unregisterChangeEvent();
                this.unregisterUnrelatedMessagesEvent();
            };

        })
        .component('visibilityTab', {
            transclude: false,
            templateUrl: 'componentEditorWrapperTemplate.html',
            controller: 'visibilityTabCtrl',
            bindings: {
                saveTab: '=',
                resetTab: '=',
                cancelTab: '=',
                isDirtyTab: '=',
                componentId: '<',
                componentType: '<',
                tabId: '<',
                componentInfo: '<'
            }
        });
})();
