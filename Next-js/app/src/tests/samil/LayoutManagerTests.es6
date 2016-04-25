/**
 * Created by bstanislawski on 2016-02-29.
 */
import GUITreeFactory from '../../samil/GUITree/GUITreeFactory';
import GUIComponentFactoryRegistry from '../../samil/GUIComponentFactory/GUIComponentFactoryRegistry';
import samilEnums from '../../enums/SamilEnums';

import DataSource from '../../vedas/dataSource/DataSource';
import MetaDataSource from '../../vedas/MetaDataSource/MetaDataSource';
import ClientDataSet from '../../vedas/ClientDataSet';

import samilCommonMethods from '../../samil/SamilCommonMethods';
import samilWorkspace from '../../samil/samil_workspace.hbs';

const EXPAND_ZERO = 0;
const EXPAND_TWO = 2;
const CHARS_ATTR = 10;
const INPUT_PREFERRED_WIDTH = 14;
const CHECKBOX_PREFERRED_WIDTH = 2;

var $workspace, contentWorkspace, guiComponentTree;
var service = 'pl.com.stream.verto.cmm.operator.server.pub.main.OperatorService';
var xml = `
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Root version="1">
    <Container id="container1" dataset-binding="operator">
        <Row id="row1">
            <Component id="firstName" expand="${EXPAND_ZERO}" chars="${CHARS_ATTR}" fill="none" />
            <Component id="lastName" />
            <Container id="container2">
                <Component id="retypePassword" />
            </Container>
        </Row>
        <Row id="row2">
            <Component id="password" expand="${EXPAND_TWO}" />
            <Component id="loginByExternalSystem" />
        </Row>
        <Row id="row3">
            <Component id="retypePassword" />
            <Component id="loginByRfid" />
      </Row>
    </Container>
</Root>
`;

class LayoutManagerTests {

    run() {
        describe('Start SAMIL Layout Manager Tests..', function () {

            before(done => {
                var htmlElement = samilWorkspace({});

                $('#workspace').html(htmlElement);

                $workspace = $('#samil-workspace');

                let dto = service.replace('Service', 'Dto');
                let dataSet = new ClientDataSet(service, dto);

                if (guiComponentTree) {
                    guiComponentTree.dispose();
                }

                $workspace.removeClass('hidden');

                dataSet.initialize().then((def)=> {
                    var dataSets = [def];
                    var metaDataSource = new MetaDataSource(dataSets);
                    var dataSource = new DataSource(metaDataSource);

                    dataSource.addDataSet(dataSet);

                    let guiTree = GUITreeFactory.parseXmlToGUITree(xml.trim());

                    guiTree.setName('testName');
                    guiTree.setMetaDataSource(dataSource.metaDataSource);

                    guiComponentTree = GUIComponentFactoryRegistry.createGUIComponentTree(guiTree);

                    guiComponentTree.bindDataSource(dataSource);
                    guiComponentTree.renderTo($workspace);

                    contentWorkspace = $('#workspace .tab-content');
                }).then(done, done);
            });

            after(() => {
                $workspace.addClass('hidden');
            });

            describe('Basic elements creation tests..', function () {

                it('Row Component should add all the necessary attributes to its children', () => {
                    //given - get all the rows
                    var mainContainerRows = guiComponentTree.components[0].children;
                    mainContainerRows.forEach(row => {

                        //when - get all the components in the rows
                        row.children.forEach(component => {

                            //then - expect that all the attributes are added
                            expect(component.guiModel.inRow).to.be.true;
                            expect(component.parentRow).to.be.equal(row);
                        });
                    });
                });

                it('should set the attributes from the xml definition', () => {
                    //given - get the example components
                    let mainContainerChildren = guiComponentTree.components[0].children;
                    let firstNameComponent = mainContainerChildren[0].children[0];
                    let passwordComponent = mainContainerChildren[1].children[0];

                    //then - check if the expand and chars attributes has been set
                    expect(firstNameComponent.guiModel.expand).to.be.equal(EXPAND_ZERO);
                    expect(firstNameComponent.guiModel.chars).to.be.equal(CHARS_ATTR);
                    expect(passwordComponent.guiModel.expand).to.be.equal(EXPAND_TWO);
                });

                it('should set the default preferredWidth for all the component types', () => {
                    //given - get all the rows
                    var mainContainerChildren = guiComponentTree.components[0].children;

                    //then - get the rows elements
                    mainContainerChildren.forEach(row => {
                        row.children.forEach(component => {

                            //when - expect components have set preferred width
                            if (component.isInput) {
                                expect(component.guiModel.preferedWidth).to.be.equal(INPUT_PREFERRED_WIDTH);
                            }
                            if (component.isCheckbox) {
                                expect(component.guiModel.preferedWidth).to.be.equal(CHECKBOX_PREFERRED_WIDTH);
                            }
                        });
                    });
                });

            });

            describe('Container sizeArray tests..', function () {

                it('sizeArray should be create for all the containers', () => {
                    //given - get all the rows
                    var mainContainer = guiComponentTree.components[0];
                    var mainContainerChildren = mainContainer.children;
                    var numberOfContainers = 1;

                    //when - count the containers in rows
                    mainContainerChildren.forEach(row => {
                        row.children.forEach(rowElement => {
                            if (rowElement.isContainer) {
                                numberOfContainers++;
                            }
                        });
                    });

                    //then - expect that layoutManger got all the containers
                    expect(numberOfContainers).to.be.equal(guiComponentTree.layoutManager.containersArray.length);
                });

                it('should use the autoExpand method on the last element', () => {
                    //given
                    var rootContainer = guiComponentTree.components[0];
                    var rootContainerChildren = rootContainer.children;
                    let rowElement = rootContainerChildren[2];

                    rowElement.children.forEach(component => {

                        //when - get the last component in the 'row3'
                        if (component.guiModel.lastElement) {

                            //then - check if autoExpand function has been fired
                            expect(component.guiModel.inputSize).to.be.above(component.guiModel.beforeAutoExpandInputSize);
                        }
                    });
                });
            });

            describe('Layout Manager main tests..', function () {

                it('should be sure that any rows size is smaller or equal to MAX_ROW_SIZE(100 - number of the bootstrap columns in row)', () => {
                    //given - get all the elements in the root container
                    var rootContainerChildren = guiComponentTree.components[0].children;
                    rootContainerChildren.forEach(row => {
                        var rowSum = 0;
                        row.children.forEach(component => {

                            //when - sum all elements sizes
                            if (!component.noLabel) {
                                rowSum += component.guiModel.labelSize;
                            }
                            if (!component.noField) {
                                rowSum += component.guiModel.inputSize;
                            }
                        });

                        //then - expect any sum is smaller the MAX_ROW_SIZE
                        expect(rowSum).to.be.at.most(samilEnums.BOOTSTRAP.ROW_MAX_SIZE);
                    });
                });

                it('rendered text should has the same size as the assume min label size', () => {
                    //given - get the example components
                    var mainContainerChildren = guiComponentTree.components[0].children;
                    var firstNameComponent = mainContainerChildren[0].children[0];
                    var passwordComponent = mainContainerChildren[1].children[0];

                    //when - set the fields text on components and measure it
                    var firstNameLabel = firstNameComponent.field.label;
                    var passwordLabel = passwordComponent.field.label;

                    if (firstNameLabel === undefined) {
                        firstNameLabel = firstNameComponent.id;
                    }
                    if (passwordLabel === undefined) {
                        passwordLabel = passwordComponent.id;
                    }

                    let firstNameMinLabelSizeInPx = samilCommonMethods.getWidthOfText(firstNameLabel);
                    let passwordMinLabelSizeInPx = samilCommonMethods.getWidthOfText(passwordLabel);
                    let firstNameMinLabelSizeInBootstrapUnit = samilCommonMethods.getSizeInBootstrapUnit(firstNameMinLabelSizeInPx);
                    let passwordMinLabelSizeInBootstrapUnit = samilCommonMethods.getSizeInBootstrapUnit(passwordMinLabelSizeInPx);

                    //then - expect that rendered text is the same size as the assume min label size
                    expect(firstNameComponent.guiModel.minLabelSize).to.be.equal(firstNameMinLabelSizeInBootstrapUnit);
                    expect(passwordComponent.guiModel.minLabelSize).to.be.equal(passwordMinLabelSizeInBootstrapUnit);
                });

                it('should use auto expand', () => {
                    //when - get the root container
                    var rootContainerChildren = guiComponentTree.components[0].children;

                    //then - get last element in row
                    var lastElementInRow;
                    rootContainerChildren[2].children.forEach(rowElement => {
                        if (rowElement.guiModel.lastElement) {
                            lastElementInRow = rowElement;
                        }
                    });

                    //then - check if autoExpand has been set
                    expect(lastElementInRow.guiModel.inputSize).to.be.above(lastElementInRow.guiModel.beforeAutoExpandInputSize);
                });

                it('should not fill all possible space when fill="none" attribute is set', () => {
                    //given - get the example firstNameComponent
                    var mainContainerChildren = guiComponentTree.components[0].children;
                    var firstNameComponent = mainContainerChildren[0].children[0];

                    //when - check the fill="none" attribute is set
                    expect(firstNameComponent.guiModel.fill).to.be.equal('none');

                    //then - should not fill all possible space
                    expect(firstNameComponent.guiModel.inputSize).to.be.above(firstNameComponent.guiModel.insideSize);
                });

            });
        });
    }

}

export default LayoutManagerTests;
