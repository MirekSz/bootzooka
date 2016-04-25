/**
 * Created by bstanislawski on 2016-01-14.
 */
import samilEnums from '../../../enums/SamilEnums';
import samilCommonMethods from '../../SamilCommonMethods';
import BaseGUIViewController from '../../BaseGUIViewController';
import defaultPropertiesRegistry from '../../DefaultPropertiesRegistry';

const MAX_ROW_SIZE = samilEnums.BOOTSTRAP.ROW_MAX_SIZE;

class RowGUIComponentViewController extends BaseGUIViewController {

    constructor(rowElement) {
        super(rowElement);
    }

    /**
     * Prevent that row isn't greater then 100 percent
     */
    preventSizesSumIsMax100() {
        var amount = 0;
        var elements = {labels: 0, fields: 0, containers: 0};

        this.component.children.forEach(child => {
            if (child.hasLabel()) {
                elements.labels++;
                amount += child.guiModel.labelSize;
            }
            if (child.hasField()) {
                elements.fields++;
                amount += child.guiModel.inputSize;
            }
            if (child.isContainer) {
                elements.containers++;
                amount += child.guiModel.inputSize;
            }
        });

        if (amount > MAX_ROW_SIZE) {
            if (elements.fields === 0 && elements.labels > 0) {
                this.notEnd = true;
                this.decreaseEveryLabelSize(amount);
            } else {
                this.notEnd = true;
                amount = this.checkAutoExpandWasUsedIfYesDecreaseAutoExpandFirst(amount);
                if (amount > MAX_ROW_SIZE) this.decreaseEveryFieldSize(amount);
            }
        }
    }

    /**
     * Handle the special case when there is a container with only checkboxes in the row
     */
    handleCaseWhenOnlyCheckboxesInContainer() {
        if (this.component.hasChildren()) {
            this.component.children.forEach(component => {
                this.checkIfOnlyCheckboxesContainer(component);
            });
        }
    }

    handleExpandsIfOnlyContainersRow() {
        var expandSum = 0;
        var equalDivision = true;

        this.checkIsOnlyContainersRow();

        if (this.component.onlyContainersRow) {
            this.component.children.forEach(child => {
                var childExpand = this.getElementExpand(child);
                expandSum += childExpand;

                if (childExpand !== 1) {
                    equalDivision = false;
                }
            });

            if (!equalDivision) {
                this.component.children.forEach(child => {
                    var percentOfRowSize = this.getElementExpand(child) / expandSum;

                    child.guiModel.inputSize = Math.round(percentOfRowSize * samilEnums.BOOTSTRAP.ROW_MAX_SIZE);
                });
            }
        }
    }

    /**
     * @private
     */
    getElementExpand(element) {
        var elementExpand = parseInt(element.def.attributes.get('expand'));

        if (isNaN(elementExpand)) elementExpand = 1;
        if (elementExpand === 0) elementExpand = 1;

        return elementExpand;
    }

    /**
     * @priavte
     */
    checkIsOnlyContainersRow() {
        this.component.onlyContainersRow = true;

        if (this.component.hasChildren()) {
            this.component.children.forEach(component => {
                if (!component.isContainer) this.component.onlyContainersRow = false;
            });
        } else {
            this.component.onlyContainersRow = false;
        }
    }

    /**
     * @private
     */
    decreaseEveryFieldSize(number) {
        var amount = number;
        if (amount > samilEnums.BOOTSTRAP.ROW_MAX_SIZE && this.notEnd) {
            this.component.children.forEach(child => {
                if (child.hasField() && this.notEnd && child.guiModel.inputSize > 2) {
                    child.guiModel.inputSize--;
                    amount--;
                }

                if (amount === samilEnums.BOOTSTRAP.ROW_MAX_SIZE) {
                    this.notEnd = false;
                }
            });

            if (amount === samilEnums.BOOTSTRAP.ROW_MAX_SIZE) {
                this.notEnd = false;
            } else {
                this.decreaseEveryFieldSize(amount);
            }
        }
    }

    /**
     * @private
     */
    decreaseEveryLabelSize(number) {
        var amount = number;
        this.component.children.forEach(child => {
            if (child.hasLabel() && this.notEnd && child.guiModel.labelSize > 0) {
                child.guiModel.labelSize--;
                amount--;
            }

            if (amount === samilEnums.BOOTSTRAP.ROW_MAX_SIZE) {
                this.notEnd = false;
            }
        });

        if (amount === samilEnums.BOOTSTRAP.ROW_MAX_SIZE) {
            this.notEnd = false;
        } else {
            this.decreaseEveryLabelSize(amount);
        }
    }

    checkAutoExpandWasUsedIfYesDecreaseAutoExpandFirst(rowAmount) {
        var amount = rowAmount;
        var maxRowSize = samilEnums.BOOTSTRAP.ROW_MAX_SIZE;
        var diffToDecrease = amount - maxRowSize;

        this.component.children.forEach(child => {
            if (child.guiModel.beforeAutoExpandInputSize && !child.isSpring) {
                var autoExpandValue = child.guiModel.inputSize - child.guiModel.beforeAutoExpandInputSize;
                var diff = amount - autoExpandValue;

                if (autoExpandValue > 0) {
                    if (diff < maxRowSize) {
                        child.guiModel.inputSize -= diffToDecrease;
                        amount -= diffToDecrease;
                    } else {
                        child.guiModel.inputSize -= autoExpandValue;
                        amount -= autoExpandValue;
                    }
                }
            }
        });

        return amount;
    }

    /**
     * @private
     */
    checkIfOnlyCheckboxesContainer(element) {
        var guiModel = element.guiModel;
        if (element.isContainer) {
            element.doCheckIfOnlyCheckboxesContainer();
        }

        if (guiModel.onlyCheckboxesContainer) {
            this.setCheckboxContainerSize(element);
        }

        if (element.hasChildren()) {
            element.children.forEach(child => {
                this.checkIfOnlyCheckboxesContainer(child);
            });
        }
    }

    /**
     * @private
     */
    setCheckboxContainerSize(container) {
        var longestLabel = 0;

        container.children.forEach(child => {
            var childGUIModel = child.guiModel;
            var childLabel = child.field.label;
            var childLabelSizeInPx = samilCommonMethods.getWidthOfText(childLabel);
            var childLabelSize = samilCommonMethods.getSizeInBootstrapUnit(childLabelSizeInPx);

            if (longestLabel < childLabelSize) {
                longestLabel = childLabelSize;
            }

            childGUIModel.inputSize = defaultPropertiesRegistry.preferedSizes.CHECKBOX;
        });

        var scale = longestLabel / (longestLabel + defaultPropertiesRegistry.preferedSizes.CHECKBOX);

        //recalculate sizes by scale
        container.children.forEach(child => {
            var childGUIModel = child.guiModel;

            childGUIModel.labelSize = Math.round(samilEnums.BOOTSTRAP.ROW_MAX_SIZE * scale);
        });

        //set inputSize of the container
        var oldInputSize = container.guiModel.inputSize;
        container.guiModel.inputSize = longestLabel + defaultPropertiesRegistry.preferedSizes.CHECKBOX;

        var diff = oldInputSize - container.guiModel.inputSize;
        var increaseByDiff = Math.round(diff / (this.component.children.length - 1));

        this.component.children.forEach(child => {
            var childGUIModel = child.guiModel;

            if (child != container) {
                childGUIModel.inputSize += increaseByDiff;
                childGUIModel.columnSize = childGUIModel.inputSize + increaseByDiff;
            } else {
                console.log(child);
            }
        });
    }

}

export default RowGUIComponentViewController;
