"use strict";
/**
 * Created by Mirek on 2015-08-19.
 */


class DataTablesColumnRendererRegistry {
    constructor() {
        this.registry = new Map();
        this.registry.set("Active", getColumnBooleanTemplate);
        this.registry.set("RowIsActive", getColumnBooleanTemplate);
    }

    hasRenderer(domainName) {
        return this.registry.get(domainName) !== undefined;
    }

    getColumnRendered(domainName) {
        var func = this.registry.get(domainName);
        return func;
    }
}

function getColumnBooleanTemplate(data, type, row) {
    if (data) {
        return '<span class="glyphicon glyphicon-ok"></span>';
    }
    return '';
}


export default new DataTablesColumnRendererRegistry();