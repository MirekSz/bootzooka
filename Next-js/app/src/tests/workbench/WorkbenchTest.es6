/**
 * Created by bstanislawski on 2015-12-01.
 */
import componentDefinitionRegistry from '../../componentsDefinitions/ComponentDefinitionRegistry';
import componentsFactory from '../../components/ComponentsFactory';
import workbench from '../../workbench/Workbench';
import ServiceMethodInvoker from '../../components/actions/serviceMethodInvokerAction/ServiceMethodInvoker';
import WindowManager from './../../sidow/windowManager/WindowManager';
import TabWindowManager from './../../sidow/windowManager/tabWindowManager/TabWindowManager';
import Window from '../../sidow/window/windows/FormWindow';
const IN_RUN_ACTION_SOCKET = 'inRunActionSocket';
const actionResponse = {
    actionId: 'pl.com.stream.verto.fix.plugin.fixed-asset-client.FixedAssetReceivingDocumentShowAction',
    socketValueList: [
        {
            socketId: 'inRunActionSocket',
            "value": [
                'java.lang.Long',
                1
            ]
        }
    ]
};

global.actionExecuted = false;

ServiceMethodInvoker.execute = function () {
    this.disabled = false;

    return global.actionExecuted = true;
};

function createWindowManager(sandbox) {
    let windowManager = new WindowManager("#windows");
    windowManager.init();
    sandbox.stub(windowManager.historyController, 'buildHistory');
    sandbox.stub(windowManager.historyController, 'removeFromHistory');
    return windowManager;
}

class WorkbenchTest {

    run() {
        describe('Workbench execute "what next" method test.. ', () => {
            var sandbox;

            beforeEach(function () {
                $(document.body).append("<div id='windows'></div>");
                sandbox = sinon.sandbox.create();
            });

            afterEach(function () {
                sandbox.restore();
                $("#windows").empty();
            });
            var expectedSocketValue = ['java.lang.Long', 1];

            it('Socket value should be set', (done) => {
                var promise = componentDefinitionRegistry.getActionById(actionResponse.actionId).then(actionDef => {
                    var action = componentsFactory.createComponent(actionDef);
                    var socket = action.getInputSocketByName(IN_RUN_ACTION_SOCKET);

                    workbench.setValueOnActionSocket(action, actionResponse.socketValueList[0]);

                    expect(socket.getLastEvent()[0]).to.be.eq(expectedSocketValue[0]);
                    expect(socket.getLastEvent()[1]).to.be.eq(expectedSocketValue[1]);
                }).then(done, done);

                expect(promise).to.not.be.eq(undefined);
            });
            it('should set current TabWindowManager after TabWindowManager show usage', () => {
                //given
                const windowManager = new TabWindowManager('some');
                windowManager.init();

                //when
                windowManager.show(new Window('id'));

                //then
                expect(workbench.currentTabManager).to.not.be.undefined;

            });
            it('should set current WindowManager after WindowManager show usage', () => {
                //given
                const windowManager = createWindowManager(sandbox);

                //when
                windowManager.show(new Window('id'));

                //then
                expect(workbench.currentWindowManager).to.not.be.undefined;
            });
        });
    }

}

export default WorkbenchTest;

