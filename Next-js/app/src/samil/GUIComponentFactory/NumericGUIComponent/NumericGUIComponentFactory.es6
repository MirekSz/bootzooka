/**
 * Created by bstanislawski on 2015-12-11.
 */
import NumericGUIComponent from './NumericGUIComponent';

class NumericGUIComponentFactory {

    build(element) {
        return new NumericGUIComponent(element);
    }

}

export default new NumericGUIComponentFactory();
