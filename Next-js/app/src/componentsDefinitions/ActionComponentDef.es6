/**
 * Created by bartosz on 20.05.15.
 *
 * Action Registry Element class
 */
import BaseComponentDefinition from './BaseComponentDefinition';
import Types from '../enums/ComponentsDefinitionsTypes';

class ActionComponentDef extends BaseComponentDefinition {

    constructor(id, type, icon, name, actionExtension) {
        var localType = type || Types.ACTIONS.SERVICE_METHOD_INVOKER_ACTION;

        super({id: id, type: localType, icon: icon, name: name});

        this.actionExtension = actionExtension;
    }

}

export default ActionComponentDef;