import WindowManager from './../../windowManager/WindowManager';
import BaseWindow from '../window/../BaseWindow';

class ComposableWindow extends BaseWindow {

    constructor(id) {
        super(id);
    }

    /**
     * @param {jQuery} $target
     */
    renderToImpl($target) {
        this.createWorkingDiv($target);

        this.windowManager = new WindowManager(`#embedded_${this.id}`);
        this.windowManager.init();
    }

    /**
     * @param {jQuery} $target
     */
    createWorkingDiv($target) {
        $target.html(`<div id="embedded_${this.id}">Render to ${this.id}</div>`);
    }

    /**
     * @param {BaseWindow} window
     */
    show(window) {
        return this.windowManager.show(window);
    }

    disposeImpl() {
        this.windowManager.dispose();
    }

    /**
     * @param {Boolean} value
     */
    visibleChangeImpl(value) {
        this.windowManager.visibleChange(value);
    }

}

export default ComposableWindow;
