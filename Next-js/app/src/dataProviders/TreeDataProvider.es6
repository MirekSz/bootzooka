"use strict";
/**
 * Created by Mirek on 2015-07-27.
 */
import serverConnector from '../lib/ServerConnector';
import _each from 'lodash/collection/each';
import _map from 'lodash/collection/map';
import _findIndex from 'lodash/array/findIndex';

const TREE_DEF_URL = '/proxy/platform-registry/data-providers/tree/def';
const TREE_FETCH_URL = '/proxy/platform-registry/data-providers/tree/fetch';

class TreeDataProvider {

    constructor({id}) {
        this.id = id;
    }

    /**
     * @returns {Promise.<TreeDefinition>}
     */
    getDefinition() {
        var self = this;
        if (self.def) {
            return new Promise((resolve) => {
                resolve(self.def);
            });
        }
        return new Promise((resolve, reject) => {
            return serverConnector.getObject(TREE_DEF_URL, {id: this.id}, treeDefConverter).then((data) => {
                self.def = data;
                resolve(data);
            }, (error)=> {
                reject(error);
            });
        });
    }

    /**
     * @param {Array.<String>} columns
     * @param {Array.<TreeFilter>} filters
     * @returns {Promise.<TreeData>}
     */
    getData(columns, filters = []) {
        var self = this;
        return new Promise((resolve, reject) => {
            this.getDefinition().then(()=> {
                var columnIds = _map(self.def.columnsDef, (element)=> {
                    return element.id;
                });
                if (columns) {
                    columnIds = this.extractIds(columns);
                }
                var request = {
                    idTreeTableDataSorce: this.id,
                    filterRequestList: filters,
                    columnIds: columnIds
                };
                serverConnector.post(TREE_FETCH_URL, request).then(function (res) {
                    resolve(treeDataConverter(res));
                });
            }, (err)=> {
                reject(err);
            });
        });
    }

    extractIds(columns) {
        if (columns[0] instanceof TreeColumnDef) {
            return _map(columns, (element)=> {
                return element.id;
            });
        } else {
            return columns;
        }
    }

    /**
     * @param {Array.<TreeColumnDef>} columns
     * @param {Array.<TreeFilter>} filters
     * @returns {Promise.<TreeData>}
     */
    getFlatData(columns, filters) {
        return new Promise((resolve, reject) => {
            this.getData(columns, filters).then((data) => {

                _each(data.nodes, (node)=> {
                    if (node.children.length > 0) {
                        this.extractChildren(node, data);
                    }
                });
                var nodes = _map(data.nodes, (node)=> {
                    var asLiteral = node.asLiteral(columns);
                    return asLiteral;
                });
                resolve(nodes);
            }, (error)=> {
                reject(error);
            });
        });
    }

    /**
     *@private
     **/
    extractChildren(node, data) {
        _each(node.children, (child)=> {
            var childAsNode = new TreeDataNode(child);
            childAsNode.parentId = node.id;
            node.childrenIds.push(childAsNode.id.nodeId);
            data.nodes.push(childAsNode);
            if (childAsNode.children) {
                this.extractChildren(childAsNode, data);
            }
        });
    }

    createTreeFilter(id) {
        var index = _findIndex(this.def.filtersDef, (filterDef)=> {
            return filterDef.id === id;
        });
        if (index === -1) {
            throw new Error(`Can't find filter with id ${id}`);
        }
        return new TreeFilter(undefined, this.def.filtersDef[index]);
    }
}

export default TreeDataProvider;

var treeDefConverter = function (json) {
    var treeDefinition = new TreeDefinition();
    _each(json.definition.columnHierarchyDef.columnDefList, function (element) {
        var columnDef = new TreeColumnDef(element);
        treeDefinition.columnsDef.push(columnDef);
    });
    _each(json.definition.fieltrDef, function (element) {
        var treeDef = new TreeFilterDef(element);
        treeDefinition.filtersDef.push(treeDef);
    });
    if (json.definition.childrenLpColumnDef) {
        treeDefinition.defaultOrder = json.definition.childrenLpColumnDef.id.replace(".", "_");
    }
    if (json.definition.nodeTypeDefList) {
        for (let i = 0; i < json.definition.nodeTypeDefList.length; i++) {
            let obj = json.definition.nodeTypeDefList[i];
            treeDefinition.nodeTypeToFilter.set(obj.typeId, obj.filterId);
        }
    }
    if (json.definition.treeTableRefreshDef) {
        var nodeRefreshDefList = json.definition.treeTableRefreshDef.nodeRefreshDefList;
        for (let i = 0; i < nodeRefreshDefList.length; i++) {
            let obj = nodeRefreshDefList[i];
            treeDefinition.idNameToType.set(obj.columnDef.name, obj.typeId);
        }
    }
    return treeDefinition;

};

var treeDataConverter = function (json) {
    var treeData = new TreeData();
    _each(json.data.treeTableModel.nodes, function (element) {
        var columnDef = new TreeDataNode(element);
        treeData.nodes.push(columnDef);
    });
    return treeData;

};

class TreeFilter {
    constructor(value, filterDef) {
        this.propertyValue = value;
        this.filterDef = filterDef;
        this.id = filterDef.id;
        this.propertyId = filterDef.id;
        this.propertyValueClass = filterDef.valueClass;
    }

    setValue(value) {
        this.propertyValue = [this.propertyValueClass, value];
    }
}
/**
 * @property Array.<TreeDataNode> nodes
 */
class TreeData {
    constructor() {
        this.nodes = [];
    }
}
class TreeDataNode {
    constructor({id,parentId,columnValues,children}) {
        this.id = id;
        this.parentId = parentId;
        this.columnValues = columnValues;
        this.children = children;
        this.childrenIds = [];
    }

    asLiteral(columnsDef) {
        var res = {};
        _each(columnsDef, (element, index)=> {
            var columnValue = unwrapFromJavaType(this.columnValues[index]);
            var id = element.id.replace('.', '_');
            if (columnValue) {
                res[id] = columnValue;
            } else {
                res[id] = undefined;
            }
        });
        res.expanded = true;

        res.id = this.id.nodeId;
        res.parentId = this.parentId ? this.parentId.nodeId : null;

        res.childrenIds = this.childrenIds;

        res.sourceNodeId = this.id;
        res.sourceParentId = this.parentId;
        return res;
    }

}

class TreeDefinition {
    constructor() {
        this.columnsDef = [];
        this.filtersDef = [];
        this.nodeTypeToFilter = new Map();
        this.idNameToType = new Map();
    }

    getColumnsDef() {
        return this.columnsDef;
    }

    getColumnDef(id) {
        var index = _findIndex(this.columnsDef, (columnDef)=> {
            return columnDef.id === id;
        });
        return this.columnsDef[index];
    }
}
class TreeFilterDef {
    constructor({id,valueClass,required}) {
        this.id = id;
        this.valueClass = valueClass;
        this.required = required;

    }
}
/**
 * @property {FieldDataType} fieldDataType
 */
class TreeColumnDef {
    constructor({domainName,domainSize,fieldDataType,id, label,name, title,description,hints}) {
        this.domainName = domainName;
        this.domainSize = domainSize;
        this.fieldDataType = fieldDataType;
        this.id = id;
        this.idFix = id.replace('.', '_');
        this.label = label;
        this.name = name;
        this.title = title;
        this.description = description;
        this.hints = hints;
    }
}

const FieldDataType = {
    INTEGER: 'INTEGER',
    LONG: 'LONG',
    STRING: 'STRING',
    DATE: 'DATE',
    TIME: 'TIME',
    DATETIME: 'DATETIME',
    NUMERIC: 'NUMERIC',
    MEMO: 'MEMO',
    BLOB: 'BLOB',
    BOOLEAN: 'BOOLEAN',
    LONG_ARRAY: 'LONG_ARRAY',
    FST_DATA: 'FST_DATA'
};

function unwrapFromJavaType(value) {
    if (value instanceof Array && value.length === 2) {
        return value[1];
    }
    return value;
}