"use strict";
/**
 * Created by Mirek on 2015-08-17.
 */
import _union from 'lodash/array/union';
import * as mixin  from '../../lib/Mixins';

/**
 * @mixes ObservableMixin
 */
class ViewColumnModel {

    constructor(definition) {
        this.allColumns = new Map();
        this.selectedColumns = [];
        var columnsDef = definition.getColumnsDef();
        this.defaultOrder = definition.defaultOrder;

        this.splitColumnsIntoCategory(columnsDef);

        mixin.mixinInitializer(this);
    }

    getDefaultOrder() {
        return this.defaultOrder;
    }

    getDefaultOrderIndex() {
        var columns = this.getSelectedColumns();
        for (var i = 0; i < columns.length; i++) {
            var obj = columns[i].idFix;
            if (this.getDefaultOrder() && this.getDefaultOrder() === obj) {
                return i;
            }
        }
    }

    /**
     *@private
     **/
    splitColumnsIntoCategory(columnsDef) {
        this.requiredColumns = [];
        for (var i = 0; i < columnsDef.length; i++) {
            var columnDef = columnsDef[i];
            this.allColumns.set(columnDef.idFix, columnDef);
            if (columnDef.hints.required) {
                this.requiredColumns.push(columnDef);
            }
        }
    }

    getRequiredColumns() {
        return this.requiredColumns;
    }

    getAllColumns() {
        var result = [];
        for (let column of this.allColumns.values()) {
            result.push(column);
        }
        return result;
    }


    getSelectedColumns() {
        return _union(this.requiredColumns, this.selectedColumns);
    }

    getUserSelectedColumns() {
        return this.selectedColumns;
    }

    selectColumns(ids) {
        this.selectedColumns = [];
        for (var i = 0; i < ids.length; i++) {
            var id = ids[i];
            var columnDef = this.allColumns.get(id);
            this.selectedColumns.push(columnDef);
        }
        this.fireListeners(this.getSelectedColumns());
    }

    dispose() {
        this.removeAllListeners();
    }
}
mixin.applyMixin(mixin.ObservableMixin, ViewColumnModel);
export default ViewColumnModel;