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
describe('pageFacade', function() {

    var MOCK_PAGE = {
        uid: 'somePageUid',
        name: 'Some Page Name',
        typeCode: 'somePageTypeCode',
        label: 'some-page-label',
        catalogVersion: 'someCatalogVersionUid'
    };

    var MOCK_CATALOG_VERSION = {
        uid: 'someCatalogVersionUid',
        catalogId: 'someCatalogId',
        version: 'someVersion'
    };

    var MOCK_RESULT_WITH_RESPONSE = {
        response: [MOCK_PAGE]
    };

    var MOCK_RESULT_WITH_NO_RESPONSE = {
        response: []
    };

    var mocks,
        resource,
        service,
        $q;

    beforeEach(function() {
        resource = jasmine.createSpyObj('resource', ['get']);
        var harness = AngularUnitTestHelper.prepareModule('pageFacadeModule')
            .mock('cmsitemsRestService', 'get').and.returnValue(resource)
            .mock('sharedDataService', 'get').and.returnValue(resource)
            .mock('restServiceFactory', 'get').and.returnValue(resource)
            .mock('urlService', 'buildUriContext').and.returnValue(resource)
            .mock('catalogService', 'getCatalogVersionUUid').and.returnValue(resource)
            .mock('cmsitemsUri').and.returnValue('testUrl')
            .service('pageFacade');
        service = harness.service;
        mocks = harness.mocks;
        $q = harness.injected.$q;
    });

    describe('contentPageWithLabelExists', function() {
        it('will return a promise resolving to true if the content page with given label exists', function() {
            mocks.cmsitemsRestService.get.and.returnValue($q.when(MOCK_RESULT_WITH_RESPONSE));

            expect(service.contentPageWithLabelExists(MOCK_PAGE.label, MOCK_CATALOG_VERSION.catalogId, MOCK_CATALOG_VERSION.version)).toBeResolvedWithData(true);
        });

        it('will return a promise resolving to false if the content page with given label does not exist', function() {
            mocks.cmsitemsRestService.get.and.returnValue($q.when(MOCK_RESULT_WITH_NO_RESPONSE));

            expect(service.contentPageWithLabelExists('labelDoesNotExist', MOCK_CATALOG_VERSION.catalogId, MOCK_CATALOG_VERSION.version)).toBeResolvedWithData(false);
        });
    });
});
