/**
 * Created by bstanislawski on 2015-12-11.
 */
import samil_workspace from '../../samil/samil_workspace.hbs';
import GUITreeFactory from '../../samil/GUITree/GUITreeFactory';
import GUIComponentFactoryRegistry from '../../samil/GUIComponentFactory/GUIComponentFactoryRegistry';
import mockManager from './MockManager';
import dataSourceRegistry from '../../vedas/dataSource/DataSourceRegistry'

import metaDataSourceFactory from '../../vedas/MetaDataSource/MetaDataSourceFactory';
import dataSourceFactory from '../../vedas/dataSource/DataSourceFactory';

import GUIComponentTreeDef from '../../samil/GUIComponentTreeDef/GUIComponentTreeDef';
import GUITree from '../../samil/GUITree/GUITree';
import ContainerGUIComponent from '../../samil/GUIComponentFactory/ContainerGUIComponent/ContainerGUIComponent';
import RowGUIComponent from '../../samil/GUIComponentFactory/RowGUIComponent/RowGUIComponent';
import InputGUIComponent from '../../samil/GUIComponentFactory/InputGUIComponent/InputGUIComponent';
import GUIElementDef from '../../samil/GUITree/GUIElementDef';
import samilEnums from '../../enums/SamilEnums';

const TEST_XML_URL = './app/src/samples/samil/test.xml';

var guiComponentTree;

export function showSamilEditor() {
    var workspace = '#samil-workspace';
    var htmlElement = samil_workspace({});

    $('#workspace').html(htmlElement);

    var $workspace = $(workspace);
    var contentWorkspace = $workspace.find('.tab-content');

    mockManager.getXML(TEST_XML_URL).then(data => {
        $('#input-xml').val(data.text);

        $workspace.removeClass('hidden');

        var editor = CodeMirror.fromTextArea($workspace.find('textarea')[0], {
            lineNumbers: true,
            height: '350px',
            continuousScanning: 500,
            matchBrackets: true
        });

        $workspace.find('#btn-convert').click(() => {
            handleButton(contentWorkspace, editor);
        });

        $('#create-form-by-hand').click(() => {
            handleButton(contentWorkspace, editor, true);
        });

        $('#toggle-debug-mode').click(() => {
            $('#samil-workspace').toggleClass('debug-mode');
            $('#toggle-debug-mode').toggleClass('enabled');
        });
    });
}

function handleButton(contentWorkspace, editor, isByHand) {
    var name = $('.name-input').find('input').val();
    var xml = editor.getValue().trim();

    if (guiComponentTree) {
        guiComponentTree.dispose();
    }

    dataSourceRegistry.getDataSource().then(data => {
        var dataSets = [data.responseObject];
        var metaDataSource = metaDataSourceFactory.createMetaDataSource(dataSets);
        var dataSource = dataSourceFactory.createDataSource(metaDataSource);

        mainFlow(dataSource, contentWorkspace, name, xml, isByHand);
    });
}

function mainFlow(dataSource, workspace, name, xml, isByHand) {
    var guiTree;

    if (isByHand) {
        guiTree = new GUITree();
        guiTree.setModel(createModelByHand());
    } else {
        guiTree = GUITreeFactory.parseXmlToGUITree(xml);
    }

    guiTree.setName(name);
    guiTree.setMetaDataSource(dataSource.metaDataSource);

    guiComponentTree = GUIComponentFactoryRegistry.createGUIComponentTree(guiTree);

    guiComponentTree.bindDataSource(dataSource);
    guiComponentTree.renderTo(workspace);
}

function createModelByHand() {
    var rootElement = new GUIElementDef('root', samilEnums.XML_ELEMENTS.ROOT);
    var containerDef = new GUIElementDef('container1', samilEnums.XML_ELEMENTS.CONTAINER);

    containerDef.setGroupBinding('operator');

    var rowDef = new GUIElementDef('row1', samilEnums.XML_ELEMENTS.ROW);
    var row2Def = new GUIElementDef('row2', samilEnums.XML_ELEMENTS.ROW);
    var row3Def = new GUIElementDef('row3', samilEnums.XML_ELEMENTS.ROW);

    var firstNameComponentDef = new GUIElementDef('firstName', samilEnums.XML_ELEMENTS.COMPONENT);
    var lastNameComponentDef = new GUIElementDef('lastName', samilEnums.XML_ELEMENTS.COMPONENT);
    var loginByExternalSystemDef = new GUIElementDef('loginByExternalSystem', samilEnums.XML_ELEMENTS.COMPONENT);
    var passwordDef = new GUIElementDef('password', samilEnums.XML_ELEMENTS.COMPONENT);

    var container2Def = new GUIElementDef('container2', samilEnums.XML_ELEMENTS.CONTAINER);
    var occupationComponentDef = new GUIElementDef('occupation', samilEnums.XML_ELEMENTS.COMPONENT);

    var salaryComponentDef = new GUIElementDef('salary', samilEnums.XML_ELEMENTS.COMPONENT);

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
