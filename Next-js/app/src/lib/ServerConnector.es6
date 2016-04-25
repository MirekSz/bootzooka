/**
 * Created by Mirek on 2015-06-11.
 */
import request from 'superagent';
import {eventBus, events,IdInfosPublisher} from '../lib/EventBus';

const APP_URL = '/next-www-blc';
const FACADE = '/facade';

/**
 *@private
 **/
function handleError(error, reject) {
    if (error.response) {
        var errorText;

        if (error.response.statusCode === 401) {
            errorText = error.response.status + ', ' + 'please log in again.';

            eventBus.send(events.GLOBAL_EVENT.LOGOUT);
        } else if (error.timeout) {
            errorText = 'Error ' + 'Request timeout: ' + error.timeout;
        } else {
            errorText = error.response.status + ', ' + 'check console for more info...';
        }

        eventBus.send(events.GLOBAL_EVENT.SHOW_ERROR, errorText);
    } else {
        eventBus.send(events.GLOBAL_EVENT.SHOW_ERROR, error.message ? error.message : error.detailMessage);
    }
    eventBus.send(events.GLOBAL_EVENT.ASYNCH_END);
    if (reject) {
        reject(error);
    } else {
        throw error;
    }
}

class ServerConnector {

    constructor() {
    }

    /**
     * Method to execute command on the Facade
     *
     * @param options
     * @param options.serverServiceInterface
     * @param options.methodName
     * @param options.parametersList
     * @param options.computeFlags
     * @param options.passExceptionClass
     * @param returnRawResponse
     * @returns {Promise}
     */
    executeCommand(options, returnRawResponse) {
        var promise = this.post(FACADE, options);
        return new Promise((resolve, reject)=> {
            promise.then((data, error)=> {
                if (error || data.success === false) {
                    if (data.success === false) {
                        reject(data.response.responseObject);
                    } else {
                        reject(error);
                    }
                    return;
                }
                if (returnRawResponse) {
                    resolve(data.response);
                } else {
                    resolve(data.response.responseObject);
                }
            });
        }).catch(function (err) {
            var pass = false;
            try {
                if (err.asenException['@class'] === options.passExceptionClass) {
                    pass = true;
                }
            } catch (e) {
            }
            if (pass) {
                throw err;
            }
            if (!pass) {
                handleError(err);
            }
        });
    }

    /**
     * Method to execute query on the Facade
     *
     * @param options
     * @returns {Promise}
     */
    executeQuery(options) {
        return this.post(FACADE, {
            methodName: options.methodName,
            serverServiceInterface: options.serverServiceInterface,
            parametersList: options.parametersList
        });
    }

    /**
     *
     * @param url
     * @param data
     * @param {function} elementConverter
     * @returns {Promise}
     */
    getListOfObject(url, data, elementConverter) {
        eventBus.send(events.GLOBAL_EVENT.ASYNCH_START);
        return new Promise((resolve, reject) => {
                const fullUrl = APP_URL + url;
                var req = request.get(fullUrl);
                this.setTimeout(req);
                req.set('Accept', 'application/json').query(data).end(function (error, res) {
                    if (error) {
                        handleError(error, reject);
                    } else {
                        if (elementConverter) {
                            var result = self.convertResultList(res.body, elementConverter);
                            resolve(result);
                        } else {
                            resolve(res.body);
                        }
                    }
                    eventBus.send(events.GLOBAL_EVENT.ASYNCH_END);
                });
                var self = this;
            }
        );
    }

    /**
     *
     * @param url
     * @param data
     * @param {function} elementConverter
     * @returns {Promise}
     */
    getObject(url, data, elementConverter) {
        eventBus.send(events.GLOBAL_EVENT.ASYNCH_START);
        return new Promise((resolve, reject) => {
            const fullUrl = APP_URL + url;
            var req = request.get(fullUrl);
            this.setTimeout(req);
            req.set('Accept', 'application/json').query(data).end(function (err, res) {
                if (err) {
                    handleError(err, reject);
                } else {
                    resolve(elementConverter(res.body));
                }
                eventBus.send(events.GLOBAL_EVENT.ASYNCH_END);
            });
        });
    }

    /**
     *
     * @param url
     * @param data
     * @param preSendConverter
     * @returns {Promise}
     */
    post(url, data, preSendConverter) {
        var self = this;
        eventBus.send(events.GLOBAL_EVENT.ASYNCH_START);
        return new Promise((resolve, reject) => {
            const fullUrl = APP_URL + url;
            var req = request.post(fullUrl);
            this.setTimeout(req);

            if (preSendConverter) {
                data = preSendConverter(data);
            }

            req.set('Accept', 'application/json; charset=utf-8').send(data).end(function (err, res) {
                setTimeout(()=> {
                    if (err) {
                        handleError(err, reject);
                    } else {
                        eventBus.send(events.GLOBAL_EVENT.POST_DONE, res.body);

                        resolve(res.body);
                        self.handleIdInfos(res.body);
                    }
                    eventBus.send(events.GLOBAL_EVENT.ASYNCH_END);
                }, 100);
            });
        });
    }

    handleIdInfos(response) {
        var idInfosForClient = response.idInfosForClient;
        if (idInfosForClient && idInfosForClient.length > 0) {
            IdInfosPublisher.publish(idInfosForClient);
        }
    }

    /**
     *
     * @param url
     * @param data
     * @returns {Promise}
     */
    get(url, data) {
        eventBus.send(events.GLOBAL_EVENT.ASYNCH_START);
        return new Promise((resolve, reject) => {
            const fullUrl = APP_URL + url;
            var req = request.get(fullUrl);
            this.setTimeout(req);
            req.set('Accept', 'application/json').query(data).end(function (err, res) {
                if (err) {
                    handleError(err, reject);
                } else {
                    resolve(res.body);
                }
                eventBus.send(events.GLOBAL_EVENT.ASYNCH_END);
            });
        });
    }

    /**
     *
     * @param url
     * @param data
     * @param preSendConverter
     *
     * @returns {Promise}
     */
    put(url, data, preSendConverter) {
        eventBus.send(events.GLOBAL_EVENT.ASYNCH_START);
        return new Promise((resolve, reject) => {
            const fullUrl = APP_URL + url;
            var req = request.put(fullUrl);
            this.setTimeout(req);

            if (preSendConverter) {
                data = preSendConverter(data);
            }

            req.set('Accept', 'application/json').send(data).end(function (err, res) {
                if (err) {
                    handleError(err, reject);
                } else {
                    resolve(res.body);
                }
                eventBus.send(events.GLOBAL_EVENT.ASYNCH_END);
            });
        });
    }

    /**
     *
     * @param url
     * @param data
     * @returns {Promise}
     */
    remove(url, data) {
        eventBus.send(events.GLOBAL_EVENT.ASYNCH_START);
        return new Promise((resolve, reject) => {
            const fullUrl = APP_URL + url;
            var req = request.del(fullUrl);
            this.setTimeout(req);
            req.set('Accept', 'application/json').query(data).end(function (err, res) {
                if (err) {
                    handleError(err, reject);
                } else {
                    resolve(res.body);
                }
                eventBus.send(events.GLOBAL_EVENT.ASYNCH_END);
            });
        });
    }

    /**
     * @param data
     * @param elementConverter
     * @returns {Array}
     */
    convertResultList(data, elementConverter) {
        var result = [];

        for (var i = 0; i < data.length; i++) {
            var obj = data[i];
            var converted = elementConverter(obj);
            result.push(converted);
        }

        return result;
    }

    setTimeout(request) {
        request.timeout(10000);
    }

}


export default new ServerConnector();
