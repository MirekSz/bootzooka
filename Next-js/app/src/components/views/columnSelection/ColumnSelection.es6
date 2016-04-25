"use strict";
/**
 * Created by Mirek on 2015-08-27.
 */
import BootstrapApi from '../../../lib/rendering/BootstrapApi';
import template from './column_selection.hbs';
import _filter from 'lodash/collection/filter';

class ColumnSelection {
    constructor(columnModel) {
        this.columnModel = columnModel;
    }

    showColumnSelection() {
        var options = {
            id: 'Wybór kolumn',
            onshownCallback: (dialog, options)=> {
                var requiredColumns = this.getRequiredColumns();
                var selectedColumns = this.getSelectedColumns(requiredColumns);
                var allColumns = this.getAllColumns(requiredColumns, selectedColumns);
                var html = template({
                    requiredColumns: requiredColumns,
                    selectedColumns: selectedColumns,
                    allColumns: allColumns
                });
                dialog.$modalBody.html(html);
            },
            onhideCallback: function () {
            },
            primaryButtonAction: dialog => {
                var selected = [];
                var optionDefs = dialog.$modalBody.find("input[type='checkbox']");
                optionDefs.each(function (index) {
                    var checked = $(this).prop("checked");
                    var disabled = $(this).prop("disabled");
                    if (checked && !disabled) {
                        selected.push($(this).attr('name'));
                    }
                });
                this.columnModel.selectColumns(selected);
            }
        };

        BootstrapApi.showModal(options);
    }

    getRequiredColumns() {
        var requiredColumns = this.columnModel.getRequiredColumns();
        return _filter(requiredColumns, (column)=> {
            return column.domainName !== 'Id';
        });
    }

    getSelectedColumns(requiredColumns) {
        var selectedColumns = this.columnModel.getUserSelectedColumns();
        return _filter(selectedColumns, (column)=> {
            return column.domainName !== 'Id' && requiredColumns.indexOf(column) === -1;
        });
    }

    getAllColumns(requiredColumns, selectedColumns) {
        var allColumns = this.columnModel.getAllColumns();
        return _filter(allColumns, (column)=> {
            return column.domainName !== 'Id' && requiredColumns.indexOf(column) === -1 && selectedColumns.indexOf(column) === -1;
        });
    }
}

export default ColumnSelection;