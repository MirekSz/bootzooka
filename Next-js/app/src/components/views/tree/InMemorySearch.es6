"use strict";
/**
 * Created by Mirek on 2015-08-24.
 */
import _union from 'lodash/array/union';

class InMemorySearch {
    constructor(model) {
        this.DELAY = 500;
        this.model = model;
        this.nodesMap = new Map();
        this.nodesParentMap = new Map();
    }


    createMaps(nodes) {
        for (let i = 0; i < nodes.length; i++) {
            let obj = nodes[i];
            this.nodesMap.set(obj.id, obj);
            if (obj.parentId) {
                this.nodesParentMap.set(obj.parentId, this.nodesMap.get(obj.parentId));
            }
        }
    }

    findParents(node, parents) {
        var parentId = node.parentId;
        const parent = this.nodesParentMap.get(parentId);
        parents.push(parent);
        if (parent.parentId) {
            this.findParents(parent, parents);
        }
    }

    findChildren(node, children) {
        if (node.childrenIds.length > 0) {
            for (var j = 0; j < node.childrenIds.length; j++) {
                var childId = node.childrenIds[j];
                var item = this.nodesMap.get(childId);
                children.push(item);
                if (item.childrenIds.length > 0) {
                    this.findChildren(item, children);
                }
            }
        }
    }

    isActive() {
        if (this.query) {
            return true;
        }
        return false;
    }

    getQuery() {
        return this.query;
    }

    search(query) {
        if (!this.delayer) {
            this.startDelayer();
        }
        this.query = query;
    }

    searchInModel(query, nodes) {
        if (!query) {
            return nodes;
        }
        this.createMaps(nodes);
        const lQuery = query.toLocaleLowerCase();

        var matching = [];
        for (let i = 0; i < nodes.length; i++) {
            let obj = nodes[i];
            const stringify = JSON.stringify(obj).toLowerCase();
            if (stringify.indexOf(lQuery) !== -1) {
                matching.push(obj);
            }
        }
        var parents = [];
        for (let i = 0; i < matching.length; i++) {
            let obj = matching[i];
            if (obj.parentId) {
                this.findParents(obj, parents);
            }
        }
        var children = [];
        for (let i = 0; i < matching.length; i++) {
            let obj = matching[i];
            this.findChildren(obj, children);

        }
        return _union(matching, parents, children);
    }


    /**
     *@private
     **/
    startDelayer() {
        this.delayer = {runs: true};
        setTimeout(()=> {
            var nodes = this.model.getCurrentData();
            var filteredData = this.searchInModel(this.query, nodes);
            this.model.setFilteredData(filteredData);

            this.delayer = undefined;
        }, this.DELAY);
    }


}

export default InMemorySearch;