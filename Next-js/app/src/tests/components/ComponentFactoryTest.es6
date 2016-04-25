/**
 * Created by bartosz on 20.05.15.
 *
 * Element Factory Test
 */
'use strict';

import SocketDef from '../../communication/SocketDef';
import ViewComponentDef from '../../componentsDefinitions/ViewComponentDef';
import ActionComponentDef from '../../componentsDefinitions/ActionComponentDef';
import ConnectionDef from '../../communication/ConnectionDef';
import ComponentFactory from '../../components/ComponentsFactory';
import Globals from '../../enums/GlobalEnums';

class ComponentFactoryTest {

    run() {

        describe('Start ElementFactoryTest..', function () {

            const ID_ACTION = 'EditCustomer';
            const ID_VIEW = 'CustomerView';
            const SOCKET_TYPE = 'IdCustomer';
            const SOCKET_REPEATER_ID = "repeaterId";

            let repeaterSocketDef = new SocketDef(SOCKET_REPEATER_ID, SOCKET_TYPE);


            describe('Create the view definition element...', function () {
                let viewDef = new ViewComponentDef(ID_VIEW);

                it('has been created ?', function () {
                    expect(viewDef.id).to.be.equal(ID_VIEW);
                });

                describe('add the new socket to the view definition...', function () {
                    let selectRowSocket = new SocketDef(Globals.ID_BEAN, SOCKET_TYPE);
                    viewDef.addOutputSocketDef(selectRowSocket);
                    viewDef.addRepeaterSocketDef(repeaterSocketDef);

                    it('has been added ?', function () {
                        expect(viewDef.getOutputSocketDefByName(Globals.ID_BEAN).name).to.be.equal(selectRowSocket.name);
                    });


                    describe('create the new action...', function () {
                        let actionDef = new ActionComponentDef(ID_ACTION);

                        it('has been created ? ', function () {
                            expect(actionDef.id).to.be.equal(ID_ACTION);
                        });


                        describe('add the new socket to the view...', function () {
                            let beanSocket = new SocketDef(Globals.ID_BEAN, 'IdCustomer');
                            actionDef.addInputSocketDef(beanSocket);

                            it('has been added ?', function () {
                                expect(actionDef.getInputSocketDefByName(Globals.ID_BEAN).name).to.be.equal(beanSocket.name);
                            });

                            describe('create the connection between view and action, and then put it to the connectionDefList...', function () {
                                let connectionDefList = [];

                                let connectionDef = new ConnectionDef(viewDef.id, Globals.ID_BEAN, actionDef.id, Globals.ID_BEAN);
                                let connectionDefWithRepeated = new ConnectionDef(viewDef.id, SOCKET_REPEATER_ID, actionDef.id, Globals.ID_BEAN);

                                connectionDefList.push(connectionDef);
                                connectionDefList.push(connectionDefWithRepeated);

                                it('has been created ? ', function () {
                                    expect(connectionDef.getInputSocketName()).to.be.equal(Globals.ID_BEAN);
                                });

                                describe('create objects from definition.', function () {
                                    let elementDefMap = new Map();

                                    elementDefMap.set(viewDef.id, viewDef);
                                    elementDefMap.set(actionDef.id, actionDef);
                                    let components = ComponentFactory.createComponents(elementDefMap, connectionDefList);

                                    let view = components.getComponent(viewDef.id);

                                    it('portal describe object validation', function () {
                                        expect(view.def).to.be.equal(viewDef);
                                    });

                                    it('Input -> Output communication test', function () {
                                        let viewSocket = view.getOutputSocketByName(Globals.ID_BEAN);

                                        let action = components.getComponent(actionDef.id);

                                        let actionSocket = action.getInputSocketByName(Globals.ID_BEAN);

                                        let message = 'Hey dude..';

                                        viewSocket.send(message);

                                        let lastEvent = actionSocket.getLastEvent();

                                        expect(lastEvent).to.be.equal(message);
                                    });

                                    it('Repeater communication test', function () {
                                        let inRepeaterSocket = view.getInputSocketByName(SOCKET_REPEATER_ID);

                                        let action = components.getComponent(actionDef.id);

                                        let actionSocket = action.getInputSocketByName(Globals.ID_BEAN);

                                        let message = 'Hey from repeater..';

                                        inRepeaterSocket.send(message);

                                        let lastEvent = actionSocket.getLastEvent();

                                        expect(lastEvent).to.be.equal(message);
                                    });

                                });

                            });

                        });

                    });

                });

            });
        });

    }

}

export default ComponentFactoryTest;

