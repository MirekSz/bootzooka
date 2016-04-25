"use strict";
import ClientDataSet from './ClientDataSet';

class ClientCommandDataSet extends ClientDataSet {

    constructor(serviceName, dtoName, flagsName) {
        super(serviceName, dtoName, flagsName);
    }

    prepare(dto) {
        var self = this;
        self.startUpdate();
        let promise = this.clientDataSetService.prepare(dto);
        return promise.then((data)=> {
            this.applyPropertiesFromFlags(data.flags);
            super.applyDataFromDTO(data.responseObject);
            self.finishUpdate();
            return data.responseObject;
        });
    }

    execute(dto) {
        this.clearAllValidationStates();
        var errorsFound = this.validateRequiredFields();
        if (errorsFound) {
            return Promise.resolve("validation errors");
        }


        var self = this;
        self.startUpdate();
        let promise = this.clientDataSetService.execute(dto);
        return promise.then((data)=> {
            self.finishUpdate();
            return data.responseObject;
        }, (data)=> {
            this.validationInterpreter(data.asenException);
        });
    }
}

export default ClientCommandDataSet;
