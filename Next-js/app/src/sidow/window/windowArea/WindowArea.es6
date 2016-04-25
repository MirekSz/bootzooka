/**
 * Created by bartosz on 02.06.15.
 *
 * Option class
 */
import BaseRendering from '../../../lib/rendering/BaseRendering';
import WindowAreaView from './WindowAreaView';
import WindowAreaController from './WindowAreaController';
import SidowEnums from '../../SidowEnums';

class WindowArea extends BaseRendering {

    /**
     * @param {String} id
     * @param {String} [contentVisualisationStyle] ex.tabs etc.
     */
    constructor(id, contentVisualisationStyle) {
        super();
        this.id = id;

        /** @type {(<String, WindowContentBaseView>|Map)} */
        this.components = new Map();

        this.contentVisualisationStyle = contentVisualisationStyle || SidowEnums.VISUALISATION_STYLE.TABS;

        this.view = new WindowAreaView(this);
        this.controller = new WindowAreaController(this);
    }

    /**
     * @param {WindowContentBaseView} windowAreaComponent
     */
    addComponent(windowAreaComponent) {
        if (this.components.size === 0) {
            this.firstComponent = windowAreaComponent;
        }
        this.components.set(windowAreaComponent.id, windowAreaComponent);
    }

    initContent() {
        this.controller.activateDefaultComponent();
    }

    renderToImpl(target) {
        this.target = target;

        this.view.renderLayout();
        this.view.renderContent();
    }

    disposeImpl(target) {
        this.components.forEach(component => {
            component.visibleChange(false);
            component.dispose();
        });
    }

    /**
     * @return {(<String, WindowContentBaseView>|Map)} visibleComponents
     */
    getVisibleComponents() {
        var visibleComponents = new Map();

        this.components.forEach(component => {
            if (component.isVisible) {
                visibleComponents.set(component.id, component);
            }
        });
        return visibleComponents;
    }

    /**
     * @returns {Array.<WindowContentBaseView>}
     */
    getContent() {
        return super.toArray(this.components.values());
    }

    /**
     * @param {UIListenerBinder} uIListenerBinder
     */
    addUIListenersImpl(uIListenerBinder) {
        this.navbarTabs = this.target.find('.nav li a');

        uIListenerBinder.addClick(this.navbarTabs, event => {
            this.view.handleClickOnTab(event);
        });
    }

    showComponent(id) {
        var component = this.components.get(id);

        if (!component.isVisible) {
            component.visibleChange(true);
        }
    }

    setDefaultComponent(id) {
        var component = this.components.get(id);

        component.setAsDefault();
    }

}

export default WindowArea;
