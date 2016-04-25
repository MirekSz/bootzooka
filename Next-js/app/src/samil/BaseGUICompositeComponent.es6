/**
 * Created by bstanislawski on 2015-12-11.
 */
import BaseGUIComponent from './BaseGUIComponent';
import childLayoutTemplate from './GUIComponentTree/tree_template.hbs';
import defaultPropertiesRegistry from './DefaultPropertiesRegistry';

class BaseGUICompositeComponent extends BaseGUIComponent {

    /**
     * @param {GUIElementDef} element
     */
    constructor(element) {
        super(element);

        this.childrenDefList = element.childrenDefList;
        this.children = [];
    }

    calculateGridImpl() {
    }

    calculateGrid() {
        this.numberOfColumn = 0;
        this.setColumnNumbers();
        this.setGuiAttributes();
        this.calculateGridImpl();

        this.children.forEach(child => {
            child.calculateGrid();
        });
    }

    renderTo(target) {
        this.target = target;

        var htmlElement = template(this);
        target.html(htmlElement);

        this.renderChildren();
        this.doAfterRender(target);
    }

    renderChildren() {
        this.renderChildrenLayout();

        this.children.forEach((child, index) => {
            var target = this.createComponentLocation(child, index);

            child.renderTo(target);
        });
    }

    setColumnNumbers() {
        var numberOfColumn = 0;
        var columnsNumber = 0;

        this.children.forEach(child => {
            if (child.hasLabel()) {
                child.guiModel.labelColumnNumber = 0;
                numberOfColumn++;
                columnsNumber++;
            }
            if (child.hasField()) {
                if (child.hasLabel()) {
                    child.guiModel.fieldColumnNumber = 1;
                } else {
                    child.guiModel.fieldColumnNumber = 0;
                }

                numberOfColumn++;
                columnsNumber++;
            }
        });

        this.guiModel.numberOfColumn = numberOfColumn;
        this.guiModel.columnsNumber = columnsNumber;
    }

    renderChildrenLayout() {
        var templateWithSlots = childLayoutTemplate(this);

        $(this.target).html(templateWithSlots);
    }

    doAfterRender(targetElement) {
        this.doAfterRenderImpl(targetElement);
    }

    doAfterRenderImpl(targetElement) {
//        console.log('composite component rendered...');
    }

    reRender() {
        this.children(child => {
            child.reRender();
        });
    }

    dispose() {
        this.disposeImpl(this.target);
    }

    disposeImpl(target) {
        this.children.forEach(child => {
            child.dispose();
        });
    }

    hasChildren() {
        return this.childrenDefList.length > 0;
    }

    bindDataSource(dataSource) {
        this.children.forEach(child => {
            child.bindDataSource(dataSource);
        });
    }

    setGuiAttributes() {
        this.controller.setAttributesFromDefinition(this.def);
        this.setGuiAttributesImpl();
    }

    setGuiAttributesImpl() {
    }

    setDefaultGuiAttributes() {
        var model = this.guiModel;

        model.labelSize = defaultPropertiesRegistry.labelSize;
        model.inputSize = defaultPropertiesRegistry.inputSize;
        model.numberOfColumns = defaultPropertiesRegistry.numberOfColumns;
    }

    hasField() {
        return false;
    }

    hasLabel() {
        return false;
    }

    preventSizesSumInMax100() {
        if (this.hasChildren()) {
            this.children.forEach(child => {
                child.preventSizesSumInMax100();
            });
        }
    }

    /**
     * @private
     */
    toArray(iterable) {
        var result = [];
        for (let val of iterable) {
            result.push(val);
        }
        return result;
    }

    /**
     * @private
     */
    createComponentLocation(component, index) {
        var location = `${this.locationId}_${component.type}_${index}`;

        component.locationId = location;

        return this.target.find(`#${location}`);
    }

}

export default BaseGUICompositeComponent;
