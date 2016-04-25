/**
 * Created by bstanislawski on 2015-10-29.
 */
import BasicMethodsSet from '../inteliUi/BasicMethodsSet';

class OperatorDef extends BasicMethodsSet {

    constructor(args) {
        super();

        this.status = true;

        this.idOperator = args.idOperator;
        this.login = args.login;
        this.password = args.password;
        this.firstName = args.firstName;
        this.lastName = args.lastName;
        this.version = args.version;

        this.company = 'Streamsoft';
        this.nameToShow = this.firstName + ' ' + this.lastName;
        this.isAdmin = args.admin;

        this.permittedPortalIds = args.permittedPortalIds || [];
    }

    setAdminPermission(permission) {
        this.isAdmin = permission;
    }

    addPermittedPortalId(permittedPortalId) {
        this.permittedPortalIds.push(permittedPortalId);
    }

    removePermittedPortalId(permittedPortalId) {
        super.removeFromArray(this.permittedPortalIds, permittedPortalId);
    }

    setPermittedPortalIds(permittedPortalIds) {
        this.permittedPortalIds = permittedPortalIds;
    }

    getAdminPermission() {
        return this.isAdmin;
    }

    getPermittedPortalIds() {
        return this.permittedPortalIds;
    }

    updateUserAttribute(key, value) {
        if (key !== 'permittedPortalIds') {
            this[key] = value;
        }
    }

    addPermittedPortal(id) {
        var isAlreadyAdded = false;
        this.permittedPortalIds.forEach(portalId => {
            if (portalId.id === id) {
                isAlreadyAdded = true;
            }
        });

        if (!isAlreadyAdded) {
            this.permittedPortalIds.push(id);
        }
    }

    removePermisttedPortal(id) {
        super.removeFromArray(this.permittedPortalIds, id);
    }
}

export default OperatorDef;