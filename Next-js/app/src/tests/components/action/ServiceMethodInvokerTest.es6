/**
 * Created by bstanislawski on 2015-11-26.
 */
'use strict';

import dialogs from '../../../lib/rendering/Dialogs';
import componentDefinitionRegistry from '../../../componentsDefinitions/ComponentDefinitionRegistry';
import componentsFactory from '../../../components/ComponentsFactory';
import {wait, asyncWait, ita} from '../../TestingTools';
import workbench from '../../../workbench/Workbench';

const ACTION_ID = 'pl.com.stream.verto.adm.plugin.asen-tools-client.WWWTestServiceGetShortcutNameMethodAction';
const ACTION_ID_WITH_QUESTION = 'pl.com.stream.verto.adm.plugin.asen-tools-client.WWWTestServiceGetWhatNextMethodAction';
const TWO_STANDARD_IN_SOCKETS = 2;
const ONE_STANDARD_OUT_SCOKET = 1;
const ONE_CUSTOMER_ID_SOCKET = 1;
const ID_CUSTOMER = 'idCustomer';
const SOME_VALUE = 1;
const BACKEND_RESPONSE_FOR_GET_SHORTCUT_NAME = 'STREAM';
const OUT_SOCKET_NAME = 'shortcutName';
const WHAT_NEXT_ACTIONS_COUNT = 2;

class ServiceMethodInvokerTest {

    run() {

        describe('ServiceMethodInvoker test', () => {
            var actionDef;
            var actionDefWithQuestion;

            before(function (done) {
                var actionById = componentDefinitionRegistry.getActionById(ACTION_ID);
                var actionByIdWithQqestion = componentDefinitionRegistry.getActionById(ACTION_ID_WITH_QUESTION);
                Promise.all([actionById, actionByIdWithQqestion]).then((data)=> {
                    actionDef = data.shift();
                    actionDefWithQuestion = data.shift();
                }).then(done, done);

            });

            it("should create action from backend def", ()=> {
                //when
                var action = componentsFactory.createComponent(actionDef);

                //then
                expect(action.getInputSocketList().length).to.be.eq(TWO_STANDARD_IN_SOCKETS + ONE_CUSTOMER_ID_SOCKET);
                expect(action.getOutputSocketList().length).to.be.eq(ONE_STANDARD_OUT_SCOKET + ONE_STANDARD_OUT_SCOKET);
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

            describe('Questions tests...', () => {
                var sandbox;
                beforeEach(() => {
                    sandbox = sinon.sandbox.create();
                });

                afterEach(() => {
                    sandbox.restore();
                });

                it("should show question before execution", ()=> {
                    //given
                    var showConfirmation = sandbox.stub(dialogs, "showConfirmation");
                    var action = componentsFactory.createComponent(actionDefWithQuestion);
                    action.getInputSocketByName(ID_CUSTOMER).send(SOME_VALUE);

                    //when
                    action.execute();

                    //then
                    expect(showConfirmation).to.be.calledOnce;
                });

                it("should not show question before execution when disable it via socket", ()=> {
                    //given
                    var showConfirmation = sandbox.stub(dialogs, "showConfirmation");
                    var action = componentsFactory.createComponent(actionDefWithQuestion);
                    action.getInputSocketByName(ID_CUSTOMER).send(SOME_VALUE);

                    //when
                    action.setDisableQuestionBeforeAction();
                    action.execute();

                    //then
                    expect(showConfirmation).to.be.not.called;
                });

                it("should not show question before execution when action don't support it", ()=> {
                    //given
                    var showConfirmation = sandbox.stub(dialogs, "showConfirmation");
                    var action = componentsFactory.createComponent(actionDef);
                    action.getInputSocketByName(ID_CUSTOMER).send(SOME_VALUE);

                    //when
                    action.execute();

                    //then
                    expect(showConfirmation).to.be.not.called;
                });
            });

            describe('Executions tests...', () => {
                ita("should execute action", async()=> {
                    //given
                    var action = componentsFactory.createComponent(actionDef);
                    action.getInputSocketByName(ID_CUSTOMER).send(SOME_VALUE);

                    //when
                    let executeAction = await action.executeAction();

                    //then
                    expect(executeAction).to.be.eq(`${BACKEND_RESPONSE_FOR_GET_SHORTCUT_NAME}_${SOME_VALUE}`);
                });

                ita('should pass result to the output socket', async() => {
                    //given
                    var action = componentsFactory.createComponent(actionDef);
                    action.getInputSocketByName(ID_CUSTOMER).send(SOME_VALUE);

                    //when
                    await action.executeAction();
                    let socket = action.getOutputSocketByName(OUT_SOCKET_NAME);

                    //then
                    expect(socket.getLastEvent()).to.be.eq(`${BACKEND_RESPONSE_FOR_GET_SHORTCUT_NAME}_${SOME_VALUE}`);
                    expect(action.getOutputSocketByName('outRunActionSocket').getLastEvent()).to.be.undefined;
                });
            });

            describe('Whats Next tests...', () => {
                var sandbox;
                beforeEach(() => {
                    sandbox = sinon.sandbox.create();
                });

                afterEach(() => {
                    sandbox.restore();
                });

                ita("should execute action and return WhatNext", async()=> {
                    //given
                    var action = componentsFactory.createComponent(actionDefWithQuestion);
                    action.getInputSocketByName(ID_CUSTOMER).send(SOME_VALUE);
                    let executeAction = sandbox.stub(workbench, 'executeAction');

                    //when
                    let whatNext = await action.executeAction();

                    //then
                    expect(whatNext.actions.length).to.be.eq(WHAT_NEXT_ACTIONS_COUNT);
                    expect(executeAction).to.be.calledTwice;
                });

            });
            describe('LogicalLocks tests...', () => {
                it("should read config", ()=> {
                    //given
                    var action = componentsFactory.createComponent(actionDef);
                    action.getInputSocketByName(ID_CUSTOMER).send(SOME_VALUE);

                    //when
                    const locksConfiguration = action.getLogicalLocksConfiguration();

                    //then
                    console.log('locksConfiguration: ');
                    console.log(locksConfiguration);
                    expect(locksConfiguration.dtoClassName).to.be.eq('pl.com.stream.verto.cmm.customer.server.pub.main.CustomerDto');
                    expect(locksConfiguration.requestTypeEnum).to.be.eq('FOR_EDIT');
                });

                it("should add logical lock before command execution", ()=> {
                });
                it("should remove logical lock after command execution", ()=> {
                });
            });
        });
    }
}

export default ServiceMethodInvokerTest;
