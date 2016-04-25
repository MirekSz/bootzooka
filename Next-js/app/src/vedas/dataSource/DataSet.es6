/**
 * Created by bstanislawski on 2015-12-23.
 */
"use strict";
import Field from './Field';
import {EMPTY_VALIDATION_STATE} from './ValidationState';
import FieldEventType from '../../samil/bindHandler/FieldEventType';

class DataSet {

    /**
     * @param {Object} dataSetSource
     */
    constructor(dataSetSource) {
        /**
         *
         * @type {Map}
         */
        this.fields = new Map();
        if (dataSetSource) {
            this.init(dataSetSource);
        }
        this.beanValidationStates = [];
    }

    init(dataSetSource) {
        this.name = dataSetSource.name;
        this.source = dataSetSource;

        var fieldDefMap = dataSetSource.fieldDefMap;
        for (var fieldName in fieldDefMap) {
            if (fieldDefMap.hasOwnProperty(fieldName)) {
                var fieldData = fieldDefMap[fieldName];

                this.addField(fieldData, fieldName);
            }
        }
    }

    /**
     * @param {String} name
     */
    setName(name) {
        this.name = name;
    }

    /**
     * @returns {String|*} name
     */
    getName() {
        return this.name;
    }

    /**
     * @returns {Map}
     */
    getFields() {
        return this.fields;
    }

    /**
     * @priavte
     *
     * @param {Object} fieldData
     * @param {String} fieldName
     */
    addField(fieldData, fieldName) {
        var field = new Field(fieldData);

        field.id = fieldName;
        field.dataSet = this;

        this.fields.set(fieldName, field);
    }

    setVisible(fieldName, value) {
        var field = this.getFieldByName(fieldName);
        field.setVisible(value);
    }

    setEditable(fieldName, value) {
        var field = this.getFieldByName(fieldName);
        field.setEditable(value);
    }

    setPrecision(fieldName, value) {
        var field = this.getFieldByName(fieldName);
        field.setPrecision(value);
    }

    setMinValue(fieldName, value) {
        var field = this.getFieldByName(fieldName);
        field.setMinValue(value);
    }

    setMaxValue(fieldName, value) {
        var field = this.getFieldByName(fieldName);
        field.setMaxValue(value);
    }

    setRequired(fieldName, value) {
        var field = this.getFieldByName(fieldName);
        field.setRequired(value);
    }

    setLabel(fieldName, value) {
        var field = this.getFieldByName(fieldName);
        field.setLabel(value);
    }

    /**
     *
     * @param event
     * @param {Field} event.field
     * @param {FieldEventType} event.eventType
     */
    onFieldEvent(event) {
        this.lastFieldEvent = event;
        if (event.eventType === FieldEventType.VALUE_CHANGE) {
            if (event.field.fieldsToAssign) {
                for (var i = 0; i < event.field.fieldsToAssign.length; i++) {
                    var fieldName = event.field.fieldsToAssign[i];
                    var field = this.getFieldByName(fieldName);
                    field.setValue(event.field.getValue());
                }
            }
            this.clearFieldState(event.field);
        }
    }

    /**
     *
     * @param {Field} field
     */
    clearFieldState(field) {
        clearValidationState(field);
    }

    /**
     * @param {String} name
     * @returns {Field} field
     */
    getFieldByName(name) {
        return this.fields.get(name);
    }

    getLastFieldEvent() {
        return this.lastFieldEvent;
    }

    createDTOFromFields() {
        var dto = {};
        for (let [key,value] of this.fields) {
            dto[key] = value.getValue();
        }
        return dto;
    }

    applyDataFromDTO(dto) {
        for (var key in dto) {
            var fieldByName = this.getFieldByName(key);
            if (fieldByName) {
                var value = dto[key];
                if (fieldByName.getValue() !== value) {
                    fieldByName.setValue(value);
                }
            }
        }
    }

    startUpdate() {
        this.updating = true;
    }

    finishUpdate() {
        this.updating = false;
    }

}
/**
 *
 * @param {Field} field
 */
function clearValidationState(field) {
    field.setValidationState(EMPTY_VALIDATION_STATE);
}
export default DataSet;