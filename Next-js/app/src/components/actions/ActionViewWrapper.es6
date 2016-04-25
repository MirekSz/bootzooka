/**
 * Created by bstanislawski on 2015-12-09.
 */
import BaseRendering from '../../lib/rendering/BaseRendering';
import actionTemplate from '../../compositeComponents/option/action.hbs';

class ActionViewWrapper extends BaseRendering {

    constructor(action) {
        super(action);

        this.id = action.id;
        this.action = action;
        this.template = actionTemplate;
    }

    addUIListenersImpl(uIListenerBinder) {
        uIListenerBinder.addClick(this.target.find('a.click'), e => {
            this.action.execute();
        });
    }

    renderToImpl(target) {
        $(target).html(this.template(this.action));
    }
}

export default ActionViewWrapper;
