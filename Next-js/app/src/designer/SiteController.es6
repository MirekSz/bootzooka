/**
 * Created by bartosz on 18.09.15.
 *
 * SiteController class
 */
import View from './SiteView';
import PortalView from '../portals/PortalView';

import portalDefinitionRegistry from '../compositeComponentsDefinitions/PortalDefinitionRegistry';
import portalPermissionsRegister from '../persmissions/PortalPermissionsRegistry';
import operatorRegistry from '../operator/OperatorRegistry';

import LoginController from './loginPage/LoginController';
import enums from '../enums/GlobalEnums';

class SiteController {

    showQuestion($panelContainer, questionModel, type) {
        var view = new View();
        var positiveFlow;

        if (type === enums.QUESTIONS.PORTAL) {
            positiveFlow = this.deletePortalPanel;
        } else if (type === enums.QUESTIONS.OPTION) {
            positiveFlow = this.deleteOption;
        } else if (type === enums.QUESTIONS.PERMISSION) {
            positiveFlow = this.deletePermission;
        }

        view.showQuestion({
            container: $panelContainer,
            model: questionModel,
            positiveFlow: positiveFlow
        });
    }

    showSetNewOptionNamePanel($panelContainer, questionModel) {
        var view = new PortalView();

        view.showSetNewOptionNamePanel({
            container: $panelContainer,
            model: questionModel,
            positiveFlow: view.addEmptyOption
        });
    }

    deletePortalPanel($panelContainer) {
        var view = new View();
        var $panel = $panelContainer.find('.panel-default');
        var id = view.getPortalId($panel);

        portalDefinitionRegistry.remove(id).then(() => {
            view.disposePanel($panel);
        });
    }

    deleteOption($panelContainer, context) {
        var view = new View();
        var $panel = $panelContainer.find('.panel-default');
        var id = $panel.parent().attr('optionId').trim();
        var portalId = $('#basic-info-container').find('.panel-content-header').find('.stats-title').attr('portalId');

        portalDefinitionRegistry.getPortalById(portalId).then(portal => {
            portal.actions.forEach((action, index) => {
                if (action.optionId === id) {
                    portal.actions.splice(index, 1);
                }
            });

            portalDefinitionRegistry.updatePortal(portal).then(() => {
                context.RemoveFromModel(id);

                view.disposePanel($panel);
            });
        });
    }

    deletePermission($panelContainer, permissionId, portalId) {
        var view = new View();
        var $panel = $panelContainer.find('.panel-default');

        portalPermissionsRegister.remove(permissionId).then(res => {
            var loggedUser = window.user;

            loggedUser.removePermittedPortalId(portalId);

            view.disposePanel($panel);
        });
    }

    isPortalAllowedForUser(id) {
        var user = window.user;

        if (user.isAdmin) {
            return true;
        } else {
            let permittedPortals = user.getPermittedPortalIds();
            let allowed = false;

            permittedPortals.forEach(portal => {
                if (id === portal) {
                    allowed = true;
                }
            });

            return allowed;
        }
    }

    getAvailableOperators(query) {
        return new Promise(resolve => {
            operatorRegistry.getOperators(query).then(operators => {
                resolve(operators);
            });
        });
    }

    getAvailableGroups(query) {
        return new Promise(resolve => {
            operatorRegistry.getGroups(query).then(groups => {
                resolve(groups);
            });
        });
    }

    logout() {
        var loginController = new LoginController();
        var view = new View();

        loginController.logoutUser();

        view.redirectToLoginPage();
    }
}

export default SiteController;
