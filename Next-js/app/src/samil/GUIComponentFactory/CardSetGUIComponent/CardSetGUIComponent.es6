/**
 * Created by bstanislawski on 2016-01-21.
 */
import BaseGUICompositeComponent from '../../BaseGUICompositeComponent';

class CardSetGUIComponent extends BaseGUICompositeComponent {

    /**
     * @param {GUIElementDef} element
     */
    constructor(element) {
        super(element);

        this.isCardSet = true;
    }

}

export default CardSetGUIComponent;