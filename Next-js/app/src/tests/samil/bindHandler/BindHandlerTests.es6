'use strict';

import * as bh from '../../../samil/bindHandler/BindHandler';
import BindingComponentListener from '../../../samil/bindHandler/BindingComponentListener';
import BindingFieldListener from '../../../samil/bindHandler/BindingFieldListener';
import InputGUIComponent from '../../../samil/GUIComponentFactory/InputGUIComponent/InputGUIComponent';
import Field from '../../../vedas/dataSource/Field';
import ComponentEventType from '../../../samil/bindHandler/ComponentEventType';
import FieldEventType from '../../../samil/bindHandler/FieldEventType';
function createInputGUIComponent() {
    var inputGUIComponent = new InputGUIComponent({});
    inputGUIComponent.reRender = ()=> {
    };
    return inputGUIComponent;
}
class BindHandlerTests {

    run() {
        describe('Start BindHandlerTests', function () {
            it('should rebind field', () => {
                var inputGUIComponent = createInputGUIComponent();
                var field = new Field({});
                var fieldToRebind = new Field({});
                inputGUIComponent.bindWithField(field);
                var value = 'val';
                inputGUIComponent.setValue(value);

                //when
                inputGUIComponent.bindWithField(fieldToRebind);
                var anotherVal = 'anotherVal';
                inputGUIComponent.setValue(anotherVal);

                //then
                expect(field.getValue()).to.be.eq(value);
                expect(fieldToRebind.getValue()).to.be.eq(anotherVal);
                expect(fieldToRebind.getValue()).to.be.eq(inputGUIComponent.getValue());

            });

            it('should dispose bindhandler and remove connection from component', () => {
                var inputGUIComponent = createInputGUIComponent();
                var bindHandler = inputGUIComponent.getBindHandler();
                var field = new Field({});
                inputGUIComponent.bindWithField(field);

                //when
                bindHandler.dispose();
                var componentValue = 'componentValue';
                inputGUIComponent.setValue(componentValue);

                //then
                expect(inputGUIComponent.getValue()).to.be.eq(componentValue);
                expect(field.getValue()).to.be.undefined;
            });

            it('should dispose bindhandler and remove connection from field', () => {
                var inputGUIComponent = createInputGUIComponent();
                var bindHandler = inputGUIComponent.getBindHandler();
                var field = new Field({});
                inputGUIComponent.bindWithField(field);

                //when
                bindHandler.dispose();
                var fieldValue = 'fieldValue';
                field.setValue(fieldValue);

                //then
                expect(field.getValue()).to.be.eq(fieldValue);
                expect(inputGUIComponent.getValue()).to.be.undefined;
                expect(bindHandler.getLastFieldEvent()).to.be.undefined;
            });

            it('should propagate all data from field to component ', () => {
                var inputGUIComponent = createInputGUIComponent();
                var field = new Field({});
                inputGUIComponent.bindWithField(field);

                //when
                field.setValue('janek');
                field.setEditable(false);
                field.setRequired(true);
                field.setVisible(true);
                field.setMaxValue(100);
                field.setMinValue(50);
                field.setPrecision(2);

                //then
                expect(inputGUIComponent.getValue()).to.be.eq(field.getValue());
                expect(inputGUIComponent.attrs.editable).to.be.eq(false);
                expect(inputGUIComponent.attrs.required).to.be.eq(true);
                expect(inputGUIComponent.attrs.visible).to.be.eq(true);
                expect(inputGUIComponent.attrs.maxValue).to.be.eq(100);
                expect(inputGUIComponent.attrs.minValue).to.be.eq(50);
                expect(inputGUIComponent.attrs.precision).to.be.eq(2);
            });
            describe('Start events tests', function () {
                describe('valueChangeEvent', function () {
                    it('should inform listeners about component data change', () => {
                        //given
                        var dataVar, sourceVar;
                        var bindingHandler = new bh.BindHandler({});
                        var componentListener = new BindingComponentListener();
                        componentListener.setListener(ComponentEventType.VALUE_CHANGE, (data, source)=> {
                            dataVar = data;
                            sourceVar = source;
                        });
                        bindingHandler.addBindingComponentListener(componentListener);

                        //when
                        var value = 12;
                        var source = {};
                        bindingHandler.componentEventListener({
                            value,
                            source,
                            eventType: ComponentEventType.VALUE_CHANGE
                        });

                        //then
                        expect(dataVar).to.be.eq(value);
                        expect(sourceVar).to.be.eq(source);

                    });
                    it('should inform listeners about field data change', () => {
                        //given
                        var dataVar, sourceVar;
                        var bindingHandler = new bh.BindHandler();
                        var listener = new BindingFieldListener();
                        listener.setListener(FieldEventType.VALUE_CHANGE, (data, source)=> {
                            dataVar = data;
                            sourceVar = source;
                        });
                        bindingHandler.addBindingFieldListener(listener);

                        //when
                        var value = 12;
                        var source = {};
                        bindingHandler.fieldEventListener({value, source, eventType: FieldEventType.VALUE_CHANGE});

                        //then
                        expect(dataVar).to.be.eq(value);
                        expect(sourceVar).to.be.eq(source);
                    });
                    it('should invoke setValue in component after data change in field', () => {
                        var inputGUIComponent = createInputGUIComponent();
                        var field = new Field({});
                        inputGUIComponent.bindWithField(field);

                        //when
                        var value = 'val';
                        field.setValue(value);

                        //then
                        expect(inputGUIComponent.getValue()).to.be.eq(field.getValue());
                    });
                    it('should invoke setValue in field after data change in component', () => {
                        var inputGUIComponent = createInputGUIComponent();
                        var field = new Field({});
                        inputGUIComponent.bindWithField(field);

                        //when
                        var value = 'val';
                        inputGUIComponent.setValue(value);

                        //then
                        expect(field.getValue()).to.be.eq(inputGUIComponent.getValue());
                    });
                    it('should invoke setValue in two components after data change in field', () => {
                        var field = new Field({});

                        var inputGUIComponent = createInputGUIComponent();
                        inputGUIComponent.bindWithField(field);

                        var inputGUIComponent2 = createInputGUIComponent();
                        inputGUIComponent2.bindWithField(field);

                        //when
                        var value = 'val';
                        field.setValue(value);

                        //then
                        expect(field.getValue()).to.be.eq(value);
                        expect(inputGUIComponent.getValue()).to.be.eq(field.getValue());
                        expect(inputGUIComponent2.getValue()).to.be.eq(field.getValue());
                    });
                    it('should invoke setValue with all components connected with the same field', () => {
                        var field = new Field({});

                        var inputGUIComponent = createInputGUIComponent();
                        inputGUIComponent.bindWithField(field);

                        var inputGUIComponent2 = createInputGUIComponent();
                        inputGUIComponent2.bindWithField(field);

                        //when
                        var value = 'val';
                        inputGUIComponent.setValue(value);

                        //then
                        expect(field.getValue()).to.be.eq(value);
                        expect(inputGUIComponent.getValue()).to.be.eq(field.getValue());
                        expect(inputGUIComponent2.getValue()).to.be.eq(field.getValue());
                    });
                });
                describe('valueModified', function () {
                    it('should inform field that value is modified', () => {
                        var field = new Field({});

                        var inputGUIComponent = createInputGUIComponent();
                        inputGUIComponent.bindWithField(field);


                        //when
                        inputGUIComponent.bindHandlerApi.valueModified();

                        //then
                        expect(field.isValueModified()).to.be.true;
                    });
                    it('after value commit modified value is clear', () => {
                        var field = new Field({});

                        var inputGUIComponent = createInputGUIComponent();
                        inputGUIComponent.bindWithField(field);


                        //when
                        inputGUIComponent.bindHandlerApi.valueModified();
                        var value = 'val';
                        inputGUIComponent.setValue(value);

                        //then
                        expect(inputGUIComponent.getValue()).to.be.eq(value);
                        expect(inputGUIComponent.getValue()).to.be.eq(field.getValue());
                        expect(field.isValueModified()).to.be.false;
                    });
                    it('should inform listeners about field is modified', () => {
                        var field = new Field({});

                        var inputGUIComponent = createInputGUIComponent();
                        inputGUIComponent.bindWithField(field);

                        var bindHandler = inputGUIComponent.getBindHandler();
                        var bindingFieldListener = new BindingFieldListener();
                        var listenerCall = false;
                        bindingFieldListener.setListener(FieldEventType.VALUE_MODIFIED, ()=> {
                            listenerCall = true;
                        });
                        bindHandler.addBindingFieldListener(bindingFieldListener);


                        //when
                        inputGUIComponent.bindHandlerApi.valueModified();

                        //then
                        expect(field.isValueModified()).to.be.true;
                        expect(listenerCall).to.be.true;
                    });
                });
                describe('notifyActivation, notifyDeactivation', function () {
                    it('should inform field that component is activated', () => {
                        var field = new Field({});

                        var inputGUIComponent = createInputGUIComponent();
                        inputGUIComponent.bindWithField(field);

                        //when
                        inputGUIComponent.setActive();

                        //then
                        expect(field.isActive()).to.be.true;
                    });

                    it('should inform field that component is deactivated', () => {
                        var field = new Field({});

                        var inputGUIComponent = createInputGUIComponent();
                        inputGUIComponent.bindWithField(field);

                        //when
                        inputGUIComponent.setActive();
                        inputGUIComponent.setDeactive();

                        //then
                        expect(field.isActive()).to.be.false;

                    });

                    it('should propagate info from component to field listeners', () => {
                        var field = new Field({});

                        var inputGUIComponent = createInputGUIComponent();
                        inputGUIComponent.bindWithField(field);
                        var bindHandler = inputGUIComponent.getBindHandler();

                        var bindingFieldListener = new BindingFieldListener();
                        var activationHistor = [];
                        bindingFieldListener.setListener(FieldEventType.ACTIVATION, (value)=> {
                            activationHistor.push(value);
                        });
                        bindHandler.addBindingFieldListener(bindingFieldListener);

                        //when
                        inputGUIComponent.setActive();
                        inputGUIComponent.setDeactive();

                        //then
                        expect(activationHistor).to.have.length(2);
                        expect(activationHistor[0]).to.be.true;
                        expect(activationHistor[1]).to.be.false;
                    });
                });
            });
        });
    }
}
export default BindHandlerTests;

