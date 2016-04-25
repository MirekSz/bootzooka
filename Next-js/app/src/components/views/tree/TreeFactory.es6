'use strict';

import TreeComponent from './TreeComponent';

const TreeFactory = {
    /**
     * @param {ViewComponentDef} element
     */
    build(element) {
        return new TreeComponent(element);
    }

};

export default TreeFactory;
