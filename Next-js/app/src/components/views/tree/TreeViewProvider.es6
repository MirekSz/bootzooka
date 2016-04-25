"use strict";
/**
 * Created by Mirek on 2015-08-18.
 */
import BaseViewProvider from '../BaseViewProvider';
const VIEW_SUFIX = '_TreeViewProvider';

class TreeViewProvider extends BaseViewProvider {
    constructor(id, columnModel, dataModel, controller) {
        super(id + VIEW_SUFIX, id, columnModel, dataModel, controller);
    }
}

export default TreeViewProvider;