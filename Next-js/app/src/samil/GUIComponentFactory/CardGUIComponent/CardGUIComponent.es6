/**
 * Created by bstanislawski on 2016-01-21.
 */
import BaseGUIComponent from '../../BaseGUIComponent';

class CardGUIComponent extends BaseGUIComponent {

    /**
     * @param {GUIElementDef} element
     */
    constructor(element) {
        super(element);

        this.isCard = true;
    }
}

export default CardGUIComponent;