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


    renderLayout(target) {
        var viewContent = this.createContent();
        target.html(viewContent);
        this.target = target;
    }

    renderContent(component) {
        var idContent = this.getDOMElement(this.portal.id + '_content');
        component.renderTo(idContent);
    }


    /**
     *
     * @param {BaseComponent} action
     */
    renderAction(action) {
        var actionId = this.createActionId(action);
        this.currentActionIndex++;
        var target = this.getDOMElement(actionId);
        action.renderTo(target);
    }


    createContent() {
        var template = require('./portal_view.hbs');
        var viewModel = this.prepareViewModel();
        return template(viewModel);
    }

    /**
     *@private
     **/
    createActionId(component) {
        var location = BaseView.createLocationId(this.portal.id, component.id, this.currentActionIndex);
        this.componentsLocation.set(component.id, location);
        return location;
    }


    getComponentLocation(component) {
        return this.componentsLocation.get(component.id);
    }

    prepareViewModel() {
        var model = {};
        model.id = this.portal.id;
        model.actions = this.portal.getActions();
        return model;
    }

    /**
     *@protected
     */
    getDOMElement(id) {
        return $(`[id='${id}']`);
    }
}

export default PortalView;