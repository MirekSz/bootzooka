/**
 * Created by bstanislawski on 2015-11-17.
 */
import BaseAction from '../BaseAction';
import ServiceMethodInvokerView from './ServiceMethodInvokerView';

import _each from 'lodash/collection/each';
import dialogs from '../../../lib/rendering/Dialogs';
import enums from '../../../enums/GlobalEnums';

/**
 * @alias ServiceMethodInvokerActionExt
 * @property {string} resultToOutSocketId
 * @property {Array<{sourceType:string,constValue:object}>} params
 * @property {object} logicalLocksConfiguration
 */

class ServiceMethodInvoker extends BaseAction {

    constructor(element) {
        super(element);

        this.view = new ServiceMethodInvokerView();

        if (this.def.actionExtension) {
            this.setLogicalLocksConfiguration();
        }

        this.disabled = true;

        /**
         * @type {ServiceMethodInvokerActionExt}
         */
        this.def.actionExtension = this.def.actionExtension;
    }

    executeImpl(options) {
        var actionExtension = this.def.actionExtension;
        var isShowQuestion = actionExtension.showQuestion;
        if (isShowQuestion && !this.getDisableQuestionBeforeAction()) {
            let callback = ()=> {
                this.executeAction();
            };
            dialogs.showConfirmation(actionExtension.question, {callback});
        } else {
            this.executeAction();
        }
    }

    executeAction() {
        var actionExtension = this.def.actionExtension;
        var paramList = this.getParamsValue(actionExtension, this);

        let actionPromise = this.executeCommand(actionExtension, paramList);

        return actionPromise.then(response => {
            var responseObject = response;
            if (responseObject) {
                let responseClass = responseObject['@class'];
                if (responseClass === enums.SHOW_ACTION.WHAT_NEXT_CLASS) {
                    this.executeNextActions(responseObject.actions);
                } else {
                    this.setMethodInvokerResultToOutputSocket(this.def.actionExtension.resultToOutSocketId, responseObject);
                }
            }
            return responseObject;
        });
    }

    getParamsValue(actionExtension, self) {
        var paramsList = [];

        _each(actionExtension.params, param => {
            var value = getParamValue(param, self);
            paramsList.push(value);
        });

        return paramsList;
    }

    setLogicalLocksConfiguration() {
        var conf = this.getLogicalLocksConfiguration();

        if (conf) {
            this.logicalLockInfo.dtoClassName = conf.dtoClassName;
            this.logicalLockInfo.id = conf.methodParamNumberWithId;
            this.logicalLockInfo.requestTypeEnum = conf.requestTypeEnum;
        }
    }

    /**
     * @private
     */
    getLogicalLocksConfiguration() {
        var locksConf = this.def.actionExtension.logicalLocksConfiguration;

        if (locksConf) {
            this.logicalLockInfo = {};

            return locksConf;
        }
    }

}

function getParamValue(param, component) {
    var sourceType = param.sourceType;

    if (sourceType === enums.SOURCE_TYPES.CONST_VALUE) {
        return param.constValue;
    } else if (sourceType === enums.SOURCE_TYPES.SOCKET) {
        let socket = component.getInputSocketByName(param.socketId);
        let value = socket.getLastEvent();
        let type = getTypeByConverter(param.objectConverterId);

        return [type, value];
    }
}

function getTypeByConverter(converter) {
    var converterTypeArray = converter.split('.');
    var converterType = converterTypeArray[converterTypeArray.length - 1];

    if (converterType === enums.CONVERTERS.ID_LONG_CONVERTER) {
        return enums.JAVA_TYPES.LONG;
    }
    throw new Error('Illegal state exception');
}

export default ServiceMethodInvoker;
