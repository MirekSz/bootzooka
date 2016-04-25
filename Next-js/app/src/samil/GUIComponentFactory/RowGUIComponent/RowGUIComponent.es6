/**
 * Created by bstanislawski on 2015-12-11.
 */
import BaseGUICompositeComponent from '../../BaseGUICompositeComponent';

import samilEnums from '../../../enums/SamilEnums';

import RowGUIComponentViewController from './RowGUIComponentViewController';
import defaultPropertiesRegistry from '../../DefaultPropertiesRegistry';

class RowGUIComponent extends BaseGUICompositeComponent {

    constructor(element) {
        super(element);

        this.controller = new RowGUIComponentViewController(this);
        this.isRow = true;
        this.columnsNumber = 0;
    }

    calculateGridImpl() {
        this.setGuiAttributes();

        this.markChildrenAsInRow();
        this.calculateChildrenGrid();
    }

    calculateChildrenGrid() {
        var columnSize = Math.floor(samilEnums.BOOTSTRAP.ROW_MAX_SIZE / this.columnsNumber);
        var numberOfElements = this.calculateNumberOfElements();
        var spaceAvailable = samilEnums.BOOTSTRAP.ROW_MAX_SIZE - (numberOfElements.springs * 10) - (columnSize * numberOfElements.labels);
        var equalInputSize = Math.floor(spaceAvailable / numberOfElements.fields);

        if (equalInputSize === 0) equalInputSize = 10;
        if (numberOfElements.fields === 0) this.onlyLabelsRow = true;
        if (numberOfElements.labels === 0) this.onlyFieldsRow = true;
        if (numberOfElements.fields === 0 && numberOfElements.labels === 0) this.emptyRow = true;

        this.numberOfColumn = 0;

        var freeRoomFromCheckboxes = 0;
        var numberOfCheckboxes = 0;
        var checkboxSize = defaultPropertiesRegistry.preferedSizes.CHECKBOX;
        this.children.forEach(child => {
            if (child.isCheckbox) {
                freeRoomFromCheckboxes += equalInputSize - checkboxSize;
                child.guiModel.inputSize = checkboxSize;
                numberOfCheckboxes++;
            }
        });

        var numberOfNoCheckboxElements = numberOfElements.fields - numberOfCheckboxes;
        if (numberOfNoCheckboxElements > 0 && freeRoomFromCheckboxes > 0) {
            equalInputSize += Math.round(freeRoomFromCheckboxes / numberOfNoCheckboxElements);
        }


        this.children.forEach(child => {
            var childGUIModel = child.guiModel;

            //'noExpand' elements should have preferred size by default
            var childExpand = child.def.attributes.get('expand');
            if (childExpand == 0 && !child.isCheckbox && !child.isContainer) {
                if (equalInputSize < child.guiModel.preferedWidth) {
                    childGUIModel.inputSize = equalInputSize;
                } else {
                    childGUIModel.inputSize = child.guiModel.preferedWidth;
                }
            } else {
                if (!child.isCheckbox) {
                    childGUIModel.inputSize = equalInputSize;
                }
            }

            childGUIModel.columnSize = columnSize;

            if (numberOfElements.fields < 2 && numberOfElements.fields > 0) childGUIModel.onlyOneFieldInRow = true;
        });

        this.controller.handleCaseWhenOnlyCheckboxesInContainer();
        this.controller.handleExpandsIfOnlyContainersRow();
    }

    preventSizesSumInMax100() {
        this.controller.preventSizesSumIsMax100();
    }

    renderTo(target) {
        //this.addEmptyRowsIfNecessary();

        this.target = $(target);
        this.renderChildren();

        this.doAfterRender(this.target);
    }

    setGuiAttributesImpl() {
        this.numberOfColumn = this.controller.getNumberOfColumnsInRow(this);
    }

    calculateNumberOfElements() {
        var labelCounter = 0;
        var fieldCounter = 0;
        var springCounter = 0;
        this.children.forEach(child => {
            if (child.hasLabel()) {
                labelCounter++;
            }

            if (child.hasField()) {
                fieldCounter++;
            }
            if (child.isContainer) {
                fieldCounter++;
            }
        });
        return {labels: labelCounter, fields: fieldCounter, springs: springCounter};
    }

    setColumnNumbers() {
        var self = this;
        this.children.forEach(child => {
            if (child.isSpring) {
                var occupyX = parseInt(child.def.attributes.get('occupyx'));

                child.guiModel.labelColumnNumber = self.numberOfColumn;

                if (occupyX > 1) {
                    self.columnsNumber += occupyX;
                    self.numberOfColumn += occupyX;
                } else {
                    self.columnsNumber++;
                    self.numberOfColumn++;
                }
            } else {
                if (child.hasLabel()) {
                    child.guiModel.labelColumnNumber = self.numberOfColumn;
                    self.columnsNumber++;
                    self.numberOfColumn++;
                }
                if (child.hasField()) {
                    child.guiModel.fieldColumnNumber = self.numberOfColumn;
                    self.columnsNumber++;
                    self.numberOfColumn++;
                }
                if (child.isContainer) {
                    child.guiModel.fieldColumnNumber = self.numberOfColumn;
                    self.columnsNumber++;
                    self.numberOfColumn++;
                }
            }
        });
    }

    isContainingOnlyCheckboxes() {
        var result = true;

        if (this.hasChildren()) {
            this.children.forEach(child => {
                if (!child.isCheckbox) {
                    result = false;
                }
            });
        } else {
            return false;
        }

        return result;
    }

    /**
     * @private
     */
    markChildrenAsInRow() {
        var childrenAmount = this.children.length;

        this.children.forEach((child, index)=> {
            child.guiModel.inRow = true;
            child.parentRow = this;

            if (index + 1 === childrenAmount) {
                child.guiModel.lastElement = true;
            }
        });
    }

    addEmptyRowsIfNecessary() {
        if (this.onlyContainersRow) {
            var biggestContainer = this.getBiggestContainer();

            this.children.forEach(container => {
                var containerChildrenLength = container.children.length;

                if (containerChildrenLength < biggestContainer) {
                    var diff = biggestContainer - containerChildrenLength;

                    for (var index = 0; index < diff; index++) {
                        container.addEmptyRow();
                    }
                }
            });
        }
    }

    getBiggestContainer() {
        var biggestContainer = 0;

        this.children.forEach(container => {
            var containerRowsNumber = container.containerRowsNumber;

            container.containersList.forEach(childContainer => {
                containerRowsNumber += childContainer.containerRowsNumber;
            });

            if (containerRowsNumber > biggestContainer) {
                biggestContainer = containerRowsNumber;
            }
        });

        return biggestContainer;
    }
}

export default RowGUIComponent;
