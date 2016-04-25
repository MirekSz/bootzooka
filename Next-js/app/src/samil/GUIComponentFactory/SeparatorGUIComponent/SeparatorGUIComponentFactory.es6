import SeparatorGUIComponent from './SeparatorGUIComponent';

class SeparatorGUIComponentFactory {

    build(element) {
        return new SeparatorGUIComponent(element);
    }

}

export default new SeparatorGUIComponentFactory();
