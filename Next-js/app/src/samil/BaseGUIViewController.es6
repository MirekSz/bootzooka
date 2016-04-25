/**
 * Created by bstanislawski on 2015-12-18.
 */
import samilEnums from '../enums/SamilEnums';
import samilCommonMethods from './SamilCommonMethods';
import defaultPropertiesRegistry from './DefaultPropertiesRegistry';

class BaseGUIViewController {

    constructor(component) {
        this.component = component;
    }

    /**
     * @param {GUIElementDef} def
     */
    setAttributesFromDefinition(def) {
        var attributes = def.attributes;
        var component = this.component;
        var guiModel = component.getGUIModel();

        attributes.forEach((value, key) => {
            component.setAttributeSpecialBehavior(value, key);

            if (key === samilEnums.SAMIL_LOCATION_TAGS.OCCUPY_X) {
                this.setOccupyX(guiModel, value, component);
            } else if (key === samilEnums.SAMIL_LOCATION_TAGS.EXPAND) {
                this.setExpand(guiModel, value, key);
            } else if (key === samilEnums.SAMIL_LOCATION_TAGS.EXPAND_X) {
                this.setExpand(guiModel, value, key);
            } else if (key === samilEnums.SAMIL_TAGS.CHARS) {
                this.setChars(guiModel, value, key);
            } else if (key === samilEnums.SAMIL_LOCATION_TAGS.FILL) {
                this.setFill(guiModel, value, key);
            } else {
                guiModel[key] = value;
            }
        }, attributes);
    }

    /**
     * @param {RowGUIComponent} row
     */
    getNumberOfColumnsInRow(row) {
        var numberOfColumns = 1;

        row.children.forEach(child => {
            child.def.attributes.forEach((attValue, attrKey) => {
                var numberOfAttrColumns = this.numberOfAttrColumns(attrKey, attValue);

                if (numberOfAttrColumns) {
                    numberOfColumns += parseInt(numberOfAttrColumns);
                }
            });
        });

        if (row.numberOfColumn < numberOfColumns) {
            return numberOfColumns;
        } else {
            return row.numberOfColumn;
        }
    }

    distributeInputSizeIfNoFieldAndInRow() {
        var guiModel = this.component.guiModel;
        var inputSize = guiModel.inputSize;
        var noExpand = this.component.def.attributes.get('expand') == 0;

        if (inputSize > 0) {
            if (guiModel.inRow && this.component.noField && noExpand) {
                var siblings = this.component.getSiblings();
                var numberOfSiblingsToDispose = 0;

                siblings.forEach(sibling => {
                    if (!sibling.noField) {
                        numberOfSiblingsToDispose++;
                    }
                });

                var equalSizeToDispose = inputSize / numberOfSiblingsToDispose;

                siblings.forEach(sibling => {
                    if (!sibling.noField && sibling.def.attributes.get('expand') != 0) {
                        sibling.guiModel.inputSize = Math.round(sibling.guiModel.inputSize + equalSizeToDispose);
                    }
                });
            }
        }
    }

    setInputSize() {
        var guiModel = this.component.guiModel;

        if (!guiModel.inRow) {
            if (!this.component.noLabel) {
                guiModel.inputSize = samilEnums.BOOTSTRAP.ROW_MAX_SIZE - guiModel.labelSize;
            } else {
                guiModel.inputSize = samilEnums.BOOTSTRAP.ROW_MAX_SIZE;
            }
        }
    }

    /**
     * @param {String} txt
     */
    setLabelMinSize(txt) {
        if (txt !== '') {
            let guiModel = this.component.guiModel;
            let minLabelSizeInPx = samilCommonMethods.getWidthOfText(txt);
            let minLabelSizeInBootstrapUnit = samilCommonMethods.getSizeInBootstrapUnit(minLabelSizeInPx);

            if (guiModel.labelSize < minLabelSizeInBootstrapUnit) {
                let diff = minLabelSizeInBootstrapUnit - guiModel.labelSize;

                guiModel.labelSize = minLabelSizeInBootstrapUnit;

                if (!this.component.isCheckbox) {
                    guiModel.inputSize -= diff;
                }
            }
            guiModel.minLabelSize = minLabelSizeInBootstrapUnit;
        }
    }

    distributeLabelSizeIfNoLabelAndInRow() {
        var guiModel = this.component.guiModel;
        var labelSize = guiModel.labelSize;
        var noExpand = this.component.def.attributes.get('expand') == 0;

        if (labelSize > 0) {
            if (guiModel.inRow && this.component.noLabel && noExpand) {
                let siblings = this.component.getSiblings();
                let numberOfSiblingsToDispose = 0;

                siblings.forEach(sibling => {
                    if (!sibling.noField) {
                        numberOfSiblingsToDispose++;
                    }
                });

                let equalSizeToDispose = labelSize / numberOfSiblingsToDispose;

                siblings.forEach(sibling => {
                    if (!sibling.noField && sibling.def.attributes.get('expand') != 0) {
                        sibling.guiModel.labelSize = Math.round(sibling.guiModel.labelSize + equalSizeToDispose);
                    }
                });
            }
        }
    }

    /**
     * @private
     * @param {String} key
     * @param {String} value
     * @returns {String|Boolean}
     */
    numberOfAttrColumns(key, value) {
        if (key === samilEnums.SAMIL_LOCATION_TAGS.OCCUPY_X) {
            return value;
        } else {
            return false;
        }
    }

    /**
     * @private
     * @param {Object} guiModel
     * @param {String} value
     * @returns {String|Boolean}
     */
    setOccupyX(guiModel, value, component) {
        guiModel.occupyX = parseInt(value);
    }

    /**
     * @private
     */
    setExpand(guiModel, value) {
        guiModel.expand = parseInt(value);
    }

    /**
     * @private
     */
    setChars(guiModel, value, key) {
        var charsValue = value;
        var minCharsValue = defaultPropertiesRegistry.minValues.CHARS;

        if (parseInt(value) < minCharsValue) {
            charsValue = minCharsValue;
        }

        guiModel.chars = parseInt(charsValue);
    }

    /**
     * @private
     */
    setFill(guiModel, value, key) {
        guiModel.fill = value;
    }

}

export default BaseGUIViewController;
