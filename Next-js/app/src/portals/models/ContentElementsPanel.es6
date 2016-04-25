/**
 * Created by bartosz on 23.09.15.
 *
 * ContentElementsPanelModel class
 */
import OptionDefinitionRegistry from '../../compositeComponentsDefinitions/OptionDefinitionRegistry';
import PortalDefinitionRegistry from '../../compositeComponentsDefinitions/PortalDefinitionRegistry';

import PortalView from '../PortalView';
import SiteController from '../../designer/SiteController';

import BasicMethodsSet from '../../inteliUi/BasicMethodsSet';

class ContentElementsPanel extends BasicMethodsSet {

    constructor(args) {
        super();

        this.model = args.model || {};
        this.template = args.template;
        this.target = args.target;

        this.dataModel = args.dataModel || {options: []};
        this.permissionsModel = args.permissionsModel || [];

        this.isNewPortalFlow = args.isNewPortalFlow;
        this.portalId = args.portalId;
        this.parentPanel = args.parentPanel;

        if (args && args.dontShowFooterContainer === undefined) {
            args.dontShowFooterContainer = true;
        }

        if (this.parentPanel) {
            this.parentPanel.addTab(this);
        }

        this.view = new PortalView();
    }

    /**
     * Add optionDef to the data model
     *
     * @param optionDef
     */
    addToModel(optionDef) {
        if (this.dataModel.options === undefined) {
            this.dataModel.options = [];

            this.dataModel.options.push(optionDef);
        } else {
            this.dataModel.options.push(optionDef);
        }
    }

    /**
     * Update optionDef in the model
     *
     * @param optionDef
     */
    updateModel(optionDef) {
        try {
            if (this.dataModel.options) {
                var options = this.dataModel.options;

                options.forEach(option => {
                    if (option.id === optionDef.id) {
                        super.removeFromArray(options, option);

                        options.push(optionDef);
                    }
                });
            }
        } catch (e) {
            console.log('no dataModel');
        }
    }

    /**
     * Add permission to the data model
     *
     * @param operatorToAdd
     */
    AddToPermissionsModel(operatorToAdd) {
        var permissions = this.permissionsModel;

        if (permissions.length > 0) {
            permissions.forEach(operator => {
                if (operatorToAdd.idPermission === operator.idPermission) {
                    super.removeFromArray(permissions, operator);
                }
            });

            permissions.push(operatorToAdd);
        } else {
            permissions.push(operatorToAdd);
        }

    }

    /**
     * Remove form the model
     *
     * @param id
     */
    RemoveFromModel(id) {
        try {
            if (this.dataModel.options) {
                var options = this.dataModel.options;

                options.forEach(option => {
                    if (option.id === id) {
                        super.removeFromArray(options, option);
                    }
                })
            }
        } catch (e) {
            console.log('no dataModel');
        }
    }

    /**
     * Universal method to render the tab
     */
    render() {
        var self = this;
        var view = new PortalView();

        this.view.showSpinner(this.target);

        var snippet = this.template(this.dataModel);

        this.target.html(snippet).promise().done(() => {
            self.view.removeSpinner();

            view.showPanelsWithAnimation(self);
        });
    }

    /**
     * Method to refresh the tab
     */
    reRender() {
        this.parentPanel.updateTab(this);

        this.render();
    }

    /**
     * Method to save the option definition
     *
     * @param optionDef
     */
    saveOptionDef(optionDef) {
        return new Promise(resolve => {
            var self = this;

            this.addToModel(optionDef);
            this.increasePositionNumber(this.dataModel);

            OptionDefinitionRegistry.add(optionDef).then(res => {
                self.reRender();

                resolve();
            });
        });
    }

    /**
     * Method to save the option definition after editing
     *
     * @param optionDef
     */
    saveEditOptionDef(optionDef) {
        return new Promise(resolve => {
            var self = this;

            this.updateModel(optionDef);
            this.increasePositionNumber(this.dataModel);

            OptionDefinitionRegistry.update(optionDef).then(res => {
                self.reRender();

                resolve();
            });
        });
    }

    /**
     * Universal method to get options from backend
     */
    getOptionsFromBackend() {
        var self = this;

        return new Promise(resolve => {
            if (self.isNewPortalFlow) {
                var preparedData = self.prepareCallbackData(self);

                resolve(preparedData);
            } else {
                var portalDefReq = PortalDefinitionRegistry.getPortalById(self.portalId);
                var requests = [];
                var groups = [];

                portalDefReq.then(portalDef => {
                    var actions = portalDef.actions;

                    actions.forEach(action => {
                        var group = action.groupName;
                        var option = OptionDefinitionRegistry.getPlatformOptionById(action.optionId, true);

                        requests.push(option);
                        groups.push(group);
                    });

                    Promise.all(requests).then((response, index) => {
                        response.forEach((optionDef, index) => {
                            var group = groups[index];

                            if (group) {
                                optionDef.group = group;
                            }

                            self.addToModel(optionDef);
                        });

                        var preparedData = self.prepareCallbackData(self, response);

                        resolve(preparedData);
                    });
                });
            }
        });
    }

    /**
     * Universal method to get permissions from backend
     */
    getPermissionsFromBackend() {
        var self = this;

        return new Promise(resolve => {
            if (self.isNewPortalFlow) {
                resolve();
            } else {
                var portalDefReq = PortalDefinitionRegistry.getPortalById(self.portalId);

                portalDefReq.then(portalDef => {
                    var permissions = portalDef.permissions;

                    if (permissions.length > 0) {
                        permissions.forEach(operator => {
                            this.AddToPermissionsModel(operator);

                            resolve();
                        });
                    } else {
                        resolve();
                    }

                });
            }
        });
    }

    /**
     * @private
     *
     * @param model
     */
    increasePositionNumber(model) {
        var index = 1;
        model.options.forEach(element => {
            element.elementIndex = index;
            index++;
        });
    }

    /**
     * Prepare data to pass through the flow
     *
     * @private
     *
     * @param options
     * @param response
     * @returns {*}
     */
    prepareCallbackData(options, response) {
        var index = 1;

        if (response) {
            response.forEach(element => {
                element.elementIndex = index;
                index++;
            });

            options.dataModel.options = response;
        }

        return options;
    }

}

export default ContentElementsPanel;
