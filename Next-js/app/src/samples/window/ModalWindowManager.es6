"use strict";
/**
 * Created by Mirek on 2016-03-31.
 */
import BootstrapApi from '../../lib/rendering/BootstrapApi';

import ViewComponentDef from '../../componentsDefinitions/ViewComponentDef';
import ComponentsFactory from '../../components/ComponentsFactory';
import componentsDefinitionsTypes from '../../enums/ComponentsDefinitionsTypes';

class ModalWindowManager {

    /**
     * @param {Window} window
     */
    show(window) {
        let options = this.createModalOptions(window);

        BootstrapApi.showModal(options);
    }

    /**
     * @param {Window} window
     * @returns {Object} options
     */
    createModalOptions(window) {
        var options = {};

        options.window = window;
        options.id = window.options.windowTitle;
        options.model = {
            width: 'xl',
            smallTopBar: true,
            generatedWindow: true,
            modalBodyHeight: '540'
        };

        options.onshownCallback = onshownCallback;

        return options;
    }
}

export default new ModalWindowManager();

function onshownCallback(dialog, options) {
    const dialogBodyNode = '.bootstrap-dialog-body';
    const dialogFooterNode = '.bootstrap-dialog-footer';
    var $modalBody = dialog.$modalBody.find(dialogBodyNode);
    var $modalFooter = dialog.$modalFooter.find(dialogFooterNode);

    //make sure areas are empty
    $modalBody.empty();
    $modalFooter.empty();

    //create wrapper div
    $modalBody.html(`<div class='window-body'></div>`);
    let $targetNode = $modalBody.find('.window-body');

    //render views
    let view = createContent(options.window);

    view.window.setFooterTarget($modalFooter);
    view.renderTo($targetNode);
}

function createContent(window) {
    var windowTitle = window.options.windowTitle;
    let viewDef = new ViewComponentDef(windowTitle, componentsDefinitionsTypes.VIEWS.WINDOW_MODAL_COMPONENT);

    viewDef.addWindow(window);

    let view = ComponentsFactory.createComponent(viewDef);
    view.id = windowTitle;

    return view;
}
