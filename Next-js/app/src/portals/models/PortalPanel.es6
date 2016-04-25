/**
 * Created by bartosz on 23.09.15.
 *
 * PortalPanel class
 */
import PanelElement from '../../designer/models/PanelElement';

class PortalPanel extends PanelElement {

    constructor(args) {
        if (args.dontShowFooterContainer === undefined) {
            args.dontShowFooterContainer = true;
        }

        super(args);
    }

}

export default PortalPanel;
