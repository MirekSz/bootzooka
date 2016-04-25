/**
 * Created by bstanislawski on 2015-12-15.
 */
import BaseGUIComponent from '../../BaseGUIComponent';
import template from './separator.hbs';

class SeparatorGUIComponent extends BaseGUIComponent {

    constructor(element) {
        super(element, template);

        this.isSeparator = true;
    }

}

export default SeparatorGUIComponent;
