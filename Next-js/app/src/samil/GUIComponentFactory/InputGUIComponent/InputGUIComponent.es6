/**
 * Created by bstanislawski on 2015-12-11.
 */
import BaseGUIComponent from '../../BaseGUIComponent';
import template from './input.hbs';
import samilEnums from '../../../enums/SamilEnums';
import defaultPropertiesRegistry from '../../DefaultPropertiesRegistry';

class InputGUIComponent extends BaseGUIComponent {

    /**
     * @param {GUIElementDef} elementDef
     */
    constructor(elementDef) {
        super(elementDef, template);

        this.isInput = true;
        this.preferedCharLength = defaultPropertiesRegistry.preferedSizes.INPUT;

        this.guiModel.preferedWidth = Math.round(samilEnums.BOOTSTRAP.CHAR_SIZE * this.preferedCharLength);
    }

    addUIListenersImpl(uIListenerBinder) {
        uIListenerBinder.addKeyUp(this.target.find('input'), event => {
            this.valueModified();
        });
        uIListenerBinder.addFocusIn(this.target.find('input'), event => {
            this.setActive();
        });
        uIListenerBinder.addFocusOut(this.target.find('input'), event => {
            this.setDeactive();
            this.setValue(event.target.value);
        });
    }

}

export default InputGUIComponent;
