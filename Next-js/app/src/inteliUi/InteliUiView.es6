/**
 * Created by bartosz on 06.07.15.
 *
 * InteliUiView class
 */
import bs from '../lib/rendering/BootstrapApi';
import InteliUiApi from './facade/InteliUiApi';
import InteliUiEntity from './entity/InteliUiEntity';
import BasicView from '../lib/rendering/BasicView';

import communicationFactory from '../communication/CommunicationFactory';
import compositionFactory from '../compositeComponents/CompositionFactory';

class InteliUiView extends BasicView {

    constructor() {
        super();
    }

    /**
     * Method to show the result of the created portal
     *
     * @param data
     */
    showResult(data) {
        var self = this;

        var options = {
            id: 'inteliUi-result-modal',
            model: self.prepareViewModel(data)
        };

        bs.showModal(options);
    }

    /**
     * Method to show the file picker in the modal
     *
     */
    showOpenFilePickerModal(inteliUi) {
        var options = {
            id: 'inteliUi-open-file-picker-modal',
            model: {body: '<div class="open-file-picker-container"></div>', id: 'inteliUi-open-file-picker-modal'},
            callback: this.showOpenFilePicker,
            primaryButtonAction: inteliUi.createURL,
            inteliUi: inteliUi
        };

        this.removeIndicator();

        bs.showModal(options);
    }

    /**
     * Method to show the file picker
     */
    showOpenFilePicker(args) {
        var options = {
            injectNode: '.open-file-picker-container',
            command: 'Open',
            title: 'Please select the .json file with workspace: ',
            callback: args.inteliUi.openFromFile,
            inteliUi: args.inteliUi
        };

        bs.showFilePicker(options);
    }

    /**
     * Method to render the inteliUi editor
     *
     * @param inteliUi object
     */
    render(inteliUi) {
        var self = this;
        var target = inteliUi.target;
        var palette = inteliUi.palette;
        var connections = inteliUi.connections;
        var fields = inteliUi.fields;

        //clean the container
        if (inteliUi.container) {
            inteliUi.container.html('');
        }

        YUI().use('aui-diagram-builder', function (YUI) {

                YUI.DiagramNodeAction = YUI.Component.create({
                    NAME: 'diagram-node',
                    ATTRS: {
                        type: {
                            value: 'action'
                        },
                        id: {
                            value: 'id'
                        },
                        inputSocketDefList: {
                            value: 'inputSocketDefList'
                        },
                        outputSocketDefList: {
                            value: 'outputSocketDefList'
                        }
                    },
                    EXTENDS: YUI.DiagramNodeTask
                });

                YUI.DiagramNodeView = YUI.Component.create({
                    NAME: 'diagram-node',
                    ATTRS: {
                        type: {
                            value: 'view'
                        },
                        id: {
                            value: 'id'
                        },
                        inputSocketDefList: {
                            value: 'inputSocketDefList'
                        },
                        outputSocketDefList: {
                            value: 'outputSocketDefList'
                        }
                    },
                    EXTENDS: YUI.DiagramNodeTask
                });

                YUI.DiagramNodeOption = YUI.Component.create({
                    NAME: 'diagram-node',
                    ATTRS: {
                        type: {
                            value: 'option'
                        },
                        id: {
                            value: 'id'
                        },
                        inputSocketDefList: {
                            value: 'inputSocketDefList'
                        },
                        outputSocketDefList: {
                            value: 'outputSocketDefList'
                        }
                    },
                    EXTENDS: YUI.DiagramNodeTask
                });

                YUI.DiagramBuilder.types.action = YUI.DiagramNodeAction;
                YUI.DiagramBuilder.types.view = YUI.DiagramNodeView;
                YUI.DiagramBuilder.types.option = YUI.DiagramNodeOption;

                inteliUi.diagramBuilder = new YUI.DiagramBuilder({
                    availableFields: palette,
                    boundingBox: target.boxContainer,
                    fields: fields,
                    render: true,
                    srcNode: target.srcContainer
                });

                /**
                 * Overwrite the standard create field method
                 *
                 * @val values of the new field
                 */
                inteliUi.diagramBuilder.createField = function (value) {
                    var val = value;
                    var isDiagramNode = function (val) {
                        return YUI.instanceOf(val, YUI.DiagramNode);
                    };

                    var instance = this;

                    if (!isDiagramNode(val)) {
                        val.builder = instance;
                        val.bubbleTargets = instance;
                        val = new (instance.getFieldClass(val.type || 'node'))(val);
                    }

                    return val;
                };

                /**
                 * Overwrite the standard edit node method
                 *
                 * @param diagramNode
                 */
                inteliUi.diagramBuilder.editNode = function (diagramNode, callback) {
                    var args = {
                        diagramNode: diagramNode,
                        Y: YUI,
                        inteliUi: inteliUi,
                        suggestedFlowCallback: callback
                    };

                    inteliUi.showIndicator();

                    self.setDataForModal(args);
                };

                /**
                 * Overwrite the standard edit connector method
                 *
                 * @param connector
                 */
                inteliUi.diagramBuilder.editConnector = function (connector) {
                    var args = {
                        connector: connector,
                        Y: YUI,
                        inteliUi: inteliUi
                    };

                    inteliUi.showIndicator();

                    self.handleStandardConnectorEditing(args);
                };

                inteliUi.diagramBuilder.isAbleToConnect = function () {
                    var instance = this;
                    var args = {
                        instance: instance,
                        inteliUi: inteliUi,
                        connector: inteliUi.diagramBuilder.connector
                    };

                    if (instance.publishedTarget) {
                        self.showSelectSockets(args);
                    }

                    return !!(instance.publishedSource && instance.publishedTarget);
                };

                /**
                 * Method to extend the standard adding new filed function
                 *
                 * @param instance
                 * @param drag
                 */
                inteliUi.diagramBuilder.showNewFieldOptions = function (instance, drag) {
                    var availableField = drag.get('node').getData('availableField');

                    var newField = instance.addField({
                        xy: YUI.DiagramNode.getNodeCoordinates(drag.lastXY, instance.dropContainer),
                        type: availableField.get('type')
                    });

                    instance.select(newField);

                    var args = {
                        diagramNode: newField,
                        Y: YUI,
                        inteliUi: inteliUi
                    };

                    inteliUi.showIndicator();

                    self.setDataForModal(args);
                };

                /**
                 * Overwrite the standard toJSON method
                 *
                 * @method toJSON
                 * @return {Object}
                 */
                inteliUi.diagramBuilder.toJSON = function () {
                    var instance = this;

                    var AArray = YUI.Array;

                    var output = {
                        nodes: []
                    };

                    instance.get('fields').each(function (diagramNode) {
                        var node = {
                                transitions: []
                            },
                            transitions = diagramNode.get('transitions');

                        var diagramNodeAttributes = diagramNode.SERIALIZABLE_ATTRS;

                        //add id attr
                        diagramNodeAttributes.push('id');
                        diagramNodeAttributes.push('componentName');
                        diagramNodeAttributes.push('inputSocketDefList');
                        diagramNodeAttributes.push('outputSocketDefList');

                        // serialize node attributes
                        AArray.each(diagramNodeAttributes, function (attributeName) {
                            node[attributeName] = diagramNode.get(attributeName);
                        });

                        // serialize node transitions
                        AArray.each(transitions.values(), function (transition) {
                            var connector = diagramNode.getConnector(transition);
                            transition.connector = connector.toJSON();
                            node.transitions.push(transition);
                        });

                        output.nodes.push(node);
                    });

                    return output;
                };

                inteliUi.diagramBuilder.hideSuggestConnectorOverlay = function (args) {
                    var instance = this;

                    //instance.connector.hide();
                    instance.get('suggestConnectorOverlay').hide();

                    try {
                        instance.fieldsDrag.dd.set('lock', false);
                    } catch (e) {
                    }

                    if (args) {
                        instance.editNode(args.node, args.callback, args.suggestConnectorFlow);
                    }
                };

                inteliUi.diagramBuilder.connectAll(connections);

                if (!inteliUi.isEmptyStart) {
                    self.markFieldsAsInit(inteliUi.diagramBuilder);
                }

                self.handleAfterRender(inteliUi);
            }
        );

    }

    /**
     * Mark the loaded fields as not initialized
     *
     * @param diagramBuilder
     */
    markFieldsAsInit(diagramBuilder) {
        diagramBuilder.get('fields').each(function (diagramNode) {
            diagramNode.isNotInit = true;
        });
    }

    /**
     * Show the modal with the sockets selection when new connection is made
     *
     * @param args
     * @returns {boolean}
     */
    showSelectSockets(args) {
        const self = this;
        var source = args.instance.publishedSource;
        var target = args.instance.publishedTarget;

        var details = {
            inputSocketDefList: target.get('inputSocketDefList'),
            outputSocketDefList: source.get('outputSocketDefList')
        };

        var options = {
            id: 'inteliUi-sockets-select-modal',
            title: 'Wybierz połączenie między soketami',
            onshownCallback: function (dialog, options) {
                args.inteliUi.removeIndicator();

                var template = require('./templates/node_details.hbs');
                var htmlTemplate = template(options.details);

                dialog.$modalBody.html(htmlTemplate).promise().done(function () {
                    var modal = $(this).parents().closest('.modal-dialog');
                    var inputSelector = modal.find('.input-socket-list');
                    var outputSelector = modal.find('.output-socket-list');
                    var nameInput = modal.find('#name-input');
                    var connectionNameInput = modal.find('#connection-name-input');
                    var buttonOK = modal.find('#btnSave');
                    var buttonRemove = modal.find('#remove-node');
                    var buttonAddConnection = modal.find('#add-connection-btn');
                    var buttonRemoveConnection = modal.find('#remove-connection-btn');
                    var createdConnectionsList = modal.find('.created-connections-list');

                    inputSelector.change(event => {
                        if (self.generateConnectorName(event)) {
                            nameInput.val(self.generateConnectorName(event));
                            nameInput.trigger('NAME_CHANGED');
                        } else {
                            nameInput.val('');
                            nameInput.trigger('NAME_CHANGED');
                            console.log('select matching sockets');
                        }
                    });

                    outputSelector.change(event => {
                        var selectedElement = outputSelector.find(':selected');
                        var outputSocket = {
                            type: selectedElement.attr('id'),
                            name: selectedElement.val()
                        };

                        self.changeConnectorName(outputSocket, inputSelector, nameInput, event);
                    });

                    nameInput.on('NAME_CHANGED', () => {
                        if (nameInput.val() === '') {
                            buttonAddConnection.addClass('disabled');
                        } else {
                            buttonAddConnection.removeClass('disabled');
                        }
                    });

                    buttonAddConnection.click(e => {
                        var connection = nameInput.val();
                        var createdConnectionListValue = createdConnectionsList.html();
                        var title = connectionNameInput.val();
                        var isAlreadyCreated = false;

                        e.preventDefault();

                        if (!$(e.target).hasClass('disabled')) {
                            //check the connection is already created
                            createdConnectionsList.find('option').each((i, option) => {
                                if (option.value === connection) {
                                    isAlreadyCreated = true;
                                }
                            });

                            if (!isAlreadyCreated) {
                                createdConnectionsList.html(createdConnectionListValue.concat('<option id="option-' + connection + '">' + connection + '</option>'));

                                if (title === '') {
                                    title = nameInput.val();
                                } else {
                                    title += ' | ' + nameInput.val();
                                }

                                connectionNameInput.val(title);

                                buttonOK.trigger('CONNECTION_ADDED');
                            } else {
                                console.log('That connection has been already created before.');
                            }
                        }
                    });

                    buttonRemoveConnection.click(e => {
                        var selectedConnection = createdConnectionsList.find(':selected');

                        e.preventDefault();

                        if (!$(e.target).hasClass('disabled')) {

                            $(selectedConnection).remove();
                            connectionNameInput.val(connectionNameInput.val().replace(' | ' + selectedConnection.val(), ''));
                            connectionNameInput.val(connectionNameInput.val().replace(selectedConnection.val(), ''));

                            if (connectionNameInput.val() === '') {
                                args.inteliUi.diagramBuilder.deleteSelectedConnectors();

                                dialog.close();
                            }
                        }
                    });

                    createdConnectionsList.click(e => {
                        buttonRemoveConnection.removeClass('disabled');
                    });

                    buttonOK.on('CONNECTION_ADDED', () => {
                        buttonOK.removeClass('disabled');
                    });

                    buttonRemove.click(e => {
                        self.removeEditedElement(e, options);
                    });
                });
            },
            onhideCallback: function () {
                args.inteliUi.removeEditNode();
            },
            primaryButtonAction: function (inteliUi, dialog) {
                var connectionName = dialog.$modalBody.find('#connection-name-input').val();

                var options = args.inteliUi.getEditNode();
                var instance, target;

                if (options) {
                    instance = options.instance;
                    target = options.target;
                } else {
                    instance = inteliUi.diagramBuilder;
                    target = inteliUi.diagramBuilder.publishedTarget;
                }

                var source = instance.publishedSource;

                var targetName = target.get('name');
                var sourceTransitions = source.get('transitions');
                var transitionResult;

                for (var i in sourceTransitions.values()) {
                    var transition = sourceTransitions.values()[i];

                    if (transition.target === targetName) {
                        transitionResult = transition;
                    }
                }

                var connector;

                if (transitionResult) {
                    connector = source.getConnector(transitionResult);
                } else {
                    connector = inteliUi.diagramBuilder.connector;
                }

                connector.set('name', connectionName);

                inteliUi.addConnectionToRegister(connector);

                instance.suggestFlow = false;
            },
            model: {
                id: 'inteliUi-node-details-modal'
            },
            details: details,
            inteliUi: args.inteliUi,
            defaultDisabledButton: true,
            closable: true,
            closeButtonAction: function (dialog, e, options) {
                options.args = args.inteliUi.getEditNode();

                self.removeEditedElement(e, options);

                dialog.close();
            },
            closeByBackdrop: false,
            closeByKeyboard: false,
            noCloseCross: true
        };

        //pin the edit node till the editing modal is open
        args.inteliUi.setEditNode({instance: args.instance, target: target, source: source, connector: args.connector});

        bs.showModal(options);

        return false;
    }


    changeConnectorName(outputSocket, inputSelector, nameInput, e) {
        var self = this;

        //filter the input sockets
        var inputSocketList = self.getAllInputSockets(inputSelector);
        var compatibleInputSockets = self.filterCompatibleInputSockets(outputSocket, inputSocketList);

        if (compatibleInputSockets.length > 0) {
            self.filterInputSockets(compatibleInputSockets, inputSelector);
        } else {
            self.hideAllInputSockets(inputSelector);
        }

        if (self.generateConnectorName(e)) {
            nameInput.val(self.generateConnectorName(e));
            nameInput.trigger('NAME_CHANGED');
        } else {
            nameInput.val('');
            nameInput.trigger('NAME_CHANGED');
        }
    }

    /**
     * In case there are no available input sockets, hide all of them
     *
     * @param inputSelector
     */
    hideAllInputSockets(inputSelector) {
        var inputSocketElements = inputSelector.find('option');

        for (var i = 0; i < inputSocketElements.length; i++) {
            var element = inputSocketElements[i];

            $(element).addClass('hidden');
        }
    }

    /**
     * Show filtered input sockets
     *
     * @param compatibleInputSockets
     * @param inputSelector
     */
    filterInputSockets(compatibleInputSockets, inputSelector) {
        compatibleInputSockets.forEach((inputSocket) => {
            var option = $('<option/>');

            option.attr('id', inputSocket.type);
            option.val(inputSocket.name);
            option.text(inputSocket.name);

            var inputSocketElements = inputSelector.find('option');

            for (var i = 0; i < inputSocketElements.length; i++) {
                var element = inputSocketElements[i];

                if (option.val() !== element.label) {
                    $(element).addClass('hidden');
                } else {
                    $(element).removeClass('hidden');
                }
            }
        });
    }

    /**
     * Method to get the list of the object's input sockets list
     *
     * @param inputSelector
     * @returns {Array}
     */
    getAllInputSockets(inputSelector) {
        var inputSocketList = [];
        var inputSocketElements = inputSelector.find('option');

        for (var i = 0; i < inputSocketElements.length; i++) {
            var option = inputSocketElements[i];
            var element = {
                type: option.id,
                name: option.label
            };

            inputSocketList.push(element);
        }

        return inputSocketList;
    }

    /**
     * Method to filter the input sockets by the output sockets
     *
     * @param inputSocketList
     * @param outputSocket
     */
    filterCompatibleInputSockets(outputSocket, inputSocketList) {
        var inputSocket;
        var compatibleInputSockets = [];

        inputSocketList.forEach((inputSocketElement) => {
            inputSocket = inputSocketElement;

            var isCompatible = communicationFactory.checkSocketsCompatibility(outputSocket, inputSocket);

            if (isCompatible) {
                compatibleInputSockets.push(inputSocket);
            }
        });

        return compatibleInputSockets;
    }

    /**
     * Prepare the data for the modals
     *
     * @param args
     */
    setDataForModal(args) {
        var self = this;
        var inteliUiEntity = new InteliUiEntity();
        var diagramNode = args.diagramNode;
        var type = diagramNode.get('type');
        args.details = {};

        if (!diagramNode.isNotInit) {
            args.draggable = false;
            args.closeByBackdrop = false;
            args.closeByKeyboard = false;
            args.closable = false;
            args.removeButton = false;

            inteliUiEntity.getDataFromBackend({
                type: type,
                text: '',
                args: args,
                callback: self.handleStandardNodeEditing
            });

        } else {
            args.details.name = diagramNode.get('name');
            args.details.id = diagramNode.get('id');
            args.details.componentName = diagramNode.get('componentName');
            args.details.description = diagramNode.get('description');
            args.details.x = diagramNode.get('x');
            args.details.y = diagramNode.get('y');
            args.details.inputSocketDefList = diagramNode.get('inputSocketDefList');
            args.details.outputSocketDefList = diagramNode.get('outputSocketDefList');
            args.details.removeButton = true;

            inteliUiEntity.getDataFromBackend({
                type: type,
                text: '',
                args: args,
                callback: self.handleStandardNodeEditing
            });
        }
    }

    /**
     * Method to reload the input socket list
     *
     * @param args
     * @param data
     */
    reloadInputSocketList(args, data) {
        args.contentList.empty();

        data.forEach((element) => {
            var option = $('<option />');

            option.attr('id', element.id);
            option.val(element.name);
            option.text(element.name);

            args.contentList.append(option);
        });
    }

    /**
     * Show the standard node editing modal
     *
     * @param args
     * @returns {boolean}
     */
    handleStandardNodeEditing(args) {
        var diagramNode = args.diagramNode;
        var self = args.inteliUi.view;
        var defaultDisabledButton = true;

        if (diagramNode.isNotInit) {
            defaultDisabledButton = false;
        }

        if (args.suggestedFlowCallback) {
            args.inteliUi.setSuggestedFlowCallback(args.suggestedFlowCallback);
        }

        var options = {
            id: 'inteliUi-node-details-modal',
            title: 'Wybór komponentu',
            onshownCallback: function (dialog, options) {
                var inteliUiEntity = new InteliUiEntity();

                args.inteliUi.removeIndicator();

                var template;

                //TODO: set language relocate in other place
                if (options.details) {
                    if (options.details.type === 'actions') {
                        options.details.typeToShow = 'akcje';
                    } else {
                        options.details.typeToShow = 'widoki';
                    }

                    //options.details.componentName = options.details.id;
                }

                if (!diagramNode.isNotInit) {
                    template = require('./templates/add_node.hbs');
                } else {
                    template = require('./templates/node_details.hbs');
                }

                var htmlTemplate = template(options.details);
                dialog.$modalBody.html(htmlTemplate).promise().done(function () {
                    var filterInput = $(this).find('#filter-backend-content');
                    var contentList = $(this).find('.from-backend-content-list');
                    var buttonRemove = $(this).find('#remove-node');

                    var delay = (() => {
                        var timer = 0;
                        return function (callback, ms) {
                            clearTimeout(timer);
                            timer = setTimeout(callback, ms);
                        };
                    })();

                    filterInput.keyup(e => {
                        delay(function () {
                            var filterText = $(filterInput).val();

                            if (filterText.length > 2) {
                                var type = args.diagramNode.get('type');

                                inteliUiEntity.getDataFromBackend({
                                    type: type,
                                    text: filterText,
                                    args: {contentList: contentList, inteliUi: args.inteliUi},
                                    callback: self.reloadInputSocketList
                                });
                            }
                        }, 500);
                    });

                    contentList.click(e => {
                        var modal = $(e.target).parents().closest('.modal-dialog');
                        var buttonOK = modal.find('#btnSave');

                        buttonOK.removeClass('disabled');
                    });

                    contentList.dblclick(e => {
                        var modal = $(e.target).parents().closest('.modal-dialog');
                        var buttonOK = modal.find('#btnSave');

                        buttonOK.removeClass('disabled');

                        buttonOK.click();
                    });

                    buttonRemove.click(function (e) {
                        self.removeEditedElement(e, options);
                    });

                    setTimeout(() => {
                        filterInput.focus();
                    }, 1000);
                });
            },
            onhideCallback: function () {
                if (!args.suggestedFlowCallback) {
                    options.inteliUi.removeEditNode();
                    options.inteliUi.removeNodesModel();
                }
            },
            primaryButtonAction: function (inteliUi, dialog) {
                var editNode = options.inteliUi.getEditNode();
                var selectedRow = $('.from-backend-content-list').find(':selected');

                if (!diagramNode.isNotInit || selectedRow.length) {
                    var nodesModel = args.inteliUi.getNodesModel();
                    var name = selectedRow.attr('id');
                    var componentName = selectedRow.val();

                    nodesModel.forEach((node) => {
                        if (node.id === name) {
                            var idInOption = inteliUi.createIdInOption(name);

                            editNode.set('inputSocketDefList', node.inputSocketDefList);
                            editNode.set('outputSocketDefList', node.outputSocketDefList);
                            editNode.set('repeaterSocketDefList', node.repeaterSocketDefList);
                            editNode.set('componentName', componentName);
                            editNode.set('name', idInOption);
                        }
                    });

                    var callback = inteliUi.getSuggestedFlowCallback();

                    if (callback) {
                        callback(editNode);

                        inteliUi.removeSuggestedFlowCallback();
                    }

                } else {
                    editNode.set('description', dialog.$modalBody.find('#description-input').val());
                }

                var nodeInitiationAndRowNotSelected = !diagramNode.isNotInit && !selectedRow.length;

                inteliUi.addNodeToRegister(editNode);

                if (nodeInitiationAndRowNotSelected) {
                    return true;
                } else {
                    diagramNode.isNotInit = true;
                }
            },
            model: {
                id: 'inteliUi-node-details-modal'
            },
            details: args.details,
            inteliUi: args.inteliUi,
            draggable: args.draggable,
            removeButton: args.details.removeButton,
            closable: args.closable,
            closeByBackdrop: args.closeByBackdrop,
            closeByKeyboard: args.closeByKeyboard,
            defaultDisabledButton: defaultDisabledButton
        };

        bs.showModal(options);

        //pin the edit node till the editing modal is open
        args.inteliUi.setEditNode(diagramNode);

        return false;
    }

    /**
     * Add the connection for the model
     *
     * @param options
     * @returns {*} options
     */
    addConnectionsModel(options) {
        var name = options.details.name;
        var connections = name.split(' | ');

        if (options.details) {
            options.details.connections = [];
        }

        connections.forEach(connection => {
            options.details.connections.push({name: connection});
        });

        return options;
    }

    /**
     * Show the connection editing modal
     *
     * @param args
     * @returns {boolean}
     */
    handleStandardConnectorEditing(args) {
        const self = this;
        var connector = args.connector;
        var details = {};

        details.name = connector.get('name');
        details.description = connector.get('description');
        details.x = connector.get('x');
        details.y = connector.get('y');

        //get the linked nodes
        var sourceNodeId = args.connector.get('transition').source;
        var targetNodeId = args.connector.get('transition').target;
        var sourceNode, targetNode;

        var nodes = args.inteliUi.workspaceRegister.nodes;

        for (var i in nodes) {
            var node = nodes[i];

            if (node.get('name') === sourceNodeId) {
                sourceNode = node;
            } else if (node.get('name') === targetNodeId) {
                targetNode = node;
            }
        }

        //handle the repeater
        if (sourceNodeId === targetNodeId) {
            targetNode = sourceNode;
        }

        details.outputSocketDefList = sourceNode.get('outputSocketDefList');
        details.inputSocketDefList = targetNode.get('inputSocketDefList');
        details.removeButton = true;

        var options = {
            id: 'inteliUi-node-details-modal',
            title: 'Wybór komponentu',
            onshownCallback: function (dialog, options) {
                args.inteliUi.removeIndicator();

                //create the connections for the name
                options = self.addConnectionsModel(options);

                var template = require('./templates/node_details.hbs');
                var htmlTemplate = template(options.details);

                dialog.$modalBody.html(htmlTemplate).promise().done(function () {
                    var modal = $(this).parents().closest('.modal-dialog');
                    var inputSelector = modal.find('.input-socket-list');
                    var outputSelector = modal.find('.output-socket-list');
                    var nameInput = modal.find('#name-input');
                    var connectionNameInput = modal.find('#connection-name-input');
                    var buttonOK = modal.find('#btnSave');
                    var buttonRemove = modal.find('#remove-node');
                    var buttonAddConnection = modal.find('#add-connection-btn');
                    var buttonRemoveConnection = modal.find('#remove-connection-btn');
                    var createdConnectionsList = modal.find('.created-connections-list');

                    inputSelector.change(e => {
                        if (self.generateConnectorName(e)) {
                            nameInput.val(self.generateConnectorName(e));
                            nameInput.trigger('NAME_CHANGED');
                        } else {
                            nameInput.val('');
                            nameInput.trigger('NAME_CHANGED');
                            console.log('select matching sockets');
                        }
                    });

                    outputSelector.change(e => {
                        var selectedElement = outputSelector.find(':selected');
                        var outputSocket = {
                            type: selectedElement.attr('id'),
                            name: selectedElement.val()
                        };

                        self.changeConnectorName(outputSocket, inputSelector, nameInput, e)
                    });

                    nameInput.on('NAME_CHANGED', () => {
                        if (nameInput.val() === '') {
                            buttonAddConnection.addClass('disabled');
                        } else {
                            buttonAddConnection.removeClass('disabled');
                        }
                    });

                    buttonAddConnection.click(e => {
                        var connection = nameInput.val();
                        var createdConnectionListValue = createdConnectionsList.html();
                        var title = connectionNameInput.val();
                        var isAlreadyCreated = false;

                        e.preventDefault();

                        if (!$(e.target).hasClass('disbled')) {
                            //check the connection is already created
                            createdConnectionsList.find('option').each((i, option) => {
                                if (option.value === connection) {
                                    isAlreadyCreated = true;
                                }
                            });

                            if (!isAlreadyCreated) {
                                createdConnectionsList.html(createdConnectionListValue.concat('<option id="option-' + connection + '">' + connection + '</option>'));

                                title += ' | ' + nameInput.val();

                                connectionNameInput.val(title);

                                buttonOK.trigger('CONNECTION_ADDED');
                            } else {
                                console.log('That connection has been already created before.');
                            }
                        }
                    });

                    buttonRemoveConnection.click(e => {
                        var selectedConnection = createdConnectionsList.find(':selected');

                        e.preventDefault();

                        if (!$(e.target).hasClass('disabled')) {
                            $(selectedConnection).remove();
                            connectionNameInput.val(connectionNameInput.val().replace(' | ' + selectedConnection.val(), ''));
                            connectionNameInput.val(connectionNameInput.val().replace(selectedConnection.val(), ''));

                            buttonOK.trigger('CONNECTION_ADDED');

                            if (connectionNameInput.val() === '') {
                                args.inteliUi.diagramBuilder.deleteSelectedConnectors();

                                dialog.close();
                            }
                        }
                    });

                    createdConnectionsList.click(() => {
                        buttonRemoveConnection.removeClass('disabled');
                    });

                    buttonOK.on('CONNECTION_ADDED', () => {
                        buttonOK.removeClass('disabled');
                    });

                    buttonRemove.click(e => {
                        self.removeEditedElement(e, options);
                    });
                });
            },
            onhideCallback: function () {
                options.inteliUi.removeEditNode();
                options.inteliUi.removeNodesModel();
            },
            primaryButtonAction: function (inteliUi, dialog) {
                var connector = inteliUi.getEditNode();
                var connectionName = dialog.$modalBody.find('#connection-name-input').val();

                inteliUi.removeConnectionFromRegister(connector);

                connector.set('description', dialog.$modalBody.find('#description-input').val());
                connector.set('name', connectionName);

                inteliUi.addConnectionToRegister(connector);
            },
            model: {
                id: 'inteliUi-node-details-modal'
            },
            details: details,
            inteliUi: args.inteliUi,
            defaultDisabledButton: true
        };

        bs.showModal(options);

        //pin the edit node till the editing modal is open
        args.inteliUi.setEditNode(connector);

        return false;
    }

    /**
     * Method to prepare view model
     *
     * @param data
     * @returns {{body, id: string}}
     */
    prepareViewModel(data) {
        return {
            body: '<textarea rows="4">' + JSON.stringify(data) + '</textarea>',
            id: 'inteliUi-result-modal'
        };
    }

    /**
     * Handle the events on the rendered view
     *
     * @param inteliUi
     */
    handleAfterRender(inteliUi) {
        var modal = $('.modal-dialog');

        //show button
        inteliUi.saveWorkspaceButton.removeClass('hidden');

        inteliUi.setHandler('click', inteliUi.saveWorkspaceButton, event => {
            event.stopImmediatePropagation();
            inteliUi.showResult();
        });

        inteliUi.setHandler('click', inteliUi.exportPortalToOption, event => {
            event.stopImmediatePropagation();

            var optionDef = inteliUi.getOption();
            var option = compositionFactory.createOption(optionDef);
            inteliUi.renderOption(option);

            inteliUi.closeInteliUiModal();
        });

        inteliUi.setHandler('click', inteliUi.saveAndExitButton, event => {
            event.stopImmediatePropagation();

            var nameObj = inteliUi.view.getName(inteliUi);

            if (!(nameObj.name === '')) {
                inteliUi.saveAndExit(nameObj);
            } else {
                var $nameInput = inteliUi.saveAndExitButton.closest('.modal-dialog').find('#inteliUi-name-input');
                var $nameInputGroup = $nameInput.closest('.input-group');

                $nameInputGroup.addClass('has-error');
                $nameInput.keyup(() => {
                    $nameInputGroup.removeClass('has-error');
                });

                alertify.error('Podaj nazwe opcji...');
            }
        });

        //unlock the rest of the menu
        modal.find('.after-start-function').removeClass('hidden');

        //pin add-item button to the workspace
        this.handlePaletteMenu(modal, inteliUi);

        this.addElementsToRegister(inteliUi, true);

        inteliUi.removeIndicator();
    }

    getName(inteliUi) {
        var $name = $('#inteliUi-name-input');

        return {
            inteliUi: inteliUi,
            name: $name.val()
        }
    }

    /**
     * Add elements to register after open operation
     *
     * @param inteliUi
     * @param isSetNames if true the component names will be set too.
     */
    addElementsToRegister(inteliUi, isSetNames) {
        var diagramBuilder = inteliUi.diagramBuilder;
        var self = this;

        diagramBuilder.get('fields').each(field => {
            var fieldId = field.get('name');

            if (isSetNames) {
                var componentName = self.getComponentNameByName(fieldId, inteliUi);

                field.labelNode.setContent(componentName);
            }

            inteliUi.addNodeToRegister(field);
        });

        diagramBuilder.eachConnector(connection => {
            inteliUi.addConnectionToRegister(connection);
        });
    }

    getComponentNameByName(fieldId, inteliUi) {
        var result = undefined;

        inteliUi.fields.forEach(field => {
            if (field.name === fieldId) {
                result = field.componentName;
            }
        });

        return result;
    }

    /**
     * Handle the palette menu
     *
     * @param modal
     * @param inteliUi
     */
    handlePaletteMenu(modal, inteliUi) {
        modal.find('.property-builder-fields-container').prepend('<li class="add-item animate collapsed noselect"><span class="glyphicon glyphicon-plus"> Dodaj</span></li>');

        var addButton = modal.find('.add-item');
        var addButtonIcon = addButton.find('span');
        var paletteContainer = addButton.parent();
        var paletteElements = paletteContainer.find('.property-builder-field-draggable');

        paletteElements.addClass('hidden');

        inteliUi.setHandler('click', addButton, event => {
            if (addButton.hasClass('collapsed')) {
                addButtonIcon.text('');
                addButtonIcon.removeClass('glyphicon-plus');
                addButtonIcon.addClass('glyphicon-minus');
                addButton.removeClass('collapsed');
                paletteElements.removeClass('hidden');
            } else {
                addButtonIcon.text(' Dodaj');
                addButtonIcon.removeClass('glyphicon-minus');
                addButtonIcon.addClass('glyphicon-plus');
                addButton.addClass('collapsed');
                paletteElements.addClass('hidden');
            }
        });
    }

    /**
     * Show the inteliUi modal
     *
     * @param dialog
     */
    showInteliUiInModal(dialog, options) {
        var inteliUiTemplate = require('./templates/InteliUi.hbs');
        var htmlElement = inteliUiTemplate({});

        dialog.$modalBody.html(htmlElement).promise().done(() => {

            setTimeout(() => {
                var inteliUiModalBody = $('.InteliUi-modal-body').find('*');
                var inteliUiApi = new InteliUiApi();

                if (options.context) {
                    inteliUiApi.startInteliUiWithOption(options.context.name);
                } else {
                    inteliUiApi.startEmptyInteliUi();
                }

                inteliUiModalBody.css('-webkit-transition', 'none');
                inteliUiModalBody.css('-moz-transition', 'none');
                inteliUiModalBody.css('-o-transition', 'none');
                inteliUiModalBody.css('transition', 'none');
            }, 1000, options);
        });
    }

    /**
     * Universal method to generate the connector name
     *
     * @param e event
     */
    generateConnectorName(e) {
        var modal = $(e.target).parents().closest('.modal-dialog');

        var outputSelector = modal.find('.available-output-sockets');
        var inputSelector = modal.find('.available-input-sockets');

        var outputSocket = outputSelector.find(':selected');
        var inputSocket = inputSelector.find(':selected');

        if ($(outputSocket).length > 0 && $(inputSocket).length > 0) {
            if (!$(outputSocket).hasClass('hidden') && !$(inputSocket).hasClass('hidden')) {
                return outputSocket.val() + '-' + inputSocket.val();
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * Universal method to handle the remove functionality
     *
     * @param e event
     * @param options attributes
     */
    removeEditedElement(e, options) {
        var inteliUi = options.inteliUi;
        var editNode = inteliUi.editNode;
        var isInitFlow = false;

        e.preventDefault();

        if (editNode) {
            //check it's a connector or node
            if (editNode.name === 'line') {
                inteliUi.diagramBuilder.deleteSelectedConnectors();

                //remove from register
                inteliUi.removeConnectionFromRegister(editNode);
            } else if (editNode.name === 'diagram-node') {
                //remove from workspace
                editNode.close();

                //remove from register
                inteliUi.removeNodeFromRegister(editNode);
            } else {
                var options = inteliUi.getEditNode();
                var instance = options.instance;
                var target = options.target;
                var source = instance.publishedSource;

                var targetName = target.get('name');
                var sourceTransitions = source.get('transitions');
                var transitionResult;

                for (var i in sourceTransitions.values()) {
                    var transition = sourceTransitions.values()[i];

                    if (transition.target === targetName) {
                        transitionResult = transition;
                    }
                }

                if (transitionResult) {
                    var connector = source.getConnector(transitionResult);
                    var transitionToDelete = connector.get('transition');

                    source.disconnect(transitionToDelete);
                }

                //delete target node if it's suggest flow
                if (instance.suggestFlow) {
                    instance.suggestFlow = false;

                    //remove from workspace
                    target.close();

                    //remove from register
                    inteliUi.removeNodeFromRegister(target);
                }

                options.instance.stopEditing();

                isInitFlow = true;
            }
        } else {
            inteliUi.diagramBuilder.deleteSelectedConnectors();
        }

        //close the modal
        if (!options.closeButtonAction && !isInitFlow) {
            $(e.target).parents().closest('.modal-dialog').find('#btnClose').click();
        }
    }

}

export default InteliUiView;
