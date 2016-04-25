/**
 * Created by bartosz on 20.05.15.
 *
 * Portal Definition class
 */
import types from '../enums/ComponentsDefinitionsTypes';

class PortalDef {

    constructor(element) {
        this.id = element.id;
        this.name = element.name || element.id;
        this.type = element.type || types.FACTORY_TYPES.PERSPECTIVE;

        this.groupsMap = [];
        this.actionDefMap = new Map();
    }

    /**
     *
     * @param {PortalActionDef} actionDef
     * @param {String} id
     */
    addActionDef(actionDef, id = actionDef.id) {
        this.actionDefMap.set(id, actionDef);
    }

    /**
     *
     * @param actionDefId
     * @returns {PortalActionDef}
     */
    getActionDef(actionDefId) {
        return this.actionDefMap.get(actionDefId);
    }

    /**
     *
     * @returns {Map<String,PortalActionDef>}
     */
    getActionDefMap() {
        return this.actionDefMap;
    }

    /**
     *
     * @param group
     * @param actionDefId
     */
    setGroupMap(group, actionDefId) {
        this.groupsMap.push({
            group: group,
            actionDefId: actionDefId
        });
    }

}

export default PortalDef;