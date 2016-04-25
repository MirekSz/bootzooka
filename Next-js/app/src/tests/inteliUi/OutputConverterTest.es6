/**
 * Created by bartosz on 12.08.15.
 *
 * OutputAdapterTest class
 */
import OutputConverter from '../../inteliUi/converters/OutputConverter';
import InteliUi from '../../inteliUi/InteliUi';

class OutputConverterTest {

    run() {
        const UNIT_OPTION_ID = 'pl.com.stream.verto.cmm.plugin.unit-client.UnitOption';
        const UNIT_ID = 'UnitOption';

        describe('Start InteliUi output converter tests', function () {
            var outputConverter = new OutputConverter();
            var inteliUi = new InteliUi();

            afterEach(function () {
                $('#workspace').empty();
            });

            it('should be abe to convert inteliUi project to next objects', function () {
                $.getJSON('UnitOption.json', function (workspace) {
                    inteliUi.setOptionId(UNIT_OPTION_ID);

                    outputConverter.convertToNextOption(workspace, inteliUi);

                    setTimeout(function () {
                        var target = $('#workspace');

                        expect(target.html()).to.contains(UNIT_ID);

                        target.empty();
                    }, 1000);
                });
            });

        });
    }

}

export default OutputConverterTest;
