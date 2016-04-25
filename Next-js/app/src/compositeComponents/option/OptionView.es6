/**
 * Created by Mirek on 2015-06-19.
 */
import BaseView from '../BaseView';
import ActionViewWrapper from '../../components/actions/ActionViewWrapper';

class OptionView extends BaseView {

    /**
     *
     * @param {Option} option
     */
    constructor(option) {
        super();
        this.option = option;
        this.currentActionIndex = 0;
        this.currentViewIndex = 0;
        this.componentsLocation = new Map();
    }

    renderLayout(target) {
        var viewContent = this.createContent();
        target.html(viewContent);
    }

    /**
     * Method to render the action
     *
     * @param {BaseComponent} action
     * @param {jQuery} optionTarget - option target
     */
    renderAction(action, optionTarget) {
        var actionView = new ActionViewWrapper(action);
        var actionId = this.createActionId(action);
        this.currentActionIndex++;
        let target = super.getDOMElementFromContainer(optionTarget, actionId)

        actionView.inOptionId = actionId;

        actionView.renderTo(target);

        action.addListener(() => {
            actionView.reRender();
        });
    }

    /**
     * Method to render the view
     *
     * @param {BaseComponent} view
     * @param {jQuery} optionTarget - option target
     */
    renderView(view, optionTarget) {
        let viewId = this.createViewId(view);
        this.currentViewIndex++;

        let target = super.getDOMElementFromContainer(optionTarget, viewId);
        view.renderTo(target);
    }

    createContent() {
        var template = require('./option_view_template.hbs');
        var viewModel = this.prepareViewModel();
        return template(viewModel);
    }

    /**
     *@private
     **/
    createActionId(component) {
        var location = BaseView.createLocationId(this.option.id, component.id, this.currentActionIndex);
        this.componentsLocation.set(component.id, location);
        return location;
    }

    /**
     *@private
     **/
    createViewId(component) {
        var location = BaseView.createLocationId(this.option.id, component.id, this.currentViewIndex);
        this.componentsLocation.set(component.id, location);
        return location;
    }

    getComponentLocation(component) {
        return this.componentsLocation.get(component.id);
    }

    prepareViewModel() {
        var model = {};

        var nameArray = this.option.id.split('.');
        model.menuName = nameArray[nameArray.length - 1];

        model.id = this.option.id;
        model.name = this.option.optionDef.name;
        model.actions = this.option.getActions();
        model.views = this.option.getViews();
        return model;
    }

}

export default OptionView;
