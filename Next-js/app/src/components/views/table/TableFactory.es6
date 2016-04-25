/**
 * Created by bartosz on 21.05.15.
 *
 * TableFactory class
 */
'use strict';

import TableComponent from './TableComponent';
import KendoTableComponent from './KendoTableComponent';
import Types from '../../../enums/ComponentsDefinitionsTypes';

const TableFactory = {
    /**
     * @param {ViewComponentDef} element
     */
    build(element) {
        if (element.type === Types.VIEWS.KENDO_TABLE) {
            return new KendoTableComponent(element);
        }
        return new TableComponent(element);
    }

};

export default TableFactory;
