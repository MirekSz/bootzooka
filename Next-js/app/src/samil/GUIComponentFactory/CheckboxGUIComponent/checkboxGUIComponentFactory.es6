/**
 * Created by bstanislawski on 2015-12-11.
 */
import CheckboxGUIComponent from './checkboxGUIComponent';

class CheckboxGUIComponentFactory {

    build(element) {
        return new CheckboxGUIComponent(element);
    }

}

export default new CheckboxGUIComponentFactory();
