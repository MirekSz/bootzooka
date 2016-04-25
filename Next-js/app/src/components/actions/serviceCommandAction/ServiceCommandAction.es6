/**
 * Created by bstanislawski on 2015-11-17.
 */
import BaseAction from '../BaseAction';

import ClientCommandDataSet from '../../../vedas/ClientCommandDataSet';
import _each from 'lodash/collection/each';
import enums from '../../../enums/GlobalEnums';
import dialogs from '../../../lib/rendering/Dialogs';
import FormWindow from '../../../sidow/window/windows/FormWindow';
import WindowArea from '../../../sidow/window/windowArea/WindowArea';

import DataSource from '../../../vedas/dataSource/DataSource';
import MetaDataSource from '../../../vedas/MetaDataSource/MetaDataSource';

import WindowAction from '../../../sidow/window/windowAction/WindowAction';
import SamilPanel from '../../../sidow/samilPanel/SamilPanelView';
import WindowOptions from '../../../sidow/window/WindowOptions';
import SamilPanelContentComponents from '../../../sidow/samilPanel/SamilPanelContentComponents';
import workbench from '../../../workbench/Workbench';
/**
 * @alias ServiceCommandActionExt
 * @property {string} resultToOutSocketId
 * @property {{fieldWithLinkConstantValueList:Array,fieldWithLinkSocketList:Array,
 *              editWindowBanerTitle:string,editWindowSaveButtonLabel:string,editWindowTitle:string,
 *              sendResultFieldToOutSocketDataList:Array}} setting
 * @property {object} logicalLocksConfiguration
 */

class ServiceCommandAction extends BaseAction {

    constructor(element) {
        super(element);
        this.extractSpecificData(element);
    }

    extractSpecificData(element) {
        this.actionExtension = element.actionExtension;
        this.windowSettings = new WindowSettings(element.actionExtension);

        this.windowContent = new WindowContent(element.actionExtension);

        this.serviceClass = element.actionExtension.serviceClass;
        this.dtoClass = element.actionExtension.dtoClass;
        this.flagsClass = element.actionExtension.flagsClass;

        this.dataSet = new ClientCommandDataSet(this.serviceClass, this.dtoClass, this.flagsClass);
        /**
         * @type {ServiceCommandActionExt}
         */
        this.def.actionExtension = this.def.actionExtension;
    }

    initializeImpl() {


//        this.dataSet.clientDataSetService.dtoClass = 'pl.com.stream.verto.cmm.currency.server.pub.exchangerate.main.nbploader.serviceforactionloader.NBPExchangerRateTableLoaderForActionCommandDto';
//        this.dataSet.clientDataSetService.flagsClass = 'pl.com.stream.verto.cmm.currency.server.pub.exchangerate.main.nbploader.serviceforactionloader.NBPExchangerRateTableLoaderForActionCommandFlags';

        return this.dataSet.initialize().then((definition)=> {
            this.metaDataSource = new MetaDataSource([definition]);
        });
    }

    /**
     * Const + Sockets
     */
    initParamsFromDef() {

    }

    prepare() {
        let dto = this.dataSet.createDTOFromFields();
        initializeConstValues(dto, this.actionExtension.setting.fieldWithLinkConstantValueList);
        initializeSocketValues(dto, this.actionExtension.setting.fieldWithLinkSocketList, this);
        return this.dataSet.prepare(dto);
    }

    executeImpl() {
        return this.prepare().then(() => {

            var actionExtension = this.def.actionExtension;
            var isShowQuestion = actionExtension.showQuestion;
            if (isShowQuestion && !this.getDisableQuestionBeforeAction()) {
                let callback = ()=> {
                    return this.executeAction();
                };
                dialogs.showConfirmation(actionExtension.question, {callback});
                return undefined;
            } else {
                return this.executeAction();
            }
        });
    }

    executeAction() {
        var customerDataSource = new DataSource(this.metaDataSource);

        customerDataSource.addDataSet(this.dataSet);

        let windowOptions = new WindowOptions(this.windowSettings.windowTitle, this.windowSettings.windowTitle, this.windowSettings.banerTitle);


        let window = new FormWindow('ServiceCommandActionWindow', windowOptions);
        let bodyArea = new WindowArea('body');

        const tab = this.windowContent.tabs[0];
        let customerBasicInfo = new SamilPanel('main', new SamilPanelContentComponents({
            model: tab.panel,
            dataSource: customerDataSource
        }), {name: tab.name});

        bodyArea.addComponent(customerBasicInfo);
        window.addBody(bodyArea);

        let sendAction = new WindowAction('send-action', this.windowSettings.editWindowSaveButtonName, () => {
            this.executeCommand();
            window.close();
        });

        window.addAction(sendAction);

        workbench.openWindow(window);

        return undefined;
    }

    executeCommand() {
        const dto = this.dataSet.createDTOFromFields();
        const outSocketDataList = this.actionExtension.setting.sendResultFieldToOutSocketDataList;
        return this.dataSet.execute(dto).then(response => {
            var responseObject = response;
            if (responseObject) {
                let responseClass = responseObject['@class'];
                if (responseClass === enums.SHOW_ACTION.WHAT_NEXT_CLASS) {
                    this.executeNextActions(responseObject);
                } else {
                    outSocketDataList.forEach((element)=> {
                        this.setMethodInvokerResultToOutputSocket(element.outSocketId, response.resultDto[element.resultDtoFieldName]);
                    });
                }
            }
            return responseObject;
        });
    }

    /**
     * @returns {WindowSettings}
     */
    getWindowSettings() {
        return this.windowSettings;
    }

    /**
     * @returns {WindowContent}
     */
    getWindowContent() {
        return this.windowContent;
    }

    getServiceClass() {
        return this.serviceClass;
    }
}

class WindowSettings {
    constructor(actionExtension) {
        this.banerTitle = actionExtension.setting.editWindowBanerTitle;
        this.editWindowSaveButtonName = actionExtension.setting.editWindowSaveButtonLabel;
        this.windowTitle = actionExtension.setting.editWindowTitle;
    }
}

class WindowContent {
    constructor(actionExtension) {
        this.panelHeader = actionExtension.panelHeader;
        this.panelFooter = actionExtension.panelFooter;
        this.tabs = [];

        for (let i = 0; i < actionExtension.content.mainPanels.length; i++) {
            let obj = actionExtension.content.mainPanels[i];
            let windowTab = new FormTab(obj);
            this.tabs.push(windowTab);
        }
    }
}

class FormTab {
    constructor(panel) {
        this.name = panel.name;
        this.panel = panel.panel;
    }
}

function initializeConstValues(dto, constParams) {
    _each(constParams, param => {
        dto[param.fieldName] = param.constantValue;
    });
}
function initializeSocketValues(dto, socketParams, socketProvider) {
    _each(socketParams, param => {
        let value = socketProvider.getInputSocketByName(param.socetId).getLastEvent();
        dto[param.fieldName] = value;
    });
}
export default ServiceCommandAction;
