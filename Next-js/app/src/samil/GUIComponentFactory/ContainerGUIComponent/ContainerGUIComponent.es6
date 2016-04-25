/**
 * Created by bstanislawski on 2015-12-11.
 */
import BaseGUICompositeComponent from '../../BaseGUICompositeComponent';
import template from './container.hbs';
import samilEnums from '../../../enums/SamilEnums';
import defaultPropertiesRegistry from '../../DefaultPropertiesRegistry';

import EmptyRowCUIComponent from '../../../samil/GUIComponentFactory/EmptyRowGUIComponent/EmptyRowCUIComponent'

class ContainerGUIComponent extends BaseGUICompositeComponent {

    /**
     * @param {GUIElementDef} elementDef
     */
    constructor(elementDef) {
        super(elementDef);

        this.noLabel = true;

        this.isContainer = true;
        this.columnsNumber = 0;

        this.guiModel.preferedWidth = defaultPropertiesRegistry.preferedSizes.CONTAINER;
    }

    calculateGridImpl() {
        this.sizeCheck();
        this.setContainersList();
        this.setContainerRowsNumber();
        this.handleSpecificTemplate();
    }

    renderTo(target) {
        this.target = target;

        var htmlElement = template({gui: this.guiModel, field: this.field, self: this});
        var targetElement = $(this.target);

        targetElement.html(htmlElement);

        this.target = $(this.target).find('.container-element');

        this.renderChildren();
        this.doAfterRender(targetElement);
    }

    doCheckIfOnlyCheckboxesContainer() {
        this.guiModel.onlyCheckboxesContainer = true;

        this.checkIfOnlyCheckboxesContainer(this);
    }

    addEmptyRow() {
        var emptyRow = new EmptyRowCUIComponent();
        this.children.push(emptyRow);
    }

    /**
     * @private
     */
    sizeCheck() {
        var guiModel = this.getGUIModel();

        if (!guiModel.containerSize) {
            guiModel.containerSize = samilEnums.BOOTSTRAP.ROW_MAX_SIZE;
        }
    }

    /**
     * @private
     */
    checkIfOnlyCheckboxesContainer(element) {
        if (element.hasChildren()) {
            element.children.forEach(child => {
                if (child.hasChildren()) {
                    this.checkIfOnlyCheckboxesContainer(child);
                } else {
                    if (!child.isCheckbox) {
                        this.guiModel.onlyCheckboxesContainer = false;
                    }
                }
            });
        }
    }

    /**
     * @private
     */
    handleSpecificTemplate() {
        var guiModel = this.getGUIModel();

        if (guiModel.template === samilEnums.TEMPLATES.TITLED) {
            guiModel.containerTitle = this.field.id;
            guiModel.isTitledContainer = true;
        }
    }

    /**
     * @private
     */
    getNumberOfSiblings(element, elementNumberOfRows) {
        if (element.isContainer) {
            element.children.forEach(child => {
                if (child.isContainer) {
                    this.getNumberOfSiblings(child, elementNumberOfRows);
                } else {
                    elementNumberOfRows++;
                }
            });
        } else {
            elementNumberOfRows++;
        }
    }

    /**
     * @private
     */
    setContainersList() {
        this.containersList = [];

        if (this.hasChildren()) {
            this.children.forEach(child => {
                if (child.isContainer) {
                    this.containersList.push(child);
                }
            });
        }
    }

    /**
     * @private
     */
    setContainerRowsNumber() {
        this.containerRowsNumber = 0;

        if (this.hasChildren()) {
            this.children.forEach(child => {
                if (!child.isContainer && !child.isRow) {
                    this.containerRowsNumber++;
                }
            });
        }
    }

}

export default ContainerGUIComponent;
