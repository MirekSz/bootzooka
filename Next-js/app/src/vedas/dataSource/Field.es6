/**
 * Created by bstanislawski on 2015-12-16.
 */
import * as mixin  from '../../lib/Mixins';
import FieldEventType  from './../../samil/bindHandler/FieldEventType';
import VedasConsts  from './../VedasConsts';
import {ValidationState}  from './ValidationState';

/**
 * @mixes {ObservableMixin}
 *
 */
class Field {

    /**
     * @param {Object} fieldData
     */
    constructor(fieldData) {
        this.name = fieldData.name;
        this.label = fieldData.label;
        this.domainName = fieldData.domainName;
        this.type = fieldData.type;
        this.value = fieldData.value;
        this.calculateAfterChange = fieldData.calculateAfterChange;
        this.computeFlagsAfterChange = fieldData.computeFlagsAfterChange;
        this.fieldData = fieldData;
        this.fieldsToAssign = fieldData.fieldsToAssign;

        this.setAttributes(fieldData);

        this.setDynamicAttributesFlagsInfluence(fieldData);

        mixin.mixinInitializer(this);
    }

    /**
     * @private
     * @param fieldData
     */
    setAttributes(fieldData) {
        this.visible = getConstValue(VedasConsts.FIELD.VISIBLE_SOURCE, fieldData);
        this.required = getConstValue(VedasConsts.FIELD.REQUIRED_SOURCE, fieldData);

        this.editable = getConstValue(VedasConsts.FIELD.EDITABLE_SOURCE, fieldData);

        this.minValue = getConstValue(VedasConsts.FIELD.MIN_VALUE_SOURCE, fieldData);
        this.maxValue = getConstValue(VedasConsts.FIELD.MAX_VALUE_SOURCE, fieldData);
        this.precision = getConstValue(VedasConsts.FIELD.PRECISION_SOURCE, fieldData);

        this.validationState = new ValidationState();
    }

    /**
     *@private
     **/
    setDynamicAttributesFlagsInfluence(fieldData) {
        this.flagsInfluence = {};
        this.flagsInfluence.visibleSourceFlagName = fieldData.visibleSourceFlagName;
        this.flagsInfluence.focusTraversalEnabledSourceFlagName = fieldData.focusTraversalEnabledSourceFlagName;
        this.flagsInfluence.requiredSourceFlagName = fieldData.requiredSourceFlagName;
        this.flagsInfluence.enabledSourceFlagName = fieldData.enabledSourceFlagName;
        this.flagsInfluence.editableSourceFlagName = fieldData.editableSourceFlagName;
        this.flagsInfluence.uniqueSourceFlagName = fieldData.uniqueSourceFlagName;
        this.flagsInfluence.labelSourceFlagName = fieldData.labelSourceFlagName;
        this.flagsInfluence.precisionSourceFlagName = fieldData.precisionSourceFlagName;
        this.flagsInfluence.maxValueSourceFlagName = fieldData.maxValueSourceFlagName;
        this.flagsInfluence.minValueSourceFlagName = fieldData.minValueSourceFlagName;
        this.flagsInfluence.charactersKindSourceFlagName = fieldData.charactersKindSourceFlagName;
    }


    /**
     * @returns {String} name
     */
    getName() {
        return this.name;
    }

    /**
     * @returns {String} label
     */
    getLabel() {
        return this.label;
    }

    getValue() {
        return this.value;
    }

    setValue(value) {
        if (this.value !== value) {
            this.value = value;
            this.fireEvent({source: this, eventType: FieldEventType.VALUE_CHANGE, value});
        }
    }

    setLabel(value) {
        if (this.label !== value) {
            this.label = value;
            this.fireEvent({source: this, eventType: FieldEventType.LABEL_CHANGE, value});
        }
    }

    setVisible(value) {
        if (this.visible !== value) {
            this.visible = value;
            this.fireEvent({source: this, eventType: FieldEventType.VISIBLE_CHANGE, value});
        }
    }

    setEditable(value) {
        if (this.editable !== value) {
            this.editable = value;
            this.fireEvent({source: this, eventType: FieldEventType.EDITABLE_CHANGE, value});
        }
    }

    setPrecision(value) {
        if (this.precision !== value) {
            this.precision = value;
            this.fireEvent({source: this, eventType: FieldEventType.PRECISION_CHANGE, value});
        }
    }

    setMinValue(value) {
        if (this.minValue !== value) {
            this.minValue = value;
            this.fireEvent({source: this, eventType: FieldEventType.MIN_VALUE_CHANGE, value});
        }
    }

    setMaxValue(value) {
        if (this.maxValue !== value) {
            this.maxValue = value;
            this.fireEvent({source: this, eventType: FieldEventType.MAX_VALUE_CHANGE, value});
        }
    }

    setRequired(value) {
        if (this.required !== value) {
            this.required = value;
            this.fireEvent({source: this, eventType: FieldEventType.REQUIRED_CHANGE, value});
        }
    }

    isVisible() {
        if (this.visible !== undefined) {
            return this.visible;
        }
        return true;
    }

    isRequired() {
        if (this.required !== undefined) {
            return this.required;
        }
        return true;
    }

    isEditable() {
        if (this.editable !== undefined) {
            return this.editable;
        }
        return true;
    }

    getMinValue() {
        return this.minValue;
    }

    getMaxValue() {
        return this.maxValue;
    }

    getPrecision() {
        return this.precision;
    }

    setValueModified(value) {
        this.valueModified = value;
        if (value) {
            this.fireEvent({source: this, eventType: FieldEventType.VALUE_MODIFIED});
        }
    }

    isValueModified() {
        return this.valueModified;
    }

    setActive(value) {
        this.active = value;
        this.fireEvent({source: this, eventType: FieldEventType.ACTIVATION, value});
    }

    isActive() {
        return this.active;
    }

    /**
     *
     * @returns {ValidationState}
     */
    getValidationState() {
        return this.validationState;
    }

    /**
     *
     * @returns {ValidationState}
     */
    setValidationState(value) {
        this.validationState = value;
        this.fireEvent({source: this, eventType: FieldEventType.VALIDATION_STATE_CHANGE, value});
    }

    fireEvent(event) {
        this.fireListeners(event);
        if (this.dataSet) {
            event.field = this;
            this.dataSet.onFieldEvent(event);
        }
    }

    /**
     *
     * @param prop
     * @returns {VedasConsts.FIELD.CONST_VALUE|VedasConsts.FIELD.DYNAMIC_VALUE}
     */
    getPropertyValueType(prop) {
        return this.fieldData[prop][VedasConsts.FIELD.VALUE_TYPE];
    }
}
function getConstValue(prop, fieldData) {
    if (fieldData[prop]) {
        if (fieldData[prop][VedasConsts.FIELD.VALUE_TYPE] === VedasConsts.FIELD.CONST_VALUE) {
            var value = fieldData[prop].value;
            if (value && value.value !== undefined) {//min,max,precision strange struct
                return parseInt(value.value);
            }
            if (typeof(value) === 'string' && !isNaN(value)) {
                return Number(value);
            }
            return value;
        }
    }
    return undefined;
}

mixin.applyMixin(mixin.ObservableMixin, Field);
export default Field;
