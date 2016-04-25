/**
 * Created by bstanislawski on 2015-12-11.
 */
import ContainerGUIComponent from './ContainerGUIComponent';

class ContainerGUIComponentFactory {

    build(element) {
        return new ContainerGUIComponent(element);
    }

}

export default new ContainerGUIComponentFactory();
