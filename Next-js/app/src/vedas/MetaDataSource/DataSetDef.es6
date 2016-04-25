/**
 * Created by bstanislawski on 2015-12-23.
 */
import FieldDef from './FieldDef';

class DataSetDef {

    /**
     * @param {Object} dataSetSource
     */
    constructor(dataSetSource) {
        this.name = dataSetSource.name;
        this.source = dataSetSource;
        this.fieldDefList = [];

        var fieldDefMap = dataSetSource.fieldDefMap;

        for (var fieldName in fieldDefMap) {
            if (fieldDefMap.hasOwnProperty(fieldName)) {
                var fieldData = fieldDefMap[fieldName];

                this.addField(fieldData, fieldName);
            }
        }
    }

    /**
     * @param {String} name
     */
    setName(name) {
        this.name = name;
    }

    /**
     * @returns {String|*} name
     */
    getName() {
        return this.name;
    }

    /**
     * @param {FieldDef} fieldDefList
     */
    setFieldDefList(fieldDefList) {
        this.fieldDefList = fieldDefList;
    }

    /**
     * @returns {Array|*} fieldDefList
     */
    getFieldDefList() {
        return this.fieldDefList;
    }

    /**
     * @private
     *
     * @param {Object} fieldData
     * @param {String} fieldName
     */
    addField(fieldData, fieldName) {
        var fieldDef = new FieldDef(fieldData);

        fieldDef.id = fieldName;

        this.fieldDefList.push(fieldDef);
    }

    /**
     * @param {String} name
     * @returns {FieldDef}
     */
    getFieldByName(name) {
        var result;

        this.fieldDefList.forEach(fieldDef => {
            if (fieldDef.name === name) {
                result = fieldDef;
            }
        });

        return result;
    }

}

export default DataSetDef;