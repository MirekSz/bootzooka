/**
 * Created by bstanislawski on 2015-11-10.
 */
import serverConnector from '../../lib/ServerConnector';

const OPERATOR_NOT_LOGGED = '/operator/notLogged';

class TestRegistry {

    constructor() {
    }

    getNotLogged() {
        return serverConnector.getListOfObject(OPERATOR_NOT_LOGGED, {query: ''});
    }
}

export default TestRegistry;