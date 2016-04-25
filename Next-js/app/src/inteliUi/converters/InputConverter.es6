/**
 * Created by bartosz on 13.07.15.
 *
 * InputConverter class
 *
 * This is the converters between Backend objects and InteliUi objects
 */

class InputConverter {

    constructor() {
        this.views;
        this.actions;
    }

    openOptionFromFile(option, inteliUi) {
        var inputAttributes = {
            palette: option.palette,
            fields: this.getFieldsFromFile(option.nodes),
            connections: this.getConnectionsFromFile(option.nodes)
        };

        inteliUi.startInteliUi(inputAttributes, inteliUi);
    }

    getPalette() {
        var palette = [];

        palette.push({
            label: 'Widok',
            type: 'view',
            iconClass: 'diagram-node-view-icon'
        }, {
            label: 'Akcja',
            type: 'action',
            iconClass: 'diagram-node-action-icon'
        });

        return palette;
    }

    getFields(option) {
        var views = this.views || option.getViews();
        var actions = this.actions || option.getActions();
        var self = this;

        var fields = [];

        this.x = 10;
        this.y = 10;

        views.forEach(function (view) {
            var field = {};

            field.componentName = view.getName();
            field.id = view.getName();
            field.type = 'view';
            field.xy = [self.x, self.y];
            field.name = view.getId();
            field.inputSocketDefList = view.inputSocketDefList;
            field.outputSocketDefList = view.outputSocketDefList;
            field.isNotInit = true;

            self.x = self.x + 60;
            self.y = self.y + 60;

            fields.push(field);
        });

        actions.forEach(function (action) {
            var field = {};

            field.componentName = action.getName();
            field.id = action.getName();
            field.type = 'action';
            field.xy = [self.x, self.y];
            field.name = action.getId();
            field.inputSocketDefList = action.inputSocketDefList;
            field.outputSocketDefList = action.outputSocketDefList;
            field.isNotInit = true;

            self.x = self.x + 60;
            self.y = self.y + 60;

            fields.push(field);
        });

        return fields;
    }

    getConnections(option) {
        var connections = option.getConnections();
        var connectionsConverted = [];
        var connectionName = '';
        var isMoreThenOneConnection = false;

        for (var connection in connections) {
            var connectionElement = {};
            var connectionJson = JSON.parse(connection);

            if (connectionJson.senderId !== connectionJson.receiverId) {

                //check if it's not already added to the converted connections
                if (connectionsConverted.length > 0) {
                    for (var i in connectionsConverted) {
                        if (connectionJson.senderId === connectionsConverted[i].source) {
                            if (connectionJson.receiverId === connectionsConverted[i].target) {
                                isMoreThenOneConnection = true;
                            } else {
                                isMoreThenOneConnection = false;
                            }
                        }
                    }
                }

                if (isMoreThenOneConnection) {
                    connectionName += ' | ' + connectionJson.senderSocketId + '-' + connectionJson.receiverSocketId;

                    var indexToDelete;

                    //remove the connection from array
                    connectionsConverted.forEach((connectionConverted, index) => {
                        if (connectionConverted.source === connectionJson.senderId && connectionConverted.target === connectionJson.receiverId) {
                            indexToDelete = index;
                        }
                    });

                    if (indexToDelete !== undefined) {
                        connectionsConverted.splice(indexToDelete, 1);
                    }
                } else {
                    connectionName = connectionJson.senderSocketId + '-' + connectionJson.receiverSocketId;
                }

                connectionElement = {
                    connector: {
                        name: connectionName
                    },
                    source: connectionJson.senderId,
                    target: connectionJson.receiverId
                };

                connectionsConverted.push(connectionElement);
            }
        }

        return connectionsConverted;
    }

    /**
     * Get the connections from file
     *
     * @param jsonOption
     * @returns {Array} connectionsModel
     */
    getConnectionsFromFile(jsonOption) {
        var connectionsModel = [];

        for (var node in jsonOption) {
            if (jsonOption.hasOwnProperty(node)) {
                var transitions = jsonOption[node].transitions;

                for (var i in transitions) {
                    if (transitions.hasOwnProperty(i)) {
                        var connectionElement = {};
                        var connectionObj = transitions[i];

                        connectionElement = {
                            connector: {
                                name: connectionObj.connector.name
                            },
                            source: connectionObj.source,
                            target: connectionObj.target
                        };

                        connectionsModel.push(connectionElement);
                    }
                }
            }
        }

        return connectionsModel;
    }

    /**
     * Get the fields from file
     *
     * @param jsonOption
     * @returns {Array}
     */
    getFieldsFromFile(jsonOption) {
        var fieldsModel = [];

        for (var node in jsonOption) {
            if (jsonOption.hasOwnProperty(node)) {
                var nodeObj = jsonOption[node];

                var fieldModel = {
                    name: nodeObj.name,
                    type: nodeObj.type,
                    xy: [
                        nodeObj.xy[0],
                        nodeObj.xy[1]
                    ]
                };

                fieldsModel.push(fieldModel);
            }
        }

        return fieldsModel;
    }
}

export default InputConverter;