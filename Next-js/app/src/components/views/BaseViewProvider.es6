"use strict";
/**
 * Created by Mirek on 2015-08-18.
 */
import BaseRendering from '../../lib/rendering/BaseRendering';
import {IdInfosPublisher} from '../../lib/EventBus';
class BaseViewProvider extends BaseRendering {

    constructor(id, paretnId, columnModel, dataModel, controller) {
        super();
        this.id = id;
        this.parentId = paretnId;
        this.columnModel = columnModel;
        this.dataModel = dataModel;
        this.controller = controller;
    }

    renderToImpl(target) {
        var self = this;

        var selectedColumns = this.columnModel.getSelectedColumns();
        this.dataModel.fetch({}).then((result)=> {
            self.render(target, selectedColumns, result);

            addListeners(self);
        });
    }

    renderTemplate(target) {
        console.log('Empty renderTemplate');
    }

    initialize() {
        this.initialized = true;
    }


    render(target, columns, rows) {
        console.log('Empty render');
    }

    refresh(modifiedRows) {
        if (refreshAllNeeded(modifiedRows)) {
            this.controller.refreshAll();
        } else {
            this.refreshRows(modifiedRows);
        }
    }

    refreshAll(rows) {
        console.log('Empty refreshAll');
    }

    refreshRows(rows) {
        console.log('Empty refreshRows');
    }

    search(query) {
        this.controller.search(query);
    }

    selectRow(id) {
        console.log('Empty selectRow ');
    }

    rowSelected(row) {
        this.controller.rowSelected(row);
    }

    rowsSelected(rows) {
        this.controller.rowsSelected(rows);
    }

    columnReorder(name, index) {
        console.log('Empty columnReorder ');
        console.log(arguments);
    }

    columnResize(name, width) {
        console.log('Empty columnResize ');
        console.log(arguments);
    }

    disposeImpl() {
        this.dataModel.removeAllListeners();
    }

    addUIListenersImpl(uIListenerBinder) {
        //nie ladnie zapinal listenery na rodzica
        var element = `input[id='${this.parentId}_search']`;

        uIListenerBinder.addKeyUp(element, function (e) {
            this.search($(e.target).val());
        });

        uIListenerBinder.addClick(`button[id='${this.parentId}_settings']`, ()=> {
            this.controller.showColumnSelection();
        });

        uIListenerBinder.addClick(`button[id='${this.parentId}_refresh']`, ()=> {
            this.controller.refreshAll();
        });
    }
}

function addListeners(view) {
    view.dataModel.addListener({
        rowsRefresh: (map)=> {
            view.refresh(map);
        },
        dataChanged: (rows)=> {
            view.refreshAll(rows);
        }
    });
}

function refreshAllNeeded(modifiedRows) {
    for (var [key,value] of modifiedRows) {
        if (IdInfosPublisher.MODIFIED == value.op) {
            return true;
        }
    }

    return false;
}

export default BaseViewProvider;