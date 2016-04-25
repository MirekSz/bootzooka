"use strict";
import ServiceCommandAction from '../../../components/actions/serviceCommandAction/ServiceCommandAction';
import SocketDef from '../../../communication/SocketDef';
import ActionComponentDef from '../../../componentsDefinitions/ActionComponentDef';
import enums from '../../../enums/GlobalEnums';
import componentDefinitionRegistry from '../../../componentsDefinitions/ComponentDefinitionRegistry';
import componentsFactory from '../../../components/ComponentsFactory';
import Types from '../../../enums/ComponentsDefinitionsTypes';
import {wait, asyncWait, ita} from '../../TestingTools';
import ClientCommandDataSet from '../../../vedas/ClientCommandDataSet';
import dialogs from '../../../lib/rendering/Dialogs';

const COMMAND_ACTION_ID = 'pl.com.stream.verto.adm.plugin.asen-tools-client.WWWTestCommandAction';
const TWO_STANDARD_IN_SOCKETS = 2;
const ONE_STANDARD_OUT_SCOKET = 1;
const ONE_CUSTOMER_ID_SOCKET = 1;
const ID_CUSTOMER = 'idCustomer';
const SOME_VALUE = 'ALTKOM';
const CONST_VALUE = 'STREAM';
const BACKEND_RESPONSE_FOR_GET_SHORTCUT_NAME = 'STREAM';
const OUT_SOCKET_NAME = 'shortcutName';
const WHAT_NEXT_ACTIONS_COUNT = 2;
const RESULT_CUSTOMER_ID = 100000;

class ServiceCommandTest {

    run() {
        describe('Start ServiceCommandTest', ()=> {
            var actionDef;

            before(function (done) {
                var actionComponentDef = componentDefinitionRegistry.getActionById(COMMAND_ACTION_ID);
                actionComponentDef.then((data)=> {
                    actionDef = data;
                }).then(done, done);
            });

            ita('should create action with In and Out sockets', async() => {
                //when
                var commandAction = componentsFactory.createComponent(actionDef);

                //then
                expect(commandAction.getInputSocketList().length).to.be.eq(TWO_STANDARD_IN_SOCKETS + ONE_CUSTOMER_ID_SOCKET);
                expect(commandAction.getOutputSocketList().length).to.be.eq(ONE_STANDARD_OUT_SCOKET + ONE_CUSTOMER_ID_SOCKET);
            });
            it('should create action with service and panel', () => {
                //when
                var commandAction = componentsFactory.createComponent(actionDef);

                //then
                const windowContent = commandAction.getWindowContent();
                const serviceClass = commandAction.getServiceClass();

                expect(windowContent.panelFooter).to.not.be.undefined;
                expect(windowContent.panelHeader).to.not.be.undefined;
                expect(windowContent.tabs.length).to.be.greaterThan(0);

                expect(serviceClass).to.not.be.undefined;
            });

            it('should create action with window settings', () => {
                //when
                var commandAction = componentsFactory.createComponent(actionDef);

                //then
                const windowSettings = commandAction.getWindowSettings();

                expect(windowSettings.banerTitle).to.not.be.undefined;
                expect(windowSettings.editWindowSaveButtonName).to.not.be.undefined;
                expect(windowSettings.windowTitle).to.not.be.undefined;
            });
            describe('Status change tests...', () => {
                it("action should be default disabled", ()=> {
                    //when
                    var action = componentsFactory.createComponent(actionDef);

                    //then
                    expect(action.disabled).to.be.true;
                });
                it("action should be enabled when all required sockets have values", ()=> {
                    //given
                    var action = componentsFactory.createComponent(actionDef);

                    //when
                    action.getInputSocketByName(ID_CUSTOMER).send(SOME_VALUE);

                    //then
                    expect(action.disabled).to.be.false;
                });
                it("action should be disabled when one from required sockets don't have value", ()=> {
                    //given
                    var action = componentsFactory.createComponent(actionDef);
                    action.getInputSocketByName(ID_CUSTOMER).send(SOME_VALUE);

                    //when
                    action.getInputSocketByName(ID_CUSTOMER).send(undefined);

                    //then
                    expect(action.disabled).to.be.true;
                });
            });

            describe('Executions tests...', () => {
                ita('should create ClientCommandDataSet on initialize action', async() => {
                    //given
                    var commandAction = componentsFactory.createComponent(actionDef);

                    //when
                    await commandAction.initializer;
                    const dtoFromFields = commandAction.dataSet.createDTOFromFields();

                    //then
                    expect(dtoFromFields).to.include.keys('shortcutName', 'fullName');
                });
                ita('should initialize dto prepare action', async() => {
                    //given
                    var commandAction = componentsFactory.createComponent(actionDef);
                    await commandAction.initializer;

                    //when
                    await commandAction.prepare();
                    const dtoFromFields = commandAction.dataSet.createDTOFromFields();

                    //then
                    expect(dtoFromFields.fullName).to.be.eq('Streams spólka jawna');
                });
                ita('should init dto by const value', async() => {
                    //given
                    var commandAction = componentsFactory.createComponent(actionDef);
                    await commandAction.initializer;

                    //when
                    await commandAction.prepare();
                    const dtoFromFields = commandAction.dataSet.createDTOFromFields();

                    //then
                    expect(dtoFromFields.shortcutName).to.be.eq(CONST_VALUE);
                });
                ita('should init dto by socket value', async() => {
                    //given
                    var commandAction = componentsFactory.createComponent(actionDef);
                    commandAction.getInputSocketByName('idCustomer').send(SOME_VALUE);
                    await commandAction.initializer;

                    //when
                    await commandAction.prepare();
                    const dtoFromFields = commandAction.dataSet.createDTOFromFields();

                    //then
                    expect(dtoFromFields.fullName).to.be.eq(SOME_VALUE);
                });
                ita('should execute action', async() => {
                    //given
                    var commandAction = componentsFactory.createComponent(actionDef);
                    commandAction.getInputSocketByName('idCustomer').send(SOME_VALUE);
                    await commandAction.initializer;

                    //when
                    await commandAction.prepare();
                    let result = await commandAction.executeCommand();

                    //then
                    expect(result.resultDto.customerId).to.be.eq(RESULT_CUSTOMER_ID);
                });
                ita('should execute action and pass result to output socket', async() => {
                    //given
                    var commandAction = componentsFactory.createComponent(actionDef);
                    commandAction.getInputSocketByName('idCustomer').send(SOME_VALUE);
                    await commandAction.initializer;

                    //when
                    await commandAction.prepare();
                    await commandAction.executeCommand();

                    //then
                    const socket = commandAction.getOutputSocketByName(OUT_SOCKET_NAME);
                    expect(socket.getLastEvent()).to.be.eq(RESULT_CUSTOMER_ID);
                });
                ita('should execute action and get what next', async() => {
                    //given
                    var commandAction = componentsFactory.createComponent(actionDef);
                    commandAction.getInputSocketByName('idCustomer').send(SOME_VALUE);
                    await commandAction.initializer;

                    commandAction.dataSet.getFieldByName('shortcutName').setValue('shortcutName');
                    commandAction.dataSet.getFieldByName('fullName').setValue('GIVE WHAT NEXT');
                    //when
                    let result = await commandAction.executeCommand();

                    //then
                    expect(result.actions.length).to.be.eq(WHAT_NEXT_ACTIONS_COUNT);
                });
            });

        });
    }

}

export default ServiceCommandTest;
