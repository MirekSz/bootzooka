/**
 * Created by bartek on 2015-11-03.
 */
import Types from '../enums/ComponentsDefinitionsTypes';
import ViewComponentDef from './ViewComponentDef';

class PanelElementComponentDef extends ViewComponentDef {

    constructor(args) {
        var localType = Types.VIEWS.PANEL_VIEW;

        super({id: args.id, type: localType, icon: args.icon, name: args.name});

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

        this.contentElements = new Map();
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

    getContentElements() {
        return this.contentElements;
    }

    /**
     * @param {ViewComponentDef} element
     */
    addContentElement(element) {
        this.contentElements.set(element.id, element);
    }

    /**
     *
     * @param elementId
     */
    removeContentElement(elementId) {
        this.contentElements.delete(elementId);
    }

}

export default PanelElementComponentDef;
