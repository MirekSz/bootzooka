/**
 * Created by bstanislawski on 2016-01-04.
 */
import samilEnums from '../enums/SamilEnums';
import BaseView from '../compositeComponents/BaseView';

class BaseGUIComponentView extends BaseView {

    constructor(component) {
        super();
        this.component = component;
        this.elementId = 0;
    }

    renderTo(target) {
        this.component.target = target;
        this.component.renderingSupport.renderTo(target);
    }

    setField100ifNoLabelAndNotInRow() {
        var component = this.component;
        var isAllowedType = !component.isSpring && !component.isSeparator && !component.isContainer && !component.isRow;
        var hasFieldAndNoLabel = component.noLabel && !component.noField;
        var isNotInRow = !component.guiModel.inRow;

        if (isAllowedType && hasFieldAndNoLabel && isNotInRow) {
            component.guiModel.inputSize += component.guiModel.labelSize;
            component.guiModel.labelSize = 0;
        }
    }

    preventMoreThen100InRow() {
        var amount = 0;

        if (this.component.hasLabel()) {
            amount += this.component.guiModel.labelSize;
        }
        if (this.component.hasField()) {
            amount += this.component.guiModel.inputSize;
        }

        if (amount > samilEnums.BOOTSTRAP.ROW_MAX_SIZE) {
            this.notEnd = true;
            amount = this.checkAutoExpandWasUsedIfYesDecreaseAutoExpandFirst(amount);

            if (amount > samilEnums.BOOTSTRAP.ROW_MAX_SIZE) {
                this.decreaseEveryFieldSize(amount);
            }
        }
    }

    /**
     * @private
     */
    checkAutoExpandWasUsedIfYesDecreaseAutoExpandFirst(rowAmount) {
        var amount = rowAmount;
        var maxRowSize = samilEnums.BOOTSTRAP.ROW_MAX_SIZE;
        var diffToDecrease = amount - maxRowSize;

        if (this.component.guiModel.beforeAutoExpandInputSize && !this.component.isSpring) {
            let autoExpandValue = this.component.guiModel.inputSize - this.component.guiModel.beforeAutoExpandInputSize;
            let diff = amount - autoExpandValue;

            if (autoExpandValue > 0) {
                if (diff < maxRowSize) {
                    this.component.guiModel.inputSize -= diffToDecrease;
                    amount -= diffToDecrease;
                } else {
                    this.component.guiModel.inputSize -= autoExpandValue;
                    amount -= autoExpandValue;
                }
            }
        }

        return amount;
    }

    /**
     * @private
     */
    decreaseEveryFieldSize(rowAmount) {
        var amount = rowAmount;
        if (amount > samilEnums.BOOTSTRAP.ROW_MAX_SIZE && this.notEnd) {
            if (this.component.guiModel.inputSize > 0) {
                if (this.notEnd && this.component.guiModel.inputSize > 2) {
                    this.component.guiModel.inputSize--;
                    amount--;
                }

                if (amount === samilEnums.BOOTSTRAP.ROW_MAX_SIZE) {
                    this.notEnd = false;
                } else {
                    this.decreaseEveryFieldSize(amount);
                }
            } else {
                this.notEnd = false;
            }
        }
    }
}

export default BaseGUIComponentView;
