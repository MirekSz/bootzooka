/**
 * Created by bartosz on 28.09.15.
 *
 * PortalsContentManager class
 */
import PortalView from './PortalView';
import SiteView from '../designer/SiteView';

import FormPanel from '../designer/models/FormPanel';
import PortalPanel from './models/PortalPanel';
import PortalDefinitionRegistry from '../compositeComponentsDefinitions/PortalDefinitionRegistry';

class PortalsContentManager {

    constructor() {
    }

    addAddPortalElements() {
        var view = new PortalView();
        var elements = [];

        var basicInfoPanel = new FormPanel({
            panelBodyTemplate: require('../designer/templates/addPortal/panels/basic_info.hbs'),
            targetContainer: '#basic-info-container',
            panelBodyModel: {
                title: 'Nowy Portal'
            },
            panelHandlers: view.setAddPanelBasicInfoHandler
        });

        elements.push(basicInfoPanel);

        let contentElementsPanel = new FormPanel({
            panelBodyTemplate: require('../designer/templates/addPortal/panels/content_element.hbs'),
            targetContainer: '#content-elements-container',
            panelHandlers: view.setAddPanelContentElementsHandler
        });

        elements.push(contentElementsPanel);

        return elements;
    }

    addEditPortalElements(args) {
        var view = new PortalView();
        var elements = [];

        var basicInfoPanel = new FormPanel({
            panelBodyTemplate: require('../designer/templates/addPortal/panels/basic_info.hbs'),
            panelBodyModel: {
                title: args.title,
                name: args.title,
                id: args.id
            },
            targetContainer: '#basic-info-container',
            panelHandlers: view.setEditPanelBasicInfoHandler
        });

        elements.push(basicInfoPanel);

        var contentElementsPanel = new FormPanel({
            panelBodyTemplate: require('../designer/templates/addPortal/panels/content_element.hbs'),
            targetContainer: '#content-elements-container',
            portalId: args.id,
            panelHandlers: view.setEditPanelContentElementsHandler
        });

        elements.push(contentElementsPanel);

        return elements;
    }

    addDesignerPageElements() {
        var self = this;
        var view = new PortalView();
        var elements = [];

        var addPanelModel = new PortalPanel({
            panelBodyTemplate: require('../designer/templates/panels/designer/add_designer_panel.hbs'),
            targetContainer: '#grid-active-container',
            panelHandlers: view.setAddNewPanelHandlers,
            dontShowTools: true
        });

        PortalDefinitionRegistry.getPortal('').then(portalDefList => {
            portalDefList.forEach((portalDef, index) => {
                //if (site.controller.isPortalAllowedForUser(portalDef.id)) {
                var portalPanelModel = {
                    id: portalDef.id,
                    title: portalDef.name || portalDef.id,
                    icon: 'users',
                    created: '2011-02-09 12:41',
                    modified: '2011-11-12 11:22',
                    operator: 'Marian kierownik sprzedaży',
                    active: 'aktywny'
                };

                var panel = self.buildPortalPanel(portalPanelModel, index);

                elements.push(panel);
                //}
            });
            elements.push(addPanelModel);
        });

        return elements;
    }

    /**
     * Universal method to build a portal panel
     *
     * @param portalModel
     * @param position
     */
    buildPortalPanel(portalModel, position) {
        var view = new SiteView();
        var gridPosition = position;

        return new PortalPanel({
            panelBodyTemplate: require('../designer/templates/panels/designer/designer_panel.hbs'),
            targetContainer: `#grid${gridPosition}-container`,
            panelBodyModel: portalModel,
            panelHandlers: view.setDesignerPortalPanelsHandlers
        });
    }

}

export default PortalsContentManager;
