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
        MODAL_ID: 'y-modal-dialog'
    };

    componentObject.elements = {
        getModalDialog: function() {
            return browser.switchToParent().then(function() {
                return element(by.id(componentObject.constants.MODAL_ID));
            });
        },
        getModalDialogTitle: function() {
            return browser.switchToParent().then(function() {
                return element(by.css("div[class*='modal-header']")).getText();
            });
        },
        getModalDialogDescription: function() {
            return browser.switchToParent().then(function() {
                return element(by.css("div[id='" + componentObject.constants.MODAL_ID + "'] div[id='confirmationModalDescription']")).getText();
            });
        },
        modalDialogCancel: function() {
            return browser.switchToParent().then(function() {
                return element(by.css("div[id='" + componentObject.constants.MODAL_ID + "'] button[id='confirmCancel']"));
            });
        },
        modalDialogOk: function() {
            return browser.switchToParent().then(function() {
                return element(by.css("div[id='" + componentObject.constants.MODAL_ID + "'] button[id='confirmOk']"));
            });
        },
    };

    componentObject.actions = {
        modalDialogClickCancel: function() {
            return browser.switchToParent().then(function() {
                return browser.click(by.css("div[id='" + componentObject.constants.MODAL_ID + "'] button[id='confirmCancel']")).then(function() {
                    return browser.waitForAbsence(by.id(componentObject.constants.MODAL_ID), 'could not close modal window');
                });
            });
        },
        modalDialogClickOk: function() {
            return browser.switchToParent().then(function() {
                componentObject.elements.modalDialogOk().then(function(okButton) {
                    return browser.click(okButton).then(function() {
                        return browser.waitForAbsence(by.id(componentObject.constants.MODAL_ID), 'could not close modal window');
                    });
                });
            });
        }
    };

    return componentObject;
})();
