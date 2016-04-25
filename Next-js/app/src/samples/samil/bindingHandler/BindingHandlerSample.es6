/**
 * Created by bstanislawski on 2015-12-11.
 */
import GUITreeFactory from '../../../samil/GUITree/GUITreeFactory';
import samil_workspace from '../../../samil/samil_workspace.hbs';
import ClientDataSet from '../../../vedas/ClientDataSet';
import ClientDataSetService from '../../../vedas/ClientDataSetService';
import GUIComponentFactoryRegistry from '../../../samil/GUIComponentFactory/GUIComponentFactoryRegistry';
import dataSourceRegistry from '../../../vedas/dataSource/DataSourceRegistry'

import metaDataSourceFactory from '../../../vedas/MetaDataSource/MetaDataSourceFactory';
import dataSourceFactory from '../../../vedas/dataSource/DataSourceFactory';
import DataSource from '../../../vedas/dataSource/DataSource';
import MetaDataSource from '../../../vedas/MetaDataSource/MetaDataSource';

//operator group
//var service = 'pl.com.stream.verto.cmm.operator.server.pub.group.OperatorGroupService';
//var xml = `
//<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
//<Root version="1">
//    <Container dataset-binding="operatorGroup">
//        <Component id="name"/>
//        <Component id="active"/>
//        <Spring expandy="1"/>
//    </Container>
//</Root>
//`;

//customer person
//var service = 'pl.com.stream.verto.crm.customerperson.server.pub.main.CustomerPersonService';
//var xml = `
//<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
//<Root version="1">
//    <Container dataset-binding="customerPerson">
//        <Component id="idCustomer"/>
//        <Component id="idCustomerBranch">
//            <Property name="idCustomer" binding="field.customerPerson.idCustomer"/>
//        </Component>
//        <Component id="s1" class="separator" occupyx="2"/>
//        <Row>
//            <Component id="firstName" chars="15"/>
//            <Component id="lastName" chars="15"/>
//        </Row>
//        <Component id="jobPosition"/>
//        <Component id="idJobFunction"/>
//        <Component id="idJobLevel"/>
//        <Component id="active"/>
//    </Container>
//</Root>
//`;

//operator
//var service = 'pl.com.stream.verto.cmm.operator.server.pub.main.OperatorService';
//var xml = `
//<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
//<Root version="1">
//    <Container dataset-binding="operator">
//        <Row>
//            <Component id="firstName"/>
//            <Component id="lastName"/>
//        </Row>
//        <Component id="panelSeparator1" class="separator"/>
//        <Row>
//            <Component id="login"/>
//            <Spring />
//            <Component id="loginByExternalSystem"/>
//        </Row>
//        <Row>
//            <Component id="loginByRfid"/>
//        </Row>
//        <Row>
//            <Component id="rfidCardNr" template="password" occupyx="1"/>
//            <Spring expandx="1"/>
//        </Row>
//        <Component id="changePassword"/>
//        <Row>
//            <Component id="password" template="password"/>
//            <Spring/>
//        </Row>
//        <Row>
//            <Component id="retypePassword" template="password"/>
//            <Spring/>
//        </Row>
//        <Component id="passwordChangeRequired"/>
//        <Row>
//            <Component id="idPasswordRule" occupyx="2"/>
//            <Spring expandx="1"/>
//        </Row>
//        <Component id="panelSeparator2" class="separator"/>
//        <Row>
//            <Component id="idOperatorGroup"/>
//            <Component id="idOperatorProfile"/>
//        </Row>
//        <Component id="panelSeparator5" class="separator"/>
//        <Component id="allowMultipleLogin"/>
//        <Component id="active"/>
//    </Container>
//</Root>
//`;

//customer
//var service = 'pl.com.stream.verto.cmm.customer.server.pub.main.CustomerService';
//var xml = `
//<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
//<Root version="1">
//    <Container dataset-binding="customer">
//        <Container>
//            <Row>
//                <Component id="custNumber" class="label" expand="0"/>
//                <Container>
//                    <Row>
//                        <Component id="custNumber" class="field"/>
//                        <Component id="tin" class="label"/>
//                        <Component id="countryCode" class="field" chars="2"/>
//                        <Component id="tin" class="field"/>
//                        <Component id="tinSuffix"/>
//                    </Row>
//                </Container>
//            </Row>
//            <Component id="fullName" template="memo"/>
//            <Row>
//                <Component id="firstName"/>
//                <Component id="lastName"/>
//                <Component id="birthDate"/>
//            </Row>
//            <Row>
//                <Component id="shortcutName"/>
//                <Component id="phoneNumber"/>
//                <Component id="fax"/>
//            </Row>
//            <Row>
//                <Component id="emailAddress"/>
//                <Component id="webPage"/>
//            </Row>
//        </Container>
//        <Component id="s1" class="separator"/>
//        <Container>
//            <Row>
//                <Component id="locality" occupyx="3"/>
//                <Spring expandx="1" occupyx="4"/>
//            </Row>
//            <Row>
//                <Component id="street" chars="30"/>
//                <Component id="houseNumber"/>
//                <Component id="flatNumber"/>
//            </Row>
//            <Row>
//                <Component id="postCode"/>
//                <Component id="post" occupyx="1"/>
//            </Row>
//            <Row>
//                <Component id="county"/>
//                <Component id="commune"/>
//            </Row>
//            <Row>
//                <Component id="idProvince"/>
//                <Component id="idCountry"/>
//            </Row>
//        </Container>
//        <Component id="s4" class="separator"/>
//        <Container>
//            <Row>
//                <Component id="company" expand="1"/>
//                <Component id="vatPayer" expand="1"/>
//                <Component id="supplier" expand="1"/>
//                <Component id="recipient" expand="1"/>
//                <Component id="factor" expand="1"/>
//                <Component id="trade" expand="1"/>
//                <Component id="isOrgCompany" expand="1"/>
//                <Component id="active" expand="1"/>
//                <Spring expandx="10"/>
//            </Row>
//        </Container>
//    </Container>
//</Root>
//`;

//good
//var service = 'pl.com.stream.verto.cmm.good.server.pub.main.service.GoodService';
//var xml = `
//<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
//<Root version="1">
//    <Container dataset-binding="good">
//        <Row expand="1">
//            <Container>
//                <Row>
//                    <Component id="goodIndex" class="label" align="left" expand="0"/>
//                    <Component id="longName" class="label" align="left"/>
//                </Row>
//                <Row>
//                    <Component id="goodIndex" class="field" chars="30" expand="0"/>
//                    <Component id="longName" class="field" expand="4" fill="both" template="memo" occupyy="4"/>
//                </Row>
//                <Component id="shortName" class="label" align="left" expand="0"/>
//                <Component id="shortName" class="field" fill="both"/>
//                <Row expand="1">
//                    <Spring/>
//                </Row>
//            </Container>
//        </Row>
//        <Container>
//            <Row>
//                <Container id="goodBasicParameters" template="titled" occupyx="1">
//                    <Component id="idGoodType" chars="25" expand="0">
//                        <Property name="propertyIncludeIdGoodType" binding="flag.good.idGoodTypeAvailableList"/>
//                    </Component>
//                    <Component id="idUnit" chars="25" expand="0"/>
//                    <Component id="idVatRate" chars="25" expand="0">
//                        <Property name="vatRateDate" binding="flag.good.vatRateDate"/>
//                        <Property name="idCountry" binding="const.ID_COUNTRY"/>
//                    </Component>
//                    <Component id="dutyPercent" chars="32" expand="0"/>
//                    <Component id="idPolClassProdServ" chars="25" expand="0"/>
//                    <Component id="idPolClassConstr" chars="25" expand="0"/>
//                    <Component id="idProducer" chars="25" expand="0"/>
//                    <Component id="idConsignmentCustomer" chars="25" expand="0"/>
//                    <Component id="idConfigurator" chars="25" expand="0" template="Id"/>
//                    <Component id="isActive" expand="0"/>
//                </Container>
//                <Container id="goodUsePlaceNameContainer" template="titled" occupyx="1">
//                    <Component id="goodIsUsedInWarehouse"/>
//                    <Component id="goodIsUsedInSale"/>
//                    <Component id="goodIsUsedInPurchase"/>
//                    <Component id="goodIsUsedInSupply"/>
//                </Container>
//                <Container id="intrastat" template="titled" occupyx="1">
//                    <Component id="isIntrastatSubject" expand="0"/>
//                    <Component id="idCountry" expand="0"/>
//                    <Component id="idPcnCode" expand="0"/>
//                </Container>
//            </Row>
//        </Container>
//        <Spring expandy="1"/>
//    </Container>
//</Root>
//`;

//aktywnosci
//var service = 'pl.com.stream.verto.crm.activity.server.pub.type.ActivityTypeService';
//var xml = `
//<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
//<Root version="1">
//    <Container dataset-binding="activityType">
//        <Row>
//            <Component id="enableCustomer"/>
//            <Component id="enableCustomerPerson"/>
//            <Component id="enableCustomerPersonList"/>
//        </Row>
//        <Row>
//            <Component id="enableCustomerBranch"/>
//            <Spring/>
//        </Row>
//        <Row>
//            <Component id="enableOperatorContact"/>
//            <Spring/>
//        </Row>
//        <Row>
//            <Component id="enableWorkResource"/>
//            <Component id="enableAttachements"/>
//        </Row>
//        <Row>
//            <Component id="enableLinks"/>
//            <Component id="enableRedirections"/>
//        </Row>
//        <Row>
//            <Component id="enableNotifications"/>
//        </Row>
//        <Row>
//            <Component id="supportSalesOpportunity"/>
//        </Row>
//        <Component id="s1" class="separator"/>
//        <Row>
//            <Container>
//                <Row>
//                    <Component id="numerationCode" expand="10"/>
//                    <Spring expandx="90"/>
//                </Row>
//            </Container>
//        </Row>
//    </Container>
//</Root>
//`;

//dane rozszerzone
//var service = 'pl.com.stream.verto.sal.document.server.pub.item.SaleDocumentItemService';
var xml = `
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Root version="1">
    <Container dataset-binding="saleDocumentItem">
        <Row>
            <Container>
                <Row>
                    <Component id="unitQuantity" class="label" binding="" expand="0" template="top"/>
                    <Spring occupyx="2"/>
                    <Component id="priceBeforeAllowance" class="label" binding="" expand="0" template="top"/>
                    <Component id="valueBeforeAllowance" class="label" binding="" expand="0" template="top"/>
                    <Component id="netAllowanceValue" class="label" binding="" expand="0" template="top"/>
                    <Component id="netPriceAfterAllowance" class="label" binding="" expand="0" template="top"/>
                    <Component id="netValueAfterAllowance" class="label" binding="" expand="0" template="top"/>
                </Row>
                <Row>
                    <Component id="quantity" class="field" expand="0"/>
                    <Component id="idUnit" class="field" chars="5" expand="0" fill="none"/>
                    <Component id="netRow" class="label" binding="" expand="0" template="top"/>
                    <Component id="netPriceBeforeAllowance" class="field" expand="0"/>
                    <Component id="netValueBeforeAllowance" class="field" expand="0"/>
                    <Component id="netAllowanceValue" class="field" expand="0"/>
                    <Component id="netPriceAfterAllowance" class="field" expand="0"/>
                    <Component id="netValueAfterAllowance" class="field" expand="0"/>
                </Row>
                <Row>
                    <Spring occupyx="2"/>
                    <Component id="grossRow" class="label" binding="" expand="0" template="top"/>
                    <Component id="grossPriceBeforeAllowance" class="field" expand="0"/>
                    <Component id="grossValueBeforeAllowance" class="field" expand="0"/>
                    <Component id="grossAllowanceValue" class="field" expand="0"/>
                    <Component id="grossPriceAfterAllowance" class="field" expand="0"/>
                    <Component id="grossValueAfterAllowance" class="field" expand="0"/>
                </Row>
                <Row>
                    <Spring occupyx="4"/>
                    <Component id="allowancePercent" chars="8" expand="0" fill="horizontal"/>
                    <Component id="vatValue" class="label" align="right" binding="" expand="0" template="top"/>
                    <Component id="vatValue" class="field" expand="0"/>
                </Row>
                <Component id="additionalUnitQuantity" class="label" expand="0" template="top" occupyx="2"/>
                <Row>
                    <Component id="additionalUnitQuantity" class="field" expand="0"/>
                    <Component id="idAdditionalUnit" class="field" chars="5" expand="0">
                        <Property name="propertyIdsSelectedUnitTo" binding="flag.saleDocumentItem.idsSelectedUnitTo"/>
                    </Component>
                    <Component id="additionalUnitNetPriceBeforeAllowance" class="label" expand="0" template="top-right"/>
                    <Component id="additionalUnitNetPriceBeforeAllowance" class="field" chars="20" expand="0"/>
                </Row>
                <Row>
                    <Spring occupyx="2"/>
                    <Component id="additionalUnitGrossPriceBeforeAllowance" class="label" expand="0" template="top-right"/>
                    <Component id="additionalUnitGrossPriceBeforeAllowance" class="field" chars="20" expand="0"/>
                </Row>
            </Container>
        </Row>
        <Component id="sep" class="separator"/>
        <Container>
            <Row>
                <Component id="idVat7SaleType">
                    <Property name="propertyVat7SaleTypeIds" binding="flag.saleDocumentItem.availableVat7SaleTypeIds"/>
                </Component>
                <Component id="isReverseCharge" expand="0"/>
                <Spring expandx="1"/>
            </Row>
        </Container>
    </Container>
</Root>
`;

//good with proper xml
//var service = 'pl.com.stream.verto.cmm.good.server.pub.main.service.GoodService';
//var xml = `
//<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
//<Root version="1">
//    <Container dataset-binding="good">
//        <Row expand="1">
//           <Container expand="2">
//               <Component id="goodIndex" class="label" align="left" expand="0"/>
//               <Component id="goodIndex" class="field" chars="30" expand="0"/>
//           	<Component id="shortName" class="label" align="left" expand="0"/>
//           	<Component id="shortName" class="field" fill="both"/>
//           </Container>
//           <Container expand="3">
//               <Component id="longName" class="label" align="left"/>
//               <Component id="longName" class="field" expand="4" fill="both" template="memo" occupyy="6"/>
//           </Container>
//        </Row>
//        <Container>
//            <Row>
//                <Container id="goodBasicParameters" template="titled" occupyx="1">
//                    <Component id="idGoodType" chars="25" expand="0">
//                        <Property name="propertyIncludeIdGoodType" binding="flag.good.idGoodTypeAvailableList"/>
//                    </Component>
//                    <Component id="idUnit" chars="25" expand="0"/>
//                    <Component id="idVatRate" chars="25" expand="0">
//                        <Property name="vatRateDate" binding="flag.good.vatRateDate"/>
//                        <Property name="idCountry" binding="const.ID_COUNTRY"/>
//                    </Component>
//                    <Component id="dutyPercent" chars="32" expand="0"/>
//                    <Component id="idPolClassProdServ" chars="25" expand="0"/>
//                    <Component id="idPolClassConstr" chars="25" expand="0"/>
//                    <Component id="idProducer" chars="25" expand="0"/>
//                    <Component id="idConsignmentCustomer" chars="25" expand="0"/>
//                    <Component id="idConfigurator" chars="25" expand="0" template="Id"/>
//                    <Component id="isActive" expand="0"/>
//                </Container>
//                <Container id="goodUsePlaceNameContainer" template="titled" occupyx="1">
//                    <Component id="goodIsUsedInWarehouse"/>
//                    <Component id="goodIsUsedInSale"/>
//                    <Component id="goodIsUsedInPurchase"/>
//                    <Component id="goodIsUsedInSupply"/>
//                </Container>
//                <Container id="intrastat" template="titled" occupyx="1">
//                    <Component id="isIntrastatSubject" expand="0"/>
//                    <Component id="idCountry" expand="0"/>
//                    <Component id="idPcnCode" expand="0"/>
//                </Container>
//            </Row>
//        </Container>
//        <Spring expandy="1"/>
//    </Container>
//</Root>
//`;

//var service = 'pl.com.stream.verto.crm.customersurvey.server.pub.def.CustomerSurveyDefService';
//var service = 'pl.com.stream.verto.sal.document.server.pub.item.SaleDocumentItemService';

var guiComponentTree;

export function showBindingHandler() {
    var workspace = '#samil-workspace';
    var htmlElement = samil_workspace({});

    $('#workspace').html(htmlElement);

    var $workspace = $(workspace);
    var contentWorkspace = $workspace.find('.tab-content');

    $('#input-xml').val(xml);

    $workspace.removeClass('hidden');

    var editor = CodeMirror.fromTextArea($workspace.find('textarea')[0], {
        lineNumbers: true,
        height: '450px',
        continuousScanning: 500,
        matchBrackets: true
    });
    var dataSet
    $workspace.find('#btn-convert').click(() => {
        var name = $('.name-input').find('input').val();
        var service = $('.service-input').find('input').val();
        var dto = service.replace('Service', 'Dto');
        dataSet = new ClientDataSet(service, dto);
        var xml = editor.getValue().trim();

        if (guiComponentTree) {
            guiComponentTree.dispose();
        }

        dataSet.initialize().then((def)=> {
            //dataSet.initDTO({}).then(()=> {
            var dataSets = [def];
            var metaDataSource = new MetaDataSource(dataSets);
            var dataSource = new DataSource(metaDataSource);

            dataSource.addDataSet(dataSet);
            mainFlow(xml, dataSource, contentWorkspace, name);

            //setTimeout(function () {
            //    dataSet.initDTO({});
            //}, 1000);
            //});
        });
    });
    //$workspace.find('#btn-convert').click();
    $workspace.find('#btn-submit').click(function () {
        dataSet.validate();
    });

    $('#toggle-debug-mode').click(() => {
        $('#samil-workspace').toggleClass('debug-mode');
        $('#toggle-debug-mode').toggleClass('enabled');
    });
}

function mainFlow(xml, dataSource, workspace, name) {
    var guiTree = GUITreeFactory.parseXmlToGUITree(xml);

    guiTree.setName(name);
    guiTree.setMetaDataSource(dataSource.metaDataSource); //fill()

    guiComponentTree = GUIComponentFactoryRegistry.createGUIComponentTree(guiTree);

    guiComponentTree.bindDataSource(dataSource); //bind()
    guiComponentTree.renderTo(workspace);
}

////setup before functions
//var typingTimer;                //timer identifier
//var doneTypingInterval = 5000;  //time in ms, 5 second for example
//var $input = $('#myInput');
//
////on keyup, start the countdown
//$input.on('keyup', function () {
//    clearTimeout(typingTimer);
//    typingTimer = setTimeout(doneTyping, doneTypingInterval);
//});
//
////on keydown, clear the countdown
//$input.on('keydown', function () {
//    clearTimeout(typingTimer);
//});
//
////user is "finished typing," do something
//function doneTyping () {
//    //do something
//}
