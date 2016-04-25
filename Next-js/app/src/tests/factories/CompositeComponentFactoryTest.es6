/**
 * Created by bartosz on 03.06.15.
 *
 * CompositionFactoryTest class
 */
import OptionDef from '../../compositeComponentsDefinitions/OptionDef';
import CompositionFactory from '../../compositeComponents/TestCompositionFactory';
import Globals from '../../enums/GlobalEnums';

class CompositionFactoryTest {

    run(testDataProvider) {
        describe('Start CompositionFactoryTest...', function () {
                var viewDef = testDataProvider.viewDef;
                var actionDef = testDataProvider.actionDef;

                let expect = require('chai').expect;

                describe('create the option definition', function () {
                    const CUSTOMER_OPTION = 'CustomerOption';
                    const ID_SELECT_ROW = 'IdSelectRow';

                    var optionDef = new OptionDef({
                        id: CUSTOMER_OPTION
                    });


                    it('has been created ?', function () {
                        expect(optionDef.id).to.be.equal(CUSTOMER_OPTION);
                    });


                    describe('add view, action and connection to the option', function () {
                        optionDef.addViewDef(viewDef);
                        optionDef.addActionDef(actionDef);
                        optionDef.addConnectionDef(viewDef.id, ID_SELECT_ROW, actionDef.id, Globals.ID_BEAN);


                        describe('now we are creating the option', function () {
                            var option = CompositionFactory.createOption(optionDef);

                            it('has been created correctly ?', function () {
                                expect(option.getComponent(viewDef.id).def).to.be.equal(viewDef);
                                expect(option.getComponent(actionDef.id).def).to.be.equal(actionDef);
                            });

                        });

                    });

                });

            }
        )
        ;
    }
}

export default CompositionFactoryTest;
