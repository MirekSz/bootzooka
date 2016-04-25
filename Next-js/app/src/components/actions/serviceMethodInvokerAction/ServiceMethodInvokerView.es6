/**
 * Created by bstanislawski on 2015-11-17.
 */
import actionTemplate from './action.hbs';

import {eventBus,events} from '../../../lib/EventBus';
import alertifyApi from '../../../lib/AlertifyApi';

class ServiceMethodInvokerView {

    constructor() {
        this.template = actionTemplate;
    }

    renderTo(model) {
        var template = this.template(model);

        model.target.html(template);
    }

}

export default ServiceMethodInvokerView;
