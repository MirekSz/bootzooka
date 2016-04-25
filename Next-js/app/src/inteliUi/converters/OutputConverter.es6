/**
 * Created by bartosz on 14.07.15.
 *
 * OutputConverter class
 */
import ViewComponentDef from '../../componentsDefinitions/ViewComponentDef';
import ActionComponentDef from '../../componentsDefinitions/ActionComponentDef'
import ConnectionDef from '../../communication/ConnectionDef';
import OptionDef from '../../compositeComponentsDefinitions/OptionDef';
import InteliUiPosition from '../../inteliUi/InteliUiPosition';

class OutputConverter {

    /**
     * Create Next Option from the workspace elements
     *
     * @param workspace
     * @param inteliUi
     */
    convertToNextOption(workspace, inteliUi) {
        return new Promise((resolve) => {
            var self = this;
            var definitionsRequests = [];
            var connectionDefList = [];
            var elementsPositionsList = [];

            workspace.nodes.forEach(function (node) {
                var id = node.name.split('#')[0];
                var idInOption = node.name;
                var type;

                if (node.type === 'action') {
                    type = 'TestAction';
                } else {
                    type = 'TestTableComponent'
                }

                var sockets = {
                    inputSocketList: node.inputSocketDefList,
                    outputSocketList: node.outputSocketDefList
                };

                definitionsRequests.push(self.getElementDefinitionRequests(id, type, sockets, idInOption));

                self.appendArray(connectionDefList, self.getConnections(node));

                elementsPositionsList.push(self.createPositionObject(node));
            });

            Promise.all(definitionsRequests).then(res => {
                    var viewsDefMap = new Map();
                    var actionsDefMap = new Map();

                    for (var i = 0; i < res.length; i++) {
                        var element = res[i];

                        if (element[0]) {
                            for (var j = 0; j < element.length; j++) {
                                var el = element[j];
                                if (el.constructor.name === 'ViewComponentDef') {
                                    viewsDefMap.set(el.id, el);
                                } else {
                                    actionsDefMap.set(el.id, el);
                                }
                            }
                        } else {
                            if (element.constructor.name === 'ViewComponentDef') {
                                viewsDefMap.set(element.name, element);
                            } else {
                                actionsDefMap.set(element.name, element);
                            }
                        }
                    }

                    var optionDef = new OptionDef({
                        id: self.getOptionName(inteliUi)
                    });

                    for (var [viewKey, viewValue] of viewsDefMap) {
                        optionDef.addViewDef(viewValue, viewKey);
                    }

                    for (var [actionKey, actionValue] of actionsDefMap) {
                        optionDef.addActionDef(actionValue, actionKey);
                    }

                    for (var index in connectionDefList) {
                        optionDef.addConnectionDefObject(connectionDefList[index]);
                    }

                    resolve(optionDef);
                }
            );
        });
    }

    getOptionName(inteliUi) {
        if (inteliUi.getOptionId()) {
            var nameArr = inteliUi.getOptionId().split('.');
            return nameArr[nameArr.length - 1];
        } else {
            return '';
        }
    }

    /**
     * @private
     *
     * @param node
     */
    getConnections(node) {
        if (node.transitions.length > 0) {
            var connectionDef = [];

            node.transitions.forEach(function (transition) {
                if (transition.connector) {
                    var socketsPairs = transition.connector.name.split('|');

                    for (var i in socketsPairs) {
                        var socketPair = socketsPairs[i].trim();
                        var sockets = socketPair.split('-');

                        if (sockets) {
                            var socketOut = sockets[0].trim();
                            var socketIn = sockets[1].trim();

                            connectionDef.push(new ConnectionDef(transition.source, socketOut, transition.target, socketIn));
                        }
                    }
                }
            });

            return connectionDef;
        } else {
            return [];
        }
    }

    /**
     * @private
     *
     * @param node
     */
    createPositionObject(node) {
        var inteliUiPosition = new InteliUiPosition({id: node.name});

        inteliUiPosition.setPosition(node.xy);

        return inteliUiPosition;
    }

    /**
     * @private
     *
     * @param id
     * @param type
     * @param sockets
     * @returns {*}
     */
    getElementDefinitionRequests(id, type, sockets, name) {
        if (type === 'TestTableComponent') {
            var table = new ViewComponentDef(id, 'TABLE', null, name);

            table.setInputSocketDefList(sockets.inputSocketList);
            table.setOutputSocketDefList(sockets.outputSocketList);

            return table;
        } else if (type === 'TestAction') {
            var action = new ActionComponentDef(id, 'ACTION', null, name);

            action.setInputSocketDefList(sockets.inputSocketList);
            action.setOutputSocketDefList(sockets.outputSocketList);

            return action;
        }
    }

    /**
     * @private
     *
     * @param array1
     * @param array2
     * @returns {*}
     */
    appendArray(array1, array2) {
        array2.forEach(function (el) {
            array1.push(el);
        });
        return array1;
    }

}

export default OutputConverter;
