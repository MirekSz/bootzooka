import ComponentDefinitionRegistry from '../../componentsDefinitions/ComponentDefinitionRegistry';
/**
 * Created by Mirek on 2015-06-06.
 */

const CUSTOMER_SHOW_ACTION_ID = 'pl.com.stream.verto.cmm.plugin.customer-client.CustomerShowAction'
const CUSTOMER_SHOW_ACTION_NAME = 'Pokaż kontrahenta';
const UNIT_VIEW_NAME = 'Jednostki miary';
const UNIT_VIEW_ID = 'pl.com.stream.verto.cmm.plugin.unit-client.UnitView';

class ComponentDefinitionRegistryTest {

    run() {
        describe('Start ComponentDefinitionRegistryTest tests...', function () {
            describe('Actions tests', function () {
                it("should get all action's definition", function (done) {
                    var actions = ComponentDefinitionRegistry.getActions();

                    actions.then(function (data) {
                        expect(data.length).not.be.empty;
                    }).then(done, done);

                    expect(actions).not.be.undefined;
                });

                it("should search actions by name", function (done) {
                    var actions = ComponentDefinitionRegistry.getActions(CUSTOMER_SHOW_ACTION_NAME);

                    actions.then(function (data) {
                        expect(data.length).to.be.eq(2);
                    }).then(done, done);
                    expect(actions).not.be.undefined;
                });

                it("should find action by id", function (done) {
                    var action = ComponentDefinitionRegistry.getActionById(CUSTOMER_SHOW_ACTION_ID);

                    action.then(function (data) {
                        expect(data.name).to.be.eq(CUSTOMER_SHOW_ACTION_NAME);
                    }).then(done, done);
                    expect(action).not.be.undefined;

                });
            });

            describe('Views tests', function () {
                it("should get all view's definition", function (done) {
                    var views = ComponentDefinitionRegistry.getViews();
                    views.then(function (data) {
                        expect(data.length).not.be.empty;
                    }).then(done, done);
                    expect(views).not.be.undefined;
                });

                it("should search views by name", function (done) {

                    var views = ComponentDefinitionRegistry.getViews(UNIT_VIEW_NAME);
                    views.then(function (data) {
                        expect(data.length).to.be.eq(1);
                    }).then(done, done);
                    expect(views).not.be.undefined;
                });

                it("should find view by id", function (done) {
                    var view = ComponentDefinitionRegistry.getViewById(UNIT_VIEW_ID);
                    view.then(function (data) {
                        expect(data.name).to.be.eq(UNIT_VIEW_NAME);
                    }).then(done, done);
                    expect(view).not.be.undefined;
                });
            });

        });
    }
}

export default ComponentDefinitionRegistryTest;
