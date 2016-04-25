/**
 * Created by bstanislawski on 2015-11-27.
 */

import BaseComponent from '../BaseComponent';
import _each from 'lodash/collection/each';
import serverConnector from '../../lib/ServerConnector';
import * as mixin  from '../../lib/Mixins';
import workbench from '../../workbench/Workbench';
import enums from '../../enums/GlobalEnums';

//ObservableMixin
class BaseAction extends BaseComponent {

    constructor(element) {
        super(element);

        this.disabled = true;
        this.listeners = new Set();
        this.inOptionId = this.id;
    }

    execute() {
        if (!this.disabled) {
            this.executeImpl();
        }
    }

    executeImpl() {
        console.log(`action executed ${this.def.id}`);
    }

    addSocketListeners(socketListenerBinder) {
        super.addSocketListeners(socketListenerBinder);
        this.addSocketListenersImpl(socketListenerBinder);

        _each(this.getRequiredInputSockets(), socket => {
            socketListenerBinder.add(socket.name, (value, def)=> {
                this.setStatus();
            });
        });
        this.setStatus();
    }

    setStatus() {
        var isSomeEmptySocket = false;

        _each(this.getRequiredInputSockets(), socket => {
            if (!socket.getLastEvent()) {
                isSomeEmptySocket = true;
            }
        });

        if (isSomeEmptySocket) {
            this.setDisable();
        } else {
            this.setEnable();
        }
    }

    setEnable() {
        if (this.disabled) {
            this.disabled = false;
            this.fireListeners(false);
        }
    }

    setDisable() {
        if (!this.disabled) {
            this.disabled = true;
            this.fireListeners(true);
        }
    }

    executeCommand(actionExtension, paramList) {
        return serverConnector.executeCommand({
            methodName: actionExtension.serviceMethodName,
            serverServiceInterface: actionExtension.serviceName,
            parametersList: paramList
        });
    }

    setMethodInvokerResultToOutputSocket(socketName, responseObject) {
        if (socketName) {
            this.getOutputSocketByName(socketName).send(responseObject);
        }
    }

    executeNextActions(actions) {
        _each(actions, action => {
            workbench.executeAction(action.actionId, action.socketValueList);
        });
    }

    setDisableQuestionBeforeAction() {
        var disableActionSocket = this.getInputSocketByName(enums.SOCKETS.DISABLE_QUESTION);

        if (disableActionSocket) {
            disableActionSocket.send(true);
        }
    }

    getDisableQuestionBeforeAction() {
        var disableActionSocket = this.getInputSocketByName(enums.SOCKETS.DISABLE_QUESTION);

        if (disableActionSocket) {
            return disableActionSocket.getLastEvent();
        }
        return false;
    }
}

mixin.applyMixin(mixin.ObservableMixin, BaseAction);
export default BaseAction;
