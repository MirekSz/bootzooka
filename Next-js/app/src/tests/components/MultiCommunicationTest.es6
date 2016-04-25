/**
 * Created by bartosz on 20.05.15.
 *
 * Element Factory Test Class
 */
import SocketDef from '../../communication/SocketDef';
import ViewComponentDef from '../../componentsDefinitions/ViewComponentDef';
import ActionComponentDef from '../../componentsDefinitions/ActionComponentDef';
import ConnectionDef from '../../communication/ConnectionDef';
import ComponentFactory from '../../components/ComponentsFactory';
import Globals from '../../enums/GlobalEnums';

class MultiCommunicationTest {

    run() {
        describe('Components factory test', function () {

            const SHOW_ACTION = 'ShowCustomer';
            const EDIT_ACTION = 'EditCustomer';
            const ID_VIEW = 'CustomerView';
            const SOCKET_TYPE = 'IdCustomer';

            let expect = require('chai').expect;

            describe('Create view with two actions', function () {
                let viewDef = new ViewComponentDef(ID_VIEW);
                let selectRowSocket = new SocketDef(Globals.ID_BEAN, SOCKET_TYPE);
                viewDef.addOutputSocketDef(selectRowSocket);


                let showActionDef = new ActionComponentDef(SHOW_ACTION);
                showActionDef.addInputSocketDef(new SocketDef(Globals.ID_BEAN, SOCKET_TYPE));

                let editActionDef = new ActionComponentDef(EDIT_ACTION);
                editActionDef.addInputSocketDef(new SocketDef(Globals.ID_BEAN, SOCKET_TYPE));


                describe('create socket connections', function () {
                    let connectionDefList = [];

                    let viewToShow = new ConnectionDef(viewDef.id, Globals.ID_BEAN, showActionDef.id, Globals.ID_BEAN);
                    let viewToEdit = new ConnectionDef(viewDef.id, Globals.ID_BEAN, editActionDef.id, Globals.ID_BEAN);

                    connectionDefList.push(viewToShow, viewToEdit);

                    describe('create objects from definition.', function () {
                        let elementDefMap = new Map([[viewDef.id, viewDef], [showActionDef.id, showActionDef],
                            [editActionDef.id, editActionDef]]);

                        let components = ComponentFactory.createComponents(elementDefMap, connectionDefList);

                        let view = components.getComponent(viewDef.id);

                        it('should send data from view to 2 actions', function () {
                            let viewSocket = view.getOutputSocketByName(Globals.ID_BEAN);

                            let showAction = components.getComponent(showActionDef.id);
                            let editAction = components.getComponent(editActionDef.id);

                            let showActionSocket = showAction.getInputSocketByName(Globals.ID_BEAN);
                            let editActionSocket = editAction.getInputSocketByName(Globals.ID_BEAN);

                            let message = 'Hey dude..';

                            viewSocket.send(message);

                            expect(showActionSocket.getLastEvent()).to.be.equal(message);
                            expect(editActionSocket.getLastEvent()).to.be.equal(message);
                        });

                    });

                });

            });
        });
    }
}

export default MultiCommunicationTest;

