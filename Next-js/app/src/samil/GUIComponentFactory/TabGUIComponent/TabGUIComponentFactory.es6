/**
 * Created by bstanislawski on 2015-12-11.
 */
import TabGUIComponent from './TabGUIComponent';

class TabGUIComponentFactory {

    build(element) {
        return new TabGUIComponent(element);
    }

}

export default new TabGUIComponentFactory();
