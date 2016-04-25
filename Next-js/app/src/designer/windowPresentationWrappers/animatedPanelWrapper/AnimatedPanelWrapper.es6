/**
 * Created by bstanislawski on 2016-03-30.
 */
import ViewComponentDef from '../../../componentsDefinitions/ViewComponentDef';
import ComponentsFactory from '../../../components/ComponentsFactory';
import componentsDefinitionsTypes from '../../../enums/ComponentsDefinitionsTypes';
import ComposableWindow from '../../../sidow/window/composableWindow/ComposableWindow';

import {eventBus, events} from './../../../lib/EventBus';
import rendering from '../../../lib/rendering/RenderingProperties';

class AnimatedPanelWrapper {

    /**
     * @param {Window} window
     */
    constructor(window) {
        if (window) {
            this.setTile(window.options);
            this.addContent(window);
        }
    }

    /**
     * @param {jQuery} $target
     */
    show($target) {
        this.view.renderTo($target);
    }

    hide() {
        this.view.$panel.addClass('beforeAnimation');

        setTimeout(() => {
            this.view.dispose();
            eventBus.send(events.WINDOW.ANIMATION_HIDE_OVER, this.view.id);
        }, rendering.ANIMATION.ANIMATION_DELAY_SLOW);
    }

    /**
     * @param {Window} window
     */
    addContent(window) {
        let viewDef = new ViewComponentDef(createId(this.windowTitle), componentsDefinitionsTypes.VIEWS.WINDOW_PANEL_COMPONENT, '', window.options.windowTitle);
        viewDef.addWindow(window);

        this.view = ComponentsFactory.createComponent(viewDef, true);
        let windowPanel = this.view;

        windowPanel.initialize();

        if (windowPanel.initializer instanceof Promise) {
            windowPanel.initializer.then(()=> {
                this.setAttributes(windowPanel, window);
            });
        } else {
            this.setAttributes(windowPanel, window);
        }
    }

    setAttributes(windowPanel, window) {
        windowPanel.id = this.windowTitle;

        if (window instanceof ComposableWindow) {
            windowPanel.isComposableWindow = true;
        }
    }

    /**
     * @private
     *
     * @param {Window.options} options
     */
    setTile(options) {
        if (options.windowTitle) {
            this.windowTitle = options.windowTitle;
        } else {
            this.windowTitle = options.title;
        }
    }

}

export default AnimatedPanelWrapper;

function createId(windowTitle) {
    return windowTitle.replace(' ', '_');
}
