/**
 *
 * Types Enums Object
 *
 **/
'use strict';

const ComponentsDefinitionsTypes = {

    FACTORY_TYPES: {
        VIEW: 'ViewComponentDef',
        ACTION: 'ActionComponentDef',
        OPTION: 'OptionDef',
        PERSPECTIVE: 'PortalDef',
        TEST_PERSPECTIVE: 'TestPortalDef',
        WINDOW_ACTION: 'WindowActionDef',
        GUI_COMPONENT_TREE: 'GUIComponentTree'
    },
    VIEWS: {
        TABLE: 'Table',
        KENDO_TABLE: 'KendoTable',
        TEST_TABLE: 'TestTable',
        TREE: 'Tree',
        PANEL_VIEW: 'PanelView',
        WINDOW_PANEL_COMPONENT: 'WindowPanelComponent',
        WINDOW_MODAL_COMPONENT: 'WindowModalComponent'
    },
    ACTIONS: {
        SERVICE_METHOD_INVOKER_ACTION: 'ServiceMethodInvokerAction',
        SERVICE_METHOD_INVOKER: 'ServiceMethodInvoker',
        SERVICE_COMMAND_ACTION: 'ServiceCommand',
        TEST_ACTION: 'TestAction',
        WINDOW_ACTION: 'WindowAction'
    },
    WINDOW_AREAS: {
        HEADER: 'header',
        BODY: 'body',
        FOOTER: 'footer'
    },
    OBJECT_TYPES: {}

};
export default ComponentsDefinitionsTypes;
