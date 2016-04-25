/**
 * Created by bstanislawski on 2016-01-19.
 */
import SplitGUIComponent from './SplitSetGUIComponent';

class SplitSetGUIComponentFactory {

    build(element) {
        return new SplitGUIComponent(element);
    }

}

export default new SplitSetGUIComponentFactory();
