/**
 * Created by bstanislawski on 2015-12-11.
 */
import SAMIL_ENUMS from '../../enums/SamilEnums';

import GUIComponentTreeDef from '../GUIComponentTreeDef/GUIComponentTreeDef';
import GUIComponentTree from '../GUIComponentTree/GUIComponentTree';
import _each from 'lodash/collection/each';

import containerGUIComponentFactory from './ContainerGUIComponent/ContainerGUIComponentFactory';
import rowGUIComponentFactory from './RowGUIComponent/RowGUIComponentFactory';
import springGUIComponentFactory from './SpringGUIComponent/SpringGUIComponentFactory';
import tabSetGUIComponentFactory from './TabSetGUIComponent/TabSetGUIComponentFactory';
import tabGUIComponentFactory from './TabGUIComponent/TabGUIComponentFactory';
import splitGUIComponentFactory from './SplitGUIComponent/SplitGUIComponentFactory';
import splitSetGUIComponentFactory from './SplitSetGUIComponent/SplitSetGUIComponentFactory';

import separatorGUIComponentFactory from './SeparatorGUIComponent/SeparatorGUIComponentFactory';
import inputGUIComponentFactory from './InputGUIComponent/InputGUIComponentFactory';
import checkboxGUIComponentFactory from './CheckboxGUIComponent/checkboxGUIComponentFactory';
import numericGUIComponentFactory from './NumericGUIComponent/NumericGUIComponentFactory';
import dateGUIComponentFactory from './DateGUIComponent/DateGUIComponentFactory';
import dictionaryGUIComponentFactory from './DictionaryGUIComponent/DictionaryGUIComponentFactory';

import textAreaGUIComponentFactory from './TextAreaGUIComponent/TextAreaGUIComponentFactory';

class GUIComponentFactoryRegistry {

    createGUIComponentTree(guiTree) {
        var guiComponentTreeDef = new GUIComponentTreeDef(guiTree);

        guiComponentTreeDef.connectGUIElementsWithMetaData();

        var rootElement = guiComponentTreeDef.getRootElement();

        rootElement.childrenDefList.forEach(element => {
            var guiComponent = this.createGUIComponent(element);

            if (!guiComponent) console.warn('Component factory has not been selected, probably the component type is not supported yet...');

            guiComponentTreeDef.components.push(guiComponent);

            this.proceedWithChildren(guiComponent);
        });

        return new GUIComponentTree(guiComponentTreeDef);
    }

    /**
     * @private
     */
    proceedWithChildren(guiComponent) {
        if (guiComponent.hasChildren()) {
            _each(guiComponent.childrenDefList, child => {
                var guiChildComponent = this.createGUIComponent(child);

                guiComponent.children.push(guiChildComponent);

                this.proceedWithChildren(guiChildComponent);
            });
        }
    }

    /**
     * @priavte
     */
    createGUIComponent(element) {
        var guiComponent;
        var factory = this.getFactoryFor(element);

        if (factory) {
            guiComponent = factory.build(element);

            guiComponent.setBinding(element.binding);
        }

        return guiComponent;
    }

    /**
     * @private
     */
    getFactoryFor(element) {
        var elementType = element.type.toLowerCase();

        if (elementType === SAMIL_ENUMS.XML_ELEMENTS.CONTAINER) {
            element.type = SAMIL_ENUMS.XML_ELEMENTS.CONTAINER;

            return containerGUIComponentFactory;
        } else if (elementType === SAMIL_ENUMS.XML_ELEMENTS.ROW) {
            element.type = SAMIL_ENUMS.COMPONENT_TYPES.ROW;

            return rowGUIComponentFactory;
        } else if (elementType === SAMIL_ENUMS.XML_ELEMENTS.SPRING) {
            element.type = SAMIL_ENUMS.XML_ELEMENTS.SPRING;

            return springGUIComponentFactory;

        } else if (elementType === SAMIL_ENUMS.XML_ELEMENTS.TAB_SET) {
            element.type = SAMIL_ENUMS.XML_ELEMENTS.TAB_SET;

            return tabSetGUIComponentFactory;

        } else if (elementType === SAMIL_ENUMS.XML_ELEMENTS.TAB) {
            element.type = SAMIL_ENUMS.XML_ELEMENTS.TAB;

            return tabGUIComponentFactory;
        } else if (elementType === SAMIL_ENUMS.XML_ELEMENTS.COMPONENT) {
            element.type = SAMIL_ENUMS.XML_ELEMENTS.COMPONENT;

            var elementClass = element.attributes.get('class');
            var elementTemplate = element.attributes.get('template');

            if (elementTemplate) {
                return this.getFactoryByTemplate(element, elementTemplate, elementClass);
            } else if (elementClass) {
                return this.getFactoryByClass(element, elementClass, elementTemplate);
            } else {
                return this.getFactoryForComponentType(element);
            }
        } else if (elementType === SAMIL_ENUMS.XML_ELEMENTS.SPLIT) {
            element.type = SAMIL_ENUMS.XML_ELEMENTS.SPLIT;

            return splitGUIComponentFactory;
        } else if (elementType === SAMIL_ENUMS.XML_ELEMENTS.SPLIT_SET) {
            element.type = SAMIL_ENUMS.XML_ELEMENTS.SPLIT_SET;

            return splitSetGUIComponentFactory;
        } else {
            return inputGUIComponentFactory;
        }
    }

    /**
     * @private
     */
    getFactoryByClass(element, elementClass, elementTemplate) {
        var classes = elementClass.split(',');
        var factory;

        for (var index = 0; index < classes.length; index++) {
            var elClass = classes[index];

            elClass = elClass.toLowerCase();

            if (elClass === SAMIL_ENUMS.COMPONENT_TYPES.SEPARATOR) {
                element.type = SAMIL_ENUMS.XML_ELEMENTS.COMPONENT;

                return separatorGUIComponentFactory;
            } else if (elClass === SAMIL_ENUMS.COMPONENT_TYPES.LABEL) {
                element.type = SAMIL_ENUMS.XML_ELEMENTS.COMPONENT;

                classes.forEach(classElement => {
                    if (classElement === SAMIL_ENUMS.COMPONENT_TYPES.FIELD) {
                        factory = this.getFactoryForComponentType(element);
                    }
                });

                if (!factory) {
                    element.noField = true;
                    factory = this.getFactoryForComponentType(element);
                }

                return factory;
            } else if (elClass === SAMIL_ENUMS.COMPONENT_TYPES.FIELD) {
                element.type = SAMIL_ENUMS.XML_ELEMENTS.COMPONENT;

                classes.forEach(classElement => {
                    if (classElement === SAMIL_ENUMS.COMPONENT_TYPES.LABEL) {
                        factory = this.getFactoryForComponentType(element);
                    }
                });

                if (!factory) {
                    if (elementTemplate) {
                        factory = this.getFactoryByTemplate(element, elementTemplate);
                    } else {
                        element.noLabel = true;
                        factory = this.getFactoryForComponentType(element);
                    }
                }

                return factory;
            } else {
                return inputGUIComponentFactory;
            }
        }
    }

    /**
     * @private
     */
    getFactoryForComponentType(element) {
        var elementModel = element.field;

        if (elementModel) {
            if (elementModel.type) {
                var elementType = elementModel.type.toLowerCase();

                if (elementType === SAMIL_ENUMS.COMPONENT_TYPES.INPUT) {
                    return inputGUIComponentFactory;
                } else if (elementType === SAMIL_ENUMS.COMPONENT_TYPES.CHECKBOX) {
                    return checkboxGUIComponentFactory;
                } else if (elementType === SAMIL_ENUMS.COMPONENT_TYPES.NUMERIC || elementType === SAMIL_ENUMS.FIELD_DATA_TYPES.INTEGER) {
                    return numericGUIComponentFactory;
                } else if (elementType === SAMIL_ENUMS.FIELD_DATA_TYPES.DATETIME || elementType === SAMIL_ENUMS.FIELD_DATA_TYPES.DATE || elementType === SAMIL_ENUMS.FIELD_DATA_TYPES.TIME) {
                    return dateGUIComponentFactory;
                } else if (elementType === SAMIL_ENUMS.XML_ELEMENTS.LONG) {
                    return dictionaryGUIComponentFactory;
                } else if (elementType === SAMIL_ENUMS.TEMPLATES.MEMO) {
                    return textAreaGUIComponentFactory;
                } else {
                    return inputGUIComponentFactory;
                }
            } else {
                console.warn(`Element doesn't have field attributes, probably there is a problem with dataSet binding... ${elementModel}`);
                return inputGUIComponentFactory;
            }
        } else {
            return inputGUIComponentFactory;
        }
    }

    getFactoryByTemplate(element, elementTemplate, elementClass) {
        var template = elementTemplate.toLowerCase();

        if (elementClass === SAMIL_ENUMS.COMMON.LABEL) {
            element.noField = true;
        } else if (elementClass === SAMIL_ENUMS.COMMON.FIELD) {
            element.noLabel = true;
        }

        if (template === SAMIL_ENUMS.TEMPLATES.MEMO) {
            return textAreaGUIComponentFactory;
        } else {
            return inputGUIComponentFactory;
        }
    }

}

export default new GUIComponentFactoryRegistry();
