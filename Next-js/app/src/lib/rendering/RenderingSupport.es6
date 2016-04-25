/**
 * Created by Mirek on 2015-06-25.
 */
'use strict';

import enmus from '../../enums/GlobalEnums';
import rendering from '../rendering/RenderingProperties';
import UIListenerBinder from './UIListenerBinder';

let registry = new Map();

class RenderingSupport {

    constructor(renderingSubject) {
        if (this.constructor.name != 'RenderingSupport') {
            throw new Error("You can't extend this class");
        }
        this.operationSubject = renderingSubject;
        this.renderingSubject = renderingSubject;
        this.uIListenerBinder = new UIListenerBinder(renderingSubject);
    }


    reRender() {
        this.uIListenerBinder.removeHandlers(this.target);
        this.target.empty();

        this.renderingSubject.renderToImpl(this.target);

        let uiListener = this.renderingSubject.addUIListeners || this.renderingSubject.addUIListenersImpl;
        uiListener.bind(this.renderingSubject)(this.uIListenerBinder);
        this.uIListenerBinder.applyHandlers(this.target);
    }

    /**
     * Method will render the component to the given element
     *
     * @param param
     */
    renderTo(param, animateShow) {
        this.target = param.target || param;
        this.contentTarget = param.contentTarget;

        if (!this.target) {
            throw new Error("Target can't be empty");
        }

        if (this.operationSubject.initializer instanceof Promise) {
            this.operationSubject.initializer.then(()=> {
                this.executeRenderToAndListeners(this.target, this.contentTarget);
            });
        } else {
            this.executeRenderToAndListeners(this.target, this.contentTarget, animateShow);
        }
    }

    /**
     * Method will execute the object listeners
     *
     * @param element
     * @param target
     */
    executeListeners(element, target) {
        var listenersImpl = element.addUIListeners || element.addUIListenersImpl;

        if (!listenersImpl) {
            listenersImpl = element.execute;
        }

        listenersImpl.bind(element)(this.uIListenerBinder);
        this.uIListenerBinder.applyHandlers(target);

        var throwError = !this.uIListenerBinder.isEmpty();
        this.addMemoryLeakDetection(target, throwError);
    }

    /**
     * Method will remove listeners from the specific target
     *
     * @param target
     */
    removeListenersFromTarget(target) {
        this.uIListenerBinder.removeHandlers(target);
    }

    /**
     *@private
     **/
    executeRenderToAndListeners(target, contentTarget) {
        var renderToImpl = this.renderingSubject.renderToImpl;
        if (!renderToImpl) {
            throw new Error("renderToImpl can't be empty");
        }
        if ($(target).children().length !== 0) {
            throw new Error("Target of new component should be empty");
        }
        $(target).empty();
        renderToImpl.bind(this.renderingSubject)(target, contentTarget);

        this.executeListeners(this.renderingSubject, target);
        this.animateShowPanel(target);
    }

    /**
     * @private
     * @param target
     */
    animateShowPanel(target) {
        var panel = target.find('.animated-panel');

        if (panel.length) {
            setTimeout(() => {
                panel.removeClass('beforeAnimation');
            }, rendering.ANIMATION.ANIMATION_DELAY_SLOW);
        }
    }

    /**
     * @private
     */
    addMemoryLeakDetection(target, throwError) {
        var targetId = target.attr('id');
        for (var [key, value]  of registry) {
            if (targetId === value.targetId) {
                if (value.id !== this.id && value.id.indexOf(this.id) !== -1) {
                    return;
                }
                //if (throwError) {
                //    throw new Error('Memory leak at ' + value.id + " > " + value.targetId + ' new request ' + this.renderingSubject.id);
                //} else {
                //    console.warn('Probably Memory leak at ' + value.id + " > " + value.targetId + ' new request ' + this.renderingSubject.id);
                //}
            }
        }
        registry.set(this.renderingSubject, {id: this.renderingSubject.id, targetId: targetId});
    }

    dispose() {
        registry.delete(this.renderingSubject);
        this.disposeListeners();
        this.empty(this.target);
    }

    disposeListeners() {
        this.uIListenerBinder.removeHandlers(this.target);
    }

    empty(target) {
        if (!this.isAlwaysVisible(target)) {
            this.target.empty();
        }
    }

    isAlwaysVisible(target) {
        return $(target).hasClass('sidebar-nav');
    }

}

export default RenderingSupport;
