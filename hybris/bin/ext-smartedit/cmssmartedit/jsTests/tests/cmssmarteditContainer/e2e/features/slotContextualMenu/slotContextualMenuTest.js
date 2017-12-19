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
describe('slotContextualMenu', function() {
    var perspective = e2e.componentObjects.modeSelector;
    var storefront = e2e.componentObjects.storefront;
    var slotContextualMenu = e2e.componentObjects.slotContextualMenu;
    var TOP_HEADER_SLOT_ID = storefront.constants.TOP_HEADER_SLOT_ID;
    var BOTTOM_HEADER_SLOT_ID = storefront.constants.BOTTOM_HEADER_SLOT_ID;

    beforeEach(function() {
        browser.bootstrap(__dirname);
    });

    beforeEach(function(done) {
        browser.waitForWholeAppToBeReady().then(function() {
            done();
        });
    });

    describe('slotVisibilityButton', function() {

        beforeEach(function() {
            perspective.select(perspective.ADVANCED_CMS_PERSPECTIVE);
        });

        it('WHEN the user hovers over the slot with hidden components THEN the visibility button is displayed with the number of hidden components.', function() {
            storefront.actions.moveToComponent(TOP_HEADER_SLOT_ID);
            var button = slotContextualMenu.elements.visibilityButtonBySlotId(TOP_HEADER_SLOT_ID);
            expect(button.isPresent()).toBe(true);
            expect(button.isDisplayed()).toBe(true);
            expect(button.getText()).toBe('2');
        });

        it('WHEN the user clicks on the visibility button THEN the hidden component list is visible.', function() {
            storefront.actions.moveToComponent(TOP_HEADER_SLOT_ID);
            browser.click(slotContextualMenu.elements.visibilityButtonBySlotId(TOP_HEADER_SLOT_ID));
            var list = slotContextualMenu.elements.visibilityDropdownBySlotId(TOP_HEADER_SLOT_ID);
            var hiddenElementsList = slotContextualMenu.elements.visibilityListBySlotId(TOP_HEADER_SLOT_ID);
            expect(list.isPresent()).toBe(true);
            expect(list.isDisplayed()).toBe(true);
            expect(hiddenElementsList.get(0).getText()).toContain('Hidden Component 1');
            expect(hiddenElementsList.get(0).getText()).toContain('CMSPARAGRAPHCOMPONENT');
            expect(hiddenElementsList.get(0).element(by.css('img')).getAttribute('src')).toContain('/cmssmartedit/images/component_default.png');
            expect(hiddenElementsList.get(1).getText()).toContain('Hidden Component 2');
            expect(hiddenElementsList.get(1).getText()).toContain('BANNERCOMPONENT');
            expect(hiddenElementsList.get(1).element(by.css('img')).getAttribute('src')).toContain('/cmssmartedit/images/component_default.png');
        });
    });

    describe('slotSharedButton', function() {

        beforeEach(function() {
            perspective.select(perspective.ADVANCED_CMS_PERSPECTIVE);
        });

        xit('WHEN the user hovers over the shared slot THEN the shared slot button is visible', function() {
            storefront.actions.moveToComponent(TOP_HEADER_SLOT_ID);

            var button = slotContextualMenu.elements.sharedSlotButtonBySlotId(TOP_HEADER_SLOT_ID);
            browser.waitForPresence(button, 'Expected shared slot button to be present');

            expect(button.isDisplayed()).toBe(true, 'Expected shared slot button to be displayed');
        });

        it('WHEN the user hovers over a non-shared slot THEN the slot shared button should not be visible', function() {
            storefront.actions.moveToComponent(BOTTOM_HEADER_SLOT_ID);
            var button = slotContextualMenu.elements.sharedSlotButtonBySlotId(BOTTOM_HEADER_SLOT_ID);
            expect(button.isPresent()).toBe(false, 'Expected shared slot button not to be visible');
        });

        it('WHEN the user hovers on the shared slot button THEN the button should display a popover that contains a message', function() {
            storefront.actions.moveToComponent(TOP_HEADER_SLOT_ID);
            slotContextualMenu.actions.hoverOverSharedSlotBySlotId(TOP_HEADER_SLOT_ID);
            expect(slotContextualMenu.elements.sharedSlotButtonMessage()).toBe('This slot is shared, any changes you make will affect other pages using the same slot.');
        });
    });
});
