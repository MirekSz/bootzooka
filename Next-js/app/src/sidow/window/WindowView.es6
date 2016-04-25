/**
 * Created by bstanislawski on 2016-03-07.
 */
import BaseView from '../../compositeComponents/BaseView';

import contentTemplate from './window.hbs';

class WindowView extends BaseView {

    /**
     * @param {Window} window
     */
    constructor(window) {
        super();
        this.window = window;
    }

    init() {

    }

    renderLayout() {
        var viewContent = this.createContent();

        this.window.target.html(viewContent);
    }

    renderAreas() {
        var window = this.window;
        var $target = window.target;
        var header = window.header;
        var body = window.body;
        var footer = window.footer;

        this.defineAreaTargets($target);

        if (header) {
            header.renderTo(window.headerTarget);
        }
        if (body) {
            body.renderTo(window.bodyTarget);
        }
        if (footer) {
            footer.renderTo(window.footerTarget);
        }
    }

    handleButtonsActions(uIListenerBinder) {
    }

    /**
     * @private
     */
    createContent() {
        return contentTemplate(this.window);
    }

    /**
     * @private
     * @param $target
     */
    defineAreaTargets($target) {
        if (!this.window.headerTarget || this.window.disposed) {
            this.window.headerTarget = $target.find('.header-area-container');
        }
        if (!this.window.bodyTarget || this.window.disposed) {
            this.window.bodyTarget = $target.find('.body-area-container');
        }
        if (!this.window.footerTarget) {
            this.window.footerTarget = $target.find('.footer-area-container');
        }
    }
}

export default WindowView;
