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
angular.module("entryDropdownMatcherModule", [])
    .directive('entryDropdownMatcher', function() {
        return {
            restrict: 'E',
            transclude: false,
            replace: false,
            template: '<div class="ySEEntryDropdownMatcher" ng-include="getTemplateUrl()"></div>',
            scope: {
                templateUrl: "<",
                templateData: "<"
            },
            link: function(scope) {

                scope.$watch(function() {
                    return scope.templateData;
                }, function() {
                    scope.option = scope.templateData;
                });
                scope.getTemplateUrl = function() {
                    return scope.templateUrl;
                };
            }
        };
    });
