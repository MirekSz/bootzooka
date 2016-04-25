/**
 * Created by bstanislawski on 2015-10-28.
 */
import BasicMethodsSet from '../inteliUi/BasicMethodsSet';
import {eventBus, events} from '../lib/EventBus';
import alertifyApi from '../lib/AlertifyApi';
import Profiles from '../Profiles';

import SiteApp from './SiteApp';
import SiteController from './SiteController';
import SiteView from './SiteView';

import loginRegistry from './loginPage/LoginRegistry';

import compositionFactory from '../compositeComponents/CompositionFactory';

class SiteClass extends BasicMethodsSet {

    constructor() {
        super();

        this.activePortal = undefined;

        this.handleGlobalEvents();
    }

    startDeveloperMode() {
        this.view = new SiteView();
        this.app = new SiteApp();

        this.app.buildStartPage({}, true);
    }

    start() {
        this.view = new SiteView();
        //this.loginView = new LoginView();
        this.app = new SiteApp();

        var userSession = this.getUserSession();

        this.app.buildStartPage(this.checkUserIsLoggedIn(userSession));
    }

    /**
     * Show portal with given portalDef
     *
     * @param portalDef
     */
    showPortal(portalDef) {
        var portal = compositionFactory.createPortal(portalDef);

        if (this.activePortal) {
            this.disposePortal(this.activePortal);
        }

        this.setActivePortal(portal);

        this.view.renderPortal(portal);
    }

    /**
     * Dispose given portal
     *
     * @param portal
     */
    disposePortal(portal) {
        this.unsetActivePortal();

        this.view.disposePortal(portal);
    }

    /**
     * Universal method to add Panel to the dashboard
     *
     * @param panelModel
     */
    addPanel(panelModel) {
        this.view.renderPanel(panelModel, $(panelModel.targetContainer), panelModel.panelHandlers);
    }

    checkUserIsLoggedIn(userInfo) {
        return new Promise(resolve => {
            var userData = loginRegistry.getUserData(userInfo);

            userData.then(operatorDef => {
                if (operatorDef.idOperator) {
                    resolve(operatorDef);
                } else {
                    resolve(false);
                }
            });
        });
    }

    /**
     * @private
     */
    setActivePortal(portal) {
        this.activePortal = portal;
    }

    /**
     * @private
     */
    unsetActivePortal() {
        this.activePortal = undefined;
    }

    /**
     * @private
     *
     * @returns {{userName, password}|*}
     */
    getUserSession() {
        var userInfo;

        userInfo = {
            userName: sessionStorage.getItem('userName'),
            password: sessionStorage.getItem('password')
        };

        if (!userInfo.userName) {
            userInfo = {
                userName: localStorage.getItem('userName'),
                password: localStorage.getItem('password')
            };
        }

        return userInfo;
    }

    /**
     * @private
     */
    handleGlobalEvents() {
        //handle LOGOUT event
        eventBus.addListener(events.GLOBAL_EVENT.LOGOUT, () => {
            var controller = new SiteController();

            controller.logout();
        });

        //handle SHOW_ERROR event
        eventBus.addListener(events.GLOBAL_EVENT.SHOW_ERROR, (errorText) => {
            alertifyApi.showError(errorText);
        });

        eventBus.addListener(events.GLOBAL_EVENT.ASYNCH_START, (errorText) => {
//            BasicView.showIndicator();
            if (Profiles.TEST !== ENV) {
                NProgress.start();
            }
        });

        eventBus.addListener(events.GLOBAL_EVENT.ASYNCH_END, (errorText) => {
            if (Profiles.TEST !== ENV) {
                NProgress.done();
            }
//            BasicView.removeIndicator();
        });

    }

}

export default new SiteClass();
