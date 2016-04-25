/**
 * Created by bartosz on 21.05.15.
 *
 * TableComponent class
 */

import DataTables from './dataTables/DataTables';
import BaseRenderingComposition from '../../BaseRenderingComposition';
import DataProvider from '../../../dataProviders/DataProvider';
import ViewColumnModel from './../ViewColumnModel';
import ViewDataModel from './../ViewDataModel';
import TreeDataModel from './../tree/TreeDataModel';
import ViewController from './../ViewController';
import tableView from './table_view.hbs';
const ID_OUT_SOCKET = 'nodeId';

class TableComponent extends BaseRenderingComposition {
    /**
     * @param {ViewComponentDef} element
     */
    constructor(element) {
        super(element);
        this.treeProvider = DataProvider.getTreeProvider(element.dataSourceId);
    }

    initializeImpl() {
        var idBeanOutSocket = this.getOutputSocketByName(ID_OUT_SOCKET);

        var async = this.treeProvider.getDefinition().then((definition)=> {

            this.columnModel = new ViewColumnModel(definition);
            this.dataModel = new TreeDataModel(this.columnModel, this.treeProvider, definition);
            this.controller = new ViewController(this.dataModel, this.columnModel, idBeanOutSocket);

            this.view = this.createView();

            this.addColumnModelListener();
        });

        return async;
    }


    /**
     *@private
     **/
    addColumnModelListener() {
        this.columnModel.addListener(()=> {
            this.view.dispose();
            this.view = this.createView();
            this.view.renderTo(this.target);
        });
    }

    disposeImpl(target) {
        this.dataModel.dispose();
        this.columnModel.dispose();
    }

    getComponents() {
        return [{target: '_content', view: this.view}];
    }

    getMasterTemplate() {
        return tableView;
    }

    createView() {
        return new DataTables({
            id: this.def.id,
            columnModel: this.columnModel,
            dataModel: this.dataModel,
            controller: this.controller
        });
    }

}

export default TableComponent;
