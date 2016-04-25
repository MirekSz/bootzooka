"use strict";
import VedasConsts  from './VedasConsts';
/**
 * Created by Mirek on 2016-01-27.
 */
class FlagsInterpreter {
    /**
     *
     * @param {DataSet} dataset
     * @param {ClientDataSetService} clientDataSetService
     */
    constructor(dataset, clientDataSetService) {
        this.dataset = dataset;
        this.clientDataSetService = clientDataSetService;
    }

    /**
     * @param {Map} fields
     * @param flags
     */
    process(fields, flags) {
        var dynamicFields = [];
        for (let [key, value] of fields) {
            if (this.isDynamic(value)) {
                var fieldName = value.name;

                var visible = flags[value.flagsInfluence.visibleSourceFlagName];
                var required = flags[value.flagsInfluence.requiredSourceFlagName];
                var label = flags[value.flagsInfluence.labelSourceFlagName];
                var editable = flags[value.flagsInfluence.editableSourceFlagName];
                var minValue = flags[value.flagsInfluence.minValueSourceFlagName];
                var maxValue = flags[value.flagsInfluence.maxValueSourceFlagName];
                var precision = flags[value.flagsInfluence.precisionSourceFlagName];

                if (visible !== undefined) {
                    this.dataset.setVisible(fieldName, visible);
                }
                if (required !== undefined) {
                    this.dataset.setRequired(fieldName, required);
                }
                if (label !== undefined) {
                    this.dataset.setLabel(fieldName, label);
                }

                if (editable !== undefined) {
                    this.dataset.setEditable(fieldName, editable);
                }

                if (minValue !== undefined) {
                    this.dataset.setMinValue(fieldName, minValue);
                }

                if (maxValue !== undefined) {
                    this.dataset.setMaxValue(fieldName, maxValue);
                }

                if (precision !== undefined) {
                    this.dataset.setPrecision(fieldName, precision);
                }
            }
        }
    }

    /**
     *
     * @param {Field} field
     * @returns {boolean}
     */
    isDynamic(field) {
        var dynamicVisible = field.getPropertyValueType(VedasConsts.FIELD.VISIBLE_SOURCE) === VedasConsts.FIELD.DYNAMIC_VALUE;
        var dynamicRequire = field.getPropertyValueType(VedasConsts.FIELD.REQUIRED_SOURCE) === VedasConsts.FIELD.DYNAMIC_VALUE;
        var dynamicLabel = field.getPropertyValueType(VedasConsts.FIELD.LABEL_SOURCE) === VedasConsts.FIELD.DYNAMIC_VALUE;
        var dynamicEditable = field.getPropertyValueType(VedasConsts.FIELD.EDITABLE_SOURCE) === VedasConsts.FIELD.DYNAMIC_VALUE;
        return dynamicVisible || dynamicRequire || dynamicLabel || dynamicEditable;
    }

}

export default FlagsInterpreter;
