"use strict";
/**
 * Created by Mirek on 2016-01-20.
 */
import BindingComponentListener from './BindingComponentListener';
class FieldBindingComponentListener extends BindingComponentListener {
    /**
     *
     * @param {Field} field
     */
    constructor(field) {
        super();
        this.field = field;
    }

    onValueChange(value, source) {
        if (this.field.getValue() !== value) {
            this.field.setValue(value);
        }
        this.field.setValueModified(false);
    }

    onValueModified(value, source) {
        this.field.setValueModified(true);
    }

    onActivationChange(value, source) {
        this.field.setActive(value);
    }

}

export default FieldBindingComponentListener;
