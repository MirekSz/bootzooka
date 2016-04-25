"use strict";
/**
 * Created by Mirek on 2015-08-17.
 */
import _each from 'lodash/collection/each';
import TreeViewProvider from './../../tree/TreeViewProvider';
import tableView from './table_view.hbs';
import  DataTablesColumnRendererRegistry from './DataTablesColumnRendererRegistry';
/**
 *
 */
class DataTables extends TreeViewProvider {

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
        var self = this;
        this.table = target.DataTable({
            "deferRender": true,
            colReorder: true,
            rowId: 'id',
            "dom": 'tp',
            stateSave: true,
            stateSaveCallback: function (settings, data) {
            },
            "order": [[self.dataSource.sort.field, self.dataSource.sort.dir]],
            "processing": true,
            "serverSide": true,
            fnServerData: function (sSource, aoData, fnCallback, oSettings) {
                var orderBy = aoData[2].value[0];
                var start = 0 + aoData[3].value;
                var pageSize = 0 + aoData[4].value;
                var dataSize = self.dataSource.data.length;
                fnCallback({
                    "iTotalRecords": dataSize, "iTotalDisplayRecords": dataSize,
                    aaData: self.dataSource.data.slice(start, start + pageSize)
                });
            },
            "columnDefs": [
                {
                    "render": function (data, type, row) {
                        if (row.modified) {
                            return '<span class="glyphicon glyphicon-pencil"></span> ' + data;
                        }
                        return data;
                    },
                    "targets": [1]
                }
            ],
            columns: columnsToShow(columns),
            select: 'single'
        });
        this.table.on('column-reorder', (e, settings, details) => {
            super.columnReorder(details.from, details.to);
        });
        this.table.on('select', (e, dt, type, indexes) => {
            var rowData = this.table.row(indexes[0]).data();

            super.rowSelected({id: rowData.id, typeId: rowData.typeId});
        });
    }

    selectRow(id) {
        var tr = $(`tr[id=${id}]`);
        var row = this.table.row(tr);
        row.select();
    }

    refreshAll(rows) {
        this.dataSource.data = rows;
        this.table.ajax.reload();
    }

    refresh(modifiedRows) {
        applyDataOnModel(modifiedRows, this);
    }


    disposeImpl() {
        super.disposeImpl();
        this.table.destroy();
    }

}

function prepareDataSource(data, component) {
    var columnModel = component.columnModel;

    var dataSource = {data};

    if (columnModel.getDefaultOrder()) {
        dataSource.sort = {
            field: columnModel.getDefaultOrderIndex(),
            dir: "asc"
        };
    }
    return dataSource;
}

function columnsToShow(columnsDef) {
    var allColumns = [];
    _each(columnsDef, (columnDef)=> {
        var col = {
            data: columnDef.idFix,
            title: columnDef.label
        };
        if (columnDef.domainName === 'Id') {
            col.visible = false;
        }
        col.defaultContent = '';

        if (DataTablesColumnRendererRegistry.hasRenderer(columnDef.domainName)) {
            col.render = DataTablesColumnRendererRegistry.getColumnRendered(columnDef.domainName);
        }
        allColumns.push(col);
    });

    return allColumns;
}

function applyDataOnModel(modifiedRows, view) {
    for (let [key, value] of modifiedRows) {
        try {
            var find = $(view.target).find(`tr[id=${key}]`)[0];
            var row = view.table.row(find);
            row.data(value);
        } catch (e) {
            console.warn(e);
        }
        view.selectRow(key);
    }
}

export default DataTables;