/**
 * Created by bstanislawski on 2016-01-18.
 */
import TabSetGUIComponent from './TabSetGUIComponent';

class TabSetGUIComponentFactory {

    build(element) {
        return new TabSetGUIComponent(element);
    }

}

export default new TabSetGUIComponentFactory();
