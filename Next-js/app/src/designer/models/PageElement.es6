/**
 * Created by bartosz on 23.09.15.
 *
 * PageElement class
 */
import site from '../Site';
import View from '../SiteView';

import PortalDef from '../../compositeComponentsDefinitions/PortalDef';

class PageElement {

    constructor(args) {
        this.id = args.id;
        this.container = args.container;
        this.template = args.template;
        this.model = args.model || {};

        this.view = new View();

        this.handler = args.handler;

        this.panels = args.panels || [];
        this.sideBarButtons = args.sideBarButtons;

        this.portalDef = this.setNewPortal();
        this.sideBar = args.sideBar;
    }

    addPanel(panel) {
        panel.parentPage = this;

        this.panels.push(panel);
    }

    buildSubPage(hidePanels) {
        if (this.container) {
            this.destinationNode = $(this.container);
        } else {
            this.destinationNode = $('#page-content-wrapper').find('.container-fluid');
        }

        if (hidePanels) {
            this.view.hidePanelsAndBuildPage(this);
        } else {
            this.view.removePanelsAndBuildPage(this);
        }
    }

    render() {
        var self = this;
        var template = this.template;

        this.model.panels = this.panels;

        var htmlTemplate = template(this.model);

        this.destinationNode.html(htmlTemplate).promise().done(() => {

            self.panels.forEach(panelModel => {
                panelModel.parentPage = self;

                site.addPanel(panelModel);
            });
        });
    }

    updatePanel(panel) {
        this.removeFromArray(this.panels, panel);
        this.addPanel(panel);

        this.refreshSideBar();
    }

    /**
     * Set new TestPortal(portal) object
     */
    setNewPortal() {
        this.portalDef = new PortalDef({
            id: ''
        });
    }

    refreshSideBar() {
        if (this.sideBar) {
            this.sideBar(this);
        }
    }

    /**
     * @private
     *
     * @param array
     * @param element
     */
    removeFromArray(array, element) {
        var index = array.indexOf(element);

        if (index > -1) {
            array.splice(index, 1);
        }
    }

}

export default PageElement;
