/**
 * Created by bartosz on 02.06.15.
 *
 * CompositionFactory class
 */
import portalFactory from './portal/PortalFactory';
import optionFactory from './option/OptionFactory';

class CompositionFactory {

    /**
     * Create the option object
     *
     * @param {OptionDef} optionDef
     */
    createOption(optionDef) {
        return optionFactory.createOption(optionDef);
    }

    /**
     * Create the portal object
     *
     * @param {PortalDef} portalDef
     */
    createPortal(portalDef) {
        return portalFactory.createPortal(portalDef);
    }

}

export default new CompositionFactory();
