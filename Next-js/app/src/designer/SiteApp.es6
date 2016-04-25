/**
 * Created by bartosz on 17.09.15.
 *
 * Site Scaffolding class
 */
import SiteView from './SiteView';

import PageElement from './models/PageElement';
import ContentManager from './ContentManager';

class SiteApp {

    /**
     * Build the start page
     */
    buildStartPage(userCheck, isDevMode) {
        var self = this;
        var destinationNode = $('#main-page-container');
        var template = require('./templates/site_scaffolding.hbs');
        var model = {};

        //clear the container
        destinationNode.html('');

        if (!isDevMode) {
            userCheck.then(operatorDef => {
                var htmlTemplate = template(model);

                destinationNode.html(htmlTemplate).promise().done(() => {

                    if (operatorDef) {
                        self.showDashboard(operatorDef);
                    } else {
                        $('#main-page-container').find('#wrapper').addClass('hidden');
                        $('#login-page-wrapper').removeClass('hidden');

                        self.showLoginPage();
                    }
                });
            });
        } else {
            let htmlTemplate = template(model);
            destinationNode.html(htmlTemplate).promise().done(() => {
                self.showSandBox();
            });
        }
    }

    showSandBox() {
        let view = new SiteView();
        view.handleAfterRender();

        let sandBoxPage = new PageElement({
            id: 'sandBox-page',
            template: require('./templates/sandbox.hbs')
        });

        sandBoxPage.buildSubPage();
        view.setSandboxSideBar();
    }

    showDashboard(user) {
        this.setUserData(user);

        let view = new SiteView();
        let contentManager = new ContentManager();

        view.handleAfterRender();

        let dashboardPage = new PageElement({
            id: 'dashboard-page',
            template: require('./templates/dashboard.hbs'),
            panels: contentManager.addDashboardPageElements()
        });

        dashboardPage.buildSubPage();
        view.setPortalDefaultSideBar();
    }

    showLoginPage() {
        let contentManager = new ContentManager();

        //build the login page
        let loginPage = new PageElement({
            template: require('./templates/login_page.hbs'),
            id: 'login-page',
            container: '#login-page-wrapper',
            panels: contentManager.loginPageElements()
        });

        loginPage.buildSubPage();
    }

    /**
     * @private
     *
     * Set the user data on the navigation bar
     */
    setUserData(user) {
        var $userSection = $(document).find('.user-section');

        var $userField = $userSection.find('.user');
        var $companyField = $userSection.find('.company');

        $userField.text(user.nameToShow);
        $companyField.text(user.company);

        window.user = user;
    }
}

export default SiteApp;
