/**
 * Created by bstanislawski on 2015-12-11.
 */
import RowGUIComponent from './RowGUIComponent';

class RowGUIComponentFactory {

    build(element) {
        return new RowGUIComponent(element);
    }

}

export default new RowGUIComponentFactory();