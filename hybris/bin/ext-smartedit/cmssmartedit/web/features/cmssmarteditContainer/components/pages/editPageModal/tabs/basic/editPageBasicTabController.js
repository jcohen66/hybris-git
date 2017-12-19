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
angular.module('editPageBasicTabControllerModule', ['pageServiceModule', 'genericEditorModule',
        'contextAwarePageStructureServiceModule', 'cmsitemsRestServiceModule', 'eventServiceModule'
    ])
    .controller('editPageBasicTabController', function($q, GENERIC_EDITOR_UNRELATED_VALIDATION_MESSAGES_EVENT,
        pageService, contextAwarePageStructureService, cmsitemsRestService, systemEventService) {

        this._updateRestrictions = function(eventId, restrictionsObj) {
            this.onlyOneRestrictionMustApply = restrictionsObj.onlyOneRestrictionMustApply;
            this.restrictions = restrictionsObj.restrictions;
        };

        this._updateAssociatedPrimary = function(eventId, associatedPrimaryPage) {
            this.content.label = associatedPrimaryPage.label;
            this.genericEditorApi.updateContent(this.content);
        };

        this.$onInit = function() {

            var pagePromise = cmsitemsRestService.getById(this.model.uuid);
            var isPagePrimaryPromise = pageService.isPagePrimary(this.model.uid);

            $q.all([pagePromise, isPagePrimaryPromise]).then(function(values) {
                this.content = values[0];

                cmsitemsRestService.getById(values[0].masterTemplate).then(function(templateInfo) {
                    this.content.template = templateInfo.uid;

                    contextAwarePageStructureService.getPageStructureForPageEditing(this.content.typeCode, this.content.uid).then(function(fields) {
                        this.structure = fields;
                    }.bind(this));
                }.bind(this));

            }.bind(this));

            this.saveTab = function() {
                if (this.submitCallback) {
                    return this.submitCallback().then(function(result) {
                        result.onlyOneRestrictionMustApply = this.onlyOneRestrictionMustApply;
                        result.restrictions = this.restrictions;
                        result.identifier = result.uuid;
                        return cmsitemsRestService.update(result).then(function(result) {
                            return result;
                        }, function(failure) {
                            systemEventService.sendAsynchEvent(GENERIC_EDITOR_UNRELATED_VALIDATION_MESSAGES_EVENT, {
                                messages: failure.data.errors
                            });

                            //Handle all restriction errors
                            var restrictionErrors = [];
                            if (failure.data && failure.data.errors) {
                                failure.data.errors.forEach(function(error) {
                                    //If the error subject is restrictions, highlight the restrictions tab
                                    if (error.subject.indexOf('restrictions') === 0) {
                                        error.tabId = 'editPageVisibilityTab';
                                    }
                                    if (error.subject === 'restrictions') {
                                        restrictionErrors.push(error);
                                    }
                                });
                            }

                            //Fire an event so the restrictions tab can process and display the errors accordingly
                            if (restrictionErrors.length !== 0) {
                                systemEventService.sendAsynchEvent("EDIT_PAGE_RESTRICTIONS_ERRORS_EVENT", restrictionErrors);
                            }

                            return $q.reject(failure);
                        });
                    }.bind(this));
                } else {
                    var errorMsg = 'saveTab: Save callback not defined';
                    return $q.reject(errorMsg);
                }
            }.bind(this);

            this.setGenericEditorApi = function(api) {
                this.genericEditorApi = api;
            }.bind(this);

            this.unregFn = systemEventService.registerEventHandler("EDIT_PAGE_RESTRICTIONS_UPDATED_EVENT", this._updateRestrictions.bind(this));
            this.associatePrimaryunregFn = systemEventService.registerEventHandler("EDIT_PAGE_ASSOCIATED_PRIMARY_UPDATED_EVENT", this._updateAssociatedPrimary.bind(this));

        };

        this.$onDestroy = function() {
            this.unregFn();
            this.associatePrimaryunregFn();
        };

    });
