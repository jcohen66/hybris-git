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
/**
 * @ngdoc overview
 * @name pageInfoContainerModule
 * @description
 * This module contains pageInfoContainer component.
 */
angular.module('pageInfoContainerModule', ['catalogServiceModule', 'pageInfoDetailsModule', 'pageInfoHeaderModule', 'componentHandlerServiceModule', 'pageListServiceModule', 'contextAwarePageStructureServiceModule', 'pageEditorModalServiceModule', 'cmsitemsRestServiceModule', 'pageServiceModule'])

.controller('pageInfoContainerController', function(catalogService, componentHandlerService, pageListService, contextAwarePageStructureService, pageEditorModalService, cmsitemsRestService, pageService) {
    this.$onInit = function() {
        pageService.getCurrentPageInfo().then(function(pageInfo) {
            this.pageUid = pageInfo.uid;
            this.pageUuid = pageInfo.uuid;
            this.pageTemplateUuid = pageInfo.masterTemplate;
            this.pageTypeCode = pageInfo.typeCode;
            this.pageContent = pageInfo;
            catalogService.retrieveUriContext().then(function(uriContext) {
                this.pageContent = pageInfo;
                this.pageContent.uriContext = uriContext;
            }.bind(this));
        }.bind(this)).then(function() {
            cmsitemsRestService.getById(this.pageTemplateUuid).then(function(templateInfo) {
                this.pageTemplate = templateInfo.uid;
            }.bind(this));
        }.bind(this)).then(function() {
            contextAwarePageStructureService.getPageStructureForViewing(this.pageTypeCode).then(function(pageStructure) {
                this.pageStructure = pageStructure;
            }.bind(this));
        }.bind(this));
    }.bind(this);

    this.onEditClick = function() {
        pageEditorModalService.open(this.pageContent);
    };
})


/**
 * @ngdoc directive
 * @name pageInfoContainerModule.pageInfoContainer
 * @description
 * Directive that can render current storefront page's information and provides a callback function triggered on opening the editor.
 */
.component('pageInfoContainer', {
    templateUrl: 'pageInfoContainerTemplate.html',
    controller: 'pageInfoContainerController'
});
