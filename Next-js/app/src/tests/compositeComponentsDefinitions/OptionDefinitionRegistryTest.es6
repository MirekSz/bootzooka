/**
 * Created by Mirek on 2015-06-06.
 */
import OptionDefinitionRegistry from '../../compositeComponentsDefinitions/OptionDefinitionRegistry';
import OptionDef from '../../compositeComponentsDefinitions/OptionDef';
import GlobalEnums from '../../enums/GlobalEnums';

const UNIT_OPTION_ID = 'pl.com.stream.verto.cmm.plugin.unit-client.UnitOption';
const UNIT_SHOW_ACTION = 'pl.com.stream.verto.cmm.plugin.unit-client.UnitShowAction';

class OptionDefinitionRegistryTest {

    run() {
        describe('Start OptionDefinitionRegistryTest tests', function () {
            describe('Platform option registry tests', function () {
                it("should get option definition  by id", function (done) {
                    var optionDef = OptionDefinitionRegistry.getPlatformOptionById(UNIT_OPTION_ID);

                    optionDef.then(function (data) {
                        expect(data.id).to.be.eq(UNIT_OPTION_ID);
                    }).then(done, done);

                    expect(optionDef).not.be.undefined;
                });

                it("option should contains actions", function (done) {
                    var optionDef = OptionDefinitionRegistry.getPlatformOptionById(UNIT_OPTION_ID, true);

                    optionDef.then(function (data) {
                        const componentDef = data.getActionDefList()[0];

                        expect(componentDef.id).not.be.undefined;
                        expect(componentDef.name).not.be.undefined;

                    }).then(done, done);
                    expect(optionDef).not.be.undefined;
                });

                it("option's action should contains sockets", function (done) {
                    var optionDef = OptionDefinitionRegistry.getPlatformOptionById(UNIT_OPTION_ID, true);

                    optionDef.then(function (data) {
                        var actionId = 'pl.com.stream.verto.cmm.plugin.unit-client.UnitEditAction';
                        const componentDef = data.getActionDef(actionId);

                        expect(componentDef.inputSocketDefList.length).not.be.empty;
                        expect(componentDef.outputSocketDefList.length).not.be.empty;
                        expect(componentDef.repeaterSocketDefList.length).not.be.empty;

                    }).then(done, done);
                    expect(optionDef).not.be.undefined;
                });

                it("option should contains views", function (done) {
                    var optionDef = OptionDefinitionRegistry.getPlatformOptionById(UNIT_OPTION_ID, true);

                    optionDef.then(function (data) {

                        const componentDef = data.getViewDefList()[0];
                        expect(componentDef.id).not.be.undefined;
                        expect(componentDef.name).not.be.undefined;

                    }).then(done, done);
                    expect(optionDef).not.be.undefined;
                });


                it("option should contains connections", function (done) {
                    var optionDef = OptionDefinitionRegistry.getPlatformOptionById(UNIT_OPTION_ID, true);

                    optionDef.then(function (data) {

                        const connections = data.getConnectionsDefList();
                        expect(connections.length).not.be.empty;

                    }).then(done, done);
                    expect(optionDef).not.be.undefined;
                });

                it("option should contains connections with ID_BEAN required socket", function (done) {
                    var optionDef = OptionDefinitionRegistry.getPlatformOptionById(UNIT_OPTION_ID, true);

                    optionDef.then(function (data) {
                        var actionDef = data.getActionDef(UNIT_SHOW_ACTION);
                        var socketDef = actionDef.getRepeaterSocketDefByName(GlobalEnums.ID_BEAN);

                        expect(socketDef.required).to.be.true;
                    }).then(done, done);
                    expect(optionDef).not.be.undefined;
                });

            });
            describe('Local InteliUI option registry tests...', function () {
                var optionDef = new OptionDef({id: 'IdOption', name: 'Kontrahenci'});

                it("should add new option def", function (done) {
                    //when
                    var adding = OptionDefinitionRegistry.add(optionDef);

                    //then
                    adding.then(()=> {
                        expect(OptionDefinitionRegistry.optionsCache.size).to.be.eq(1);
                    }).then(done, done);
                });

                it("should find option def", function (done) {
                    //given
                    var adding = OptionDefinitionRegistry.add(optionDef);

                    //when
                    var found = adding.then(()=> {
                        return OptionDefinitionRegistry.find(optionDef.id);
                    });

                    //then
                    found.then((data)=> {
                        expect(data).to.be.eq(optionDef);
                    }).then(done, done);

                });

                it("should find option def with fallback to platform", function (done) {
                    //given
                    const UNIT_OPTION_ID = 'pl.com.stream.verto.cmm.plugin.unit-client.UnitOption';

                    //when
                    var found = OptionDefinitionRegistry.find(UNIT_OPTION_ID);

                    //then

                    found.then((data)=> {
                        expect(data).to.not.be.undefined;
                    }).then(done, done);
                });


                it("should update option def", function (done) {
                    //given
                    var adding = OptionDefinitionRegistry.add(optionDef);

                    //when
                    var newOptionDefData = {
                        id: optionDef.id,
                        name: 'Dokumenty',
                        actionsDefMap: new Map(),
                        viewsDefMap: new Map(),
                        connectionsDefList: []
                    };

                    var updating = adding.then(()=> {
                        return OptionDefinitionRegistry.update(newOptionDefData);
                    });

                    //then
                    OptionDefinitionRegistry.optionsCache.clear();
                    var found = updating.then(()=> {
                        return OptionDefinitionRegistry.find(newOptionDefData.id);
                    });

                    found.then((data)=> {
                        expect(data.name).to.be.eq(newOptionDefData.name);
                        expect(data.contentSpacing).to.be.eq(newOptionDefData.contentSpacing);
                        expect(data.contentEditorSpacing).to.be.eq(newOptionDefData.contentEditorSpacing);
                    }).then(done, done);
                });

                it("should delete option def", function (done) {
                    //given
                    var adding = OptionDefinitionRegistry.add(optionDef);

                    //when
                    var removing = adding.then(()=> {
                        return OptionDefinitionRegistry.remove(optionDef.id);
                    });

                    //then
                    var found = removing.then(()=> {
                        return OptionDefinitionRegistry.find(optionDef.id);
                    });

                    found.then(undefined, (error)=> {
                        var NOT_FOUND = 404;
                        expect(error.status).to.not.be.eq(200);
                    }).then(done, done);

                });
                afterEach(function cleaning() {
                    OptionDefinitionRegistry.remove(optionDef.id);
                });
            });
        });
    }
}

export default OptionDefinitionRegistryTest;
