/**
 * Created by bstanislawski on 2015-12-11.
 */
import InputGUIComponent from './InputGUIComponent';

class InputGUIComponentFactory {

    build(element) {
        return new InputGUIComponent(element);
    }

}

export default new InputGUIComponentFactory();
