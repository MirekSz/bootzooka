/**
 * Created by bartosz on 28.09.15.
 *
 * ContentManager class
 */
import site from './Site';
import PanelElement from './models/PanelElement';
import FormPanel from './models/FormPanel';
import LoginView from './loginPage/LoginView';


class ContentManager {

    addDashboardPageElements() {
        var elements = [];

        var activityPanel = new PanelElement({
            panelBodyTemplate: require('./templates/panels/activity_panel.hbs'),
            panelTitle: 'Activity Panel',
            targetContainer: '#activity-container',
            panelHandlers: site.view.setActivityPanelHandlers
        });

        elements.push(activityPanel);

        var userActivityPanel = new PanelElement({
            panelBodyTemplate: require('./templates/panels/user_activity_panel.hbs'),
            panelTitle: 'User Activity Panel',
            targetContainer: '#user-activity-container',
            panelHandlers: site.view.setUserActivityPanelHandlers
        });

        elements.push(userActivityPanel);

        var exampleTablePanel = new PanelElement({
            panelBodyTemplate: require('./templates/panels/table_panel.hbs'),
            panelTitle: 'Example Table component',
            targetContainer: '#example-table-container',
            panelHandlers: site.view.setExampleTablePanelHandlers
        });

        elements.push(exampleTablePanel);

        var wizardPanel = new PanelElement({
            panelBodyTemplate: require('./templates/panels/wizard_panel.hbs'),
            panelTitle: 'Wizard component',
            targetContainer: '#wizard-container',
            panelHandlers: site.view.setWizardPanelHandlers
        });

        elements.push(wizardPanel);

        return elements;
    }

    addTablePageElements() {
        var elements = [];

        var tablePanel = new PanelElement({
            panelBodyTemplate: require('./templates/panels/data_table_panel.hbs'),
            targetContainer: '#table-container',
            panelHandlers: site.view.setDataTablePanelHandlers
        });

        elements.push(tablePanel);

        return elements;
    }

    addFormPageElements() {
        var elements = [];

        var formPanel = new FormPanel({
            panelBodyTemplate: require('./templates/panels/form_panel.hbs'),
            targetContainer: '#form-container',
            panelHandlers: site.view.setFormPanelHandlers
        });

        elements.push(formPanel);

        var checkBoxesPanel = new FormPanel({
            panelBodyTemplate: require('./templates/panels/checkboxes_panel.hbs'),
            targetContainer: '#checkboxes-container',
            panelHandlers: site.view.setCheckboxesPanelHandlers
        });

        elements.push(checkBoxesPanel);

        return elements;
    }

    optionActionPageElements(callbackCancel) {
        var elements = [];

        var formPanel = new FormPanel({
            panelBodyTemplate: require('./templates/panels/form_panel.hbs'),
            targetContainer: '#form-container',
            panelHandlers: site.view.setOptionActionHandlers,
            callbackCancel: callbackCancel
        });

        elements.push(formPanel);

        return elements;
    }

    loginPageElements() {
        var loginView = new LoginView();
        var elements = [];

        var loginPanel = new FormPanel({
            panelBodyTemplate: require('./templates/panels/login_panel.hbs'),
            targetContainer: '#login-container',
            panelHandlers: loginView.setLoginPanelsHandlers
        });

        elements.push(loginPanel);

        return elements;
    }

}

export default ContentManager;
