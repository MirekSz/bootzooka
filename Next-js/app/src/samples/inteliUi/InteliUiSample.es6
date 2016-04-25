/**
 * Created by bstanislawski on 2016-03-09.
 */
import InteliUi from '../../inteliUi/InteliUi';
import bs from '../../lib/rendering/BootstrapApi';

const inteliUiSample = {

    showInteliUi() {
        var inteliUi = new InteliUi();

        var options = {
            id: 'inteliUi', //-modal
            model: {
                id: 'inteliUi-modal',
                size: 'xl'
            },
            onshownCallback: inteliUi.showInteliUiInModal,
            inteliUi: inteliUi,
            callback: inteliUi.handleInteliUiMenu,
            closeByBackdrop: false,
            closeByKeyboard: false,
            closable: false,
            primaryButtonAction: function () {
                return confirm('Jesteś pewny, że chcesz zamknąć to okno ?');
            }
        };

        bs.showModal(options);
    }

};

export default inteliUiSample;