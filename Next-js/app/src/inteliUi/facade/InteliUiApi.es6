/**
 * Created by bartosz on 13.07.15.
 *
 * InteliUiFacade class
 */
import InteliUi from './../InteliUi';
import InteliUiEntity from './../entity/InteliUiEntity';
import OutputConverter from '../converters/OutputConverter';
import InputConverter from '../converters/InputConverter';

class InteliUiApi {

    /**
     * Start the empty inteliUi
     */
    startEmptyInteliUi(container) {
        var inteliUi = this.start(container);

        inteliUi.isEmptyStart = true;

        inteliUi.openEmptyOption(inteliUi.startInteliUi);

        inteliUi.saveWorkspaceButton.click(function () {
            inteliUi.showResult();
        });
    }

    /**
     * Start the inteliUi and open the Option which id has been given
     *
     * It is not available till the inteliUi is fully started
     *
     * @param optionId
     * @param container
     */
    startInteliUiWithOption(optionId, container) {
        var inteliUi = this.start(container);

        inteliUi.isEmptyStart = false;

        inteliUi.openOption(optionId, inteliUi.startInteliUi);
    }

    /**
     * The method to open the earlier saved option workspace
     *
     * It is not available till the inteliUi is fully started
     *
     * @param container
     */
    startInteliUiWithOptionFromFile(container) {
        var inteliUi = this.start();

        inteliUi.container = container;
        inteliUi.isEmptyStart = false;

        inteliUi.view.showOpenFilePickerModal(inteliUi);
    }

    /**
     * Method to save the Option Workspace as Option
     *
     * @param container
     */
    getOptionFromWorkspace(container) {
        var inteliUi = this.start();

        return inteliUi.getOption(container);
    }

    /**
     * @private
     *
     * @param container
     */
    start(container) {
        var inteliUi = new InteliUi();

        inteliUi.showIndicator();

        inteliUi.saveWorkspaceButton = $('#save-workspace');
        inteliUi.exportPortalToOption = $('#export-option');
        inteliUi.saveAndExitButton = $('.modal-content').find('#btnSave');
        inteliUi.inteliUiTarget = {
            boxContainer: '#inteliUi-container',
            srcContainer: '#inteliUi-src'
        };

        if (container) {
            container.html('');
        }

        return inteliUi;
    }

}

export default InteliUiApi;