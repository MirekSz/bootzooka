"use strict";
/**
 * Created by Mirek on 2015-08-17.
 */
import {IdInfosPublisher} from '../../../../lib/EventBus';
import _each from 'lodash/collection/each';
import _map from 'lodash/collection/map';
import TreeViewProvider from './../TreeViewProvider';
import KendoColumnRendererRegistry from './KendoColumnRendererRegistry';
class KendoUITree extends TreeViewProvider {

    constructor({id,columnModel, dataModel,controller}) {
        super(id, columnModel, dataModel, controller);
    }

    render(target, columns, rows) {
        this.dataSource = prepareDataSource(rows, this);
        this.configComponent(target, columns);
    }

    selectRow(id) {
        var element = this.dataSource.get(id);
        var uid = element.uid;
        var tr = $(`tr[data-uid=${uid}]`);
        var tree = $(this.localTarget).data("kendoTreeList");
        tree.select($(tr));
    }

    configComponent(target, columns) {
        this.localTarget = target;
        var self = this;
        this.tree = target.kendoTreeList({
            dataSource: this.dataSource,
            expanded: true,
            height: 500,
            selectable: "row",
            reorderable: true,
            resizable: true,
            navigatable: true,
            change: function () {
                var selectedRows = this.select();
                if (selectedRows.length > 1) {
                    var ids = _map(selectedRows, (row)=> {
                        var dataItem = this.dataItem(row);
                        return {
                            id: dataItem.sourceNodeId,
                            parentId: dataItem.sourceParentId
                        };
                    });
                    self.rowsSelected(ids);
                } else {
                    var dataItem = this.dataItem(selectedRows[0]);
                    self.rowSelected({
                        id: dataItem.sourceNodeId,
                        parentId: dataItem.sourceParentId
                    });
                }
            },
            columnReorder: function (e) {
                self.columnReorder(e.column.field, e.newIndex);
            },
            columnResize: function (e) {
                self.columnResize(e.column[0].field, e.newWidth);
            },
            columns: columnsToShow(columns)
        });
    }


    refreshAll(rows) {
        this.dataSource.data(rows);
    }

    refreshRows(rows) {
        applyDataOnModel(rows, this);
    }

    disposeImpl() {
        super.disposeImpl();
        super.destroyKendoComponent(this.target);
    }

}

function prepareDataSource(data, component) {
    var columnModel = component.columnModel;
    var options = {
        transport: {
            read: function (options) {
                options.success(data);
            }
        },
        serverFiltering: true,
        serverPaging: true,
        serverSorting: true
    };

    if (columnModel.getDefaultOrder()) {
        options.sort = {
            field: columnModel.getDefaultOrder(),
            dir: "asc"
        };
    }
    return new kendo.data.TreeListDataSource(options);
}

function columnsToShow(columnsDef) {
    var allColumns = [];
    var modApplayed = false;
    _each(columnsDef, (columnDef)=> {
        var col = {
            field: columnDef.idFix,
            title: columnDef.label
        };
        if (!columnDef.hints.visible) {
            col.hidden = true;
        }
        if (!col.hidden && !modApplayed) {
            addModifiedIconWhenDataChange(col, columnDef);
            modApplayed = true;
        }
        if (KendoColumnRendererRegistry.hasRenderer(columnDef.domainName)) {
            var template = KendoColumnRendererRegistry.getColumnTemplate(columnDef.domainName, columnDef.idFix);
            col.template = template;
        }
        allColumns.push(col);
    });

    return allColumns;
}

function applyDataOnModel(modifiedRows, view, dataSource = view.dataSource) {
    for (let [key, value] of modifiedRows) {
        try {
            var rowInTree = dataSource.get(key);
            if (value.op === IdInfosPublisher.DELETED) {
                dataSource.remove(rowInTree);
                continue;
            }
            if (value.op === IdInfosPublisher.ADDED) {
                rowInTree = dataSource.insert(0, value);
                view.selectRow(rowInTree.id);
                continue;
            }
            for (var prop in value) {
                if (value.hasOwnProperty(prop)) {
                    rowInTree.set(prop, value[prop]);
                }
            }
            view.selectRow(rowInTree.id);
        } catch (e) {
            console.warn(e);
        }
    }
}

function addModifiedIconWhenDataChange(col, columnDef) {
    col.template = `#if(data.op==='UPDATED'){#
                    <span class="glyphicon glyphicon-pencil"></span> #: data.${columnDef.idFix}#
                #}else if(data.op==='ADDED'){#
                     <span class="glyphicon glyphicon-plus"></span> #: data.${columnDef.idFix}#
                #} else {#
                    #= data.${columnDef.idFix}?data.${columnDef.idFix}:''#
                #}#`;
}
export default KendoUITree;