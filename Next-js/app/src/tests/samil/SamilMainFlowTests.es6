/**
 * Created by bartosz on 20.05.15.
 *
 * Element Factory Test
 */
'use strict';

import GUITreeFactory from '../../samil/GUITree/GUITreeFactory';
import GUIComponentFactoryRegistry from '../../samil/GUIComponentFactory/GUIComponentFactoryRegistry';
import MetaDataSource from '../../vedas/MetaDataSource/MetaDataSource';
import ClientDataSet from '../../vedas/ClientDataSet';
import DataSource from '../../vedas/dataSource/DataSource';
import samilWorkspace from '../../samil/samil_workspace.hbs';

const NAME = 'name';
const ROOT = 'root';
const GUI_TREE_CLASS = 'GUITree';
const GUI_COMPONENT_TREE_CLASS = 'GUIComponentTree';
const ROW_GUI_COMPONENT = 'RowGUIComponent';
const META_DATA_SOURCE_TYPE = 'MetaDataSource';

const service = 'pl.com.stream.verto.cmm.operator.server.pub.main.OperatorService';
const xml = `
<?xml version="1.0" encoding="UTF-8"?>
<Root>
    <Container dataset-binding="addressType">
        <Row>
            <Component id="firstName" fill="horizontal"/>
            <Component id="lastName" fill="vertical"/>
        </Row>
        <Component id="idOperatorGroup" occupyy="2"/>
        <Component id="birthDate"/>
        <Component id="separatorTest" class="separator"/>
        <Component id="salary" occupyx="2" occupyy="2"/>
        <Component id="active"/>
    </Container>
</Root>
`;

var contentWorkspace = $('#samil-workspace .tab-content');

class SamilMainFlowTests {

    run() {
        describe('Start SAMIL main flow Tests..', function () {
            var guiTree;

            before(() => {
                let xmlModel = xml.trim();
                guiTree = GUITreeFactory.parseXmlToGUITree(xmlModel);
            });

            describe('Create the GUITreeElement...', function () {

                it('should import XML correctly', () => {
                    expect(xml).to.not.be.equal(undefined);
                });

                it('should create the proper GUITree object', () => {
                    expect(guiTree).to.not.be.equal(undefined);

                    let isInstanceOfGUITree = (guiTree.constructor.name === GUI_TREE_CLASS);

                    expect(isInstanceOfGUITree).to.be.eq(true);

                    guiTree.setName(NAME);

                    expect(guiTree.name).to.be.equal(NAME);
                });

                it('should convert XML correctly', () => {
                    expect(guiTree.getStringXML()).to.not.be.equal(undefined);
                });

                it('should create the proper model', () => {
                    var model = guiTree.getModel();

                    expect(model.length).to.be.equal(1);
                    expect(model[0].type === ROOT).to.be.eq(true);
                });

                it('should create a GUIComponentTree', done => {
                    const expectedNumberOfRootsChildren = 6;

                    let htmlElement = samilWorkspace({});

                    $('#workspace').html(htmlElement);

                    let $workspace = $('#samil-workspace');

                    let dto = service.replace('Service', 'Dto');
                    let dataSet = new ClientDataSet(service, dto);

                    $workspace.removeClass('hidden');

                    dataSet.initialize().then((def)=> {
                        var dataSets = [def];
                        var metaDataSource = new MetaDataSource(dataSets);
                        var dataSource = new DataSource(metaDataSource);

                        dataSource.addDataSet(dataSet);

                        guiTree.setMetaDataSource(metaDataSource);

                        let guiTreeMetaDataSource = guiTree.getMetaDataSource();

                        expect(guiTreeMetaDataSource.constructor.name).to.be.eq(META_DATA_SOURCE_TYPE);

                        let guiComponentTree = GUIComponentFactoryRegistry.createGUIComponentTree(guiTree);
                        let rowElement = guiComponentTree.components[0].children[0];

                        let isInstanceOfGUIComponentTree = (guiComponentTree.constructor.name === GUI_COMPONENT_TREE_CLASS);
                        let isRowGUIComponent = (rowElement.constructor.name === ROW_GUI_COMPONENT);
                        let hasRowChildren = (rowElement.children.length > 0);
                        let isThereRoot = (guiComponentTree.components.length === 1);
                        let rootNumberOfChildren = guiComponentTree.components[0].children.length;

                        expect(isInstanceOfGUIComponentTree).to.be.eq(true);
                        expect(isThereRoot).to.be.eq(true);
                        expect(rootNumberOfChildren).to.be.eq(expectedNumberOfRootsChildren);
                        expect(isRowGUIComponent).to.be.eq(true);
                        expect(hasRowChildren).to.be.eq(true);
                    }).then(done, done);
                });

            });
        });
    }

}

export default SamilMainFlowTests;
