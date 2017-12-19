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

    componentObject.constants = {};

    componentObject.elements = {
        // -- Dialog Elements --
        getSaveButton: function() {
            return element(by.id('save'));
        },
        getCancelButton: function() {
            return element(by.id('cancel'));
        },
        getCloseButton: function() {
            return element(by.css('button.close'));
        },

        // -- Generic Editor Elements -- 
        getField: function(fieldId) {
            return element(by.css('.ySErow #' + fieldId));
        },
        getLocalizedFieldLanguageButton: function(fieldId, language) {
            return componentObject.elements.getField(fieldId)
                .element(by.cssContainingText('localized-element ul li a', language));
        },
        getLocalizedFieldInputs: function(fieldId) {
            return componentObject.elements.getField(fieldId)
                .all(by.css('localized-element y-tab input'));
        },
        getLocalizedFieldInputForLanguage: function(fieldId, language) {
            return componentObject.elements.getField(fieldId)
                .element(by.css('localized-element y-tab[data-tab-id="' + language.toLowerCase() + '"] input'));
        }
    };

    componentObject.actions = {
        // -- Dialog Actions --
        save: function() {
            return browser.click(componentObject.elements.getSaveButton());
        },
        cancel: function() {
            return browser.click(componentObject.elements.getCancelButton());
        },
        closeEditor: function() {
            return browser.click(componentObject.elements.getCloseButton());
        },

        // -- Generic Editor actions -- 
        clickLocalizedFieldLanguageButton: function(fieldId, language) {
            return browser.click(componentObject.elements.getLocalizedFieldLanguageButton(fieldId, language));
        },
        setValueForLanguage: function(fieldId, language, name) {
            return componentObject.actions.clickLocalizedFieldLanguageButton(fieldId, language).then(function() {
                var input = componentObject.elements.getLocalizedFieldInputForLanguage(fieldId, language);
                return browser.click(input).then(function() {
                    return browser.sendKeys(input, name);
                });
            });
        },
        setTextValueInLocalizedField: function(fieldId, valuesByLanguage) {
            var promisesToResolve = [];

            Object.keys(valuesByLanguage).forEach(function(language) {
                promisesToResolve.push(
                    componentObject.actions.setValueForLanguage(fieldId, language, valuesByLanguage[language]));
            });

            return protractor.promise.all(promisesToResolve);
        },
    };

    componentObject.assertions = {
        // -- Dialog Assertions --
        saveIsDisabled: function() {
            componentObject.elements.getSaveButton().getAttribute('disabled').then(function(isButtonDisabled) {
                expect(isButtonDisabled).toBe('true', 'Expected save button to be disabled.');
            });
        },

        // -- Generic Editor Assertions -- 
        localizedFieldHasExpectedValueForLanguage: function(fieldId, language, expectedValue) {
            return componentObject.actions.clickLocalizedFieldLanguageButton(fieldId, language).then(function() {
                return componentObject.elements.getLocalizedFieldInputForLanguage(fieldId, language).getAttribute('value').then(function(currentValue) {
                    expect(currentValue).toEqual(expectedValue, 'Invalid message in ' + language + ' for localized value ' + fieldId);
                });
            });
        },
        localizedFieldHasExpectedValues: function(fieldId, expectedValues) {
            Object.keys(expectedValues).forEach(function(language) {
                componentObject.assertions.localizedFieldHasExpectedValueForLanguage(fieldId, language, expectedValues[language]);
            });
        },
        localizedFieldIsEmpty: function(fieldId) {
            var localizedFieldInputs = componentObject.elements.getLocalizedFieldInputs(fieldId);
            for (var i = 0; i < localizedFieldInputs.length; i++) {
                var input = localizedFieldInputs.get(i);
                expect(input.getText()).toBe('', 'Expected localized field ' + fieldId + ' to be empty');
            }
        }
    };

    componentObject.utils = {};

    return componentObject;

}());
