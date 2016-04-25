/**
 * Created by bartosz on 20.05.15.
 *
 * Connection Definition class
 */
import ObjectKeyGenerator from '../lib/ObjectKeyGenerator';
import assertions from '../lib/Assertions';

class ConnectionDef {
    /**
     *
     * @param {string} senderId
     * @param {string} senderSocketId
     * @param {string} receiverId
     * @param {string} receiverSocketId
     */
    constructor(senderId, senderSocketId, receiverId, receiverSocketId) {
//        if ('pl.com.stream.verto.cmm.plugin.unit-client.UnitView' === senderId) {
//            debugger;
//        }
        this.senderId = senderId;
        this.senderSocketId = senderSocketId;

        this.receiverId = receiverId;
        this.receiverSocketId = receiverSocketId;
        this.inverted = false;

        assertions.required(this.senderId, this.senderSocketId, this.receiverId, this.receiverSocketId);
    }

    /**
     *
     * @return {string}
     */
    getOutputId() {
        return this.senderId;
    }

    /**
     *
     * @return {string}
     */
    getOutputSocketName() {
        return this.senderSocketId;
    }

    /**
     *
     * @return {string}
     */
    getInputId() {
        return this.receiverId;
    }

    /**
     *
     * @return {string}
     */
    getInputSocketName() {
        return this.receiverSocketId;
    }

    /**
     *
     * @return {JSON}
     */
    getHashKeyMap() {
        return ObjectKeyGenerator.generate(this);
    }

    getName() {
        return ObjectKeyGenerator.generate(this);
    }

    /**
     * Connect input to output.
     * Stadarw way output to input
     */
    setInverted() {
        this.inverted = true;
    }

    isInverted() {
        return this.inverted;
    }
}

export default ConnectionDef;