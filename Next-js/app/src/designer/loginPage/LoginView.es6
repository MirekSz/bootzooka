/**
 * Created by bstanislawski on 2015-10-29.
 */
import SiteView from '../SiteView';
import SiteApp from '../SiteApp';

import LoginController from './LoginController';
import loginRegistry from './LoginRegistry';

class LoginView {

    setLoginPanelsHandlers() {
        var self = new LoginView();
        var view = new SiteView();
        var app = new SiteApp();
        var loginController = new LoginController();

        var $lockEmblem = $('#lock-emblem');
        var $vertoEmblem = $('#verto-emblem');
        var $loginButton = $('#login-container').find('.btn-success');

        $lockEmblem.removeClass('beforeAnimation');
        $vertoEmblem.removeClass('beforeAnimation');

        $loginButton.click(e => {
            e.preventDefault();
            var validationError = loginController.loginValidation();

            if (!validationError) {
                self.collectUserInfo().then(user => {
                    if (user.status) {
                        app.showDashboard(user);

                        view.animateLoginHtml();
                    } else {
                        alertify.error('Podano złe dane logowania...');

                        $('.hpanel').addClass('shake' + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                            $(this).removeClass('shake');
                            $(this).removeClass('animated');
                        });

                        view.animateWrongCredentials();
                    }
                });
            }
        });
    }

    collectUserInfo() {
        var userName = $('#username').val();
        var password = $('#password').val();
        var rememberMe = $('#rememberMe')[0].checked;

        return loginRegistry.getUserData({userName: userName, password: password, rememberMe: rememberMe});
    }

    showValidationError($input, error) {
        var $formGroup = $input.parent();

        if (!$formGroup.hasClass('has-error')) {
            $formGroup.addClass('has-error');
            $input.after('<div class="error">' + error + '</div>');

            $formGroup.click(() => {
                $formGroup.removeClass('has-error');
                $formGroup.find('.error').remove();
            });

            $formGroup.keyup(() => {
                $formGroup.removeClass('has-error');
                $formGroup.find('.error').remove();
            });
        }
    }
}

export default LoginView;