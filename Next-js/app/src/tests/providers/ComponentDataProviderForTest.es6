/**
 * Created by bartosz on 03.06.15.
 *
 * BeforeTestClass class
 */
import SocketDef from '../../communication/SocketDef';
import ViewComponentDef from '../../componentsDefinitions/ViewComponentDef';
import ActionComponentDef from '../../componentsDefinitions/ActionComponentDef';
import Types from '../../enums/ComponentsDefinitionsTypes';
import Globals from '../../enums/GlobalEnums';

const ComponentDataProviderForTest = {

    create() {
        const ID_SELECT_ROW = 'IdSelectRow';
        const ID_SELECT_ROW_ACTION = 'IdSelectRowAction';
        const ID_TABLE_VIEW = 'IdTableView';

        let viewDef = new ViewComponentDef(ID_TABLE_VIEW);

        let selectRowSocket = new SocketDef(ID_SELECT_ROW, 'IdCustomer');
        viewDef.addOutputSocketDef(selectRowSocket);

        let actionDef = new ActionComponentDef(ID_SELECT_ROW_ACTION);

        let beanSocket = new SocketDef(Globals.ID_BEAN, 'IdCustomer');
        actionDef.addInputSocketDef(beanSocket);

        return {
            viewDef: viewDef,
            actionDef: actionDef
        };
    }

};

export default ComponentDataProviderForTest;
