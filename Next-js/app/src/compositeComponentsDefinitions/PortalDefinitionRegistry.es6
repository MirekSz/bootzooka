/**
 * Created by Bartek on 2015-09-29.
 */
import serverConnector from '../lib/ServerConnector';
import PortalDef from './PortalDef';
import PortalActionDef from './PortalActionDef';

const PERSPECTIVE_URL = '/portal';
const PERSPECTIVE_BY_ID_URL = '/portal/byId';
const PERSPECTIVE_BY_NAME = '/portal/byName';
const PERSPECTIVE_CRUD_URL = '/portal/';

class PortalDefinitionRegistry {

    constructor() {
        this.optionsCache = new Map();
    }

    /**
     *
     * @promise {Array.<ActionComponentDef>}
     */
    getPortal(query) {
        return serverConnector.getListOfObject(PERSPECTIVE_URL, {query: query}, this.portalDefPostSendConverter);
    }

    /**
     *
     * @promise {PortalDef}
     */
    getPortalById(id) {
        return serverConnector.getObject(PERSPECTIVE_BY_ID_URL, {id: id}, this.portalByIdDefPostSendConverter);
    }


    /**
     * @param {PortalDef} portalDef
     */
    add(portalDef) {
        this.optionsCache.set(portalDef.id, portalDef);
        return serverConnector.post(PERSPECTIVE_CRUD_URL, portalDef, this.portalDefPreSendConverter);
    }

    /**
     * @param {PortalDef} portalDef
     */
    update(portalDef) {
        this.optionsCache.set(portalDef.id, portalDef);
        return serverConnector.put(PERSPECTIVE_CRUD_URL, portalDef, this.portalDefPreSendConverter);
    }

    /**
     * @param {PortalDef} portalDef
     */
    updatePortal(portal) {
        this.optionsCache.set(portal.id, portal);
        return serverConnector.put(PERSPECTIVE_CRUD_URL, portal);
    }

    /**
     * @returns {Promise}
     */
    remove(id) {
        this.optionsCache.delete(id);
        return serverConnector.remove(PERSPECTIVE_BY_ID_URL, {id});
    }


    /**
     * Portal pre send Converter
     *
     * @param data
     * @return {object} request body
     */
    portalDefPreSendConverter(data) {
        var definitionMap = data.actionDefMap;
        var actions = [];

        for (var value of definitionMap.values()) {
            actions.push({
                id: value.id,
                name: value.optionDef.name,
                optionId: value.optionDef.id,
                groupName: value.group
            });
        }

        return {
            actions: actions,
            id: data.id,
            name: data.name
        };
    }

    portalDefPostSendConverter(portalElement) {
        return new PortalDef({
            id: portalElement.id,
            name: portalElement.name
        });
    }

    portalByIdDefPostSendConverter(data) {
        return data;
    }

}

export default new PortalDefinitionRegistry();