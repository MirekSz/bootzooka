/**
 * Created by Mirek on 2015-06-19.
 */
import BaseView from '../BaseView';

class PortalView extends BaseView {

    /**
     *
     * @param {Portal} portal
     */
    constructor(portal) {
        super();
        this.portal = portal;
        this.currentActionIndex = 0;
        this.componentsLocation = new Map();
    }

    renderLayout(target, contentTarget) {
        var self = this;
        var viewContent;
        var groupsMap = this.portal.groupsMap;
        var index = 0;

        if (groupsMap) {
            groupsMap.forEach(element => {
                var actionId = element.actionDefId;

                if (element.group) {
                    viewContent = this.createContent(actionId, index);

                    self.target = target.find('.' + element.group);
                    self.element = element;
                    self.insertElementInProperPlace(viewContent);

                    index++;
                } else {
                    viewContent = this.createContent(actionId, index);

                    self.target = target;
                    self.element = element;
                    //self.insertElementInProperPlace(viewContent);

                    self.target.append(viewContent);
                    self.showAction(actionId, index);

                    index++;
                }
            });
        }

        this.contentTarget = contentTarget;
        this.addPortalContentContainer(this);
    }

    showAction(id, index) {
        var portalId = this.formatPortalId(this.portal.id);
        var $action = super.getDOMElement(portalId + '_' + id + '_' + index);
        $action = $action.closest('li');

        $action.removeClass('subOption');
        $action.removeClass('fadeOut');
    }

    renderGroupsLayout(target) {
        var groupContent = this.createGroupContent();
        var viewContent = groupContent.snippet;
        var model = groupContent.model;

        target.append(viewContent);
        this.target = target;

        this.addGroupActionHandling(model, target);
    }

    renderContent(component) {
        var portalId = this.formatPortalId(this.portal.id);
        var idContent = super.getDOMElement(`${portalId}_content`);
        component.renderTo(idContent);
    }

    /**
     * @param {PortalAction} action
     */
    renderAction(action) {
        let actionId = this.createActionId(action);
        this.currentActionIndex++;
        let target = super.getDOMElement(actionId);
        action.renderTo(target);
    }

    createContent(actionId, index) {
        var template = require('./portal_view.hbs');
        var viewModel = this.prepareViewModel(actionId, index);
        return template(viewModel);
    }

    createGroupContent() {
        var template = require('./portal_action_group.hbs');
        var viewModel = this.prepareGroupModel();
        var snippet = template(viewModel);

        return {snippet: snippet, model: viewModel};
    }

    /**
     *@private
     **/
    createActionId(component) {
        var portalId = this.formatPortalId(this.portal.id);
        var location = BaseView.createLocationId(portalId, component.id, this.currentActionIndex);
        this.componentsLocation.set(component.id, location);
        return location;
    }

    getComponentLocation(component) {
        return this.componentsLocation.get(component.id);
    }

    prepareViewModel(actionId, index) {
        var model = [];

        model.portalId = this.formatPortalId(this.portal.id);
        model.action = this.portal.getAction(actionId);
        model.index = index;

        return model;
    }

    formatPortalId(portalId) {
        portalId = portalId.trim();

        this.portal.id = portalId.replace(' ', '_');

        return this.portal.id;
    }

    prepareGroupModel() {
        var model = {
            groups: []
        };

        this.portal.groupsMap.forEach(element => {
            if (element.group !== null) {
                if (model.groups.length > 0) {
                    var alreadyAdded = false;

                    model.groups.forEach(alreadyAddedGroup => {
                        if (alreadyAddedGroup.id === element.group) {
                            alreadyAdded = true;
                        }
                    });

                    if (!alreadyAdded) {
                        model.groups.push({id: element.group});
                    }
                } else {
                    model.groups.push({id: element.group});
                }
            }
        });

        return this.sortAlphabetical(model);
    }

    addPortalContentContainer(portalView) {
        var contentContainer = portalView.contentTarget;
        var id = portalView.formatPortalId(portalView.portal.id);

        contentContainer.html('<div id="' + id + '_content" class="row"></div>');
    }

    addGroupActionHandling(model, target) {
        var self = this;

        model.groups.forEach(element => {
            var elementId = element.id;
            var id = '#group_' + elementId;
            var $group = $(target).find(id);

            //$group.click(e => {
            //    self.showHideGroup($group, elementId);
            //});

            $group.on({
                'show.bs.dropdown': e => {
                    self.showHideGroup($group, elementId);
                },
                'hide.bs.dropdown': e => {
                    self.showHideGroup($group, elementId);
                }
            });
        });
    }

    /**
     * @private
     *
     * @param liGroupElement
     */
    showHideGroup(liGroupElement, elementGroup) {
        //var sidebar = liGroupElement.parent();
        //var options = sidebar.find('.option-element');
        //
        //options.each((i, option) => {
        //    option = $(option);
        //
        //    if (option.attr('group') === elementGroup) {
        //        this.toggleVisibility(option);
        //    }
        //});

        liGroupElement.toggleClass('expanded');

        var groupArrow = liGroupElement.find('.group-arrow');
        var groupIcon = liGroupElement.find('.group-icon');

        if (liGroupElement.hasClass('expanded')) {
            groupArrow.removeClass('glyphicon-chevron-up');
            groupArrow.addClass('glyphicon-chevron-down');

            groupIcon.removeClass('fa-folder-o');
            groupIcon.addClass('fa-folder-open-o');
        } else {
            groupArrow.addClass('glyphicon-chevron-up');
            groupArrow.removeClass('glyphicon-chevron-down');

            groupIcon.addClass('fa-folder-o');
            groupIcon.removeClass('fa-folder-open-o');
        }
    }

    /**
     * @private
     *
     * @param element
     */
    toggleVisibility(element) {
        if (element.hasClass('fadeOut')) {
            element.removeClass('fadeOut');
            //element.fadeIn("slow");
        } else {
            element.addClass('fadeOut');
            //element.fadeOut("slow");
        }
    }

    /**
     * @private
     *
     * @param model
     */
    sortAlphabetical(model) {
        var arrayToSort = [];
        var result = {
            groups: []
        };

        model.groups.forEach(group => {
            arrayToSort.push(group.id);
        });

        arrayToSort.sort();

        arrayToSort.forEach(element => {
            result.groups.push({id: element});
        });

        return result;
    }

    /**
     * Sort alphabetical and render to proper place
     *
     * @private
     *
     * @param self
     * @param viewContent
     */
    insertElementInProperPlace(viewContent) {
        var self = this;
        var elementAlreadyAdded = false;
        var elements = this.getElementsByGroup();
        var selfGroupElements = elements.selfGroupElements;
        var elementWithoutGroup = elements.elementsWithoutGroup;
        var selfId = this.element.actionDefId;

        if (selfGroupElements.length) {
            selfGroupElements.forEach(groupElement => {
                var groupElementId = groupElement.attr('name');

                if (groupElementId < selfId) {
                    elementAlreadyAdded = true;
                    return $(viewContent).insertAfter(groupElement);
                }

                if (elementAlreadyAdded) {
                    var lastElement = selfGroupElements[selfGroupElements.length - 1];
                    return $(viewContent).insertAfter(lastElement);
                }
            });
            //} else if (elementWithoutGroup.length) {
            //    elementWithoutGroup.forEach(freeElement => {
            //        var freeElementId = freeElement.attr('name');
            //
            //        if (freeElementId < selfId) {
            //            elementAlreadyAdded = true;
            //            return $(viewContent).insertAfter(freeElement);
            //        }
            //
            //        if (elementAlreadyAdded) {
            //            var lastElement = selfGroupElements[selfGroupElements.length - 1];
            //            return $(viewContent).insertAfter(lastElement);
            //        }
            //    });
        } else {
            if (this.element.group) {
                self.target.find('ul').append(viewContent);
            } else {
                self.target.append(viewContent);
            }

        }
    }

    /**
     * Get all elements with similar group to mine
     *
     * @private
     *
     * @returns {Object}
     */
    getElementsByGroup() {
        var self = this;
        var children = self.target.closest('ul').find('li.standard-element');
        var selfGroupElements = [];
        var elementsWithoutGroup = [];

        children.each((i, el) => {
            var element = $(el);
            var childGroup = element.attr('group');
            var selfGroup = $(self.target).find('div').attr('id');

            if (element.hasClass('option-element')) {
                if (childGroup === selfGroup) {
                    selfGroupElements.push(element);
                } else if (childGroup === '') {
                    elementsWithoutGroup.push(element);
                }
            }
        });

        return {
            selfGroupElements: selfGroupElements,
            elementsWithoutGroup: elementsWithoutGroup
        };
    }

}

export default PortalView;
