/**
 * Created by bartosz on 02.06.15.
 *
 * Option class
 */
import assertions from '../../lib/Assertions';
import BaseRendering from '../../lib/rendering/BaseRendering';
import OptionDef from '../../compositeComponentsDefinitions/OptionDef';
import OptionView from './OptionView';
import _each from 'lodash/collection/each';

class Option extends BaseRendering {
    /**
     *
     * @param {OptionDef} definition
     */
    constructor(definition) {
        super();
        this.id = definition.id;
        this.type = definition.type;

        this.connectionsMap = [];
        this.actionsMap = new Map();
        this.viewsMap = new Map();
        this.gridMap = {};
        this.optionDef = definition;

        assertions.required(this.id, this.type);
        assertions.type(definition, OptionDef);
    }

    renderToImpl(target) {
        this.view = new OptionView(this);
        this.view.renderLayout(target);

        let actions = this.getActions();
        let views = this.getViews();

        _each(actions, (actionElem)=> {
            this.view.renderAction(actionElem, target);
        });

        _each(views, (viewElem)=> {
            this.view.renderView(viewElem, target);
        });
    }

    disposeImpl(target) {
        var actions = this.getActions();
        var views = this.getViews();

        _each(actions, (actionElem)=> {
            actionElem.dispose();
        });

        _each(views, (viewElem)=> {
            viewElem.dispose();
        });
    }

    /**
     * @returns {Array.<BaseComponent>}
     */
    getActions() {
        return super.toArray(this.actionsMap.values());
    }

    /**
     * @returns {Array.<BaseRenderingComponent>}
     */
    getViews() {
        return super.toArray(this.viewsMap.values());
    }

    /**
     * Add Component to the gridMap
     *
     * @param {JSON} position
     * @param {BaseRenderingComponent} component
     */
    addGridPosition(position, component) {
        this.gridMap[component.id] = position;
    }

    /**
     * Get the grid position of the component by its id
     *
     * @param componentId id of the component
     * @returns {GridPosition} gridPosition
     */
    getGridPostion(componentId) {
        return this.gridMap[componentId];
    }

    /**
     * Set the grid map
     *
     * @param {Map} gridMap
     */
    setGridMap(gridMap) {
        this.gridMap = gridMap;
    }


    /**
     * @param {String} id
     * @param {BaseRenderingComponent} view
     */
    addView(id, view) {
        this.viewsMap.set(id, view);
    }

    /**
     *
     * @param {String} id
     * @param {BaseComponent} action
     */
    addAction(id, action) {
        this.actionsMap.set(id, action);
    }

    /**
     * Add the list of the components
     *
     * @param {Map} connectionsMap
     */
    setConnections(connectionsMap) {
        this.connectionsMap = connectionsMap;
    }


    /**
     * Get the grid map
     *
     * @return {Map} gridMap
     */
    getGridMap() {
        return this.gridMap;
    }

    /**
     * Get the socket list
     *
     * @returns {Array} with the input socket definitions
     */
    getInputSocketList() {
        return this.inputSocketDefList;
    }

    /**
     * Get the socket list
     *
     * @returns {Array} with the output socket definitions
     */
    getOutputSocketList() {
        return this.outputSocketDefList;
    }

    /**
     * Get the input socket by its name
     *
     * @param name
     * @returns {Socket} inputSocket
     */
    getInputSocketByName(name) {
        for (var i = 0; i < this.inputSocketList.length; i++) {
            if (this.inputSocketList[i].name === name) {
                return this.inputSocketList[i];
            }
        }
    }

    /**
     * Get the output socket by its name
     *
     * @param name
     * @returns {Socket} outputSocket
     */
    getOutputSocketByName(name) {
        for (var i = 0; i < this.outputSocketList.length; i++) {
            if (this.outputSocketList[i].name === name) {
                return this.outputSocketList[i];
            }
        }
    }

    /**
     * Get the input socket definition by name
     *
     * @param name
     * @returns {SocketDef} input socket definition
     */
    getInputSocketDefByName(name) {
        var inputSocketDefList = this.inputSocketDefList;

        for (var i = 0; i < inputSocketDefList.length; i++) {
            if (inputSocketDefList[i].name === name) {
                return inputSocketDefList[i];
            }
        }
    }

    /**
     * Get output socket definition by name
     *
     * @param name
     * @returns {SocketDef} output socket definition
     */
    getOutputSocketDefByName(name) {
        var outputSocketDefList = this.outputSocketDefList;

        for (var i = 0; i < outputSocketDefList.length; i++) {
            if (outputSocketDefList[i].name === name) {
                return outputSocketDefList[i];
            }
        }
    }

    /**
     * Create the input socket by its definition
     *
     * @param socketName
     * @returns {Socket} inputSocket
     */
    createInputSocketByName(socketName) {
        var inputSocketDef = this.getInputSocketDefByName(socketName);

        return this.createInputSocket(inputSocketDef);
    }

    /**
     * Create the output socket by its definition
     *
     * @param socketName
     * @returns {Socket} outputSocket
     */
    createOutputSocketByName(socketName) {
        var outputSocketDef = this.getOutputSocketDefByName(socketName);

        return this.createOutputSocket(outputSocketDef);
    }

    /**
     * Create input socket
     *
     * @param {SocketDef} socketDef
     * @returns {Socket}
     */
    createInputSocket(socketDef) {
        var inputSocket = new Socket(socketDef);

        this.inputSocketList.push(inputSocket);

        return inputSocket;
    }

    /**
     * Create output socket
     *
     * @param socketDef
     * @returns {Socket} outputSocket
     */
    createOutputSocket(socketDef) {
        var outputSocket = new Socket(socketDef);

        this.outputSocketList.push(outputSocket);

        return outputSocket;
    }

    /**
     * Get the component by its id
     *
     * @param componentId
     * @returns {Map} componentsMap
     */
    getComponent(componentId) {
        if (this.viewsMap.has(componentId)) {
            return this.viewsMap.get(componentId);
        }
        return this.actionsMap.get(componentId);
    }


    /**
     * Get the connections
     *
     * @returns {Map} connectionMap
     */
    getConnections() {
        return this.connectionsMap;
    }

}

export default Option;
