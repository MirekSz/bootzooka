import BaseWindow from '../BaseWindow';
import compositionFactory from '../../../compositeComponents/CompositionFactory';
import optionDefinitionRegistry from '../../../compositeComponentsDefinitions/OptionDefinitionRegistry';
import {eventBus, events} from './../../../lib/EventBus';

class OptionWindow extends BaseWindow {

    /**
     * @param {String} id
     * @param {String} optionId
     * @param {WindowAreaContentExtraOptions} [options]
     */
    constructor(id, optionId, options) {
        super(id, options);

        this.optionId = optionId;
    }

    init() {
        var async = this.getDef().then(def => {
            this.definition = def;
        });

        return async;
    }

    visibleChangeImpl(on) {
    }

    /**
     * @param {jQuery} $target
     */
    renderToImpl($target) {
        let option = compositionFactory.createOption(this.definition);

        option.renderTo($target);

        this.option = option;
    }

    disposeImpl() {
        if (this.option) {
            this.option.dispose();
        }
    }

    /**
     * @private
     * @returns {Promise}
     */
    getDef() {
        return optionDefinitionRegistry.getPlatformOptionById(this.optionId, true);
    }

}

export default OptionWindow;
