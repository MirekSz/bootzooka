/**
 * Created by bstanislawski on 2015-12-11.
 */
import BaseGUICompositeComponent from '../../BaseGUICompositeComponent';
import template from './split.hbs';
import samilEnums from '../../../enums/SamilEnums';

class SplitGUIComponent extends BaseGUICompositeComponent {

    constructor(element) {
        super(element);

        this.isSplit = true;
    }

    renderTo(target) {
        this.target = target;

        var htmlElement = template({gui: this.guiModel, field: this.field, self: this});
        var targetElement = $(this.target);

        targetElement.html(htmlElement);

        this.target = $(this.target).find('.split-element');

        this.getGUIModel().mainSize = samilEnums.BOOTSTRAP.ROW_MAX_SIZE;

        this.renderChildren();
        this.doAfterRender(targetElement);
    }

}

export default SplitGUIComponent;
