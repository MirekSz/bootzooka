/**
 * Created by bstanislawski on 2016-01-29.
 */
import samilEnums from '../../enums/SamilEnums';
import defaultPropertiesRegistry from '../DefaultPropertiesRegistry';
import SizeArrayManager from './SizeArrayManager';

class LayoutManager {

    /**
     * @param {GUIComponentTree} tree
     */
    constructor(tree) {
        this.currentMaxElementsInRow = 1;
        this.isSomeRow = false;
        this.bootstrapMaxSize = samilEnums.BOOTSTRAP.ROW_MAX_SIZE;
        this.tree = tree;
        this.numberOfColumns = 0;
    }

    getBasicInputSizes() {
        var field, label, result;
        var self = this;

        this.tree.components.forEach(component => {
            if (component.hasChildren()) {
                component.children.forEach(child => {
                    self.calculateChild(child);
                });

                if (self.currentMaxElementsInRow === 1) {
                    label = samilEnums.BOOTSTRAP.START_LABEL_LENGTH_IN_PERCENTAGE;
                    field = samilEnums.BOOTSTRAP.START_FIELD_LENGTH_IN_PERCENTAGE;
                } else {
                    self.basicInputElementSize = Math.floor(self.bootstrapMaxSize / self.currentMaxElementsInRow);
                    label = Math.floor(self.basicInputElementSize * samilEnums.BOOTSTRAP.LABEL_LENGTH_IN_PERCENTAGE);
                    field = Math.floor(self.basicInputElementSize * samilEnums.BOOTSTRAP.FIELD_LENGTH_IN_PERCENTAGE);

                    //get the rest and add it to the field size
                    var blankSpace = self.basicInputElementSize - (label + field);

                    if (blankSpace > 0) {
                        if (label === 0) {
                            label += blankSpace;
                        } else {
                            field += blankSpace;
                        }
                    }

                    if (label === 0) label = samilEnums.BOOTSTRAP.START_LABEL_LENGTH_IN_PERCENTAGE;
                }

                result = {
                    label: label,
                    numberOfColumns: Math.floor(self.bootstrapMaxSize / field)
                };
            } else {
                result = {
                    label: 40,
                    numberOfColumns: 1
                };
            }
        });

        return result;
    }

    setLayoutRules() {
        var self = this;
        this.containersArray = this.getMapOfContainers();

        this.containersArray.forEach((container) => {
            var numberOfColumnInContainer = this.getNumberOfColumns(container);
            var containerColumnsMinWidths = this.getColumnsWidths(container, numberOfColumnInContainer);
            var containerElements = container.content;
            var sizeArrayManager = new SizeArrayManager(self);

            this.setColumnsNumber(numberOfColumnInContainer, container);

            container.sizeArray = sizeArrayManager.createSizeArray(containerColumnsMinWidths, containerElements);

            //set the basic elements sizes
            container.content.forEach(element => {
                if (element.type === samilEnums.XML_ELEMENTS.COMPONENT) {
                    this.setElementSizes(element, container);
                } else if (element.type === samilEnums.XML_ELEMENTS.ROW) {
                    element.children.forEach(child => {
                        this.setElementSizes(child, container);
                    });
                }
            });

            //get the sum of the sizes in the rows
            container.placeOccupiedInRows = [];
            container.content.forEach(element => {
                if (element.type === samilEnums.XML_ELEMENTS.COMPONENT) {
                    container.placeOccupiedInRows.push(this.countOccupiedPlace(element));
                } else if (element.type === samilEnums.XML_ELEMENTS.ROW) {
                    var placeOccupiedInRow = 0;
                    element.children.forEach(child => {
                        placeOccupiedInRow += this.countOccupiedPlace(child);
                    });
                    container.placeOccupiedInRows.push(placeOccupiedInRow);
                }
            });
        });
    }

    setOccupyX() {
        this.containersArray.forEach(container => {
            container.content.forEach((element, rowNumber)=> {
                var guiModel = element.guiModel;

                if (element.type === samilEnums.XML_ELEMENTS.COMPONENT) {
                    if (guiModel.class !== samilEnums.COMPONENT_TYPES.SEPARATOR) {
                        if (guiModel.occupyX) {
                            this.executeOccupyXOnComponent(element, guiModel, container, rowNumber);
                        }
                    }
                } else if (element.type === samilEnums.XML_ELEMENTS.ROW) {
                    element.children.forEach(child => {
                        var childGUIModel = child.guiModel;
                        if (childGUIModel.class !== samilEnums.COMPONENT_TYPES.SEPARATOR) {
                            if (childGUIModel.occupyX) {
                                this.executeOccupyXOnComponent(child, childGUIModel, container, rowNumber, true);
                            }
                        }
                    });
                }
            });
        });
    }

    useAutoExpand() {
        this.containersArray.forEach((container) => {
            var numberOfContainers = 0;

            container.content.forEach((element, rowNumber)=> {
                var guiModel = element.guiModel;

                if (element.isContainer) numberOfContainers++;

                if (guiModel.class !== samilEnums.COMPONENT_TYPES.SEPARATOR) {
                    if (((guiModel.expand === undefined || guiModel.expand > 0) && !guiModel.occupyX) || guiModel.useAutoExpand) {
                        if (element.type === samilEnums.XML_ELEMENTS.COMPONENT) {
                            guiModel.beforeAutoExpandInputSize = guiModel.inputSize;
                            guiModel.inputSize += this.getBlankSpace(container, rowNumber - numberOfContainers);

                        } else if (element.type === samilEnums.XML_ELEMENTS.ROW) {
                            //this.executeAutoExpandOnElement(element, rowNumber, container);

                            if (element.hasChildren()) {
                                element.children.forEach(child => {
                                    guiModel = child.guiModel;

                                    if (guiModel.lastElement) {
                                        if (((guiModel.expand === undefined || guiModel.expand > 0) && !guiModel.occupyX) || guiModel.useAutoExpand) {
                                            if (guiModel.expand !== 0) {
                                                guiModel.beforeAutoExpandInputSize = guiModel.inputSize;
                                                guiModel.inputSize += this.getBlankSpace(container, rowNumber - numberOfContainers);
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            });
        });
    }

    /**
     * @private
     */
    getBlankSpace(container, rowNumber) {
        return samilEnums.BOOTSTRAP.ROW_MAX_SIZE - container.placeOccupiedInRows[rowNumber];
    }

    executeAutoExpandOnElement(element, rowNumber, container) {
        var guiModel = element.guiModel;
        if (guiModel.lastElement && !element.isRow) {
            if (((guiModel.expand === undefined || guiModel.expand > 0) && !guiModel.occupyX) || guiModel.useAutoExpand) {
                if (guiModel.expand !== 0) {
                    guiModel.beforeAutoExpandInputSize = guiModel.inputSize;
                    guiModel.inputSize += this.getBlankSpace(container, rowNumber);
                }
            }
        }

        if (element.hasChildren()) {
            element.children.forEach(child => {
                this.executeAutoExpandOnElement(child, rowNumber, container);
            });
        }
    }

    handleFill() {
        this.tree.components.forEach(container => {
            var elements = this.getAllComponentsFromContainer(container);

            elements.forEach(element => {
                var guiModel = element.guiModel;
                var fillAttr = guiModel.fill;

                if (fillAttr === samilEnums.FILL.NONE || fillAttr === samilEnums.FILL.VERTICAL) {
                    if (guiModel.charsSize) {
                        if (guiModel.charsSize < guiModel.inputSize) {
                            guiModel.insideSize = Math.round((guiModel.chars * samilEnums.BOOTSTRAP.ROW_MAX_SIZE) / guiModel.inputSize);
                        }
                    } else {
                        //get preferred width
                        if (guiModel.preferedWidth < guiModel.inputSize) {
                            guiModel.insideSize = Math.round((guiModel.preferedWidth * samilEnums.BOOTSTRAP.ROW_MAX_SIZE) / guiModel.inputSize);
                        }
                    }
                }
            });
        });
    }

    rescaleContainersElements() {
        this.tree.components.forEach(component => {
            this.rescaleContainerChild(component);
        });
    }

    /**
     * @private
     */
    rescaleContainerChild(element, givenScale) {
        var guiModel = element.guiModel;
        var scale = givenScale;

        if (element.isContainer) {
            var containerSize;

            if (guiModel.inputSize) {
                containerSize = guiModel.inputSize;
            } else {
                containerSize = guiModel.containerSize;
            }
            scale = samilEnums.BOOTSTRAP.ROW_MAX_SIZE / containerSize;
        } else if (scale !== 1 && scale !== undefined) {
            if (!element.isRow) {
                if (!element.guiModel.inRow) {
                    guiModel.labelSize = Math.floor(guiModel.labelSize * scale);

                    var inputSize = Math.floor(guiModel.inputSize * scale);

                    if (inputSize + guiModel.labelSize <= samilEnums.BOOTSTRAP.ROW_MAX_SIZE) {
                        guiModel.inputSize = inputSize;
                    } else {
                        guiModel.inputSize = samilEnums.BOOTSTRAP.ROW_MAX_SIZE - guiModel.labelSize;
                    }
                }
            }
        }

        if (element.children !== undefined) {
            element.children.forEach(child => {
                this.rescaleContainerChild(child, scale);
            });
        }
    }

    handleSpecialCases() {
    }

    getElementsFromColumn(containerElements, columnNumber) {
        var result = new Map();
        containerElements.forEach(component => {
            this.setResultMapOnChild(result, component, columnNumber);
        });
        return result;
    }

    /**
     * @private
     */
    setResultMapOnChild(result, child, columnNumber) {
        this.setResultMap(result, child, columnNumber);

        if (child.isRow) {
            child.children.forEach(grandChild => {
                this.setResultMapOnChild(result, grandChild, columnNumber);
            });
        }
    }

    getAbstractNumberOfColumns(container) {
        var self = this;
        self.columnsNumber = container.columnsNumber;

        container.content.forEach(component => {
            if (component.isRow) {
                component.children.forEach(child => {
                    if (child.guiModel.occupyX > 1) {
                        self.columnsNumber += child.guiModel.occupyX - 1;
                    }
                });
            } else {
                if (component.guiModel.occupyX > 1) {
                    self.columnsNumber += component.guiModel.occupyX - 1;
                }
            }
        });

        return self.columnsNumber;
    }

    /**
     * @private
     */
    executeOccupyXOnComponent(element, guiModel, container, rowNumber, inRow) {
        var columnsInContainer = this.getAbstractNumberOfColumns(container);
        var occupyX = guiModel.occupyX;
        var columnNumber = 0;
        var extraOccupiedPlace = 0;

        if (inRow) {
            if (guiModel.fieldColumnNumber + occupyX < columnsInContainer) {
                for (columnNumber = guiModel.fieldColumnNumber + 1; columnNumber < guiModel.fieldColumnNumber + occupyX; columnNumber++) {
                    if (container.sizeArray.sizes[columnNumber]) {
                        if (container.sizeArray.sizes[columnNumber].size) {
                            guiModel.inputSize += container.sizeArray.sizes[columnNumber].size;
                            extraOccupiedPlace += container.sizeArray.sizes[columnNumber].size;
                        }
                    }
                }
                this.subtractExtraOccupiedPlaceFromSiblings(element, extraOccupiedPlace);
            } else {
                //fill whole space
                guiModel.inputSize += this.getBlankSpace(container, rowNumber);
            }
        } else {
            if (guiModel.expand === 0) {
                if (occupyX < columnsInContainer - 1) {
                    for (columnNumber = guiModel.fieldColumnNumber + 1; columnNumber < guiModel.fieldColumnNumber + occupyX; columnNumber++) {
                        if (container.sizeArray.sizes[columnNumber]) {
                            guiModel.inputSize += container.sizeArray.sizes[columnNumber].size;
                        }
                    }
                } else {
                    //fill whole space
                    guiModel.inputSize += this.getBlankSpace(container, rowNumber);
                }
            } else {
                guiModel.useAutoExpand = true;
            }
        }
    }

    /**
     * @private
     */
    subtractExtraOccupiedPlaceFromSiblings(element, extraOccupiedPlace) {
        var parent = element.getParentRow();
        var numberOfSiblings = parent.children.length - 1;
        var equalSubtractValue = Math.floor(extraOccupiedPlace / numberOfSiblings);

        parent.children.forEach(child => {
            if (child !== element) {
                child.guiModel.inputSize -= equalSubtractValue;
            }
        });
    }

    /**
     * @private
     */
    setElementSizes(element, container) {
        var guiModel = element.guiModel;
        var elementOccupyX = guiModel.occupyX;

        if (!element.isContainer) {
            if (guiModel.class !== samilEnums.COMPONENT_TYPES.SEPARATOR) {
                if (element.isSpring) {
                    guiModel.labelSize = this.getSizeFromSizeArray(guiModel.labelColumnNumber, elementOccupyX, container);
                } else {
                    var columnOfLabel = guiModel.labelColumnNumber;
                    var columnOfField = guiModel.fieldColumnNumber;
                    var sizeOfTLabelText = 0;

                    if (columnOfLabel !== undefined) {
                        if (element.isCheckbox) {
                            sizeOfTLabelText = guiModel.labelSize;
                        }

                        guiModel.labelSize = container.sizeArray.sizes[columnOfLabel].size;
                    }
                    if (columnOfField !== undefined) {
                        if (element.isCheckbox && guiModel.usePreferedSize && guiModel.expand === 0) {
                            guiModel.inputSize = defaultPropertiesRegistry.preferedSizes.CHECKBOX;
                        } else if (guiModel.lastElement && guiModel.expand === 0) {
                            guiModel.inputSize = guiModel.preferedWidth;
                        } else {
                            //set min size
                            guiModel.inputSize = this.getSizeFromSizeArray(columnOfField, elementOccupyX, container);
                        }
                    }

                    if (element.isCheckbox) {
                        var labelDiff = guiModel.labelSize - sizeOfTLabelText;
                        var elementInOnlyCheckboxesRow = false;

                        if (element.guiModel.inRow) {
                            elementInOnlyCheckboxesRow = element.parentRow.isContainingOnlyCheckboxes();
                        }

                        if (labelDiff > 0 && !elementInOnlyCheckboxesRow) {
                            guiModel.labelSize = sizeOfTLabelText;
                            guiModel.inputSize += labelDiff;
                        } else if (labelDiff > 0 && elementInOnlyCheckboxesRow) {
                            guiModel.labelSize = sizeOfTLabelText;
                        }
                    }
                }
            }
        }
    }

    /**
     * @private
     */
    getSizeFromSizeArray(columnNumber, elementOccupyX, container) {
        if (elementOccupyX > 1) {
            var placeOccupied = 0;
            for (var index = columnNumber; index < columnNumber + elementOccupyX; index++) {
                placeOccupied += container.sizeArray.sizes[index].size;
            }
            return placeOccupied;
        } else {
            return container.sizeArray.sizes[columnNumber].size;
        }

    }

    /**
     * @private
     */
    countOccupiedPlace(element) {
        var elementOccupiedPlace = 0;
        var guiModel = element.guiModel;

        if (guiModel.class !== samilEnums.COMPONENT_TYPES.SEPARATOR) {
            var columnOfLabel = guiModel.labelColumnNumber;
            var columnOfField = guiModel.fieldColumnNumber;

            if (columnOfLabel !== undefined) elementOccupiedPlace += guiModel.labelSize;
            if (columnOfField !== undefined) {
                //if (guiModel.occupyX) {
                //    elementOccupiedPlace += guiModel.occupyX * guiModel.inputSize;
                //} else {
                elementOccupiedPlace += guiModel.inputSize;
                //}
            }
        }
        return elementOccupiedPlace;
    }

    /**
     * @private
     */
    setColumnsNumber(numberOfColumn, container) {
        container.columnsNumber = numberOfColumn;

        container.content.forEach(element => {
            element.columnsNumber = numberOfColumn;
        });
    }

    /**
     * @private
     */
    getMapOfContainers() {
        var containersArray = [];

        this.tree.components.forEach(component => {
            containersArray = this.addContainer(containersArray, component);
        });

        return containersArray;
    }

    /**
     * @private
     */
    addContainer(currentContainersArray, component) {
        var containersArray = this.setInContainerArray(component, currentContainersArray);

        if (component.hasChildren()) {
            component.children.forEach(child => {
                this.addContainer(containersArray, child);
            });
        }

        return containersArray;
    }

    /**
     * @private
     */
    getNumberOfColumns(container) {
        this.currentNumberOfColumn = 1;

        container.content.forEach(component => {
            this.getMaxNumberOfColumns(component);
        });

        return this.currentNumberOfColumn;
    }

    getMaxNumberOfColumns(component) {
        if (component.columnsNumber > this.currentNumberOfColumn) {
            this.currentNumberOfColumn = component.columnsNumber;
        }

        if (component.isRow) {
            component.children.forEach(child => {
                this.getMaxNumberOfColumns(child, this.currentNumberOfColumn);
            });
        }
    }

    /**
     * @private
     */
    setInContainerArray(component, containersArray) {
        if (component.type === samilEnums.XML_ELEMENTS.CONTAINER) {
            containersArray.push({content: component.children});
        }
        return containersArray;
    }

    /**
     * @private
     */
    calculate(child) {
        if (child.type === 'row') {
            var elementsInRow = 0;
            var realElementInRow = 0;

            child.children.forEach(grandChild => {
                if (grandChild.type !== 'checkbox') {
                    elementsInRow++;

                    if (grandChild.hasLabel()) realElementInRow++;
                    if (grandChild.hasField()) realElementInRow++;
                }
            });

            if (elementsInRow > this.currentMaxElementsInRow) {
                this.currentMaxElementsInRow = elementsInRow;
            }

            if (realElementInRow > this.currentMaxElementsInRow) {
                this.currentMaxRealElementsInRow = realElementInRow;
            }
        }
    }

    /**
     * @private
     */
    calculateChild(child) {
        this.calculate(child);

        if (child.hasChildren()) {
            child.children.forEach(grandChild => {
                this.calculateChild(grandChild);
            });
        }
    }

    /**
     * @private
     */
    getColumnsWidths(container, numberOfColumns) {
        var containerColumnsMinWidths = [];

        for (var columnNumber = 0; columnNumber < numberOfColumns; columnNumber++) {
            var allElementsFromColumn = this.getElementsFromColumn(container.content, columnNumber);
            var longestChildWidth = 0;

            allElementsFromColumn.forEach((partOfChild, child) => {
                var childWidth = 0;

                if (partOfChild === samilEnums.COMPONENT_TYPES.FIELD) {
                    childWidth = child.guiModel.charsSize;
                } else if (partOfChild === samilEnums.COMPONENT_TYPES.LABEL) {
                    childWidth = child.guiModel.labelSize;
                }
                if (longestChildWidth < childWidth) {
                    longestChildWidth = childWidth;
                }
            }, allElementsFromColumn);

            containerColumnsMinWidths.push(longestChildWidth);
        }
        return containerColumnsMinWidths;
    }

    getAllComponentsFromContainer(container) {
        this.result = [];

        container.children.forEach(child => {
            this.getComponentFromContainer(child, this.result);
        });

        return this.result;
    }

    /**
     * @private
     */
    getComponentFromContainer(element) {
        if (element.children) {
            element.children.forEach(child => {
                this.getComponentFromContainer(child);
            });
        } else {
            this.result.push(element);
        }
    }

    /**
     * @private
     */
    getChildrenNumberOfColumns(element) {
        if (element.columnsNumber > this.currnetNumberOfColumn) {
            this.currnetNumberOfColumn = element.columnsNumber;
        }

        if (element.hasChildren()) {
            element.children.forEach(child => {
                this.getChildrenNumberOfColumns(child);
            });
        }
    }

    /**
     * @private
     */
    setResultMap(resultMap, child, columnNumber) {
        if (child.guiModel.labelColumnNumber === columnNumber) resultMap.set(child, samilEnums.COMPONENT_TYPES.LABEL);
        if (child.guiModel.fieldColumnNumber === columnNumber) resultMap.set(child, samilEnums.COMPONENT_TYPES.FIELD);
    }
}

export default LayoutManager;
