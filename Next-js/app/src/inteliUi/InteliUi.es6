/**
 * Created by bartosz on 06.07.15.
 *
 * InitiUi Facade class
 */
import BasicMethodSet from './BasicMethodsSet';
import InteliUiView from './InteliUiView';
import InputConverter from './converters/InputConverter';
import OutputConverter from './converters/OutputConverter';
import InteliUiEntity from './entity/InteliUiEntity';
import InteliUiApi from './facade/InteliUiApi';
import {eventBus, events} from '../lib/EventBus';

import optionDefinitionRegistry from '../compositeComponentsDefinitions/OptionDefinitionRegistry';
import compositionFactory from '../compositeComponents/TestCompositionFactory';

import PortalView from '../portals/PortalView';

class InteliUi extends BasicMethodSet {

    constructor() {
        super();
        this.connections = [];
        this.fields = [];
        this.palette = [];
        this.view = new InteliUiView();
        this.optionId;

        this.idRegister = 0;
    }

    setOptionId(id) {
        this.optionId = id;
    }

    getOptionId() {
        return this.optionId;
    }

    setPalette(palette) {
        this.palette = palette;
    }

    setDefaultFields(fields) {
        this.fields = fields;
    }

    setDefaultConnections(connections) {
        this.connections = connections;
    }

    getWorkspace() {
        var workspace = this.diagramBuilder.toJSON();

        workspace.palette = this.palette;

        return workspace;
    }

    renderEditorTo(target) {
        this.target = target;

        this.view.render(this);
    }

    showResult() {
        this.view.showResult(this.getWorkspace());
    }

    showIndicator() {
        eventBus.send(events.GLOBAL_EVENT.ASYNCH_START);
    }

    removeIndicator() {
        eventBus.send(events.GLOBAL_EVENT.ASYNCH_END);
    }

    createURL(inteliUi) {
        var fileDir = URL.createObjectURL(inteliUi.uploadedFile);

        inteliUi.showIndicator();

        inteliUi.openFromFile({fileDir: fileDir, inteliUi: inteliUi});
    }

    openFromFile(options) {
        var entity = new InteliUiEntity();
        var inputConverter = new InputConverter();

        var jsonOption = entity.getObject(options.fileDir);
        var object = JSON.parse(jsonOption);

        inputConverter.openOptionFromFile(object, options.inteliUi);
    }

    openEmptyOption(callback) {
        var inputConverter = new InputConverter();
        var inputAttributes = {};

        inputAttributes.palette = inputConverter.getPalette();

        callback(inputAttributes, this);
    }

    openOption(optionId, callback) {
        var optionById = optionDefinitionRegistry.getPlatformOptionById(optionId, true);

        optionById.then((optionDef) => {
            var option = compositionFactory.createOption(optionDef);
            var inputConverter = new InputConverter();
            var inputAttributes = {};

            inputAttributes.palette = inputConverter.getPalette();
            inputAttributes.connections = inputConverter.getConnections(option);
            inputAttributes.fields = inputConverter.getFields(option);
            inputAttributes.optionId = option.id;

            callback(inputAttributes, this);
        });
    }

    startInteliUi(inputAttributes, self) {
        self.setPalette(inputAttributes.palette);
        self.setDefaultConnections(inputAttributes.connections);
        self.setDefaultFields(inputAttributes.fields);
        self.setOptionId(inputAttributes.optionId);

        self.renderEditorTo(self.inteliUiTarget);
    }

    /**
     * Close the InteliUi modal
     */
    closeInteliUiModal() {
        $(this.target.boxContainer).parents().find('.modal-content').find('#btnClose').click();
    }

    /**
     * Method to set the proper handler
     *
     * @param event
     * @param trigger
     * @param handler
     */
    setHandler(event, trigger, handler) {
        trigger.off();
        trigger.on(event, handler);
    }

    /**
     * Get the option and render it on workspace.
     *
     * Just run the open option flow.
     */
    getOption() {
        const self = this;
        var workspace = this.getWorkspace();
        var outputConverter = new OutputConverter();

        return outputConverter.convertToNextOption(workspace, self);
    }

    renderOption(option) {
        var target = $('#workspace');

        option.renderTo(target);
    }

    /**
     * Method to show the inteliUi modal
     *
     * @param dialog
     * @param options
     */
    showInteliUiInModal(dialog, options) {
        if (options.context) {
            window.inteliUiContext = options.context;
        }

        this.inteliUi.view.showInteliUiInModal(dialog, options);
    }

    /**
     * Handle the option in InteliUi main menu
     */
    handleInteliUiMenu() {
        //import InteliUI API to be able to communicate with the editor
        var inteliUiApi = new InteliUiApi();
        var container = $('#inteliUi-container');

        //start empty inteliUi
        $('#inteliui-start').click(() => {
            inteliUiApi.startEmptyInteliUi(container);
        });

        //start empty inteliUi
        $('#inteliui-start-and-open-file').click(() => {
            inteliUiApi.startInteliUiWithOptionFromFile(container);
        });

        $('#export-option').click(() => {
            inteliUiApi.getOptionFromWorkspace(container);
        });

    }

    setEditNode(editNode) {
        this.editNode = editNode;
    }

    getEditNode() {
        return this.editNode;
    }

    removeEditNode() {
        this.editNode = undefined;
    }

    setNodesModel(data) {
        this.nodesModel = data;
    }

    getNodesModel() {
        return this.nodesModel;
    }

    removeNodesModel() {
        this.nodesModel = undefined;
    }

    setSuggestedFlowCallback(callback) {
        this.suggestedFlowCallback = callback;
    }

    getSuggestedFlowCallback() {
        return this.suggestedFlowCallback;
    }

    removeSuggestedFlowCallback() {
        this.suggestedFlowCallback = undefined;
    }

    saveAndExit(args) {
        args.inteliUi.getOption().then(optionDef => {
            optionDef.name = window.inteliUiContext.name;
            optionDef.id = window.inteliUiContext.name;
            optionDef.group = this.getGroupFromContext(window.inteliUiContext);

            window.inteliUiContext.saveEditOptionDef(optionDef).then(res => {
                args.inteliUi.closeInteliUiModal();
            });
        });

    }

    getGroupFromContext(inteliUiContext) {
        var result;
        var options = inteliUiContext.dataModel.options;

        options.forEach(option => {
            if (option.id === inteliUiContext.name) {
                result = option.group;
            }
        });

        return result;
    }

    /**
     * Method to generate the unique inOptionId for the elements
     *
     * @param id
     * @return String inOptionId
     */
    createIdInOption(id) {
        var idInOption = `${id}#${this.idRegister}`;
        this.idRegister++;

        return idInOption;
    }
}

export default InteliUi;
