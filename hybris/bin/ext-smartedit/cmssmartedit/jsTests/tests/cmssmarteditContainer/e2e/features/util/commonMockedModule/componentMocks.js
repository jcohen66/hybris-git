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
    .module('componentMocks', ['ngMockE2E', 'backendMocksUtilsModule'])
    .run(
        function($httpBackend, parseQuery, backendMocksUtils) {

            var items = {
                componentItems: [{
                    'creationtime': '2016-08-17T16:05:47+0000',
                    'modifiedtime': '2016-08-17T16:05:47+0000',
                    'name': 'Component1',
                    'pk': '1',
                    'typeCode': 'AbstractCMSComponent',
                    'uid': 'component1',
                    'uuid': 'component1',
                    'visible': true
                }, {
                    'creationtime': '2016-08-17T16:05:47+0000',
                    'modifiedtime': '2016-08-17T16:05:47+0000',
                    'name': 'Component2',
                    'pk': '2',
                    'typeCode': 'AbstractCMSComponent',
                    'uid': 'component2',
                    'uuid': 'component2',
                    'visible': true
                }, {
                    'creationtime': '2016-08-17T16:05:47+0000',
                    'modifiedtime': '2016-08-17T16:05:47+0000',
                    'name': 'Component3',
                    'pk': '3',
                    'typeCode': 'AbstractCMSComponent',
                    'uid': 'component3',
                    'uuid': 'component3',
                    'visible': true
                }, {
                    'creationtime': '2016-08-17T16:05:47+0000',
                    'modifiedtime': '2016-08-17T16:05:47+0000',
                    'name': 'Component4',
                    'pk': '4',
                    'typeCode': 'AbstractCMSComponent',
                    'uid': 'component4',
                    'uuid': 'component4',
                    'visible': true
                }, {
                    'creationtime': '2016-08-17T16:05:47+0000',
                    'modifiedtime': '2016-08-17T16:05:47+0000',
                    'name': 'Component5',
                    'pk': '5',
                    'typeCode': 'AbstractCMSComponent',
                    'uid': 'component5',
                    'uuid': 'component5',
                    'visible': true
                }, {
                    'name': 'Component6',
                    'typeCode': 'AbstractCMSComponent',
                    'uid': 'Component6',
                    'uuid': 'Component6',
                }, {
                    'name': 'Component7',
                    'typeCode': 'AbstractCMSComponent',
                    'uid': 'Component7',
                    'uuid': 'Component7',
                }, {
                    'name': 'Component8',
                    'typeCode': 'AbstractCMSComponent',
                    'uid': 'Component8',
                    'uuid': 'Component8',
                }, {
                    'name': 'Component9',
                    'typeCode': 'AbstractCMSComponent',
                    'uid': 'Component9',
                    'uuid': 'Component9',
                }, {
                    'name': 'Component10',
                    'typeCode': 'AbstractCMSComponent',
                    'uid': 'Component10',
                    'uuid': 'Component10',
                }, {
                    'name': 'Component11',
                    'typeCode': 'AbstractCMSComponent',
                    'uid': 'Component11',
                    'uuid': 'Component11',
                }, {
                    'name': 'Component12',
                    'typeCode': 'AbstractCMSComponent',
                    'uid': 'Component12',
                    'uuid': 'Component12',
                }, {
                    'name': 'Component13',
                    'typeCode': 'AbstractCMSComponent',
                    'uid': 'Component13',
                    'uuid': 'Component13',
                }, {
                    'name': 'Component14',
                    'typeCode': 'AbstractCMSComponent',
                    'uid': 'Component14',
                    'uuid': 'Component14',
                }, {
                    'name': 'Component15',
                    'typeCode': 'AbstractCMSComponent',
                    'uid': 'Component15',
                    'uuid': 'Component15',
                }, {
                    'name': 'Component16',
                    'typeCode': 'AbstractCMSComponent',
                    'uid': 'Component16',
                    'uuid': 'Component16',
                }, {
                    'name': 'Component17',
                    'typeCode': 'AbstractCMSComponent',
                    'uid': 'Component17',
                    'uuid': 'Component6',
                }, {
                    'name': 'Component18',
                    'typeCode': 'AbstractCMSComponent',
                    'uid': 'Component18',
                    'uuid': 'Component18',
                }, {
                    'name': 'Component19',
                    'typeCode': 'AbstractCMSComponent',
                    'uid': 'Component19',
                    'uuid': 'Component19',
                }, {
                    'name': 'Component20',
                    'typeCode': 'AbstractCMSComponent',
                    'uid': 'Component20',
                    'uuid': 'Component20',
                }, {
                    'name': 'Component21',
                    'typeCode': 'AbstractCMSComponent',
                    'uid': 'Component21',
                    'uuid': 'Component21',
                }, {
                    'name': 'Component22',
                    'typeCode': 'AbstractCMSComponent',
                    'uid': 'Component22',
                    'uuid': 'Component22',
                }, {
                    'name': 'Component23',
                    'typeCode': 'AbstractCMSComponent',
                    'uid': 'Component23',
                    'uuid': 'Component23',
                }, {
                    'id': 'MyParagraph',
                    'pk': '123455667',
                    'uid': 'Comp_0006456345634',
                    'uuid': 'Comp_0006456345634',
                    'name': 'Custom Paragraph Component',
                    'headline': 'The Headline',
                    'active': true,
                    'content': 'the content to edit',
                    'activationDate': new Date().getTime(),
                    'creationtime': new Date().getTime(),
                    'modifiedtime': new Date().getTime(),
                    'media': '4',
                    'external': false,
                    'visible': true,
                    'restrictions': [],
                    'onlyOneRestrictionMustApply': false,
                    'slots': ['mocked_slot_id']
                }, {
                    'uid': 'componentWithMedia',
                    'uuid': 'componentWithMedia',
                    'media': {
                        'en': 'contextualmenu_delete_off'
                    }
                }, {
                    'uid': 'componentWithMediaContainer',
                    'uuid': 'componentWithMediaContainer',
                    'media': {
                        'en': {
                            'widescreen': 'clone4',
                            'desktop': 'dnd5'
                        }
                    }
                }, {

                    'uid': 'componentToValidateId',
                    'uuid': 'componentToValidateId',
                    'headline': 'The Headline',
                    'active': true,
                    'content': {
                        'en': 'the content to edit',
                        'fr': 'le contenu a editer',
                        'pl': 'tresc edytowac',
                        'it': 'il contenuto da modificare',
                        'hi': 'Sampaadit karanee kee liee saamagree'
                    },
                    'media': {
                        'en': 'contextualmenu_delete_off',
                        'hi': 'contextualmenu_delete_on',

                    },
                    'orientation': 'vertical',
                    'linkToggle': {
                        'external': false,
                        'urlLink': '/url-link'
                    }
                }, {
                    'uid': '8',
                    'uuid': '8',
                    'navigationComponent': '8'
                }, {
                    'uid': '8',
                    'uuid': 'navigationComponent',
                    'navigationComponent': '8'
                }, {
                    'uid': '4',
                    'uuid': 'node4'
                }, {
                    'uid': 'HomepageNavLink',
                    'uuid': 'HomepageNavLink',
                    'typeCode': 'CMSLinkComponent',
                    'linkName': {
                        'en': 'ABC Entry'
                    }
                }, {
                    'uid': '69SlamLink',
                    'typeCode': '69SlamLink',
                    'name': {
                        'en': 'DEF Entry'
                    }
                }, {
                    'uid': 'DakineLink',
                    'uuid': 'DakineLink',
                    'typeCode': 'CMSParagraphComponent',
                    'name': 'GHI Entry'
                }, {
                    'uid': 'AlMerrickLink',
                    'uuid': 'AlMerrickLink',
                    'typeCode': 'CMSParagraphComponent',
                    'name': 'XYZ Entry'
                }, {
                    'uid': 'Item-ID-8.1',
                    'uuid': 'Item-ID-8.1',
                    'typeCode': 'CMSLinkComponent',
                    'linkName': {
                        'en': 'JKL Entry'
                    }
                }, {
                    'uid': 'Item-ID-8.2',
                    'uuid': 'Item-ID-8.2',
                    'typeCode': 'CMSParagraphComponent',
                    'name': 'MNO Entry'
                }, {
                    'uid': 'Item-ID-4.1',
                    'uuid': 'Item-ID-4.1',
                    'typeCode': 'CMSParagraphComponent',
                    'name': 'PQR Entry'
                }, {
                    'uid': 'Item-ID-4.2',
                    'uuid': 'Item-ID-4.2',
                    'typeCode': 'CMSParagraphComponent',
                    'name': 'STU Entry'
                }, {
                    'name': 'Home Page Nav Link',
                    'typeCode': 'CMSLinkComponent',
                    'uid': 'HomepageNavLink',
                    'uuid': 'HomepageNavLink',
                    'visible': true
                }, {
                    'name': 'Al Merrick Link',
                    'typeCode': 'CMSLinkComponent',
                    'uid': 'AlMerrickLink',
                    'uuid': 'AlMerrickLink',
                    'visible': true
                }, {
                    'name': 'Nike Link',
                    'typeCode': 'CMSLinkComponent',
                    'uid': 'NikeLink',
                    'uuid': 'NikeLink',
                    'visible': true
                }, {
                    'name': '69 Slam Link',
                    'typeCode': 'CMSLinkComponent',
                    'uid': '69SlamLink',
                    'uuid': '69SlamLink',
                    'visible': true
                }, {
                    'name': 'Dakine Link',
                    'typeCode': 'CMSLinkComponent',
                    'uid': 'DakineLink',
                    'uuid': 'DakineLink',
                }, {
                    'typeCode': 'SingleOnlineProductSelector',
                    'uid': 'singleOnlineProductSelectorEditComponentId',
                    'uuid': 'singleOnlineProductSelectorEditComponentId',
                    'product': '300738116',
                }, {
                    'type': 'contentPageData',
                    'creationtime': '2016-06-28T15:23:37+0000',
                    'defaultPage': true,
                    'modifiedtime': '2016-06-28T15:25:51+0000',
                    'name': 'Homepage',
                    'pk': '8796101182512',
                    'masterTemplate': 'AccountPageTemplateUuid',
                    'title': {
                        'de': 'Mes lovens pendas',
                        'en': 'I love pandas'
                    },
                    'typeCode': 'ContentPage',
                    'uid': 'homepage',
                    'uuid': 'homepage',
                    'label': 'i-love-pandas',
                    'restrictions': [{
                        'uid': 'timeRestrictionIdA',
                        'uuid': 'timeRestrictionIdA',
                        'name': 'Some Time restriction A',
                        'typeCode': 'CMSTimeRestriction',
                        'itemtype': 'CMSTimeRestriction',
                        'description': 'some description'
                    }, {
                        'uid': 'timeRestrictionIdB',
                        'uuid': 'timeRestrictionIdB',
                        'name': 'another time B',
                        'typeCode': 'CMSTimeRestriction',
                        'itemtype': 'CMSTimeRestriction',
                        'description': 'some description'
                    }]
                }, {
                    'type': 'contentPageData',
                    'creationtime': '2016-06-28T15:23:37+0000',
                    'defaultPage': true,
                    'modifiedtime': '2016-06-28T15:25:51+0000',
                    'name': 'Some Other Page',
                    'pk': '8796101182512',
                    'masterTemplate': 'ProductPageTemplateUuid',
                    'title': {
                        'de': 'Mes hatens pendas',
                        'en': 'I hate pandas'
                    },
                    'typeCode': 'ProductPage',
                    'uid': 'secondpage',
                    'uuid': 'secondpage',
                    'label': 'i-hate-pandas'
                }, {
                    'uid': 'AccountPageTemplate',
                    'uuid': 'AccountPageTemplateUuid'
                }, {
                    'uid': 'ProductPageTemplate',
                    'uuid': 'ProductPageTemplateUuid'
                }, { // RESTRICTIONS
                    'uid': 'timeRestrictionIdA',
                    'uuid': 'timeRestrictionIdA',
                    'name': 'Some Time restriction A',
                    'typeCode': 'CMSTimeRestriction',
                    'itemtype': 'CMSTimeRestriction',
                    'description': 'some description'
                }, {
                    'uid': 'timeRestrictionIdB',
                    'uuid': 'timeRestrictionIdB',
                    'name': 'another time B',
                    'typeCode': 'CMSTimeRestriction',
                    'itemtype': 'CMSTimeRestriction',
                    'description': 'some description'
                }, {
                    'uid': 'timeRestrictionIdC',
                    'uuid': 'timeRestrictionIdC',
                    'name': 'yet another',
                    'typeCode': 'CMSTimeRestriction',
                    'itemtype': 'CMSTimeRestriction',
                    'description': 'some description'
                }, {
                    'uid': 'catalogRestrictionIdD',
                    'uuid': 'catalogRestrictionIdD',
                    'name': 'some cat restriction',
                    'typeCode': 'CMSCategoryRestriction',
                    'itemtype': 'CMSCategoryRestriction',
                    'description': 'some description',
                    'categories': ['categoryA']
                }, {
                    'uid': 'catalogRestrictionIdE',
                    'uuid': 'catalogRestrictionIdE',
                    'name': "I'm a skatman",
                    'typeCode': 'CMSCatalogRestriction',
                    'itemtype': 'CMSCatalogRestriction',
                    'description': 'some description'
                }, {
                    'uid': 'catalogRestrictionIdF',
                    'uuid': 'catalogRestrictionIdF',
                    'name': 'Cat restriction E',
                    'typeCode': 'CMSCatalogRestriction',
                    'itemtype': 'CMSCatalogRestriction',
                    'description': 'some description'
                }, {
                    'uid': 'catalogRestrictionIdG',
                    'uuid': 'catalogRestrictionIdG',
                    'name': 'catalogRestrictionNameG',
                    'typeCode': 'CMSCatalogRestriction',
                    'itemtype': 'CMSCatalogRestriction',
                    'description': 'some description'
                }, {
                    'uid': 'catalogRestrictionIdH',
                    'uuid': 'catalogRestrictionIdH',
                    'name': 'Some User restriciton 1',
                    'typeCode': 'CMSCatalogRestriction',
                    'itemtype': 'CMSCatalogRestriction',
                    'description': 'some description'
                }, {
                    'uid': 'userRestrictionIdI',
                    'uuid': 'userRestrictionIdI',
                    'name': 'User restriction 2',
                    'typeCode': 'CMSUserRestriction',
                    'itemtype': 'CMSUserRestriction',
                    'description': 'some description'
                }, {
                    'uid': 'userGroupRestrictionId1',
                    'uuid': 'userGroupRestrictionId1',
                    'name': 'User Group Restriction 1',
                    'typeCode': 'CMSUserGroupRestriction',
                    'itemtype': 'CMSUserGroupRestriction',
                    'description': 'some description'
                }, { //page for restrictions
                    'type': 'contentPageData',
                    'uid': 'add-edit-address',
                    'uuid': 'add-edit-address',
                    'onlyOneRestrictionMustApply': false,
                    'creationtime': '2016-07-15T23:35:21+0000',
                    'defaultPage': true,
                    'modifiedtime': '2016-07-15T23:38:01+0000',
                    'name': 'Add Edit Address Page',
                    'pk': '8796095743024',
                    'template': 'AccountPageTemplate',
                    'title': {
                        'de': 'Adresse hinzufügen/bearbeiten'
                    },
                    'label': 'add-edit-address',
                    'restrictions': [{
                        'uid': 'timeRestrictionIdA',
                        'uuid': 'timeRestrictionIdA',
                        'name': 'Some Time restriction A',
                        'typeCode': 'CMSTimeRestriction',
                        'itemtype': 'CMSTimeRestriction',
                        'description': 'some description'
                    }, {
                        'uid': 'catalogRestrictionIdD',
                        'uuid': 'catalogRestrictionIdD',
                        'name': 'some cat restriction',
                        'typeCode': 'CMSCategoryRestriction',
                        'itemtype': 'CMSCategoryRestriction',
                        'description': 'some description',
                        'categories': ['categoryA']
                    }]
                }, { //PAGES
                    creationtime: "2016-04-08T21:16:41+0000",
                    modifiedtime: "2016-04-08T21:16:41+0000",
                    pk: "8796387968048",
                    template: "PageTemplate",
                    name: "page1TitleSuffix",
                    label: 'page1TitleSuffix',
                    typeCode: "ContentPage",
                    uid: "auid1",
                    uuid: "auid1"
                }, {
                    creationtime: "2016-04-08T21:16:41+0000",
                    modifiedtime: "2016-04-08T21:16:41+0000",
                    pk: "8796387968048",
                    template: "ActionTemplate",
                    name: "welcomePage",
                    typeCode: "ActionPage",
                    uid: "uid2",
                    uuid: "uid2"
                }, {
                    creationtime: "2016-04-08T21:16:41+0000",
                    modifiedtime: "2016-04-08T21:16:41+0000",
                    pk: "8796387968048",
                    template: "PageTemplate",
                    name: "Advertise",
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
                    creationtime: '2016-07-07T14:33:37+0000',
                    defaultPage: true,
                    modifiedtime: '2016-07-12T01:23:41+0000',
                    name: 'My Little Primary Content Page',
                    onlyOneRestrictionMustApply: true,
                    pk: '8796101182512',
                    template: 'SomePageTemplate',
                    title: {
                        en: 'Primary Content Page'
                    },
                    typeCode: 'ContentPage',
                    uid: 'primaryContentPage',
                    uuid: "primaryContentPage",
                    label: 'primary-content-page'
                }, {
                    creationtime: '2016-07-07T14:33:37+0000',
                    defaultPage: true,
                    modifiedtime: '2016-07-12T01:23:41+0000',
                    name: 'My Little Variation Content Page',
                    onlyOneRestrictionMustApply: true,
                    pk: '8796101182512',
                    template: 'SomePageTemplate',
                    title: {
                        en: 'Variation Content Page'
                    },
                    typeCode: 'ContentPage',
                    uid: 'variationContentPage',
                    uuid: "variationContentPage",
                    label: 'variation-content-page'
                }, {
                    creationtime: '2016-07-07T14:33:37+0000',
                    defaultPage: true,
                    modifiedtime: '2016-07-12T01:23:41+0000',
                    name: 'My Little Primary Category Page',
                    onlyOneRestrictionMustApply: true,
                    pk: '8796101182512',
                    template: 'SomePageTemplate',
                    title: {
                        en: 'Primary Category Page'
                    },
                    typeCode: 'CategoryPage',
                    uid: 'primaryCategoryPage',
                    uuid: "primaryCategoryPage",
                    label: 'primary-category-page'
                }, {
                    creationtime: '2016-07-07T14:33:37+0000',
                    defaultPage: true,
                    modifiedtime: '2016-07-12T01:23:41+0000',
                    name: 'My Little Variation Category Page',
                    onlyOneRestrictionMustApply: true,
                    pk: '8796101182512',
                    template: 'SomePageTemplate',
                    title: {
                        en: 'Variation Category Page'
                    },
                    typeCode: 'CategoryPage',
                    uid: 'variationCategoryPage',
                    uuid: "variationCategoryPage",
                    label: 'variation-category-page'
                }, {
                    creationtime: '2016-07-07T14:33:37+0000',
                    defaultPage: true,
                    modifiedtime: '2016-07-12T01:23:41+0000',
                    name: 'My Little Primary Product Page',
                    onlyOneRestrictionMustApply: true,
                    pk: '8796101182512',
                    template: 'SomePageTemplate',
                    title: {
                        en: 'Primary Product Page'
                    },
                    typeCode: 'ProductPage',
                    uid: 'primaryProductPage',
                    uuid: "primaryProductPage",
                    label: 'primary-product-page'
                }, {
                    creationtime: '2016-07-07T14:33:37+0000',
                    defaultPage: true,
                    modifiedtime: '2016-07-12T01:23:41+0000',
                    name: 'My Little Variation Product Page',
                    onlyOneRestrictionMustApply: true,
                    pk: '8796101182512',
                    template: 'SomePageTemplate',
                    title: {
                        en: 'Variation Product Page'
                    },
                    typeCode: 'ProductPage',
                    uid: 'variationProductPage',
                    uuid: "variationProductPage",
                    label: 'variation-product-page'
                }, {
                    creationtime: "2016-06-28T15:23:37+0000",
                    defaultPage: true,
                    modifiedtime: "2016-06-28T15:25:51+0000",
                    name: "Some Other Page",
                    pk: "8796101182512",
                    template: "ProductPageTemplate",
                    title: {
                        de: "Mes hatens pendas",
                        en: "I hate pandas"
                    },
                    typeCode: "ProductPage",
                    uid: "secondpage",
                    uuid: "secondpage",
                    label: "i-hate-pandas"
                }, {
                    'type': 'contentPageData',
                    'defaultPage': true,
                    'name': 'Homepage_uk_online',
                    'typeCode': 'ContentPage',
                    'uid': 'homepage_uk_online',
                    'uuid': 'homepage_uk_online',
                    'catalogVersion': 'apparel-ukContentCatalog/Online',
                    'label': 'i-hate-pandas',
                    'restrictions': []
                }, {
                    'type': 'contentPageData',
                    'defaultPage': true,
                    'name': 'Homepage_global_online',
                    'typeCode': 'ContentPage',
                    'uid': 'homepage_global_online',
                    'uuid': 'homepage_global_online',
                    'catalogVersion': 'apparelContentCatalog/Online',
                    'label': 'i-hate-pandas',
                    'restrictions': []
                }, {
                    'type': 'contentPageData',
                    'defaultPage': true,
                    'name': 'Homepage_global_staged',
                    'typeCode': 'ContentPage',
                    'uid': 'homepage_global_staged',
                    'uuid': 'homepage_global_staged',
                    'catalogVersion': 'apparelContentCatalog/Staged',
                    'restrictions': []
                }, {
                    'type': 'contentPageData',
                    'defaultPage': false,
                    'name': 'Homepage_gloabl_online_variation',
                    'typeCode': 'ContentPage',
                    'uid': 'homepage_gloabl_online_variation',
                    'uuid': 'homepage_gloabl_online_variation',
                    'catalogVersion': 'apparelContentCatalog/Online',
                    'restrictions': []
                }, {
                    'type': 'contentPageData',
                    'defaultPage': true,
                    'name': 'Homepage_gloabl_online_copy_disabled',
                    'copyToCatalogsDisabled': true,
                    'typeCode': 'ContentPage',
                    'uid': 'homepage_gloabl_online_copy_disabled',
                    'uuid': 'homepage_gloabl_online_copy_disabled',
                    'catalogVersion': 'apparelContentCatalog/Online',
                    'restrictions': []
                }]
            };

            sessionStorage.setItem('componentMocks', JSON.stringify(items));

            var componentGETMock = $httpBackend.whenGET(/\/cmswebservices\/v1\/sites\/.*\/cmsitems\/.*/);
            componentGETMock.respond(function(method, url, data, headers) {
                var uuid = /cmsitems\/(.*)/.exec(url)[1];
                return [200, JSON.parse(sessionStorage.getItem('componentMocks')).componentItems.find(function(item) {
                    return item.uuid === uuid;
                })];
            });
            backendMocksUtils.storeBackendMock('componentGETMock', componentGETMock);

            //old mock to be removed with navigation refactoring
            $httpBackend.whenGET(/\/cmswebservices\/v1\/sites\/.*\/catalogs\/.*\/versions\/.*\/items\/.*/).respond(function(method, url, data, headers) {
                var uid = /items\/(.*)/.exec(url)[1];
                return [200, JSON.parse(sessionStorage.getItem('componentMocks')).componentItems.find(function(item) {
                    return item.uid === uid;
                })];
            });

            var validationErrors_No_Media = {
                'errors': [{
                    'message': 'A Media must be selected. Language: [en]',
                    'reason': 'missing',
                    'subject': 'media',
                    'subjectType': 'parameter',
                    'type': 'ValidationError'
                }]
            };

            //pushed to global namespace for easy override by specific mocks
            var componentPUTMock = $httpBackend.whenPUT(/\/cmswebservices\/v1\/sites\/.*\/cmsitems\/.*/);
            window.itemPUTDefaultResponse = function(method, url, data, headers) {
                var uuid = /cmsitems\/(.*)/.exec(url)[1];
                var payload = JSON.parse(data);
                items.componentItems = items.componentItems.map(function(item) {
                    if (item.uuid === payload.uuid) {
                        return payload;
                    } else {
                        return item;
                    }
                });

                sessionStorage.setItem('componentMocks', JSON.stringify(items));

                if (uuid === 'componentToValidateId' && !payload.media.en) {
                    return [400, validationErrors_No_Media];
                } else {
                    return [204];
                }
            };

            window.itemPUT = componentPUTMock;
            componentPUTMock.respond(window.itemPUTDefaultResponse);
            backendMocksUtils.storeBackendMock('componentPUTMock', componentPUTMock);

            var componentPOSTMock = $httpBackend.whenPOST(/\/cmswebservices\/v1\/sites\/.*\/cmsitems/);
            componentPOSTMock.respond(function(method, url, data, headers) {
                var dataObject = angular.fromJson(data);
                if (dataObject.uid === 'trump') {
                    return [400, {
                        'errors': [{
                            'message': 'No Trump jokes plz.',
                            'reason': 'invalid',
                            'subject': 'uid',
                            'subjectType': 'parameter',
                            'type': 'ValidationError'
                        }]
                    }];
                }
                return [200, {
                    uid: 'valid'
                }];
            });
            backendMocksUtils.storeBackendMock('componentPOSTMock', componentPOSTMock);

            var cmsLinkToComponentAttribute = {
                "cmsStructureType": "CMSLinkToSelect",
                "collection": false,
                "editable": true,
                "i18nKey": "type.cmslinkcomponent.linkto.name",
                "mode": "DEFAULT",
                "idAttribute": "id",
                "labelAttributes": ['label'],
                "options": [{
                    "label": "se.cms.linkto.option.content",
                    "id": "content"
                }, {
                    "label": "se.cms.linkto.option.product",
                    "id": "product"
                }, {
                    "label": "se.cms.linkto.option.category",
                    "id": "category"
                }, {
                    "label": "se.cms.linkto.option.external",
                    "id": "external"
                }],
                'paged': false,
                'qualifier': 'linkTo',
                'required': true
            };

            var componentsListGETMock = $httpBackend.whenGET(/\/cmswebservices\/v1\/sites\/.*\/cmsitems/).respond(function(method, url, data, headers) {
                var params = parseQuery(url);
                var currentPage = params.currentPage;
                var mask = params.mask;
                var pageSize = params.pageSize;
                var typeCode = params.typeCode;
                var uuids = params.uuids && params.uuids.split(',');
                var itemSearchParams = params.itemSearchParams && params.itemSearchParams.split(',');

                var filteredItems = JSON.parse(sessionStorage.getItem('componentMocks')).componentItems;

                if (uuids) {
                    filteredItems = items.componentItems.filter(function(item) {
                        return uuids.indexOf(item.uuid) > -1;
                    });

                    return [200, {
                        response: filteredItems
                    }];
                }

                if (typeCode) {
                    filteredItems = items.componentItems.filter(function(item) {
                        return item.typeCode === typeCode;
                    });
                }

                if (itemSearchParams) {
                    filteredItems = items.componentItems.filter(function(item) {
                        var filtered = false;
                        itemSearchParams.forEach(function(param) {
                            var paramParsed = param.split(':');
                            if (paramParsed.length === 2 && item[paramParsed[0]] === paramParsed[1]) {
                                filtered = true;
                            }
                        });

                        return filtered;
                    });
                }

                filteredItems = filteredItems.filter(function(item) {
                    return mask ? ((item.name && typeof item.name === 'string' && item.name.toUpperCase().indexOf(mask.toUpperCase()) > -1) || item.uid.toUpperCase().indexOf(mask.toUpperCase()) > -1) : true;
                });

                var results = filteredItems.slice(currentPage * 10, currentPage * 10 + 10);

                var pagedResults = {
                    pagination: {
                        count: 10,
                        page: currentPage,
                        totalCount: filteredItems.length,
                        totalPages: 3
                    },
                    response: results
                };

                return [200, pagedResults];
            });
            backendMocksUtils.storeBackendMock('componentsListGETMock', componentsListGETMock);


            //old mock to be removed with navigation refactoring
            $httpBackend.whenGET(/\/cmswebservices\/v1\/sites\/.*\/catalogs\/.*\/versions\/.*\/items/).respond(function(method, url, data, headers) {
                var params = parseQuery(url);
                var currentPage = params.currentPage;
                var mask = params.mask;
                var pageSize = params.pageSize;

                var filtered = items.componentItems.filter(function(item) {
                    return mask ? ((item.name && typeof item.name === 'string' && item.name.toUpperCase().indexOf(mask.toUpperCase()) > -1) || item.uid.toUpperCase().indexOf(mask.toUpperCase()) > -1) : true;
                });

                var results = filtered.slice(currentPage * 10, currentPage * 10 + 10);

                var pagedResults = {
                    pagination: {
                        count: 10,
                        page: currentPage,
                        totalCount: filtered.length,
                        totalPages: 3
                    },
                    componentItems: results
                };

                return [200, pagedResults];
            });

            var componentTypes = [{
                attributes: [{
                    cmsStructureType: 'RichText',
                    i18nKey: 'type.cmsparagraphcomponent.content.name',
                    localized: false,
                    qualifier: 'content'
                }],
                category: 'COMPONENT',
                code: 'CMSParagraphComponent',
                i18nKey: 'type.cmsparagraphcomponent.name',
                name: 'Paragraph'
            }, {
                attributes: [{
                    cmsStructureType: "NavigationNodeSelector",
                    i18nKey: "type.footernavigationcomponent.navigationnode.name",
                    localized: false,
                    qualifier: 'navigationNode'
                }],
                category: 'COMPONENT',
                code: 'FooterNavigationComponent',
                i18nKey: 'type.footernavigationcomponent.name',
                name: 'Footer Navigation Component'
            }, {
                attributes: [{
                    cmsStructureType: 'Media',
                    i18nKey: 'type.simplebannercomponent.media.name',
                    localized: true,
                    qualifier: 'media'
                }, {
                    cmsStructureType: 'ShortString',
                    i18nKey: 'type.simplebannercomponent.urllink.name',
                    localized: false,
                    qualifier: 'urlLink'
                }, {
                    cmsStructureType: 'Boolean',
                    i18nKey: 'type.simplebannercomponent.external.name',
                    localized: false,
                    qualifier: 'external'
                }],
                category: 'COMPONENT',
                code: 'SimpleBannerComponent',
                i18nKey: 'type.simplebannercomponent.name',
                name: 'Simple Banner Component'
            }, {
                attributes: [{
                    cmsStructureType: 'ShortString',
                    qualifier: 'id',
                    i18nKey: 'type.cmsparagraphcomponent.id.name'
                }, {
                    cmsStructureType: 'LongString',
                    qualifier: 'headline',
                    i18nKey: 'type.cmsparagraphcomponent.headline.name'
                }],
                category: 'NotToBeFound',
                code: 'XYZComponent',
                i18nKey: 'type.xyzcomponent.name',
                name: 'XYZ Component'
            }, {
                attributes: [{
                    cmsStructureType: 'ShortString',
                    qualifier: 'id',
                    i18nKey: 'type.thesmarteditcomponenttype.id.name'
                }, {
                    cmsStructureType: 'LongString',
                    qualifier: 'headline',
                    i18nKey: 'type.thesmarteditcomponenttype.headline.name'
                }, {
                    cmsStructureType: 'Boolean',
                    qualifier: 'active',
                    i18nKey: 'type.thesmarteditcomponenttype.active.name'
                }, {
                    cmsStructureType: 'Date',
                    qualifier: 'activationDate',
                    i18nKey: 'type.thesmarteditcomponenttype.activationDate.name'
                }, {
                    cmsStructureType: 'RichText',
                    qualifier: 'content',
                    i18nKey: 'type.thesmarteditcomponenttype.content.name'
                }, {
                    cmsStructureType: "LinkToggle",
                    qualifier: "linkToggle",
                    i18nKey: "se.editor.linkto.label",
                    localized: false
                }],
                category: 'NotToBeFound',
                code: 'thesmarteditComponentType',
                i18nKey: 'type.abccomponent.name',
                name: 'ABC Component'

            }, {
                attributes: [{
                    cmsStructureType: 'Media',
                    qualifier: 'media',
                    i18nKey: 'type.typewithmedia.media.name',
                    localized: true,
                    required: true
                }],
                category: 'NotToBeFound',
                code: 'TypeWithMedia',
                i18nKey: 'type.TypeWithMedia.name',
                name: 'TypeWithMedia Component'
            }, {
                attributes: [{
                    cmsStructureType: 'MediaContainer',
                    qualifier: 'media',
                    i18nKey: 'type.typewithmediacontainer.media.name',
                    localized: true,
                    required: true,
                    options: [{
                        "id": "widescreen",
                        "label": "se.media.format.widescreen"
                    }, {
                        "id": "desktop",
                        "label": "se.media.format.desktop"
                    }, {
                        "id": "tablet",
                        "label": "se.media.format.tablet"
                    }, {
                        "id": "mobile",
                        "label": "se.media.format.mobile"
                    }]
                }],
                category: 'NotToBeFound',
                code: 'TypeWithMediaContainer',
                name: 'TypeWithMediaContainer Component'
            }, {
                attributes: [{
                    cmsStructureType: 'ShortString',
                    qualifier: 'id',
                    i18nKey: 'type.thesmarteditComponentType.id.name',
                    localized: false
                }, {
                    cmsStructureType: 'Media',
                    qualifier: 'media',
                    i18nKey: 'type.thesmarteditComponentType.media.name',
                    localized: true
                }, {
                    cmsStructureType: 'Enum',
                    cmsStructureEnumType: 'de.mypackage.Orientation',
                    qualifier: 'orientation',
                    i18nKey: 'type.thesmarteditcomponenttype.orientation.name',
                    localized: false,
                    required: true
                }, {
                    cmsStructureType: 'LongString',
                    qualifier: 'headline',
                    i18nKey: 'type.thesmarteditComponentType.headline.name',
                    localized: false
                }, {
                    cmsStructureType: 'Boolean',
                    qualifier: 'active',
                    i18nKey: 'type.thesmarteditComponentType.active.name',
                    localized: false
                }, {
                    cmsStructureType: 'RichText',
                    qualifier: 'content',
                    i18nKey: 'type.thesmarteditComponentType.content.name',
                    localized: true
                }, {
                    cmsStructureType: "LinkToggle",
                    qualifier: "linkToggle",
                    i18nKey: "se.editor.linkto.label",
                    localized: false
                }],
                category: 'NotToBeFound',
                code: 'componentToValidateType',
                name: 'Validation Component'
            }, {
                attributes: [{
                    cmsStructureType: 'NavigationNodeSelector',
                    qualifier: 'navigationComponent',
                    i18nKey: 'type.thesmarteditcomponenttype.navigationComponent.name',
                    localized: false,
                    required: true
                }],
                category: 'NotToBeFound',
                code: 'NavigationComponentType',
                name: 'Navigation Component'
            }, {
                attributes: [{
                    cmsStructureType: 'ShortString',
                    collection: false,
                    editable: true,
                    i18nKey: 'type.productcarouselcomponent.title.name',
                    localized: true,
                    mode: 'DEFAULT',
                    paged: false,
                    qualifier: 'title',
                    required: false
                }, {
                    cmsStructureType: 'MultiProductSelector',
                    collection: false,
                    editable: true,
                    i18nKey: 'type.productcarouselcomponent.products.name',
                    localized: false,
                    mode: 'DEFAULT',
                    paged: false,
                    qualifier: 'products',
                    required: false
                }, {
                    cmsStructureType: 'MultiCategorySelector',
                    collection: false,
                    editable: true,
                    i18nKey: 'type.productcarouselcomponent.categories.name',
                    localized: false,
                    mode: 'DEFAULT',
                    paged: false,
                    qualifier: 'categories',
                    required: false
                }],
                category: 'COMPONENT',
                code: 'ProductCarouselComponent',
                i18nKey: 'type.productcarouselcomponent.name',
                name: 'Product Carousel',
                type: 'productCarouselComponentData'
            }, {
                attributes: [{
                    'cmsStructureType': 'ShortString',
                    'collection': false,
                    'editable': true,
                    'i18nKey': 'type.cmslinkcomponent.linkname.name',
                    'localized': true,
                    'mode': 'DEFAULT',
                    'paged': false,
                    'qualifier': 'linkName',
                    'required': true
                }, cmsLinkToComponentAttribute],
                category: 'COMPONENT',
                code: 'CMSLinkComponent',
                i18nKey: 'type.cmslinkcomponent.name',
                name: 'Link',
                type: 'cmsLinkComponentData'
            }, {
                attributes: [{
                    'cmsStructureType': 'SingleOnlineProductSelector',
                    'i18nKey': 'name',
                    'mode': 'DEFAULT',
                    'qualifier': 'product',
                    'required': true
                }],
                'category': 'COMPONENT',
                'code': 'TestSingleOnlineProductSelector',
                'i18nKey': 'type.testsingleonlineproductselector.name',
                'name': 'TestSingleOnlineProductSelector',
                'type': 'testComponentData'
            }, {
                attributes: [{
                    'cmsStructureType': 'SingleOnlineCategorySelector',
                    'i18nKey': 'name',
                    'mode': 'DEFAULT',
                    'qualifier': 'category',
                    'required': true
                }],
                'category': 'COMPONENT',
                'code': 'TestSingleOnlineCategorySelector',
                'i18nKey': 'type.testsingleonlinecategoryselector.name',
                'name': 'TestSingleOnlineCategorySelector',
                'type': 'testComponentData'
            }];

            var catalogStructureApiMocks = $httpBackend.whenGET(/cmswebservices\/v1\/types\?code=CMSLinkComponent\&mode=CATEGORY/);
            catalogStructureApiMocks.respond(function(method, url, data, headers) {
                var componentType = {
                    attributes: [{
                            'cmsStructureType': 'ShortString',
                            'collection': false,
                            'editable': true,
                            'i18nKey': 'type.cmslinkcomponent.linkname.name',
                            'localized': true,
                            'paged': false,
                            'qualifier': 'linkName',
                            'required': true
                        },
                        cmsLinkToComponentAttribute, {
                            'cmsStructureType': 'SingleOnlineCategorySelector',
                            'i18nKey': 'name',
                            'qualifier': 'category',
                            'required': true
                        }, {
                            'cmsStructureType': 'Boolean',
                            'collection': false,
                            'editable': true,
                            'i18nKey': 'type.cmslinkcomponent.target.name',
                            'localized': false,
                            'paged': false,
                            'qualifier': 'target',
                            'required': true
                        }
                    ],
                    'category': 'COMPONENT',
                    'code': 'CMSLinkComponent',
                    'i18nKey': 'type.cmslinkcomponent.name',
                    'name': 'Link',
                    'type': 'cmsLinkComponentData'
                };
                return [200, componentType];
            });

            var productStructureApiMocks = $httpBackend.whenGET(/cmswebservices\/v1\/types\?code=CMSLinkComponent\&mode=PRODUCT/);
            productStructureApiMocks.respond(function(method, url, data, headers) {
                var componentType = {
                    attributes: [{
                            'cmsStructureType': 'ShortString',
                            'collection': false,
                            'editable': true,
                            'i18nKey': 'type.cmslinkcomponent.linkname.name',
                            'localized': true,
                            'paged': false,
                            'qualifier': 'linkName',
                            'required': true
                        },
                        cmsLinkToComponentAttribute, {
                            'cmsStructureType': 'SingleOnlineProductSelector',
                            'i18nKey': 'name',
                            'qualifier': 'product',
                            'required': true
                        }, {
                            'cmsStructureType': 'Boolean',
                            'collection': false,
                            'editable': true,
                            'i18nKey': 'type.cmslinkcomponent.target.name',
                            'localized': false,
                            'paged': false,
                            'qualifier': 'target',
                            'required': true
                        }
                    ],
                    'category': 'COMPONENT',
                    'code': 'CMSLinkComponent',
                    'i18nKey': 'type.cmslinkcomponent.name',
                    'name': 'Link',
                    'type': 'cmsLinkComponentData'
                };
                return [200, componentType];
            });

            var contentStructureApiMocks = $httpBackend.whenGET(/cmswebservices\/v1\/types\?code=CMSLinkComponent\&mode=CONTENT/);
            contentStructureApiMocks.respond(function(method, url, data, headers) {
                var componentType = {
                    attributes: [{
                            'cmsStructureType': 'ShortString',
                            'collection': false,
                            'editable': true,
                            'i18nKey': 'type.cmslinkcomponent.linkname.name',
                            'localized': true,
                            'paged': false,
                            'qualifier': 'linkName',
                            'required': true
                        },
                        cmsLinkToComponentAttribute, {
                            'cmsStructureType': 'EditableDropdown',
                            'collection': false,
                            'editable': true,
                            'i18nKey': 'type.cmslinkcomponent.contentpage.name',
                            'localized': false,
                            'paged': true,
                            'qualifier': 'contentPage',
                            'required': true,
                            'idAttribute': 'uid',
                            'labelAttributes': ['name']
                        }, {
                            'cmsStructureType': 'Boolean',
                            'collection': false,
                            'editable': true,
                            'i18nKey': 'type.cmslinkcomponent.target.name',
                            'localized': false,
                            'paged': false,
                            'qualifier': 'target',
                            'required': true
                        }
                    ],
                    'category': 'COMPONENT',
                    'code': 'CMSLinkComponent',
                    'i18nKey': 'type.cmslinkcomponent.name',
                    'name': 'Link',
                    'type': 'cmsLinkComponentData'
                };
                return [200, componentType];
            });

            var externalLinkStructureApiMocks = $httpBackend.whenGET(/cmswebservices\/v1\/types\?code=CMSLinkComponent\&mode=EXTERNAL/);
            externalLinkStructureApiMocks.respond(function(method, url, data, headers) {
                var componentType = {
                    attributes: [{
                            'cmsStructureType': 'ShortString',
                            'collection': false,
                            'editable': true,
                            'i18nKey': 'type.cmslinkcomponent.linkname.name',
                            'localized': true,
                            'paged': false,
                            'qualifier': 'linkName',
                            'required': true
                        },
                        cmsLinkToComponentAttribute, {
                            'cmsStructureType': 'ShortString',
                            'collection': false,
                            'editable': true,
                            'i18nKey': 'type.cmslinkcomponent.url.name',
                            'localized': false,
                            'paged': false,
                            'qualifier': 'url',
                            'required': true
                        }, {
                            'cmsStructureType': 'Boolean',
                            'collection': false,
                            'editable': true,
                            'i18nKey': 'type.cmslinkcomponent.target.name',
                            'localized': false,
                            'paged': false,
                            'qualifier': 'target',
                            'required': true
                        }
                    ],
                    'category': 'COMPONENT',
                    'code': 'CMSLinkComponent',
                    'i18nKey': 'type.cmslinkcomponent.name',
                    'name': 'Link',
                    'type': 'cmsLinkComponentData'
                };
                return [200, componentType];
            });

            $httpBackend.whenGET(/cmswebservices\/v1\/types\?category\=COMPONENT/).respond({
                componentTypes: componentTypes.filter(function(type) {
                    return type.category === 'COMPONENT';
                })
            });

            $httpBackend.whenGET(/cmswebservices\/v1\/types\?code=(.*)\&mode=DEFAULT/).respond(function(method, url, data, headers) {

                var typeCode = /cmswebservices\/v1\/types\?code=(.*)\&mode=DEFAULT/.exec(url)[1];

                var componentType = componentTypes.find(function(type) {
                    return type.code === typeCode;
                });
                return [200, componentType];

            });

            $httpBackend.whenGET(/cmswebservices\/v1\/types\/(.*)/).respond(function(method, url, data, headers) {

                var typeCode = /cmswebservices\/v1\/types\/(.*)/.exec(url)[1];

                var componentType = componentTypes.find(function(type) {
                    return type.code === typeCode;
                });
                return [200, componentType];

            });

            var orientationEnums = {
                enums: [{
                    code: 'vertical',
                    label: 'Vertical'
                }, {
                    code: 'horizontal',
                    label: 'Horizontal'
                }, ]
            };


            $httpBackend.whenGET(/cmswebservices\/v1\/enums/).respond(function(method, url, data, headers) {
                var enumClass = parseQuery(url).enumClass;
                if (enumClass === 'de.mypackage.Orientation') {
                    return [200, orientationEnums];
                } else {
                    return [404];
                }
            });

            // Set GET response
            $httpBackend.expectGET(/cmssmartedit\/images\/component_default.png/).respond({});
        });
try {
    angular.module('smarteditloader').requires.push('componentMocks');
} catch (e) {}
try {
    angular.module('smarteditcontainer').requires.push('componentMocks');
} catch (e) {}
