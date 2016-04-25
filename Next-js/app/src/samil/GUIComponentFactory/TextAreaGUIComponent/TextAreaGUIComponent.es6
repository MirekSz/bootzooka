/**
 * Created by bstanislawski on 2016-01-26.
 */
import BaseGUIComponent from '../../BaseGUIComponent';
import template from './text_area.hbs';
import defaultPropertiesRegistry from '../../DefaultPropertiesRegistry';

class TextAreaGUIComponent extends BaseGUIComponent {

    /**
     * @param {GUIElementDef} elementDef
     */
    constructor(elementDef) {
        super(elementDef, template);

        this.isTextArea = true;

        this.guiModel.preferedRowsNumber = defaultPropertiesRegistry.preferedSizes.TEXTAREA_ROWS_AMOUNT;
        this.guiModel.preferedWidth = defaultPropertiesRegistry.preferedSizes.TEXTAREA;
    }

    addUIListenersImpl(uIListenerBinder) {
        uIListenerBinder.addKeyUp(this.target.find('textarea'), event => {
            this.valueModified();
        });
        uIListenerBinder.addFocusIn(this.target.find('textarea'), event => {
            this.setActive();
        });
        uIListenerBinder.addFocusOut(this.target.find('textarea'), event => {
            this.setDeactive();
            this.setValue(event.target.value);
        });
    }

}

export default TextAreaGUIComponent;
