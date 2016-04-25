// jshint ignore: start
"use strict";
/**
 * Created by Mirek on 2016-01-22.
 */
import DataSet from '../../vedas/dataSource/DataSet';
import ClientDataSet from '../../vedas/ClientDataSet';
import Field from '../../vedas/dataSource/Field';
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

class DataSetTests {
    run() {
        describe('Start DataSetTest', function () {
            it('should propagate setValue from field to dataset', () => {
                //given
                var dataSet = new DataSet(dataSetServerDef);

                //when
                var fullName = dataSet.getFieldByName('fullName');
                var value = 'someVal';
                fullName.setValue(value);

                //then
                var lastFieldEvent = dataSet.getLastFieldEvent();
                expect(lastFieldEvent).to.not.be.undefined;

            });
            it('should propagate setValue from component to dataset', () => {
                //given
                var dataSet = new DataSet(dataSetServerDef);
                var fullName = dataSet.getFieldByName('fullName');
                var inputGUIComponent = createInputGUIComponent();
                inputGUIComponent.bindWithField(fullName);
                var value = 'val';

                //when
                inputGUIComponent.setValue(value);

                //then
                var lastFieldEvent = dataSet.getLastFieldEvent();
                expect(lastFieldEvent).to.not.be.undefined;
                expect(lastFieldEvent.field.getValue()).to.be.eq(value);
            });
            it('should propagate setVisible from dataset to field', () => {
                //given
                var dataSet = new DataSet(dataSetServerDef);

                //then
                dataSet.setVisible('fullName', true);

                //when
                var fullName = dataSet.getFieldByName('fullName');
                expect(fullName.isVisible()).to.be.true;

            });
            it('should propagate value from component to other components by fieldsToAssign', () => {
                //given
                var dataSet = new DataSet(dataSetServerDef);
                var fullName = dataSet.getFieldByName('fullName');
                var shortName = dataSet.getFieldByName('shortName');
                var value = 'val';

                //when
                fullName.setValue(value);

                //then
                expect(shortName.getValue()).to.be.eq(value);
            });
            describe('Start ClientDataSet', function () {
                ita('should initialize ClientDataSet by server def', async function () {
                    //given
                    var dataSet = new ClientDataSet(customerServiceClass);

                    //when
                    await dataSet.initialize();

                    //then
                    expect(dataSet.getFields().size).have.greaterThan(0);
                    expect(dataSet.getFieldByName('fullName').calculateAfterChange).to.be.eq.true;
                    expect(dataSet.getFieldByName('tin').isVisible()).to.be.eq.true;

                });

                ita('should init CustomerDto', async function () {
                    // given
                    var dataSet = new ClientDataSet(customerServiceClass);
                    await dataSet.initialize();

                    //when
                    await dataSet.initDTO({});

                    //then
                    var countryCode = dataSet.getFieldByName('countryCode');
                    var active = dataSet.getFieldByName('active');

                    expect(countryCode.getValue()).to.be.eq('PL');
                    expect(active.getValue()).to.be.true;
                });

                it('should calculate CustomerDto after fullName change', function (done) {
                    //given
                    var dataSet = new ClientDataSet(customerServiceClass);
                    dataSet.initialize().then(()=> {
                        var fullName = dataSet.getFieldByName('fullName');
                        var shortName = dataSet.getFieldByName('shortcutName');

                        //when
                        var value = `Streamsoft
                                        Spolka
                                        Jawna`;
                        fullName.setValue(value);

                        //then
                        wait(()=> {
                            expect(shortName.getValue()).to.be.eq('Streamsoft'.toUpperCase());
                        }, done);
                    });
                });
                describe('Calculation visibility flags', function () {
                    var sandbox;
                    beforeEach(function (done) {
                        sandbox = sinon.sandbox.create();
                        done();
                    });

                    afterEach(function (done) {
                        sandbox.restore();
                        done();
                    });
                    it('should calculate after change company on false', function (done) {
                        //given
                        var dataSet = new ClientDataSet(customerServiceClass);
                        dataSet.initialize().then(()=> {
                            var fullName = dataSet.getFieldByName('fullName');
                            var firstName = dataSet.getFieldByName('firstName');
                            var company = dataSet.getFieldByName('company');

                            //when
                            company.setValue(false);

                            //then
                            wait(()=> {
                                expect(fullName.isVisible()).to.be.eq(false);
                                expect(firstName.isVisible()).to.be.eq(true);
                            }, done);
                        });
                    });
                    it('should calculate after change company on true', function (done) {
                        //given
                        var dataSet = new ClientDataSet(customerServiceClass);
                        var calculateDtoMethod = sandbox.spy(dataSet, 'calculateDto');
                        dataSet.initialize().then(()=> {
                            var fullName = dataSet.getFieldByName('fullName');
                            var firstName = dataSet.getFieldByName('firstName');
                            var company = dataSet.getFieldByName('company');

                            //when
                            company.setValue(true);

                            //then
                            wait(()=> {
                                expect(fullName.isVisible()).to.be.eq(true);
                                expect(firstName.isVisible()).to.be.eq(false);
                                expect(calculateDtoMethod.calledOnce).to.be.true;
                            }, done);
                        });
                    });
                    it('should calculate only flags(without Dto) after supplier value change', function (done) {
                        //given
                        var dataSet = new ClientDataSet(customerServiceClass);
                        var calculateFlagsMethod = sandbox.spy(dataSet, 'calculateFlags');
                        dataSet.initialize().then(()=> {
                            var fullName = dataSet.getFieldByName('fullName');
                            var firstName = dataSet.getFieldByName('firstName');
                            var company = dataSet.getFieldByName('supplier');

                            //when
                            company.setValue(false);

                            //then
                            wait(()=> {
                                expect(calculateFlagsMethod.calledOnce).to.be.true;
                            }, done);
                        });
                    });
                });
                describe('Calculation required flags', function () {
                    it('should company value false force firstName and lastName required and tin not', function (done) {
                        //given
                        var dataSet = new ClientDataSet(customerServiceClass);
                        dataSet.initialize().then(()=> {
                            var tin = dataSet.getFieldByName('tin');
                            var firstName = dataSet.getFieldByName('firstName');
                            var lastName = dataSet.getFieldByName('lastName');
                            var company = dataSet.getFieldByName('company');

                            //when
                            company.setValue(false);

                            //then
                            wait(()=> {
                                expect(tin.isRequired()).to.be.eq(false);
                                expect(firstName.isRequired()).to.be.eq(true);
                                expect(lastName.isRequired()).to.be.eq(true);
                            }, done);
                        });
                    });
                    ita('should company value true force  tin required and firstName and lastName not', async function () {
                        //given
                        var dataSet = new ClientDataSet(customerServiceClass);
                        await dataSet.initialize();
                        await dataSet.initDTO({});

                        var tin = dataSet.getFieldByName('tin');
                        var firstName = dataSet.getFieldByName('firstName');
                        var lastName = dataSet.getFieldByName('lastName');
                        var company = dataSet.getFieldByName('company');

                        //when
                        company.setValue(true);

                        //then
                        await asyncWait();
                        expect(tin.isRequired()).to.be.eq(true);
                        expect(firstName.isRequired()).to.be.eq(false);
                        expect(lastName.isRequired()).to.be.eq(false);
                    });
                });
                describe('Calculation label flags', function () {
                    ita('should set label for password for new operator', async function () {
                        //given
                        var dataSet = new ClientDataSet(operatorServiceClass);
                        await dataSet.initialize();
                        await dataSet.initDTO({});

                        var password = dataSet.getFieldByName('password');

                        //when
                        await dataSet.calculateFlags();

                        //then
                        expect(password.getLabel()).to.be.eq('Utwórz hasło');
                    });
                    ita('should set label for password for existing operator', async function () {
                        //given
                        var dataSet = new ClientDataSet(operatorServiceClass);
                        await dataSet.initialize();
                        await dataSet.initDTO({});

                        var password = dataSet.getFieldByName('password');
                        var idOperator = dataSet.getFieldByName('idOperator');

                        //when
                        idOperator.setValue(1);
                        await dataSet.calculateFlags();

                        //then
                        expect(password.getLabel()).to.be.eq('Nowe hasło');
                    });
                });
                describe('Calculation editable flags', function () {
                    ita('should set editable for idStrategyType when strategyTypeGroupId is empty', async function () {
                        //given
                        var dataSet = new ClientDataSet(strategyServiceClass);
                        await dataSet.initialize();

                        //when
                        await dataSet.initDTO({strategyTypeGroupId: ''});
                        var idStrategyType = dataSet.getFieldByName('idStrategyType');

                        //then
                        expect(idStrategyType.isEditable()).to.be.true;
                    });
                    ita('should set not editable for idStrategyType when strategyTypeGroupId is not empty', async function () {
                        //given
                        var dataSet = new ClientDataSet(strategyServiceClass);
                        await dataSet.initialize();

                        //when
                        await dataSet.initDTO({strategyTypeGroupId: 'not empty'});
                        var idStrategyType = dataSet.getFieldByName('idStrategyType');

                        //then
                        expect(idStrategyType.isEditable()).to.be.false;
                    });
                });
                describe('Calculation min ,max, precision flags', function () {
                    ita('should set min,max for numeric field', async function () {
                        //given
                        var dataSet = new ClientDataSet(customerServiceClass);
                        await dataSet.initialize();

                        //when
                        var custNumber = dataSet.getFieldByName('custNumber');
                        var discountPurchase = dataSet.getFieldByName('discountPurchase');

                        //then
                        expect(custNumber.getMinValue()).to.be.eq(0);
                        expect(custNumber.getMaxValue()).to.be.undefined;
                        expect(discountPurchase.getMinValue()).to.be.eq(0);
                        expect(discountPurchase.getMaxValue()).to.be.eq(100);
                    });
                    ita('should set precision for numeric field', async function () {
                        //given
                        var dataSet = new ClientDataSet(customerServiceClass);
                        await dataSet.initialize();

                        //when
                        var custNumber = dataSet.getFieldByName('custNumber');
                        var discountPurchase = dataSet.getFieldByName('discountPurchase');

                        //then
                        expect(custNumber.getPrecision()).to.be.eq(0);
                        expect(discountPurchase.getPrecision()).to.be.eq(2);
                    });
                    ita('should init dynamic precision for numeric field', async function () {
                        var dataSet = new ClientDataSet(storageLocationServiceClass);
                        await dataSet.initialize();
                        await dataSet.initDTO({idWarehouseHall: 100300});

                        //when
                        var maxStorageUnitStock = dataSet.getFieldByName('maxStorageUnitStock');

                        //then
                        expect(maxStorageUnitStock.getPrecision()).to.be.eq(0);
                    });
                    ita('should calculate precision for numeric field after field change', async function () {
                        var dataSet = new ClientDataSet(storageLocationServiceClass);
                        await dataSet.initialize();
                        await dataSet.initDTO({idWarehouseHall: 100300});

                        //when
                        var maxStorageUnitStock = dataSet.getFieldByName('maxStorageUnitStock');
                        var idUnit = dataSet.getFieldByName('idUnit');
                        idUnit.setValue(100010);
                        await  asyncWait();

                        //then
                        expect(maxStorageUnitStock.getPrecision()).to.be.eq(2);
                    });
                });
                ita('should ignore all fields event after start DataSetUpdate', async function () {
                    //given
                    var dataSet = new ClientDataSet(customerServiceClass);
                    await dataSet.initialize();
                    await dataSet.initDTO({});

                    //when
                    dataSet.lastFieldEvent = undefined;
                    dataSet.startUpdate();
                    var fullName = dataSet.getFieldByName('fullName');
                    fullName.setValue('new value');

                    //then
                    expect(dataSet.getLastFieldEvent()).to.be.undefined;
                });

                ita('should propagate  fields event after finish DataSetUpdate', async function () {
                    //given
                    var dataSet = new ClientDataSet(customerServiceClass);
                    await dataSet.initialize();
                    await dataSet.initDTO({});

                    dataSet.lastFieldEvent = undefined;
                    dataSet.startUpdate();
                    var fullName = dataSet.getFieldByName('fullName');
                    fullName.setValue('new value');
                    expect(dataSet.getLastFieldEvent()).to.be.undefined;

                    //when
                    dataSet.finishUpdate();
                    fullName.setValue('new value2');


                    //then
                    expect(dataSet.getLastFieldEvent()).to.not.be.undefined;
                });
            });
        });
    }
}

function j1() {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            console.log('1new Date: ');
            console.log(new Date);
            resolve();
        }, 5000);
    });
}
function j2() {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            console.log('2new Date: ');
            console.log(new Date);
            resolve();
        }, 3000);
    });
}
function j3() {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            console.log('3new Date: ');
            console.log(new Date);
            resolve();
        }, 2000);
    });
}
//http://www.html5rocks.com/en/tutorials/es6/promises/
export default DataSetTests;

