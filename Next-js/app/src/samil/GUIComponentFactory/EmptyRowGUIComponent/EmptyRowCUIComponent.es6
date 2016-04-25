/**
 * Created by bstanislawski on 2015-12-11.
 */
import BaseGUIComponent from '../../BaseGUIComponent';
import template from './empty_row.hbs';

class EmptyRowCUIComponent extends BaseGUIComponent {

    constructor() {
        super({}, template);

        this.isEmptyRow = true;

        this.noLabel = true;
        this.noField = true;
    }

}

export default EmptyRowCUIComponent;
