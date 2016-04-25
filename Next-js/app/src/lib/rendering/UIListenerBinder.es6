/**
 * Created by Mirek on 2015-06-17.
 */

class UIListenerBinder {

    constructor(renderingSubject) {
        this.renderingSubject = renderingSubject;
        this.handlers = new Map();
        this.handlersApplied = false;
    }

    /**
     *
     * @param element jquery selector
     * @param callback
     * @param bindCurrentContext if true then this is the current object, not GUI element
     */
    addClick(element, callback, bindCurrentContext = true) {
        this.handlers.set(element, callback);
        callback.eventType = 'click';
        callback.bindCurrentContext = bindCurrentContext;
    }

    /**
     *
     * @param element jquery selector
     * @param callback
     * @param bindCurrentContext if true then this is the current object, not GUI element
     */
    addKeyUp(element, callback, bindCurrentContext = true) {
        this.handlers.set(element, callback);
        callback.eventType = 'keyup';
        callback.bindCurrentContext = bindCurrentContext;
    }

    /**
     *
     * @param element jquery selector
     * @param callback
     * @param bindCurrentContext if true then this is the current object, not GUI element
     */
    addKeyDown(element, callback, bindCurrentContext = true) {
        this.handlers.set(element, callback);
        callback.eventType = 'keydown';
        callback.bindCurrentContext = bindCurrentContext;
    }

    /**
     *
     * @param element jquery selector
     * @param callback
     * @param bindCurrentContext if true then this is the current object, not GUI element
     */
    addFocusIn(element, callback, bindCurrentContext = true) {
        this.handlers.set(element, callback);
        callback.eventType = 'focus';
        callback.bindCurrentContext = bindCurrentContext;
    }

    /**
     *
     * @param element jquery selector
     * @param callback
     * @param bindCurrentContext if true then this is the current object, not GUI element
     */
    addFocusOut(element, callback, bindCurrentContext = true) {
        this.handlers.set(element, callback);
        callback.eventType = 'blur';
        callback.bindCurrentContext = bindCurrentContext;
    }

    add(element, eventType, callback, bindCurrentContext = true) {
        this.handlers.set(element, callback);
        callback.eventType = eventType;
        callback.bindCurrentContext = bindCurrentContext;
    }


    getHandlers() {
        return this.handlers;
    }

    applyHandlers(target, rendSubject) {
        if (this.handlersApplied) {
            throw new Error('Handlers already applied');
        }

        let renderingSubject = rendSubject || this.renderingSubject;

        for (let [key,handler] of this.handlers) {
            let eventType = `click.${key}`;
            if (handler.eventType) {
                eventType = `${handler.eventType}.${key}`;
            }
            if (handler.bindCurrentContext) {
                $(document).find(key).bind(eventType, handler.bind(renderingSubject));
            } else {
                $(document).find(key).bind(eventType, handler);
            }
        }
        this.handlersApplied = true;
    }

    removeHandlers(target) {
        for (let [key, handler] of this.handlers) {
            $(document).find(key).unbind();
        }
        this.handlersApplied = false;
    }

    isEmpty() {
        return this.handlers.size === 0;
    }
}

export default UIListenerBinder;
