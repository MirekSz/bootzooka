/**
 * Created by bstanislawski on 2016-01-05.
 */
import mockManager from '../../samples/samil/MockManager';

const URL = './app/src/samples/samil/def.json';

class DataSourceRegistry {

    getDataSource(query, url) {
        if (!url) url = URL;

        return mockManager.getObject(url, {query: query, postSendCallback: this.createDataSource});
    }

    createDataSource(response) {
        return JSON.parse(response.text);
    }

}

export default new DataSourceRegistry();
