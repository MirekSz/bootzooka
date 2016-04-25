"use strict";
/**
 * Created by Mirek on 2015-08-19.
 */


class KendoColumnRendererRegistry {
    constructor() {
        this.registry = new Map();
        this.registry.set("Active", getColumnBooleanTemplate);
        this.registry.set("RowIsActive", getColumnBooleanTemplate);
        this.registry.set("Number", getColumnNumberTemplate);
    }

    hasRenderer(domainName) {
        return this.registry.get(domainName) !== undefined;
    }

    getColumnTemplate(domainName, fieldName) {
        var templateFunction = this.registry.get(domainName);
        return templateFunction(domainName, fieldName);
    }
}

function getColumnBooleanTemplate(domainName, fieldName) {
    return `#if(data.${fieldName}){#
                  <span class="glyphicon glyphicon-ok"></span>
                #}else{#
                #}#`;
}

function getColumnNumberTemplate(domainName, fieldName) {
    return `#if(data.${fieldName}){#
                  <div align='right'> #: data.${fieldName} # </div>
                #}else{#
                #}#`;
}

export default new KendoColumnRendererRegistry();