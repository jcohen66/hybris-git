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
describe("Synchronization polling service with active version - ", function() {

    var harness, syncPollingService, $q, mockRest;
    var mockTimer, systemEventServiceMock, componentHandlerServiceMock, catalogServiceMock;

    var synchronizationMockData = unit.mockData.synchronization;
    var pageId1_SyncStatus = new synchronizationMockData().PAGE_ID1_SYNC_STATUS;
    var pageId2_SyncStatus = new synchronizationMockData().PAGE_ID2_SYNC_STATUS;

    beforeEach(function() {

        mockRest = jasmine.createSpyObj('pageSynchronizationGetRestService', ['get']);
        mockTimer = jasmine.createSpyObj('Timer', ['start', 'restart']);

        harness = AngularUnitTestHelper.prepareModule('synchronizationPollingServiceModule')
            .mockConstant('OVERLAY_RERENDERED_EVENT', 'mockedOverlayRerenderedEvent')
            .mockConstant('EVENTS', {
                EXPERIENCE_UPDATE: 'EXPERIENCE_UPDATE'
            })
            .mock('gatewayProxy', 'initForService')
            .mock('timerService', 'createTimer').and.returnValue(mockTimer)
            .mock('catalogService', 'isContentCatalogVersionNonActive').and.returnResolvedPromise(false)
            .mock('catalogService', 'getContentCatalogActiveVersion').and.returnResolvedPromise('Online')
            .mock('crossFrameEventService', 'publish')
            .mock('crossFrameEventService', 'subscribe')
            .mock('componentHandlerService', 'getPageUUID')
            .mock('systemEventService', 'registerEventHandler')
            .mock('synchronizationResource', 'getPageSynchronizationGetRestService').and.returnValue(mockRest)
            .service('syncPollingService');

        $q = harness.injected.$q;

        syncPollingService = harness.service;
        systemEventServiceMock = harness.mocks.systemEventService;
        componentHandlerServiceMock = harness.mocks.componentHandlerService;
        catalogServiceMock = harness.mocks.catalogService;
    });

    it('getSyncStatus will reject, not proceed to rest call and leave the syncStatus unchanged', function() {

        //GIVEN
        syncPollingService.syncStatus = pageId2_SyncStatus;
        componentHandlerServiceMock.getPageUUID.and.returnValue('pageId1');
        mockRest.get.and.returnValue($q.when(pageId1_SyncStatus));
        //WHEN
        var promise = syncPollingService.getSyncStatus('pageId1');

        //THEN
        expect(promise).toBeRejected();
        expect(mockRest.get).not.toHaveBeenCalled();
        expect(syncPollingService.syncStatus).toBe(pageId2_SyncStatus);

    });


    it('fetchSyncStatus will reject, not proceed to rest call and leave the syncStatus unchanged', function() {

        //GIVEN
        syncPollingService.syncStatus = pageId2_SyncStatus;
        componentHandlerServiceMock.getPageUUID.and.returnValue('pageId1');
        mockRest.get.and.returnValue($q.when(pageId1_SyncStatus));

        //WHEN
        var promise = syncPollingService._fetchSyncStatus();

        //THEN
        expect(promise).toBeRejected();
        expect(mockRest.get).not.toHaveBeenCalled();
        expect(syncPollingService.syncStatus).toEqual(pageId2_SyncStatus);

    });


});
