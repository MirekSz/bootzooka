/**
 * Created by Mirek on 2015-06-11.
 */
import serverConnector from '../lib/ServerConnector';
import OptionDef from './OptionDef';

import componentDefinitionRegistry from '../componentsDefinitions/ComponentDefinitionRegistry';

const OPTION_URL = '/options';
const OPTION_BY_ID_URL = '/options/byId';
const OPTION_CRUD_URL = '/options/';

class OptionDefinitionRegistry {

    constructor() {
        this.optionsCache = new Map();
    }

    /**
     *
     * @promise {Array.<ActionComponentDef>}
     */
    getOptions(query) {
        return serverConnector.getListOfObject(OPTION_URL, {query: query}, this.optionDefConverter);
    }

    /**
     * @param {OptionDef} optionDef
     */
    add(optionDef) {
        this.optionsCache.set(optionDef.id, optionDef);
        return serverConnector.post(OPTION_CRUD_URL, optionDef, this.optionPreSendConverter);
    }

    /**
     * @param id
     * @returns {Promise.<OptionDef>}
     */
    find(id) {
        return new Promise((resolve, reject) => {
            var optionDef = this.optionsCache.get(id);
            if (optionDef) {
                resolve(optionDef);
            } else {
                var platformOptionById = this.getPlatformOptionById(id);
                platformOptionById.then((data) => {
                    resolve(data);
                }, (error) => {
                    console.log('Error: ');
                    console.log(Error);
                    reject(error);
                });
            }
        });
    }

    /**
     * @returns {Promise}
     */
    remove(id) {
        this.optionsCache.delete(id);
        return serverConnector.remove(OPTION_BY_ID_URL, {id});
    }

    /**
     * @param {OptionDef} optionDef
     */
    update(optionDef) {
        this.optionsCache.set(optionDef.id, optionDef);
        return serverConnector.put(OPTION_CRUD_URL, optionDef, this.optionPreSendConverter);
    }

    /**
     *
     * @param element
     *
     * @return {OptionDef} optionDef
     */
    setObjectClass(element) {
        return new OptionDef(element);
    }

    /**
     *
     * @promise {OptionDef}
     */
    getPlatformOptionById(id, isResponseConverted) {
        if (isResponseConverted) {
            return new Promise((resolve) => {
                var optionDef = serverConnector.getObject(OPTION_BY_ID_URL, {id: id}, this.optionDefConverter);

                optionDef.then(object => {
                    var optionDef = object.optionDef;
                    var actionDefList = object.actionDef;
                    var viewDefList = object.viewDef;
                    var connections = object.connections;
                    var actions = object.actions;
                    var views = object.views;

                    for (let i = 0; i < connections.length; i++) {
                        let connectionJSON = connections[i];
                        let senderId = connectionJSON.senderId;
                        let receiverId = connectionJSON.receiverId;

                        if (senderId.endsWith("Frame") || receiverId.endsWith("Frame")) {
                            continue;
                        }

                        optionDef.addConnectionDef(senderId, connectionJSON.senderSocketId, receiverId, connectionJSON.receiverSocketId);
                    }

                    let requests = actionDefList.concat(viewDefList);

                    Promise.all(requests).then(res => {
                        for (let i = 0; i < actionDefList.length; i++) {
                            let actionDef = res[i];

                            optionDef.addActionDef(actionDef, actions[i].inOptionId);
                        }

                        let j = 0;
                        for (let i = actionDefList.length; i < requests.length; i++) {
                            let viewDef = res[i];

                            optionDef.addViewDef(viewDef, views[j].inOptionId);
                            j++;
                        }

                        resolve(optionDef);
                    });
                });
            });
        } else {
            return serverConnector.getObject(OPTION_BY_ID_URL, {id: id}, this.setObjectClass);
        }

    }

    /**
     * @param element
     *
     * @return {object} object with actions and views requests
     */
    optionDefConverter(element) {
        var optionDef = new OptionDef(element);
        var actionDefList = [];
        var viewDefList = [];

        for (let i = 0; i < element.actions.length; i++) {
            let actionJSON = element.actions[i];
            var actionDef = componentDefinitionRegistry.getActionById(actionJSON.id);

            actionDefList.push(actionDef);
        }

        for (let i = 0; i < element.views.length; i++) {
            let viewJSON = element.views[i];
            var viewDef = componentDefinitionRegistry.getViewById(viewJSON.id);

            viewDefList.push(viewDef);
        }

        return {
            optionDef: optionDef,
            actionDef: actionDefList,
            viewDef: viewDefList,
            connections: element.connections,
            actions: element.actions,
            views: element.views
        };
    }

    optionPreSendConverter(element) {
        var actions = [];
        var views = [];
        var connections = [];

        for (var actionDef of element.actionsDefMap.values()) {
            actions.push({id: actionDef.id, inOptionId: actionDef.name});
        }

        for (var viewDef of element.viewsDefMap.values()) {
            views.push({id: viewDef.id, inOptionId: viewDef.name});
        }

        for (let i = 0; i < element.connectionsDefList.length; i++) {
            var connectionDef = element.connectionsDefList[i];
            var el = {};
            el.senderId = connectionDef.senderId;
            el.senderSocketId = connectionDef.senderSocketId;
            el.receiverId = connectionDef.receiverId;
            el.receiverSocketId = connectionDef.receiverSocketId;
            connections.push(el);
        }

        return {
            inputSocketDef: element.inputSocketDefList,
            outputSocketDef: element.outputSocketDefList,
            repeaterSocketDef: element.repeaterSocketDefList,
            actions: actions,
            views: views,
            connections: connections,
            id: element.id,
            name: element.id,
            contentSpacing: element.contentSpacing,
            contentEditorSpacing: element.contentEditorSpacing
        };
    }
}

export default new OptionDefinitionRegistry();
