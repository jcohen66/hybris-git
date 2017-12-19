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
describe('Page List', function() {

    var FIRST_CATALOG_NAME = 'APPAREL UK CONTENT CATALOG - ONLINE';

    var pageList = e2e.pageObjects.PageList;
    var landingPage = e2e.pageObjects.landingPage;

    beforeEach(function() {

        browser.bootstrap(__dirname);

    });

    beforeEach(function() {
        landingPage.actions.navigateToFirstOnlineCatalogPageList();
        browser.waitForContainerToBeReady();
    });

    it('GIVEN I am on the page list of the first catalog WHEN the page is fully loaded THEN I expect to see a paginated list of 10 pages max, sorted by name ascending', function() {
        expect(pageList.elements.getTotalPageCount().getText()).toBe("(12 Pages found)", 'Expected the page collection size to be 12');
        expect(pageList.elements.getDisplayedPageCount()).toBe(10, 'Expected the number of page displayed to be 10');
        expect(pageList.elements.getFirstRowForKey('name').getText()).toBe("ADVERTISE", 'Expect Advertise page to be the first in the list');

        pageList.actions.navigateToIndex(2);
        expect(pageList.elements.getLastRowForKey('name').getText()).toBe("WELCOMEPAGE", 'Expected Welcome page to be last in the list');
        expect(pageList.elements.getPaginationCount()).toBe(2, 'Expected pagination count to be 2');
    });

    it('GIVEN I am on the page list of the first catalog WHEN I search for a page THEN I expect the list to show the pages that match the query for any header', function() {
        pageList.actions.searchForPage('welcomepage', 'name', 1);
        expect(pageList.elements.getPaginationCount()).toBe(1, 'Expected pagination count to be 1');

        // Perform a search on a page UID
        pageList.actions.searchForPage('uid1', 'uid', 3);

        // Perform a search on a page type
        pageList.actions.searchForPage('product', 'typeCode', 4);

        // Perform a search on a page template
        pageList.actions.searchForPage('mycustompagetemplate', 'template', 1);
        expect(pageList.elements.getPaginationCount()).toBe(1, 'Expected pagination count to be 1');
    });

    it('GIVEN I am on the page list of the first catalog WHEN I search for a page  and clear the filter THEN I expect the list all pages again and the page count increase from 1 to 12 ', function() {
        pageList.actions.searchForPage('welcomepage', 'name', 1);
        expect(pageList.elements.getTotalPageCount().getText()).toBe("(1 Pages found)", 'Expected the page collection size to be 1');
        pageList.elements.clearSearchFilter().then(function() {
            expect(pageList.elements.getTotalPageCount().getText()).toBe("(12 Pages found)", 'Expected the page collection size to be 12');
        });
    });

    it('GIVEN I am on the page list of the first catalog WHEN I click on the name column header THEN I expect the list to be re-sorted by this key in the descending order', function() {
        pageList.actions.clickOnColumnHeader('name');
        expect(pageList.elements.getFirstRowForKey('name').getText()).toBe('WELCOMEPAGE');
        pageList.actions.navigateToIndex(2);
        expect(pageList.elements.getLastRowForKey('name').getText()).toBe('ADVERTISE');
    });

    it('GIVEN I am on the page list of the first catalog WHEN I click on the UID column header THEN I expect the list to be re-sorted by this key in the descending order', function() {
        pageList.actions.clickOnColumnHeader('uid');
        expect(pageList.elements.getFirstRowForKey('uid').getText()).toBe("zuid12");
        pageList.actions.navigateToIndex(2);
        expect(pageList.elements.getLastRowForKey('uid').getText()).toBe("homepage");
    });

    it('GIVEN I am on the page list of the first catalog WHEN I click on the page type column header THEN I expect the list to be re-sorted by this key in the descending order', function() {
        pageList.actions.clickOnColumnHeader('typeCode');
        expect(pageList.elements.getFirstRowForKey('typeCode').getText()).toBe("WallPage");
        pageList.actions.navigateToIndex(2);
        expect(pageList.elements.getLastRowForKey('typeCode').getText()).toBe("ActionPage");
    });

    it('GIVEN I am on the page list of the first catalog WHEN I click on the name column header THEN I expect the list to be re-sorted by this key in the descending order', function() {
        pageList.actions.clickOnColumnHeader('template');
        expect(pageList.elements.getFirstRowForKey('template').getText()).toBe("ZTemplate");
        pageList.actions.navigateToIndex(2);
        expect(pageList.elements.getLastRowForKey('template').getText()).toBe("ActionTemplate");
    });


    it('GIVEN I am on the page list of the first catalog WHEN the page is fully loaded THEN I expect to see the catalog name and catalog version', function() {
        expect(pageList.elements.getCatalogName().getText()).toBe(FIRST_CATALOG_NAME);
    });

    xit('GIVEN I am on the page list of the first catalog WHEN I click on a linkable page name THEN I expect to be redirected to this page', function() {
        var EXPECTED_IFRAME_SRC = "/jsTests/tests/cmssmarteditContainer/e2e/_shared/dummystorefront/index.html?cmsTicketId=dasdfasdfasdfa";
        var EXPECTED_BROWSER_URL = "/storefront/apparel-uk/apparel-ukContentCatalog/Online/uid3";

        pageList.elements.getLinkForKeyAndRow('name', 1, 'a').click();
        browser.waitForWholeAppToBeReady();
        browser.switchToParent();

        var iframe = element(by.css('#js_iFrameWrapper iframe', 'iFrame not found'));
        expect(iframe.getAttribute('src')).toContain(EXPECTED_IFRAME_SRC);
        expect(browser.getCurrentUrl()).toContain(EXPECTED_BROWSER_URL);
    });

    it('GIVEN I am on the page list of the first catalog WHEN I hover over the restriction icon for a page THEN I expect to see the number of restrictions for the given page', function() {
        pageList.actions.moveToRestrictionsIconForAdvertisePage();
        expect(pageList.elements.getRestrictionsTooltipForAdvertisePage().isPresent()).toBe(true);
        expect(pageList.elements.getRestrictionsTooltipForAdvertisePage().getText()).toBe('2 restrictions');
    });

    it('GIVEN I am on the page list of the first catalog ' +
        'WHEN I hover over the restriction icon for a page with no restrictions ' +
        'THEN I expect to see zero restrictions',
        function() {

            // WHEN
            pageList.actions.moveToRestrictionsIconForHomePage();

            // THEN
            pageList.assertions.assertRestrictionIconForHomePageIsDisabled();
            expect(pageList.elements.getRestrictionsTooltipForHomePage().isPresent()).toBe(true, 'Expected to display tooltip when restriction icon hovered');
            expect(pageList.elements.getRestrictionsTooltipForHomePage().getText()).toBe('0 restrictions', 'Expected no restrictions to be shown when restriction icon hovered');
        });
});


describe('Synchronization modal in page list', function() {

    var pageList = e2e.pageObjects.PageList;
    var landingPage = e2e.pageObjects.landingPage;

    beforeEach(function() {

        browser.bootstrap(__dirname);

    });

    beforeEach(function() {
        landingPage.actions.navigateToFirstStagedCatalogPageList();
        pageList.actions.openPageDropdown(3);
        browser.waitForContainerToBeReady();
    });

    it('GIVEN I am on the page list of the first staged catalog WHEN the page is fully loaded THEN I expect the sync page modal to be openable from the dropdown.', function() {
        pageList.actions.openSyncModalFromActiveDropdown();
        expect(pageList.elements.getModalSyncPanel().isPresent()).toBe(true, "Expected the presence of a synchronization panel inside a modal.");
    });

    it('GIVEN I am on the page list of the first staged catalog WHEN sync page modal is opened THEN I expect a list of synchronizable items and a sync button to display', function() {
        pageList.actions.openSyncModalFromActiveDropdown();
        expect(pageList.elements.getSynchronizableItemsForPage().count()).toBeGreaterThan(0, "Expected at least one synchronizable item for the page.");

        // is it okay to declare is variable
        var syncButton = pageList.elements.getModalSyncPanelSyncButton();
        expect(syncButton.isPresent()).toBe(true, "Expected the presence of a sync button in the synchronization modal.");
    });

});


describe('Synchronization icon in the page list', function() {

    var pageList = e2e.pageObjects.PageList;
    var landingPage = e2e.pageObjects.landingPage;
    var syncPanel = e2e.componentObjects.synchronizationPanel;
    var SYNCED_PAGE_INDEX = 2;

    beforeEach(function() {

        browser.bootstrap(__dirname);

    });

    beforeEach(function() {
        landingPage.actions.navigateToFirstStagedCatalogPageList();
        syncPanel.setupTest();
        browser.waitForContainerToBeReady();
    });

    it('GIVEN I am on the page list of the first staged catalog containing one synced page WHEN the page is fully loaded THEN I expect the sync icon of a synced page to eventually present an "in_sync" sync status for the synced page.', function() {
        pageList.assertions.assertOnPageSyncIconStatusByPageIndex(SYNCED_PAGE_INDEX, "IN_SYNC");
    });

    it('GIVEN I am on the page list of the first staged catalog WHEN I sync one of the pages through the sync modal THEN I expect the sync icon of a that page to present an "in_sync" sync status.', function() {
        pageList.actions.syncPageFromSyncModal(3);
        pageList.assertions.assertOnPageSyncIconStatusByPageIndex(3, "IN_SYNC");
    });

});
