/**
 * Created by bstanislawski on 2015-12-11.
 */
import layoutTemplate from './layout.hbs';
import childLayoutTemplate from '../GUIComponentTree/tree_template.hbs';
import defaultPropertiesRegistry from '../DefaultPropertiesRegistry';
import LayoutManager from './LayoutManager';

class GUIComponentTree {

    /**
     * @param {GUIComponentTreeDef} guiComponentTreeDef
     */
    constructor(guiComponentTreeDef) {
        this.id = guiComponentTreeDef.id;
        this.def = guiComponentTreeDef;
        this.name = guiComponentTreeDef.name || 'panel';
        this.icon = guiComponentTreeDef.icon;

        this.components = guiComponentTreeDef.components;
        this.metaDataSourceMap = guiComponentTreeDef.metaDataSourceMap || new Map();
        this.layoutManager = new LayoutManager(this);

        this.elementId = 0;
    }

    bindDataSource(dataSource) {
        this.components.forEach(container => {
            if (container.children) {
                container.children.forEach(child => {
                    child.bindDataSource(dataSource);
                });
            } else {
                container.bindDataSource(dataSource);
            }
        });
    }

    renderTo(target) {
        this.renderLayout(target);
        this.target = $(target).find('form');
        this.renderChildrenLayout();

        this.calculateGrid();

        this.components.forEach((component, index) => {
            var componentTarget = this.createComponentLocation(component, index);

            component.renderTo(componentTarget);

            this.elementId++;
        });
    }

    calculateGrid() {
        this.setDefaultProperties();

        this.components.forEach(component => {
            component.calculateGrid();
        });

        this.layoutManager.setLayoutRules();
        //this.layoutManager.setOccupyX();
        this.layoutManager.useAutoExpand();
        this.layoutManager.handleFill();

        this.layoutManager.rescaleContainersElements();
        this.layoutManager.handleSpecialCases();
    }

    renderLayout(target) {
        var htmlElement = layoutTemplate(this);

        $(target).html(htmlElement);
    }

    renderChildrenLayout() {
        var templateWithSlots = childLayoutTemplate(this);

        $(this.target).html(templateWithSlots);
    }

    reRender() {
        this.components.forEach(component => {
            component.reRender();
        });
    }

    hide() {
        console.log('GUIComponentTree has been hide...');
    }

    getRootComponent() {
        return this.components[0];
    }

    dispose() {
        var root = this.getRootComponent();
        root.dispose();
    }

    setDefaultProperties() {
        var sizes = this.layoutManager.getBasicInputSizes();

        defaultPropertiesRegistry.labelSize = sizes.label;
        defaultPropertiesRegistry.inputSize = sizes.field;
        defaultPropertiesRegistry.numberOfColumns = sizes.numberOfColumns;
        defaultPropertiesRegistry.realNumberOfColums = sizes.currentMaxRealElementsInRow;

        let containerWidth = getTheContainerWidth(this.target);
        defaultPropertiesRegistry.containerWidth = containerWidth;
    }

    /**
     * @private
     */
    createComponentLocation(component, index) {
        this.location = `${component.type}_${index}`;

        component.locationId = this.location;

        return this.target.find(`#${this.location}`);
    }

}


export default GUIComponentTree;

function getTheContainerWidth($target) {
    const modalPercentWidth = 0.67;
    const $mainContainer = $('#container_0');
    const $windowBody = $('#window-body');
    const $body = $('body');
    var width = 0;

    if ($windowBody.length > 0) {
        width = $windowBody.width();
    } else if ($mainContainer.length > 0) {
        width = $mainContainer.width();
    } else {
        width = Math.round($body.width() * modalPercentWidth);
    }

    if (width > 0) {
        return width;
    } else {
        return $target.width();
    }
}
