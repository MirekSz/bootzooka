/**
 * Created by bstanislawski on 2016-03-07.
 */
import Window from '../../sidow/window/windows/FormWindow';
import WindowArea from '../../sidow/window/windowArea/WindowArea';
import WindowOptions from '../../sidow/window/WindowOptions';
import samilEnums from '../../enums/SamilEnums';
import modalWindowManager from './ModalWindowManager';
import SamilPanelContentComponents from '../../sidow/samilPanel/SamilPanelContentComponents';
import SamilPanel from '../../sidow/samilPanel/SamilPanelView';
import WindowAction from '../../sidow/window/windowAction/WindowAction';

import ClientDataSet from '../../vedas/ClientDataSet';
import DataSource from '../../vedas/dataSource/DataSource';
import MetaDataSource from '../../vedas/MetaDataSource/MetaDataSource';

const BASIC_INFO_ID = 'basic-data';

var dataSet;

export function showModalWindowSample() {
    var dto = service.replace('Service', 'Dto');
    dataSet = new ClientDataSet(service, dto);

    dataSet.initialize().then(def => {
        let windowOptions = new WindowOptions('Nowy', 'Kontrahenci', 'Edycja kontrahentów');

        let sendAction = new WindowAction({
            id: 'send-action',
            text: 'Wyślij',
            state: samilEnums.BUTTON_STATES.SUCCESS,
            icon: samilEnums.ICONS.CHECK
        });

        let window = new Window('Operator', windowOptions);
        let bodyArea = new WindowArea('body');

        let customerBasicInfo = new SamilPanelContentComponents({
            model: OPERATOR_BASIC_INFO_XML,
            dataSource: getDataSource(def)
        });

        let panel = new SamilPanel(BASIC_INFO_ID, customerBasicInfo);

        bodyArea.addComponent(panel);

        window.addBody(bodyArea);
        window.addAction(sendAction);

        modalWindowManager.show(window);
    });
}

//operator
let service = 'pl.com.stream.verto.cmm.operator.server.pub.main.OperatorService';
let OPERATOR_BASIC_INFO_XML = `
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Root version="1">
   <Container dataset-binding="operator">
       <Row>
           <Component id="firstName"/>
           <Component id="lastName"/>
       </Row>
       <Component id="panelSeparator1" class="separator"/>
       <Row>
           <Component id="login"/>
           <Spring />
           <Component id="loginByExternalSystem"/>
       </Row>
       <Row>
           <Component id="loginByRfid"/>
       </Row>
       <Row>
           <Component id="rfidCardNr" template="password" occupyx="1"/>
           <Spring expandx="1"/>
       </Row>
       <Component id="changePassword"/>
       <Row>
           <Component id="password" template="password"/>
           <Spring/>
       </Row>
       <Row>
           <Component id="retypePassword" template="password"/>
           <Spring/>
       </Row>
       <Component id="passwordChangeRequired"/>
       <Row>
           <Component id="idPasswordRule" occupyx="2"/>
           <Spring expandx="1"/>
       </Row>
       <Component id="panelSeparator2" class="separator"/>
       <Row>
           <Component id="idOperatorGroup"/>
           <Component id="idOperatorProfile"/>
       </Row>
       <Component id="panelSeparator5" class="separator"/>
       <Component id="allowMultipleLogin"/>
       <Component id="active"/>
   </Container>
</Root>
`;

function getDataSource(def) {
    var dataSets = [def];
    var metaDataSource = new MetaDataSource(dataSets);
    var customerDataSource = new DataSource(metaDataSource);
    customerDataSource.addDataSet(dataSet);
    return customerDataSource;
}
