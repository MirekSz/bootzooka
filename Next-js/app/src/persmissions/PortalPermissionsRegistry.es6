/**
 * Created by bartek on 2015-10-27.
 */
import serverConnector from '../lib/ServerConnector';

const PERMISSION_URL = '/permission';
const PERMISSION_BY_ID_URL = '/permission/byId';

class PortalPermissionsRegistry {

    /**
     * @param {PermissionDefinition} permissionDef
     */
    add(permissionDef) {
        return serverConnector.post(PERMISSION_URL, permissionDef);
    }

    /**
     * @param id
     * @returns {Promise}
     */
    remove(id) {
        return serverConnector.remove(PERMISSION_BY_ID_URL, {id});
    }

}

export default new PortalPermissionsRegistry();