/**
 * Created by bartek on 2015-10-29.
 */
import OperatorDef from '../../operator/OperatorDef';
import operatorRegistry from '../../operator/OperatorRegistry';

class LoginRegistry {

    getUserData(givenData) {
        var self = this;

        return new Promise(resolve => {
            operatorRegistry.login(givenData).then(loginStatus => {
                var status = loginStatus.logged;

                if (status) {
                    var permittedPortalIds = loginStatus.permittedPortalIds;

                    self.setLocalSession(givenData);

                    operatorRegistry.getOperators(givenData.userName).then(operatorsData => {
                        operatorsData.forEach(operatorData => {
                            if (operatorData.login === givenData.userName) {
                                var operatorDef = new OperatorDef(operatorData);

                                operatorDef.setPermittedPortalIds(permittedPortalIds);

                                return resolve(operatorDef);
                            }
                        });
                    });
                } else {
                    resolve({status: status});
                }
            });
        });
    }

    /**
     * @private
     *
     * @param givenData
     */
    setLocalSession(givenData) {
        if (givenData.rememberMe) {
            localStorage.setItem('userName', givenData.userName);
            localStorage.setItem('password', givenData.password);
        }

        sessionStorage.setItem('userName', givenData.userName);
        sessionStorage.setItem('password', givenData.password);
    }
}

export default new LoginRegistry();