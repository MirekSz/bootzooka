/**
 * Created by bartosz on 10.06.15.
 *
 * LayoutManagerDataProvider class
 */
import OptionDef from '../../compositeComponentsDefinitions/option/OptionDef';
import CompositionFactory from '../../compositeComponents/TestCompositionFactory';
import PortalDef from '../../compositeComponentsDefinitions/PortalDef';
import Globals from '../../enums/GlobalEnums';
import GridPosition from '../../components/GridPosition';
import Types from '../../enums/ComponentsDefinitionsTypes';
import PortalActionDef from '../../compositeComponentsDefinitions/PortalActionDef';
import Portal from '../../compositeComponents/TestPortal/Portal';

class LayoutManagerDataProvider {

    create(testDataProvider) {
        const OPEN_CUSTOMER_OPTION = 'openCustomerOption';
        const PERSPECTIVE_ID = 'PortalId';


        var viewDef = testDataProvider.viewDef;
        var actionDef = testDataProvider.actionDef;

        const CUSTOMER_OPTION = 'CustomerOption';
        const ID_SELECT_ROW = 'IdSelectRow';

        var optionDef = new OptionDef({
            id: CUSTOMER_OPTION
        });

        var portalDef = new PortalDef({
            id: PERSPECTIVE_ID
        });

        optionDef.addViewDef(viewDef);
        optionDef.addActionDef(actionDef);
        optionDef.addConnectionDef(viewDef.id, ID_SELECT_ROW, actionDef.id, Globals.ID_BEAN);

        var option = CompositionFactory.createOption(optionDef);

        var openCustomerOptionActionDef = new PortalActionDef(OPEN_CUSTOMER_OPTION, optionDef);

        portalDef.addActionDef(openCustomerOptionActionDef);

        var portal = new Portal(portalDef);

        portal.addOption(option);

        return {
            portal: portal,
            option: option
        };
    }

}

export default LayoutManagerDataProvider;
