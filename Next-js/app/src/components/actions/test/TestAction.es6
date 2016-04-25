/**
 * Created by bartosz on 21.05.15.
 *
 * SelectRowActionComponent class
 */

import BaseAction from '../BaseAction';
import _each from 'lodash/collection/each';
import actionTemplate from './action.hbs';
import TestActionView from './TestActionView';

class TestAction extends BaseAction {

    constructor(element) {
        super(element);
    }


    addUIListenersImpl(uIListenerBinder) {
        uIListenerBinder.addClick('a.click', this.sendDataThroughAllSockets);
        uIListenerBinder.addClick('button.refresh', this.refresh);
    }

    addSocketListenersImpl(socketListenerBinder) {
        _each(this.inputSocketDefList, (socketDef)=> {
            socketListenerBinder.add(socketDef.name, (val, def)=> {
                //console.log($(this.target).find('a').text() + ' recived: ' + val);
                //$(this.target).find('textarea').text(val);
                this.testValue = val;
            });
        });
    }

    //addSocketListenersImpl(socketListenerBinder) {
    //    _each(this.getRequiredInputSockets(), socket => {
    //        socketListenerBinder.add(socket.name, (value, def)=> {
    //            this.setStatus();
    //        });
    //    });
    //}

    sendDataThroughAllSockets() {
        _each(this.outputSocketDefList, (socketDef)=> {
            this.getOutputSocketByName(socketDef.name).send('Hello from ' + this.id.substr(this.id.lastIndexOf('.') + 1));
        });
    }

    renderToImpl(target) {
        target.html(actionTemplate(this));
    }

    call() {
        alert('ads');
    }

    refresh() {
        this.reRender();
    }

}

export default TestAction;
