/**
 * Created by bstanislawski on 2016-03-30.
 */

import WindowContentBaseView from '../window/WindowContentBaseView';

import compositionFactory from '../../compositeComponents/CompositionFactory';
import optionDefinitionRegistry from '../../compositeComponentsDefinitions/OptionDefinitionRegistry';
import assertions from '../../lib/Assertions';

class OptionPanel extends WindowContentBaseView {

    /**
     * @param {String} id
     * @param {String} optionId
     * @param {WindowAreaContentExtraOptions} [options]
     */
    constructor(id, optionId, options) {
        super(id, options);

        this.optionId = optionId;

        /** @type {Option} */
        this.option = undefined;

        assertions.required(id, optionId);
    }

    activateImpl() {
        console.log('samilPanelView is active now..');
    }

    init() {
        var self = this;
        this.getDef().then(def => {
            self.definition = def;
        });
    }

    visibleChangeImpl(on) {
    }

    renderToImpl(target) {
        this.definition.then(optionDef => {
            let option = compositionFactory.createOption(optionDef);

            option.renderTo(target);
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
        return optionDefinitionRegistry.getPlatformOptionById('pl.com.stream.verto.cmm.plugin.operator-client.OperatorOption', true);
    }

}

export default OptionPanel;

