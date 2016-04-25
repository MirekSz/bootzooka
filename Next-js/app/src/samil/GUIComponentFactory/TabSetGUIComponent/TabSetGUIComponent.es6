/**
 * Created by bstanislawski on 2016-01-18.
 */
import BaseGUICompositeComponent from '../../BaseGUICompositeComponent';
import template from './tab_set.hbs';
import childLayoutTemplate from './tab_template.hbs';

class TabSetGUIComponent extends BaseGUICompositeComponent {

    constructor(element) {
        super(element);

        this.isTabSet = true;
    }

    calculateGridImpl() {
        this.setFirstTabActive();
    }

    renderTo(target) {
        var htmlElement = template({gui: this.guiModel, field: this.field, self: this});
        var targetElement = $(target);

        targetElement.html(htmlElement);

        this.target = $(target).find('.tab-content');
        this.renderChildren();
        this.doAfterRender(targetElement);
    }

    renderChildrenLayout() {
        var templateWithSlots = childLayoutTemplate(this);

        $(this.target).html(templateWithSlots);
    }

    /**
     * @private
     */
    setFirstTabActive() {
        if (this.children) {
            var firstTab = this.children[0];

            firstTab.active = true;
        }
    }

}

export default TabSetGUIComponent;
