/**
 * Created by mireksz on 21.05.15.
 *
 * ServiceMethodInvokerActionFactory
 */
'use strict';

import ServiceMethodInvokerAction from './ServiceMethodInvokerAction';

const ServiceMethodInvokerActionFactory = {
    /**
     * @param {ViewComponentDef} element
     */
    build(element) {
        return new ServiceMethodInvokerAction(element);
    }

};

export default ServiceMethodInvokerActionFactory;
