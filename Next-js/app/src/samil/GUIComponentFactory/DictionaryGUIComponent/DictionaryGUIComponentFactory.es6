/**
 * Created by bstanislawski on 2015-12-11.
 */
import DictionaryGUIComponent from './DictionaryGUIComponent';

class DictionaryGUIComponentFactory {

    build(element) {
        return new DictionaryGUIComponent(element);
    }

}

export default new DictionaryGUIComponentFactory();
