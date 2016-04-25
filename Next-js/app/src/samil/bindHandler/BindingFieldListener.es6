"use strict";
/**
 * Created by Mirek on 2016-01-18.
 */
import FieldEventType from './FieldEventType';
class BindingFieldListener {
    constructor() {
        this.listeners = new Map();
    }

    /**
     *
     * @param value
     * @param {BaseGUIComponent} source
     */
    onValueChange(value, source) {
        var listener = this.listeners.get(FieldEventType.VALUE_CHANGE);
        if (listener) {
            listener(value, source);
        }
    }

    /**
     *
     * @param value
     * @param {BaseGUIComponent} source
     */
    onVisibleChange(value, source) {

    }

    /**
     *
     * @param value
     * @param {BaseGUIComponent} source
     */
    onEditableChange(value, source) {

    }

    /**
     *
     * @param value
     * @param {BaseGUIComponent} source
     */
    onPrecisionChange(value, source) {

    }

    /**
     *
     * @param value
     * @param {BaseGUIComponent} source
     */
    onMinValueChange(value, source) {

    }

    /**
     *
     * @param value
     * @param {BaseGUIComponent} source
     */
    onMaxValueChange(value, source) {

    }

    /**
     *
     * @param value
     * @param {BaseGUIComponent} source
     */
    onRequiredChange(value, source) {

    }

    /**
     *
     * @param value
     * @param {BaseGUIComponent} source
     */
    onLabelChange(value, source) {

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
    onValueModified(value, source) {
        var listener = this.listeners.get(FieldEventType.VALUE_MODIFIED);
        if (listener) {
            listener(value, source);
        }
    }

    /**
     *
     * @param {ValidationState}value
     * @param {BaseGUIComponent} source
     */
    onValidationStateChange(value, source) {
    }

    /**
     *
     * @param value
     * @param {BaseGUIComponent} source
     */
    onActivationChange(value, source) {
        var listener = this.listeners.get(FieldEventType.ACTIVATION);
        if (listener) {
            listener(value, source);
        }
    }

}

export default BindingFieldListener;
