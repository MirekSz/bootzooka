/**
 * Created by bstanislawski on 2016-01-14.
 */
import BaseGUIComponent from '../../BaseGUIComponent';
import template from './spring.hbs';
import samilEnums from '../../../enums/SamilEnums';

class SpringGUIComponent extends BaseGUIComponent {

    /**
     *
     * @param {GUIElementDef} element
     */
    constructor(element) {
        super(element, template);

        this.noField = true;

        this.isSpring = true;
    }

    setTypeAttributes() {
        var guiModel = this.getGUIModel();
        var expandX = this.def.attributes.get('expandx');
        var expandY = this.def.attributes.get('expandy');

        if (expandX) guiModel.expandx = parseInt(expandX);
        if (expandY) guiModel.expandy = parseInt(expandY);
    }

}

export default SpringGUIComponent;
