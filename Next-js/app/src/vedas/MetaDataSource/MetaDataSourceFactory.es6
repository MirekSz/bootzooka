/**
 * Created by bstanislawski on 2015-12-23.
 */
import MetaDataSource from './MetaDataSource';

class MetaDataSourceFactory {

    /**
     *
     * @param {Array|DataSet} dataSets
     * @returns {MetaDataSource}
     */
    createMetaDataSource(dataSets) {
        return new MetaDataSource(dataSets);
    }

}

export default new MetaDataSourceFactory();