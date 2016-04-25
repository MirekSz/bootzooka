/**
 * Created by Mirek on 2015-06-25.
 */
'use strict';

import RenderingSupport from './../lib/rendering/RenderingSupport';
import BaseComponent from './BaseComponent';

class BaseRenderingComponent extends BaseComponent {

    constructor(componentDef) {
        super(componentDef);
        this.renderingSupport = new RenderingSupport(this);
    }

    reRender() {
        this.renderingSupport.reRender();
    }

    /**
     * Method will render the component to the given element
     *
     * @param target
     */
    renderTo(target) {
        this.renderingSupport.renderTo(target);
    }

    /**
     *
     * @param {UIListenerBinder} uIListenerBinder
     */
    addUIListenersImpl(uIListenerBinder) {
    }

    renderToImpl(target) {
        console.log(`Render ${this.id}`);
        target.html(`<b>Render ${this.id}</b>`);
    }

    dispose() {
        super.dispose();
        this.disposeImpl(this.target);
        this.renderingSupport.dispose();
    }

    disposeImpl(target) {

    }

    empty(target) {
        this.renderingSupport.empty(target);
    }
}

export default BaseRenderingComponent;
