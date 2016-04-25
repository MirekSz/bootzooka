/**
 * Created by bstanislawski on 2015-12-11.
 */
import BaseGUICompositeComponent from '../../BaseGUICompositeComponent';
import template from './tab.hbs';

class TabGUIComponent extends BaseGUICompositeComponent {

    constructor(element) {
        super(element);

        this.isTab = true;
    }

    renderTo(target) {
        var htmlElement = template({gui: this.guiModel, field: this.field, self: this});

        $(target).html(htmlElement);

        this.target = $(target).find('.fieldset-content');
        this.renderChildren();
    }

}

export default TabGUIComponent;
