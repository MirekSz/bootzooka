"use strict";
/**
 * Created by Mirek on 2015-08-17.
 */

import {eventBus, events,IdInfosPublisher} from '../../lib/EventBus';
import * as mixin  from '../../lib/Mixins';

/**
 * @mixes {ObservableMixin}
 */
class ViewDataModel {

    constructor(columnModel, dataProvider, definition) {
        this.columnModel = columnModel;
        this.dataProvider = dataProvider;
        this.definition = definition;

        this.addIdInfosListener();
        this.addColumnModelListener();

        mixin.mixinInitializer(this, {
            listenerValidator: function (listener) {
                if (!listener.dataChanged || !listener.rowsRefresh) {
                    throw new Error('Illegal listener structure');
                }
            }
        });
        if (!this.listeners) {
            throw new Error('You need apply ObservableMixin to use this class');
        }
    }


    /**
     *@private
     **/
    clearCurrentModel() {
        this.sourceData = null;
    }

    search(query) {
        console.log('search: ');
        console.log(query);
    }

    /**
     *@private
     **/
    addIdInfosListener() {
        this.listener = (data)=> {
            this.fireIdInfoChange(data);
        };
        eventBus.addListener(events.VIEW.ID_INFOS, this.listener);
    }

    fireIdInfoChange(data) {
        var refreshRows = [];
        for (var i = 0; i < data.length; i++) {
            var obj = data[i];
            var row = this.createRowId(obj);
            if (row) {
                row.op = obj.op;
                refreshRows.push(row);
            }
        }
        if (refreshRows.length > 0) {
            this.refresh(refreshRows);
            console.log('Fire IdInfosListener: ');
            console.log(refreshRows);
        }
    }

    /**
     * @protected
     * @param {Array} idInfoData
     */
    createRowId(idInfoData) {
        return [];
    }


    /**
     *@private
     **/
    addColumnModelListener() {
        this.columnModelListener = ()=> {
            this.clearCurrentModel();
        };
        this.columnModel.addListener(this.columnModelListener);
    }

    /**
     * @private
     * @param rowIds
     */
    refresh(rowIds) {
        if (rowIds !== undefined && !(rowIds instanceof Array)) {
            throw Error('RowIds should be an array');
        }
        var self = this;

        var deleted = this.removeDeletedAndModified(rowIds);
        var operationMap = this.createOperationMap(rowIds);

        if (rowIds.length > 0) {
            var viewData = this.getRowsData(rowIds);
            viewData.then(function (data) {
                self.recreateOperationState(data, operationMap);
                data = data.concat(deleted);
                if (data.length > 0) {
                    self.refreshCurrentData(data);
                    fireRefreshListeners(data, self.listeners);
                }
            });
        } else if (deleted.length > 0) {
            self.refreshCurrentData(deleted);
            fireRefreshListeners(deleted, self.listeners);
        }

    }

    /**
     *@private
     **/
    recreateOperationState(rows, operationMap) {
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            row.op = operationMap.get(row.id);
        }
    }

    /**
     *@private
     **/
    createOperationMap(rowIds) {
        var map = new Map();
        for (var i = 0; i < rowIds.length; i++) {
            var obj = rowIds[i];
            map.set(obj.id, obj.op);
        }
        return map;
    }

    /**
     *@private
     **/
    removeDeletedAndModified(rowIds) {
        var deleted = [];
        for (var i = 0; i < rowIds.length; i++) {
            var obj = rowIds[i];
            if (obj.op === IdInfosPublisher.DELETED || obj.op === IdInfosPublisher.MODIFIED) {
                deleted.push(obj);
                rowIds.splice(rowIds.indexOf(obj), 1);
            }
        }
        return deleted;
    }

    /**
     * @param {Array} rowIds
     * @returns {Promise}
     */
    getRowsData(rowIds) {

    }

    /**
     * @private
     *
     * @returns {Promise}
     */
    fetch({query, orderBy, orderByDir, start = 0, take = 10, invokeListeners = true}) {
        var self = this;
        return new Promise((resolve) => {
            var selectedColumns = this.columnModel.getSelectedColumns();

            var viewData = this.dataProvider.getFlatData(selectedColumns, []);

            viewData.then((data)=> {
                self.setCurrentData(data);
                var rows = this.filterData(data);
                if (invokeListeners) {
                    fireDataChangedListenersImpl(rows, self.listeners);
                }
                resolve(rows);
            });
        });
    }

    refreshAll() {
        return this.fetch({});
    }

    filterData(data) {
        return data;
    }

    /**
     *@private
     **/
    setCurrentData(data, createNewMap = true) {
        if (!this.sourceData || createNewMap) {
            this.sourceData = new Map();
        }
        for (var i = 0; i < data.length; i++) {
            var obj = data[i];
            if (obj.op === IdInfosPublisher.DELETED) {
                this.sourceData.delete(obj.id);
                continue;
            }
            var element = this.sourceData.get(obj.id);
            if (element) {
                var childrenIds = element.childrenIds;
                obj.childrenIds = childrenIds;
            }
            this.sourceData.set(obj.id, obj);
        }
    }


    getCurrentData() {
        var res = [];
        for (let value of this.sourceData.values()) {
            res.push(value);
        }
        return res;
    }

    /**
     *@private
     **/
    refreshCurrentData(data) {
        this.setCurrentData(data, false);
    }

    /**
     *@private
     **/
    dispose() {
        eventBus.remove(events.VIEW.ID_INFOS, this.listener);
        this.removeAllListeners();
        this.columnModel.removeAllListeners();
    }

    fireDataChangedListeners(rows) {
        fireDataChangedListenersImpl(rows, this.listeners);
    }
}

function fireRefreshListeners(nodes, modelListeners) {
    var map = createModifiedMap(nodes);
    for (var listener of modelListeners) {
        listener.rowsRefresh(map);
    }
}

function fireDataChangedListenersImpl(nodes, modelListeners) {
    for (var listener of modelListeners) {
        listener.dataChanged(nodes);
    }
}

function createModifiedMap(nodes) {
    var map = new Map();
    for (var i = 0; i < nodes.length; i++) {
        var obj = nodes[i];
        obj.modified = true;
        map.set(obj.id, obj);
    }
    return map;
}
export default ViewDataModel;