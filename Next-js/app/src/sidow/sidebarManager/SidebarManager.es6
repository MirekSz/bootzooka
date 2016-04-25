/**
 * Created by bstanislawski on 2016-04-06.
 */
import TabWindowManager from './../windowManager/tabWindowManager/TabWindowManager';
import routingProvider from './../../workbench/RoutingProvider';
import SidebarElement from './SidebarElement';

const START_TIME = 100;
const TIME_DELTA = 50;

class SidebarManager {

    constructor() {
        this.workspace = '#page-content-wrapper';

        this.windowManager = new TabWindowManager(this.workspace);

        this.elements = new Map();
        this.elementsToRestore = new Map();

        this.activeElement = undefined;

        this.isInit = false;

        this.$sideBarMenu = $('#sidebar-wrapper').find('ul.sidebar-elements');
    }

    initialize() {
        if (!this.isInit) {
            this.windowManager.init();
            this.isInit = true;
        }
    }

    /**
     * @param {SidebarElement} sidebarElement
     */
    addSidebarElement(sidebarElement) {
        this.elements.set(sidebarElement.id, sidebarElement);

        sidebarElement.renderSidebarElementTo(this.$sideBarMenu);

        this.addClickListener(sidebarElement);
    }

    /**
     * @param {SidebarElement[]} sidebarElementsArray
     */
    addSidebarElements(sidebarElementsArray) {
        var time = START_TIME;

        sidebarElementsArray.forEach(element => {
            setTimeout(() => {
                this.addSidebarElement(element);
            }, time);

            time += TIME_DELTA;
        });
    }

    /**
     * @param {SidebarElement} sidebarElement
     */
    addClickListener(sidebarElement) {
        this.$sideBarMenu.find(`#${sidebarElement.id}`).click(() => {
            this.activeElement = sidebarElement;

            if (sidebarElement.handler instanceof Function) {
                sidebarElement.handler(sidebarElement, this);
            } else {
                let windowId = sidebarElement.window.id;

                if (this.windowManager.exists(windowId)) {
                    this.windowManager.showExisting(windowId);
                } else {
                    this.initialize();

                    this.windowManager.show(sidebarElement.window);

                    if (sidebarElement.composableWindowsMap) {
                        sidebarElement.composableWindowsMap.forEach(window => {
                            sidebarElement.window.show(window);
                        });
                    }
                }
            }
            routingProvider.pageVisited(sidebarElement.id);
        });
    }

    /**
     * @param {String} id
     */
    removeSidebarElement(id) {
        if (this.elements.has(id)) {
            let element = this.elements.get(id);

            element.dispose();
            this.elements.delete(id);
        } else {
            throw new Error('There is no such a element in the sidebar !');
        }
    }

    /**
     * @param {Boolean} enableRestoreFunction
     */
    clearSidebar(enableRestoreFunction) {
        var elementsMap = this.elements;

        if (enableRestoreFunction) {
            this.elementsToRestore = copyMap(this.elements);
        }

        elementsMap.forEach(element => {
            this.removeSidebarElement(element.id);
        });
    }

    restoreElements() {
        this.clearSidebar(false);

        let time = START_TIME;
        this.elementsToRestore.forEach(element => {
            setTimeout(() => {
                this.addSidebarElement(element);
            }, time);

            time += TIME_DELTA;
        });
    }

}

export default SidebarManager;

function copyMap(myMap) {
    var newMap = new Map();
    for (let [key, value] of myMap.entries()) {
        newMap.set(key, value);
    }
    return newMap;
}

function clone(obj) {
    return Object.assign({}, obj);
}
