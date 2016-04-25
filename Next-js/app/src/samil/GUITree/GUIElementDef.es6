/**
 * Created by bstanislawski on 2015-12-14.
 */
import SAMIL_ENUMS from '../../enums/SamilEnums';
import _each from 'lodash/collection/each';

class GUIElementDef {

    /**
     * @param {String} [id]
     * @param {String} [type]
     * @param {Array} [children]
     * @param {Array} [xmlChildren]
     */
    constructor(id, type, children, xmlChildren) {
        this.id = id;
        this.type = type;

        this.xmlChildren = xmlChildren || [];

        this.childrenDefList = [];
        this.attributes = new Map();

        this.binding = undefined;
        this.groupBinding = undefined;

        this.setChildrenDefList(children);
    }

    /**
     * @param {String} binding
     */
    setGroupBinding(binding) {
        this.groupBinding = binding;

        this.childrenDefList.forEach(child => {
            this.setBinding(child);
        });
    }

    /**
     * @param {GUIElementDef} elementDef
     */
    addChild(elementDef) {
        if (this.groupBinding) {
            this.setBinding(elementDef);
        }
        this.childrenDefList.push(elementDef);
    }

    /**
     * @param {Array} children
     */
    setChildrenDefList(children) {
        if (children) {
            children.forEach(child => {
                this.addChild(child);
            });
        }
    }

    /**
     * @private
     */
    setBinding(elementDef) {
        if (!elementDef.binding) {
            elementDef.binding = this.groupBinding;
            elementDef.groupBinding = this.groupBinding;
        }

        elementDef.childrenDefList.forEach(child => {
            this.setBinding(child);
        });
    }

    buildFromJQuery(element) {
        this.id = $(element).attr(SAMIL_ENUMS.COMMON.ID);

        this.getChildren(element);
        this.getAttributes(element);
    }

    setDataSetBinding() {
        this.binding = this.attributes.get(SAMIL_ENUMS.COMMON.BINDING);

        if (this.binding) {
            var bindingArr = this.binding.split('.');
            this.binding = bindingArr[1];
            this.bindingId = bindingArr[2];
        } else {
            this.binding = this.groupBinding;
        }
    }

    isContainer() {
        return this.type.toLowerCase() === SAMIL_ENUMS.XML_ELEMENTS.CONTAINER;
    }

    isRow() {
        return this.type.toLowerCase() === SAMIL_ENUMS.XML_ELEMENTS.ROW;
    }

    isComponent() {
        return this.type.toLowerCase() === SAMIL_ENUMS.XML_ELEMENTS.COMPONENT;
    }

    getChildren(element) {
        var $element = $(element);
        var self = this;
        var childrenArr = [];
        var dataSetBinding;

        if ($element) {
            this.type = $element.prop(SAMIL_ENUMS.COMMON.TAG_NAME).toLowerCase();
            this.childrenDefList = $element.children();
        }

        if (this.isContainer() && $element) {
            dataSetBinding = $element.attr(SAMIL_ENUMS.COMMON.DATASET_BINDING);
        }

        var parentGroupBinding = this.groupBinding;

        _each(this.childrenDefList, el => {
            var childNode = self.getChild(el);

            if (childNode.isContainer()) {
                childNode.groupBinding = childNode.attributes.get(SAMIL_ENUMS.COMMON.DATASET_BINDING);
                if (!childNode.groupBinding) {
                    childNode.groupBinding = parentGroupBinding;
                }
            } else {
                childNode.setDataSetBinding();
                if (!childNode.binding) {
                    childNode.binding = parentGroupBinding;
                    childNode.groupBinding = parentGroupBinding;
                }
            }

            if (childNode.xmlChildren.length > 0) {
                _each(childNode.xmlChildren, nodeElement => {
                    this.createChildDefs(childNode, nodeElement);
                });
            }

            if (this.isContainer()) {
                childNode.dataSetName = dataSetBinding;
            }

            childrenArr.push(childNode);
        });

        this.childrenDefList = childrenArr;
    }

    createChildDefs(childNode, element) {
        this.createDef(childNode, element);

        _each(element.childrenDefList, child => {
            this.createDef(element, child);

            this.createChildDefs(element, child);
        });
    }

    createDef(childNode, element) {
        var node = new GUIElementDef();

        node.groupBinding = childNode.groupBinding;
        node.buildFromJQuery(element);
        node.setDataSetBinding();

        childNode.childrenDefList.push(node);
    }

    getAttributes(element) {
        var self = this;
        _each(element.attributes, attribute => {
            self.attributes.set(attribute.name, attribute.value);
        });
    }

    getChild(child) {
        var id = $(child).attr(SAMIL_ENUMS.COMMON.ID);
        var type = $(child).prop(SAMIL_ENUMS.COMMON.TAG_NAME);
        var xmlChildren = $(child).children();

        var node = new GUIElementDef(id, type, [], xmlChildren);

        node.getAttributes(child);

        return node;
    }

    hasChildren() {
        return this.childrenDefList.length > 0;
    }

    setFieldModel(metaDataSource) {
        if (this.binding) {
            var metaDataSet = this.getMetaDataSet(metaDataSource);

            if (metaDataSet) {
                this.field = this.getFieldDef(metaDataSet);
            }
        }
    }

    /**
     * @private
     */
    getMetaDataSet(metaDataSource) {
        var self = this;
        var result;
        metaDataSource.dataSetDefList.forEach(metaDataSet => {
            if (metaDataSet.name === self.binding) {
                result = metaDataSet;
            }
        });
        return result;
    }

    /**
     * @private
     */
    getFieldDef(metaDataSet) {
        var self = this;
        var result;
        metaDataSet.fieldDefList.forEach(fieldDef => {
            var id;

            if (self.bindingId) {
                id = self.bindingId;
            } else {
                id = self.id;
            }

            if (fieldDef.id === id) {
                result = fieldDef;
            }
        });
        return result;
    }

}

export default GUIElementDef;
