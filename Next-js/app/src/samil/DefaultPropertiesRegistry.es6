/**
 * This is a default properties for the Samil GUI
 */
import samilEnums from '../enums/SamilEnums';

class DefaultPropertiesRegistry {

    constructor() {
        this.maxSize = samilEnums.BOOTSTRAP.ROW_MAX_SIZE;
        this.labelSize;
        this.inputSize;
        this.numberOfColumns;

        this.fontName = 'Open Sans';

        /*need to be bigger then in css (about 1 point)*/
        this.fontSize = 12;

        this.preferedSizes = {
            DATE: 15,
            INPUT: 18,
            NUMERIC: 9,
            NUMERIC_SELECTOR_PADDING: 3,
            DICTIONARY: 15,
            TEXTAREA_ROWS_AMOUNT: 5,
            CHECKBOX: 2,
            CONTAINER: 100,
            TEXTAREA: 30
        };

        this.minValues = {
            CHARS: 5
        };
    }

}

export default new DefaultPropertiesRegistry();
