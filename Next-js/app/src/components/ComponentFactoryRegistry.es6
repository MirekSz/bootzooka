/**
 * Created by bartosz on 21.05.15.
 *
 * Factory Registry class
 */
'use strict';

import ServiceMethodInvokerActionFactory from './actions/serviceMethodInvokerAction/ServiceMethodInvokerFactory';
import ServiceMethodInvokerFactory from './actions/serviceMethodInvokerAction/ServiceMethodInvokerFactory';
import ServiceCommandActionFactory from './actions/serviceCommandAction/ServiceCommandActionFactory';

import Types from '../enums/ComponentsDefinitionsTypes';

import TreeFactory from './views/tree/TreeFactory';
import TableFactory from './views/table/TableFactory';
import PanelElementFactory from './views/table/panel/PanelElementFactory';
import TestActionFactory from './actions/test/TestActionFactory';
import WindowPanelFactory from './views/windowPanel/WindowPanelFactory';
import ModalWindowPanelFactory from './views/windowPanel/ModalWindowPanelFactory';
import TestTableFactory from './views/table/test/TestTableFactory';

const ComponentFactoryRegistry = {

    getFactoryFor(objClass, type) {
        if (objClass === Types.FACTORY_TYPES.VIEW) {
            return this.elementsTypeResolver(type);
        } else if (objClass === Types.FACTORY_TYPES.ACTION) {
            return this.actionsTypeResolver(type);
        }
    },

    elementsTypeResolver(type) {
        if (type === Types.VIEWS.WINDOW_PANEL_COMPONENT) {
            return WindowPanelFactory;
        }
        if (type === Types.VIEWS.WINDOW_MODAL_COMPONENT) {
            return ModalWindowPanelFactory;
        }
        if (type === Types.VIEWS.TREE) {
            return TreeFactory;
        }
        if (type === Types.VIEWS.TABLE) {
            return TestTableFactory;
            // return PanelElementFactory;
        }
        if (type === Types.VIEWS.KENDO_TABLE) {
            return TableFactory;
        }
        return TestTableFactory;
        // return PanelElementFactory;
    },

    actionsTypeResolver(type) {
        if (type === Types.ACTIONS.SERVICE_METHOD_INVOKER_ACTION) {
            return ServiceMethodInvokerActionFactory;
        } else if (type === Types.ACTIONS.SERVICE_METHOD_INVOKER) {
            return ServiceMethodInvokerFactory;
        } else if (type === Types.ACTIONS.SERVICE_COMMAND_ACTION) {
            return ServiceCommandActionFactory;
        }
        return TestActionFactory;
    },

    getObjectClass(obj) {
        if (obj && obj.constructor && obj.constructor.toString) {
            var arr = obj.constructor.toString().match(
                /function\s*(\w+)/);

            if (arr && arr.length === 2) {
                return arr[1];
            }
        }
        return undefined;
    }

};

export default ComponentFactoryRegistry;
