/**
 * Created by bstanislawski on 2015-10-29.
 */
import LoginView from './LoginView'

class LoginController {

    loginValidation() {
        var self = this;
        var $loginContainer = $('#login-container');
        var $emailInput = $loginContainer.find('#username');
        var $passwordInput = $loginContainer.find('#password');
        var inputs = [$emailInput, $passwordInput];
        var isError = false;

        inputs.forEach(input => {
            if (self.checkInputEmpty(input)) {
                isError = true;
            }
        });

        return isError;
    }

    checkInputEmpty($input) {
        var error = 'Pole nie może być puste';
        var isError = false;
        var loginView = new LoginView();

        if ($input.val() === '') {
            loginView.showValidationError($input, error);
            isError = true;
        }

        return isError;
    }

    logoutUser() {
        localStorage.userName = null;
        localStorage.password = null;

        sessionStorage.userName = null;
        sessionStorage.password = null;
    }

}

export default LoginController;