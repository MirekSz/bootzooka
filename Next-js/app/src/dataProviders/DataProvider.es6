"use strict";
/**
 * Created by Mirek on 2015-07-27.
 */
import TreeDataProvider from './TreeDataProvider';

class DataProvider {

    /**
     * @param {String} id
     * @returns {TreeDataProvider}
     */
    getTreeProvider(id) {
        return new TreeDataProvider({id});
    }

}

export default new DataProvider();