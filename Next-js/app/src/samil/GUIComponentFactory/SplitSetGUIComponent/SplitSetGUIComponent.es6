/**
 * Created by bstanislawski on 2016-01-18.
 */
import BaseGUICompositeComponent from '../../BaseGUICompositeComponent';
import template from './split_set.hbs';
import samilEnums from '../../../enums/SamilEnums';
import child_layout_template from './split_set_children_layout.hbs';
import RowGUIComponentViewController from '../RowGUIComponent/RowGUIComponentViewController';

class TabSetGUIComponent extends BaseGUICompositeComponent {

    constructor(element) {
        super(element);

        this.isSplitSet = true;
    }

    renderTo(target) {
        var htmlElement = template({gui: this.guiModel, field: this.field, self: this});
        var targetElement = $(target);

        targetElement.html(htmlElement);

        this.target = $(target).find('.split-set-content');

        this.renderChildren();
        this.doAfterRender(targetElement);
    }

    renderChildrenLayout() {
        this.calculateColumnsWidth();

        var templateWithSlots = child_layout_template(this);

        $(this.target).html(templateWithSlots);
    }

    calculateColumnsWidth() {
        var childrenNumber = this.children.length;
        var equalWidth = Math.floor(samilEnums.BOOTSTRAP.ROW_MAX_SIZE / childrenNumber);

        this.children.forEach(child => {
            var childGUIModel = child.getGUIModel();

            childGUIModel.mainSize = equalWidth;
        });
    }

    doAfterRenderImpl(targetElement) {
        this.initSplitter();
    }

    initSplitter() {
        var height = getContainerHeight(this.target);

        $(this.target).jqxSplitter({width: '100%', height: height});

        bindHeightControl(this.target);
    }

}

function bindHeightControl(target) {
    target.on('resize', event => {
        target.jqxSplitter('disable');

        var height = getContainerHeight(target, true);

        target.jqxSplitter({width: '100%', height: height});
        target.jqxSplitter('enable');
    });
}

function getContainerHeight(target, isRefresh) {
    var height = 0;
    var offset = 15;

    target.children().each((index, child) => {
        var childTab = $(child).closest('.tab-pane');
        var childHeight = 0;

        if (isRefresh) {
            var biggestElement;

            $(child).find('*').each((index, element) => {
                biggestElement = $(element).outerHeight();

                if (biggestElement > childHeight) {
                    childHeight = biggestElement;
                }
            });
        } else {
            childTab.addClass('in active');
            childHeight = $(child).height();
            childTab.removeClass('in active');
        }

        if (childHeight > height) {
            height = childHeight;
        }
    });

    return height + offset;
}

export default TabSetGUIComponent;
