"use strict";
import DataSet from './dataSource/DataSet';
import FieldEventType from '../samil/bindHandler/FieldEventType';
import ClientDataSetService from './ClientDataSetService';
import FlagsInterpreter from './FlagsInterpreter';
import {ValidationState, VALIDATION_TYPE} from './dataSource/ValidationState';

class ClientDataSet extends DataSet {

    constructor(serviceName, dtoName, flagsName) {
        super(undefined);
        this.clientDataSetService = new ClientDataSetService(serviceName, dtoName, flagsName);
        this.flagsInterpreter = new FlagsInterpreter(this, this.clientDataSetService);
    }

    initialize() {
        var promise = this.clientDataSetService.getDef();
        return promise.then((def)=> {
            this.init(def);
            return def;
        });
    }

    initDTO(dto) {
        var self = this;
        self.startUpdate();
        var promise = this.clientDataSetService.init(dto);
        return promise.then((data)=> {
            this.applyPropertiesFromFlags(data.flags);
            super.applyDataFromDTO(data.responseObject);
            self.finishUpdate();
        });
    }

    /**
     * @param event
     * @param {Field} event.field
     * @param {FieldEventType} event.eventType
     */
    onFieldEvent(event) {
        if (!this.updating) {
            super.onFieldEvent(event);
            var field = event.field;
            if (event.eventType === FieldEventType.VALUE_CHANGE && field.calculateAfterChange) {
                this.calculateDto(event);
            } else if (event.eventType === FieldEventType.VALUE_CHANGE && !field.calculateAfterChange && field.computeFlagsAfterChange) {
                this.calculateFlags(event);
            }
        }
    }

    calculateFlags(event) {
        var dtoFromField = this.createDTOFromFields();
        var promise = this.clientDataSetService.calculateFlags(dtoFromField);
        return promise.then((data)=> {
            return this.applyPropertiesFromFlags(data);
        });
    }

    calculateDto(event) {
        var self = this;
        self.startUpdate();
        var field = event.field;
        var dtoFromField = this.createDTOFromFields();
        var promise = this.clientDataSetService.calculateDto(dtoFromField, field.name);
        return promise.then((data)=> {
            this.applyPropertiesFromFlags(data.flags);
            super.applyDataFromDTO(data.responseObject);
            self.finishUpdate();
        });
    }

    validate() {
        this.clearAllValidationStates();
        var errorsFound = this.validateRequiredFields();
        if (errorsFound) {
            return Promise.resolve();
        }

        var dtoFromField = this.createDTOFromFields();
        var promise = this.clientDataSetService.validateDto(dtoFromField);
        return promise.then(undefined, (data)=> {
            this.validationInterpreter(data.asenException);
        });
    }

    applyPropertiesFromFlags(flags) {
        this.flagsInterpreter.process(this.getFields(), flags);
    }

    getValidationStates() {
        var result = [];
        result.concat(this.beanValidationStates);

        this.fields.forEach((value)=> {
            if (!value.getValidationState().isValid()) {
                result.push(value.getValidationState());
            }
        });

        return result;
    }

    /**
     *
     * @param {Array} validationException
     */
    validationInterpreter(validationException) {
        var errorList = validationException.validationResult.list;

        for (var i = 0; i < errorList.length; i++) {
            var error = errorList[i];
            var desc = error.description;
            var fieldName = error.fieldName;
            var validationStatus = error.validationStatus;
            var fieldByName = this.getFieldByName(fieldName);
            var validationState = new ValidationState(error.id, validationStatus, desc);
            if (fieldByName === undefined) {
                this.beanValidationStates.push(validationState);
            } else {
                fieldByName.setValidationState(validationState);
            }
        }
    }

    validateRequiredFields() {
        var errorsFound = false;
        this.getFields().forEach((field)=> {
            var required = field.isRequired();
            var value = field.getValue();
            if (required && (value === undefined || value === '' || value === null)) {
                field.setValidationState(new ValidationState('', VALIDATION_TYPE.VALIDATION_ERROR, rm.getRes("field.value.required")));
                errorsFound = true;
            }
        });
        return errorsFound;
    }

    clearAllValidationStates() {
        this.getFields().forEach((value)=>this.clearFieldState(value));
    }
}


export default ClientDataSet;
