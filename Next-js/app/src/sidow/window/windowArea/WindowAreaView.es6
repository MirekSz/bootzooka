/**
 * Created by bstanislawski on 2016-03-07.
 */
class WindowAreaView {

    /**
     * @param {WindowArea} window
     */
    constructor(window) {
        this.windowArea = window;
    }

    renderLayout() {
        var template = this.windowArea.template;
        var model = this.createModel();
        var htmlElement = template(model);

        this.windowArea.target.html(htmlElement);
    }

    renderContent() {
        var content = this.windowArea.getContent();

        content.forEach((element, index) => {
            if (element.isVisible) {
                let target = this.getTarget(element, index);
                let $target = this.windowArea.target.find(target);

                element.renderTo($target);
            }
        });
    }

    /**
     * @param {WindowContentBaseView} element
     * @param {Number} index
     * @returns {string}
     */
    getTarget(element, index) {
        return `#${this.windowArea.id}_${element.id}_${index}`;
    }

    /**
     * Handle the mouse click on the tab
     *
     * @param event
     */
    handleClickOnTab(event) {
        var targetId = $(event.target).closest('a').attr('href');
        var targetElement = this.getTargetElement(targetId);

        this.switchViews(targetElement, targetId);
    }

    /**
     * @param {WindowContentBaseView} element
     * @param {String} [target]
     */
    switchViews(element, target) {
        var visibleComponents = this.windowArea.getVisibleComponents();

        if (!visibleComponents.has(element.id)) {
            this.hideAllVisibleComponents();

            element.activate();
            element.visibleChange(true);

            if (!element.isRendered) {
                element.renderTo(target);
            }
        }
    }

    /**
     * @private
     *
     * @param {String} targetId
     * @returns {WindowContentBaseView}
     */
    getTargetElement(targetId) {
        var id = this.windowArea.extractElementId(targetId);
        return this.windowArea.components.get(id);
    }

    /**
     * @private
     */
    hideAllVisibleComponents() {
        var components = this.windowArea.getContent();

        components.forEach(component => {
            if (component.isVisible) {
                component.visibleChange(false);
            }
        });
    }

    /**
     * @private
     *
     * @return {Object} model
     */
    createModel() {
        var model = {};

        model.id = this.windowArea.id;
        model.components = this.windowArea.getContent();

        return model;
    }

}

export default WindowAreaView;
