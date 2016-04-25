/**
 * Created by mireksz on 21.05.15.
 *
 * ServiceMethodInvokerActionFactory
 */
'use strict';

import ServiceCommandAction from './ServiceCommandAction';

const ServiceCommandActionFactory = {
    /**
     * @param {ViewComponentDef} element
     */
    build(element) {
        return new ServiceCommandAction(element);
    }

};

export default ServiceCommandActionFactory;
