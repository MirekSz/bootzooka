/**
 * Created by bartosz on 14.10.15.
 *
 * ActionElement class
 */
import BasicMethodsSet from '../../inteliUi/BasicMethodsSet';

class ActionElement extends BasicMethodsSet {

    constructor(args) {
        super();

        this.targetContainer = args.targetContainer;
        this.template = args.template;

        this.model = args.model;
        this.actionHandlers = args.actionHandlers;
    }

}

export default ActionElement;
