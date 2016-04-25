/**
 * Created by bartosz on 20.05.15.
 *
 * View Registry Element class
 */
import BaseComponentDefinition from './BaseComponentDefinition';
import types from '../enums/ComponentsDefinitionsTypes';

class ViewComponentDef extends BaseComponentDefinition {

    constructor(id, type, icon, name, viewExtension) {
        var localType = type || types.VIEWS.TEST_TABLE;
        super({id: id, type: localType, icon: icon, name: name});
        this.viewExtension = viewExtension;
    }

    /**
     * @param window
     */
    addWindow(window,) {
        this.window = window;
    }

}

export default ViewComponentDef;
