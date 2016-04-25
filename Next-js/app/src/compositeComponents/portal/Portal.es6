/**
 * Created by bartosz on 02.06.15.
 *
 * Portal class
 */
import BaseRendering from '../../lib/rendering/BaseRendering';
import PortalView from './PortalView';
import _each from 'lodash/collection/each';

class Portal extends BaseRendering {

    constructor(definition) {
        super();
        this.id = definition.id;
        this.type = definition.type;
        this.definition = definition;

        this.optionsMap = new Map();
        this.actionsMap = new Map();

        this.groupsMap = definition.groupsMap;

        this.currentOptionId;
    }

    renderToImpl(target, contentTarget) {
        this.view = new PortalView(this);
        this.view.renderGroupsLayout(target);
        this.view.renderLayout(target, contentTarget);

        _each(super.toArray(this.actionsMap.values()), (actionElem) => {
            this.view.renderAction(actionElem);
        });
    }

    showOption(option) {
        if (this.currentOptionId) {
            this.close(this.currentOptionId);
            this.currentOptionId = undefined;
        }
        this.currentOptionId = option.id;
        this.optionsMap.set(option.id, option);
        this.view.renderContent(option);
    }

    /**
     * @param {string} id
     * @param {PortalAction} action
     */
    addAction(id, action) {
        this.actionsMap.set(id, action);
    }

    /**
     * @returns {Array.<{PortalAction}>}
     */
    getActions() {
        return super.toArray(this.actionsMap.values());
    }

    getAction(actionId) {
        return this.actionsMap.get(actionId);
    }

    addOption(option) {
        this.optionsMap.set(option.id, option);
    }

    getOption(optionId) {
        return this.optionsMap.get(optionId);
    }

    close(id) {
        this.optionsMap.get(id).dispose();
        this.optionsMap.delete(id);
    }

    disposeImpl(target) {
        for (let value of this.optionsMap.values()) {
            value.dispose();
        }
        for (let value of this.actionsMap.values()) {
            value.dispose();
        }
    }

}

export default Portal;

