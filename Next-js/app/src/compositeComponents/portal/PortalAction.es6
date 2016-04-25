/**
 * Created by mireksz on 29.06.15.
 *
 * Portal Action Definition class
 */
import BaseRendering from '../../lib/rendering/BaseRendering';
import optionDefinitionRegistry from '../../compositeComponentsDefinitions/OptionDefinitionRegistry';
import compositionFactory from '../TestCompositionFactory';

import PortalView from './PortalView';

class PortalAction extends BaseRendering {

    constructor(portalActionDef) {
        super();
        this.portalActionDef = portalActionDef;
        this.group = portalActionDef.group;
        this.name = portalActionDef.name;
    }

    renderToImpl(target) {
        var template = require('./portal_action.hbs');
        var snippet = template(this);

        this.target.append(snippet);
    }

    setIdInPortal(id, portal) {
        this.id = id;
        this.portal = portal;
    }

    addUIListenersImpl(uIListenerBinder) {
        uIListenerBinder.addClick(this.target, e => {
            var optionById = optionDefinitionRegistry.getPlatformOptionById(this.portalActionDef.idOption, true);

            optionById.then((optionDef)=> {
                var option = compositionFactory.createOption(optionDef);

                this.portal.showOption(option);
            });
        });
    }

}

export default PortalAction;
