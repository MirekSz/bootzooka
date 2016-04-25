/**
 * Created by bstanislawski on 2015-11-17.
 */
import bs from './BootstrapApi';

class Dialogs {

    showConfirmation(question, options) {
        bs.showModal({
            title: '',
            model: {
                body: `<p>${question}</p>`
            },
            primaryButtonAction: dialog => {
                dialog.close();

                return options.callback(options);
            }
        });
    }

}

export default new Dialogs();
