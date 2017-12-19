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
module.exports = function() {

    var NUMBER_OF_ARROWS_IN_PAGINATION_LIST = 4;
    var syncPanel = e2e.componentObjects.synchronizationPanel;
    var pageList = {};

    pageList.elements = {
        getTotalPageCount: function() {
            return element(by.css('.paged-list-count span:first-child'));
        },

        getDisplayedPageCount: function() {
            return element.all(by.css('.paged-list-table tbody tr')).count();
        },

        getPaginationCount: function() {
            return element.all(by.css('.pagination-container  > ul > li')).count().then(function(count) {
                return count - NUMBER_OF_ARROWS_IN_PAGINATION_LIST;
            });
        },

        getPageDropdownMenu: function() {
            return element(by.css('ul.dropdown-menu'));
        },

        getDropdownSyncButton: function() {
            return element(by.cssContainingText('y-drop-down-menu .open li', 'Sync'));
        },

        getModalDialog: function() {
            return element(by.css('.modal-dialog'));
        },

        getModalSyncPanel: function() {
            return element(by.css('.modal-dialog synchronization-panel'));
        },

        getSynchronizableItemsForPage: function() {
            return element.all(by.css(".se-sync-panel .se-sync-panel__sync-info__row"));
        },

        getModalSyncPanelSyncButton: function() {
            return element(by.css('.modal-dialog #sync'));
        },

        getClickableModalSyncPanelSyncButton: function() {
            return element(by.css('.modal-dialog #sync:not([disabled])'));
        },

        getSyncedPageSyncIcon: function() {
            return element(by.css('.paged-list-table__body > tr:nth-child(2) page-list-sync-icon .IN_SYNC'));
        },

        getFirstPageSyncIcon: function() {
            return element(by.css('.paged-list-table__body > tr:first-child page-list-sync-icon .IN_SYNC'));
        },

        getSearchInput: function() {
            return element(by.css('.ySEPage-list-search > input'));
        },

        clearSearchFilter: function(searchKeys) {
            return browser.click(element(by.css('.glyphicon-remove-sign')));
        },

        getColumnHeaderForKey: function(key) {
            return element(by.css('.paged-list-table thead tr:first-child .paged-list-header-' + key));
        },

        getFirstRowForKey: function(key) {
            return element(by.css('.paged-list-table tbody tr:first-child .paged-list-item-' + key));
        },

        getLastRowForKey: function(key) {
            return element(by.css('.paged-list-table tbody tr:last-child .paged-list-item-' + key));
        },

        getLinkForKeyAndRow: function(key, row, selector) {
            return element(by.css('.paged-list-table tbody tr:nth-child(' + row + ') .paged-list-item-' + key + ' ' + selector));
        },

        getCatalogName: function() {
            return element(by.css('.ySEPageListTitle h4'));
        },

        getRestrictionsIconForAdvertisePage: function() {
            return element(by.cssContainingText('tr', 'uid3')).element(by.css('img.restrictionPageListIcon'));
        },

        getRestrictionsTooltipForAdvertisePage: function() {
            return element(by.cssContainingText('.tooltip', '2 restrictions'));
        },

        getRestrictionsIconForHomePage: function() {
            return element(by.cssContainingText('tr', 'homepage')).element(by.css('img.restrictionPageListIcon'));
        },

        getRestrictionsTooltipForHomePage: function() {
            return element(by.cssContainingText('.tooltip', '0 restrictions'));
        },

        getCatalogPageListLink: function(catalog) {
            return element(by.css('.page-list-link-item a[data-ng-href*=' + catalog + ']'));
        },

        getAddNewPageButton: function() {
            return element(by.cssContainingText('.y-add-btn', 'add new page'));
        }
    };

    pageList.actions = {
        navigateToFirstOnlineCatalogFromPageList: function() {
            browser.waitForPresence(element(by.css('.page-list-link-item a[data-ng-href*=Online]')));
            return element(by.css('.page-list-link-item a[data-ng-href*=Online]')).click();
        },

        navigateToFirstStagedCatalogPageList: function() {
            var pageListLink = pageList.elements.getCatalogPageListLink('Staged');
            browser.waitForPresence(pageListLink);
            return browser.click(pageListLink);
        },

        moveToRestrictionsIconForAdvertisePage: function() {
            return browser.actions()
                .mouseMove(pageList.elements.getRestrictionsIconForAdvertisePage())
                .perform();
        },

        moveToRestrictionsIconForHomePage: function() {
            return browser.actions()
                .mouseMove(pageList.elements.getRestrictionsIconForHomePage())
                .perform();
        },

        openPageDropdown: function(pageIndex) {
            return element(by.css('.paged-list-item:nth-child(' + pageIndex + ') span[class*="y-dropdown-more-"]')).click();
        },

        navigateToIndex: function(index) {
            return browser.executeScript('window.scrollTo(0,document.body.scrollHeight);').then(function() {
                element(by.css('.pagination-container  > ul > li:nth-child(' + (NUMBER_OF_ARROWS_IN_PAGINATION_LIST / 2 + index) + ') a')).click();
            });
        },

        searchForPage: function(query, columnHeader, expectedNumber) {
            pageList.elements.getSearchInput().clear();
            pageList.elements.getSearchInput().sendKeys(query);

            expect(pageList.elements.getTotalPageCount().getText()).toBe("(" + expectedNumber + " Pages found)");
            expect(pageList.elements.getDisplayedPageCount()).toBe(expectedNumber);

            pageList.elements.getFirstRowForKey(columnHeader).getText().then(function(text) {
                expect(text.toLowerCase().indexOf(query) >= 0).toBeTruthy();
            });
        },

        syncPageFromSyncModal: function(pageIndex) {
            pageList.actions.openPageDropdown(pageIndex);
            pageList.actions.openSyncModalFromActiveDropdown();
            browser.waitForAbsence(element(by.css("body > .modal.ng-animate")));
            syncPanel.checkItem('All Slots and Page Information');
            pageList.actions.clickSyncPageModalSyncButton();
            browser.waitForPresence(by.css(".se-sync-panel__sync-info__row.active span[data-status='IN_SYNC']"));

        },

        clickOnColumnHeader: function(key) {
            pageList.elements.getColumnHeaderForKey(key).click();
        },

        clickSyncPageModalSyncButton: function() {
            browser.click(pageList.elements.getClickableModalSyncPanelSyncButton());

        },

        openSyncModalFromActiveDropdown: function() {
            browser.waitForPresence(pageList.elements.getDropdownSyncButton(), "Expected sync option to be available in the dropdown.");
            browser.click(pageList.elements.getDropdownSyncButton(), "Could not click on the sync option in the dropdown.");
            browser.waitForPresence(pageList.elements.getModalDialog(), "Expected the presence of a modal window.");
            browser.waitForPresence(pageList.elements.getModalSyncPanel(), "Expected the presence of a synchronization panel inside the modal.");
        }
    };

    pageList.assertions = {
        assertRestrictionIconForHomePageIsDisabled: function() {
            expect(pageList.elements.getRestrictionsIconForHomePage().getAttribute('data-ng-src')).toContain('icon_restriction_small_grey.png');
        },
        assertPageListIsDisplayed: function() {
            expect(pageList.elements.getAddNewPageButton().isPresent()).toBe(true);
        },
        assertOnPageSyncIconStatusByPageIndex: function(pageIndex, expectedStatus) {
            browser.waitForPresence(element(by.css(".paged-list-table__body .paged-list-item")));
            var actualStatus = null;
            browser.waitUntil(function() {
                return element(by.css('.paged-list-table__body > tr:nth-child(' + pageIndex + ') page-list-sync-icon span')).getAttribute("data-sync-status").then(function(_actualStatus) {
                    actualStatus = _actualStatus;
                    return actualStatus.indexOf(expectedStatus) > -1;
                });
            }, "Expected sync status to be " + expectedStatus + " but got " + actualStatus);
        }

    };

    return pageList;
}();
