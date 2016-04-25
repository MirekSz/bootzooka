import tabDef from './tab-def.hbs';
import tabContent from './tab-content.hbs';
import BaseWindowManager from './../BaseWindowManager';
import {eventBus, events} from './../../../lib/EventBus';

import AnimatedPanelWrapper from '../../../designer/windowPresentationWrappers/animatedPanelWrapper/AnimatedPanelWrapper';

class TabWindowManager extends BaseWindowManager {

    constructor(jquerySelectorToManage) {
        super(jquerySelectorToManage);

        /**@type {Map<String,BaseWindow>} */
        this.windows = new Map();

        /**@type {Array<BaseWindow>} */
        this.windowsInOrder = [];
    }

    init() {
        this.$tabNavs = $('body').find('#windows-nav-bar').find('.nav-tabs');
        this.$tabContent = this.$sectionToManage.find('.tab-content');

        activateBootstrapTabs(this.$tabNavs);

        /** add script to detect if user is scrolling the page */
        addScrollSpy();
    }

    /**
     * @param {BaseWindow} window
     * @returns {BaseWindow}
     */
    show(window) {
        eventBus.send(events.WINDOW.TAB_SHOWN, {window, manager: this});

        let windowId = window.id;
        if (this.windows.has(windowId)) {
            this.openTab(window, true);
            return this.windows.get(windowId);
        } else {
            this.windows.set(windowId, window);

            this.addTabDef(window);
            this.addTabContent(window);
            this.openTab(window);
            this.addCloseAction(window);
        }
        return window;
    }

    alreadyOpen(id) {
        return this.windows.has(id);
    }

    exists(id) {
        return this.windows.has(id);
    }

    showExisting(id) {
        this.openTab(this.windows.get(id), true);
    }

    openTab(window, existing) {
        focusOnTab(window, this.$tabNavs);

        let current = this.currentWindow();

        if (current && current.id == window.id) {
            return;
        }
        if (current) {
            current.visibleChange(false);
        }
        if (!existing) {
            this.windowsInOrder.push(window);
        }
        window.visibleChange(true);
    }

    addTabContent(window) {
        var tabContentHtml = tabContent(window);
        this.$tabContent.append(tabContentHtml);

        let $tabContent = $(this.$tabContent.find(`#${window.id}`));

        window.visualWrapper = new AnimatedPanelWrapper(window);
        window.visualWrapper.show($tabContent);
    }

    addTabDef(window) {
        this.$tabNavs.append(tabDef(window));
    }

    addCloseAction(window) {
        var self = this;
        var $element = this.$tabNavs.find(`a[href="#${window.id}"]`);
        window.$closeButton = $element.find('button');

        addCloseTabByMiddleMouseBtn($element);

        window.$closeButton.click(event => {
            var windowId = window.id;
            let $activeTab = getActiveTab();

            eventBus.addListener(events.WINDOW.ANIMATION_HIDE_OVER, windowFromEventId => {
                if (windowId === windowFromEventId) {
                    removeTabAndGoToSelectedTab(event.target, $activeTab);
                }
            });

            self.disposeCurrentAndActivateFirst(window.id);
        });
    }

    disposeCurrentAndActivateFirst(id) {
        var window = this.windows.get(id);

        window.visualWrapper.hide();
        this.removeWindow(window);

        if (this.windowsInOrder.length > 0) {
            this.windowsInOrder[0].visibleChange(true);
        }

    }

    removeWindow(window) {
        const number = this.windowsInOrder.indexOf(window);
        this.windowsInOrder.splice(number, 1);

        this.windows.delete(window.id);
    }

    disposeImpl() {
        for (let window of this.windows.values()) {
            window.dispose();
        }
        destroyScrollSpy();
    }

    /**
     * @returns {ComposableWindow}
     */
    currentWindow() {
        let composableWindow;
        this.windowsInOrder.forEach((element)=> {
            if (element.visible) {
                composableWindow = element;
            }
        });
        return composableWindow;
    }

    visibleChangeImpl(value) {
        for (let i = 0; i < this.windows.length; i++) {
            let window = this.windows[i];
            window.visibleChange(value);
        }
    }
}

export default TabWindowManager;

function activateBootstrapTabs($tabNavs) {
    $tabNavs.on("click", "a", event => {
        event.preventDefault();
        $(event.target).tab('show');
    });
}

function removeTabAndGoToSelectedTab(element, $activeTab) {
    let selfClick = true;
    var anchor = $(element).parent('a');
    $(anchor.attr('href')).remove();

    //remove tab
    $(element).parent().remove();

    if ($activeTab.find('a').length > 0) {
        selfClick = false;
    }

    if ($activeTab && !selfClick) {
        $activeTab.children('a').click();
    } else {
        //go to first
        $(".nav-tabs li").children('a').first().click();
    }
}

function getActiveTab() {
    var $windowNavBar = $('#windows-nav-bar');
    var $activeElement;

    $windowNavBar.find(".nav-tabs li").each((index, element) => {
        let $element = $(element);

        if ($element.hasClass('active')) {
            $activeElement = $element;
        }
    });
    return $activeElement;
}

function focusOnTab(window, $tabNavs) {
    var currentTabLink = $tabNavs.find(`a[href="#${window.id}"]`);
    $(currentTabLink).tab('show');
}

function addScrollSpy() {
    var $windowNavBar = $('#windows-nav-bar');
    var showHideScrollPosition = 29;
    var hideClass = 'hidden-navbar';

    window.onscroll = () => {
        if (window.scrollY > showHideScrollPosition) {
            if (!$windowNavBar.hasClass(hideClass)) {
                $windowNavBar.addClass(hideClass);
            }
        } else if (window.scrollY < showHideScrollPosition) {
            $windowNavBar.removeClass(hideClass);
        }
    };
}

function destroyScrollSpy() {
    window.onscroll = () => {
    };
}

function addCloseTabByMiddleMouseBtn($element) {
    const middleMouseCode = 2;

    $element.click(event => {
        if (event.which == middleMouseCode) {
            event.preventDefault();

            $element.find('button').click();
        }
    });
}

