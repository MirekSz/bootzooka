class BaseWindowManager {

    constructor(jquerySelectorToManage) {

        /**@type {jQuery} */
        this.$sectionToManage = $(jquerySelectorToManage);
        this.jquerySelectorToManage = jquerySelectorToManage;
    }

    init() {
    }

    /**
     * @param {BaseWindow}  window
     * @returns {BaseWindow}
     */
    show(window) {

    }

    dispose() {
        this.disposed = true;
        this.disposeImpl();
    }

    disposeImpl() {
    }

    visibleChange(value) {
        this.visible = value;
        this.visibleChangeImpl(value);
    }

    visibleChangeImpl(value) {
    }

}

export default BaseWindowManager;

