/**
 * Created by bartosz on 21.05.15.
 *
 * TableComponent class
 */

import BaseRenderingComponent from '../../BaseRenderingComponent';
import panelTemplate from './panel.hbs';

import WindowPanelView from './WindowPanelView';
import rendering from '../../../lib/rendering/RenderingProperties';

class WindowPanelComponent extends BaseRenderingComponent {
    /**
     * @param {PanelElementComponentDef} element
     */
    constructor(element) {
        super(element);

        this.header = undefined;
        this.body = undefined;
        this.footer = undefined;

        this.window = element.window;
        this.name = element.name;

        this.view = new WindowPanelView(this);
    }

    initializeImpl() {
        this.content = this.window;
        return this.content.init();
    }

    renderToImpl(target) {
        let snippet = panelTemplate(this);

        target.html(snippet).promise().done(() => {
            this.showPanel(target);
        });
    }

    dispose() {
        this.content.dispose();
        super.dispose();
    }

    disposeImpl() {
        super.disposeImpl();
    }

    addUIListenersImpl(uIListenerBinder) {
    }

    /**
     * Standard set of handlers for panel element
     *
     * @private
     */
    showPanel(targetContainer) {
        this.header = targetContainer.find('.panel-header');
        this.body = targetContainer.find('.panel-body');
        this.footer = targetContainer.find('.panel-footer');

        this.$panel = targetContainer.find('.panel');

        setTimeout(() => {
            this.$panel.removeClass('beforeAnimation');
        }, rendering.ANIMATION.ANIMATION_DELAY_SLOWER);

        this.view.renderContent(this);
    }

}

export default WindowPanelComponent;
