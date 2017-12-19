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
describe('editorModalService', function() {

    var editorModalService, mocks, $q, $rootScope;

    var mockEditComponentAttributes = {
        smarteditComponentId: "smarteditComponentId",
        smarteditComponentUuid: "smarteditComponentUuid",
        smarteditComponentType: "smarteditComponentType",
        catalogVersionUuid: "catalogVersionUuid"
    };
    var mockCreateComponentttributes = {
        smarteditComponentType: "smarteditComponentType",
        catalogVersionUuid: "catalogVersionUuid"
    };
    var mockGenericEditorEditComponentAttributes = {
        componentId: mockEditComponentAttributes.smarteditComponentId,
        componentUuid: mockEditComponentAttributes.smarteditComponentUuid,
        componentType: mockEditComponentAttributes.smarteditComponentType,
        title: 'type.' + mockEditComponentAttributes.smarteditComponentType.toLowerCase() + '.name',
        catalogVersionUuid: 'catalogVersionUuid',
        targetSlotId: undefined,
        position: undefined
    };

    beforeEach(function() {
        var harness = AngularUnitTestHelper.prepareModule('editorModalServiceModule')
            .mock('genericEditorModalService', 'open').and.returnResolvedPromise("somedata1")
            .mock('componentEditorService', 'init')
            .mock('cmsitemsRestService', '_getByUIdAndType')
            .mock('gatewayProxy', 'initForService')
            .mock('slotVisibilityService', 'getSlotsForComponent')
            .mock('renderService', 'renderSlots').and.returnResolvedPromise("somedata2")
            .service('editorModalService');
        editorModalService = harness.service;
        mocks = harness.mocks;
        $q = harness.injected.$q;
        $rootScope = harness.injected.$rootScope;

        mocks.slotVisibilityService.getSlotsForComponent.and.returnValue($q.when(['slot1']));
    });


    it('GIVEN backend returns a non empty typeStructure THEN open will delegate to genericEditorModalService.open (and display a genericTab) and invoke a rerendering upon closing', function() {

        expect(editorModalService.open(mockEditComponentAttributes)).toBeResolvedWithData('somedata1');
        expect(mocks.genericEditorModalService.open.calls.count()).toBe(1);
        expect(mocks.genericEditorModalService.open.calls.argsFor(0).length).toBe(3);
        expect(mocks.genericEditorModalService.open.calls.argsFor(0)[0]).toEqual(mockGenericEditorEditComponentAttributes);
        // should contain all tabs
        expect(mocks.genericEditorModalService.open.calls.argsFor(0)[1].length).toEqual(3); // all 4 tabs included

        expect(mocks.renderService.renderSlots).not.toHaveBeenCalled();
        var callback = mocks.genericEditorModalService.open.calls.argsFor(0)[2];
        callback();
        $rootScope.$digest();
        expect(mocks.renderService.renderSlots).toHaveBeenCalledWith(['slot1']);
    });

    it('GIVEN backend returns an empty typeStructure THEN open will delegate to genericEditorModalService.open (with no genericTab) and invoke a rerendering upon closing', function() {

        expect(editorModalService.open(mockEditComponentAttributes)).toBeResolvedWithData('somedata1');
        expect(mocks.genericEditorModalService.open.calls.count()).toBe(1);
        expect(mocks.genericEditorModalService.open.calls.argsFor(0).length).toBe(3);
        expect(mocks.genericEditorModalService.open.calls.argsFor(0)[0]).toEqual(mockGenericEditorEditComponentAttributes);
        expect(mocks.genericEditorModalService.open.calls.argsFor(0)[1].length).toEqual(3); // all 3 tabs included

        expect(mocks.renderService.renderSlots).not.toHaveBeenCalled();
        var callback = mocks.genericEditorModalService.open.calls.argsFor(0)[2];
        callback();
        $rootScope.$digest();
        expect(mocks.renderService.renderSlots).toHaveBeenCalledWith(['slot1']);
    });

    it('GIVEN creating a new component THEN renderService.renderComponent is not called', function() {
        expect(editorModalService.open(mockCreateComponentttributes)).toBeResolvedWithData('somedata1');
        expect(mocks.renderService.renderSlots).not.toHaveBeenCalled();
        var callback = mocks.genericEditorModalService.open.calls.argsFor(0)[2];
        callback();
        expect(mocks.renderService.renderSlots).not.toHaveBeenCalled();
    });
});
