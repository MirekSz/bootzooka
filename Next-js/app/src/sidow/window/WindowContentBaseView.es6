/**
 * Created by bstanislawski on 2016-03-15.
 */
import assertions from '../../lib/Assertions';

class WindowContentBaseView {

    /**
     * @param {String} id
     * @param {WindowAreaContentExtraOptions} options
     */
    constructor(id, options) {
        this.id = id;

        if (options) {
            this.icon = options.icon;
            this.name = options.name;
        } else {
            this.name = this.id.trim().replace(' ', '_');
        }

        /* component state parameters */
        this.isActivate = false;
        this.isRendered = false;
        this.isVisible = false;

        assertions.required(this.id);
    }

    setAsDefault() {
        this.defaultComponent = true;
    }

    init() {
        this.isInit = true;
        console.log('component has been initialized..');
    }

    /** There is a focus on that component */
    activate() {
        this.activateImpl();
        this.isActivate = true;
    }

    activateImpl() {
    }

    /** Component visibility has change */
    visibleChange(on) {
        if (on) {
            if (this.isVisible) {
                console.warn('component is already visible.');
            } else {
                if (!this.isRendered) {
                    this.visibleChangeImpl(true);
                    this.init();
                }

                this.isVisible = true;

                console.log('component is visible now..');
            }
        } else {
            if (this.isVisible) {
                this.visibleChangeImpl(false);

                this.isVisible = false;
                this.isActivate = false;

                console.log('component has been hide..');
            } else {
                console.warn('component is already hidden.');
            }
        }
    }

    visibleChangeImpl(status) {
    }

    renderTo(target) {
        this.renderToImpl(target);
        this.isRendered = true;
    }

    renderToImpl(target) {
    }

    dispose() {
        this.disposed = true;
        this.disposeImpl();
    }

    disposeImpl() {
    }
}

export default WindowContentBaseView;
