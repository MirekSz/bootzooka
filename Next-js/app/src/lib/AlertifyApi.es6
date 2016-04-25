/**
 * Created by bstanislawski on 2015-11-12.
 */

class AlertifyApi {

    showError(errorText) {
        if (!global.testEnviroment) {
            alertify.error(errorText);
        }

        console.error(errorText);
    }

    showSuccessMsg(text) {
        if (!global.testEnviroment) {
            alertify.success(text);
        }

        console.log(text);
    }

}

export default new AlertifyApi();