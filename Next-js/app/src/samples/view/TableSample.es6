"use strict";
/**
 * Created by Mirek on 2015-09-16.
 */
import componentsDefinitionsTypes from '../../enums/ComponentsDefinitionsTypes';
import componentsFactory from '../../components/ComponentsFactory';
import componentDefinitionRegistry from '../../componentsDefinitions/ComponentDefinitionRegistry';
import {IdInfosPublisher} from '../../lib/EventBus';

const ACTIVITY_TREE = 'pl.com.stream.verto.crm.plugin.activity-client.ActivityTreeView';
const SALE_REP_TREE = 'pl.com.stream.verto.cmm.plugin.sales-representative-client.SalesRepresentativeTreeTableView';
const ORG_UNIT_TREE = 'pl.com.stream.verto.cmm.plugin.organization-client.OrgUnitView';


export function showTable() {
    var viewId = '#workspace';

    componentDefinitionRegistry.getViewById(ORG_UNIT_TREE).then((viewComponentDef)=> {

        var components = new Map();
        viewComponentDef.type = componentsDefinitionsTypes.VIEWS.KENDO_TABLE;
        components.set(viewComponentDef.id, viewComponentDef);


        let connectionDefList = [];
        let componentsFactoryResult = componentsFactory.createComponents(components, connectionDefList);
        let table = componentsFactoryResult.getComponent(viewComponentDef.id);

        table.renderTo($(viewId));
    });

    setTimeout(function () {
        var idName = 'ID_ORG_UNIT';
        var op = IdInfosPublisher.UPDATED;
        IdInfosPublisher.publish([{idName, id: 128882, op}]);
    }, 1000);

    setTimeout(function () {
        var idName = 'ID_ORG_UNIT';
        var op = IdInfosPublisher.UPDATED;
        IdInfosPublisher.publish([{idName, id: 128882, op}, {idName, id: 123482, op}]);
    }, 3000);

    setTimeout(function () {
        $('input.searcher').val('miro').keyup();
    }, 5000);

    setTimeout(function () {
        $("a:contains('2')").click();
    }, 7000);

    setTimeout(function () {
        $("a:contains('1')").click();
    }, 9000);
}
