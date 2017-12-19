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
(function() {
    var perspective = e2e.componentObjects.modeSelector;
    var ribbon = e2e.componentObjects.ribbon;
    var storefront = e2e.componentObjects.storefront;
    var componentContextualMenu = e2e.componentObjects.componentContextualMenu;
    var externalComponentDecorator = e2e.componentObjects.externalComponentDecorator;

    var COMPONENT_NAME = 'component3';
    var COMPONENT4_NAME = 'component4';

    describe('CMS Perspectives', function() {

        var cmsPerspective = "Basic CMS";
        var otherPerspective = "Some other perspective";


        beforeEach(function() {
            browser.bootstrap(__dirname);
        });

        beforeEach(function() {
            browser.waitForWholeAppToBeReady();
        });

        it('WHEN other perspective than Basic CMS perspective is selected, no contextual menu button shows', function() {
            perspective.select(otherPerspective);
            storefront.actions.moveToComponent('component1');

            expect(componentContextualMenu.elements.getNumContextualMenuItemsForComponentId(COMPONENT_NAME)).toBe(0);
        });

        it('WHEN other perspective than Basic CMS perspective is selected, no toolbar button shows', function() {
            perspective.select(otherPerspective);
            ribbon.doesNotHaveAddComponentButton();
        });

        it('WHEN Basic CMS perspective is selected, SimpleResponsiveBannerComponent receives 3 contextual menu buttons : move, delete and edit', function() {
            // GIVEN
            perspective.select(cmsPerspective);

            // WHEN
            storefront.actions.moveToComponentByAttributeAndValue('data-smartedit-component-type', 'SimpleResponsiveBannerComponent');

            // THEN
            componentContextualMenu.assertions.removeMenuItemForComponentIdLoadedRightImg(COMPONENT_NAME);
            componentContextualMenu.assertions.editMenuItemForComponentIdLoadedRightImg(COMPONENT_NAME);
            componentContextualMenu.assertions.moveMenuItemForComponentIdLoadedRightImg(COMPONENT_NAME);
        });

        it("WHEN Basic CMS perspective is selected, white ribbon receives 'Add component' button", function() {
            perspective.select(cmsPerspective);
            ribbon.hasAddComponentButton();
        });

        it('WHEN Basic CMS perspective is selected, components coming from parent catalog will have an external component decorator on them', function() {
            perspective.select(cmsPerspective);

            externalComponentDecorator.assertions.externalComponentDecoratorsCount(1);

            storefront.actions.moveToComponentByAttributeAndValue('data-smartedit-component-type', 'componentType4');

            componentContextualMenu.actions.clickExternalComponentButton(COMPONENT4_NAME);

            componentContextualMenu.assertions.externalComponentMenuItemForComponentIdLoadedRightImg(COMPONENT4_NAME);

            componentContextualMenu.actions.clickExternalComponentButton(COMPONENT4_NAME);

            componentContextualMenu.assertions.externalComponentToShowParentCatalogDetails(COMPONENT4_NAME, 'Apparel Content Catalog (Online)');
        });
    });

})();
