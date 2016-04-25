"use strict";
/**
 * Created by Mirek on 2016-03-30.
 */
import ServerConnector from '../lib/ServerConnector';
import GlobalEnums from '../enums/GlobalEnums';
const FIND_TYPE_ENUM_CLASS = 'pl.com.stream.next.asen.common.enums.FindRequestTypeEnum';
export class LogicalLockService {
    constructor() {
        this.serviceName = 'pl.com.stream.next.asen.server.logicalLocks.LogicalLocksService';
    }


    addLogicalLock(dtoClass, id, findRequestTypeEnum) {
        var methodName = 'addLogicalLock';
        var serverServiceInterface = this.serviceName;
        var parametersList = [dtoClass, [GlobalEnums.JAVA_TYPES.LONG, id], [FIND_TYPE_ENUM_CLASS, findRequestTypeEnum]];
        return ServerConnector.executeCommand({serverServiceInterface, methodName, parametersList});
    }

    removeLogicalLock(dtoClass, id) {
        var methodName = 'removeLogicalLock';
        var serverServiceInterface = this.serviceName;
        var parametersList = [dtoClass, [GlobalEnums.JAVA_TYPES.LONG, id]];
        return ServerConnector.executeCommand({serverServiceInterface, methodName, parametersList});
    }

}

class ServerCacheService {
    constructor() {
        this.serviceName = 'pl.com.stream.next.asen.server.util.ServerCache';
    }

    /**
     *
     * @param dtoClass
     * @param id
     * @returns {Promise.<Array>}
     */
    getLogicalLocks(dtoClass, id) {
        var methodName = 'getLogicalLocks';
        var serverServiceInterface = this.serviceName;
        var parametersList = [dtoClass, [GlobalEnums.JAVA_TYPES.STRING, id]];
        const promise = ServerConnector.executeCommand({serverServiceInterface, methodName, parametersList});
        return promise.then((response)=> {
            return response[1];
        });

    }
}

export let serverCacheService = new ServerCacheService();
export let logicalLockService = new LogicalLockService();

export const FIND_TYPE = {
    FOR_SHOW: 'FOR_SHOW',
    FOR_EDIT: 'FOR_EDIT',
    FOR_DELETE: 'FOR_DELETE'
};

