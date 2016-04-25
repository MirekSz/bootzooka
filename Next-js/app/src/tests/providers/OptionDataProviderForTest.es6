/**
 * Created by bartosz on 03.06.15.
 *
 * BeforeTestClass class
 */
import SocketDef from '../../communication/SocketDef';
import ViewComponentDef from '../../componentsDefinitions/ViewComponentDef';
import ActionComponentDef from '../../componentsDefinitions/ActionComponentDef';
import OptionDef from '../../compositeComponentsDefinitions/option/OptionDef';
import Types from '../../enums/ComponentsDefinitionsTypes';
import Globals from '../../enums/GlobalEnums';

class OptionDataProviderForTest {

    create() {
        const EDIT_ACTION_ID = 'CustomerEditAction';
        const SHOW_ACTION_ID = 'CustomeShowAction';
        const CUSTOMER_VIEW_ID = 'CustomerView';
        const CUSTOMER_PERSON_VIEW_ID = 'CustomerPersonView';

        const ACTION_SOCKET_ID = 'ID_BEAN';
        const VIEW_SOCKET_ID = 'ID_SELECTED_ROW';
        const ID_CUSTOMER_SOCKET_ID = 'ID_CUSTOMER';

        var optionDef = new OptionDef({id: 'IdOption', name: 'Kontrahenci'});

        var showActionDef = new ActionComponentDef(SHOW_ACTION_ID, Types.ACTIONS.TEST_ACTION);
        showActionDef.addInputSocketDef(new SocketDef(ACTION_SOCKET_ID, 'String'));

        var editActionDef = new ActionComponentDef(EDIT_ACTION_ID, Types.ACTIONS.TEST_ACTION);
        editActionDef.addInputSocketDef(new SocketDef(ACTION_SOCKET_ID, 'String'));

        optionDef.addActionDef(showActionDef.id, showActionDef);
        optionDef.addActionDef(editActionDef.id, editActionDef);

        var customerDefView = new ViewComponentDef(CUSTOMER_VIEW_ID);
        customerDefView.addOutputSocketDef(new SocketDef(VIEW_SOCKET_ID, 'String'));

        var customerPersonDefView = new ViewComponentDef(CUSTOMER_PERSON_VIEW_ID);
        customerPersonDefView.addOutputSocketDef(new SocketDef(VIEW_SOCKET_ID, 'String'));
        customerPersonDefView.addInputSocketDef(new SocketDef(ID_CUSTOMER_SOCKET_ID, 'String'));

        optionDef.addViewDef(customerDefView);
        optionDef.addViewDef(customerPersonDefView);


        optionDef.addConnectionDef(customerDefView.id, VIEW_SOCKET_ID, showActionDef.id, ACTION_SOCKET_ID);
        optionDef.addConnectionDef(customerDefView.id, VIEW_SOCKET_ID, editActionDef.id, ACTION_SOCKET_ID);
        optionDef.addConnectionDef(customerDefView.id, VIEW_SOCKET_ID, customerPersonDefView.id, ID_CUSTOMER_SOCKET_ID);


        return {
            optionDef: optionDef
        };
    }

}

export default new OptionDataProviderForTest();
