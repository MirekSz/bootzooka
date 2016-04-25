import BaseWindowManager from './BaseWindowManager';
import panelsRegion from './panels-region.hbs';
import panelDef from './panel-def.hbs';
import HistoryController from './HistoryViewController';
import FormWindow from '../window/windows/FormWindow';
import {eventBus, events} from './../../lib/EventBus';

export default class WindowManager extends BaseWindowManager {

    constructor(jquerySelectorToManage) {
        super(jquerySelectorToManage);

        /**@type {Array<BaseWindow>} */
        this.windows = [];

        this.historyController = new HistoryController(this);
    }

    init() {
        this.$sectionToManage.html(panelsRegion());

        this.$panel = this.$sectionToManage.find('.panel-region');
        this.$panelsHistory = this.$sectionToManage.find('.panels_history');
        this.$history = this.$sectionToManage.closest('.tab-content').find('.breadcrumb');
    }

    /**
     * @param {BaseWindow} window
     * @returns {BaseWindow}
     */
    show(window) {
        this.isComposableWindow = this.$sectionToManage.attr('id') === 'embedded_DocumentWindow';

        eventBus.send(events.WINDOW.WINDOW_SHOWN, {window, manager: this});

        let currentWindow = this.currentWindow();
        if (currentWindow) {
            this.hideCurrentWindow();
        }
        this.windows.push(window);

        if (this.windows.length > 1) {
            window.isCloseBtnAvailable = true;
        }

        this.renderWindowWrapper(window);
        this.renderContent(window);
        this.addCloseAction(window);

        this.historyController.buildHistory(window);

        return window;
    }

    renderWindowWrapper(window) {
        const windowWrapperId = `window_wrapper_${window.id}`;
        let wrapper = `<div id="${windowWrapperId}" class="animated-fast"></div>`;

        this.$panel.html(wrapper);

        this.$target = this.$panel.find(`#${windowWrapperId}`);
    }

    /**
     *
     * @param {BaseWindow} window
     */
    renderContent(window) {
        if (this.isComposableWindow) {
            this.initAndShow(window);
        } else {
            this.$target.html(panelDef(window));
            let $content = this.$target.find('.panel-body');

            this.initAndShow(window, $content);
        }
    }

    initAndShow(window, $content) {
        var windowInit = window.init();

        if (windowInit instanceof Promise) {
            windowInit.then(()=> {
                this.showContent(window, $content);
            });
        } else {
            this.showContent(window, $content);
        }
    }

    showContent(window, $content) {
        this.setActionsContainer(window);

        if ($content) {
            window.showOn($content);
        } else {
            window.showOn(this.$target);
        }

        window.visibleChange(true);
    }

    setActionsContainer(window) {
        if (window instanceof FormWindow) {
            let parentPanelId = this.jquerySelectorToManage.replace('embedded_', '');
            let $panelFooter = this.$target.closest(parentPanelId).find('.panel-footer');

            window.setFooterTarget($panelFooter);
        }
    }

    hideCurrentWindow() {
        var currentWindow = this.currentWindow();
        currentWindow.visibleChange(false);

        this.historyController.hidePanel();
    }

    showWindow(id) {
        var currentWindow = this.currentWindow();
        var isCloseBtnAvailable = false;

        currentWindow.visibleChange(true);

        if (this.windows.length > 1) {
            isCloseBtnAvailable = true;
        }

        this.historyController.showPanelFromHistory(id, isCloseBtnAvailable);
    }

    /**
     *
     * @returns {BaseWindow|Boolean}
     */
    currentWindow() {
        if (this.windows.length == 0) {
            return false;
        }
        return this.windows[this.windows.length - 1];
    }

    removeCurrentWindow() {
        var window = this.windows[this.windows.length - 1];
        this.historyController.removeFromHistory(window);

        this.windows.splice(-1, 1);
    }

    disposeCurrentAndShowPrev() {
        var window = this.currentWindow();

        if (window) {
            window.dispose();

            this.removeCurrentWindow();

            let prevWindow = this.currentWindow();
            if (prevWindow) {
                this.showWindow(prevWindow.id);
            }
        }
    }

    /**
     * @protected
     * @param {BaseWindow} window
     */
    addCloseAction(window) {
        var self = this;
        var $tabContent = $(`${this.jquerySelectorToManage}`).closest('.tab-content');
        var $closeButton = $tabContent.find('.closebox');
        window.$closeButton = $closeButton;

        if (window.isCloseBtnAvailable) {
            let $closeButtonContainer = $tabContent.find('.panel-tools');
            $closeButtonContainer.removeClass('hidden');
        }

        $closeButton.off().click(() => {
            self.disposeCurrentAndShowPrev();
        });
    }

    disposeImpl() {
        for (let i = 0; i < this.windows.length; i++) {
            let window = this.windows[i];
            window.dispose();
        }
    }

    visibleChangeImpl(value) {
        for (let i = 0; i < this.windows.length; i++) {
            let window = this.windows[i];
            window.visibleChange(value);
        }
    }
}
