/**
 * Created by Mirek on 2015-06-25.
 */
'use strict';

import RenderingSupport from './../lib/rendering/RenderingSupport';
import BaseComponent from './BaseComponent';

class BaseRenderingComposition extends BaseComponent {

    constructor(componentDef) {
        super(componentDef);
    }

    reRender() {
        for (let i = 0; i < this.getComponents().length; i++) {
            let component = this.getComponents()[i];
            component.view.reRender();
        }
    }

    renderTo(target) {
        this.target = target;
        let masterTemplate = this.getMasterTemplate();
        $(target).html(masterTemplate(this));

        if (this.initializer instanceof Promise) {
            this.initializer.then(()=> {
                this.executeRenderTo(target);
            });
        } else {
            this.executeRenderTo(target);
        }
    }


    getMasterTemplate() {
        return null;
    }

    executeRenderTo(target) {
        for (let i = 0; i < this.getComponents().length; i++) {
            let component = this.getComponents()[i];
            if (!component.target) {
                component.view.renderTo(target);
            } else {
                let subTarget = $(target).find(`[id="${this.id}${component.target}"]`);
                component.view.renderTo(subTarget);
            }
        }
    }


    getComponents() {
        return [];
    }

    dispose() {
        super.dispose();
        this.disposeImpl(this.target);
        for (var i = 0; i < this.getComponents().length; i++) {
            var component = this.getComponents()[i];
            component.view.dispose();
        }
        $(this.target).empty();
    }


    disposeImpl(target) {

    }

}

export default BaseRenderingComposition;
