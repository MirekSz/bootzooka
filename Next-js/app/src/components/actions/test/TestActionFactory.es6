/**
 * Created by mireksz on 21.05.15.
 *
 * TableFactory class
 */
'use strict';

import TestAction from './TestAction';

const TestActionFactory = {
    /**
     * @param {ViewComponentDef} element
     */
        build(element) {
        return new TestAction(element);
    }

};

export default TestActionFactory;
