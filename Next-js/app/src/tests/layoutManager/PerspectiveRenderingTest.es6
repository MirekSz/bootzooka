import CompositionFactory from '../../compositeComponents/TestCompositionFactory';
import Types from '../../enums/ComponentsDefinitionsTypes';
import PortalDef from '../../compositeComponentsDefinitions/PortalDef';
import OptionDefinitionRegistry from '../../compositeComponentsDefinitions/OptionDefinitionRegistry';
import PortalActionDef from '../../compositeComponentsDefinitions/PortalActionDef';
import {wait} from '../TestingTools';

/**
 * Created by Mirek on 2015-06-06.
 */
class PortalRenderingTest {

    run() {
        describe('Start TestPortal rendering tests', function () {
                before(function (done) {
                    setTimeout(function () {
                        done();
                    }, 500);
                });
                let portal;
                afterEach(function () {
                    portal.dispose();
                    $("#workspace").empty();
                });
                const UNIT_OPTION_ID = 'pl.com.stream.verto.cmm.plugin.unit-client.UnitOption';
                const CUSTOMER_OPTION_ID = 'pl.com.stream.verto.cmm.plugin.customer-client.CustomerOption';

                const PERSPECTIVE_ID = 'PortalId';
                const ACTION_UNIT_OPTION_ID = 'openUnitOption';
                const ACTION_CUSTOMER_OPTION_ID = 'openCustomeOption';

                let portalDef = new PortalDef({id: PERSPECTIVE_ID, type: Types.FACTORY_TYPES.PERSPECTIVE});
                let unitOptionDef = OptionDefinitionRegistry.getPlatformOptionById(UNIT_OPTION_ID);
                let customerOptionDef = OptionDefinitionRegistry.getPlatformOptionById(CUSTOMER_OPTION_ID);

                Promise.all([unitOptionDef, customerOptionDef]).then(res => {
                    portalDef.addActionDef(new PortalActionDef(ACTION_UNIT_OPTION_ID, res[0]));
                    portalDef.addActionDef(new PortalActionDef(ACTION_CUSTOMER_OPTION_ID, res[1]));
                });


                it("should render TestPortal", function () {
                    //given
                    var target = $("#workspace");
                    portal = CompositionFactory.createPortal(portalDef);

                    //when
                    portal.renderTo(target);

                    //then
                    expect(target.html()).to.be.contains(portalDef.id);
                });

                it("should render slots for actions ", function () {
                    //given
                    var target = $("#workspace");
                    portal = CompositionFactory.createPortal(portalDef);

                    //when
                    portal.renderTo(target);

                    //then
                    expect(target.html()).to.be.contains(ACTION_UNIT_OPTION_ID);
                    expect(target.html()).to.be.contains(ACTION_CUSTOMER_OPTION_ID);
                });

                it("should render actions with listeners", function () {
                    //given
                    var target = $("#workspace");
                    portal = CompositionFactory.createPortal(portalDef);

                    //when
                    portal.renderTo(target);

                    //then
                    expect(target.find(`#${ACTION_UNIT_OPTION_ID}`).length).to.be.eq(1);
                    expect(target.find(`#${ACTION_CUSTOMER_OPTION_ID}`).length).to.be.eq(1);
                });

                it("should execute action and open option in TestPortal workspace", function (done) {
                    //given
                    const target = $("#workspace");

                    portal = CompositionFactory.createPortal(portalDef);
                    portal.renderTo(target);
                    let unitOptionAction = target.find(`#${ACTION_UNIT_OPTION_ID}`);

                    //when
                    expect(target.html()).to.not.contains(UNIT_OPTION_ID);
                    unitOptionAction.click();

                    //then
                    wait(function () {
                        expect(target.html()).to.be.contains(UNIT_OPTION_ID);
                    }, done);
                });


                it("should close opened option and remove all listeners", function (done) {
                    //given
                    let target = $("#workspace");
                    portal = CompositionFactory.createPortal(portalDef);
                    portal.renderTo(target);
                    let unitOptionAction = target.find(`#${ACTION_UNIT_OPTION_ID}`);

                    //when
                    target = $("#workspace");
                    expect(target.html()).to.not.contains(UNIT_OPTION_ID);
                    unitOptionAction.click();


                    //then
                    wait(function () {
                        portal.close(UNIT_OPTION_ID);
                        target = $("#workspace");
                        let html = target.html();
                        expect(html).to.not.contains(UNIT_OPTION_ID);
                    }, done);
                });
            }
        );
    }
}

export default PortalRenderingTest;
