/**
 * Created by bstanislawski on 2016-01-26.
 */
import TextAreaGUIComponent from './TextAreaGUIComponent';

class TextAreaGUIComponentFactory {

    /**
     * @param {GUIElementDef} elementDef
     * @returns {TextAreaGUIComponent}
     */
    build(elementDef) {
        return new TextAreaGUIComponent(elementDef);
    }

}

export default new TextAreaGUIComponentFactory();
