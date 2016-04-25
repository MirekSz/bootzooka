/**
 * Created by bstanislawski on 2015-12-23.
 */
class DataSource {

    /**
     * @param {MetaDataSource} metaDataSource
     */
    constructor(metaDataSource) {
        this.metaDataSource = metaDataSource;
        this.dataSetList = new Map();

        var source = metaDataSource.json; //array

    }

    /**
     * @returns {Array}
     */
    getDataSetSources() {
        return this.metaDataSource.json;
    }


    /**
     * @returns {Map} dataSetList
     */
    getDataSetList() {
        return this.dataSetList;
    }

    /**
     *
     * @param {DataSet} dataSet
     */
    addDataSet(dataSet) {
        this.dataSetList.set(dataSet.name, dataSet);
    }


}

export default DataSource;