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
describe('syncIndicatorDecorator', function() {
    var storefront = e2e.componentObjects.storefront;
    var syncIndicator = e2e.componentObjects.syncIndicatorDecorator;
    var modeSelector = e2e.componentObjects.modeSelector;
    var slotContextualMenu = e2e.componentObjects.slotContextualMenu;
    var synchronizationPanel = e2e.componentObjects.synchronizationPanel;
    var syncMenu = e2e.componentObjects.syncMenu;

    var TOP_HEADER_SLOT_ID = storefront.constants.TOP_HEADER_SLOT_ID;

    beforeEach(function() {
        browser.bootstrap(__dirname);
    });

    beforeEach(function(done) {
        browser.waitForWholeAppToBeReady().then(function() {
            modeSelector.selectAdvancedPerspective().then(function() {
                browser.switchToIFrame().then(function() {
                    synchronizationPanel.setupTest();
                    done();
                });
            });
        });
    });

    describe('Sync indicator for slots', function() {
        it('GIVEN I am in advanced edit mode WHEN the page is fully loaded and there are 3 out-of-sync slots THEN I expect the decorators to present a NOT_IN_SYNC state for 3 out-of-sync slots.', function() {
            syncIndicator.assertions.inSyncSlotDecoratorsCount(2);
        });

        it('GIVEN I am in advanced edit mode WHEN the page is fully loaded and there are 1 in-sync slot THEN I expect the decorators to have an IN_SYNC status for one in-sync slot.', function() {
            syncIndicator.assertions.outOfSyncSlotDecoratorsCount(1);
        });

        xit('GIVEN I open sync panel of topHeaderSlot then open sync panel of page WHEN I sync topHeaderSlot from the page panel THEN the status of the associated decorator should automatically be updated.', function() {
            storefront.actions.moveToComponent(TOP_HEADER_SLOT_ID);
            browser.click(slotContextualMenu.elements.syncButtonBySlotId(TOP_HEADER_SLOT_ID));
            expect(syncIndicator.getDecoratorStatusBySlotId(TOP_HEADER_SLOT_ID)).toMatch('NOT_SYNC');

            syncMenu.click();
            synchronizationPanel.checkItem('Select All');
            synchronizationPanel.clickSync().then(function() {
                synchronizationPanel.switchToIFrame().then(function() {
                    expect(syncIndicator.getDecoratorStatusBySlotId(TOP_HEADER_SLOT_ID)).toMatch('IN_SYNC');
                });
            });
        });
    });
});
