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
angular.module('commonSlotMocks', ['ngMockE2E'])
    .run(function($httpBackend) {
        $httpBackend.whenGET(/cmswebservices\/v1\/sites\/apparel-uk\/cmsitems\?catalogId=apparel-ukContentCatalog&catalogVersion=Staged&uuids=component1,component2,component3,hiddenComponent1,hiddenComponent2,component4,component5,hiddenComponent3/).
        respond({
            response: [{
                uid: "component1",
                uuid: "component1",
                name: "Component 1",
                visible: true,
                typeCode: "SimpleResponsiveBannerComponent",
                catalogVersion: "apparel-ukContentCatalog/Staged"
            }, {
                uid: "component2",
                uuid: "component2",
                name: "Component 2",
                visible: true,
                typeCode: "componentType2",
                catalogVersion: "apparel-ukContentCatalog/Staged"
            }, {
                uid: "component3",
                uuid: "component3",
                name: "Component 3",
                visible: true,
                typeCode: "componentType3",
                catalogVersion: "apparel-ukContentCatalog/Staged"
            }, {
                uid: "component4",
                uuid: "component4",
                name: "Component 4",
                visible: true,
                typeCode: "componentType4",
                catalogVersion: "apparel-ukContentCatalog/Staged"
            }, {
                uid: "component5",
                uuid: "component5",
                name: "Component 5",
                visible: true,
                typeCode: "componentType5",
                catalogVersion: "apparel-ukContentCatalog/Staged"
            }, {
                uid: "hiddenComponent1",
                uuid: "hiddenComponent1",
                name: "Hidden Component 1",
                visible: false,
                typeCode: "CMSParagraphComponent",
                catalogVersion: "apparel-ukContentCatalog/Staged"
            }, {
                uid: "hiddenComponent2",
                uuid: "hiddenComponent2",
                name: "Hidden Component 2",
                visible: false,
                typeCode: "BannerComponent",
                catalogVersion: "apparel-ukContentCatalog/Staged"
            }, {
                uid: "hiddenComponent3",
                uuid: "hiddenComponent3",
                name: "Hidden Component 3",
                visible: false,
                typeCode: "SimpleBannerComponent",
                catalogVersion: "apparel-ukContentCatalog/Staged"
            }]
        });
    });
try {
    angular.module('smarteditloader').requires.push('commonSlotMocks');
} catch (e) {}
try {
    angular.module('smarteditcontainer').requires.push('commonSlotMocks');
} catch (e) {}
