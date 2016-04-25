/**
 * Created by bartosz on 21.05.15.
 *
 * SelectRowActionComponent class
 */

import BaseComponent from '../../BaseComponent';

class ServiceMethodInvokerAction extends BaseComponent {

    constructor(element) {
        super(element);
    }

    renderToImpl(target) {
        target.html(`Action ${this.id}`);
    }

}

export default ServiceMethodInvokerAction;
