/**
 * Created by bstanislawski on 2016-01-05.
 */
import DataSource from './DataSource';
import DataSet from './DataSet';
class DataSourceFactory {

    /**
     * @param {MetaDataSource} metaDataSource
     * @param {Map} extensions
     * @returns {DataSource}
     */
    createDataSource(metaDataSource, extensions) {
        var dataSource = new DataSource(metaDataSource);
        var dataSetSources = dataSource.getDataSetSources();
        for (var i = 0; i < dataSetSources.length; i++) {
            var obj = dataSetSources[i];
            var dataSet = this.createDataSet(obj, extensions);
            dataSource.addDataSet(dataSet);
        }
        return dataSource;
    }

    /**
     * @private
     * @param {Map} extensions
     * @param {Object} dataSetSource
     */
    createDataSet(dataSetSource, extensions) {
        var dataSet = new DataSet(dataSetSource);
        return dataSet;
    }

}

export default new DataSourceFactory();
