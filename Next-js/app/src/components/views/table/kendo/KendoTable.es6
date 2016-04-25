"use strict";
/**
 * Created by Mirek on 2015-08-17.
 */
import _each from 'lodash/collection/each';
import _map from 'lodash/collection/map';
import _partialRight from 'lodash/function/partialRight';
import TableViewProvider from '../TableViewProvider';
import KendoColumnRendererRegistry from '../../tree/provider/KendoColumnRendererRegistry';
/**
 *
 */
class KendoTable extends TableViewProvider {

    constructor({id,columnModel, dataModel,controller}) {
        super(id, columnModel, dataModel, controller);
    }

    renderTemplate(target) {
        target.html(tableView(this));
    }

    render(target, columns, rows) {
        this.dataSource = prepareDataSource(rows, this);
        this.configComponent(target, columns);
    }

    configComponent(target, columns) {
        this.localTarget = target;
        var self = this;
        this.table = target.kendoGrid({
            resizable: true,
            reorderable: true,
            pageable: {
                refresh: true,
                pageSize: 10,
                pageSizes: [5, 10, 20],
                buttonCount: 3
            },
            dataSource: this.dataSource,
            sortable: {
                mode: "single",
                allowUnsort: true
            },
            columns: columnsToShow(columns),
            selectable: "multiple, row",
            change: function () {
                var selectedRows = this.select();
                if (selectedRows.length > 1) {
                    var ids = _map(selectedRows, (row)=> {
                        var dataItem = this.dataItem(row);
                        return {id: dataItem.id, typeId: dataItem.typeId};
                    });
                    self.rowsSelected(ids);
                } else {

                    var dataItem = this.dataItem(selectedRows[0]);
                    self.rowSelected({id: dataItem.id, typeId: dataItem.typeId});
                }
            }
        });
    }

    selectRow(id) {
        var element = this.dataSource.get(id);
        var uid = element.uid;
        var tr = $(`tr[data-uid=${uid}]`);
        var tree = $(this.localTarget).data("kendoGrid");
        tree.select($(tr));
    }

    refreshAll(rows) {
        this.dataSource.read({rows});
    }

    refresh(modifiedRows) {
        applyDataOnModel(modifiedRows, this);
    }


    disposeImpl() {
        super.disposeImpl();
        kendo.destroy(this.target);
    }

}

function cutData(data, start = 0, pageSize = 10) {
    return data.slice(start, start + pageSize);
}
function prepareDataSource(data, component) {
    var readFunction = _partialRight(readData, component);
    var columnModel = component.columnModel;
    var options = {
        pageSize: 10,
        transport: {
            read: readFunction
        },
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        schema: {
            data: "data",
            total: "total"
        }
    };

    if (columnModel.getDefaultOrder()) {
        options.sort = {
            field: columnModel.getDefaultOrder(),
            dir: "asc"
        };
    }

    var dataSource = new kendo.data.DataSource(options);
    dataSource.data(data);
    return dataSource;
}


function columnsToShow(columnsDef) {
    var allColumns = [];
    var modApplayed = false;
    _each(columnsDef, (columnDef)=> {
        var col = {
            field: columnDef.idFix,
            title: columnDef.label
        };
        if (columnDef.domainName === 'Id') {
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

function applyDataOnModel(modifiedRows, view) {
    for (let [key, value] of modifiedRows) {
        try {
            var rowInTree = view.dataSource.get(key);
            for (var prop in value) {
                if (value.hasOwnProperty(prop)) {
                    rowInTree.set(prop, value[prop]);
                }
            }
        } catch (e) {
            console.warn(e);
        }
        view.selectRow(key);
    }
}

function addModifiedIconWhenDataChange(col, columnDef) {
    col.template = `#if(data.modified){#
                  <span class="glyphicon glyphicon-pencil"></span> #: data.${columnDef.idFix}#
                #}else{#
                #= data.${columnDef.idFix}?data.${columnDef.idFix}:''#
                #}#`;
}

function readData(options, component) {
    var start = options.data.skip;
    var pageSize = options.data.take;
    if (options.data.rows) {
        var cutedData = cutData(options.data.rows, start, pageSize);
        options.success({
            data: cutedData,
            total: options.data.rows.length
        });
    } else {
        component.dataModel.fetch({invokeListeners: false}).then((result)=> {
            var cutedData = cutData(result, start, pageSize);
            options.success({
                data: cutedData,
                total: result.length
            });
        });
    }
}

export default KendoTable;