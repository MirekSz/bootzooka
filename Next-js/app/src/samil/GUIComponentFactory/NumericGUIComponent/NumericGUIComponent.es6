/**
 * Created by bstanislawski on 2015-12-11.
 */
import BaseGUIComponent from '../../BaseGUIComponent';
import template from './numeric_input.hbs';
import defaultPropertiesRegistry from '../../DefaultPropertiesRegistry';
import samilEnums from '../../../enums/SamilEnums';

class NumericGUIComponent extends BaseGUIComponent {

    constructor(element) {
        super(element, template);

        this.isNumeric = true;
        this.preferedCharLength = defaultPropertiesRegistry.preferedSizes.NUMERIC;

        this.guiModel.preferedWidth = Math.round(samilEnums.BOOTSTRAP.CHAR_SIZE * this.preferedCharLength);
    }

    doAfterRenderImpl(targetElement) {
        this.convertToKendoNumeric(targetElement);
    }

    convertToKendoNumeric(targetElement) {
        var $targetElement = $(targetElement);

        if ($targetElement.length > 0) {
            if ($targetElement.find('input').length === 1) {

                $targetElement.find('input').kendoNumericTextBox({
                    format: `n${this.attrs.precision}`,
                    decimals: this.attrs.precision,
                    min: this.attrs.minValue,
                    max: this.attrs.maxValue,
                    value: this.getValue(),
                    change: (element)=> {
                        var value = element.sender.value();
                        this.setValue(value);
                    }
                });

                //hide the spinners
                $targetElement.find('.k-numeric-wrap').addClass('expand-padding').find('.k-select').hide();
            }
        }
    }
}

export default NumericGUIComponent;
