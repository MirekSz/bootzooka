/**
 * Created by mireksz on 21.05.15.
 *
 * ServiceMethodInvokerFactory
 */
'use strict';
import ServiceMethodInvoker from './ServiceMethodInvoker';

const ServiceMethodInvokerFactory = {

    /**
     * @param {ViewComponentDef} element
     */
    build(element) {
        return new ServiceMethodInvoker(element);
    }

};

export default ServiceMethodInvokerFactory;
