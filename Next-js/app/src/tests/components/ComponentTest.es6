/**
 * Created by bartosz on 20.05.15.
 *
 * Element Factory Test
 */
'use strict';

import SocketDef from '../../communication/SocketDef';
import ActionComponentDef from '../../componentsDefinitions/ActionComponentDef';
import ServiceMethodInvokerAction from '../../components/actions/serviceMethodInvoker/ServiceMethodInvokerAction';

class ComponentTest {

    run() {
        describe('Components test', function () {

            let expect = require('chai').expect;

            describe('create component def with two sockets', function () {
                let showActionDef = new ActionComponentDef('ShowAction');
                showActionDef.addInputSocketDef(new SocketDef('ID_SELLER', 'IdCustomer'));
                showActionDef.addInputSocketDef(new SocketDef('ID_BUYER', 'IdCustomer'));
                showActionDef.addOutputSocketDef(new SocketDef('ID_BUYER', 'IdCustomer'));
                it("component initialization create sockets", function () {
                    var component = new ServiceMethodInvokerAction(showActionDef);
                    component.initialize();

                    expect(component.getInputSocketList().length).to.be.eq(2);
                    expect(component.getOutputSocketList().length).to.be.eq(1);
                });
            });
        });
    }
}

export default ComponentTest;