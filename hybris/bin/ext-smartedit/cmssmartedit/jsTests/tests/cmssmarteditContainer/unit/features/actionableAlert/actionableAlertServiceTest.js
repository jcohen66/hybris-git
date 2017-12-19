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
describe('actionableAlert', function() {

    var fixture;
    var mockAlertService;
    var $q;

    var MOCK_PAYLOAD = {
        controller: "mocked_controller",
        description: "mocked_description_i18n",
        hyperlinkLabel: "mocked_hyperlinkLabel_i18n"
    };

    beforeEach(function() {
        fixture = AngularUnitTestHelper.prepareModule('actionableAlertModule')
            .mock('alertService', 'showInfo')
            .service('actionableAlertService');

        actionableAlertService = fixture.service;
        mockAlertService = fixture.mocks.alertService;
        $q = fixture.injected.$q;

    });

    describe('displayActionableAlert', function() {

        it("get the custom content template displayed by the alertService", function() {

            // Act
            actionableAlertService.displayActionableAlert(MOCK_PAYLOAD);
            fixture.detectChanges();

            // Assert
            expect(mockAlertService.showInfo).toHaveBeenCalledWith({
                closeable: true,
                controller: "mocked_controller",
                template: "<div><p>{{ $alertInjectedCtrl.description | translate: $alertInjectedCtrl.descriptionDetails }}</p><div><a data-ng-click='alert.hide(); $alertInjectedCtrl.onClick();'>{{ $alertInjectedCtrl.hyperlinkLabel | translate }}</a></div></div>",
                timeout: 20000
            });

        });

    });

});
