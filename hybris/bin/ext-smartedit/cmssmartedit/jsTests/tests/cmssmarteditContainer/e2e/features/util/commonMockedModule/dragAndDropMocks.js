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
angular.module('dragAndDropMocks', ['ngMockE2E', 'renderServiceModule', 'assetsServiceModule', 'editorModalServiceModule', 'componentHandlerServiceModule'])
    .run(function($httpBackend, $window, lodash, SMARTEDIT_IFRAME_ID) {

        var queueOperation = function(method, args) {
            if (document.getElementById(SMARTEDIT_IFRAME_ID)) {
                document.getElementById(SMARTEDIT_IFRAME_ID).contentWindow.postMessage({
                    eventId: 'storefrontMutation',
                    method: method,
                    arguments: args
                }, '*');
            } else {
                sfBuilder[method].apply(sfBuilder, args);
            }
        };


        this.idCounter = 10;
        this.slots = [{
            id: 'topHeaderSlot',
            components: ['component1', 'component2', 'component3']
        }, {
            id: 'otherSlot',
            components: []
        }, {
            id: 'bottomHeaderSlot',
            components: ['component4']
        }, {
            id: 'searchBoxSlot',
            components: ['component8']
        }, {
            id: 'footerSlot',
            components: ['component5']
        }, {
            id: 'staticDummySlot',
            components: ['staticDummyComponent']
        }];

        this.types = {
            'component1': 'componentType1',
            'component2': 'componentType2',
            'component3': 'componentType3',
            'component4': 'componentType4',
            'component5': 'componentType5',
            'staticDummyComponent': 'componentType1'
        };

        $httpBackend.whenPUT(/cmswebservices\/v1\/sites\/apparel-uk\/catalogs\/apparel-ukContentCatalog\/versions\/Staged\/pagescontentslotscomponents\/pages\/homepage\/contentslots\/.*/).respond(function(method, url, data, headers) {
            var parsedData = JSON.parse(data);
            this.moveComponentToSlot(parsedData.currentSlotId, parsedData.componentId, parsedData.slotId, parsedData.position);

            return [200, data];
        }.bind(this));

        //cmswebservices/v1/sites/apparel-uk/catalogs/apparel-ukContentCatalog/versions/Staged/pagescontentslotscomponents
        $httpBackend.whenPOST(/cmswebservices\/v1\/sites\/apparel-uk\/catalogs\/apparel-ukContentCatalog\/versions\/Staged\/pagescontentslotscomponents/).respond(function(method, url, data, headers) {
            var parsedData = JSON.parse(data);
            this.addComponentToSlot(parsedData.slotId, parsedData.componentId, parsedData.position);
            return [200, data];
        }.bind(this));

        //Delete component
        $httpBackend.whenDELETE(/cmswebservices\/v1\/sites\/.*\/catalogs\/.*\/versions\/.*\/pagescontentslotscomponents\/contentslots\/.*\/components/).respond(function(method, url, data, headers) {

            var slotId = /cmswebservices\/v1\/sites\/.*\/catalogs\/.*\/versions\/.*\/pagescontentslotscomponents\/contentslots\/(.*)/.exec(url)[1].split('/')[0];
            var componentId = /cmswebservices\/v1\/sites\/.*\/catalogs\/.*\/versions\/.*\/pagescontentslotscomponents\/contentslots\/.*\/components\/(.*)/.exec(url)[1];

            this.slots.forEach(function(slot) {
                if (slot.id === slotId) {
                    slot.components.splice(slot.components.indexOf(componentId), 1);
                }
            });
            return [200, {}];
        }.bind(this));

        $httpBackend.whenGET(/.*dummystorefront.*/).respond(function() {
            var slotsStr = '';
            lodash.each(this.slots, function(slot) {
                slotsStr += this._renderSlot(slot);
            }.bind(this));
            var document = '<!DOCTYPE html>' +
                '<html>' +
                '<head></head>' +
                '<body>' +
                slotsStr +
                '</body>' +
                '</html>';

            return [200, document];
        }.bind(this));

        var component1_data = {
            'creationtime': '2016-08-17T16:05:47+0000',
            'modifiedtime': '2016-08-17T16:05:47+0000',
            'name': 'Component 1',
            'pk': '1',
            'typeCode': 'CMSParagraphComponent',
            'uid': 'component1',
            'visible': true
        };

        $httpBackend.whenGET('/cmswebservices/v1/sites/apparel-uk/cmsitems/component1').respond(component1_data);

        $window.smartedit.reprocessPage = function() {};

        this._renderSlot = function(slot) {
            var components = '';
            lodash.each(slot.components, function(componentId) {
                var type = this.getComponentType(componentId);
                var component = '<div class="smartEditComponent" id="' + componentId + '" data-smartedit-component-type="' + type + '" data-smartedit-component-id="' + componentId + '">' +
                    '<div class="box">' +
                    '<p>' + componentId + '</p>' +
                    '</div>' +
                    '</div>';
                components += component;
            }.bind(this));

            var slotStr = '<div class="smartEditComponent" id="' + slot.id + '" data-smartedit-component-type="ContentSlot" data-smartedit-component-id="' + slot.id + '">' +
                components + '</div>';

            return slotStr;
        };

        this.getComponentType = function(componentId) {
            if (this.types[componentId]) {
                return this.types[componentId];
            } else {
                return 'componentType0';
            }
        };

        this.removeComponent = function(slotId, componentId) {
            var slot = this.getSlot(slotId);
            var componentIndex = slot.components.indexOf(componentId);
            if (componentIndex !== -1) {
                slot.components.splice(componentIndex, 1);
            }
            queueOperation("queueRemoveComponent", [componentId, slotId]);
        };

        this.addComponentToSlot = function(slotId, componentId, position) {
            var slot = this.getSlot(slotId);
            slot.components.splice(position, 0, componentId);
            queueOperation("queueAddComponent", [componentId, slotId]);
        };

        this.moveComponentToSlot = function(originalSlot, componentId, targetSlot, position) {
            this.removeComponent(originalSlot, componentId);
            this.addComponentToSlot(targetSlot, componentId, position);

        };

        this.getSlot = function(slotId) {
            var resultSlot = null;
            lodash.each(this.slots, function(slot) {
                if (slot.id === slotId) {
                    resultSlot = slot;
                    return false;
                }
            }.bind(this));

            return resultSlot;
        };
    });
try {
    angular.module('smarteditloader').requires.push('dragAndDropMocks');
} catch (e) {}
try {
    angular.module('smarteditcontainer').requires.push('dragAndDropMocks');
} catch (e) {}
