// jshint ignore: start
"use strict";
/**
 * Created by Mirek on 2016-01-22.
 */
import DataSet from '../../vedas/dataSource/DataSet';
import ClientDataSet from '../../vedas/ClientDataSet';
import Field from '../../vedas/dataSource/Field';
import {VALIDATION_TYPE} from '../../vedas/dataSource/ValidationState';
import InputGUIComponent from '../../samil/GUIComponentFactory/InputGUIComponent/InputGUIComponent';
import {wait, asyncWait,ita} from '../TestingTools';

var dataSetServerDef = {
    "name": "customer", fieldDefMap: {
        "fullName": {
            "name": "fullName",
            "type": "STRING",
            "domainName": "LongName",
            "label": "Nazwa długa",
            "length": 1000,
            "calculateAfterChange": true,
            "computeFlagsAfterChange": false,
            "validateAfterFieldChange": false,
            "editGroupEnabled": false,
            "fieldsToAssign": ["shortName"
            ]
        },
        "shortName": {
            "name": "shortName",
            "type": "STRING",
            "domainName": "ShortName",
            "label": "Nazwa skrócona",
            "length": 50,
            "calculateAfterChange": false,
            "computeFlagsAfterChange": false,
            "validateAfterFieldChange": false,
            "editGroupEnabled": false
        }
    }
};
function createInputGUIComponent() {
    var inputGUIComponent = new InputGUIComponent({});
    inputGUIComponent.onValueChange = function () {

    };
    return inputGUIComponent;
}

var customerServiceClass = 'pl.com.stream.verto.cmm.customer.server.pub.main.CustomerService';
var operatorServiceClass = 'pl.com.stream.verto.cmm.operator.server.pub.main.OperatorService';
var strategyServiceClass = 'pl.com.stream.verto.adm.asen.tools.server.pub.strategy.StrategyService';
var storageLocationServiceClass = 'pl.com.stream.verto.whl.storagelocation.server.pub.main.StorageLocationService';

class ValidationTests {
    run() {
        describe('Start ValidationTest', function () {
            ita('should set error on the field', async () => {
                //given
                var dataSet = new ClientDataSet(customerServiceClass);
                await dataSet.initialize();
                await dataSet.initDTO({});

                //when
                await  dataSet.validate();
                var fullName = dataSet.getFieldByName('fullName');

                //then
                expect(fullName.getValidationState().isValid()).to.be.false;
                expect(fullName.getValidationState().getMsg()).to.not.be.undefined;
                expect(fullName.getValidationState().getType()).to.be.eq(VALIDATION_TYPE.VALIDATION_ERROR);

            });
            ita('should not set error when field has value', async () => {
                //given
                var dataSet = new ClientDataSet(customerServiceClass);
                await dataSet.initialize();
                await dataSet.initDTO({});
                var fullName = dataSet.getFieldByName('fullName');
                fullName.setValue('Some val');

                //when
                await  dataSet.validate();
                fullName = dataSet.getFieldByName('fullName');

                //then
                expect(fullName.getValidationState().isValid()).to.be.true;
                expect(fullName.getValidationState().getMsg()).to.be.undefined;

            });
            ita('should turn off error when field value change', async () => {
                //given
                var dataSet = new ClientDataSet(customerServiceClass);
                await dataSet.initialize();
                await dataSet.initDTO({});

                //when
                await  dataSet.validate();
                var fullName = dataSet.getFieldByName('fullName');
                fullName.setValue('Some val');
                await  dataSet.validate();

                //then
                expect(fullName.getValidationState().isValid()).to.be.true;
                expect(fullName.getValidationState().getMsg()).to.be.undefined;
            });
            ita('should turn off error after immediate field value change', async () => {
                //given
                var dataSet = new ClientDataSet(customerServiceClass);
                await dataSet.initialize();
                await dataSet.initDTO({});

                //when
                await  dataSet.validate();
                var fullName = dataSet.getFieldByName('fullName');
                fullName.setValue('Some val');

                //then
                expect(fullName.getValidationState().isValid()).to.be.true;
                expect(fullName.getValidationState().getMsg()).to.be.undefined;
            });
            ita('should set waring on the field', async () => {
                //given
                var dataSet = new ClientDataSet(customerServiceClass);
                await dataSet.initialize();
                await dataSet.initDTO({});

                //when
                dataSet.getFieldByName('fullName').setValue('some val');
                dataSet.getFieldByName('shortcutName').setValue('some val');
                dataSet.getFieldByName('locality').setValue('some val');
                var tin = dataSet.getFieldByName('tin');
                tin.setValue('123');
                await  dataSet.validate();

                //then
                expect(tin.getValidationState().isValid()).to.be.false;
                expect(tin.getValidationState().getMsg()).to.not.be.undefined;
                expect(tin.getValidationState().getType()).to.be.eq(VALIDATION_TYPE.VALIDATION_WARNING);
            });

            ita('should set bean error on the dataset', async () => {
                //given
                var dataSet = new ClientDataSet(customerServiceClass);
                await dataSet.initialize();
                await dataSet.initDTO({});

                //when
                dataSet.getFieldByName('fullName').setValue('some val');
                dataSet.getFieldByName('shortcutName').setValue('some val');
                dataSet.getFieldByName('locality').setValue('some val');
                dataSet.getFieldByName('tin').setValue(9290100096);
                await  dataSet.validate();

                //then
                expect(dataSet.getValidationStates().length).to.be.eq(0);
            });

            ita('should validation required fields without server request', async () => {
                //given
                var dataSet = new ClientDataSet(customerServiceClass);
                await dataSet.initialize();
                await dataSet.initDTO({});

                //when
                var mock = sinon.stub();
                dataSet.clientDataSetService = mock;
                await  dataSet.validate();

                //then
                expect(dataSet.getValidationStates().length).to.not.be.eq(0);
                sinon.assert.notCalled(mock);
            });
        });
    }
}


export default ValidationTests;

