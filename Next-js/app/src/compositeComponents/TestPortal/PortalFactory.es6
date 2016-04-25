/**
 * Created by bartosz on 20.05.15.
 *
 * Portal Factory class
 */
'use strict';

import Portal from './Portal';
import PortalAction from './PortalAction';

class PortalFactory {

    /**
     * Create the portal factory
     *
     * @param {PortalDef} portalDef
     */
    createPortal(portalDef) {
        var portal = new Portal(portalDef);

        var actionDefMap = portalDef.getActionDefMap();

        for (var [id, portalActionDef] of actionDefMap) {
            var portalAction = new PortalAction(portalActionDef);
            portalAction.setIdInPortal(id, portal);
            portal.addAction(id, portalAction);
        }

        return portal;
    }
}

export default new PortalFactory();