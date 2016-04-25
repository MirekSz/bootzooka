/**
 * Created by bstanislawski on 2015-12-23.
 */
import DataSetDef from './DataSetDef';
class MetaDataSource {

    /**
     * @param {Array} dataSets
     */
    constructor(dataSets) {
        this.json = dataSets;
        this.dataSetDefList = new Map();

        dataSets.forEach(dataSet => {
            this.addDataSet(dataSet);
        });
    }

    /**
     * @param {Map} dataSetsList
     */
    setDataSetDefList(dataSetsList) {
        this.dataSetDefList = dataSetsList;
    }

    /**
     * @returns {Map|*} dataSetDefList
     */
    getDataSetDefList() {
        return this.dataSetDefList;
    }

    /**
     * @private
     *
     * @param {Object} dataSet
     */
    addDataSet(dataSet) {
        var dataSetDef = new DataSetDef(dataSet);

        this.dataSetDefList.set(dataSetDef.name, dataSetDef);
    }

}

export default MetaDataSource;