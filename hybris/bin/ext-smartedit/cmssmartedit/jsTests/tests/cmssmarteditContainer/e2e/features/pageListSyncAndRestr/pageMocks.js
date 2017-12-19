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
    .module('pageMocks', ['ngMockE2E'])
    .run(
        function($httpBackend) {

            var mockedPages = [{
                creationtime: "2016-04-08T21:16:41+0000",
                modifiedtime: "2016-04-08T21:16:41+0000",
                pk: "8796387968048",
                template: "PageTemplate",
                name: "homepage",
                typeCode: "ContentPage",
                uid: "homepage",
                uuid: "homepage"
            }, {
                creationtime: "2016-04-08T21:16:41+0000",
                modifiedtime: "2016-04-08T21:16:41+0000",
                pk: "8796387968048",
                template: "ActionTemplate",
                name: "adz a synced page",
                typeCode: "ActionPage",
                uid: "syncedpageuid",
                uuid: "syncedpageuid"
            }, {
                creationtime: "2016-04-08T21:16:41+0000",
                modifiedtime: "2016-04-08T21:16:41+0000",
                pk: "8796387968048",
                template: "PageTemplate",
                name: "ADVERTISE",
                typeCode: "MyCustomType",
                uid: "uid3",
                uuid: "uid3"
            }, {
                creationtime: "2016-04-08T21:16:41+0000",
                modifiedtime: "2016-04-08T21:16:41+0000",
                pk: "8796387968048",
                template: "MyCustomPageTemplate",
                name: "page2TitleSuffix",
                typeCode: "HomePage",
                uid: "uid4",
                uuid: "uid4"
            }, {
                creationtime: "2016-04-08T21:16:41+0000",
                modifiedtime: "2016-04-08T21:16:41+0000",
                pk: "8796387968048",
                template: "ZTemplate",
                name: "page3TitleSuffix",
                typeCode: "ProductPage",
                uid: "uid5",
                uuid: "uid5"
            }, {
                creationtime: "2016-04-08T21:16:41+0000",
                modifiedtime: "2016-04-08T21:16:41+0000",
                pk: "8796387968048",
                template: "PageTemplate",
                name: "page3TitleSuffix",
                typeCode: "ProductPage",
                uid: "uid6",
                uuid: "uid6"
            }, {
                creationtime: "2016-04-08T21:16:41+0000",
                modifiedtime: "2016-04-08T21:16:41+0000",
                pk: "8796387968048",
                template: "PageTemplate",
                name: "page4TitleSuffix",
                typeCode: "WallPage",
                uid: "uid7",
                uuid: "uid7"
            }, {
                creationtime: "2016-04-08T21:16:41+0000",
                modifiedtime: "2016-04-08T21:16:41+0000",
                pk: "8796387968048",
                template: "PageTemplate",
                name: "page5TitleSuffix",
                typeCode: "CheckoutPage",
                uid: "uid8",
                uuid: "uid8"
            }, {
                creationtime: "2016-04-08T21:16:41+0000",
                modifiedtime: "2016-04-08T21:16:41+0000",
                pk: "8796387968048",
                template: "PageTemplate",
                name: "page6TitleSuffix",
                typeCode: "PromoPage",
                uid: "uid9",
                uuid: "uid9"
            }, {
                creationtime: "2016-04-08T21:16:41+0000",
                modifiedtime: "2016-04-08T21:16:41+0000",
                pk: "8796387968048",
                template: "PageTemplate",
                name: "WELCOMEPAGE",
                typeCode: "ProfilePage",
                uid: "uid10",
                uuid: "uid10"
            }, {
                creationtime: "2016-04-08T21:16:41+0000",
                modifiedtime: "2016-04-08T21:16:41+0000",
                pk: "8796387968048",
                template: "PageTemplate",
                name: "page3TitleSuffix",
                typeCode: "ProductPage",
                uid: "uid11",
                uuid: "uid11"
            }, {
                creationtime: "2016-04-08T21:16:41+0000",
                modifiedtime: "2016-04-08T21:16:41+0000",
                pk: "8796387968048",
                template: "PageTemplate",
                name: "page3TitleSuffix",
                typeCode: "ProductPage",
                uid: "zuid12",
                uuid: "zuid12"
            }];

            $httpBackend.whenGET(/cmswebservices\/v1\/sites\/apparel-uk\/catalogs\/apparel-ukContentCatalog\/versions\/Online\/pages$/).respond({
                pages: mockedPages
            });

            $httpBackend.whenGET(/cmswebservices\/v1\/sites\/apparel-uk\/catalogs\/apparel-ukContentCatalog\/versions\/Staged\/pages$/).respond({
                pages: mockedPages
            });

        });
angular.module('smarteditloader').requires.push('pageMocks');
angular.module('smarteditcontainer').requires.push('pageMocks');
