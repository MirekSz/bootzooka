"use strict";
/**
 * Created by Mirek on 2015-08-17.
 */

import _map from 'lodash/collection/map';
import * as mixin  from '../../../lib/Mixins';
import InMemorySearch from './InMemorySearch';
import ViewDataModel from '../ViewDataModel';


//ObservableMixin
class TreeDataModel extends ViewDataModel {

    constructor(columnModel, treeDataProvider, definition) {
        super(columnModel, treeDataProvider, definition);

        this.inMemorySearch = new InMemorySearch(this);
    }

    search(query) {
        this.inMemorySearch.search(query);
    }


    createRowId(obj) {
        var result;
        var typeId = this.definition.idNameToType.get(obj.idName);
        if (typeId) {
            var id = obj.id;
            result = {id, typeId, sourceNodeId: {id, typeId}};
        }
        return result;
    }


    getRowsData(rowIds) {
        var filters = setIdsFilterIfExist(this.dataProvider, rowIds);
        var selectedColumns = this.columnModel.getSelectedColumns();
        return this.dataProvider.getFlatData(selectedColumns, filters);
    }

    setFilteredData(nodes) {
        super.fireDataChangedListeners(nodes);
    }

    filterData(data) {
        if (this.inMemorySearch.isActive()) {
            return this.inMemorySearch.searchInModel(this.inMemorySearch.getQuery(), data);
        }
        return data;
    }

}


function setIdsFilterIfExist(treeDataProvider, rows) {
    var filters = [];
    if (rows.length > 0) {
        var def = treeDataProvider.def;
        var filterName = def.nodeTypeToFilter.get(rows[0].sourceNodeId.typeId);
        var treeFilter = treeDataProvider.createTreeFilter(filterName);

        var rowIds = _map(rows, (row)=> {
            return row.id;
        });

        treeFilter.setValue(rowIds);
        filters.push(treeFilter);
    }
    return filters;
}
mixin.applyMixin(mixin.ObservableMixin, TreeDataModel);
export default TreeDataModel;