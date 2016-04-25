import assertions from './../lib/Assertions';
import Socket from './../communication/Socket';
import BaseComponentDefinition from '../componentsDefinitions/BaseComponentDefinition';
import _findIndex from '../../../node_modules/lodash/array/findIndex';
import SocketListenerBinder from '../lib/rendering/SocketListenerBinder';
/**
 * Created by bartosz on 20.05.15.
 *
 * Base Component class
 */
class BaseComponent {

    /**
     * @param {BaseComponentDefinition} componentDefinition
     */
    constructor(componentDefinition) {
        this.def = componentDefinition;
        this.inputSocketDefList = componentDefinition.inputSocketDefList;
        this.outputSocketDefList = componentDefinition.outputSocketDefList;
        this.inputSocketList = [];
        this.outputSocketList = [];

        this.socketListenerBinder = new SocketListenerBinder(this);

        assertions.required(this.inputSocketDefList, this.outputSocketDefList);
        assertions.type(componentDefinition, BaseComponentDefinition);
    }

    /**
     * Initialize the Component
     */
    initialize() {
        for (let i = 0; i < this.inputSocketDefList.length; i++) {
            let inputSocketDef = this.inputSocketDefList[i];
            this.createInputSocket(inputSocketDef);
        }

        for (let i = 0; i < this.outputSocketDefList.length; i++) {
            let outputSocketDef = this.outputSocketDefList[i];
            this.createOutputSocket(outputSocketDef);
        }

        this.addSocketListeners(this.socketListenerBinder);
        this.socketListenerBinder.applyHandlers();

        this.initializer = this.initializeImpl();
    }

    initializeImpl() {
    }

    dispose() {
        this.disposed = true;
        this.disposeListeners();
    }

    disposeListeners() {
        this.socketListenerBinder.removeHandlers();
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.def.name;
    }

    getType() {
        return this.def.type;
    }

    getIcon() {
        return this.def.icon;
    }

    /**
     * Get the input Sockets
     *
     * @return {Array} of sockets
     */
    getInputSocketList() {
        return this.inputSocketList;
    }

    isReady() {
        var findIndex = _findIndex(this.getInputSocketList(), (socket)=> {
            return !socket.isReady();
        });
        return findIndex === -1;
    }


    /**
     * Get the output Sockets
     *
     * @returns {Array} of sockets
     */
    getOutputSocketList() {
        return this.outputSocketList;
    }

    /**
     * Get the Input Socket by its name
     *
     * @param name
     * @returns {Socket} socket
     */
    getInputSocketByName(name) {
        for (var i = 0; i < this.inputSocketList.length; i++) {
            if (this.inputSocketList[i].name === name) {
                return this.inputSocketList[i];
            }
        }
    }

    /**
     *
     * @param {SocketListenerBinder} socketListenerBinder
     */
    addSocketListeners(socketListenerBinder) {
        this.addSocketListenersImpl(socketListenerBinder);
    }

    /**
     *
     * @param {SocketListenerBinder} socketListenerBinder
     */
    addSocketListenersImpl(socketListenerBinder) {

    }

    /**
     * Get the Output Socket by its name
     *
     * @param name
     * @returns {Socket} socket
     */
    getOutputSocketByName(name) {
        for (var i = 0; i < this.outputSocketList.length; i++) {
            if (this.outputSocketList[i].name === name) {
                return this.outputSocketList[i];
            }
        }
    }

    /**
     * Create the Input Socket
     *
     * @private
     */
    createInputSocket(socketDef) {
        var inputSocket = new Socket(socketDef);

        this.inputSocketList.push(inputSocket);

        return inputSocket;
    }

    /**
     * Create the Output Socket
     *
     * @private
     */
    createOutputSocket(socketDef) {
        var outputSocket = new Socket(socketDef);

        this.outputSocketList.push(outputSocket);

        return outputSocket;
    }

    setInOptionId(id) {
        this.id = id;
    }

    getInOptionId(id) {
        return this.id;
    }

    getRequiredInputSockets() {
        var requiredInputSockets = [];

        this.getInputSocketList().forEach(socket => {
            if (socket.socketDef.required) {
                requiredInputSockets.push(socket);
            }
        });

        return requiredInputSockets;
    }

}

export default BaseComponent;
