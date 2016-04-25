"use strict";
/**
 * Created by Mirek on 2015-07-27.
 */
import DataProvider from '../../dataProviders/DataProvider';
const ACTIVITY_TREE_ID = 'pl.com.stream.verto.crm.activity.ActivityTreeTableDataSourceProvider';
const SUBPROCESS_TREE_ID = 'pl.com.stream.verto.workflow.SubprocessTreeTableDataSourceProvider';

class TreeDataProviderTest {

    run(testDataProvider) {
        describe('Start TreeDataProviderTest...', function () {
            before(function () {
                this.timeout(4000);
            });
            describe('Start definition tests...', function () {
                it('should return TreeDataProvider', function () {
                    var treeProvider = DataProvider.getTreeProvider(ACTIVITY_TREE_ID);

                    expect(treeProvider).not.be.undefined;
                });

                it('should return definition', function (done) {
                    var treeProvider = DataProvider.getTreeProvider(ACTIVITY_TREE_ID);

                    treeProvider.getDefinition().then((data)=> {
                        expect(data).not.be.undefined;
                    }).then(done, done);

                });

                it('should return definition with columns def', function (done) {
                    var treeProvider = DataProvider.getTreeProvider(ACTIVITY_TREE_ID);
                    treeProvider.getDefinition().then((definition)=> {

                        expect(definition.getColumnsDef()).not.be.empty;
                        expect(definition.getColumnDef('ad.TYPE_NAME')).not.be.undefined;

                    }).then(done, done);

                });
            });

            describe('Start request data tests...', function () {
                it('should returns data', function (done) {
                    var treeProvider = DataProvider.getTreeProvider(ACTIVITY_TREE_ID);
                    treeProvider.getData().then((data)=> {
                        expect(data).not.be.undefined;
                    }).then(done, done);
                });

                it('should returns data with nodes', function (done) {
                    var treeProvider = DataProvider.getTreeProvider(ACTIVITY_TREE_ID);
                    treeProvider.getData().then((data)=> {
                        expect(data.nodes).not.be.empty;
                    }).then(done, done);
                });

                it('should create filter by id', function (done) {
                    var treeProvider = DataProvider.getTreeProvider(ACTIVITY_TREE_ID);
                    treeProvider.getData().then((data)=> {
                        var treeFilter = treeProvider.createTreeFilter('activityTree');

                        expect(treeFilter.value).to.be.undefined;
                    }).then(done, done);

                });
                it('filters should change result to smaller size', function (done) {
                    var treeProvider = DataProvider.getTreeProvider(SUBPROCESS_TREE_ID);
                    treeProvider.getDefinition().then(()=> {

                        var idProcessInstFilter = treeProvider.createTreeFilter('idProcessInst');
                        idProcessInstFilter.setValue(171702);

                        var columns = ["piv.ID_PROCESS_INST", "pdv.PROCESS_NAME"];

                        var filteredRequest = treeProvider.getData(columns, [idProcessInstFilter]);
                        var notFilteredRequest = treeProvider.getData(columns);

                        Promise.all([filteredRequest, notFilteredRequest]).then((treeDatas)=> {

                            expect(treeDatas[0].nodes).not.be.empty;
                            expect(treeDatas[1].nodes).not.be.empty;
                            expect(treeDatas[0].nodes.length).to.be.lt(treeDatas[1].nodes.length);

                        }).then(done, done);
                    });

                });
                describe('Start KendoUI strange requirements...', function () {
                    it('parentId should be null not undefined', function (done) {
                        var treeProvider = DataProvider.getTreeProvider(ACTIVITY_TREE_ID);
                        var treeDefinitions = treeProvider.getDefinition();
                        var treeDatas = treeProvider.getData();

                        Promise.all([treeDefinitions, treeDatas]).then((result)=> {
                            var nodes = result[1].nodes;
                            var asLiteral = nodes[0].asLiteral(result[0].columnsDef);
                            expect(asLiteral.parentId).to.be.eq(null);
                        }).then(done, done);
                    });
                });
            });
        });
    }

}

export default TreeDataProviderTest;