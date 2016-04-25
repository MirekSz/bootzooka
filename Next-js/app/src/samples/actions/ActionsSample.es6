"use strict";
/**
 * Created by Mirek on 2016-01-29.
 */

import componentDefinitionRegistry from '../../componentsDefinitions/ComponentDefinitionRegistry';
import componentsFactory from '../../components/ComponentsFactory';
import ActionViewWrapper from '../../components/actions/ActionViewWrapper';
import WindowManager from '../../sidow/windowManager/WindowManager';
import ComposableWindow from '../../sidow/window/composableWindow/ComposableWindow';
import workbench from '../../workbench/Workbench';

const COMMAND_ACTION_ID = 'pl.com.stream.verto.cmm.plugin.currency-client.NBPExchangerRateTableLoaderAction';

export function actionSampleHandler() {
    var workspace = '#workspace';
    var actionComponentDef = componentDefinitionRegistry.getActionById(COMMAND_ACTION_ID);
    actionComponentDef.then((actionDef)=> {
        var commandAction = componentsFactory.createComponent(actionDef);
        var actionView = new ActionViewWrapper(commandAction);

        actionView.renderTo($(workspace));

        $("#workspace").append("<div class='win'></div>");

        const windowManager = new WindowManager("#workspace .win");
        windowManager.init();
        windowManager.show(new ComposableWindow('NBPCompsable'));

        console.log('workbench.currentWindowManager: ');
        console.log(workbench.currentWindowManager);
    });
}
