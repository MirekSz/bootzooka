/**
 * Created by bstanislawski on 2016-03-22.
 */
import SidowEnums from '../../SidowEnums';

class WindowAreaController {

    /**
     * @param {WindowArea} windowArea
     */
    constructor(windowArea) {
        this.windowArea = windowArea;
    }

    activateDefaultComponent() {
        var defaultComponent = this.getDefaultComponent();

        defaultComponent.visibleChange(true);
        defaultComponent.activate();
    }

    /**
     * @returns {WindowContentBaseView} defaultComponent
     */
    getDefaultComponent() {
        var windowArea = this.windowArea;
        var defaultComponent;

        if (windowArea.contentVisualisationStyle === SidowEnums.VISUALISATION_STYLE.TABS) {
            windowArea.components.forEach(component => {
                if (component.defaultComponent) {
                    defaultComponent = component;
                }
            });

            if (!defaultComponent) {
                defaultComponent = windowArea.firstComponent;
            }
        }
        return defaultComponent;
    }

}

export default WindowAreaController;
