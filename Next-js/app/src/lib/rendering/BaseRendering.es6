/**
 * Created by Mirek on 2015-06-25.
 */
'use strict';

import RenderingSupport from './RenderingSupport';

class BaseRendering {

    constructor() {
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
        this.target = target;
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
        this.disposeImpl(this.target);
        this.renderingSupport.dispose();
    }

    disposeImpl(target) {
    }

    destroyKendoComponent(target) {
        if ($(target).length == 0 || $(target).children().length == 0) {
            throw new Error("Can't destroy empty target");
        }
        kendo.destroy(target);
    }

    empty(target) {
        this.renderingSupport.empty(target);
    }

    toArray(iterable) {
        var result = [];
        for (let val of iterable) {
            result.push(val);
        }
        return result;
    }

    /**
     * Method to get the elementId from the DOMid
     *
     * @param {String} targetId DOM ID [...parentID_elementID_index]
     * @returns {String} elementId
     */
    extractElementId(targetId) {
        var idArray = targetId.split('_');
        return idArray[idArray.length - 2];
    }

}

export default BaseRendering;
