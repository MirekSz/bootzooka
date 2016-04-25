/**
 * Created by bstanislawski on 2015-12-11.
 */
import BaseGUIComponentView from '../../BaseGUIComponentView';

class MultiselectGUIComponent extends BaseGUIComponentView {

    constructor(element) {
        super(element);

        this.component = element;
    }

    selectElement(event) {
        var selectedElement = $(event.target);
        var $input = $('#dictionary-selected-element');

        $input.html(selectedElement.text());
    }

}

export default MultiselectGUIComponent;
