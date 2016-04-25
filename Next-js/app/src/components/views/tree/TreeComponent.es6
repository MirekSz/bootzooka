"use strict";
/**
 * Created by Mirek on 2015-08-17.
 */
import BaseRenderingComposition from '../../BaseRenderingComposition';
import DataProvider from '../../../dataProviders/DataProvider';
import ViewColumnModel from './../ViewColumnModel';
import TreeDataModel from './TreeDataModel';
import TreeRowSelector from './TreeRowSelector';
import ViewController from './../ViewController';
import KendoUITree from './provider/KendoUITree';
import DetailsView from './DetailsView';
import treeView from './tree_view.hbs';

class TreeComponent extends BaseRenderingComposition {

    /**
     * @param {ViewComponentDef} element
     */
    constructor(element) {
        super(element);
        this.treeProvider = DataProvider.getTreeProvider(element.dataSourceId);
    }

    initializeImpl() {
        var async = this.treeProvider.getDefinition().then((definition)=> {

            this.columnModel = new ViewColumnModel(definition);
            this.dataModel = new TreeDataModel(this.columnModel, this.treeProvider, definition);
            this.controller = new ViewController(this.dataModel, this.columnModel, new TreeRowSelector(this));

            this.view = this.createView();
            this.detailsView = this.createDetailsView();

            this.addColumnModelListener();
        });

        return async;
    }


    createView() {
        return new KendoUITree({
            id: this.id, //this.def.id
            columnModel: this.columnModel,
            dataModel: this.dataModel,
            controller: this.controller
        });
    }

    createDetailsView() {
        return new DetailsView(this.def.id);
    }

    /**
     *@private
     **/
    addColumnModelListener() {
        this.columnModel.addListener(()=> {
            var viewTarget = this.view.target;
            this.view.dispose();
            this.view = this.createView();
            this.view.renderTo(viewTarget);
        });
    }

    disposeImpl(target) {
        this.dataModel.dispose();
        this.columnModel.dispose();
    }

    getMasterTemplate() {
        return treeView;
    }

    getComponents() {
        return [
            {
                target: '_content',
                view: this.view
            },
            {
                target: '_details',
                view: this.detailsView
            }
        ];
    }

}

export default TreeComponent;
