/**
 * Created by bstanislawski on 2015-12-11.
 */
import SplitGUIComponent from './SplitGUIComponent';

class SplitGUIComponentFactory {

    build(element) {
        return new SplitGUIComponent(element);
    }

}

export default new SplitGUIComponentFactory();
