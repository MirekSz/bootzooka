"use strict";
/**
 * Created by Mirek on 2016-01-20.
 */
import BindingFieldListener from './BindingFieldListener';
class ComponentBindingFieldListener extends BindingFieldListener {
    /**
     *
     * @param {BaseGUIComponent}component
     */
    constructor(component) {
        super();
        this.component = component;
    }

    onValueChange(value, source) {
        removeValidationError(this.component.target);
        var oldValue = this.component.getValue();
        if (oldValue !== value) {
            this.component.onValueChange(value);
        }
    }

    /**
     *
     * @param value
     * @param {BaseGUIComponent} source
     */
    onVisibleChange(value, source) {
        this.component.attrs.visible = value;
        this.component.reRender();
    }

    onEditableChange(value, source) {
        this.component.attrs.editable = value;
        this.component.reRender();
    }

    onPrecisionChange(value, source) {
        this.component.attrs.precision = value;
        this.component.reRender();
    }

    onMinValueChange(value, source) {
        this.component.attrs.minValue = value;
        this.component.reRender();
    }

    onMaxValueChange(value, source) {
        this.component.attrs.maxValue = value;
        this.component.reRender();
    }


    /**
     *
     * @param value
     * @param {BaseGUIComponent} source
     */
    onRequiredChange(value, source) {
        this.component.attrs.required = value;
        this.component.reRender();
    }

    /**
     *
     * @param value
     * @param {BaseGUIComponent} source
     */
    onLabelChange(value, source) {
//        this.component.field.label = value; no need, component holds ref to field
        this.component.reRender();
    }

    /**
     *
     * @param {ValidationState}value
     * @param {BaseGUIComponent} source
     */
    onValidationStateChange(value, source) {
        if (!value.isValid()) {
            addValidationError(this.component.target, value);
        }
    }
}
/**
 *
 * @param {ValidationState} value
 */
function addValidationError(target, value) {
    if (target) {
        var component = target.find(':input');
        if (value.getType() === 'VALIDATION_ERROR') {
            component.addClass('k-error');
        } else {
            component.addClass('k-warning');
        }
        component.attr("data-toggle", "tooltip");
        component.attr("data-placement", "top");
        component.attr("title", value.getMsg());
        component.tooltip();
    }
}
function removeValidationError(target) {
    if (target) {
        var component = target.find(':input');
        component.removeClass('k-error');
        component.removeClass('k-warning');
        component.removeClass('required-value');
        component.tooltip('destroy');
    }
}
export default ComponentBindingFieldListener;
