//import ViewComponentDef from '../../componentsDefinitions/ViewComponentDef';
//import Assertions from '../../lib/Assertions';
import ActionComponentDef from '../../componentsDefinitions/ActionComponentDef';
import ComponentsFactory from '../../components/ComponentsFactory';
import SocketDef from '../../communication/SocketDef';
import Types from '../../enums/ComponentsDefinitionsTypes';
/**
 * Created by Mirek on 2015-06-06.
 */
class ComponentRenderingTest {

    run() {
        var expect = require('chai').expect;
        describe('Start action component  rendering tests', function () {
                const ACTION_ID = 'CustomerEditAction';
                const SOCKET_ID = 'ID_BEAN';
                const OLD_DATA = 'OLD_DATA';
                const SOME_DATA = 'Some socket data';

                var actionComponentDef = new ActionComponentDef(ACTION_ID, Types.ACTIONS.TEST_ACTION, 1, 31);
                actionComponentDef.addInputSocketDef(new SocketDef(SOCKET_ID, 'String'));

                var componentMap = new Map([[ACTION_ID, actionComponentDef]]);

                var action;

                it("should add input socket listeners after rendering", function () {
                    //given
                    var components = ComponentsFactory.createComponents(componentMap, []);

                    action = components.getComponent(actionComponentDef.id);

                    expect(action.getInputSocketByName(SOCKET_ID)).not.be.undefined;

                    //when
                    var socket = action.getInputSocketByName(SOCKET_ID);
                    var data = 'Some socket data';
                    socket.send(data);

                    //then
                    expect(socket.getLastEvent()).to.be.contains(data);
                });


                it("should dispose action listeners", function () {
                    //given
                    var components = ComponentsFactory.createComponents(componentMap, []);

                    var action = components.getComponent(actionComponentDef.id);

                    //when
                    action.dispose();

                    //then
                    var idBeanSocket = action.getInputSocketByName(SOCKET_ID);
                    expect(idBeanSocket.listeners.length).to.be.eq(0);
                });

                it("disposed action don't handle socket events", function () {
                    //given
                    var components = ComponentsFactory.createComponents(componentMap, []);

                    action = components.getComponent(actionComponentDef.id);
                    var socket = action.getInputSocketByName(SOCKET_ID);

                    socket.send(OLD_DATA);

                    expect(action.testValue).to.be.eq(OLD_DATA);

                    //dispose listeners
                    action.dispose();

                    //when
                    socket.send(SOME_DATA);

                    //then
                    expect(action.testValue).to.be.eq(OLD_DATA);
                });

                afterEach(function cleaning() {
                    action.dispose();
                });
            }
        );
    }
}

export default ComponentRenderingTest;
