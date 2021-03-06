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
describe('slotSyncContextualMenu - ', function() {

    var storefront = e2e.componentObjects.storefront;
    var modeSelector = e2e.componentObjects.modeSelector;
    var synchronizationPanel = e2e.componentObjects.synchronizationPanel;
    var slotContextualMenu = e2e.componentObjects.slotContextualMenu;
    var syncMenu = e2e.componentObjects.syncMenu;

    var TOP_HEADER_SLOT_ID = storefront.constants.TOP_HEADER_SLOT_ID;
    var BOTTOM_HEADER_SLOT_ID = storefront.constants.BOTTOM_HEADER_SLOT_ID;
    var FOOTER_SLOT_ID = storefront.constants.FOOTER_SLOT_ID;
    var OTHER_SLOT_ID = storefront.constants.OTHER_SLOT_ID;

    beforeEach(function() {
        browser.bootstrap(__dirname);
    });

    beforeEach(function(done) {
        browser.waitForWholeAppToBeReady().then(function() {
            modeSelector.selectAdvancedPerspective().then(function() {
                synchronizationPanel.setupTest();
                done();
            });
        });
    });

    it('GIVEN on advanced edit mode WHEN we select sync menu icon for topHeaderSlot then it should be out of sync', function() {
        storefront.actions.moveToComponent(TOP_HEADER_SLOT_ID).then(function() {
            expect(slotContextualMenu.elements.syncButtonStatusBySlotId(TOP_HEADER_SLOT_ID).isPresent()).toBe(true);
        });
    });

    it('GIVEN on advanced edit mode WHEN we select sync menu icon should show a warning if the slot is not in sync', function() {

        storefront.actions.moveToComponent(TOP_HEADER_SLOT_ID).then(function() {
            expect(slotContextualMenu.elements.syncButtonStatusBySlotId(TOP_HEADER_SLOT_ID).isPresent()).toBe(true); // out of sync

            storefront.actions.moveToComponent(BOTTOM_HEADER_SLOT_ID).then(function() {
                expect(slotContextualMenu.elements.syncButtonStatusBySlotId(BOTTOM_HEADER_SLOT_ID).isPresent()).toBe(true); // out of sync

                storefront.actions.moveToComponent(FOOTER_SLOT_ID).then(function() {
                    expect(slotContextualMenu.elements.syncButtonBySlotId(FOOTER_SLOT_ID).isPresent()).toBe(false); // external slot - no sync

                    storefront.actions.moveToComponent(OTHER_SLOT_ID).then(function() {
                        expect(slotContextualMenu.elements.syncButtonStatusBySlotId(OTHER_SLOT_ID).isPresent()).toBe(false); // in sync
                    });
                });
            });
        });

    });

    it('GIVEN I open sync panel of topHeaderSlot then open sync panel of page WHEN I sync topHeaderSlot from the page panel THEN the status of the slot panel must be automatically updated', function() {

        storefront.actions.moveToComponent(TOP_HEADER_SLOT_ID).then(function() {
            expect(slotContextualMenu.elements.syncButtonStatusBySlotId(TOP_HEADER_SLOT_ID).isPresent()).toBe(true); // out of sync
            browser.click(slotContextualMenu.elements.syncButtonBySlotId(TOP_HEADER_SLOT_ID)).then(function() {

                syncMenu.click();
                synchronizationPanel.checkItem('All Slots and Page Information');
                synchronizationPanel.clickSync().then(function() {
                    synchronizationPanel.switchToIFrame().then(function() {
                        expect(slotContextualMenu.elements.syncButtonStatusBySlotId(TOP_HEADER_SLOT_ID).isPresent()).toBe(false); // in sync
                    });
                });
            });
        });

    });

});
