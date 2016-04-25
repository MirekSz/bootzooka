/**
 * Created by bartosz on 12.08.15.
 *
 * InputAdapterTest class
 */
import InputConverter from '../../inteliUi/converters/InputConverter';
import OptionDefinitionRegistry from '../../compositeComponentsDefinitions/OptionDefinitionRegistry';
import CompositionFactory from '../../compositeComponents/TestCompositionFactory';

class InputConverterTest {

    run() {
        describe('Start InteliUi input converters tests', function () {
            var self = this;
            const TYPE_VIEW = 'view';
            const TYPE_ACTION = 'action';
            const UNIT_OPTION_ID = 'pl.com.stream.verto.cmm.plugin.unit-client.UnitOption';
            var inputConverter = new InputConverter();
            var optionById = OptionDefinitionRegistry.getPlatformOptionById(UNIT_OPTION_ID);

            afterEach(function () {
                $("#workspace").empty();
            });

            it('should provide the palette for the inteliUi editor', function () {
                var palette = inputConverter.getPalette();

                expect(palette).not.be.undefined;

                it('palette should contains view and action', function () {
                    var areAllElementsInCorrectTypes = true;

                    palette.forEach(function (element) {
                        var type = element.type;

                        if (!(type === TYPE_ACTION || type === TYPE_VIEW)) {
                            areAllElementsInCorrectTypes = false;
                        }
                    });

                    expect(areAllElementsInCorrectTypes).to.be.true;
                });
            });

            it('in case of option opening, should provide the fields', function () {
                optionById.then((optionDef) => {
                    var option = CompositionFactory.createOption(optionDef);
                    var fields = inputConverter.getFields(option);

                    expect(fields).not.be.undefined;

                    it('should contains basic attributes', function () {

                        fields.forEach(function (field) {
                            expect(field.id).not.be.undefined;
                            expect(field.componentName).not.be.undefined;
                            expect(field.type).not.be.undefined;

                        });

                    });
                });
            });

            it('in case of option opening, should provide the connections', function () {
                optionById.then((optionDef) => {
                    var option = CompositionFactory.createOption(optionDef);
                    var connections = inputConverter.getConnections(option);

                    expect(connections).not.be.undefined;

                    $("#workspace").empty();
                });
            });

            //TODO: open from file tests

        });
    }

}

export default InputConverterTest;
