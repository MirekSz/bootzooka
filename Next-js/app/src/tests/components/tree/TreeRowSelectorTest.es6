"use strict";
/**
 * Created by Mirek on 2015-11-26.
 */
import {NODE_ID,TYPE_ID} from '../../../components/views/tree/TreeComponentConsts';
import TreeRowSelector from '../../../components/views/tree/TreeRowSelector';

const NODE_TYPE_ID = 10;
const PARENT_TYPE_ID = 20;

class TreeRowSelectorTest {

    run() {
        describe('TreeRowSelectorTest...', function () {
            var row = {
                id: {},
                parentId: {}
            };

            row.id[NODE_ID] = 1;
            row.id[TYPE_ID] = NODE_TYPE_ID;
            row.parentId[NODE_ID] = 2;
            row.parentId[TYPE_ID] = PARENT_TYPE_ID;

            it("should get target socket for row", function () {
                //given
                var socketProvider = {
                    def: {
                        viewExtension: {
                            linkNodeIdSelectedRowDataList: [{
                                nodeTypeId: NODE_TYPE_ID,
                                outSocketId: 'SOCKET'
                            }],
                            linkParentNodeIdSelectedRowDataList: [{
                                nodeTypeId: PARENT_TYPE_ID,
                                outSocketId: 'PARENT_SOCKET'
                            }]
                        }
                    }
                };
                var treeRowSelector = new TreeRowSelector(socketProvider);

                //when
                var targetSocket = treeRowSelector.getTargetSocket(NODE_TYPE_ID);

                //then
                expect(targetSocket).to.be.eq('SOCKET');
            });

            it("should get parent target socket for row", function () {
                //given
                var socketProvider = {
                    def: {
                        viewExtension: {
                            linkNodeIdSelectedRowDataList: [{
                                nodeTypeId: NODE_TYPE_ID,
                                outSocketId: 'SOCKET'
                            }],
                            linkParentNodeIdSelectedRowDataList: [{
                                nodeTypeId: PARENT_TYPE_ID,
                                outSocketId: 'PARENT_SOCKET'
                            }]
                        }
                    }
                };
                var treeRowSelector = new TreeRowSelector(socketProvider);

                //when
                var targetSocket = treeRowSelector.getParentTargetSocket(PARENT_TYPE_ID);

                //then
                expect(targetSocket).to.be.eq('PARENT_SOCKET');
            });

            it("should send socket whe row is select", function () {
                //given
                var socket = sinon.stub();
                var parentSocket = sinon.stub();
                var socketProvider = {
                    getOutputSocketByName: function () {
                        return {send: socket};
                    },
                    def: {
                        viewExtension: {
                            linkNodeIdSelectedRowDataList: [{
                                nodeTypeId: NODE_TYPE_ID,
                                outSocketId: 'SOCKET'
                            }],
                            linkParentNodeIdSelectedRowDataList: [{
                                nodeTypeId: PARENT_TYPE_ID,
                                outSocketId: 'PARENT_SOCKET'
                            }]
                        }
                    }
                };
                var treeRowSelector = new TreeRowSelector(socketProvider);

                //when
                treeRowSelector.selectRow(row);

                //then
                expect(socket.called).to.be.true
            });

            it("should send null value on rest of the sockets", function () {
                //given
                var socket = sinon.stub();
                var parentSocket = sinon.stub();
                var socketProvider = {
                    getOutputSocketByName: function (name) {
                        if ('SOCKET' == name) {
                            return {send: socket};
                        }
                        return {send: parentSocket};
                    },
                    def: {
                        viewExtension: {
                            linkNodeIdSelectedRowDataList: [{
                                nodeTypeId: NODE_TYPE_ID,
                                outSocketId: 'SOCKET'
                            }],
                            linkParentNodeIdSelectedRowDataList: [{
                                nodeTypeId: PARENT_TYPE_ID,
                                outSocketId: 'PARENT_SOCKET'
                            }]
                        }
                    }
                };
                var treeRowSelector = new TreeRowSelector(socketProvider);

                //when
                treeRowSelector.selectRow(row);

                //then
                expect(socket.called).to.be.true;
                expect(parentSocket.called).to.be.true;
            });
        });
    }
}
export default TreeRowSelectorTest;