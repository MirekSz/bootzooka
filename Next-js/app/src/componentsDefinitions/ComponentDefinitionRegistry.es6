/**
 * Created by Mirek on 2015-06-11.
 */
import serverConnector from '../lib/ServerConnector';
import ActionComponentDef from './ActionComponentDef';
import ViewComponentDef from './ViewComponentDef';
import SocketDef from '../communication/SocketDef';

const ACTIONS_URL = '/platform/actions';
const ACTION_BY_ID_URL = '/platform/actions/byId';
const VIEWS_URL = '/platform/views';
const VIEW_BY_ID_URL = '/platform/views/byId';

class ComponentDefinitionRegistry {
    constructor() {

    }

    /**
     *
     * @promise {Array.<ActionComponentDef>}
     */
    getActions(query) {
        return serverConnector.getListOfObject(ACTIONS_URL, {query: query}, this.actionComponentDefConverter);
    }

    /**
     *
     * @promise {ActionComponentDef}
     */
    getActionById(id) {
        return serverConnector.getObject(ACTION_BY_ID_URL, {id: id}, this.actionComponentDefConverter);
    }

    /**
     *
     * @promise {Array.<ViewComponentDef>}
     */
    getViews(query) {
        return serverConnector.getListOfObject(VIEWS_URL, {query: query}, this.viewComponentDefConverter);
    }

    /**
     *
     * @promise {ViewComponentDef}
     */
    getViewById(id) {
        return serverConnector.getObject(VIEW_BY_ID_URL, {id: id}, this.viewComponentDefConverter);
    }

    /**
     * @param element
     */
    actionComponentDefConverter(element) {
        const actionComponentDef = new ActionComponentDef(element.id, element.type, element.iconKey, element.name, element.actionExtension);

        for (let i = 0; i < element.inputSocketList.length; i++) {
            let obj = element.inputSocketList[i];
            let socketDef = new SocketDef(obj.name, obj.sendingClass, obj.required);
            actionComponentDef.addInputSocketDef(socketDef);
        }

        for (let i = 0; i < element.outputSocketList.length; i++) {
            let obj = element.outputSocketList[i];
            let socketDef = new SocketDef(obj.name, obj.sendingClass);
            actionComponentDef.addOutputSocketDef(socketDef);
        }

        for (let i = 0; i < element.repeaterSocketList.length; i++) {
            let obj = element.repeaterSocketList[i];
            let socketDef = new SocketDef(obj.name, obj.sendingClass, obj.required);
            actionComponentDef.addRepeaterSocketDef(socketDef);
        }
        return actionComponentDef;
    }

    /**
     * @param element
     */
    viewComponentDefConverter(element) {
        const viewComponentDef = new ViewComponentDef(element.id, element.type, element.iconKey, element.name, element.viewExtension);
        for (let i = 0; i < element.inputSocketList.length; i++) {
            let obj = element.inputSocketList[i];
            let socketDef = new SocketDef(obj.name, obj.sendingClass, obj.required);
            viewComponentDef.addInputSocketDef(socketDef);
        }

        for (let i = 0; i < element.outputSocketList.length; i++) {
            let obj = element.outputSocketList[i];
            let socketDef = new SocketDef(obj.name, obj.sendingClass);
            viewComponentDef.addOutputSocketDef(socketDef);
        }


        for (let i = 0; i < element.repeaterSocketList.length; i++) {
            let obj = element.repeaterSocketList[i];
            let socketDef = new SocketDef(obj.name, obj.sendingClass, obj.required);
            viewComponentDef.addRepeaterSocketDef(socketDef);
        }
        viewComponentDef.dataSourceId = element.dataSourceId;
        return viewComponentDef;
    }

}

export default new ComponentDefinitionRegistry();