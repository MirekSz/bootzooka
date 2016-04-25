import BaseWindow from '../BaseWindow';
import componentsDefinitionsTypes from '../../../enums/ComponentsDefinitionsTypes';
import componentsFactory from '../../../components/ComponentsFactory';
import componentDefinitionRegistry from '../../../componentsDefinitions/ComponentDefinitionRegistry';
import assertions from '../../../lib/Assertions';
import {eventBus, events} from './../../../lib/EventBus';

class TableWindow extends BaseWindow {

    /**
     * @param {String} id
     * @param {String} viewComponentId
     * @param {WindowAreaContentExtraOptions} [options]
     */
    constructor(id, viewComponentId, options) {
        super(id, options);

        this.viewComponentId = viewComponentId;

        /** @type {KendoTable} */
        this.component = undefined;

        assertions.required(id, viewComponentId);
    }

    init() {
        this.definition = this.getDef();
    }

    visibleChangeImpl(on) {
    }

    /**
     * @param {jQuery} $target
     */
    renderToImpl($target) {
        this.definition.then(viewComponentDef => {
            // var viewComponentDef = this.definition;
            var components = new Map();

            viewComponentDef.type = componentsDefinitionsTypes.VIEWS.KENDO_TABLE;
            components.set(viewComponentDef.id, viewComponentDef);

            let connectionDefList = [];
            let componentsFactoryResult = componentsFactory.createComponents(components, connectionDefList);

            this.component = componentsFactoryResult.getComponent(viewComponentDef.id);

            this.component.renderTo($target);
        });
    }

    disposeImpl() {
        this.component.dispose();
    }


    /**
     * @private
     * @returns {Promise}
     */
    getDef() {
        return new Promise(resolve => {
            componentDefinitionRegistry.getViewById(this.viewComponentId).then((viewComponentDef)=> {
                return resolve(viewComponentDef);
            });
        });
    }

}

export default TableWindow;
