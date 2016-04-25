"use strict";
/**
 * Created by Mirek on 2015-11-25.
 */
import _find from 'lodash/collection/find';
import {NODE_ID,TYPE_ID} from './TreeComponentConsts';

class TreeRowSelector {
    constructor(socketProvider) {
        this.socketProvider = socketProvider;
        this.viewExtension = socketProvider.def.viewExtension;
    }

    selectRow(row) {
        if (!row) {
            this.sendNullOnSockets(this.viewExtension.linkNodeIdSelectedRowDataList, null);
            this.sendNullOnSockets(this.viewExtension.linkParentNodeIdSelectedRowDataList, null);
            return;
        }
        let targetSocketName = this.getTargetSocket(row.id[TYPE_ID]);
        if (targetSocketName) {
            this.socketProvider.getOutputSocketByName(targetSocketName).send(row.id[NODE_ID]);
        }
        this.sendNullOnSockets(this.viewExtension.linkNodeIdSelectedRowDataList, targetSocketName);

        let parentTargetSocketName;
        if (row.parentId) {
            parentTargetSocketName = this.getParentTargetSocket(row.parentId[TYPE_ID]);
            if (parentTargetSocketName) {
                this.socketProvider.getOutputSocketByName(parentTargetSocketName).send(row.parentId[NODE_ID]);
            }
        }
        this.sendNullOnSockets(this.viewExtension.linkParentNodeIdSelectedRowDataList, parentTargetSocketName);
    }

    sendNullOnSockets(array, skipName) {
        for (var i = 0; i < array.length; i++) {
            var obj = array[i];
            var socketName = obj.outSocketId;
            if (socketName === skipName) {
                continue;
            }
            this.socketProvider.getOutputSocketByName(socketName).send(null);
        }
    }

    getTargetSocket(nodeTypeId) {
        var row = _find(this.viewExtension.linkNodeIdSelectedRowDataList, element =>element.nodeTypeId === nodeTypeId);
        if (row) {
            return row.outSocketId;
        }
        return null;
    }

    getParentTargetSocket(nodeTypeId) {
        var row = _find(this.viewExtension.linkParentNodeIdSelectedRowDataList, element =>element.nodeTypeId === nodeTypeId);
        if (row) {
            return row.outSocketId;
        }
        return null;
    }

}
export default TreeRowSelector;