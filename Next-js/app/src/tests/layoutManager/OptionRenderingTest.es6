//import ViewComponentDef from '../../componentsDefinitions/ViewComponentDef';
//import Assertions from '../../lib/Assertions';
import ActionComponentDef from '../../componentsDefinitions/ActionComponentDef';
import ViewComponentDef from '../../componentsDefinitions/ViewComponentDef';
import CompositionFactory from '../../compositeComponents/TestCompositionFactory';
import SocketDef from '../../communication/SocketDef';
import OptionView from '../../compositeComponents/option/OptionView';
import Types from '../../enums/ComponentsDefinitionsTypes';
import OptionDef from '../../compositeComponentsDefinitions/OptionDef';
/**
 * Created by Mirek on 2015-06-06.
 */
class OptionRenderingTest {


    run() {

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

        optionDef.addActionDef(showActionDef);
        optionDef.addActionDef(editActionDef);

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
        describe('Start option tests', function () {
            var option;
            afterEach(function () {
                option.dispose();
                $("#workspace").empty();
            });
            describe('Start option  rendering tests', function () {
                    it("should render option", function () {
                        option = CompositionFactory.createOption(optionDef);

                        var target = $("#workspace");

                        option.renderTo(target);

                        expect(target.html()).to.be.contains(optionDef.id);
                        option.dispose();
                    });

                    it("should render actions of option", function () {
                        option = CompositionFactory.createOption(optionDef);

                        var target = $("#workspace");

                        option.renderTo(target);

                        expect(target.html()).to.be.contains(showActionDef.id);
                        expect(target.html()).to.be.contains(editActionDef.id);
                    });


                    it("should render views of option", function () {
                        option = CompositionFactory.createOption(optionDef);

                        var target = $("#workspace");

                        option.renderTo(target);

                        expect(target.html()).to.be.contains(customerDefView.id);
                        expect(target.html()).to.be.contains(customerPersonDefView.id);
                    });
                }
            );
            describe('Start option  communication tests', function () {
                it("should send value from customer view to showOption action", function () {
                    //given
                    option = CompositionFactory.createOption(optionDef);

                    var target = $("#workspace");

                    option.renderTo(target);

                    var customerView = option.getComponent(customerDefView.id);

                    //when
                    var socket = customerView.getOutputSocketByName(VIEW_SOCKET_ID);
                    var id = '1000321';
                    socket.send(id);

                    //then
                    var idShowAction = option.view.getComponentLocation(showActionDef);
                    console.log('idShowAction ' + idShowAction);
                    expect(socket.getLastEvent()).to.be.contains(id);
                });

                it("should send value from customer view to showOption action and edit action", function () {
                    //given
                    option = CompositionFactory.createOption(optionDef);

                    var target = $("#workspace");

                    option.renderTo(target);

                    var customerView = option.getComponent(customerDefView.id);

                    //when
                    var socket = customerView.getOutputSocketByName(VIEW_SOCKET_ID);
                    var id = '1000321';
                    socket.send(id);

                    //then
                    var idShowActionSocket = option.getComponent(showActionDef.id).getInputSocketByName(ACTION_SOCKET_ID);
                    var idEditActionSocket = option.getComponent(editActionDef.id).getInputSocketByName(ACTION_SOCKET_ID);
                    expect(idShowActionSocket.getLastEvent()).to.be.contains(id);
                    expect(idEditActionSocket.getLastEvent()).to.be.contains(id);
                });
            });

            describe('Start option  disposing tests', function () {
                it("should dispose option", function () {
                    //given
                    option = CompositionFactory.createOption(optionDef);

                    var target = $("#workspace");

                    option.renderTo(target);

                    //when
                    option.dispose();

                    //then
                    expect(target.html()).to.not.contains(optionDef.id);
                });

                it("should dispose options's actions", function () {
                    //given
                    option = CompositionFactory.createOption(optionDef);

                    var target = $("#workspace");

                    option.renderTo(target);

                    //when
                    option.dispose();

                    //then
                    expect(target.html()).not.be.contains(showActionDef.id);
                    expect(target.html()).not.be.contains(editActionDef.id);
                });

                //it("should dispose options's actions and their ui listeners", function () {
                //    //given
                //    option = CompositionFactory.createOption(optionDef);
                //
                //    var target = $("#workspace");
                //
                //    option.renderTo(target);
                //
                //    var showAction = option.getComponent(showActionDef.id);
                //
                //
                //    var selector = '#' + OptionView.createLocationId(option.id, showAction.id, 0);
                //    var refreshButton = $(target).find(selector).find('.refresh');
                //    var input = $(target).find(selector).find('textarea');
                //
                //    var value = 'some value';
                //    $(input).val(value);
                //
                //    refreshButton.click();
                //
                //    input = $(target).find(selector).find('textarea');
                //    refreshButton = $(target).find(selector).find('.refresh');
                //    expect(input.val()).to.be.eq('');
                //
                //    //when
                //    option.dispose();
                //
                //
                //    //then
                //    $(input).val(value);
                //
                //    refreshButton.click();
                //
                //    input = $(target).find(selector).find('textarea');
                //    expect($(input).val()).to.not.eq(undefined);
                //});

                it("should dispose options's views", function () {
                    //given
                    option = CompositionFactory.createOption(optionDef);

                    var target = $("#workspace");

                    option.renderTo(target);

                    //when
                    option.dispose();

                    //then
                    expect(target.html()).to.not.contains(customerDefView.id);
                    expect(target.html()).to.not.contains(customerPersonDefView.id);
                });
            });
        });
    }
}

export default OptionRenderingTest;
