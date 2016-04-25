/**
 * Created by bstanislawski on 2016-01-14.
 */
import SpringGUIComponent from './SpringGUIComponent';


class SpringGUIComponentFactory {

    build(element) {
        return new SpringGUIComponent(element);
    }

}

export default new SpringGUIComponentFactory();
