/**
 * Created by bartosz on 21.05.15.
 *
 * TableFactory class
 */
'use strict';

import PanelElementComponent from './PanelElementComponent';
import TestTableComponent from '../../../../components/views/table/test/TestTableComponent';

const PanelElementFactory = {
    /**
     * @param {PanelElementComponentDef} element
     */
    build(element) {
        return new PanelElementComponent(element);
    },

    /**
     * @param {ViewComponentDef} viewDef
     */
    buildContent(viewDef) {
        var component = new TestTableComponent(viewDef);

        component.initialize();

        component.id = viewDef.id;

        return component;
    }

};

export default PanelElementFactory;
