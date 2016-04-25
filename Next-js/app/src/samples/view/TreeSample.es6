"use strict";
/**
 * Created by Mirek on 2015-07-24.
 */

import ViewComponentDef from '../../componentsDefinitions/ViewComponentDef';
import SocketDef from '../../communication/SocketDef';
import ConnectionDef from '../../communication/ConnectionDef';

import componentsFactory from '../../components/ComponentsFactory';
import componentDefinitionRegistry from '../../componentsDefinitions/ComponentDefinitionRegistry';

import {IdInfosPublisher} from '../../lib/EventBus';
import _map from 'lodash/collection/map';
import _each from 'lodash/collection/each';

const ACTIVITY_TREE = 'pl.com.stream.verto.crm.plugin.activity-client.ActivityTreeView';
const SALE_REP_TREE = 'pl.com.stream.verto.cmm.plugin.sales-representative-client.SalesRepresentativeTreeTableView';
const ORG_UNIT_TREE = 'pl.com.stream.verto.cmm.plugin.organization-client.OrgUnitView';

function draw(viewId) {
    componentDefinitionRegistry.getViewById(ORG_UNIT_TREE).then((viewComponentDef)=> {
        var components = new Map();
        components.set(viewComponentDef.id, viewComponentDef);


        var componentsFactoryResult = componentsFactory.createComponents(components, []);

        var tree = componentsFactoryResult.getComponent(viewComponentDef.id);

        tree.renderTo($(viewId));

        tree.getOutputSocketByName('nodeId').addDynamicListener(function (data) {
            console.log('nodeId: ');
            console.log(data);
        });

        setTimeout(function () {
            var idName = 'ID_ORG_UNIT';
            var op = IdInfosPublisher.UPDATED;
            IdInfosPublisher.publish([{idName, id: 136182, op}]);
        }, 2000);

        setTimeout(function () {
            var idName = 'ID_ORG_UNIT';
            var op = IdInfosPublisher.DELETED;
            IdInfosPublisher.publish([{idName, id: 136182, op}]);
        }, 6000);

        setTimeout(function () {
            var idName = 'ID_ORG_UNIT';
            var op = IdInfosPublisher.ADDED;
            IdInfosPublisher.publish([{idName, id: 136182, op}]);
        }, 10000);

        setTimeout(function () {
            var idName = 'ID_ORG_UNIT';
            var op = IdInfosPublisher.MODIFIED;
            IdInfosPublisher.publish([{idName, op}]);
        }, 14000);

        setTimeout(function () {
            tree.dispose();
        }, 16000);

    });
}
export function showTree() {
    var viewId = '#workspace';
    draw(viewId);
    
//    setInterval(function () {
//        tree.dispose();
//        setTimeout(function () {
//            tree = draw(viewId);
//        }, 1000);
//
//    }, 3000);
}

