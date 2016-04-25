/**
 * Created by bartosz on 20.05.15.
 *
 * View Container Definition class
 */
import types from '../enums/ComponentsDefinitionsTypes';
import ConnectionDef from '../communication/ConnectionDef';
import assertions from '../../src/lib/Assertions';

class OptionDef {

    constructor(element) {
        this.id = element.id;
        this.name = element.name || 'some name';
        this.type = element.type || types.FACTORY_TYPES.OPTION;
        this.group = element.group;

        this.contentSpacing = element.contentSpacing;
        this.contentEditorSpacing = element.contentEditorSpacing;

        this.inputSocketDefList = [];
        this.outputSocketDefList = [];

        this.actionsDefMap = new Map();
        this.viewsDefMap = new Map();
        this.componentsDefMap = new Map();
        this.connectionsDefList = [];

        if (element.actions) {
            this.numberOfActions = element.actions.length;
        }

        if (element.views) {
            this.numberOfViews = element.views.length;
        }

        assertions.required(this.id, this.type);
    }

    /**
     * @param {ViewComponentDef} viewDef
     * @param {String} id
     *
     */
    addViewDef(viewDef, id = viewDef.id) {
        this.addComponent(id, viewDef);
        this.viewsDefMap.set(id, viewDef);
    }

    /**
     *@param {ActionComponentDef} actionDef
     * @param {String} id
     *
     */
    addActionDef(actionDef, id = actionDef.id) {
        this.addComponent(id, actionDef);
        this.actionsDefMap.set(id, actionDef);
    }

    /**
     *@private
     **/
    addComponent(id, component) {
        if (this.componentsDefMap.has(id)) {
            throw new Error('Selected id already exists: ' + id);
        }
        this.componentsDefMap.set(id, component);
    }

    /**
     *
     * @param senderId
     * @param senderSocketId
     * @param receiverId
     * @param receiverSocketI
     */
    addConnectionDef(senderId, senderSocketId, receiverId, receiverSocketI) {
        var connection = new ConnectionDef(senderId, senderSocketId, receiverId, receiverSocketI);
        this.connectionsDefList.push(connection);
    }

    /**
     *
     * @param connectionDef
     */
    addConnectionDefObject(connectionDef) {
        this.connectionsDefList.push(connectionDef);
    }

    addInputSocketDef(socketDef) {
        this.inputSocketDefList.push(socketDef);
    }

    addOutputSocketDef(socketDef) {
        this.outputSocketDefList.push(socketDef);
    }

    getInputSocketDefList() {
        return this.inputSocketDefList;
    }

    getInputSocketDefListByType(socketType) {
        var inputSocketDefList = this.inputSocketDefList;

        for (var i = 0; i < inputSocketDefList.length; i++) {
            if (inputSocketDefList[i].type === socketType) {
                return inputSocketDefList[i];
            }
        }
    }

    getInputSocketDefByName(name) {
        var inputSocketDefList = this.inputSocketDefList;

        for (var i = 0; i < inputSocketDefList.length; i++) {
            if (inputSocketDefList[i].name === name) {
                return inputSocketDefList[i];
            }
        }
    }

    getOutputSocketDefList() {
        return this.outputSocketDefList;
    }

    getOutputSocketDefListByType(socketType) {
        var outputSocketDefList = this.outputSocketDefList;

        for (var i = 0; i < outputSocketDefList.length; i++) {
            if (outputSocketDefList[i].type === socketType) {
                return outputSocketDefList[i];
            }
        }
    }

    getOutputSocketDefByName(name) {
        var outputSocketDefList = this.outputSocketDefList;

        for (var i = 0; i < outputSocketDefList.length; i++) {
            if (outputSocketDefList[i].name === name) {
                return outputSocketDefList[i];
            }
        }
    }

    getConnectionsDefList() {
        return this.connectionsDefList;
    }

    /**
     *
     * @param {string} id
     * @returns {ActionComponentDef}
     */
    getActionDef(id) {
        return this.actionsDefMap.get(id);
    }

    /**
     *
     * @param {string} id
     * @returns {ViewComponentDef}
     */
    getViewDef(id) {
        return this.viewsDefMap.get(id);
    }

    /**
     *
     * @returns {Array.<ActionComponentDef>}
     */
    getActionDefList() {
        return this.toArray(this.actionsDefMap.values());
    }

    /**
     *
     * @returns {Array.<ViewComponentDef>}
     */
    getViewDefList() {
        return this.toArray(this.viewsDefMap.values());
    }

    getViewDefMap() {
        return this.viewsDefMap;
    }
 
    getActionDefMap() {
        return this.actionsDefMap;
    }

    getComponentsDefMap() {
        return this.componentsDefMap;
    }

    toArray(iterable) {
        var result = [];
        for (let val of iterable) {
            result.push(val);
        }
        return result;
    }
}

export default OptionDef;
