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
module.exports = (function() {

    var componentObject = {};

    componentObject.constants = {
        MENU_ITEM_MOVE: 'move',
        MENU_ITEM_DELETE: 'delete',
        MENU_ITEM_EDIT: 'edit'
    };

    componentObject.elements = {
        getSmarteditOverlayCSSMatcherForComponent: function(componentId) {
            return "#smarteditoverlay .smartEditComponentX[data-smartedit-component-id='" + componentId + "'] ";
        },
        getRemoveButtonForComponentId: function(componentId) {
            return browser.switchToIFrame().then(function() {
                return element(by.css(componentObject.elements.getSmarteditOverlayCSSMatcherForComponent(componentId) + ".removebutton"));
            });
        },
        getMoveButtonForComponentId: function(componentId) {
            return browser.switchToIFrame().then(function() {
                return element(by.css(componentObject.elements.getSmarteditOverlayCSSMatcherForComponent(componentId) + ".movebutton"));
            });
        },
        getEditButtonForComponentId: function(componentId) {
            return browser.switchToIFrame().then(function() {
                return element(by.css(componentObject.elements.getSmarteditOverlayCSSMatcherForComponent(componentId) + ".editbutton"));
            });
        },
        getExternalComponentButtonForComponentId: function(componentId) {
            return browser.switchToIFrame().then(function() {
                return element(by.css(componentObject.elements.getSmarteditOverlayCSSMatcherForComponent(componentId) + ".externalcomponentbutton"));
            });
        },
        getNumContextualMenuItemsForComponentId: function(componentId) {
            return element.all(by.css(componentObject.elements.getSmarteditOverlayCSSMatcherForComponent(componentId) + ".cmsx-ctx-btns")).count();
        }
    };

    componentObject.actions = {
        clickRemoveButton: function(componentId) {
            return browser.switchToIFrame().then(function() {
                var selector = componentObject.elements.getSmarteditOverlayCSSMatcherForComponent(componentId) + ".removebutton";
                browser.moveTo(selector).then(function() {
                    browser.click(by.css(selector));
                });
            });
        },
        clickExternalComponentButton: function(componentId) {
            return browser.switchToIFrame().then(function() {
                return componentObject.elements.getExternalComponentButtonForComponentId(componentId).then(function(externalComponentButton) {
                    return browser.actions()
                        .mouseMove(externalComponentButton)
                        .click()
                        .perform();
                });
            });
        }
    };

    componentObject.assertions = {
        removeMenuItemForComponentIdLoadedRightImg: function(componentID) {
            componentObject.elements.getRemoveButtonForComponentId(componentID).then(function(removeButton) {
                expect(removeButton.getAttribute('class')).toContain('hyicon-removelg');
            });
        },
        editMenuItemForComponentIdLoadedRightImg: function(componentID) {
            componentObject.elements.getEditButtonForComponentId(componentID).then(function(editButton) {
                // this button is still not using the assets service.
                expect(editButton.getAttribute('class')).toContain('hyicon-edit');
            });
        },
        moveMenuItemForComponentIdLoadedRightImg: function(componentID) {
            componentObject.elements.getMoveButtonForComponentId(componentID).then(function(moveButton) {
                expect(moveButton.getAttribute('class')).toContain('hyicon-dragdroplg');
            });
        },
        externalComponentMenuItemForComponentIdLoadedRightImg: function(componentID) {
            componentObject.elements.getExternalComponentButtonForComponentId(componentID).then(function(moveButton) {
                expect(moveButton.getAttribute('class')).toContain('hyicon-globe');
            });
        },
        externalComponentToShowParentCatalogDetails: function(componentID, catalogVersionName) {
            componentObject.actions.clickExternalComponentButton(componentID).then(function() {
                browser.waitUntil(function() {
                    return browser.findElement(by.css('external-component-button')).getText().then(function(text) {
                        return text === catalogVersionName;
                    });
                }, "external component button text not found");
            });
        }
    };

    return componentObject;
})();
