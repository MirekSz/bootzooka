"use strict";
/**
 * Created by Mirek on 2016-01-18.
 */
import Field from '../../vedas/dataSource/Field';
import FieldBindingComponentListener from './FieldBindingComponentListener';
import ComponentEventType from './ComponentEventType';
import FieldEventType from './FieldEventType';

export class BindHandler {
    /**
     *
     * @param {BaseGUIComponent} component
     */
    constructor(component) {
        this.component = component;
        this.componentListeners = new Set();
        this.fieldListeners = new Set();

    }

    /**
     *
     * @param event
     * @param {String} event.eventType
     * @param {Field} event.source
     * @param {Object} event.value
     */
    fieldEventListener(event) {
        this.lastFieldEvent = event;
//        console.log('FieldEvent: ');
//        console.log(event);
        this.propagateFieldEvent(event.value, event.eventType, event.source);

    }

    /**
     *
     * @param event
     * @param {String} event.eventType
     * @param {BaseGUIComponent} event.source
     * @param {Object} event.value
     */
    componentEventListener(event) {
        this.lastComponentEvent = event;
//        console.log('ComponentEvent: ');
//        console.log(event);
        this.propagateComponentEvent(event.value, event.eventType, event.source);
    }

    /**
     *
     * @param {Field} field
     */
    bindField(field) {
        if (!(field instanceof Field)) {
            throw new Error(`Argument is not an instance of Field ${field}`);
        }
        this.fieldListener = this.fieldEventListener.bind(this);
        if (this.field) {
            this.field.removeListener(this.fieldListener);
            this.componentListeners.delete(this.fieldBindingComponentListener);
        }
        this.field = field;
        field.addListener(this.fieldListener);

        this.fieldBindingComponentListener = new FieldBindingComponentListener(field);
        this.addBindingComponentListener(this.fieldBindingComponentListener);
    }

    /**
     * @param {BindingComponentListener} listener
     */
    addBindingComponentListener(listener) {
        this.componentListeners.add(listener);
    }

    /**
     * @param {BindingFieldListener} listener
     */
    addBindingFieldListener(listener) {
        this.fieldListeners.add(listener);
    }

    /**
     *
     * @param value
     * @param {String} eventType
     * @param {(Field)} source
     *
     */
    propagateFieldEvent(value, eventType, source) {
        for (let listener of this.fieldListeners) {
            switch (eventType) {
                case FieldEventType.VALUE_CHANGE:
                    listener.onValueChange(value, source);
                    break;
                case FieldEventType.VALUE_MODIFIED:
                    listener.onValueModified(value, source);
                    break;
                case FieldEventType.ACTIVATION:
                    listener.onActivationChange(value, source);
                    break;
                case FieldEventType.VISIBLE_CHANGE:
                    listener.onVisibleChange(value, source);
                    break;
                case FieldEventType.REQUIRED_CHANGE:
                    listener.onRequiredChange(value, source);
                    break;
                case FieldEventType.LABEL_CHANGE:
                    listener.onLabelChange(value, source);
                    break;
                case FieldEventType.EDITABLE_CHANGE:
                    listener.onEditableChange(value, source);
                    break;
                case FieldEventType.MAX_VALUE_CHANGE:
                    listener.onMaxValueChange(value, source);
                    break;
                case FieldEventType.MIN_VALUE_CHANGE:
                    listener.onMinValueChange(value, source);
                    break;
                case FieldEventType.PRECISION_CHANGE:
                    listener.onPrecisionChange(value, source);
                    break;
                case FieldEventType.VALIDATION_STATE_CHANGE:
                    listener.onValidationStateChange(value, source);
                    break;
            }
        }
    }

    /**
     *
     * @param value
     * @param {String} eventType
     * @param {(BaseGUIComponent)} source
     *
     */
    propagateComponentEvent(value, eventType, source) {
        for (let listener of this.componentListeners) {
            switch (eventType) {
                case ComponentEventType.VALUE_CHANGE:
                    listener.onValueChange(value, source);
                    break;
                case ComponentEventType.VALUE_MODIFIED:
                    listener.onValueModified(value, source);
                    break;
                case ComponentEventType.ACTIVATION:
                    listener.onActivationChange(value, source);
                    break;
            }
        }
    }

    dispose() {
        this.fieldListeners.clear();
        this.componentListeners.clear();
        if (this.field) {
            this.field.removeListener(this.fieldListener);
        }
    }

    /**
     *
     * @returns {{eventType: FieldEventType, source: Field, value: Object}|*}
     */
    getLastFieldEvent() {
        return this.lastFieldEvent;
    }
}

export const SourceType = {
    COMPONENT: 'COMPONENT',
    FIELD: 'FIELD'
};
