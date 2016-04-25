/**
 * Created by bstanislawski on 2016-03-18.
 */
import dataSourceRegistry from '../../vedas/dataSource/DataSourceRegistry';

import metaDataSourceFactory from '../../vedas/MetaDataSource/MetaDataSourceFactory';
import dataSourceFactory from '../../vedas/dataSource/DataSourceFactory';

import Window from '../../sidow/window/windows/FormWindow';
import WindowArea from '../../sidow/window/windowArea/WindowArea';
import WindowOptions from '../../sidow/window/WindowOptions';

import types from '../../enums/ComponentsDefinitionsTypes';
import samilEnums from '../../enums/SamilEnums';

import ViewComponentDef from '../../componentsDefinitions/ViewComponentDef';
import ComponentsFactory from '../../components/ComponentsFactory';
import componentsDefinitionsTypes from '../../enums/ComponentsDefinitionsTypes';

import SamilPanel from '../../sidow/samilPanel/SamilPanelView';

import SamilPanelContentComponents from '../../sidow/samilPanel/SamilPanelContentComponents';
import WindowAreaContentExtraOptions from '../../sidow/window/WindowAreaContentExtraOptions';

import WindowAreaView from '../../sidow/window/windowArea/WindowAreaView';

import defJSON from './def.json';
const OPERATOR_BASIC_INFO_XML = `
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
const OPERATOR_ADD_INFO_XML = `
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Root version="1">
    <Container dataset-binding="operator">
        <Row>
            <Component id="idLicenseLoginPack" occupyx="2"/>
            <Spring expandx="1"/>
        </Row>
        <Row>
            <Component id="idWorktimePattern" occupyx="2"/>
            <Spring expandx="1"/>
        </Row>
        <Row>
            <Component id="idOperatorAssistant" occupyx="2"/>
            <Spring expandx="1"/>
        </Row>
        <Row>
            <Component id="idStrategy" occupyx="2">
                <Property name="strategyType" binding="flag.operator.idStrategyType"/>
            </Component>
            <Spring expandx="1"/>
        </Row>
    </Container>
</Root>
`;
const WINDOW_ID = 'Operator';
const WINDOW_AREA_ID = 'body';
const BASIC_INFO_ID = 'basic-data';
const ADD_INFO_ID = 'additional-data';
const SAMIL_PANEL_VIEW = types.VIEWS.SAMIL_PANEL_VIEW;
const PANEL_ID = 'Nowy';
const WINDOW_TYPE = 'Window';
const WINDOW_AREA_TYPE = 'WindowArea';

var addInfoContentComponents, basicContentComponents, dataSource, windowPanelComponent;
let windowOptions = new WindowOptions('Nowy', 'Kontrahenci', 'Edycja kontrahentów');
var basicOptions = new WindowAreaContentExtraOptions({
    name: 'Dane podstawowe'
});
var additionalOptions = new WindowAreaContentExtraOptions({
    name: 'Dane rozszerzone',
    icon: samilEnums.ICONS.CHECK
});
var windowObject;
class WindowTests {

    run() {

        describe('Start SIDOW Window tests', () => {

            before(function () {
                var dataSets = [defJSON.responseObject];
                var metaDataSource = metaDataSourceFactory.createMetaDataSource(dataSets);
                dataSource = dataSourceFactory.createDataSource(metaDataSource);

                basicContentComponents = new SamilPanelContentComponents({
                    model: OPERATOR_BASIC_INFO_XML,
                    dataSource: dataSource
                });
                addInfoContentComponents = new SamilPanelContentComponents({
                    model: OPERATOR_ADD_INFO_XML,
                    dataSource: dataSource
                });
            });

            it('should create window', () => {
                //given
                expect(dataSource).to.not.be.equal(undefined);

                //when
                let window = new Window(WINDOW_ID, windowOptions);

                //then
                expect(window.id).to.be.equal(WINDOW_ID);
                expect(window.options.title).to.be.equal(windowOptions.title);
                expect(window.options.subTitle).to.be.equal(windowOptions.subTitle);
            });

            it('should add windowArea and its components to the window', () => {
                //given
                var bodyArea = new WindowArea(WINDOW_AREA_ID);
                var basicInfoWindowAreaComponent = new SamilPanel(BASIC_INFO_ID, basicContentComponents, basicOptions);
                var addInfoWindowAreaComponent = new SamilPanel(ADD_INFO_ID, addInfoContentComponents, additionalOptions);
                windowObject = new Window(WINDOW_ID, windowOptions);

                //when
                bodyArea.addComponent(basicInfoWindowAreaComponent);
                bodyArea.addComponent(addInfoWindowAreaComponent);
                windowObject.addBody(bodyArea);

                //then
                let windowBody = windowObject.body;
                expect(windowBody.id).to.be.equal(WINDOW_AREA_ID);

                let samilPanels = windowBody.components;

                expect(samilPanels.get(BASIC_INFO_ID)).to.be.equal(basicInfoWindowAreaComponent);
                expect(samilPanels.get(ADD_INFO_ID)).to.be.equal(addInfoWindowAreaComponent);
            });

            it('should initialize so the first windowAreaComponent should be activate and visible', () => {
                //given
                let windowBody = windowObject.body;
                let samilPanels = windowBody.components;

                //when
                windowObject.init();
                let basicInfoWindowAreaComponent = samilPanels.get(BASIC_INFO_ID);

                //then
                expect(basicInfoWindowAreaComponent.isActivate).to.be.equal(true);
                expect(basicInfoWindowAreaComponent.isVisible).to.be.equal(true);
                expect(basicInfoWindowAreaComponent.isRendered).to.be.equal(false);
            });

            it('should create GUIComponentTree in the windowAreaComponent', () => {
                //given
                var windowArea = windowObject.body;
                var windowBodyAreaComponents = windowArea.components;
                var basicWindowAreaComponent = windowBodyAreaComponents.get(BASIC_INFO_ID);

                //when
                var basicWindowAreaComponentContentElement = basicWindowAreaComponent.content;

                //then
                //content element should be created and be an instance of GUIComponentTree
                expect(basicWindowAreaComponentContentElement.constructor.name).to.be.equal(types.FACTORY_TYPES.GUI_COMPONENT_TREE);
                expect(basicWindowAreaComponentContentElement.id).to.be.equal(BASIC_INFO_ID);
                expect(basicWindowAreaComponentContentElement.components).to.not.be.equal(undefined);
            });

            it('should switch the windowArea and change the state attributes of basicInfoView', () => {
                //given
                var bodyArea = windowObject.body;
                var windowAreaView = new WindowAreaView(bodyArea);
                var basicInfoView = bodyArea.components.get(BASIC_INFO_ID);

                basicInfoView.renderTo = function () {
                    this.isRendered = true;
                };

                basicInfoView.isActivate = false;
                basicInfoView.isVisible = false;
                basicInfoView.isRendered = false;

                //when
                // basicInfoView will be shown now..
                windowAreaView.switchViews(basicInfoView);

                //then
                expect(basicInfoView.isActivate).to.be.equal(true);
                expect(basicInfoView.isVisible).to.be.equal(true);
                expect(basicInfoView.isRendered).to.be.equal(true);
            });

            it('should switch views to active and then to deactive again not destroying the view, just hide them', () => {
                //given
                var bodyArea = windowObject.body;
                var windowAreaView = new WindowAreaView(bodyArea);
                var basicInfoView = bodyArea.components.get(BASIC_INFO_ID);
                var addInfoView = bodyArea.components.get(ADD_INFO_ID);

                basicInfoView.renderTo = function () {
                    this.isRendered = true;
                };
                addInfoView.renderTo = function () {
                    this.isRendered = true;
                };

                //when - switch the the basicInfoView and go back again to the addInfoView
                windowAreaView.switchViews(basicInfoView, '');
                windowAreaView.switchViews(addInfoView, '');

                //then
                expect(basicInfoView.isVisible).to.be.equal(false);
                expect(basicInfoView.isActivate).to.be.equal(false);
                expect(basicInfoView.isRendered).to.be.equal(true);

                expect(addInfoView.isVisible).to.be.equal(true);
                expect(addInfoView.isVisible).to.be.equal(true);
                expect(addInfoView.isVisible).to.be.equal(true);
            });

        });

    }

}

export default WindowTests;
