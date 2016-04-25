/**
 * Created by bstanislawski on 2015-12-11.
 */
import MultiselectGUIComponent from './MultiselectGUIComponent';

class MultiselectGUIComponentFactory {

    build(element) {
        return new MultiselectGUIComponent(element);
    }

}

export default new MultiselectGUIComponentFactory();
