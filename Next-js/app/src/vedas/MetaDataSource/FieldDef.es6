/**
 * Created by bstanislawski on 2015-12-16.
 */

class FieldDef {

    /**
     * @param {Object} fieldData
     */
    constructor(fieldData) {
        this.name = fieldData.name;
        this.type = fieldData.type;
        this.domainName = fieldData.domainName;
    }

    /**
     * @returns {String} name
     */
    getName() {
        return this.name;
    }

    /**
     * @returns {String} type
     */
    getType() {
        return this.type;
    }

    /**
     * @returns {String} domainName
     */
    getDomainName() {
        return this.domainName;
    }

}

export default FieldDef;