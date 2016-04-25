/**
 * Created by bstanislawski on 2016-03-07.
 */
import Window from '../../sidow/window/windows/FormWindow';
import WindowArea from '../../sidow/window/windowArea/WindowArea';
import samilEnums from '../../enums/SamilEnums';

import ClientDataSet from '../../vedas/ClientDataSet';
import DataSource from '../../vedas/dataSource/DataSource';
import MetaDataSource from '../../vedas/MetaDataSource/MetaDataSource';

import WindowAction from '../../sidow/window/windowAction/WindowAction';

import WindowAreaContentExtraOptions from '../../sidow/window/WindowAreaContentExtraOptions';
import SamilPanelContentComponents from '../../sidow/samilPanel/SamilPanelContentComponents';

import SamilPanel from '../../sidow/samilPanel/SamilPanelView';

import GUITree from '../../samil/GUITree/GUITree';
import GUIElementDef from '../../samil/GUITree/GUIElementDef';

import TablePanel from '../../sidow/tablePanel/TablePanel';

import AnimatedPanelWrapper from '../../designer/windowPresentationWrappers/animatedPanelWrapper/AnimatedPanelWrapper';
import WindowOptions from '../../sidow/window/WindowOptions';

var dataSet;

const BASIC_INFO_ID = 'basic-data';
const ADD_INFO_ID = 'additional-data';
const CUSTOMER_BILLS_ID = 'customer-bills';

const ORG_UNIT_TREE = 'pl.com.stream.verto.cmm.plugin.organization-client.OrgUnitView';

export function showWindowSample() {
    var $workspace = $('#workspace');

    var dto = customerService.replace('Service', 'Dto');
    dataSet = new ClientDataSet(customerService, dto);

    dataSet.initialize().then(def => {
        var dataSets = [def];
        var metaDataSource = new MetaDataSource(dataSets);
        var customerDataSource = new DataSource(metaDataSource);

        customerDataSource.addDataSet(dataSet);

        let handMadeGUITree = new GUITree();
        handMadeGUITree.setModel(createModelByHand());

        let contentComponents = createOperatorContentComponents(customerDataSource, handMadeGUITree);
        let extraOptions = createExtraOptions();

        let windowOptions = new WindowOptions('Nowy', 'Kontrahenci', 'Edycja kontrahentów');

        let sendAction = new WindowAction({
            id: 'send-action',
            text: 'Wyślij',
            handler: validationButtonHandler,
            state: samilEnums.BUTTON_STATES.SUCCESS,
            icon: samilEnums.ICONS.CHECK
        });

        let window = new Window('Operator', windowOptions);
        let bodyArea = new WindowArea('body');

        let customerBasicInfo = new SamilPanel(BASIC_INFO_ID, contentComponents.customerBasicInfo, extraOptions.basicOptions);
        let customerAdditionalInfo = new SamilPanel(ADD_INFO_ID, contentComponents.customerAdditional, extraOptions.additionalOptions);
        let customerBillsInfo = new SamilPanel(CUSTOMER_BILLS_ID, contentComponents.customerBill, extraOptions.customerBillsOptions);
        let handMadeView = new SamilPanel('handmade', contentComponents.customerHandMade, extraOptions.handMadeOptions);
        let tableView = new TablePanel('tableView', ORG_UNIT_TREE);

        bodyArea.addComponent(customerBasicInfo);
        bodyArea.addComponent(customerAdditionalInfo);
        bodyArea.addComponent(customerBillsInfo);
        bodyArea.addComponent(handMadeView);
        bodyArea.addComponent(tableView);

        window.addBody(bodyArea);
        window.addAction(sendAction);

        window.setDefaultComponent(customerBillsInfo.id);

        let animationPanel = new AnimatedPanelWrapper(window);
        animationPanel.show($workspace);
    });
}

function createExtraOptions() {
    var extraOptions = {};

    extraOptions.basicOptions = new WindowAreaContentExtraOptions({
        name: 'Dane podstawowe'
    });

    extraOptions.additionalOptions = new WindowAreaContentExtraOptions({
        name: 'Dane rozszerzone',
        icon: samilEnums.ICONS.CHECK
    });

    extraOptions.customerBillsOptions = new WindowAreaContentExtraOptions({
        name: 'Rzoliczenia',
        icon: samilEnums.ICONS.PLUS_SQUARE_O
    });

    extraOptions.handMadeOptions = new WindowAreaContentExtraOptions({
        name: 'Z kodu'
    });

    extraOptions.buttonSampleOptions = new WindowAreaContentExtraOptions({
        name: 'widok z btn'
    });

    return extraOptions;
}

function createOperatorContentComponents(customerDataSource, handMadeGUITree) {
    var contentComponents = {};

    contentComponents.customerBasicInfo = new SamilPanelContentComponents({
        model: CUSTOMER_BASIC_INFO_XML,
        dataSource: customerDataSource
    });

    contentComponents.customerAdditional = new SamilPanelContentComponents({
        model: CUSTOMER_ADDED_INFO_XML,
        dataSource: customerDataSource
    });

    contentComponents.customerBill = new SamilPanelContentComponents({
        model: CUSTOMER_BILLS_XML,
        dataSource: customerDataSource
    });

    contentComponents.customerHandMade = new SamilPanelContentComponents({
        model: handMadeGUITree,
        dataSource: customerDataSource
    });

    return contentComponents;
}

function validationButtonHandler(event, windowAction) {
    windowAction.contextWindow.body.components.forEach((component, id) => {
        //get SamilPanelView dataSet name
        var mainContainer = component.content.components[0];
        var dataSetName = mainContainer.def.groupBinding;

        //get dataSet
        var bindDataSet = component.dataSource.dataSetList.get(dataSetName);

        //validate dataSet
        bindDataSet.validate();
    });
}

function createModelByHand() {
    var rootElement = new GUIElementDef('root', samilEnums.XML_ELEMENTS.ROOT);
    var containerDef = new GUIElementDef('container1', samilEnums.XML_ELEMENTS.CONTAINER);

    containerDef.setGroupBinding('customer');

    let rowDef = new GUIElementDef('row1', samilEnums.XML_ELEMENTS.ROW);
    let row2Def = new GUIElementDef('row2', samilEnums.XML_ELEMENTS.ROW);
    let row3Def = new GUIElementDef('row3', samilEnums.XML_ELEMENTS.ROW);

    let firstNameComponentDef = new GUIElementDef('firstName', samilEnums.XML_ELEMENTS.COMPONENT);
    let lastNameComponentDef = new GUIElementDef('lastName', samilEnums.XML_ELEMENTS.COMPONENT);
    let loginByExternalSystemDef = new GUIElementDef('loginByExternalSystem', samilEnums.XML_ELEMENTS.COMPONENT);
    let passwordDef = new GUIElementDef('password', samilEnums.XML_ELEMENTS.COMPONENT);

    let container2Def = new GUIElementDef('container2', samilEnums.XML_ELEMENTS.CONTAINER);
    let occupationComponentDef = new GUIElementDef('occupation', samilEnums.XML_ELEMENTS.COMPONENT);

    let salaryComponentDef = new GUIElementDef('salary', samilEnums.XML_ELEMENTS.COMPONENT);

    firstNameComponentDef.attributes.set('expand', 0);
    firstNameComponentDef.attributes.set('chars', 20);
    firstNameComponentDef.attributes.set('fill', 'none');

    container2Def.addChild(occupationComponentDef);

    passwordDef.attributes.set('expand', 2);

    rootElement.addChild(containerDef);

    containerDef.addChild(rowDef);
    containerDef.addChild(row2Def);
    containerDef.addChild(row3Def);
    containerDef.addChild(salaryComponentDef);

    rowDef.addChild(firstNameComponentDef);
    rowDef.addChild(lastNameComponentDef);
    rowDef.addChild(container2Def);

    row2Def.addChild(passwordDef);
    row2Def.addChild(loginByExternalSystemDef);

    row3Def.addChild(occupationComponentDef);
    row3Def.addChild(salaryComponentDef);

    return [rootElement];
}

const customerService = 'pl.com.stream.verto.cmm.customer.server.pub.main.CustomerService';
const CUSTOMER_BASIC_INFO_XML = `
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Root version="1">
    <Container dataset-binding="customer">
        <Container>
            <Row>
                <Component id="custNumber" class="label" expand="0"/>
                <Container>
                    <Row>
                        <Component id="custNumber" class="field"/>
                        <Component id="tin" class="label"/>
                        <Component id="countryCode" class="field" chars="2"/>
                        <Component id="tin" class="field"/>
                        <Component id="tinSuffix"/>
                    </Row>
                </Container>
            </Row>
            <Component id="fullName" template="memo"/>
            <Row>
                <Component id="firstName"/>
                <Component id="lastName"/>
                <Component id="birthDate"/>
            </Row>
            <Row>
                <Component id="shortcutName"/>
                <Component id="phoneNumber"/>
                <Component id="fax"/>
            </Row>
            <Row>
                <Component id="emailAddress"/>
                <Component id="webPage"/>
            </Row>
        </Container>
        <Component id="s1" class="separator"/>
        <Container>
            <Row>
                <Component id="locality" occupyx="3"/>
                <Spring expandx="1" occupyx="4"/>
            </Row>
            <Row>
                <Component id="street" chars="30"/>
                <Component id="houseNumber"/>
                <Component id="flatNumber"/>
            </Row>
            <Row>
                <Component id="postCode"/>
                <Component id="post" occupyx="1"/>
            </Row>
            <Row>
                <Component id="county"/>
                <Component id="commune"/>
            </Row>
            <Row>
                <Component id="idProvince"/>
                <Component id="idCountry"/>
            </Row>
        </Container>
        <Component id="s4" class="separator"/>
        <Container>
            <Row>
                <Component id="company" expand="1"/>
                <Component id="vatPayer" expand="1"/>
                <Component id="supplier" expand="1"/>
                <Component id="recipient" expand="1"/>
                <Component id="factor" expand="1"/>
                <Component id="trade" expand="1"/>
                <Component id="isOrgCompany" expand="1"/>
                <Component id="active" expand="1"/>
                <Spring expandx="10"/>
            </Row>
        </Container>
    </Container>
</Root>
`;

const CUSTOMER_ADDED_INFO_XML = `
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Root version="1">
    <Container dataset-binding="customer">
        <Row>
            <Component id="outsideCustNumber" occupyx="2"/>
            <Spring expandx="1"/>
        </Row>
        <Component id="s2" class="separator"/>
        <Row>
            <Component id="idOperatorLead" occupyx="2"/>
            <Spring expandx="1"/>
        </Row>
        <Component id="s3" class="separator"/>
        <Row>
            <Component id="idCustomerOriginKind" occupyx="2">
                <Property name="idBusinessDictionaryList" binding="const.BUSINESS_DICTIONARY_LIST_CUST_ORIGIN_KIND"/>
            </Component>
            <Spring expandx="1"/>
        </Row>
        <Component id="s4" class="separator"/>
        <Row>
            <Component id="identityCardNumber" occupyx="2"/>
            <Spring expandx="2" occupyy="2"/>
        </Row>
        <Component id="passportNumber" occupyx="2"/>
        <Component id="s4" class="separator"/>
        <Row>
            <Component id="gln" occupyx="2"/>
            <Spring expandx="1"/>
        </Row>
        <Row expand="1">
            <Component id="addressNotes" template="memo"/>
        </Row>
    </Container>
</Root>
`;

const CUSTOMER_BILLS_XML = `
 <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Root version="1">
    <Container dataset-binding="customer">
        <Component id="idLastConsignmentSttDoc"/>
        <Component id="returnsHandling"/>
    </Container>
</Root>
`;
