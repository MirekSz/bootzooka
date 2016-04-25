"use strict";
/**
 * Created by Mirek on 2016-01-18.
 */
import ComponentEventType from './ComponentEventType';
class BindingComponentListener {
    constructor() {
        this.listeners = new Map();
    }

    /**
     *
     * @param value
     * @param {BaseGUIComponent} source
     */
    onValueChange(value, source) {
        var listener = this.listeners.get(ComponentEventType.VALUE_CHANGE);
        if (listener) {
            listener(value, source);
        }
    }

    /**
     *
     * @param {String} event
     * @param listener
     */
    setListener(event, listener) {
        this.listeners.set(event, listener);
    }

    /**
     *
     * @param value
     * @param {BaseGUIComponent} source
     */
    onActivationChange(value, source) {
        var listener = this.listeners.get(ComponentEventType.ACTIVATION);
        if (listener) {
            listener(value, source);
        }
    }
}

export default BindingComponentListener;
