/**
 * Created by bartosz on 22.09.15.
 *
 * PortalController class
 */
import SiteView from '../designer/SiteView';

import InteliUi from '../inteliUi/InteliUi';

import PageElement from '../designer/models/PageElement';
import PortalsContentManager from './PortalsContentManager';

import PortalDef from '../compositeComponentsDefinitions/PortalDef';
import PortalActionDef from '../compositeComponentsDefinitions/PortalActionDef';
import portalDefinitionRegistry from '../compositeComponentsDefinitions/PortalDefinitionRegistry';

import permissionRegistry from '../persmissions/PortalPermissionsRegistry';
import PermissionDefinition from '../persmissions/PermissionDefinition';

import bs from '../lib/rendering/BootstrapApi';

class PortalController {

    /**
     * Method to handle the cancel action
     *
     * @param options
     */
    portalEditorCancelAction(options) {
        var view = new SiteView();
        var contentManager = new PortalsContentManager();

        options.element.click(() => {
            var designerPage = new PageElement({
                id: 'designer-page',
                template: require('../designer/templates/designer_page.hbs'),
                panels: contentManager.addDesignerPageElements()
            });

            view.restoreDefaultSideBar();
            designerPage.buildSubPage();
        });
    }

    /**
     * Method to handle the save action
     *
     * @param options
     */
    portalEditorSaveAction(options) {
        var portalController = new PortalController();
        var page = options.page;

        options.element.click(() => {
            if (page.id === 'add-panel-page') {

                let portalDef = portalController.getDataFromPage(page);

                portalDefinitionRegistry.add(portalDef).then(response => {
                    var view = new SiteView();
                    var contentManager = new PortalsContentManager();

                    var designerPage = new PageElement({
                        id: 'designer-page',
                        template: require('../designer/templates/designer_page.hbs'),
                        panels: contentManager.addDesignerPageElements()
                    });

                    view.restoreDefaultSideBar();
                    designerPage.buildSubPage();
                });

            } else if (page.id === 'edit-panel-page') {

                let portalDef = portalController.getDataFromPage(page);

                portalDefinitionRegistry.update(portalDef).then(response => {
                    var view = new SiteView();
                    var contentManager = new PortalsContentManager();

                    var designerPage = new PageElement({
                        id: 'designer-page',
                        template: require('../designer/templates/designer_page.hbs'),
                        panels: contentManager.addDesignerPageElements()
                    });

                    view.restoreDefaultSideBar();
                    designerPage.buildSubPage();
                });

            }


        });
    }

    getDataFromPage(page) {
        var basicInfoContainer = $('#basic-info-container');
        var contentElementsContainer = $('#content-elements-container');

        var portalId = basicInfoContainer.find('.stats-title').attr('portalId');
        var portalName = basicInfoContainer.find('#new-portal-name').val();
        var portalStatus = basicInfoContainer.find('#new-portal-status').val();

        var panels = page.panels;

        if (!portalId) {
            portalId = portalName;
        }

        var portalDef = new PortalDef({
            id: portalId,
            name: portalName
        });

        panels.forEach(panel => {
            var tabs = panel.tabs;

            if (tabs) {
                tabs.forEach(tab => {
                    tab.dataModel.options.forEach(element => {
                        var optionActionDef = new PortalActionDef(element.name, element);

                        portalDef.addActionDef(optionActionDef);
                    });
                });
            }
        });

        return portalDef;
    }

    /**
     * Method to start the inteliUi modal
     */
    showInteliUi(context) {
        var inteliUi = new InteliUi();

        var options = {
            id: 'inteliUi',
            title: 'Edytor opcji',
            model: {
                id: 'inteliUi-modal',
                size: 'xl'
            },
            onshownCallback: inteliUi.showInteliUiInModal,
            inteliUi: inteliUi,
            callback: inteliUi.handleInteliUiMenu,
            closeByBackdrop: false,
            closeByKeyboard: false,
            closable: true,
            context: context,
            primaryButtonAction: function () {
            },
            buttons: [
                {label: 'Zapisz'}
            ],
            btnPrimaryColor: 'success'

        };

        bs.showModal(options);
    }

    addUserPermissions(args) {
        var permissionDef = new PermissionDefinition(args.userPermission);
        var portalId = args.userPermission.portalId;

        permissionRegistry.add(permissionDef).then(permissionId => {
            var loggedUser = window.user;

            loggedUser.addPermittedPortalId(args.userPermission.portalId);

            args.callback(args.container, permissionId, portalId);
        });
    }

    setType(elementModel) {
        if (elementModel) {
            var isOperator = elementModel.idPermissionType === 1;
            var isGroup = elementModel.idPermissionType === 2;

            if (isOperator) {
                elementModel.isOperator = true;

                return elementModel;
            } else if (isGroup) {
                elementModel.isGroup = true;

                return elementModel;
            }
        }
    }

    setOperatorName(elementModel) {
        if (elementModel) {
            if (elementModel.operator) {
                var operator = elementModel.operator;
                operator.name = operator.firstName + ' ' + operator.lastName;

                return elementModel;
            } else if (elementModel.isGroup) {
                return elementModel;
            }
        }
    }

}

export default PortalController;
