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
/* jshint unused:false, undef:false */
describe('pageListController for a non active catalogVersion', function() {

    var $rootScope, $q;
    var controller, mocks;
    var uriContext = "uriContext";
    var pageUriContext = "pageUriContext";

    var MOCK_UPDATED_NUMBER_OF_RESTRICTIONS = 7;

    beforeEach(module(function($provide) {
        $provide.value("CONTEXT_CATALOG", "CONTEXT_CATALOG");
        $provide.value("CONTEXT_CATALOG_VERSION", "CONTEXT_CATALOG_VERSION");
        $provide.value("STOREFRONT_PATH_WITH_PAGE_ID", "STOREFRONT_PATH_WITH_PAGE_ID");
        $provide.value("LANDING_PAGE_PATH", "LANDING_PAGE_PATH");
        $provide.value("CONTEXT_SITE_ID", "CONTEXT_SITE_ID");
        $provide.value("PAGE_CONTEXT_SITE_ID", "PAGE_CONTEXT_SITE_ID");
        $provide.value("PAGE_CONTEXT_CATALOG", "PAGE_CONTEXT_CATALOG");
        $provide.value("PAGE_CONTEXT_CATALOG_VERSION", "PAGE_CONTEXT_CATALOG_VERSION");
    }));

    beforeEach(function() {
        var harness = AngularUnitTestHelper.prepareModule('pageListControllerModule')
            .mock('pageListService', 'getPageListForCatalog').and.returnResolvedPromise([{
                uid: '12345',
                label: 'original label',
                name: 'name',
                typeCode: 'ContentPage',
                template: 'ContentPageTemplate',
                modifiedtime: null,
                creationtime: null
            }])
            .mock('pageListService', 'getPageById').and.returnResolvedPromise({
                uid: '12345',
                label: 'updated label'
            })
            .mock('urlService', 'buildUriContext').and.returnResolvedPromise(uriContext)
            .mock('urlService', 'buildPageUriContext').and.returnResolvedPromise(pageUriContext)
            .mock('catalogService', 'getContentCatalogsForSite').and.returnResolvedPromise([])
            .mock('catalogService', 'isContentCatalogVersionNonActive').and.returnResolvedPromise(true)
            .mock('experienceService', 'buildDefaultExperience').and.returnResolvedPromise('')
            .mock('syncPageModalService', 'open').and.returnResolvedPromise('')
            .mock('clonePageWizardService', 'openClonePageWizard').and.returnResolvedPromise('')
            .mock('pageEditorModalService', 'open').and.returnResolvedPromise('')
            .mock('sharedDataService', 'set').and.returnResolvedPromise('')
            .mock('pageRestrictionsService', 'getPageRestrictionsCountMapForCatalogVersion').and.returnResolvedPromise({
                12345: 1
            })
            .mock('pageRestrictionsService', 'getPageRestrictionsCountForPageUID').and.returnResolvedPromise(MOCK_UPDATED_NUMBER_OF_RESTRICTIONS)
            .mock('systemEventService', 'sendAsynchEvent')
            .mock('addPageWizardService', 'openAddPageWizard')
            .mock('syncPollingService', 'initSyncPolling')
            .controller('pageListController');

        controller = harness.controller;
        mocks = harness.mocks;
        $q = harness.injected.$q;
        $rootScope = harness.injected.$rootScope;

    });

    describe('init', function() {
        it('should initialize a list of dropdown items', function() {
            expect(controller.dropdownItems).toEqual([{
                key: 'se.cms.pagelist.dropdown.edit',
                callback: jasmine.any(Function)
            }, {
                key: 'se.cms.pagelist.dropdown.sync',
                callback: jasmine.any(Function)
            }, {
                key: 'se.cms.pagelist.dropdown.clone',
                callback: jasmine.any(Function)
            }]);
        });


        it('should initialize a list of dropdown items', function() {

            expect(controller.keys).toEqual([{
                property: 'name',
                i18n: 'se.cms.pagelist.headerpagename'
            }, {
                property: 'uid',
                i18n: 'se.cms.pagelist.headerpageid'
            }, {
                property: 'typeCode',
                i18n: 'se.cms.pagelist.headerpagetype'
            }, {
                property: 'template',
                i18n: 'se.cms.pagelist.headerpagetemplate'
            }, {
                property: 'numberOfRestrictions',
                i18n: 'se.cms.pagelist.headerrestrictions'
            }, {
                property: 'syncStatus',
                i18n: 'se.cms.pagelist.dropdown.sync'
            }]);
        });

        it('should open page editor the edit page dropdown item is called', function() {
            var pageData = {
                uid: '1223'
            };
            controller.dropdownItems[0].callback(pageData);
            expect(mocks.pageEditorModalService.open).toHaveBeenCalledWith(pageData);
        });

        it('should display the expected number of pages as fetched from the backend', function() {
            expect(controller.pages.length).toBe(1);
        });

        it('should provide the page name for each page object in the list of pages', function() {
            expect(controller.pages[0].name).toBe('name');
        });

        it('should provide the page uid for each page object in the list of pages', function() {
            expect(controller.pages[0].uid).toBe('12345');
        });

        it('should provide the page type code for each page object in the list of pages', function() {
            expect(controller.pages[0].typeCode).toBe('ContentPage');
        });

        it('should provide the page template for each page object in the list of pages', function() {
            expect(controller.pages[0].template).toBe('ContentPageTemplate');
        });

        it('should provide the number of restrictions for each page object in the list of pages', function() {
            expect(controller.pages[0].numberOfRestrictions).toBe(1);
        });

    });

    describe('reloadUpdatedPage', function() {
        it('should refresh the page in the list for the corresponding UID on reloadUpdatedPage', function() {
            controller.reloadUpdatedPage('12345', '12345');
            $rootScope.$digest();
            expect(controller.pages[0].label).toBe('updated label');

        });

        it('should refresh the page in the list for an updated page UID', function() {
            mocks.pageListService.getPageById.and.returnValue($q.when({
                'uid': '11111',
                'label': 'updated label'
            }));

            controller.reloadUpdatedPage('12345', '11111');
            $rootScope.$digest();
            expect(controller.pages[0].uid).toBe('11111');
        });

        it('should update the number of restrictions for the corresponding UID', function() {
            controller.reloadUpdatedPage('12345', '12345');
            $rootScope.$digest();
            expect(controller.pages[0].numberOfRestrictions).toBe(MOCK_UPDATED_NUMBER_OF_RESTRICTIONS);
        });
    });
});
