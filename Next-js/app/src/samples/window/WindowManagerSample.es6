/**
 * Created by bstanislawski on 2016-04-04.
 */
import FormWindow from '../../sidow/window/windows/FormWindow';
import ComposableWindow from '../../sidow/window/composableWindow/ComposableWindow';
import TableWindow from '../../sidow/window/windows/TableWindow';
import OptionWindow from '../../sidow/window/windows/OptionWindow';
import WindowArea from '../../sidow/window/windowArea/WindowArea';
import samilEnums from '../../enums/SamilEnums';

import ClientDataSet from '../../vedas/ClientDataSet';
import DataSource from '../../vedas/dataSource/DataSource';
import MetaDataSource from '../../vedas/MetaDataSource/MetaDataSource';

import WindowAction from '../../sidow/window/windowAction/WindowAction';

import WindowAreaContentExtraOptions from '../../sidow/window/WindowAreaContentExtraOptions';
import SamilPanelContentComponents from '../../sidow/samilPanel/SamilPanelContentComponents';

import SamilPanel from '../../sidow/samilPanel/SamilPanelView';
import WindowOptions from '../../sidow/window/WindowOptions';

import SidebarElement from '../../sidow/sidebarManager/SidebarElement';
import TablePanel from '../../sidow/tablePanel/TablePanel';

var dataSet;

export function windowManagerSampleHandler(sidebarElement, sidebarManager) {
    sidebarManager.clearSidebar(true);

    let dto = customerService.replace('Service', 'Dto');
    dataSet = new ClientDataSet(customerService, dto);

    dataSet.initialize().then(def => {
        let operatorWindow = createOperatorWindow(def);
        let customerWindow = createCustomerWindow();
        let optionWindow = createOptionWindow();
        let composableWindow = createComposableWindow();

        let backBtn = new SidebarElement('BackBtn', options => {
            sidebarManager.restoreElements();
        }, {
            icon: 'glyphicon glyphicon-arrow-left',
            text: '...',
            noTooltip: true
        });
        sidebarManager.addSidebarElement(backBtn);

        let showOperatorWindow = new SidebarElement('OperatorBtn', operatorWindow, {text: 'Nowy kontrahent'});
        sidebarManager.addSidebarElement(showOperatorWindow);

        let showCustomerWindow = new SidebarElement('CustomerBtn', customerWindow, {text: 'Jednoski organizacyjne'});
        sidebarManager.addSidebarElement(showCustomerWindow);

        let showOptionWindow = new SidebarElement('OptionBtn', optionWindow, {text: 'Operatorzy'});
        sidebarManager.addSidebarElement(showOptionWindow);

        let showComposableWindow = new SidebarElement('ComposableWindow', composableWindow, {}, createComposableWindowsMap());
        sidebarManager.addSidebarElement(showComposableWindow);
    });
    dataSet.initDTO({});
}


function createCustomerWindow() {
    const ORG_UNIT_TREE = 'pl.com.stream.verto.cmm.plugin.organization-client.OrgUnitView';
    return new TableWindow('Jednostka_Organizacyjna', ORG_UNIT_TREE, new WindowAreaContentExtraOptions({
        name: 'Jednostka Organizacyjna'
    }));
}

function createOptionWindow() {
    return new OptionWindow('optionView', 'pl.com.stream.verto.cmm.plugin.operator-client.OperatorOption', new WindowAreaContentExtraOptions({
        name: 'Operatorzy'
    }));
}

function createComposableWindowsMap() {
    var map = new Map();

    map.set('compositionOperaotr1', new OptionWindow('optionView1', 'pl.com.stream.verto.cmm.plugin.operator-client.OperatorOption', new WindowAreaContentExtraOptions({
        name: 'Operatorzy'
    })));

    return map;
}

function createComposableWindow() {
    const id = 'DocumentWindow';
    return new ComposableWindow(id);
}

const CUSTOMER_BILLS_ID = 'customer-bills';
const CONTACT_PERSONS_ID = 'contact-persons';
const customerService = 'pl.com.stream.verto.cmm.customer.server.pub.main.CustomerService';
const CUSTOMER_BILLS_XML = `
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

const ORG_UNIT_TREE = 'pl.com.stream.verto.cmm.plugin.organization-client.OrgUnitView';

export function createOperatorWindow(def, onlyOne) {
    var dataSets = [def];
    var metaDataSource = new MetaDataSource(dataSets);
    var customerDataSource = new DataSource(metaDataSource);

    customerDataSource.addDataSet(dataSet);

    let contentComponents = new SamilPanelContentComponents({
        model: CUSTOMER_BILLS_XML,
        dataSource: customerDataSource
    });
    let extraOptions = new WindowAreaContentExtraOptions({
        name: 'Dane podstawowe'
    });

    let extraOptionsCP = new WindowAreaContentExtraOptions({
        name: 'Osoby Kontaktowe'
    });

    let sendAction = new WindowAction('send-action', 'Wyślij', ()=> {
        console.log('click !');
    }, {
        state: samilEnums.BUTTON_STATES.SUCCESS,
        icon: samilEnums.ICONS.CHECK
    });

    let windowOptions = new WindowOptions('Nowy Kontrahent', 'Kontrahent', 'Edycja kontrahentów');

    let window = new FormWindow('Kontrahent', windowOptions);
    let bodyArea = new WindowArea('body');

    let basicInfoComponent = new SamilPanel(CUSTOMER_BILLS_ID, contentComponents, extraOptions);

    let contactPersonsComponent = new TablePanel(CONTACT_PERSONS_ID, ORG_UNIT_TREE, extraOptionsCP);

    bodyArea.addComponent(basicInfoComponent);

    if (!onlyOne) {
        bodyArea.addComponent(contactPersonsComponent);
    }

    window.addBody(bodyArea);
    window.addAction(sendAction);

    window.setDefaultComponent(basicInfoComponent.id);

    return window;
}
