/**
 * Created by bstanislawski on 2015-10-29.
 */
import serverConnector from '../lib/ServerConnector';

import OperatorComponentDef from './OperatorDef';

const OPERATOR_URL = '/operator';
const OPERATOR_LOGIN_URL = '/operator/login';
const OPERATOR_GROUP_URL = '/operator/groups';

class OperatorRegistry {

    /**
     *
     * @promise {Array.<OperatorDef>}
     */
    getOperators(query) {
        return serverConnector.getListOfObject(OPERATOR_URL, {query: query});
    }

    /**
     *
     * @promise {Array}
     */
    getGroups(query) {
        return serverConnector.getListOfObject(OPERATOR_GROUP_URL, {query: query});
    }

    /**
     *
     * @promise {OperatorDef}
     */
    login(loginInfo) {
        return serverConnector.post(OPERATOR_LOGIN_URL, {login: loginInfo.userName, password: loginInfo.password});
    }

}

export default new OperatorRegistry();