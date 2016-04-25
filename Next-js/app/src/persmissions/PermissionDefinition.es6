/**
 * Created by bartosz on 27.10.15.
 *
 * Permission Definition class
 */
import BasicMethodsSet from '../inteliUi/BasicMethodsSet';

class PermissionDefinition extends BasicMethodsSet {

    constructor(element) {
        super();

        this.idPortalPermission = element.idPortalPermission;
        this.idPortalPermissionType = element.idPortalPermissionType;

        this.idOperator = element.idOperator;
        this.idOperatorGroup = element.idOperatorGroup;

        this.portalId = element.portalId;

        this.operators = element.operator;
        this.operationGroup = element.group;
    }

    addOperator(operatorDef) {
        this.operators.push(operatorDef);
    }

    removeOperator(operatorDef) {
        super.removeFromArray(this.operators, operatorDef);
    }

    addOperatorGroup(operatorDef) {
        this.operationGroup = operatorDef;
    }

    removeOperatorGroup(operatorGroup) {
        super.removeFromArray(this.operatorGroups, operatorGroup);
    }

}

export default PermissionDefinition;