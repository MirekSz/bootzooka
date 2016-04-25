/**
 * Created by bartosz on 23.09.15.
 *
 * PanelElement class
 */
import BasicMethodsSet from '../../inteliUi/BasicMethodsSet';

class PanelElement extends BasicMethodsSet {

    constructor(args) {
        super();

        this.panelBodyTemplate = args.panelBodyTemplate;
        this.panelBodyModel = args.panelBodyModel || {};
        this.body = this.panelBodyTemplate(this.panelBodyModel);

        this.title = args.panelTitle || '';
        this.footer = args.panelFooter || '';
        this.dontShowFooterContainer = args.dontShowFooterContainer || true;
        this.dontShowTools = args.dontShowTools;

        this.targetContainer = args.targetContainer;
        this.panelHandlers = args.panelHandlers;

        this.model = args.model || [];
        this.tabs = args.tabs || [];
        this.id = args.id;
    }

    addTab(tab) {
        this.tabs.push(tab);

        if (this.parentPage) {
            this.parentPage.updatePanel(this);
        }
    }

    updateTab(tab) {
        super.removeFromArray(this.tabs, tab);
        this.addTab(tab);

        if (this.parentPage) {
            this.parentPage.updatePanel(this);
        }
    }

}

export default PanelElement;