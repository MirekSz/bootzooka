/**
 * Created by bartosz on 20.05.15.
 *
 * Portal Action Definition class
 */
class PortalActionDef {

    constructor(id, optionDef) {
        this.id = id;
        this.optionDef = optionDef;
        this.idOption = optionDef.id;
        this.name = optionDef.name;

        this.group = optionDef.group;
    }

    setGroup(group) {
        this.group = group;
    }

    getGroup() {
        return this.group;
    }

}

export default PortalActionDef;