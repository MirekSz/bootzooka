/**
 * Created by bartosz on 20.05.15.
 *
 * Socket class
 */
class Socket {
    constructor(socketDef) {
        this.name = socketDef.name;
        this.type = socketDef.type;
        this.listeners = [];
        this.connectionDefToListener = {};
        this.socketDef = socketDef;
    }


    send(data) {
        this.setLastEvent(data);
        if (this.delayed) {
            if (!this.delayer) {
                this.startDelayer();
            }
        } else {
            this.sendDataToListeners(data);
        }
    }

    isReady() {
        if (this.socketDef.required) {
            return this.lastEvent !== undefined;
        }
        return true;
    }


    /**
     *@private
     **/
    startDelayer() {
        this.delayer = {runs: true};
        setTimeout(()=> {
            this.sendDataToListeners(this.lastEvent);
            this.delayer = undefined;
        }, DEFAULT_SOCKET_DELAY);
    }

    /**
     *@private
     **/
    sendDataToListeners(data) {
        if (this.listeners.length > 0) {
            for (var i = 0; i < this.listeners.length; i++) {
                var listener = this.listeners[i];
                listener(data, this.socketDef);
            }
        }
    }

    /**
     *
     * @param {ConnectionDef} connectionDef
     * @param {Function} listener
     */
    addListener(connectionDef, listener) {
        var hash = connectionDef.getHashKeyMap();
        var currentListener = this.connectionDefToListener[hash];
        if (currentListener) {
            throw Error(`Socket ${this.name} already has connection ${hash} `);
        }
        this.connectionDefToListener[hash] = listener;
        this.listeners.push(listener);
    }

    /**
     *
     * @param {Function} listener
     */
    addDynamicListener(listener) {
        var hash = listener.name;
        var currentListener = this.connectionDefToListener[hash];
        if (currentListener) {
            throw Error(`Socket ${this.name} already has connection ${hash} `);
        }
        this.connectionDefToListener[hash] = listener;
        this.listeners.push(listener);
    }

    /**
     *
     * @param {ConnectionDef} connectionDef
     */
    removeListener(connectionDef) {
        var hash = connectionDef.getHashKeyMap();
        var currentListener = this.connectionDefToListener[hash];

        this.connectionDefToListener[hash] = null;
        var index = this.listeners.indexOf(currentListener);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }


    setLastEvent(data) {
        this.lastEvent = data;
    }

    getLastEvent() {
        return this.lastEvent;
    }

    /**
     *
     * @returns {SocketDef}
     */
    getSocketDef() {
        return this.socketDef;
    }


}
export const DEFAULT_SOCKET_DELAY = 400;
export default Socket;