/**
 * Created by bstanislawski on 2016-02-24.
 */
import defaultPropertiesRegistry from '../DefaultPropertiesRegistry';
import samilEnums from '../../enums/SamilEnums';

class ContainerSizeArray {

    /**
     * @param {LayoutManager} layoutManagerInstance
     */
    constructor(layoutManagerInstance) {
        this.sizes = [];
        this.rowPlaceOccupied = 0;
        this.expandsSum = 0;
        this.checkboxesColumns = 0;
        this.rowFreeSpace = 0;
        this.checkboxSize = defaultPropertiesRegistry.preferedSizes.CHECKBOX;

        this.layoutManager = layoutManagerInstance;
    }

    /**
     * Calculate the sizes according to the expand attributes
     */
    calculateExpands(containerElements) {
        var self = this;

        this.sizes.forEach(column => {
            var elementsFromColumn = self.layoutManager.getElementsFromColumn(containerElements, column.columnNumber);
            var biggestExpandInColumn = 1;

            //check if there is only one row in in this container column
            if (elementsFromColumn.size === 1) {
                column.onlyOneRowInColumn = true;
            }

            elementsFromColumn.forEach((partOfElement, element) => {
                if (column.onlyOneRowInColumn && element.guiModel.expand == 0) {
                    column.noExpandElementsInColumn = true;
                }

                if (biggestExpandInColumn < element.guiModel.expand) {
                    biggestExpandInColumn = element.guiModel.expand;
                }
            });

            if (column.size && !column.hasField) {
                self.rowPlaceOccupied += column.size;
            } else if (column.size && column.hasField) {
                self.rowPlaceOccupied += column.size;

                if (!column.hasOnlyCheckboxes) {
                    self.expandsSum += biggestExpandInColumn;
                    column.expand = biggestExpandInColumn;
                } else {
                    self.checkboxesColumns++;
                }
            } else {
                if (!column.hasOnlyCheckboxes) {
                    self.expandsSum += biggestExpandInColumn;
                    column.expand = biggestExpandInColumn;
                } else {
                    self.checkboxesColumns++;
                }
            }
        });
    }

    /**
     * Check if the expand="0" attribute affects on elements in all columns
     */
    checkExpand0affectOnColumnElements(containerElements) {
        this.sizes.forEach(column => {
            var elementsFromColumn = this.layoutManager.getElementsFromColumn(containerElements, column.columnNumber);
            var onlyNoExpandElementsInColumn = true;

            elementsFromColumn.forEach((partOfElement, element) => {
                if (element.guiModel.expand !== 0 && element.guiModel.inRow) onlyNoExpandElementsInColumn = false;
            });

            if (elementsFromColumn.length > 0) {
                column.onlyNoExpandElementsInColumn = onlyNoExpandElementsInColumn;
            }

            if (onlyNoExpandElementsInColumn) {
                elementsFromColumn.forEach((partOfElement, element) => {
                    element.guiModel.usePreferedSize = true;
                });
            }
        });
    }

    /**
     * Calculate InputColumnsSize for columns
     */
    calculateInputColumnsSize() {
        var sizeArray = this;
        sizeArray.rowFreeSpace = samilEnums.BOOTSTRAP.ROW_MAX_SIZE - sizeArray.rowPlaceOccupied;
        sizeArray.rowFreeSpace -= sizeArray.checkboxesColumns * sizeArray.checkboxSize;

        this.sizes.forEach(column => {
            if (column.hasField) {
                var columnPercentOfFreeSpace = column.expand / sizeArray.expandsSum;

                if (column.hasOnlyCheckboxes) {
                    column.inputColumnsSize = sizeArray.checkboxSize;
                } else {
                    column.inputColumnsSize = Math.floor(columnPercentOfFreeSpace * sizeArray.rowFreeSpace);
                }

                //prevent to not have inputColumnsSize = 0
                if (columnPercentOfFreeSpace * sizeArray.rowFreeSpace > 0 && column.inputColumnsSize === 0) {
                    column.inputColumnsSize = 1;
                }

                if (column.inputColumnsSize < column.inputSizeFromCharsAttr) {
                    sizeArray.rowFreeSpace -= column.inputSizeFromCharsAttr - column.inputColumnsSize;
                }
            }
        });
    }

    /**
     * Calculate InputColumnsSize for columns according to the CHARS attribute
     */
    calculateCharsAttr() {
        this.sizes.forEach(column => {
            if (!column.size) {
                if (column.inputSizeFromCharsAttr) {
                    if (column.inputColumnsSize < column.inputSizeFromCharsAttr) {
                        column.size = column.inputSizeFromCharsAttr;
                    } else {
                        if (column.columnNoExpand || column.onlyOneRowInColumn) {
                            column.size = column.inputSizeFromCharsAttr;
                        } else {
                            column.size = column.inputColumnsSize;
                        }
                    }
                } else {
                    column.size = column.inputColumnsSize;
                }
            }
        });
    }

    /**
     * check loop to prevent '0' values
     */
    prevent0Values() {
        this.sizes.forEach(column => {
            if (column.size === 0) {
                column.size = 1;
            }
            if (column.inputColumnsSize === 0) {
                column.inputColumnsSize = 1;
            }
            if (column.size === undefined) {
                column.size = 1;
            }
        });
    }

    /**
     * Check if sum of the sizes isn't less then ROW_MAX_SIZE(100)
     * if yes try to expand to ROW_MAX_SIZE
     */
    tryToExpandColumnsToMaxRowSize(containerElements) {
        var checkSizesSum = 0;

        this.sizes.forEach(column => {
            checkSizesSum += column.size;
        });

        if (checkSizesSum < samilEnums.BOOTSTRAP.ROW_MAX_SIZE) {
            var diff = samilEnums.BOOTSTRAP.ROW_MAX_SIZE - checkSizesSum;
            var belowPreferredSizesColumnsToExpand = [];
            var columnsToExpand = [];
            var expandSum = 0;

            //expand column sizes for the blow preferred width columns
            this.sizes.forEach(column => {
                if (!column.columnNoExpand && !column.hasOnlyCheckboxes && column.hasField) {
                    columnsToExpand.push(column);
                } else if (column.columnNoExpand && !column.hasOnlyCheckboxes && column.hasField) {
                    var elementsFromColumn = this.layoutManager.getElementsFromColumn(containerElements, column.columnNumber);
                    var biggestPreferredInputSize = 0;

                    elementsFromColumn.forEach((partOfElement, element) => {
                        if (element.guiModel.preferedWidth > column.size && !element.isContainer && !element.isRow) {
                            if (biggestPreferredInputSize < element.guiModel.preferedWidth) {
                                biggestPreferredInputSize = element.guiModel.preferedWidth;
                            }
                        }
                    });

                    column.biggestPreferredInputSize = biggestPreferredInputSize;
                    if (biggestPreferredInputSize > 0) belowPreferredSizesColumnsToExpand.push(column);
                }
            });

            var freeSpaceLeft = this.expandColumnsToPreferredWidth(belowPreferredSizesColumnsToExpand, diff);

            if (freeSpaceLeft > 0) {
                columnsToExpand.forEach(column => {
                    if (column.expand === undefined) column.expand = 1;
                    expandSum += column.expand;
                });

                var oneUnitDiff;
                if (expandSum > 0) {
                    oneUnitDiff = Math.floor(diff / expandSum);
                } else {
                    oneUnitDiff = Math.floor(diff);
                }

                columnsToExpand.forEach(column => {
                    column.size += column.expand * oneUnitDiff;
                });
            } else {
                console.warn('over 100 %....');
            }
        }
    }

    /**
     * @private
     */
    expandColumnsToPreferredWidth(columns, freeSpace) {
        var columnFreeSpace = freeSpace;
        columns.forEach(column => {
            var diff = column.biggestPreferredInputSize - column.size;

            columnFreeSpace -= diff;

            if (columnFreeSpace >= 0) {
                column.size = column.biggestPreferredInputSize;
            }
        });

        return columnFreeSpace;
    }

}

export default ContainerSizeArray;
