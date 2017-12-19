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
angular.module('cmssmartedit', [
    'resourceLocationsModule',
    'decoratorServiceModule',
    'contextualMenuServiceModule',
    'removeComponentServiceModule',
    'experienceInterceptorModule',
    'editorEnablerServiceModule',
    'alertServiceModule',
    'translationServiceModule',
    'featureServiceModule',
    'slotVisibilityButtonModule',
    'slotVisibilityServiceModule',
    'cmssmarteditTemplates',
    'cmscommonsTemplates',
    'componentHandlerServiceModule',
    'assetsServiceModule',
    'slotSharedButtonModule',
    'cmsDragAndDropServiceModule',
    'syncIndicatorDecoratorModule',
    'slotSyncButtonModule',
    'synchronizationPollingServiceModule',
    'confirmationModalServiceModule',
    'sharedSlotDisabledDecoratorModule',
    'externalSlotDisabledDecoratorModule',
    'slotRestrictionsServiceModule',
    'slotSharedServiceModule',
    'contextualMenuDropdownServiceModule',
    'externalComponentDecoratorModule',
    'externalComponentButtonModule'
])

.run(
    // Note: only instances can be injected in a run function
    function($rootScope, $q, $translate,
        alertService,
        assetsService,
        cmsDragAndDropService,
        componentHandlerService,
        confirmationModalService,
        contextualMenuService,
        decoratorService,
        editorEnablerService,
        featureService,
        removeComponentService,
        slotRestrictionsService,
        slotSharedService,
        slotVisibilityService) {

        editorEnablerService.enableForComponents(['^.*Component$']);

        decoratorService.addMappings({
            '^((?!Slot).)*$': ['se.contextualMenu', 'externalComponentDecorator'],
            '^.*Slot$': ['se.slotContextualMenu', 'se.basicSlotContextualMenu', 'syncIndicator', 'sharedSlotDisabledDecorator', 'externalSlotDisabledDecorator']
        });

        featureService.addContextualMenuButton({
            key: 'externalcomponentbutton',
            nameI18nKey: 'se.cms.contextmenu.title.externalcomponent',
            i18nKey: 'se.cms.contextmenu.title.externalcomponentbutton',
            regexpKeys: ['^((?!Slot).)*$'],
            condition: function(configuration) {
                return componentHandlerService.isExternalComponent(configuration.componentId, configuration.componentType);
            },
            callbacks: {},
            action: {
                template: '<external-component-button data-catalog-version-uuid="ctrl.componentAttributes.smarteditCatalogVersionUuid"></external-component-button>'
            },
            callback: function() {},
            displayClass: 'externalcomponentbutton',
            displayIconClass: 'hyicon hyicon-globe',
            displaySmallIconClass: 'hyicon hyicon-globe'
        });

        featureService.addContextualMenuButton({
            key: 'se.cms.dragandropbutton',
            nameI18nKey: 'se.cms.contextmenu.title.dragndrop',
            i18nKey: 'se.cms.contextmenu.title.dragndrop',
            regexpKeys: ['^((?!Slot).)*$'],
            condition: function(configuration) {
                var slotId = componentHandlerService.getParentSlotForComponent(configuration.element);
                return slotRestrictionsService.isSlotEditable(slotId);
            },
            callback: function() {},
            callbacks: {
                mousedown: function() {
                    cmsDragAndDropService.update();
                }
            },
            displayClass: 'movebutton',
            displayIconClass: 'hyicon hyicon-dragdroplg',
            displaySmallIconClass: 'hyicon hyicon-dragdroplg',
            permissions: ['se.context.menu.drag.and.drop.component']
        });

        featureService.register({
            key: 'se.cms.html5DragAndDrop',
            nameI18nKey: 'se.cms.dragAndDrop.name',
            descriptionI18nKey: 'se.cms.dragAndDrop.description',
            enablingCallback: function() {
                cmsDragAndDropService.register();
                cmsDragAndDropService.apply();
            },
            disablingCallback: function() {
                cmsDragAndDropService.unregister();
            }
        });

        featureService.addContextualMenuButton({
            key: 'se.cms.remove',
            i18nKey: 'se.cms.contextmenu.title.remove',
            nameI18nKey: 'se.cms.contextmenu.title.remove',
            regexpKeys: ['^((?!Slot).)*$'],
            condition: function(configuration) {
                var slotId = componentHandlerService.getParentSlotForComponent(configuration.element);
                return slotRestrictionsService.isSlotEditable(slotId);
            },
            callback: function(configuration, $event) {
                var slotOperationRelatedId = componentHandlerService.getSlotOperationRelatedId(configuration.element);
                var slotOperationRelatedType = componentHandlerService.getSlotOperationRelatedType(configuration.element);

                var message = {};
                message.description = "se.cms.contextmenu.removecomponent.confirmation.message";
                message.title = "se.cms.contextmenu.removecomponent.confirmation.title";

                confirmationModalService.confirm(message).then(function() {
                    removeComponentService.removeComponent({
                        slotId: configuration.slotId,
                        componentId: configuration.componentId,
                        componentType: configuration.componentType,
                        slotOperationRelatedId: slotOperationRelatedId,
                        slotOperationRelatedType: slotOperationRelatedType,
                    }).then(
                        function() {
                            slotVisibilityService.reloadSlotsInfo();
                            $translate('se.cms.alert.component.removed.from.slot', {
                                componentID: slotOperationRelatedId,
                                slotID: configuration.slotId
                            }).then(function(translation) {
                                alertService.showSuccess({
                                    message: translation
                                });
                                $event.preventDefault();
                                $event.stopPropagation();
                            });
                        });
                });
            },
            displayClass: 'removebutton',
            displayIconClass: 'hyicon hyicon-removelg',
            displaySmallIconClass: 'hyicon hyicon-removelg',
            permissions: ['se.context.menu.remove.component']
        });

        featureService.addContextualMenuButton({
            key: 'se.slotContextualMenuVisibility',
            nameI18nKey: 'slotcontextmenu.title.visibility',
            regexpKeys: ['^.*ContentSlot$'],
            callback: function() {},
            templateUrl: 'slotVisibilityWidgetTemplate.html',
            permissions: ['se.slot.context.menu.visibility']
        });

        featureService.addContextualMenuButton({
            key: 'se.slotSharedButton',
            nameI18nKey: 'slotcontextmenu.title.shared.button',
            regexpKeys: ['^.*Slot$'],
            callback: function() {},
            templateUrl: 'slotSharedTemplate.html',
            permissions: ['se.slot.context.menu.shared.icon']
        });

        featureService.addContextualMenuButton({
            key: 'se.slotSyncButton',
            nameI18nKey: 'slotcontextmenu.title.sync.button',
            regexpKeys: ['^.*Slot$'],
            callback: function() {},
            templateUrl: 'slotSyncTemplate.html',
            permissions: ['se.sync.slot.context.menu']
        });

        featureService.addDecorator({
            key: 'syncIndicator',
            nameI18nKey: 'syncIndicator',
            permissions: ['se.sync.slot.indicator']
        });

        featureService.register({
            key: 'disableSharedSlotEditing',
            nameI18nKey: 'se.cms.disableSharedSlotEditing',
            descriptionI18nKey: 'se.cms.disableSharedSlotEditing.description',
            enablingCallback: function() {
                slotSharedService.setSharedSlotEnablementStatus(true);
            },
            disablingCallback: function() {
                slotSharedService.setSharedSlotEnablementStatus(false);
            }
        });

        featureService.addDecorator({
            key: 'sharedSlotDisabledDecorator',
            nameI18nKey: 'se.cms.shared.slot.disabled.decorator',
            displayCondition: function(componentType, componentId) {
                return slotRestrictionsService.isSlotEditable(componentId).then(function(isEditable) {
                    return !isEditable;
                });
            }
        });

        featureService.addDecorator({
            key: 'externalSlotDisabledDecorator',
            nameI18nKey: 'se.cms.external.slot.disabled.decorator',
            displayCondition: function(componentType, componentId) {
                return $q.when(componentHandlerService.isExternalComponent(componentId, componentType));
            }
        });

        featureService.addDecorator({
            key: 'externalComponentDecorator',
            nameI18nKey: 'se.cms.external.component.decorator',
            displayCondition: function(componentType, componentId) {
                return $q.when(componentHandlerService.isExternalComponent(componentId, componentType));
            }
        });

    });
