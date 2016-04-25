class ComponentsFactoryResult {


    constructor() {
        this.componentsMap = new Map();
        this.connectionsMap = {};
        //this.gridLocationMap = {};
    }

    /**
     *
     * @param {BaseRenderingComponent} component;
     */
    addComponent(id, component) {
        this.componentsMap.set(id, component);
    }

    /**
     *
     * @param {ConnectionDef} connectionDef
     * @param {function} listener
     */
    addConnection(connectionDef, listener) {
        var hashKey = connectionDef.getHashKeyMap();

        this.connectionsMap[hashKey] = listener;
    }

    /**
     *
     * @param {ConnectionDef} connectionDef
     * @return {function} listener
     */
    getConnection(connectionDef) {
        return this.connectionsMap[connectionDef.hashMapKey];
    }

    /**
     *
     * @returns {Map.<{String},{BaseRenderingComponent}>} componentsMap
     */
    getComponents() {
        return this.componentsMap;
    }

    /**
     *
     * @returns {BaseRenderingComponent}
     */
    getComponent(id) {
        return this.componentsMap.get(id);
    }

    /**
     *
     * @returns {Map} connectionsMap
     */
    getConnectionsMap() {
        return this.connectionsMap;
    }


}

export default ComponentsFactoryResult;