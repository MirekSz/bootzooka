/**
 * Created by bstanislawski on 2015-12-11.
 */
import BaseGUIComponent from '../../BaseGUIComponent';
import template from './date.hbs';
import defaultPropertiesRegistry from '../../DefaultPropertiesRegistry';
import samilEnums from '../../../enums/SamilEnums';

class DateGUIComponent extends BaseGUIComponent {

    constructor(element) {
        super(element, template);

        this.isDate = true;

        this.preferedCharLength = defaultPropertiesRegistry.preferedSizes.DATE;
        this.guiModel.preferedWidth = Math.round(samilEnums.BOOTSTRAP.CHAR_SIZE * this.preferedCharLength);
    }

    doAfterRenderImpl(targetElement) {
        this.convertToKendoDatePicker(targetElement);
    }

    convertToKendoDatePicker(targetElement) {
        var options = {
            value: convertFrom(this.getValue()),
            change: (element)=> {
                var value = element.sender.value();
                if (value) {
                    this.setValue(convertTo(value));
                } else {
                    this.setValue(value);
                }
            }
        };
        var domainName = this.field.domainName;
        if (samilEnums.FIELD_DATA_TYPES.DATETIME === domainName.toLowerCase()) {
            targetElement.find('input').kendoDateTimePicker(options);
        } else if (samilEnums.FIELD_DATA_TYPES.TIME === domainName.toLowerCase()) {
            targetElement.find('input').kendoTimePicker(options);
        } else {
            targetElement.find('input').kendoDatePicker(options);
        }
    }

}

/**
 * @param {Date} date
 */
function convertTo(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

/**
 * @param {Date} date
 */
function convertFrom(date) {
    if (typeof date === "string") {
        return new Date(date.replace('T', ' '));
    }
    return date;
}
export default DateGUIComponent;
