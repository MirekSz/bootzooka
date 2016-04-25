/**
 * Created by bartosz on 02.06.15.
 *
 * Option Factory
 */

'use strict';
import Option from './Option';
import ViewComponentDef from '../../componentsDefinitions/ViewComponentDef';

import componentsFactory from '../../components/ComponentsFactory';

const OptionFactory = {

    createOption(optionDef) {
        var componentsDefMap = optionDef.getComponentsDefMap();
        var optionConnections = optionDef.getConnectionsDefList();
        var componentFactoryResult = componentsFactory.createComponents(componentsDefMap, optionConnections);
        var option = new Option(optionDef);

        option.setConnections(componentFactoryResult.getConnectionsMap());

        for (var [id, element] of componentFactoryResult.getComponents()) {
            if (element.def instanceof ViewComponentDef) {
                option.addView(id, element);
            } else {
                option.addAction(id, element);
            }
        }

        return option;
    }

};

export default OptionFactory;
