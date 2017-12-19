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
(function() {
    angular.module('basicTabModule', ['genericEditorModule', 'resourceLocationsModule', 'componentEditorModule'])
        .controller('basicTabCtrl', function() {

            this.$onInit = function() {

                this.tabStructure = [{
                    cmsStructureType: "ShortString",
                    qualifier: "uid",
                    i18nKey: 'type.cmsitem.uid.name',
                    editable: false
                }, {
                    cmsStructureType: "DateTime",
                    qualifier: "creationtime",
                    i18nKey: 'type.item.creationtime.name',
                    editable: false
                }, {
                    cmsStructureType: "DateTime",
                    qualifier: "modifiedtime",
                    i18nKey: 'type.item.modifiedtime.name',
                    editable: false
                }];


            };

        })
        .component('basicTab', {
            transclude: false,
            templateUrl: 'componentEditorWrapperTemplate.html',
            controller: 'basicTabCtrl',
            bindings: {
                saveTab: '=',
                resetTab: '=',
                cancelTab: '=',
                isDirtyTab: '=',
                componentId: '<',
                componentType: '<',
                tabId: '<',
                componentInfo: '<'
            }
        });
})();
