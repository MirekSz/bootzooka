/**
 * Created by bartosz on 21.05.15.
 *
 * TableFactory class
 */
'use strict';

import WindowPanelComponent from './WindowPanelComponent';

const WindowPanelFactory = {
    /**
     * @param {PanelElementComponentDef} element
     */
    build(element) {
        return new WindowPanelComponent(element);
    }

};

export default WindowPanelFactory;
