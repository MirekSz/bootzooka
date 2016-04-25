/**
 * Created by bartosz on 21.05.15.
 *
 * TableFactory class
 */
'use strict';

import ModalWindowPanelComponent from './ModalWindowPanelComponent';

const ModalWindowPanelFactory = {
    /**
     * @param {PanelElementComponentDef} element
     */
    build(element) {
        return new ModalWindowPanelComponent(element);
    }

};

export default ModalWindowPanelFactory;
