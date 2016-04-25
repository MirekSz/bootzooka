"use strict";
/**
 * Created by Mirek on 2016-01-20.
 */
import ServerConnector from '../lib/ServerConnector';
class ClientDataSetService {
    constructor(serviceName, dtoName, flagsName) {
        this.serviceName = serviceName;
        this.dtoClass = dtoName ? dtoName : serviceName.replace('Service', 'Dto');
        this.flagsClass = flagsName ? flagsName : serviceName.replace('Service', 'Flags');
    }

    getDef() {
        var methodName = 'getDef';
        var serverServiceInterface = this.serviceName;

        var promise = ServerConnector.executeCommand({serverServiceInterface, methodName});
        return new Promise((resolve, reject)=> {
            promise.then((data, error)=> {
                if (error) {
                    reject(error);
                }
                resolve(data);
            });
        });
    }

    processFlags(fields, flags) {
        flags['@class'] = this.flagsClass;
        var methodName = 'process';
        var serverServiceInterface = 'pl.com.stream.next.asen.common.communication.ws.FlagsProcessorService';
        var parametersList = [["[Ljava.lang.String;", fields], flags];
        return ServerConnector.executeCommand({serverServiceInterface, methodName, parametersList});
    }


    init(dto) {
        dto['@class'] = this.dtoClass;
        var methodName = 'init';
        var serverServiceInterface = this.serviceName;
        var parametersList = [dto];
        var computeFlags = 'true';
        return ServerConnector.executeCommand({serverServiceInterface, methodName, parametersList, computeFlags}, true);
    }

    prepare(dto) {
        dto['@class'] = this.dtoClass;
        var methodName = 'prepare';
        var serverServiceInterface = this.serviceName;
        var parametersList = [dto];
        var computeFlags = 'true';
        return ServerConnector.executeCommand({serverServiceInterface, methodName, parametersList, computeFlags}, true);
    }

    execute(dto) {
        var passExceptionClass = 'pl.com.stream.next.asen.common.exceptions.client.BeanValidationException';
        dto['@class'] = this.dtoClass;
        var methodName = 'execute';
        var serverServiceInterface = this.serviceName;
        var parametersList = [dto];
        var computeFlags = 'false';
        return ServerConnector.executeCommand({
            serverServiceInterface,
            methodName,
            parametersList,
            passExceptionClass,
            computeFlags
        }, true);
    }

    find(id) {
        var methodName = 'find';
        var serverServiceInterface = this.serviceName;
        var parametersList = [["java.lang.Long", id]];
        return ServerConnector.executeCommand({serverServiceInterface, methodName, parametersList}).then((data)=> {
            console.log('find: ');
            console.log(data);
        });
    }

    calculateFlags(dto) {
        dto['@class'] = this.dtoClass;
        var methodName = 'calculateFlags';
        var serverServiceInterface = this.serviceName;
        var parametersList = [dto];
        return ServerConnector.executeCommand({serverServiceInterface, methodName, parametersList});
    }

    calculateDto(dto, fieldName) {
        dto['@class'] = this.dtoClass;
        var methodName = 'calculateDto';
        var serverServiceInterface = this.serviceName;
        var parametersList = [dto, [
            "java.lang.String", fieldName
        ]];
        var computeFlags = 'true';
        return ServerConnector.executeCommand({serverServiceInterface, methodName, parametersList, computeFlags}, true);
    }

    validateDto(dto) {
        var passExceptionClass = 'pl.com.stream.next.asen.common.exceptions.client.BeanValidationException';
        dto['@class'] = this.dtoClass;
        var methodName = 'validate';
        var serverServiceInterface = this.serviceName;
        var parametersList = [dto];
        return ServerConnector.executeCommand({
            serverServiceInterface,
            methodName,
            parametersList,
            passExceptionClass
        }, true);
    }


}

export default ClientDataSetService;
