/**
 * Created by bartosz on 22.09.15.
 *
 * PortalApp class
 */
import PageElement from '../designer/models/PageElement';
import PortalContentManager from './PortalsContentManager';
import PortalView from './PortalView';

var contentManager = new PortalContentManager();

class PortalDesignerView {

    handleAddPanel() {
        var panels = contentManager.addAddPortalElements();
        var portalView = new PortalView();
        var sideBar = portalView.setPortalEditorSideBar;

        var addPanelPage = new PageElement({
            id: 'add-panel-page',
            template: require('../designer/templates/addPortal/add_panel_page.hbs'),
            sideBar: sideBar
        });

        panels.forEach(panel => {
            addPanelPage.addPanel(panel);
        });

        addPanelPage.buildSubPage();
    }

    handleImportPanel() {

    }

    handleEditPanel(args) {
        var panels = contentManager.addEditPortalElements(args);
        var portalView = new PortalView();
        var sideBar = portalView.setPortalEditorSideBar;

        var editPanelPage = new PageElement({
            id: 'edit-panel-page',
            template: require('../designer/templates/addPortal/add_panel_page.hbs'),
            sideBar: sideBar
        });

        panels.forEach(panel => {
            editPanelPage.addPanel(panel);
        });

        editPanelPage.buildSubPage();
    }
}

export default PortalDesignerView;
