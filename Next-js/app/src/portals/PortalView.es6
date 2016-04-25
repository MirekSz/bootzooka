/**
 * Created by bartosz on 22.09.15.
 *
 * PortalView class
 */
import SiteView from '../designer/SiteView';
import SiteController from '../designer/SiteController';
import PortalController from './PortalController';

import OptionDef from '../compositeComponentsDefinitions/OptionDef';
import optionDefinitionRegistry from '../compositeComponentsDefinitions/OptionDefinitionRegistry';

import OperatorDef from '../operator/OperatorDef';

import ContentElementsPanel from './models/ContentElementsPanel';
import PortalsDesignerView from './PortalsDesignerView';

import bs from '../lib/rendering/BootstrapApi';

import rendering from '../lib/rendering/RenderingProperties';

const ENTER_ASCI_CODE = 13;
const DELAY_TIME = 500;
const DELAY_FOCUS = 1000;

class PortalView {

    constructor() {
    }

    showSpinner(target) {
        if (!window.spinner) {
            window.spinner = new Spinner({top: '63%', color: '#62CB31'}).spin();
        }

        target.html(window.spinner.el);
    }

    removeSpinner() {
        if (window.spinner) {
            window.spinner.stop();
        }
    }

    setPortalEditorSideBar(page) {
        var siteView = new SiteView();
        var portalController = new PortalController();

        siteView.clearSideBar();

        let saveButton = {
            id: 'site-menu-save',
            icon: 'fa fa-floppy-o',
            text: 'Zapisz',
            page: page,
            handler: portalController.portalEditorSaveAction
        };

        let cancelButton = {
            id: 'site-menu-cancel',
            icon: 'fa fa-times',
            text: 'Anuluj',
            classes: 'bottom-align',
            animationClass: 'none',
            page: page,
            handler: portalController.portalEditorCancelAction
        };

        let areButtonsAlreadyAdded = $('#site-menu-save').length > 0;

        if (!areButtonsAlreadyAdded) {
            siteView.createSidebarElement(saveButton);
            siteView.createSidebarElement(cancelButton);
        } else {
            siteView.showSideBarElement(saveButton);
            siteView.showSideBarElement(cancelButton);
        }

    }

    showPanelsWithAnimation(args) {
        const TIME_OUT = 500;
        var self = this;
        var container = args.target;
        var panels = args.target.find('.beforeAnimation');
        var ids = [];

        for (let i = 0; i < panels.length; i++) {
            let panel = panels[i];

            ids.push($(panel).parent().attr('id'));
        }

        ids.forEach(id => {
            var siteView = new SiteView();
            var element = $(`div[id="${id}"]`);
            var $panel = $(element).find('.beforeAnimation');

            setTimeout(() => {
                $panel.removeClass('beforeAnimation');
                siteView.handleStandardPanelBehavior($panel);
            }, TIME_OUT);
        });

        if (args.permissionsModel) {

            args.permissionsModel.forEach(permissionElement => {
                self.showPermissionView(args, permissionElement);
            });

        }

        if (args.dataModel.permissionEnabled) {
            self.permissionsTabPanelsHandlers({container: container, context: args});
        } else {
            self.optionsTabPanelsHandlers({container: container, context: args});
        }
    }

    showSetNewOptionNamePanel(options) {
        var $optionsContainer = options.container;
        var $panel = $optionsContainer.find('.panel-default');
        var setNameTemplate = require('../designer/templates/new_option_set_name.hbs');
        var model = options.model || {};

        $panel.addClass('hidden');

        $optionsContainer.append(setNameTemplate(model)).promise().done(() => {
            var $panelContainer = $optionsContainer.find('.new-option-set-name-container');
            var $nameInput = $optionsContainer.find('#add-option-put-name');
            var $groupInput = $optionsContainer.find('#add-option-put-group');

            var positiveBtn = $optionsContainer.find('.positive-button');
            var negativeBtn = $optionsContainer.find('.negative-button');

            $optionsContainer.addClass('set-new-option-row');

            positiveBtn.click(e => {
                e.preventDefault();

                let name = $nameInput.val();
                let group = $groupInput.val();

                let optionDef = new OptionDef({
                    id: name,
                    name: name,
                    group: group
                });

                options.model.context.saveOptionDef(optionDef);
            });

            negativeBtn.click(e => {
                e.preventDefault();

                $optionsContainer.removeClass('set-new-option-row');

                $panelContainer.remove();
                $panel.removeClass('hidden');
            });

            $panelContainer.find('input').bind('keypress', e => {
                if (event.keyCode === ENTER_ASCI_CODE) {
                    e.preventDefault();
                    positiveBtn.click();
                }
            });
        });
    }

    optionsTabPanelsHandlers(args) {
        var self = this;
        var container = args.container;
        var context = args.context;
        var $optionTabContainer = $('#options-tab');

        var editButton = $optionTabContainer.find('.editBtn');
        var exportButton = $optionTabContainer.find('.exportBtn');
        var removeButton = $optionTabContainer.find('.removeBtn');

        var AddNewButton = container.find('#option-container-add-new').find('.addBtn');
        var ImportButton = container.find('#option-container-add-new').find('.importBtn');

        var collapseAllButton = $optionTabContainer.find('.toggle-collapse-all');

        editButton.click((e) => {
            e.preventDefault();
            var portalController = new PortalController();

            context.name = $(e.target).closest('.animated-panel').attr('optionId');

            portalController.showInteliUi(context);
        });

        exportButton.click((e) => {
            e.preventDefault();
        });

        removeButton.click((e) => {
            e.preventDefault();

            let siteController = new SiteController();
            let $panelContainer = $(e.target).closest('.panel-default').parent();

            let questionModel = {
                question: 'Czy na pewno chcesz usunąć tą opcję ?',
                positiveButton: 'Tak',
                negativeButton: 'Nie',
                cssClass: 'option-panel',
                context: context
            };

            siteController.showQuestion($panelContainer, questionModel, 'option');
        });

        AddNewButton.click((e) => {
            e.preventDefault();

            let siteController = new SiteController();
            let $panelContainer = $('#option-container-add-new');

            let setNameModel = {
                positiveButton: 'Zapisz',
                negativeButton: 'Anuluj',
                context: context
            };

            siteController.showSetNewOptionNamePanel($panelContainer, setNameModel);
        });

        ImportButton.click((e) => {
            e.preventDefault();

            let options = {
                id: 'import-option-modal',
                onshownCallback: function (dialog, options) {
                    //show body
                    var template = require('../inteliUi/templates/add_node.hbs');
                    var model = {};
                    var snippet = template(model);

                    dialog.$modalBody.html(snippet).promise().done(function () {
                        var filterInput = $(this).find('#filter-backend-content');
                        var contentList = $(this).find('.from-backend-content-list');

                        var delay = (() => {
                            var timer = 0;
                            return function (callback, ms) {
                                clearTimeout(timer);
                                timer = setTimeout(callback, ms);
                            };
                        })();

                        filterInput.keyup(() => {
                            delay(function () {
                                var filterText = $(filterInput).val();

                                if (filterText.length > 2) {
                                    let optionDefList = optionDefinitionRegistry.getOptions(filterText);

                                    optionDefList.then(response => {
                                        self.reloadOptionDefsList(contentList, response);
                                    });
                                }
                            }, DELAY_TIME);
                        });

                        contentList.click(e => {
                            var modal = $(e.target).parents().closest('.modal-dialog');
                            var buttonOK = modal.find('#btnSave');

                            buttonOK.removeClass('disabled');
                        });

                        contentList.dblclick(e => {
                            var modal = $(e.target).parents().closest('.modal-dialog');
                            var buttonOK = modal.find('#btnSave');

                            buttonOK.removeClass('disabled');

                            buttonOK.click();
                        });

                        setTimeout(() => {
                            filterInput.focus();
                        }, DELAY_FOCUS);
                    });
                },
                primaryButtonAction: function (dialog) {
                    var optionList = dialog.$modalBody.find('.from-backend-content-list');
                    var selected = optionList.find(':selected');
                    var selectedId = selected.attr('id');

                    optionDefinitionRegistry.getPlatformOptionById(selectedId).then(optionDef => {
                        context.addToModel(optionDef);
                        context.increasePositionNumber(context.dataModel);

                        context.reRender();
                    });
                }
            };

            bs.showModal(options);
        });

        collapseAllButton.click((e) => {
            e.stopPropagation();

            let icon = collapseAllButton.find('.fa');
            let panels = container.find('.panel-automatic');
            let addNewPanel = container.find('#option-container-add-new');

            if (icon.hasClass('fa-expand')) {
                container.addClass('all-elements-expand');
                container.removeClass('all-elements-collapse');

                icon.removeClass('fa-expand');
                icon.addClass('fa-bars');

                addNewPanel.removeClass('collapsed-panel');

                this.togglePanelsExpanding(panels);
            } else {
                container.addClass('all-elements-collapse');
                container.removeClass('all-elements-expand');

                icon.removeClass('fa-bars');
                icon.addClass('fa-expand');

                addNewPanel.addClass('collapsed-panel');

                this.togglePanelsExpanding(panels);
            }
        });

        self.autoCollapse(container, collapseAllButton);
    }

    permissionsTabPanelsHandlers(args) {
        var self = this;
        var container = args.container;

        var addButton = container.find('.addBtn');
        var saveButton = container.find('.saveBtn');
        var cancelButton = container.find('.cancelBtn');

        var selectPermissionKind = container.find('#select-kind-dd');
        var selectOperator = container.find('#select-operator-input');
        var selectGroup = container.find('#select-group-input');

        var operatorFormGroup = container.find('.operator-form-group');
        var groupFormGroup = container.find('.group-form-group');

        addButton.click((e) => {
            e.preventDefault();

            self.switchView(container);
        });

        saveButton.click((event) => {
            event.preventDefault();
            let portalId = container.parents().find('.basic-info-container').find('.stats-title').attr('portalId');

            let permissionData = {portalId: portalId};

            if (!operatorFormGroup.hasClass('hidden')) {
                permissionData.operator = selectOperator.val();
                permissionData.idOperator = selectOperator.attr('idOperator');
                permissionData.idPortalPermissionType = '1';
            } else if (!groupFormGroup.hasClass('hidden')) {
                permissionData.operationGroup = {name: selectGroup.val()};
                permissionData.idOperatorGroup = selectGroup.attr('idOperatorGroup');
                permissionData.idPortalPermissionType = '2';
            }

            self.addUserPermissionsAndSwitchView(container, permissionData);
        });

        cancelButton.click((e) => {
            e.preventDefault();

            self.switchView(container);
        });

        selectPermissionKind.find('li').click(e => {
            var value = $(e.target).text();
            var kind = $(e.target).attr('kind');
            var selectKindInput = $('#select-kind-input');

            selectKindInput.val(value);

            if (kind === 'select-operator') {
                operatorFormGroup.removeClass('hidden');

                if (!groupFormGroup.hasClass('hidden')) {
                    groupFormGroup.addClass('hidden');
                }
            } else if (kind === 'select-group') {
                groupFormGroup.removeClass('hidden');

                if (!operatorFormGroup.hasClass('hidden')) {
                    operatorFormGroup.addClass('hidden');
                }
            }
        });

        selectOperator.parent().find('.input-group-btn button').click(e => {
            e.preventDefault();

            self.showOperatorsModal(selectOperator);
        });

        selectGroup.parent().find('.input-group-btn button').click(e => {
            e.preventDefault();

            self.showGroupsModal(selectGroup);
        });
    }

    showOperatorsModal(selectOperator) {
        var self = this;

        var options = {
            id: 'select-operator-modal',
            onshownCallback: function (dialog, options) {
                //show body
                var siteController = new SiteController();
                var template = require('../inteliUi/templates/add_node.hbs');
                var model = {};
                var snippet = template(model);

                dialog.$modalBody.html(snippet).promise().done(function () {
                    var filterInput = $(this).find('#filter-backend-content');
                    var contentList = $(this).find('.from-backend-content-list');

                    var delay = (() => {
                        var timer = 0;
                        return function (callback, ms) {
                            clearTimeout(timer);
                            timer = setTimeout(callback, ms);
                        };
                    })();

                    filterInput.keyup(() => {
                        delay(function () {
                            var filterText = $(filterInput).val();

                            if (filterText.length > 2) {
                                siteController.getAvailableOperators(filterText).then(response => {
                                    var operators = [];

                                    response.forEach(operator => {
                                        operators.push(new OperatorDef(operator));
                                    });

                                    self.reloadOperatorsList(contentList, operators);
                                });
                            }
                        }, DELAY_TIME);
                    });

                    contentList.click(e => {
                        var modal = $(e.target).parents().closest('.modal-dialog');
                        var buttonOK = modal.find('#btnSave');

                        buttonOK.removeClass('disabled');
                    });

                    contentList.dblclick(e => {
                        var modal = $(e.target).parents().closest('.modal-dialog');
                        var buttonOK = modal.find('#btnSave');

                        buttonOK.removeClass('disabled');

                        buttonOK.click();
                    });

                    setTimeout(() => {
                        filterInput.focus();
                    }, DELAY_FOCUS);
                });
            },
            primaryButtonAction: function (dialog) {
                var optionList = dialog.$modalBody.find('.from-backend-content-list');
                var selected = optionList.find(':selected');
                var selectedId = selected.attr('id');

                selectOperator.parents().find('#select-operator-input').val(selected.text()).attr('idOperator', selectedId);
            }
        };

        bs.showModal(options);
    }

    switchView(container) {
        var buttonSelectorContainer = container.find('.buttons-sector');
        var contentContainer = container.find('.panel-content-body');

        buttonSelectorContainer.toggleClass('beforeAnimation');
        contentContainer.toggleClass('beforeAnimation');

        setTimeout(() => {
            if (buttonSelectorContainer.hasClass('beforeAnimation')) {
                buttonSelectorContainer.addClass('hidden');
                contentContainer.removeClass('hidden');
            } else {
                buttonSelectorContainer.removeClass('hidden');
                contentContainer.addClass('hidden');
            }

        }, rendering.ANIMATION.ANIMATION_DELAY_SLOW);
    }

    showGroupsModal(selectOperator) {
        var self = this;

        var options = {
            id: 'select-operator-modal',
            onshownCallback: function (dialog, options) {
                //show body
                var template = require('../inteliUi/templates/add_node.hbs');
                var model = {};
                var snippet = template(model);
                var siteController = new SiteController();

                dialog.$modalBody.html(snippet).promise().done(function () {
                    var filterInput = $(this).find('#filter-backend-content');
                    var contentList = $(this).find('.from-backend-content-list');

                    var delay = (() => {
                        var timer = 0;
                        return function (callback, ms) {
                            clearTimeout(timer);
                            timer = setTimeout(callback, ms);
                        };
                    })();

                    filterInput.keyup(() => {
                        delay(function () {
                            var filterText = $(filterInput).val();

                            if (filterText.length > 2) {
                                siteController.getAvailableGroups(filterText).then(groups => {
                                    self.reloadGroupsList(contentList, groups);
                                });
                            }
                        }, DELAY_TIME);
                    });

                    contentList.click(e => {
                        var modal = $(e.target).parents().closest('.modal-dialog');
                        var buttonOK = modal.find('#btnSave');

                        buttonOK.removeClass('disabled');
                    });

                    contentList.dblclick(e => {
                        var modal = $(e.target).parents().closest('.modal-dialog');
                        var buttonOK = modal.find('#btnSave');

                        buttonOK.removeClass('disabled');

                        buttonOK.click();
                    });

                    setTimeout(() => {
                        filterInput.focus();
                    }, DELAY_FOCUS);
                });
            },
            primaryButtonAction: function (dialog) {
                var optionList = dialog.$modalBody.find('.from-backend-content-list');
                var selected = optionList.find(':selected');
                var selectedId = selected.attr('id');
                var selectedVal = selected.text();

                selectOperator.parents().find('#select-group-input').val(selectedVal).attr('idOperatorGroup', selectedId);
            }
        };

        bs.showModal(options);
    }

    addUserPermissionsAndSwitchView(container, permissionData) {
        var controller = new PortalController();

        controller.addUserPermissions({
            container: container,
            userPermission: permissionData,
            callback: this.switchPermissionView
        });
    }

    setModel(elementModel) {
        var controller = new PortalController();

        elementModel = controller.setType(elementModel);
        elementModel = controller.setOperatorName(elementModel);

        return elementModel;
    }

    showPermissionView(contentElementPanel, elementModel) {
        var container = contentElementPanel.target;
        var userPermissionContainer = container.find('.buttons-sector').find('.user-permissions-container').find('.main-content-container');
        var permissionTemplate = require('../designer/templates/addPortal/panels/tabs/permissionElements/permission_element.hbs');

        //TODO: Get the operators from backend

        elementModel = this.setModel(elementModel);

        let snippet = permissionTemplate(elementModel);

        userPermissionContainer.append(snippet).promise().done(() => {
            var removeButton = userPermissionContainer.find('.removeBtn');
            var editButton = userPermissionContainer.find('.editBtn');

            removeButton.off();
            removeButton.click(e => {
                e.preventDefault();

                let permissionId = $(e.target).closest('.content-elements-container2').find('.stats-title').attr('permissionId');
                let permissionOwner = $(e.target).closest('.content-elements-container2').find('.stats-title').text();

                let siteController = new SiteController();
                let $panelContainer = $(e.target).closest('.panel-default').parent();

                let questionModel = {
                    question: `Czy na pewno chcesz usunąć uprawnienia dla ${permissionOwner} ?`,
                    positiveButton: 'Tak',
                    negativeButton: 'Nie',
                    cssClass: 'option-panel',
                    context: permissionId
                };

                siteController.showQuestion($panelContainer, questionModel, 'permission');
            });

            editButton.off();
            editButton.click(e => {
                e.preventDefault();

                console.log(e);
            });
        });
    }

    switchPermissionView(container, permissionId, portalId) {
        var self = new PortalView();
        var userPermissionContainer = container.find('.buttons-sector').find('.user-permissions-container').find('.main-content-container');
        var permissionTemplate = require('../designer/templates/addPortal/panels/tabs/permissionElements/permission_element.hbs');
        var model = self.getData(container, permissionId);
        var snippet = permissionTemplate(model);

        userPermissionContainer.append(snippet).promise().done(() => {
            var removeButton = userPermissionContainer.find('.removeBtn');
            var editButton = userPermissionContainer.find('.editBtn');

            self.switchView(container);

            removeButton.off();
            removeButton.click(event => {
                event.preventDefault();

                let permissionId = $(event.target).closest('.content-elements-container2').find('.stats-title').attr('permissionId');
                let permissionOwner = $(event.target).closest('.content-elements-container2').find('.stats-title').text();

                let siteController = new SiteController();
                let $panelContainer = $(event.target).closest('.panel-default').parent();

                let questionModel = {
                    question: `Czy na pewno chcesz usunąć uprawnienia dla ${permissionOwner} ?`,
                    positiveButton: 'Tak',
                    negativeButton: 'Nie',
                    cssClass: 'option-panel',
                    context: permissionId,
                    portalId: portalId
                };

                siteController.showQuestion($panelContainer, questionModel, 'permission');
            });

            editButton.off();
            editButton.click(event => {
                event.preventDefault();

                console.log(event);
            });
        });
    }

    getData(container, permissionId) {
        var model = {};
        var kind = container.find('#select-kind-input');
        var group = container.find('#select-group-input');
        var operator = container.find('#select-operator-input');

        if (!container.find('.group-form-group').hasClass('hidden')) {
            model.operationGroup = {name: group.val()};
            model.isGroup = true;
        } else if (!container.find('.operator-form-group').hasClass('hidden')) {
            model.operator = {name: operator.val()};
            model.isOperator = true;
        }

        model.idPermission = permissionId.id;

        return model;
    }

    /**
     * Method to reload optionDefs
     *
     * @param contentList
     * @param data
     */
    reloadOptionDefsList(contentList, data) {
        contentList.empty();

        data.forEach((element) => {
            var option = $('<option />');

            option.attr('id', element.optionDef.id);
            option.val(element.optionDef.name);
            option.text(element.optionDef.name);

            contentList.append(option);
        });
    }

    /**
     * Method to reload operators
     *
     * @param contentList
     * @param data
     */
    reloadOperatorsList(contentList, data) {
        contentList.empty();

        data.forEach((element) => {
            var option = $('<option />');

            option.attr('id', element.idOperator);
            option.val(element.nameToShow);
            option.text(element.nameToShow);

            contentList.append(option);
        });
    }

    /**
     * Method to reload groups
     *
     * @param contentList
     * @param data
     */
    reloadGroupsList(contentList, data) {
        contentList.empty();

        data.forEach((element) => {
            var option = $('<option />');

            option.attr('id', element.idOperatorGroup);
            option.attr('active', element.active);
            option.val(element.name);
            option.text(element.name);

            contentList.append(option);
        });
    }

    /**
     * Check if there is more then 5 options
     * if yes collapse all
     *
     * @private
     *
     * @param container
     * @param collapseAllButton
     */
    autoCollapse(container, collapseAllButton) {
        var optionsNumber = container.find('.panel-automatic').length;

        if (optionsNumber > 5) {
            setTimeout(() => {
                collapseAllButton.click();
            }, 1000);
        }
    }

    /**
     * @private
     *
     * @param panels
     */
    togglePanelsExpanding(panels) {
        for (var i = 0; i < panels.length; i++) {
            var panelHideBtn = $(panels[i]).find('.showhide');

            panelHideBtn.click();
        }
    }

    setAddPanelBasicInfoHandler() {
    }

    setEditPanelBasicInfoHandler() {
    }

    setAddPanelContentElementsHandler(targetContainer, panelModel) {
        var $desktopTabButton = targetContainer.find('#desktop-tab-trigger');
        var $optionsTabButton = targetContainer.find('#options-tab-trigger');
        var $permissionsTabButton = targetContainer.find('#permissions-tab-trigger');

        var $desktopTab = targetContainer.find('#desktop-tab');
        var $optionsTab = targetContainer.find('#options-tab');
        var $permissionsTab = targetContainer.find('#permissions-tab');

        $desktopTabButton.click(() => {
            var isInit = !$desktopTabButton.hasClass('initiated');

            if (isInit) {
                var desktopTab = new ContentElementsPanel({
                    template: require('../designer/templates/addPortal/panels/tabs/desktop_tab.hbs'),
                    model: {
                        hasDesktop: true
                    },
                    target: $desktopTab
                });

                desktopTab.render();

                $desktopTabButton.addClass('initiated');
            }
        });

        $optionsTabButton.click(() => {
            var isInit = !$optionsTabButton.hasClass('initiated');

            if (isInit) {
                var optionsTab = new ContentElementsPanel({
                    target: $optionsTab,
                    template: require('../designer/templates/addPortal/panels/tabs/options_tab.hbs'),
                    isNewPortalFlow: true,
                    parentPanel: panelModel
                });

                optionsTab.getOptionsFromBackend().then(data => {
                    optionsTab.render();
                });

                $optionsTabButton.addClass('initiated');
            }
        });

        $permissionsTabButton.click(() => {
            var isInit = !$permissionsTabButton.hasClass('initiated');

            if (isInit) {
                var permissionsTab = new ContentElementsPanel({
                    template: require('../designer/templates/addPortal/panels/tabs/permissions_tab.hbs'),
                    target: $permissionsTab
                });

                permissionsTab.render();

                $permissionsTabButton.addClass('initiated');
            }
        });

        //open option tab
        $optionsTabButton.click();
    }

    setEditPanelContentElementsHandler(targetContainer, panelModel) {
        var $desktopTabButton = targetContainer.find('#desktop-tab-trigger');
        var $optionsTabButton = targetContainer.find('#options-tab-trigger');
        var $permissionsTabButton = targetContainer.find('#permissions-tab-trigger');

        var $desktopTab = targetContainer.find('#desktop-tab');
        var $optionsTab = targetContainer.find('#options-tab');
        var $permissionsTab = targetContainer.find('#permissions-tab');

        $desktopTabButton.click(() => {
            var isInit = !$desktopTabButton.hasClass('initiated');

            if (isInit) {
                var desktopTab = new ContentElementsPanel({
                    template: require('../designer/templates/addPortal/panels/tabs/desktop_tab.hbs'),
                    model: {
                        hasDesktop: true
                    },
                    target: $desktopTab
                });

                desktopTab.render();

                $desktopTabButton.addClass('initiated');
            }
        });

        $optionsTabButton.click(() => {
            var isInit = !$optionsTabButton.hasClass('initiated');

            if (isInit) {
                var optionsTab = new ContentElementsPanel({
                    target: $optionsTab,
                    template: require('../designer/templates/addPortal/panels/tabs/options_tab.hbs'),
                    isNewPortalFlow: false,
                    portalId: panelModel.portalId,
                    parentPanel: panelModel
                });

                optionsTab.getOptionsFromBackend().then(data => {
                    optionsTab.render();
                });

                $optionsTabButton.addClass('initiated');
            }
        });

        $permissionsTabButton.click(() => {
            var isInit = !$permissionsTabButton.hasClass('initiated');

            if (isInit) {
                var permissionsTab = new ContentElementsPanel({
                    template: require('../designer/templates/addPortal/panels/tabs/permissions_tab.hbs'),
                    target: $permissionsTab,
                    dataModel: {permissionEnabled: true},
                    isNewPortalFlow: false,
                    portalId: panelModel.portalId
                });

                permissionsTab.getPermissionsFromBackend().then(data => {
                    permissionsTab.render();
                });

                $permissionsTabButton.addClass('initiated');
            }
        });

        //open option tab
        $optionsTabButton.click();
    }

    /**
     * Handle the add and import new panel
     */
    setAddNewPanelHandlers() {
        var designerView = new PortalsDesignerView();
        var activePanel = $('#grid-active-container');
        var addButton = activePanel.find('.addBtn');
        var importButton = activePanel.find('.importBtn');

        addButton.click(() => {
            designerView.handleAddPanel();
        });

        importButton.click(() => {
            designerView.handleImportPanel();
        });
    }

}

export default PortalView;
