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
angular.module('cmssmarteditContainer', [
        'experienceInterceptorModule',
        'resourceLocationsModule',
        'cmssmarteditContainerTemplates',
        'featureServiceModule',
        'componentMenuModule',
        'cmscommonsTemplates',
        'restrictionsMenuModule',
        'pageInfoMenuModule',
        'editorModalServiceModule',
        'genericEditorModule',
        'eventServiceModule',
        'catalogDetailsModule',
        'synchronizeCatalogModule',
        'perspectiveServiceModule',
        'pageListLinkModule',
        'pageListControllerModule',
        'clientPagedListModule',
        'assetsServiceModule',
        'navigationEditorModule',
        'slotRestrictionsServiceModule',
        'cmsDragAndDropServiceModule',
        'seMediaFieldModule',
        'seMediaContainerFieldModule',
        'editorFieldMappingServiceModule',
        'navigationNodeEditorModule',
        'entrySearchSelectorModule',
        'pageRestrictionsModule',
        'restrictionsEditorModule',
        'yActionableSearchItemModule',
        'seNavigationNodeSelector',
        'pageSyncMenuToolbarItemModule',
        'synchronizationPollingServiceModule',
        'productSelectorModule',
        'categorySelectorModule',
        'urlServiceModule',
        'clonePageWizardServiceModule',
        'cmsLinkToSelectModule',
        'permissionServiceModule',
        'rulesAndPermissionsRegistrationModule',
        'catalogServiceModule',
        'experienceServiceModule',
        'sharedDataServiceModule',
        'singleActiveCatalogAwareItemSelectorModule',
        'productCatalogDropdownPopulatorModule',
        'productDropdownPopulatorModule',
        'categoryDropdownPopulatorModule',
        'cmsItemDropdownModule',
        'catalogAwareRouteResolverModule',
        'catalogVersionPermissionModule',
        'componentRestrictionsEditorModule',
        'linkToggleModule',
        'functionsModule',
        'componentVisibilityAlertServiceModule'
    ])
    .config(function(PAGE_LIST_PATH, NAVIGATION_MANAGEMENT_PAGE_PATH, $routeProvider, catalogAwareRouteResolverFunctions) {
        $routeProvider.when(PAGE_LIST_PATH, {
            templateUrl: 'pageListTemplate.html',
            controller: 'pageListController',
            controllerAs: 'pageListCtl',
            resolve: {
                setExperience: catalogAwareRouteResolverFunctions.setExperience
            }
        });
        $routeProvider.when(NAVIGATION_MANAGEMENT_PAGE_PATH, {
            templateUrl: 'navigationTemplate.html',
            controller: 'navigationController',
            controllerAs: 'nav',
            resolve: {
                setExperience: catalogAwareRouteResolverFunctions.setExperience
            }
        });
    })

.controller('navigationController', function($routeParams, urlService, permissionService, CONTEXT_CATALOG_VERSION, CONTEXT_SITE_ID, catalogService) {
        this.uriContext = urlService.buildUriContext($routeParams.siteId, $routeParams.catalogId, $routeParams.catalogVersion);
        this.catalogName = "";
        this.catalogVersion = this.uriContext[CONTEXT_CATALOG_VERSION];

        permissionService.isPermitted([{
            names: ['se.edit.navigation']
        }]).then(function(isPermissionGranted) {
            this.readOnly = !isPermissionGranted;
        }.bind(this), function(e) {
            throw e;
        });

        catalogService.getContentCatalogsForSite(this.uriContext[CONTEXT_SITE_ID]).then(function(catalogs) {
            this.catalogName = catalogs.filter(function(catalog) {
                return catalog.catalogId === $routeParams.catalogId;
            }.bind(this))[0].name;
        }.bind(this));
    })
    .run(
        /* jshint -W098*/
        /*need to inject for gatewayProxy initialization of componentVisibilityAlertService*/
        function($log, $rootScope, $routeParams, NAVIGATION_MANAGEMENT_PAGE_PATH, ComponentService, systemEventService, catalogDetailsService, featureService, perspectiveService, assetsService, editorFieldMappingService, cmsDragAndDropService, editorModalService, clonePageWizardService, CATALOG_DETAILS_COLUMNS, sanitize, componentVisibilityAlertService) {

            // Add the mapping for the generic editor.
            editorFieldMappingService.addFieldMapping('EntrySearchSelector', null, null, {
                template: 'entrySearchSelectorTemplate.html'
            });

            editorFieldMappingService.addFieldMapping('Media', null, null, {
                template: 'mediaTemplate.html'
            });

            editorFieldMappingService.addFieldMapping('MediaContainer', null, null, {
                template: 'mediaContainerTemplate.html'
            });

            editorFieldMappingService.addFieldMapping('NavigationNodeSelector', null, null, {
                template: 'navigationNodeSelectorWrapperTemplate.html'
            });

            editorFieldMappingService.addFieldMapping('MultiProductSelector', null, null, {
                template: 'multiProductSelectorTemplate.html'
            });

            editorFieldMappingService.addFieldMapping('MultiCategorySelector', null, null, {
                template: 'multiCategorySelectorTemplate.html'
            });

            editorFieldMappingService.addFieldMapping('CMSLinkToSelect', null, null, {
                template: 'cmsLinkToSelectWrapperTemplate.html'
            });

            editorFieldMappingService.addFieldMapping('SingleOnlineProductSelector', null, null, {
                template: 'singleActiveCatalogAwareItemSelectorWrapperTemplate.html'
            });

            editorFieldMappingService.addFieldMapping('SingleOnlineCategorySelector', null, null, {
                template: 'singleActiveCatalogAwareItemSelectorWrapperTemplate.html'
            });

            editorFieldMappingService.addFieldMapping('CMSItemDropdown', null, null, {
                template: 'cmsItemDropdownWrapperTemplate.html'
            });

            editorFieldMappingService.addFieldMapping('CMSComponentRestrictionsEditor', null, null, {
                template: 'componentRestrictionsEditorWrapperTemplate.html'
            });

            editorFieldMappingService.addFieldMapping('LinkToggle', null, null, {
                template: 'linkToggleWrapperTemplate.html',
                customSanitize: function(payload, sanitizeFn) {
                    if (sanitizeFn === undefined) {
                        sanitizeFn = sanitize;
                    }
                    payload.urlLink = sanitizeFn(payload.urlLink);
                }
            });

            featureService.addToolbarItem({
                toolbarId: 'experienceSelectorToolbar',
                key: 'se.cms.componentMenuTemplate',
                type: 'HYBRID_ACTION',
                nameI18nKey: 'se.cms.componentmenu.btn.label.addcomponent',
                descriptionI18nKey: 'cms.toolbaritem.componentmenutemplate.description',
                priority: 1,
                section: 'left',
                iconClassName: 'hyicon hyicon-addlg se-toolbar-menu-ddlb--button__icon',
                callback: function() {
                    systemEventService.sendSynchEvent('ySEComponentMenuOpen', {});
                },
                include: 'componentMenuWrapperTemplate.html',
                permissions: ['se.add.component'],
                keepAliveOnClose: true
            });

            featureService.addToolbarItem({
                toolbarId: 'experienceSelectorToolbar',
                key: 'se.cms.restrictionsMenu',
                type: 'HYBRID_ACTION',
                nameI18nKey: 'se.cms.restrictions.toolbar.menu',
                priority: 2,
                section: 'left',
                iconClassName: 'hyicon hyicon-restrictions se-toolbar-menu-ddlb--button__icon',
                include: 'pageRestrictionsMenuToolbarItemWrapperTemplate.html',
                permissions: ['se.read.restriction']
            });

            featureService.addToolbarItem({
                toolbarId: 'experienceSelectorToolbar',
                key: 'se.cms.pageInfoMenu',
                type: 'HYBRID_ACTION',
                nameI18nKey: 'se.cms.pageinfo.menu.btn.label',
                descriptionI18nKey: 'cms.toolbarItem.pageInfoMenu.description',
                priority: 3,
                section: 'left',
                iconClassName: 'hyicon hyicon-info se-toolbar-menu-ddlb--button__icon',
                include: 'pageInfoMenuToolbarItemWrapperTemplate.html',
                permissions: ['se.read.page']
            });

            featureService.addToolbarItem({
                toolbarId: 'experienceSelectorToolbar',
                key: 'se.cms.clonePageMenu',
                type: 'ACTION',
                nameI18nKey: 'se.cms.clonepage.menu.btn.label',
                iconClassName: 'hyicon hyicon-clone se-toolbar-menu-ddlb--button__icon',
                callback: function() {
                    clonePageWizardService.openClonePageWizard();
                },
                priority: 4,
                section: 'left',
                permissions: ['se.clone.page']
            });

            featureService.addToolbarItem({
                toolbarId: 'experienceSelectorToolbar',
                key: 'se.cms.pageSyncMenu',
                nameI18nKey: 'se.cms.toolbaritem.pagesyncmenu.name',
                type: 'TEMPLATE',
                include: 'pageSyncMenuToolbarItemWrapperTemplate.html',
                priority: 5,
                section: 'left',
                permissions: ['se.sync.page']
            });

            catalogDetailsService.addItems([{
                include: 'pageListLinkTemplate.html'
            }, {
                include: 'navigationEditorLinkTemplate.html'
            }]);

            catalogDetailsService.addItems([{
                include: 'catalogDetailsSyncTemplate.html'
            }], CATALOG_DETAILS_COLUMNS.RIGHT);

            featureService.register({
                key: 'se.cms.html5DragAndDrop.outer',
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

            perspectiveService.register({
                key: 'se.cms.perspective.basic',
                nameI18nKey: 'se.cms.perspective.basic.name',
                descriptionI18nKey: 'se.cms.perspective.basic.description',
                features: ['se.contextualMenu', 'se.cms.dragandropbutton', 'se.cms.remove', 'se.cms.edit', 'se.cms.componentMenuTemplate', 'se.cms.restrictionsMenu', 'se.cms.clonePageMenu', 'se.cms.pageInfoMenu', 'se.emptySlotFix', 'se.cms.html5DragAndDrop', 'disableSharedSlotEditing', 'sharedSlotDisabledDecorator', 'se.cms.html5DragAndDrop.outer', 'externalComponentDecorator', 'externalcomponentbutton', 'externalSlotDisabledDecorator'],
                perspectives: []
            });

            /* Note: For advance edit mode, the ordering of the entries in the features list will determine the order the buttons will show in the slot contextual menu */
            perspectiveService.register({
                key: 'se.cms.perspective.advanced',
                nameI18nKey: 'se.cms.perspective.advanced.name',
                descriptionI18nKey: 'se.cms.perspective.advanced.description',
                features: ['se.slotContextualMenu', 'se.slotSyncButton', 'se.slotSharedButton', 'se.slotContextualMenuVisibility', 'se.contextualMenu', 'se.cms.dragandropbutton', 'se.cms.remove', 'se.cms.edit', 'se.cms.componentMenuTemplate', 'se.cms.restrictionsMenu', 'se.cms.clonePageMenu', 'se.cms.pageInfoMenu', 'se.cms.pageSyncMenu', 'se.emptySlotFix', 'se.cms.html5DragAndDrop', 'se.cms.html5DragAndDrop.outer', 'syncIndicator', 'externalSlotDisabledDecorator', 'externalComponentDecorator', 'externalcomponentbutton'],
                perspectives: []
            });

        });
