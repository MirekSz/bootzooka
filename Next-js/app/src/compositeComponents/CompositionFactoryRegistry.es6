/**
 * Created by bartosz on 02.06.15.
 *
 * CompositeRegistry class
 */
import optionFactory from '../compositeComponents/option/OptionFactory';
import portalFactory from './TestPortal/PortalFactory';
import types from '../enums/ComponentsDefinitionsTypes';

const CompositionFactoryRegistry = {

    getFactoryFor(compositionElement) {
        var compositionElementClass = compositionElement.constructor.name;

        if (compositionElementClass === types.elements.OPTION) {
            return optionFactory;
        } else if (compositionElementClass === types.elements.PERSPECTIVE) {
            return portalFactory;
        }
    }

};

export default CompositionFactoryRegistry;
