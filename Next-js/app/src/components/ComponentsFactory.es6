/**
 * Created by bartosz on 20.05.15.
 *
 * Element Factory class
 */

'use strict';
import ComponentsFactoryResult from './ComponentsFactoryResult';
import ComponentFactoryRegistry from './ComponentFactoryRegistry';
import communicationFactory from '../communication/CommunicationFactory';
import ConnectionDef from '../communication/ConnectionDef';

class ComponentsFactory {
    /**
     * @param {Map} elementDefMap
     * @param {Array} connectionDefList
     * @return {ComponentsFactoryResult}
     */
    createComponents(elementDefMap, connectionDefList) {
        var result = new ComponentsFactoryResult();

        for (let [id, elementDef] of elementDefMap) {

            let component = this.createComponent(elementDef);
            component.setInOptionId(id);
            result.addComponent(id, component);
        }

        let connectionsDef = this.prepareConnectionDefFromRepeaters(elementDefMap);
        connectionsDef = connectionsDef.concat(connectionDefList);

        for (let i = 0; i < connectionsDef.length; i++) {
            let connectionDef = connectionsDef[i];

            try {
                let listener = this.createConnection(connectionDef, result);
                result.addConnection(connectionDef, listener);
            } catch (e) {
                console.error(e, connectionDef);
            }

        }
        return result;
    }

    /**
     *@private
     * @param {Map} elementDefMap
     **/
    prepareConnectionDefFromRepeaters(elementDefMap) {
        var connectionsDefList = [];
        for (let [id, elementDef] of elementDefMap) {

            let repeaterSocketDefList = elementDef.getRepeaterSocketDefList();
            for (let i = 0; i < repeaterSocketDefList.length; i++) {
                let repeater = repeaterSocketDefList[i];

                let connectionDef = new ConnectionDef(id, repeater.name, id, repeater.name);
                connectionDef.setInverted();
                connectionDef.fromRepeater = true;

                connectionsDefList.push(connectionDef);
            }

        }
        return connectionsDefList;
    }


    /**
     * @param {BaseRenderingComponent} componentDef
     * @param {Boolean} dontInit
     * @return {BaseRenderingComponent}
     */
    createComponent(componentDef, dontInit) {
        var elementDefClass = ComponentFactoryRegistry.getObjectClass(componentDef);
        var factory = ComponentFactoryRegistry.getFactoryFor(elementDefClass, componentDef.type);
        var component = factory.build(componentDef);

        if (!dontInit) {
            component.initialize();
        }

        return component;
    }

    /**
     *@private
     **/
    createConnection(connectionDef, componentProvider) {
        var inputId = connectionDef.getInputId();
        var inputComponent = componentProvider.getComponent(inputId);
        var inputSocketName = connectionDef.getInputSocketName();

        var outputId = connectionDef.getOutputId();
        var outputComponent = componentProvider.getComponent(outputId);
        var outputSocketName = connectionDef.getOutputSocketName();

        var inputSocket = inputComponent.getInputSocketByName(inputSocketName);
        var outputSocket = outputComponent.getOutputSocketByName(outputSocketName);
        var listener = communicationFactory.createConnection(inputSocket, outputSocket, connectionDef);
        return listener;
    }


}

export default new ComponentsFactory();
