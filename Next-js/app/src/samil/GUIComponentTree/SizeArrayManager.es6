/**
 * Created by bstanislawski on 2016-02-24.
 */
import samilEnums from '../../enums/SamilEnums';
import SizeArray from './ContainerSizeArray';

class SizeArrayManager {

    /**
     * @param {LayoutManager} layoutManagerInstance
     */
    constructor(layoutManagerInstance) {
        this.layoutManager = layoutManagerInstance;
    }

    /**
     * Creates array of objects ex. {columnNumber: 1, size: 20}
     *
     * if there is some label in the column then it sets the min column width
     */
    createSizeArray(containerColumnsMinWidths, containerElements) {
        var sizeArray = this.createSizeArrayWithMinWidths(containerColumnsMinWidths, containerElements);

        sizeArray.calculateExpands(containerElements);
        sizeArray.checkExpand0affectOnColumnElements(containerElements);
        sizeArray.calculateInputColumnsSize();
        sizeArray.calculateCharsAttr();
        sizeArray.prevent0Values();
        sizeArray.tryToExpandColumnsToMaxRowSize(containerElements);

        return sizeArray;
    }

    createSizeArrayWithMinWidths(containerColumnsMinWidths, containerElements) {
        var sizeArray = new SizeArray(this.layoutManager);
        containerColumnsMinWidths.forEach((columnMinWidth, columnNumber) => {
            this.setMinWidthsOnColumnElements(containerElements, columnMinWidth, columnNumber);
            var arrayElement = this.makeMinSizesArray(containerElements, columnMinWidth, columnNumber);

            sizeArray.sizes.push(arrayElement);
        });
        return sizeArray;
    }

    /**
     * @private
     */
    setMinWidthsOnColumnElements(containerElements, columnMinWidth, columnNumber) {
        var rowNumber = 0;
        var allElementsFromColumn = this.layoutManager.getElementsFromColumn(containerElements, columnNumber);

        allElementsFromColumn.forEach((partOfChild, child) => {
            var childGUIModel = child.guiModel;

            if (childGUIModel.labelSize < columnMinWidth) {
                var diff = columnMinWidth - childGUIModel.labelSize;

                if (child.noField) {
                    childGUIModel.labelSize = columnMinWidth;
                } else {
                    childGUIModel.labelSize = columnMinWidth;
                    childGUIModel.inputSize -= diff;
                }
            }

            if (childGUIModel.chars) {
                this.setMaxSizeAccordingToCharAttribute(childGUIModel);
            }

            rowNumber++;
        }, allElementsFromColumn);
    }

    /**
     * @private
     */
    setMaxSizeAccordingToCharAttribute(guiModel) {
        const MIN_SIZE = 4;
        var oneCharSizeInBootstrapUnits = samilEnums.BOOTSTRAP.CHAR_SIZE;

        if (guiModel.class !== samilEnums.COMPONENT_TYPES.SEPARATOR) {
            var sizeInBootstrapUnits = Math.floor(guiModel.chars * oneCharSizeInBootstrapUnits);

            if (sizeInBootstrapUnits < MIN_SIZE) sizeInBootstrapUnits = MIN_SIZE;

            guiModel.charsSize = sizeInBootstrapUnits;
        }
    }

    /**
     * @private
     */
    makeMinSizesArray(containerElements, columnMinWidth, columnNumber) {
        var arrayElement = {};
        var allElementsFromColumn = this.layoutManager.getElementsFromColumn(containerElements, columnNumber);

        //check if there is some label in the column
        var hasLabel = false;
        var hasField = false;
        var biggestCharSizeInColumn = 0;
        var hasOnlyCheckboxes = true;
        var columnNoExpand = true;
        var containersNumber = 0;

        allElementsFromColumn.forEach((partOfChild, child) => {
            if (!child.isSeparator) {
                var childCharsSize = child.guiModel.charsSize;
                var childExpand = child.guiModel.expand;

                if (partOfChild === samilEnums.COMPONENT_TYPES.LABEL) hasLabel = true;
                if (partOfChild === samilEnums.COMPONENT_TYPES.FIELD) hasField = true;

                if (!child.isCheckbox) {
                    hasOnlyCheckboxes = false;
                }

                if (child.isContainer) containersNumber++;
                if (childExpand !== 0 && !child.isSpring) columnNoExpand = false;

                if (childCharsSize) {
                    if (childCharsSize > biggestCharSizeInColumn) {
                        biggestCharSizeInColumn = childCharsSize;
                    }
                }

                if (child.isContainer) arrayElement.isContainer = true;
            }
        });

        if (containersNumber === allElementsFromColumn.length) arrayElement.onlyContainers = true;

        arrayElement.columnNumber = columnNumber;
        arrayElement.columnNoExpand = columnNoExpand;
        arrayElement.hasField = hasField;

        if (!arrayElement.onlyContainers) arrayElement.hasOnlyCheckboxes = hasOnlyCheckboxes;
        if (hasLabel) arrayElement.size = columnMinWidth;
        if (biggestCharSizeInColumn > 0) arrayElement.inputSizeFromCharsAttr = biggestCharSizeInColumn;

        return arrayElement;
    }

}

export default SizeArrayManager;
