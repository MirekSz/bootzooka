/**
 * Created by mireksz on 29.06.15.
 *
 * Portal Acvtion Definition class
 */
import BaseRendering from '../../lib/rendering/BaseRendering';

import optionDefinitionRegistry from '../../compositeComponentsDefinitions/OptionDefinitionRegistry';
import compositionFactory from '../TestCompositionFactory';

class PortalAction extends BaseRendering {

    constructor(portalActionDef) {
        super();
        this.portalActionDef = portalActionDef;
    }

    renderToImpl(target) {
        var template = require('./portal_action.hbs');
        target.html(template(this));
    }

    setIdInPortal(id, portal) {
        this.id = id;
        this.portal = portal;
    }

    addUIListenersImpl(uIListenerBinder) {
        uIListenerBinder.addClick(this.target, ()=> {
            var optionById = optionDefinitionRegistry.getPlatformOptionById(this.portalActionDef.idOption, true);

            optionById.then((optionDef)=> {
                var option = compositionFactory.createOption(optionDef);
                this.portal.showOption(option);
            });
        });
    }
}

export default PortalAction;
