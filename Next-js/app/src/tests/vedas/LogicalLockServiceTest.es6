// jshint ignore: start
"use strict";
/**
 * Created by Mirek on 2016-01-22.
 */
import DataSet from '../../vedas/dataSource/DataSet';
import {logicalLockService, FIND_TYPE, serverCacheService} from '../../vedas/LogicalLockService';
import {wait, asyncWait, ita} from '../TestingTools';

const customerService = 'pl.com.stream.verto.cmm.customer.server.pub.main.CustomerService';
const customerDto = 'pl.com.stream.verto.cmm.customer.server.pub.main.CustomerDto';
const operatorDto = 'pl.com.stream.verto.cmm.operator.server.pub.main.OperatorDto';
const ID = 100000;
class LogicalLockServiceTest {
    run() {
        describe('Start LogicalLockServiceTest...', function () {
                ita('should add logical lock', async() => {
                    //when
                    await logicalLockService.addLogicalLock(customerDto, ID, FIND_TYPE.FOR_EDIT);

                    //then
                    const logicalLocks = await serverCacheService.getLogicalLocks(customerDto, ID);
                    expect(logicalLocks.length).to.be.eq(1);
                });
                ita('should add another logical lock by the same user dont create another lock', async() => {
                    //when
                    await logicalLockService.addLogicalLock(customerDto, ID, FIND_TYPE.FOR_EDIT);
                    await logicalLockService.addLogicalLock(customerDto, ID, FIND_TYPE.FOR_EDIT);
                    await logicalLockService.addLogicalLock(customerDto, ID, FIND_TYPE.FOR_EDIT);

                    //then
                    const logicalLocks = await serverCacheService.getLogicalLocks(customerDto, ID);
                    expect(logicalLocks.length).to.be.eq(1);
                });
                ita('should add two logical locks', async() => {
                    //when
                    await logicalLockService.addLogicalLock(customerDto, ID, FIND_TYPE.FOR_EDIT);
                    await logicalLockService.addLogicalLock(operatorDto, ID, FIND_TYPE.FOR_EDIT);

                    //then
                    const logicalLocksForCustomer = await serverCacheService.getLogicalLocks(customerDto, ID);
                    const logicalLocksForOperator = await serverCacheService.getLogicalLocks(operatorDto, ID);

                    expect(logicalLocksForCustomer.length).to.be.eq(1);
                    expect(logicalLocksForOperator.length).to.be.eq(1);
                });
                ita('should remove logical lock', async() => {
                    //when
                    await logicalLockService.removeLogicalLock(customerDto, ID);

                    //then
                    const logicalLocks = await serverCacheService.getLogicalLocks(customerDto, ID);
                    expect(logicalLocks.length).to.be.eq(0);
                });

                ita('should remove two logical lock', async() => {
                    //given
                    await logicalLockService.addLogicalLock(customerDto, ID, FIND_TYPE.FOR_EDIT);
                    await logicalLockService.addLogicalLock(operatorDto, ID, FIND_TYPE.FOR_EDIT);

                    let logicalLocksForCustomer = await serverCacheService.getLogicalLocks(customerDto, ID);
                    let logicalLocksForOperator = await serverCacheService.getLogicalLocks(operatorDto, ID);

                    expect(logicalLocksForCustomer.length).to.be.eq(1);
                    expect(logicalLocksForOperator.length).to.be.eq(1);

                    //when
                    await logicalLockService.removeLogicalLock(customerDto, ID);
                    await logicalLockService.removeLogicalLock(operatorDto, ID);


                    //then
                    logicalLocksForCustomer = await serverCacheService.getLogicalLocks(customerDto, ID);
                    logicalLocksForOperator = await serverCacheService.getLogicalLocks(operatorDto, ID);

                    expect(logicalLocksForCustomer.length).to.be.eq(0);
                    expect(logicalLocksForOperator.length).to.be.eq(0);
                });
            }
        );
    }
}

export default LogicalLockServiceTest;

