/**
 * Created by bartosz on 09.06.15.
 *
 * PortalFactoryTest class
 */
import OptionDef from '../../compositeComponentsDefinitions/OptionDef';
import CompositionFactory from '../../compositeComponents/TestCompositionFactory';
import PortalDef from '../../compositeComponentsDefinitions/PortalDef';
import Globals from '../../enums/GlobalEnums';
import PortalActionDef from '../../compositeComponentsDefinitions/PortalActionDef';
import Portal from '../../compositeComponents/TestPortal/Portal';

class PortalFactoryTest {

    run(testDataProvider) {

        describe('Start PortalFactoryTest...', function () {
                const OPEN_CUSTOMER_OPTION = 'openCustomerOption';
                const PERSPECTIVE_ID = 'PortalId';


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

                    describe('create the portal definition', function () {
                        var portalDef = new PortalDef({
                            id: PERSPECTIVE_ID
                        });

                        it('has been created ?', function () {
                            expect(portalDef.id).to.be.equal(PERSPECTIVE_ID);
                        });

                        describe('add view, action and connection to the option', function () {
                            optionDef.addViewDef(viewDef);
                            optionDef.addActionDef(actionDef);
                            optionDef.addConnectionDef(viewDef.id, ID_SELECT_ROW, actionDef.id, Globals.ID_BEAN);


                            describe('now we are creating the option and the portal action to open it...', function () {
                                var option = CompositionFactory.createOption(optionDef);

                                var openCustomerOptionActionDef = new PortalActionDef(OPEN_CUSTOMER_OPTION, optionDef);

                                portalDef.addActionDef(openCustomerOptionActionDef);


                                it('has been created correctly ?', function () {
                                    expect(option.getComponent(viewDef.id).def).to.be.equal(viewDef);
                                    expect(option.getComponent(actionDef.id).def).to.be.equal(actionDef);
                                });

                                it('and how about the portalActionDef ? ', function () {
                                    expect(portalDef.getActionDef(OPEN_CUSTOMER_OPTION)).to.be.equal(openCustomerOptionActionDef);
                                });

                                describe('create new portal', function () {
                                    var portal = new Portal(portalDef);

                                    describe('user click the customer option action button on the portal', function () {
                                        portal.addOption(option);

                                        it('lets check the option has been added to the portal', function () {
                                            expect(portal.getOption(option.id)).to.be.equal(option);
                                        });
                                    });
                                });

                            });

                        });

                    });

                });

            }
        )
        ;
    }

}

export default PortalFactoryTest;
