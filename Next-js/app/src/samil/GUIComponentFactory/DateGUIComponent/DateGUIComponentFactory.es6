/**
 * Created by bstanislawski on 2015-12-11.
 */
import DateGUIComponent from './DateGUIComponent';

class DateGUIComponentFactory {

    build(element) {
        return new DateGUIComponent(element);
    }

}

export default new DateGUIComponentFactory();
