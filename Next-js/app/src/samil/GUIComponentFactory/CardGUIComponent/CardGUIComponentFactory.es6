/**
 * Created by bstanislawski on 2016-01-21.
 */
import CardGUIComponent from './CardGUIComponent';

class CardGUIComponentFactory {

    /**
     * @param {GUIElementDef} element
     */
    build(element) {
        return new CardGUIComponent(element);
    }

}

export default new CardGUIComponentFactory();