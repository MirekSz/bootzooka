import BaseRendering from '../../lib/rendering/BaseRendering';
import rendering from '../../lib/rendering/RenderingProperties';

class BaseWindow extends BaseRendering {

    constructor(id, options) {
        super();
        this.id = id;
        this.options = options || {};

        if (options) {
            if (!options.windowTitle) {
                this.options.windowTitle = id;
            }
        } else {
            this.options.windowTitle = id;
        }

        this.actions = new Map();
    }

    /**
     * @param {jQuery} $target
     */
    renderTo($target) {
        super.renderTo($target);
        this.renderActions();
    }

    showOn($target) {
        $target.addClass('beforeAnimation');
        this.renderTo($target);

        setTimeout(() => {
            $target.addClass('fadeIn');
            $target.removeClass('beforeAnimation');
        }, rendering.ANIMATION.ANIMATION_DELAY_SLOW);
    }

    dispose() {
        this.target.addClass('fadeOut');

        this.disposeActions();

        super.dispose();
        this.disposed = true;

        this.target.closest('.tab-content').find(`${this.id}_body`).find('.panel-region').html('');
        this.target.removeClass('fadeOut');
    }

    visibleChange(value) {
        this.visible = value;
        this.visibleChangeImpl(value);
    }

    visibleChangeImpl(value) {
    }

    init() {
    }

    close() {
        this.$closeButton.click();
    }

    renderActions() {
        var $target = this.footerTarget;
        var actions = this.actions;

        actions.forEach(action => {
            action.setWindowContext(window);
            action.renderTo($target);
        });
    }

    disposeActions() {
        var actions = this.actions;

        actions.forEach(action => {
            action.dispose();
        });
    }

}

export default BaseWindow;
