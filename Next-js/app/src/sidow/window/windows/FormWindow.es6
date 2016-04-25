/**
 * Created by bartosz on 02.06.15.
 *
 * Option class
 */
import assertions from '../../../lib/Assertions';
import WindowArea from '../windowArea/WindowArea';
import WindowView from './../WindowView';
import BaseWindow from './../BaseWindow';

import headerTemplate from '../windowArea/header_template.hbs';
import bodyTemplate from '../windowArea/body_template.hbs';
import footerTemplate from '../windowArea/footer_template.hbs';

class FormWindow extends BaseWindow {
    /**
     *
     * @param {String} id
     * @param {WindowOptions} [options]
     */
    constructor(id, options) {
        super();
        this.id = id;

        this.setOptionalAttributes(options);

        this.header;
        this.body;
        this.footer;

        this.view = new WindowView(this);

        assertions.required(this.id);
    }

    init() {
        this.isInit = true;

        if (this.header) {
            this.header.initContent();
        }
        if (this.body) {
            this.body.initContent();
        }
        if (this.footer) {
            this.footer.initContent();
        }
    }

    /**
     * @param {String} id
     */
    setDefaultComponent(id) {
        var windowArea = this.getWindowAreaByComponentId(id);

        windowArea.setDefaultComponent(id);
    }

    /**
     * @param {jQuery} $target
     */
    renderToImpl($target) {
        this.target = $target;

        this.view.renderLayout();
        this.view.renderAreas();
    }

    /**
     * @param {jQuery} $target
     */
    disposeImpl($target) {
        if (this.header) {
            this.header.dispose();
        }
        if (this.body) {
            this.body.dispose();
        }
        if (this.footer) {
            this.footer.dispose();
        }

        this.disposeActions();
    }

    /**
     * @param {UIListenerBinder} uIListenerBinder
     */
    addUIListenersImpl(uIListenerBinder) {
        this.view.handleButtonsActions();
    }

    /**
     * Add object to the header
     *
     * @param {WindowArea} windowArea
     */
    addHeader(windowArea) {
        this.header = windowArea;
        this.header.template = headerTemplate;
    }

    /**
     * Add object to the body
     *
     * @param {WindowArea} windowArea
     */
    addBody(windowArea) {
        this.body = windowArea;
        this.body.template = bodyTemplate;
    }

    /**
     * Add object to the footer
     *
     * @param {WindowArea} windowArea
     */
    addFooter(windowArea) {
        this.footer = windowArea;
        this.footer.template = footerTemplate;
    }

    /**
     * Add action definition to the window
     *
     * @param {WindowAction} windowAction
     */
    addAction(windowAction) {
        if (!this.actions.has(windowAction)) {
            this.actions.set(windowAction.id, windowAction);
        } else {
            throw new Error('action already added !');
        }
    }

    /**
     * @param {jQuery} $headerTarget
     */
    setHeaderTarget($headerTarget) {
        this.headerTarget = $headerTarget;
    }

    /**
     * @param {jQuery} $bodyTarget
     */
    setBodyTarget($bodyTarget) {
        this.bodyTarget = $bodyTarget;
    }

    /**
     * @param {jQuery} $footerTarget
     */
    setFooterTarget($footerTarget) {
        this.footerTarget = $footerTarget;
    }

    /**
     * @param {String} id
     */
    showComponent(id) {
        var windowArea = this.getWindowAreaByComponentId(id);

        windowArea.showComponent(id);
    }

    /**
     * @private
     * @param {String} id
     * @returns {*}
     */
    getWindowAreaByComponentId(id) {
        var responsibleWindowArea;
        if (this.header) {
            if (this.header.components.has(id)) {
                responsibleWindowArea = this.header;
            }
        }
        if (this.body) {
            if (this.body.components.has(id)) {
                responsibleWindowArea = this.body;
            }
        }
        if (this.footer) {
            if (this.footer.components.has(id)) {
                responsibleWindowArea = this.footer;
            }
        }
        return responsibleWindowArea;
    }

    /**
     * @private
     * @param {WindowOptions} options
     */
    setOptionalAttributes(options) {
        this.options = {};

        if (options) {
            this.options.title = options.title;
            this.options.subTitle = options.subTitle;
            this.options.name = options.windowTitle;
        } else {
            this.options.title = this.id;
        }
    }

    /**
     * @param {boolean} on
     */
    visibleChangeImpl(on) {
        if (on) {
            if (!this.isInit) {
                this.init();
            }
        }
    }

}

export default FormWindow;
