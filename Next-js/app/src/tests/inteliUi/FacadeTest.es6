/**
 * Created by bartosz on 12.08.15.
 *
 * InterfaceTest class
 */
import InteliUiApi from '../../inteliUi/facade/InteliUiApi';

const TIME_DELAY = 1000;

class FacadeTest {

    run() {
        describe('Start InteliUi API tests', function () {
            const UNIT_OPTION_ID = 'pl.com.stream.verto.cmm.plugin.unit-client.UnitOption';
            const INTELI_UI_CLASS = 'diagram-builder';
            var inteliUiApi = new InteliUiApi();

            it('should show empty InteliUi editor', function () {
                var container = $('#inteliUi-container');

                inteliUiApi.startEmptyInteliUi(container);

                setTimeout(function () {
                    expect(container.html()).to.be.contains(INTELI_UI_CLASS);

                    $(`.${INTELI_UI_CLASS}`).remove();
                }, TIME_DELAY);
            });

            it('should show InteliUi editor with open unit option', function () {
                var container = $('#inteliUi-container');

                inteliUiApi.startInteliUiWithOption(UNIT_OPTION_ID, container);

                setTimeout(function () {
                    expect(container.html()).to.be.contains(INTELI_UI_CLASS);

                    $(`.${INTELI_UI_CLASS}`).remove();
                }, TIME_DELAY);
            });

        });
    }

}

export default FacadeTest;
