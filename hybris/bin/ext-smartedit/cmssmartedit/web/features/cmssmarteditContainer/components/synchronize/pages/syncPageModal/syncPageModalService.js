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
 * @name syncPageModalServiceModule
 * @description
 * # The syncPageModalServiceModule
 *
 * The page synchronization modal service module provides a service that allows opening an synchronization modal for a given page. The synchronization modal contains a 
 * {@link synchronizationPanelModule.component:synchronizationPanel}.
 */
angular.module('syncPageModalServiceModule', ['modalServiceModule', 'pageSynchronizationPanelModule'])
    /**
     * @ngdoc service
     * @name syncPageModalServiceModule.service:syncPageModalService
     *
     * @description
     * Convenience service to open n synchronization modal window for a given page's data.
     *
     */
    .factory('syncPageModalService', function(modalService, MODAL_BUTTON_ACTIONS, MODAL_BUTTON_STYLES) {

        function SyncModalService() {}

        /**
         * @ngdoc method
         * @name pageEditorModalServiceModule.service:pageEditorModalService#open
         * @methodOf syncPageModalServiceModule.service:syncPageModalService
         *
         * @description
         * Uses the {@link modalService.open modalService} to open a modal.
         *
         * The editor modal is wired with a save and cancel button.
         *
         * The content of the synchronization modal is the {@link synchronizationPanelModule.component:synchronizationPanel}.
         *
         * @param {Object} page The data associated to a page as defined in the platform.
         * @param {Object} uriContext A {@link resourceLocationsModule.object:UriContext uriContext}
         *
         * @returns {Promise} A promise that resolves to the data returned by the modal when it is closed.
         */
        SyncModalService.prototype.open = function(page, uriContext) {

            return modalService.open({
                title: 'se.cms.synchronization.pagelist.modal.title.prefix',
                titleSuffix: 'se.cms.pageeditormodal.editpagetab.title',
                templateInline: '<page-synchronization-panel data-on-selected-items-update="modalController.onSelectedItemsUpdate" data-sync-items="modalController.sync" data-item-id="modalController.itemId" data-uri-context="modalController.uriContext"></page-synchronization-panel>',
                controller: ['syncPageModalService', 'modalManager', '$log',
                    function(syncPageModalService, modalManager, $log) {

                        this.showSyncButton = false;
                        this.modalManager = modalManager;
                        this.itemId = page.uuid;

                        this.onSelectedItemsUpdate = function(selectedItems) {
                            if (selectedItems.length === 0) {
                                modalManager.disableButton('sync');
                            } else {
                                modalManager.enableButton('sync');
                            }
                        };

                        this.uriContext = uriContext;
                        this.init = function() {
                            modalManager.setDismissCallback(this.onCancel);

                            modalManager.setButtonHandler(function(buttonId) {
                                if (buttonId !== 'close') {
                                    switch (buttonId) {
                                        case 'sync':
                                            return this.sync();
                                        default:
                                            $log.error('A button callback has not been registered for button with id', buttonId);
                                            break;
                                    }
                                }
                            }.bind(this));
                        };
                    }
                ],
                buttons: [{
                    id: 'close',
                    label: 'se.cms.component.confirmation.modal.close',
                    style: MODAL_BUTTON_STYLES.SECONDARY,
                    action: MODAL_BUTTON_ACTIONS.DISMISS
                }, {
                    id: 'sync',
                    label: 'se.cms.pagelist.dropdown.sync',
                    action: MODAL_BUTTON_ACTIONS.NONE,
                    disabled: true
                }]
            });
        };

        return new SyncModalService();
    });
