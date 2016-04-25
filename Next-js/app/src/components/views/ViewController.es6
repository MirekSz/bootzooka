"use strict";
/**
 * Created by Mirek on 2015-08-18.
 */
import ColumnSelection from './columnSelection/ColumnSelection';

class ViewController {

    constructor(dataModel, columnModel, rowSelector) {
        this.model = dataModel;
        this.columnModel = columnModel;
        this.rowSelector = rowSelector;
    }

    rowSelected(row) {
        console.log('row: ');
        console.log(row);
        this.rowSelector.selectRow(row);
    }

    showColumnSelection() {
        var columnSelection = new ColumnSelection(this.columnModel);
        columnSelection.showColumnSelection();
        console.log('show: showColumnSelection');
    }

    refreshAll() {
        this.model.refreshAll()
    }

    rowsSelected(rows) {
        console.log('rowsSelected');
        console.log(rows);
    }

    search(query) {
        this.model.search(query);
        this.rowSelected(null);
    }

}
export default ViewController;