/**
 * Created by bartosz on 08.06.15.
 *
 * CommunicationFactory factory
 */

class CommunicationFactory {
    /**
     *
     * @param {Socket} inputSocket
     * @param {Socket} outputSocket
     * @param {ConnectionDef} connectionDef
     * @returns {function}
     */
    createConnection(inputSocket, outputSocket, connectionDef) {
        var inSocketDef = inputSocket.getSocketDef();
        //var outSocketDef = outputSocket.getSocketDef();

        if (!this.checkSocketsCompatibility(outputSocket, inSocketDef)) {
            throw Error(`Can't create connection between different socket types ${inSocketDef.type} & ${outputSocket.type}`);
        }

        if (connectionDef.isInverted()) {
            var invertedListener = function (data) {
                outputSocket.send(data);
            };

            inputSocket.addListener(connectionDef, invertedListener);
            return invertedListener;
        }

        var listener = function (data) {
            inputSocket.send(data);
        };
        outputSocket.addListener(connectionDef, listener);
        return listener;
    }

    /**
     * Check if two sockets are compatible
     *
     * @param outputSocket
     * @param inSocketDef
     * @returns {boolean}
     */
    checkSocketsCompatibility(outputSocket, inSocketDef) {
        const javaLangException = inSocketDef.type === 'pl.com.stream.next.plugin.database.pub.lib.communication.message.Id'
            || outputSocket.type == 'pl.com.stream.next.plugin.database.pub.lib.communication.message.Id';

        if (javaLangException) {
            return true;
        } else if (inSocketDef.type != outputSocket.type) {
            return false;
        }
        return true;
    }


}

export default new CommunicationFactory();