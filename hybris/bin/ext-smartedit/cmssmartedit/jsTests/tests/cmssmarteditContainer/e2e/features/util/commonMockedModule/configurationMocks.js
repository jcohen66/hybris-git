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
angular
    .module('configurationMocks', ['ngMockE2E'])
    .constant('SMARTEDIT_ROOT', 'buildArtifacts')
    .constant('SMARTEDIT_RESOURCE_URI_REGEXP', /^(.*)\/jsTests/)
    .run(
        function($httpBackend) {
            $httpBackend.whenGET(/jsTests/).passThrough();
            $httpBackend.whenGET(/static-resources/).passThrough();
            $httpBackend.whenGET(/static-resources/).passThrough();
            $httpBackend.whenGET(/web\/webroot/).passThrough();

            var map = [{
                "value": "\"thepreviewTicketURI\"",
                "key": "previewTicketURI"
            }, {
                "value": "\"/cmswebservices/v1/i18n/languages\"",
                "key": "i18nAPIRoot"
            }, {
                "value": "{\"smartEditLocation\":\"/jsTests/tests/cmssmarteditContainer/e2e/_shared/smartedit/clickThroughOverlay.js\"}",
                "key": "applications.clickThroughOverlayModule"
            }, {
                "value": "{\"smartEditContainerLocation\":\"/jsTests/tests/cmssmarteditContainer/e2e/_shared/smarteditContainer/clickThroughOverlay.js\"}",
                "key": "applications.clickThroughOverlayTriggerModule"
            }, {
                "value": "{\"smartEditLocation\":\"/jsTests/tests/cmssmarteditContainer/e2e/features/util/commonMockedModule/LanguagesMocks.js\"}",
                "key": "applications.LanguagesMocks"
            }, {
                "value": "{\"smartEditLocation\":\"/jsTests/tests/cmssmarteditContainer/e2e/features/util/commonMockedModule/i18nMock.js\"}",
                "key": "applications.i18nMockModule"
            }, {
                "value": "{\"smartEditLocation\":\"/jsTests/tests/cmssmarteditContainer/e2e/features/util/backendMocksUtils.js\"}",
                "key": "applications.backendMocksUtilsModule"
            }, {
                "value": "{\"smartEditLocation\":\"/jsTests/tests/cmssmarteditContainer/e2e/features/util/commonMockedModule/PageContentComponentSlotsMocks.js\"}",
                "key": "applications.pagesContentSlotsComponentsMocks"
            }, {
                "value": "{\"smartEditLocation\":\"/jsTests/tests/cmssmarteditContainer/e2e/features/util/commonMockedModule/PageContentSlotsMocks.js\"}",
                "key": "applications.pagesContentSlotsMocks"
            }, {
                "value": "{\"smartEditLocation\":\"/jsTests/tests/cmssmarteditContainer/e2e/features/util/commonMockedModule/CommonSlotsMocks.js\"}",
                "key": "applications.commonSlotMocks"
            }, {
                "value": "{\"smartEditLocation\":\"/jsTests/tests/cmssmarteditContainer/e2e/features/util/commonMockedModule/dragAndDropMocks.js\"}",
                "key": "applications.dragAndDropMocks"
            }, {
                "value": "{\"smartEditLocation\":\"/jsTests/tests/cmssmarteditContainer/e2e/features/util/commonMockedModule/componentMocks.js\"}",
                "key": "applications.componentMocks"
            }, {
                "value": "{\"smartEditLocation\":\"/jsTests/tests/cmssmarteditContainer/e2e/features/util/commonMockedModule/slotTypeRestrictionsMocks.js\"}",
                "key": "applications.slotTypeRestrictionsMocks"
            }, {
                "value": "{\"smartEditContainerLocation\":\"/web/webroot/cmssmartedit/js/cmssmarteditContainer.js\"}",
                "key": "applications.cmssmarteditContainer"
            }, {
                "value": "{\"smartEditLocation\":\"/web/webroot/cmssmartedit/js/cmssmartedit.js\"}",
                "key": "applications.cmssmartedit"
            }];


            var stringifiedArray = sessionStorage.getItem("additionalTestJSFiles");
            if (stringifiedArray) {
                var additionalTestJSFiles = JSON.parse(stringifiedArray);
                Array.prototype.push.apply(map, additionalTestJSFiles);
            }

            $httpBackend.whenGET(/configuration/).respond(
                function(method, url, data, headers) {
                    return [200, map];
                });

            $httpBackend.whenPUT(/configuration/).respond(404);
        });
angular.module('smarteditloader').requires.push('configurationMocks');
angular.module('smarteditcontainer').requires.push('configurationMocks');
angular.module('smarteditcontainer').constant('isE2eTestingActive', true);
angular.module('smarteditcontainer').constant('testAssets', true);
