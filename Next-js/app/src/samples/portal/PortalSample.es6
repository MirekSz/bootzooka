"use strict";
/**
 * Created by Mirek on 2015-07-24.
 */
import PortalActionDef from '../../compositeComponentsDefinitions/PortalActionDef';
import PortalDef from '../../compositeComponentsDefinitions/PortalDef';

import compositionFactory from '../../compositeComponents/TestCompositionFactory';
import optionDefinitionRegistry from '../../compositeComponentsDefinitions/OptionDefinitionRegistry';

const UNIT_OPTION_ID = 'pl.com.stream.verto.cmm.plugin.unit-client.UnitOption';
const CUSTOMER_OPTION_ID = 'pl.com.stream.verto.cmm.plugin.customer-client.CustomerOption';
const ACTIVITY_OPTION_ID = 'pl.com.stream.verto.crm.plugin.activity-client.ActivityTreeOption';

export function showPortal() {
    var viewId = '#workspace';
    var portalDef = new PortalDef({id: 'portalId'});
    var unitOptionDef = optionDefinitionRegistry.getPlatformOptionById(UNIT_OPTION_ID);
    var customerOptionDef = optionDefinitionRegistry.getPlatformOptionById(CUSTOMER_OPTION_ID);
    var activityTreeOption = optionDefinitionRegistry.getPlatformOptionById(ACTIVITY_OPTION_ID);

    Promise.all([unitOptionDef, customerOptionDef, activityTreeOption]).then(res => {
        portalDef.addActionDef(new PortalActionDef(UNIT_OPTION_ID, res[0]));
        portalDef.addActionDef(new PortalActionDef(CUSTOMER_OPTION_ID, res[1]));
        portalDef.addActionDef(new PortalActionDef(ACTIVITY_OPTION_ID, res[2]));

        var target = $(viewId);
        var portal = compositionFactory.createPortal(portalDef);
        portal.renderTo(target);
    });
}
