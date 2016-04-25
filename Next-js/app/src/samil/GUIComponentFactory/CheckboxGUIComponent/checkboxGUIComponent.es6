/**
 * Created by bstanislawski on 2015-12-11.
 */
import BaseGUIComponent from '../../BaseGUIComponent';
import template from './checkbox.hbs';
import defaultPropertiesRegistry from '../../DefaultPropertiesRegistry';

class CheckboxGUIComponent extends BaseGUIComponent {

    /**
     * @param {GUIElementDef} elementDef
     */
    constructor(elementDef) {
        super(elementDef, template);

        this.isCheckbox = true;

        this.guiModel.preferedWidth = defaultPropertiesRegistry.preferedSizes.CHECKBOX;
    }

    addUIListenersImpl(uIListenerBinder) {
        uIListenerBinder.addFocusIn(this.target.find('input'), event => {
            this.setActive();
        });
        uIListenerBinder.addFocusOut(this.target.find('input'), event => {
            this.setDeactive();
        });
        uIListenerBinder.addClick(this.target.find('input'), event => {
            this.setValue(event.target.checked);
        });
    }
}

export default CheckboxGUIComponent;
