/**
 * Created by bartosz on 23.09.15.
 *
 * Panel class
 */
import PanelElement from './PanelElement';

class FormPanel extends PanelElement {

    constructor(args) {
        if (args) {
            if (args.dontShowFooterContainer === undefined) {
                args.dontShowFooterContainer = true;
            }
        }

        super(args);

        this.portalId = args.portalId;
        this.callbackCancel = args.callbackCancel;
    }

}

export default FormPanel;