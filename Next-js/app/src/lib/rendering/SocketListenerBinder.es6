/**
 * Created by Mirek on 2015-06-17.
 */
import ConnectionDef from '../../communication/ConnectionDef';


class SocketListenerBinder {
    constructor(component) {
        this.component = component;
        this.handlers = new Map();
    }

    /**
     *
     * @param {String} inputSocketId
     * @param callback
     */
    add(inputSocketId, callback) {
        this.handlers.set(inputSocketId, callback);
    }

    getHandlers() {
        return this.handlers;
    }

    applyHandlers(target) {
        for (var [key,handler] of  this.handlers) {
            var connectionDef = new ConnectionDef(this.component.def.id, key, this.component.def.id, key);
            this.component.getInputSocketByName(key).addListener(connectionDef, handler.bind(this.component));
        }
    }

    removeHandlers(target) {
        for (var [key,handler] of  this.handlers) {
            var connectionDef = new ConnectionDef(this.component.def.id, key, this.component.def.id, key);
            this.component.getInputSocketByName(key).removeListener(connectionDef);
        }
    }

    isEmpty() {
        return this.handlers.size === 0;
    }
}

export default SocketListenerBinder;