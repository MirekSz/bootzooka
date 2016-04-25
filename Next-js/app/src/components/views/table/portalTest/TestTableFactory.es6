/**
 * Created by bartosz on 21.05.15.
 *
 * TableFactory class
 */
'use strict';

import TestTableComponent from './TestTableComponent';

const TableFactory = {
    /**
     * @param {ViewComponentDef} element
     */
    build(element) {
        return new TestTableComponent(element);
    }

};

export default TableFactory;
