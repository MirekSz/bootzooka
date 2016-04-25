/**
 * Created by bstanislawski on 2016-04-18.
 */
import BaseWindow from '../BaseWindow';
import assertions from '../../../lib/Assertions';

class FreestyleWindow extends BaseWindow {

    /**
     * @param {String} id
     * @param {*} content
     */
    constructor(id, content) {
        super(id);

        this.content = content;

        assertions.required(id);
    }

    init() {
        this.content.init();
    }

    visibleChangeImpl(on) {
    }

    renderToImpl(target) {
        this.content.renderTo(target);
    }

    disposeImpl() {
        if (this.content) {
            this.content.dispose();
        }
    }


}

export default FreestyleWindow;
