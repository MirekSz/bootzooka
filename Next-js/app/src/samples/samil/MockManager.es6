/**
 * Created by bstanislawski on 2015-12-11.
 */
import request from 'superagent';

import metaDataSourceFactory from '../../vedas/MetaDataSource/MetaDataSourceFactory';

class MockManager {

    getXML(url) {
        return new Promise((resolve, reject) => {
            var req = request.get(url);
            req.end(function (err, res) {
                resolve(res);
            });
        });
    }

    getObject(URL, options) {
        return new Promise((resolve, reject) => {
            var req = request.get(URL);
            req.end(function (err, res) {
                if (options) {
                    var result = options.postSendCallback(res);

                    resolve(result);
                } else {
                    var response = metaDataSourceFactory.createMetaDataSource(res.text);

                    resolve(response);
                }
            });
        });
    }
}

export default new MockManager();
