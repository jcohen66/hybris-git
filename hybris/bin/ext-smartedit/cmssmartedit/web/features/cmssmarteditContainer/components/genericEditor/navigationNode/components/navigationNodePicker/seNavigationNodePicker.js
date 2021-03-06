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
angular.module('seNavigationNodePickerModule', ['functionsModule', 'resourceLocationsModule', 'cmsitemsRestServiceModule', 'eventServiceModule'])
    .constant('SELECTED_NODE', 'selected_node')
    .controller('NavigationNodePickerController', function(URIBuilder, NAVIGATION_MANAGEMENT_RESOURCE_URI, NAVIGATION_NODE_ROOT_NODE_UID, SELECTED_NODE, cmsitemsRestService, systemEventService) {

        this.$onInit = function() {
            this.nodeURI = new URIBuilder(NAVIGATION_MANAGEMENT_RESOURCE_URI).replaceParams(this.uriContext).build();
        };

        this.nodeTemplateUrl = 'navigationNodePickerRenderTemplate.html';
        this.rootNodeUid = NAVIGATION_NODE_ROOT_NODE_UID;

        this.actions = {
            pick: function(treeService, handle) {
                var requestParams = {
                    pageSize: 10,
                    currentPage: 0,
                    mask: handle.$modelValue.uid,
                };

                cmsitemsRestService.get(requestParams).then(function(response) {

                    var idObj = {
                        nodeUuid: response.response.find(function(element) {
                            return element.uid === handle.$modelValue.uid;
                        }).uuid,
                        nodeUid: handle.$modelValue.uid
                    };
                    systemEventService.sendAsynchEvent(SELECTED_NODE, idObj);
                }.bind(this));

            }.bind(this)
        };

    })
    /**
     * @ngdoc directive
     * @name seNavigationNodePickerModule.directive:seNavigationPicker
     * @scope
     * @restrict E
     * @element ANY
     *
     * @description
     * Directive that will build a navigation node picker and assign the uid of the selected node to model[qualifier].
     * @param {Object} uriContext the {@link resourceLocationsModule.object:UriContext UriContext} necessary to perform operations.
     * @param {Object} model the model a property a property of which will be set to the selected node uid.
     * @param {String} qualifier the name of the model property that will be set to the selected node uid.
     */
    .component('seNavigationPicker', {
        templateUrl: 'seNavigationNodePickerTemplate.html',
        bindings: {
            uriContext: '<',
            model: '=',
            qualifier: '=',
        },
        controller: 'NavigationNodePickerController',
        controllerAs: 'ctrl',
    });
