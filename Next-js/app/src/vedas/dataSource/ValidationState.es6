"use strict";
/**
 * Created by Mirek on 2016-02-29.
 */
/**
 * @readonly
 * @enum {String}
 */
export var VALIDATION_TYPE = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    VALIDATION_WARNING: 'VALIDATION_WARNING'
};


export class ValidationState {
    constructor(id, type, msg) {
        this.id = id;
        this.type = type;
        this.valdationMsg = msg;
    }

    isValid() {
        return (this.valdationMsg === undefined);
    }

    getMsg() {
        return this.valdationMsg;
    }

    getType() {
        return this.type;
    }

    getId() {
        return this.id;
    }

}

export var EMPTY_VALIDATION_STATE = new ValidationState();