import BaseRenderingComponent from '../../BaseRenderingComponent';

import WindowPanelView from './WindowPanelView';

class ModalWindowPanelComponent extends BaseRenderingComponent {
    /**
     * @param {PanelElementComponentDef} def
     */
    constructor(def) {
        super(def);

        this.header = undefined;
        this.body = undefined;
        this.footer = undefined;

        this.window = def.window;

        this.view = new WindowPanelView(this);
    }

    initializeImpl() {
        this.content = this.window;
        this.content.init();
    }

    renderToImpl(target) {
        this.content.renderTo(target);
    }

}

export default ModalWindowPanelComponent;
