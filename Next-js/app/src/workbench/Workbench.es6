/**
 * Created by bstanislawski on 2015-11-27.
 */
import componentDefinitionRegistry from '../componentsDefinitions/ComponentDefinitionRegistry';
import componentsFactory from '../components/ComponentsFactory';
import {eventBus, events} from '../lib/EventBus';

class Workbench {
    constructor() {
        /**@type {TabWindowManager} */
        this.currentWindowManager = undefined;
        /**@type {WindowManager} */
        this.currentTabManager = undefined;
    }

    executeAction(actionId, socketValues) {
        componentDefinitionRegistry.getActionById(actionId).then(actionDef => {
            var action = componentsFactory.createComponent(actionDef);

            socketValues.forEach(socketValue => {
                this.setValueOnActionSocket(action, socketValue);
            });

            if (!action.disabled) {
                action.execute();
            }
        });
    }

    setValueOnActionSocket(action, socketValue) {
        var socket = action.getInputSocketByName(socketValue.socketId);

        if (socket) {
            socket.send(socketValue.value);
        }
    }

    /**
     *
     * @param window
     */
    openWindow(window) {
        if (this.currentWindowManager) {
            this.currentWindowManager.show(window);
        }
    }

    /**
     *
     * @param window
     */
    openTab(window) {
        if (this.currentTabManager) {
            this.currentTabManager.show(window);
        }
    }

}

const workbench = new Workbench();
eventBus.addListener(events.WINDOW.TAB_SHOWN, (event)=> {
    workbench.currentTabManager = event.manager;
});
eventBus.addListener(events.WINDOW.WINDOW_SHOWN, (event)=> {
    workbench.currentWindowManager = event.manager;
});
export default workbench;
