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
describe('slotVisibilityService', function() {


    // Service under test
    var slotVisibilityService;


    // Mock dependencies
    var cmsitemsRestService;
    var pagesContentSlotsComponentsResource;
    var componentHandlerService;
    var renderService;
    var crossFrameEventService;
    var pageChangeListener;

    // Util
    var $q, $rootScope;

    beforeEach(customMatchers);


    beforeEach(function() {

        angular.module('cmsitemsRestServiceModule', []);
        angular.module('resourceModule', []);
        angular.module('componentHandlerServiceModule', []);
        angular.module('renderServiceModule', []);

        module(function($provide) {

            var EVENTS = {
                PAGE_CHANGE: 'PAGE_CHANGE'
            };

            $provide.value('EVENTS', EVENTS);

            crossFrameEventService = jasmine.createSpyObj('crossFrameEventService', ['subscribe']);
            $provide.value('crossFrameEventService', crossFrameEventService);


            cmsitemsRestService = jasmine.createSpyObj('cmsitemsRestService', ['get']);
            $provide.value('cmsitemsRestService', cmsitemsRestService);

            pagesContentSlotsComponentsResource = jasmine.createSpyObj('pagesContentSlotsComponentsResource', ['get']);
            pagesContentSlotsComponentsResource.get.and.callFake(function(arg) {
                return $q.when({});
            });
            $provide.value('pagesContentSlotsComponentsResource', pagesContentSlotsComponentsResource);

            componentHandlerService = jasmine.createSpyObj('componentHandlerService', ['getId', 'getPageUID', 'getOriginalComponentsWithinSlot']);
            componentHandlerService.getPageUID.and.returnValue('homepage');

            $provide.value('componentHandlerService', componentHandlerService);

            renderService = jasmine.createSpyObj('renderService', ["renderSlots"]);
            renderService.renderSlots.and.returnValue();
            $provide.value("renderService", renderService);

        });
    });

    beforeEach(module('slotVisibilityServiceModule'));

    beforeEach(inject(function(_$q_, _$rootScope_, _slotVisibilityService_) {
        $rootScope = _$rootScope_;
        $q = _$q_;
        slotVisibilityService = _slotVisibilityService_;

        spyOn(slotVisibilityService, '_getSlotToComponentsMap').and.callThrough();

        expect(crossFrameEventService.subscribe).toHaveBeenCalledWith("PAGE_CHANGE", jasmine.any(Function));
        pageChangeListener = crossFrameEventService.subscribe.calls.argsFor(0)[1];

    }));

    afterEach(function() {
        expect(pagesContentSlotsComponentsResource.get).toHaveBeenCalledWith({
            pageId: 'homepage'
        });
    });

    describe('_getSlotToComponentsMap', function() {

        it('WHEN page changes, _getSlotToComponentsMap is called', function() {
            expect(slotVisibilityService._getSlotToComponentsMap).not.toHaveBeenCalled();
            pageChangeListener();
            expect(slotVisibilityService._getSlotToComponentsMap).toHaveBeenCalled();
        });
    });

    describe('content slots per page is empty', function() {
        var SLOT = 'some-slot-id';
        beforeEach(function() {
            // itemsResource.get.and.returnValue($q.when([]));
            pagesContentSlotsComponentsResource.get.and.returnValue($q.when([]));
        });

        it('should have an empty hidden component list.', function() {
            expect(slotVisibilityService.getHiddenComponents(SLOT)).toBeResolvedWithData([]);
        });
    });

    describe('content slots per page is not empty', function() {
        var SLOT1 = 'some-slot-id-1';
        var SLOT2 = 'some-slot-id-2';

        beforeEach(function() {
            cmsitemsRestService.get.and.returnValue($q.when({
                response: [{
                    visible: false,
                    uuid: 10
                }, {
                    visible: true,
                    uuid: 20
                }, {
                    visible: true,
                    uuid: 30
                }]
            }));
            pagesContentSlotsComponentsResource.get.and.returnValue($q.when({
                pageContentSlotComponentList: [{
                    slotId: SLOT1,
                    componentUuid: 10
                }, {
                    slotId: SLOT1,
                    componentUuid: 20
                }, {
                    slotId: SLOT2,
                    componentUuid: 30
                }]
            }));

            var yjQueryObject = {
                get: function() {
                    return [{
                        visible: true,
                        uuid: 30
                    }];
                }
            };

            componentHandlerService.getOriginalComponentsWithinSlot.and.returnValue(yjQueryObject);
            componentHandlerService.getId.and.returnValue(30);
        });

        it('should return a non-empty the hidden component list', function() {
            expect(slotVisibilityService.getHiddenComponents(SLOT1)).toBeResolvedWithData(
                [{
                    visible: false,
                    uuid: 10
                }, {
                    visible: true,
                    uuid: 20
                }]);
        });

    });
});
