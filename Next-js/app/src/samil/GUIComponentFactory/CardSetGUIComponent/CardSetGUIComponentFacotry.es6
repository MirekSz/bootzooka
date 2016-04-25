/**
 * Created by bstanislawski on 2016-01-21.
 */
import CardSetGUIComponent from './CardSetGUIComponent';

class CardSetGUIComponentFactory {

    /**
     * @param {GUIElementDef} element
     */
    build(element) {
        return new CardSetGUIComponent(element);
    }

}

export default new CardSetGUIComponentFactory();