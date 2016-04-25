'use strict';
/* global sinon */
/* global expect */

import ViewColumnModel from '../../../components/views/ViewColumnModel';
import InMemorySearch from '../../../components/views/tree/InMemorySearch';
import TreeRowSelector from '../../../components/views/tree/TreeRowSelector';
import {NODE_ID,TYPE_ID} from '../../../components/views/tree/TreeComponentConsts';
import TreeDataModel from '../../../components/views/tree/TreeDataModel';
import ViewController from '../../../components/views/ViewController';
import DataProvider from '../../../dataProviders/DataProvider';
import {eventBus,IdInfosPublisher} from '../../../lib/EventBus';
import {wait} from '../../TestingTools';

const SOCKET_NAME = 'idNode';
const SOCKET_PARENT_NAME = 'idParentNode';
const NODE_TYPE_ID = 10;


function prepareTreeController(socketSend) {
    var selector = new TreeRowSelector({
        getOutputSocketByName: function () {
            return {send: socketSend};
        },
        def: {
            viewExtension: {
                linkNodeIdSelectedRowDataList: [{"nodeTypeId": NODE_TYPE_ID, "outSocketId": SOCKET_NAME}],
                linkParentNodeIdSelectedRowDataList: [{"nodeTypeId": 20, "outSocketId": SOCKET_PARENT_NAME}]
            }
        }
    });

    var controller = new ViewController({}, {}, selector);
    return controller;
}

class TreeComponentTest {

    run() {
        const SALE_REP_TREE = 'pl.com.stream.verto.cmm.salesrep.SalesRepresentativeTreeTableDataSourceProvider';
        describe('TreeComponentTest...', function () {


            describe('ViewColumnModel tests...', function () {

                it("should split columns into category", function (done) {
                    //given
                    var treeProvider = DataProvider.getTreeProvider(SALE_REP_TREE);
                    var treeDefinition = treeProvider.getDefinition();

                    //when
                    treeDefinition.then((def)=> {
                        var treeColumnModel = new ViewColumnModel(def);

                        expect(treeColumnModel.selectedColumns.length).to.be.eq(0);
                        expect(treeColumnModel.requiredColumns.length).to.be.gt(0);
                    }).then(done, done);
                });

                it("should return selected columns as sum of selected and required", function (done) {
                    //given
                    var treeProvider = DataProvider.getTreeProvider(SALE_REP_TREE);
                    var treeDefinition = treeProvider.getDefinition();

                    //when
                    treeDefinition.then((def)=> {
                        var treeColumnModel = new ViewColumnModel(def);

                        var selectedColumnsSize = treeColumnModel.selectedColumns.length;
                        var requiredColumnsSize = treeColumnModel.requiredColumns.length;

                        //then
                        expect(treeColumnModel.getSelectedColumns().length).to.be.eq(selectedColumnsSize + requiredColumnsSize);
                    }).then(done, done);
                });

                it("should return selected columns as sum of selected and required - selects two", function (done) {
                    //given
                    var treeProvider = DataProvider.getTreeProvider(SALE_REP_TREE);
                    var treeDefinition = treeProvider.getDefinition();

                    //when
                    treeDefinition.then((def)=> {
                        var treeColumnModel = new ViewColumnModel(def);
                        var ids = ['srv_PRINT_Sshould refresh data and refresh modelIGN', 'srv_ACTIVE'];
                        treeColumnModel.selectColumns(ids);

                        var selectedColumnsSize = treeColumnModel.selectedColumns.length;
                        var requiredColumnsSize = treeColumnModel.requiredColumns.length;

                        //then
                        expect(treeColumnModel.getSelectedColumns().length).to.be.eq(selectedColumnsSize + requiredColumnsSize);
                    }).then(done, done);
                });

                it("should get default sort order", function (done) {
                    //given
                    var treeProvider = DataProvider.getTreeProvider(SALE_REP_TREE);
                    var treeDefinition = treeProvider.getDefinition();

                    //when
                    treeDefinition.then((def)=> {
                        var treeColumnModel = new ViewColumnModel(def);

                        //then
                        expect(treeColumnModel.defaultOrder).to.not.be.empty;
                    }).then(done, done);
                });

                it("should remove dots from column id in idFix field", function (done) {
                    //given
                    var treeProvider = DataProvider.getTreeProvider(SALE_REP_TREE);
                    var treeDefinition = treeProvider.getDefinition();

                    //when
                    treeDefinition.then((def)=> {
                        var treeColumnModel = new ViewColumnModel(def);
                        var requiredColumn = treeColumnModel.requiredColumns[0];

                        //then
                        expect(requiredColumn.id).to.not.be.eq(requiredColumn.idFix);
                        expect(requiredColumn.idFix).to.not.be.contains('.');
                    }).then(done, done);
                });
            });

            describe('ViewController tests...', function () {
                it("on row select should send value through the socket", function () {
                    //given
                    var socket = sinon.stub();
                    var controller = prepareTreeController(socket);

                    //when
                    var row = {id: {TYPE_ID: NODE_TYPE_ID}};
                    controller.rowSelected(row);

                    //then
                    expect(socket.called).to.be.true;
                });


                it("on row select should send value through the socket and null for the rest of sockets", function () {
                    //given
                    const nodeId = 12;
                    var socketSend = sinon.stub();
                    var controller = prepareTreeController(socketSend);

                    //when
                    var row = {id: {NODE_ID: nodeId, TYPE_ID: NODE_TYPE_ID}};
                    controller.rowSelected(row);

                    //then
                    expect(socketSend.calledTwice).to.be.true;
                    expect(socketSend.calledWith(null)).to.be.true;
                });

            });


            describe('TreeDataModel tests...', function () {
                var sandbox;
                beforeEach(function (done) {
                    sandbox = sinon.sandbox.create();
                    done();
                });

                afterEach(function (done) {
                    sandbox.restore();
                    done();
                });

                it("should add idInfo listener", function (done) {
                    //given
                    var eventBusStub = sandbox.stub(eventBus, 'addListener');
                    var treeProvider = DataProvider.getTreeProvider(SALE_REP_TREE);
                    var treeDefinition = treeProvider.getDefinition();

                    //when
                    treeDefinition.then((def)=> {
                        var treeColumnModel = new ViewColumnModel(def);
                        new TreeDataModel(treeColumnModel, treeProvider, def);

                        //then
                        expect(eventBusStub.calledOnce).to.be.true;
                    }).then(done, done);
                });

                it("should fetch data", function (done) {
                    //given
                    var treeProvider = DataProvider.getTreeProvider(SALE_REP_TREE);
                    var treeDefinition = treeProvider.getDefinition();

                    //when
                    treeDefinition.then((def)=> {
                        var treeColumnModel = new ViewColumnModel(def);
                        var treeDataModel = new TreeDataModel(treeColumnModel, treeProvider, def);

                        treeDataModel.fetch({}).then((data)=> {
                            //then
                            expect(data).not.be.empty;
                        }).then(done, done);
                    });
                });

                it("should refresh data and refresh model", function (done) {
                    //given
                    var treeProvider = DataProvider.getTreeProvider(SALE_REP_TREE);
                    var treeDefinition = treeProvider.getDefinition();


                    treeDefinition.then((def)=> {
                        var treeColumnModel = new ViewColumnModel(def);
                        var treeDataModel = new TreeDataModel(treeColumnModel, treeProvider, def);

                        treeDataModel.fetch({}).then((data)=> {
                            var row1 = data[0];
                            var row2 = data[1];
                            var stub = sandbox.stub(treeDataModel, 'refreshCurrentData');

                            //when
                            treeDataModel.refresh([row1, row2]);

                            wait(()=> {
                                //then
                                expect(stub.calledOnce).to.be.true;
                            }, done);

                        });
                    });
                });

                it("should ignore not his id info data", function (done) {
                    //given
                    var treeProvider = DataProvider.getTreeProvider(SALE_REP_TREE);
                    var treeDefinition = treeProvider.getDefinition();


                    treeDefinition.then((def)=> {
                        var treeColumnModel = new ViewColumnModel(def);
                        var treeDataModel = new TreeDataModel(treeColumnModel, treeProvider, def);
                        var stub = sandbox.stub(treeDataModel, 'refreshCurrentData');

                        //when
                        treeDataModel.fireIdInfoChange([{
                            idName: 'ID_ORG_UNIT',
                            id: 128882,
                            op: IdInfosPublisher.ADDED
                        }]);

                        wait(()=> {
                            //then
                            expect(stub.notCalled).to.be.true;
                        }, done);

                    });
                });

                it("should not ignore his id info data", function (done) {
                    //given
                    var treeProvider = DataProvider.getTreeProvider(SALE_REP_TREE);
                    var treeDefinition = treeProvider.getDefinition();


                    treeDefinition.then((def)=> {
                        var treeColumnModel = new ViewColumnModel(def);
                        var treeDataModel = new TreeDataModel(treeColumnModel, treeProvider, def);
                        var stub = sandbox.stub(treeDataModel, 'refreshCurrentData');

                        //when
                        treeDataModel.fireIdInfoChange([{
                            idName: 'ID_SALES_REPRESENTATIVE',
                            id: 100120,
                            op: IdInfosPublisher.ADDED
                        }]);

                        wait(()=> {
                            //then
                            expect(stub.calledOnce).to.be.true;
                        }, done);

                    });
                });
                describe('refresh method should depends on id info operation...', function () {
                    it("delete should skip backend access", function (done) {
                        //given
                        var treeProvider = DataProvider.getTreeProvider(SALE_REP_TREE);
                        var treeDefinition = treeProvider.getDefinition();


                        treeDefinition.then((def)=> {
                            var treeColumnModel = new ViewColumnModel(def);
                            var treeDataModel = new TreeDataModel(treeColumnModel, treeProvider, def);
                            var refreshCurrentDataMethod = sandbox.stub(treeDataModel, 'refreshCurrentData');
                            var getRowsDataMethod = sandbox.stub(treeDataModel, 'getRowsData');

                            //when
                            treeDataModel.fireIdInfoChange([{
                                idName: 'ID_SALES_REPRESENTATIVE',
                                id: 128882,
                                op: IdInfosPublisher.DELETED
                            }]);

                            wait(()=> {
                                //then
                                expect(getRowsDataMethod.notCalled).to.be.true;
                                expect(refreshCurrentDataMethod.calledWith(sinon.match(function (value) {
                                    return value[0].op === IdInfosPublisher.DELETED;
                                }))).to.be.true;
                            }, done);

                        });
                    });
                    it("everything different that delete should access to backend", function (done) {
                        //given
                        var treeProvider = DataProvider.getTreeProvider(SALE_REP_TREE);
                        var treeDefinition = treeProvider.getDefinition();


                        treeDefinition.then((def)=> {
                            var treeColumnModel = new ViewColumnModel(def);
                            var treeDataModel = new TreeDataModel(treeColumnModel, treeProvider, def);
                            var refreshCurrentDataMethod = sandbox.stub(treeDataModel, 'refreshCurrentData');
                            var getRowsDataMethod = sandbox.spy(treeDataModel, 'getRowsData');

                            //when
                            treeDataModel.fireIdInfoChange([{
                                idName: 'ID_SALES_REPRESENTATIVE',
                                id: 128882,
                                op: IdInfosPublisher.DELETED
                            }, {
                                idName: 'ID_SALES_REPRESENTATIVE',
                                id: 100120,
                                op: IdInfosPublisher.UPDATED
                            }]);

                            wait(()=> {
                                //then
                                expect(getRowsDataMethod.calledOnce).to.be.true;
                                expect(refreshCurrentDataMethod.calledWith(sinon.match(function (value) {
                                    return value.length === 2;
                                }))).to.be.true;
                            }, done);
                        });
                    });
                    it("backend data should have operation info", function (done) {
                        //given
                        var treeProvider = DataProvider.getTreeProvider(SALE_REP_TREE);
                        var treeDefinition = treeProvider.getDefinition();


                        treeDefinition.then((def)=> {
                            var treeColumnModel = new ViewColumnModel(def);
                            var treeDataModel = new TreeDataModel(treeColumnModel, treeProvider, def);
                            var refreshCurrentDataMethod = sandbox.stub(treeDataModel, 'refreshCurrentData');
                            var getRowsDataMethod = sandbox.spy(treeDataModel, 'getRowsData');

                            //when
                            treeDataModel.fireIdInfoChange([{
                                idName: 'ID_SALES_REPRESENTATIVE',
                                id: 128882,
                                op: IdInfosPublisher.DELETED
                            }, {
                                idName: 'ID_SALES_REPRESENTATIVE',
                                id: 100120,
                                op: IdInfosPublisher.UPDATED
                            }]);

                            wait(()=> {
                                //then
                                expect(getRowsDataMethod.calledOnce).to.be.true;
                                expect(refreshCurrentDataMethod.calledWith(sinon.match(function (value) {
                                    return value[0].op && value[1].op;
                                }))).to.be.true;
                            }, done);
                        });
                    });


                });

            });

            describe('InMemorySearch tests...', function () {
                var root1 = {id: 1, name: 'Root1', parentId: null, childrenIds: []};
                var root2 = {id: 2, name: 'Root2', parentId: null, childrenIds: []};
                var root3 = {id: 3, name: 'Root3', parentId: null, childrenIds: []};

                var parent1 = {id: 11, name: 'Middle1', parentId: null, childrenIds: [21]};
                var parent2 = {id: 12, name: 'Middle2', parentId: null, childrenIds: [22]};
                var parent3 = {id: 13, name: 'Middle3', parentId: null, childrenIds: [23]};

                var child1 = {id: 21, name: 'Child1', parentId: 11, childrenIds: [31]};
                var child2 = {id: 22, name: 'Child2', parentId: 12, childrenIds: [32]};
                var child3 = {id: 23, name: 'Child3', parentId: 13, childrenIds: [33]};

                var grandChild1 = {id: 31, name: 'Child1', parentId: 21, childrenIds: []};
                var grandChild2 = {id: 32, name: 'Child2', parentId: 22, childrenIds: []};
                var grandChild3 = {id: 33, name: 'Child3', parentId: 23, childrenIds: []};

                var nodes = [root1, root2, root3, parent1, parent2, parent3, child1, child2, child3, grandChild1, grandChild2, grandChild3];

                it("should find one from root nodes without children", function () {
                    //given
                    var inMemorySearch = new InMemorySearch({});

                    //when
                    var result = inMemorySearch.searchInModel(root1.name, nodes);

                    //then
                    expect(result.length).to.be.eq(1);
                    expect(result).to.be.include(root1);
                });

                it("should find one from parents nodes with children and grandchildren", function () {
                    //given
                    var inMemorySearch = new InMemorySearch({});

                    //when
                    var result = inMemorySearch.searchInModel(parent1.name, nodes);

                    //then
                    expect(result.length).to.be.eq(3);
                    expect(result).to.be.include(parent1);
                    expect(result).to.be.include(child1);
                    expect(result).to.be.include(grandChild1);
                });

                it("should find one from children nodes with children and parents", function () {
                    //given
                    var inMemorySearch = new InMemorySearch({});

                    //when
                    var result = inMemorySearch.searchInModel(child1.name, nodes);

                    //then
                    expect(result.length).to.be.eq(3);
                    expect(result).to.be.include(child1);
                    expect(result).to.be.include(parent1);
                    expect(result).to.be.include(grandChild1);
                });
                it("should find one from grand children nodes with parents and parents of parents", function () {
                    //given
                    var inMemorySearch = new InMemorySearch({});

                    //when
                    var result = inMemorySearch.searchInModel(grandChild1.name, nodes);

                    //then
                    expect(result.length).to.be.eq(3);
                    expect(result).to.be.include(child1);
                    expect(result).to.be.include(parent1);
                    expect(result).to.be.include(grandChild1);
                });
            });
        });
    }
}

export default TreeComponentTest;