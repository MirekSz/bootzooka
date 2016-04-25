/**
 * Created by bstanislawski on 2015-12-11.
 */
import defaultPropertiesRegistry from './DefaultPropertiesRegistry';
import BaseGUIViewController from './BaseGUIViewController';

import RenderingSupport from '../lib/rendering/RenderingSupport';

import {BindHandler} from './bindHandler/BindHandler';
import BaseGUIComponentView from './BaseGUIComponentView';
import ComponentBindingFieldListener from './bindHandler/ComponentBindingFieldListener';
import Field from './../vedas/dataSource/Field';
import ComponentBindHandlerApi from './ComponentBindHandlerApi';
import samilEnums from '../enums/SamilEnums';

class BaseGUIComponent {

    /**
     * @param {GUIElementDef} element
     * @param {Handlebars} template
     */
    constructor(element, template) {
        this.id = element.id;
        this.type = element.type;

        this.field = element.field || {id: this.id};
        this.guiModel = {id: this.id, mainSize: defaultPropertiesRegistry.mainSize, useAutoExpand: false};

        this.noField = element.noField;
        this.noLabel = element.noLabel;

        this.binding = element.binding;
        this.bindingId = element.bindingId;
        this.def = element;
        this.template = template;

        this.view = new BaseGUIComponentView(this);
        this.controller = new BaseGUIViewController(this);
        this.renderingSupport = new RenderingSupport(this);

        this.setTypeAttributes();

        this.addBindhandler();
        this.setAttributes();
    }

    /**
     * @private
     */
    setAttributes(field) {
        if (!this.attrs) {
            this.attrs = {};
            this.attrs.visible = true;
            this.attrs.required = true;
            this.attrs.editable = true;
        }
        if (field) {
            this.attrs.visible = field.isVisible();
            this.attrs.required = field.isRequired();
            this.attrs.editable = field.isEditable();

            this.value = field.getValue();

            this.attrs.precision = field.getPrecision();
            this.attrs.maxValue = field.getMaxValue();
            this.attrs.minValue = field.getMinValue();
        }
    }

    getBindHandler() {
        return this.bindHandler;
    }

    addBindhandler() {
        this.bindHandler = new BindHandler(this);
        this.bindHandler.addBindingFieldListener(new ComponentBindingFieldListener(this));
        this.bindHandlerApi = new ComponentBindHandlerApi(this.bindHandler, this);
    }

    setValue(value) {
        var noValueChange = !(this.value === undefined && value === '');
        if (this.value !== value && noValueChange) {
            this.value = value;
            this.bindHandlerApi.setValue(value);
        }
    }

    setActive() {
        this.bindHandlerApi.setActive();
    }

    setDeactive() {
        this.bindHandlerApi.setDeactive();
    }

    onValueChange(value) {
        this.setValue(value);
        this.reRender();
    }

    getValue() {
        return this.value;
    }

    doAfterRender(targetElement) {
        this.executeAfterRenderAttributes();
        this.doAfterRenderImpl(targetElement);
    }

    getGUIModel() {
        return this.guiModel;
    }

    valueModified() {
        this.bindHandlerApi.valueModified();
    }

    calculateGrid() {
        this.setDefaultGuiAttributes();
        this.setGuiAttributes();
    }

    renderTo(target) {
        this.view.setField100ifNoLabelAndNotInRow();
        this.view.preventMoreThen100InRow();
        this.view.renderTo(target);
    }

    renderToImpl() {
        var htmlElement = this.template({gui: this.guiModel, field: this.field, self: this, attrs: this.attrs});
        var targetElement = $(this.target);

        targetElement.html(htmlElement);

        this.doAfterRender(targetElement);
    }

    doAfterRenderImpl(targetElement) {
//        console.log('component rendered...');
    }

    reRender() {
        this.renderingSupport.reRender();
    }

    dispose() {
        this.disposeImpl(this.target);
        this.renderingSupport.dispose();
    }

    disposeImpl() {
        this.disposeListeners();
        kendo.destroy(this.target);
        this.target.html('');
    }

    disposeListeners() {
        this.bindHandler.dispose();
    }

    setDefaultGuiAttributes() {
        var model = this.guiModel;

        model.labelSize = defaultPropertiesRegistry.labelSize;
        model.numberOfColumns = defaultPropertiesRegistry.numberOfColumns;

        this.controller.setInputSize();
        if (this.field.label) {
            this.controller.setLabelMinSize(this.field.label);
        } else {
            this.controller.setLabelMinSize(this.id);
        }
        this.controller.distributeInputSizeIfNoFieldAndInRow();
        this.controller.distributeLabelSizeIfNoLabelAndInRow();

        this.setColumnNumbers();
    }

    setColumnNumbers() {
        this.columnsNumber = 0;

        if (!this.noLabel) this.columnsNumber++;
        if (!this.noField) this.columnsNumber++;
    }

    setTypeAttributes() {
    }

    setGuiAttributes() {
        this.controller.setAttributesFromDefinition(this.def);
        this.setGuiAttributesImpl();
    }

    setGuiAttributesImpl() {
        this.handleSpecificTemplate();
    }

    setBinding(binding) {
        this.binding = binding;
    }

    hasChildren() {
        return false;
    }

    hasLabel() {
        return !this.noLabel;
    }

    hasField() {
        return !this.noField;
    }

    getParentRow() {
        return this.parentRow;
    }

    getSiblings() {
        var result = [];
        if (this.guiModel.inRow) {
            var parent = this.getParentRow();

            parent.children.forEach(child => {
                if (child !== this) {
                    result.push(child);
                }
            });

            return result;
        } else {
            return result;
        }
    }

    preventSizesSumInMax100() {

    }

    bindDataSource(dataSource) {
        var binding = this.binding;
        var id = this.id;

        if (binding && id) {
            if (this.bindingId) {
                id = this.bindingId;
            }
            var dataSet = getProperDataSet(dataSource, binding);
            var field = getProperField(dataSet, id);
            if (field instanceof Field) {
                this.bindWithField(field);
            }
        } else if (id) {
            this.field.id = id;
        }
    }

    /**
     *
     * @param {Field} field
     */
    bindWithField(field) {
        this.field = field;
        this.bindHandler.bindField(field);
        this.setAttributes(field);
    }

    /**
     * @private
     */
    setDynamicProperties() {
        this.visible = this.bindHandler.isVisible();
    }

    addUIListeners(uIListenerBinder) {
        if (this.target.find('input').length > 0) {
            uIListenerBinder.addKeyDown(this.target.find('input'), e => {
                if (e.keyCode == 191) {
                    console.log('Field: ');
                    console.log(this.field);
                    e.preventDefault();
                }
            });
            this.addUIListenersImpl(uIListenerBinder);
        }
    }

    addUIListenersImpl(uIListenerBinder) {

    }

    /**
     * Set specific behavior for the component
     */
    setAttributeSpecialBehavior(attrValue, attrKey) {
    }

    /**
     * Execute attributes that need a rendered element
     */
    executeAfterRenderAttributes() {
        this.executeOccupyY();
    }

    /**
     * @private
     */
    executeOccupyY() {
        var occupyY = this.getGUIModel().occupyy;

        if (occupyY) {
            //$(this.target).css('height', occupyY + 'px');
        }
    }

    /**
     * @private
     */
    handleSpecificTemplate() {
        var guiModel = this.getGUIModel();

        if (guiModel.template === samilEnums.TEMPLATES.TOP) {
            guiModel.isTopTemplate = true;
        }
    }

}

function getProperField(dataSet, id) {
    if (dataSet.getFieldByName(id)) {
        return dataSet.getFieldByName(id);
    } else {
        console.warn('Wrong fieldList for object: ' + id);
        return undefined;
    }
}

function getProperDataSet(dataSource, binding) {
    if (dataSource) {
        if (dataSource.dataSetList) {
            var result = {};
            dataSource.dataSetList.forEach(dataSet => {
                if (dataSet.name === binding) {
                    result = dataSet;
                }
            });
            return result;
        } else {
            console.warn('Wrong dataSource for object: ' + this.id);
            return undefined;
        }
    } else {
        console.warn('Wrong dataSetList for object: ' + this.id);
        return undefined;
    }
}

export default BaseGUIComponent;
